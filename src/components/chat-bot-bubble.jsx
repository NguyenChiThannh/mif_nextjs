'use client'

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { Trash2, X, ChevronDown, Clock, Send, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { chatBotApi } from "@/services/chatBotApi"
import Link from "next/link"
import { toast } from "react-toastify"
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import DialogConfirmDelete, { confirmDelete } from "@/components/dialog-confirm-delete"
import Loading from "@/components/loading"
import ReactMarkdown from 'react-markdown';

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentChat, setCurrentChat] = useState(null)
  const chatContainerRef = useRef(null)
  const historyContainerRef = useRef(null)
  const observerRef = useRef(null)

  // Chat API integration
  const chatWithBotMutation = chatBotApi.mutation.useChatWithBot()
  const deleteHistoryMutation = chatBotApi.mutation.useDeleteHistoryChatBot()
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = chatBotApi.query.useGetHistoryChatBot()

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
    if (!input.trim()) return

    // Create a temporary chat to display immediately
    const tempChat = {
      id: `temp-${Date.now()}`,
      query: input,
      userId: null,
      timestamp: new Date().toISOString(),
      response: null,
      movies: [],
      isTemp: true
    }

    setCurrentChat(tempChat)
    setInput("")
    setIsLoading(true)

    try {
      chatWithBotMutation.mutate({ query: input }, {
        onSuccess: (data) => {
          // Update the temporary chat with the response
          setCurrentChat(prev => {
            if (!prev) return null;
            return {
              ...prev,
              response: data.response,
              movies: data.movies || [],
              isTemp: false
            }
          })
        },
        onError: () => {
          // Update with error message
          setCurrentChat(prev => {
            if (!prev) return null;
            return {
              ...prev,
              response: "Đã xảy ra lỗi khi gửi tin nhắn.",
              isTemp: false
            }
          })
        }
      })
    } catch (error) {
      console.error("Error chatting with bot:", error)
      setCurrentChat(prev => {
        if (!prev) return null;
        return {
          ...prev,
          response: "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
          isTemp: false
        }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteHistory = async () => {
    confirmDelete('', (result) => {
      if (result) {
        deleteHistoryMutation.mutate()
      }
    });
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop = historyContainerRef.current.scrollHeight
    }
  }, [currentChat, historyData?.pages]);

  if (deleteHistoryMutation.isPending) {
    return <Loading />
  }

  // Render movies in a chat
  const renderMovies = (movies) => {
    if (!movies || movies.length === 0) return null;

    return (
      <div className="space-y-2 mt-2">
        <p className="text-xs text-muted-foreground">Phim gợi ý:</p>
        <div className="flex flex-wrap gap-2">
          {movies.map((movie) => (
            <Link
              href={`/movies/${movie.id}`}
              key={movie.id}
              className="block"
            >
              <div className="relative w-24 group">
                <div className="overflow-hidden rounded-md aspect-[2/3]">
                  <Image
                    src={movie.posterUrl || "/placeholder.png"}
                    alt={movie.title}
                    width={96}
                    height={144}
                    className="object-cover w-full h-full transition-transform group-hover:scale-110"
                  />
                </div>
                <p className="text-xs mt-1 line-clamp-2">{movie.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  // Format timestamps
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Helper to get dates for grouping chats by day
  const getDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Group chats by date for better UI
  const groupChatsByDate = () => {
    const groups = new Map();

    // Add history data
    historyData?.pages?.forEach(page => {
      page?.content?.forEach(chat => {
        const dateKey = getDateString(chat.timestamp);
        if (!groups.has(dateKey)) {
          groups.set(dateKey, []);
        }
        groups.get(dateKey).push(chat);
      });
    });

    // Add current temporary chat if it exists
    if (currentChat) {
      const dateKey = getDateString(currentChat.timestamp);
      if (!groups.has(dateKey)) {
        groups.set(dateKey, []);
      }
      // Add at the end if it's today's date, otherwise in appropriate date
      groups.get(dateKey).push(currentChat);
    }

    // Convert map to array of objects for rendering
    return Array.from(groups.entries()).map(([date, chats]) => ({
      date,
      chats: chats.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    }));
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="rounded-full shadow-lg overflow-hidden border border-border"
        >
          <Image
            src="/logo.png"
            alt="AI Avatar"
            width={56}
            height={56}
            className="object-cover"
          />
        </Button>
      )}

      {isOpen && (
        <div className="w-96 h-[500px] bg-background text-foreground rounded-lg shadow-xl flex flex-col border border-border">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">Trợ lý AI</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDeleteHistory}
                className="h-7 w-7"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div ref={historyContainerRef} className="flex-1 overflow-y-auto p-3">
            {/* Loading indicator at the top (when scrolling up) */}
            {isFetchingNextPage && (
              <div className="text-center py-2 mb-4">
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "0.4s" }}></div>
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
                            <ReactMarkdown>{chat.response}</ReactMarkdown>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-start">
                          <div className="bg-muted px-3 py-2 rounded-lg max-w-[85%] flex items-center gap-2">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 rounded-full bg-foreground animate-bounce"></div>
                              <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                              <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Movie suggestions */}
                      {chat.movies && chat.movies.length > 0 && (
                        <div className="ml-1">
                          {renderMovies(chat.movies)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {historyData?.pages?.[0]?.content?.length === 0 && !currentChat && (
              <div className="text-center my-4 text-sm text-muted-foreground">Hãy bắt đầu chat</div>
            )}
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSend()}
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
    </div>
  )
}