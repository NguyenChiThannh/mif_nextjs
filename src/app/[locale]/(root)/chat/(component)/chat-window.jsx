"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAppSelector } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaperclipIcon, Send, Smile } from "lucide-react";
import { chatApi } from "@/services/chatApi";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import MessageSent from "./message-sent";
import MessageReceived from "./message-received";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Separate date divider component
const DateDivider = ({ date }) => (
  <div className="flex items-center justify-center my-3">
    <div className="flex-grow h-px bg-border"></div>
    <div className="mx-2 px-3 py-1 rounded-full text-xs text-muted-foreground bg-muted/50">
      {date}
    </div>
    <div className="flex-grow h-px bg-border"></div>
  </div>
);

// Separate MessagesList component to prevent unnecessary re-renders
const MessagesList = React.memo(
  ({ messages, observerElem, isFetchingNextPage, currentUserId }) => {
    console.log("currentUserId", currentUserId)
    const groupMessagesByDate = (messages) => {
      const groups = {};
      messages.forEach((message) => {
        const date = new Date(message.createAt).toLocaleDateString();
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(message);
      });
      return groups;
    };

    const groupedMessages = groupMessagesByDate(messages);
    console.log(groupedMessages)
    const sortedDates = Object.keys(groupedMessages).sort(
      (a, b) => new Date(a) - new Date(b)
    );

    return (
      <div className="flex flex-col">
        {sortedDates.map((date) => (
          <React.Fragment key={date}>
            <DateDivider date={date} />
            <div className="space-y-2">
              {groupedMessages[date].map((msg) => (
                <div key={msg.id} className="animate-in fade-in duration-300">
                  {msg.senderId === currentUserId ? (
                    <MessageSent
                      message={{
                        content: msg.content || '',
                        image: msg.image,
                        sender: {
                          name: msg.senderName || 'You',
                          avatar: msg.avatar || ''
                        }
                      }}
                      timestamp={msg.createAt}
                    />
                  ) : (
                    <MessageReceived
                      message={{
                        content: msg.content || '',
                        image: msg.image,
                        sender: {
                          name: msg.senderName || 'User',
                          avatar: msg.avatar || ''
                        }
                      }}
                      timestamp={msg.createAt}
                    />
                  )}
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    );
  }
);

MessagesList.displayName = "MessagesList";

export default function ChatWindow({ groupId, groupName, groupAvatar }) {
  const authState = useAppSelector((state) => state.auth.authState);
  const currentUserId = authState?.id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const prevGroupIdRef = useRef(groupId);
  const [chatInfo, setChatInfo] = useState(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const scrollAreaRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  // Load initial messages
  const {
    data: messagePages,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    isLoading: isLoadingMessages,
  } = chatApi.query.useGetGroupMessages(groupId);

  // Extract chat group info from messages instead of using non-existent API
  useEffect(() => {
    if (messagePages?.pages && messagePages.pages.length > 0) {
      const firstPage = messagePages.pages[0];
      if (firstPage?.content && firstPage.content.length > 0) {
        // Try to extract group info from the first message that might have it
        const messagesWithGroupInfo = firstPage.content.filter(
          msg => msg.groupInfo || msg.groupName || msg.groupAvatar
        );

        if (messagesWithGroupInfo.length > 0) {
          const firstMessageWithInfo = messagesWithGroupInfo[0];
          setChatInfo({
            name: firstMessageWithInfo.groupName || firstMessageWithInfo.groupInfo?.name || 'Group Chat',
            avatarUrl: firstMessageWithInfo.groupAvatar || firstMessageWithInfo.groupInfo?.avatarUrl || '',
            memberCount: firstMessageWithInfo.groupInfo?.memberCount || undefined
          });
        } else {
          // Set default group info if not available in messages
          setChatInfo({
            name: 'Group Chat',
            avatarUrl: '',
            memberCount: undefined
          });
        }
      }
    }
  }, [messagePages]);

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
      setShouldAutoScroll(true); // Reset auto-scroll khi chuyển nhóm chat
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

      // Set isInitialLoad to false to trigger scrollToBottom when done loading
      if (isInitialLoad && sortedMessages.length > 0) {
        setTimeout(() => {
          setIsInitialLoad(false);
        }, 100);
      }
    }
  }, [messagePages, isInitialLoad]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && shouldAutoScroll) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto-scroll to bottom on initial load and when new messages arrive
  useEffect(() => {
    // Chỉ tự động cuộn xuống dưới khi lần đầu tải xong
    if (isInitialLoad && !isFetchingNextPage && messages.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        setIsInitialLoad(false);
      }, 100);
    }
  }, [isInitialLoad, isFetchingNextPage, messages.length, shouldAutoScroll]);

  // Auto-scroll to bottom ONLY when the current user sends a new message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.senderId === currentUserId && !isInitialLoad) {
      // Khi người dùng hiện tại gửi tin nhắn, luôn cuộn xuống dưới
      setShouldAutoScroll(true);
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, currentUserId, isInitialLoad]);

  // Manual scroll to bottom function for button
  const handleScrollToBottom = () => {
    setShouldAutoScroll(true);
    scrollToBottom();
  };

  // Phát hiện khi người dùng cuộn để tắt chế độ tự động cuộn
  const handleScroll = (e) => {
    // Clear timeout cũ nếu có
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Thiết lập timeout mới để tránh gọi quá nhiều
    scrollTimeoutRef.current = setTimeout(() => {
      const scrollElement = e.target;
      const scrollPosition = scrollElement.scrollHeight - scrollElement.scrollTop;
      const viewportHeight = scrollElement.clientHeight;

      // Kiểm tra vị trí cuộn
      if (scrollPosition > viewportHeight + 200) {
        // Người dùng đã cuộn lên cao
        setShouldAutoScroll(false);
      } else if (scrollPosition <= viewportHeight + 50) {
        // Người dùng đã cuộn gần xuống dưới cùng
        setShouldAutoScroll(true);
      }
    }, 100); // Debounce 100ms
  };

  const handleSendMessage = () => {
    if (!message.trim() || !client?.active) return;

    const chatMessage = {
      groupId: groupId,
      content: message,
      createAt: new Date().toISOString(),
      senderId: currentUserId, // Đảm bảo tin nhắn được đánh dấu là của người dùng hiện tại
    };

    client.publish({
      destination: "/app/chat.sendMessage",
      body: JSON.stringify(chatMessage),
    });

    setMessage("");

    // Luôn bật tự động cuộn khi gửi tin nhắn mới
    setShouldAutoScroll(true);
    // Scroll to bottom after sending a message
    setTimeout(scrollToBottom, 200);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] shadow-lg rounded-md overflow-hidden border border-border/50 bg-card">
      {/* Chat Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-card/90 backdrop-blur-sm shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={groupAvatar || (chatInfo?.avatarUrl && chatInfo.avatarUrl !== '' ? chatInfo.avatarUrl : undefined)}
              alt={groupName || "Group Chat"}
            />
            <AvatarFallback>{groupName ? groupName[0].toUpperCase() : 'G'}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-sm">{groupName || "Group Chat"}</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'Connected' : 'Connecting...'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="relative flex-1 overflow-hidden flex flex-col min-h-0 bg-gradient-to-b from-background/50 to-background">
        {/* Infinite scroll loading indicator */}
        {isFetchingNextPage && (
          <div className="absolute top-0 left-0 right-0 z-10 text-center bg-background/80 py-2 shadow-md">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
            <span className="ml-2 text-sm">Đang tải tin nhắn...</span>
          </div>
        )}

        {/* Scroll to bottom button - chỉ hiển thị khi cần */}
        {!shouldAutoScroll && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute bottom-4 right-4 z-10 rounded-full h-9 w-9 shadow-md opacity-80 hover:opacity-100"
            onClick={handleScrollToBottom}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span className="sr-only">Cuộn xuống dưới</span>
          </Button>
        )}

        <div
          className="flex-1 overflow-y-auto px-4 py-4"
          onScroll={handleScroll}
          ref={scrollAreaRef}
          style={{ height: 'calc(100vh - 10rem)' }}
        >
          {/* Scroll observer for infinite scroll */}
          <div
            ref={observerElem}
            className="h-4 mb-4 -mt-2"
            aria-hidden="true"
          ></div>

          {isLoadingMessages ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                <p className="text-muted-foreground mt-2">Đang tải tin nhắn...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-center max-w-md p-6 rounded-lg bg-muted/30 shadow-sm">
                <h3 className="font-medium mb-2">Chưa có tin nhắn</h3>
                <p className="text-sm text-muted-foreground">
                  Bắt đầu cuộc trò chuyện bằng cách gửi tin nhắn.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-1 pb-4 min-h-[400px]">
              <MessagesList
                messages={messages}
                observerElem={observerElem}
                isFetchingNextPage={isFetchingNextPage}
                currentUserId={currentUserId}
              />
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className={cn(
        "border-t p-3",
        "bg-card/90 backdrop-blur-sm shadow-sm shrink-0"
      )}>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            disabled={!isConnected}
          >
            <PaperclipIcon className="h-5 w-5" />
            <span className="sr-only">Đính kèm file</span>
          </Button>

          <Input
            placeholder="Nhập tin nhắn..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="rounded-full bg-muted/80 border-0 shadow-sm"
          />

          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full shrink-0"
            disabled={!isConnected}
          >
            <Smile className="h-5 w-5" />
            <span className="sr-only">Thêm emoji</span>
          </Button>

          <Button
            onClick={handleSendMessage}
            size="icon"
            className="h-9 w-9 rounded-full shrink-0 bg-primary/90 hover:bg-primary shadow-sm"
            disabled={!message.trim() || !isConnected}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Gửi tin nhắn</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
