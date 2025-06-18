"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Trash2, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatBotApi } from "@/services/chatBotApi";
import DialogConfirmDelete, {
  confirmDelete,
} from "@/components/dialog-confirm-delete";
import Loading from "@/components/loading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const historyContainerRef = useRef(null);
  const observerRef = useRef(null);

  // Chat API integration
  const chatWithBotMutation = chatBotApi.mutation.useChatWithBot();
  const deleteHistoryMutation = chatBotApi.mutation.useDeleteHistoryChatBot();
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = chatBotApi.query.useGetHistoryChatBot();

  // Custom infinite scroll for loading older messages at the top
  useEffect(() => {
    const historyContainer = historyContainerRef.current;
    if (!historyContainer || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSend = async () => {
    if (!input.trim()) return;

    console.log('Starting chat request...');
    const startTime = Date.now();

    // Create a temporary chat to display immediately
    const tempChat = {
      id: `temp-${Date.now()}`,
      query: input,
      userId: null,
      timestamp: new Date().toISOString(),
      response: null,
      isTemp: true,
    };

    setCurrentChat(tempChat);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending request to backend...');
      const response = await chatWithBotMutation.mutateAsync({ message: input });
      console.log('Received response from backend:', response);
      console.log('Time taken:', Date.now() - startTime, 'ms');

      // Update the temporary chat with the response
      setCurrentChat(null);
    } catch (error) {
      console.error("Error chatting with bot:", error);
      // Update with error message
      setCurrentChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          response: error.response?.data?.message || "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
          isTemp: false,
        };
      });
    } finally {
      console.log('Setting loading to false');
      setIsLoading(false);
    }
  };

  const handleDeleteHistory = async () => {
    confirmDelete("", (result) => {
      if (result) {
        deleteHistoryMutation.mutate();
      }
    });
  };

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop =
        historyContainerRef.current.scrollHeight;
    }
  }, [currentChat, historyData?.pages]);

  if (deleteHistoryMutation.isPending) {
    return <Loading />;
  }

  // Group chats by date for better UI
  const groupChatsByDate = () => {
    const groups = new Map();

    // Add history data
    historyData?.pages?.forEach((page) => {
      page?.content?.forEach((chat) => {
        const dateKey = getDateString(chat.timestamp);
        if (!groups.has(dateKey)) {
          groups.set(dateKey, []);
        }
        // Transform the chat data to match our expected format
        const transformedChat = {
          id: chat.id,
          query: chat.query,
          userId: chat.userId,
          timestamp: chat.timestamp,
          response: chat.response,
          isTemp: false
        };
        groups.get(dateKey).push(transformedChat);
      });
    });

    // Add current temporary chat if it exists
    if (currentChat) {
      const dateKey = getDateString(currentChat.timestamp);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      groups.get(dateKey).push(currentChat);
    }

    // Convert map to array of objects for rendering
    return Array.from(groups.entries()).map(([date, chats]) => ({
      date,
      chats: chats.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      ),
    }));
  };

  // Render response dựa vào type
  const renderResponse = (response) => {
    if (!response) return null;

    // Check if response contains movie data
    try {
      const parsedResponse = JSON.parse(response);
      if (parsedResponse.type === 'movie' && parsedResponse.data) {
        return (
          <div className="flex items-stretch gap-4 w-full">
            <div className="relative overflow-hidden rounded-lg aspect-[3/4] w-24 flex-shrink-0">
              <Image
                src={parsedResponse.data.posterUrl}
                alt={parsedResponse.data.title || 'Movie Poster'}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>
            <div className="grid gap-1 my-1 min-w-0 flex-1">
              <h3 className="text-base font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors duration-200">
                {parsedResponse.data.title}
              </h3>
              <div className="grid gap-0.5 text-sm text-muted-foreground">
                <p>Năm phát hành: {parsedResponse.data.releaseDate?.split('-')[0]}</p>
                <p>Thời lượng: {parsedResponse.data.duration} phút</p>
                <p><span className="font-medium">{parsedResponse.data.country}</span></p>
              </div>
            </div>
          </div>
        );
      }
    } catch (e) {
      // If response is not JSON or doesn't contain movie data, render as markdown
      return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response}</ReactMarkdown>;
    }

    // Default to markdown rendering
    return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response}</ReactMarkdown>;
  };

  // Format timestamps
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Helper to get dates for grouping chats by day
  const getDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <div className="flex flex-col items-center gap-1">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(true)}
            className="relative rounded-full shadow-lg overflow-hidden border border-border w-14 h-14 hover:scale-105 transition-transform duration-300 animate-float"
          >
            <Image
              src="/logo.png"
              alt="AI Avatar"
              fill
              className="object-cover"
            />
          </Button>
        </div>
      )}

      {isOpen && (
        <div className="w-96 h-[500px] bg-background text-foreground rounded-lg shadow-xl flex flex-col border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Trợ lý MIF AI</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteHistory}
                className="h-7 w-7"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div ref={historyContainerRef} className="flex-1 overflow-y-auto p-3">
            {/* Loading indicator at the top (when scrolling up) */}
            {isFetchingNextPage && (
              <div className="text-center py-2 mb-4">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce"></div>
                  <div
                    className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            )}

            {/* Observer element at the top for infinite scrolling */}
            <div ref={observerRef} className="h-1 w-full"></div>

            {/* Display grouped chat history */}
            <div className="space-y-8">
              {groupChatsByDate().map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-6">
                  {/* Date header */}
                  <div className="flex justify-center my-3">
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                      {group.date}
                    </span>
                  </div>

                  {/* Chats in this group */}
                  {group.chats.map((chat) => (
                    <div key={chat.id} className="space-y-3 text-sm">
                      {/* Small timestamp for each message */}
                      <div className="flex justify-center">
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(chat.timestamp)}
                        </span>
                      </div>
                      {/* User message */}
                      <div className="flex justify-end">
                        <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg max-w-[85%]">
                          {chat.query}
                        </div>
                      </div>
                      {/* AI response or loading */}
                      {chat.response ? (
                        <div className="flex justify-start">
                          <div className="bg-muted px-3 py-2 rounded-lg max-w-[85%]">
                            {renderResponse(chat.response)}
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start px-1 py-1">
                          <div className="bg-muted px-2.5 py-3 rounded-xl max-w-[75%] flex items-center">
                            <div className="flex gap-1">
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce"
                                style={{ animationDelay: "0s" }}
                              ></span>
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce"
                                style={{ animationDelay: "0.2s" }}
                              ></span>
                              <span
                                className="w-1.5 h-1.5 rounded-full bg-foreground animate-bounce"
                                style={{ animationDelay: "0.4s" }}
                              ></span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {historyData?.pages?.[0]?.content?.length === 0 && !currentChat && (
              <div className="text-center my-4 text-sm text-muted-foreground">
                Hãy bắt đầu chat
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Nhập tin nhắn..."
              disabled={isLoading}
              className="flex-1 text-sm px-3 py-2 rounded-md bg-muted text-foreground outline-none border border-border"
            />
            <Button
              onClick={handleSend}
              size="sm"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <DialogConfirmDelete />
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
