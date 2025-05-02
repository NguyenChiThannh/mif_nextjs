"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAppSelector } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { formatDateOrTimeAgo } from "@/lib/formatter";
import { chatApi } from "@/services/chatApi";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

// Separate MessageItem component for better performance
const MessageItem = React.memo(({ message }) => {
  const avatarComponent = useMemo(
    () => (
      <Avatar className="w-8 h-8">
        <AvatarImage
          src={message.avatar}
          alt={message.senderName}
          className="object-cover"
        />
        <AvatarFallback>{message.senderName[0]}</AvatarFallback>
      </Avatar>
    ),
    [message.avatar, message.senderName]
  );

  return (
    <div className="flex items-start gap-3">
      {avatarComponent}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold">{message.senderName}</span>
          <span className="text-xs text-muted-foreground">
            {formatDateOrTimeAgo(message.createAt)}
          </span>
        </div>
        <p className="text-sm">{message.content}</p>
      </div>
    </div>
  );
});

MessageItem.displayName = "MessageItem";

// Separate MessagesList component to prevent unnecessary re-renders
const MessagesList = React.memo(
  ({ messages, observerElem, isFetchingNextPage }) => {
    return (
      <>
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        <div ref={observerElem} className="h-4" />
        {isFetchingNextPage && (
          <div className="text-center text-muted-foreground">
            Loading more messages...
          </div>
        )}
      </>
    );
  }
);

MessagesList.displayName = "MessagesList";

export default function ChatWindow({ groupId }) {
  const authState = useAppSelector((state) => state.auth.authState);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const prevGroupIdRef = useRef(groupId);

  // Load initial messages
  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = chatApi.query.useGetGroupMessages(groupId);

  // Setup infinite scroll
  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

  // WebSocket connection for real-time updates
  const { isConnected, client, subscribeToTopics, unsubscribeFromTopics } =
    useWebSocket(
      authState.accessToken,
      groupId ? `/topic/group/${groupId}` : null,
      (newMessage) => {
        console.log("New message received:", newMessage);
        setMessages((prev) => {
          // Check if message already exists
          if (prev.some((msg) => msg.id === newMessage.id)) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }
    );

  // Reset messages when group changes
  useEffect(() => {
    if (prevGroupIdRef.current !== groupId) {
      setMessages([]);
      setIsInitialLoad(true);
      prevGroupIdRef.current = groupId;
    }
  }, [groupId]);

  // Subscribe to all groups when component mounts
  useEffect(() => {
    if (groupId) {
      subscribeToTopics([`/topic/group/${groupId}`]);
    }

    return () => {
      if (groupId) {
        unsubscribeFromTopics([`/topic/group/${groupId}`]);
      }
    };
  }, [groupId, subscribeToTopics, unsubscribeFromTopics]);

  // Combine paginated messages with real-time messages
  useEffect(() => {
    if (messagePages?.pages) {
      const allMessages = messagePages.pages.reduce((acc, page) => {
        if (page?.content) {
          return [...acc, ...page.content];
        }
        return acc;
      }, []);

      // Sort messages by createAt timestamp
      const sortedMessages = allMessages.sort(
        (a, b) => new Date(a.createAt) - new Date(b.createAt)
      );

      setMessages(sortedMessages);
      setIsInitialLoad(false);
    }
  }, [messagePages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isInitialLoad) {
      scrollToBottom();
    }
  }, [messages, isInitialLoad]);

  const handleSendMessage = () => {
    if (!message.trim() || !client?.active) return;

    const chatMessage = {
      groupId: groupId,
      content: message,
      createAt: new Date().toISOString(),
    };

    client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoadingMessages ? (
          <div className="text-center text-muted-foreground">
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet
          </div>
        ) : (
          <>
            <MessagesList
              messages={messages}
              observerElem={observerElem}
              isFetchingNextPage={isFetchingNextPage}
            />
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!isConnected}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
