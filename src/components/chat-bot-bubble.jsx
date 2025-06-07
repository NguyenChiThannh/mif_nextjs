"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Trash2, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { chatBotApi } from "@/services/chatBotApi";
import Link from "next/link";
import DialogConfirmDelete, {
  confirmDelete,
} from "@/components/dialog-confirm-delete";
import Loading from "@/components/loading";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';

// Types cho response từ Spring AI MCP
const ChatResponseType = {
  SEARCH_MOVIE: "search_movie",
  GET_UPCOMING_EVENTS: "get_upcoming_events",
  CLEAR_HISTORY: "clear_history",
  GET_TRENDING_POSTS: "get_trending_posts",
  GET_TOP_UPVOTED_POSTS: "get_top_upvoted_posts",
  CHITCHAT: "chitchat",
};

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

    // Create a temporary chat to display immediately
    const tempChat = {
      id: `temp-${Date.now()}`,
      query: input,
      userId: null,
      timestamp: new Date().toISOString(),
      response: null,
      movies: [],
      isTemp: true,
    };

    setCurrentChat(tempChat);
    setInput("");
    setIsLoading(true);

    try {
      chatWithBotMutation.mutate(
        { message: input },
        {
          onSuccess: (response) => {
            // Update the temporary chat with the response
            setCurrentChat((prev) => {
              if (!prev) return null;
              // If it's a clear history response, show message and clear after 1 second
              if (response.type === ChatResponseType.CLEAR_HISTORY) {
                setTimeout(() => {
                  setCurrentChat(null);
                }, 1000);
              }
              return {
                ...prev,
                response: response,
                isTemp: false,
              };
            });
          },
          onError: (error) => {
            console.error("Error response:", error);
            // Update with error message
            setCurrentChat((prev) => {
              if (!prev) return null;
              return {
                ...prev,
                response: {
                  type: "error",
                  data:
                    error.response?.data?.message ||
                    "Đã xảy ra lỗi khi gửi tin nhắn.",
                  status: "error",
                  message: "Xử lý yêu cầu thất bại",
                },
                isTemp: false,
              };
            });
          },
        }
      );
    } catch (error) {
      console.error("Error chatting with bot:", error);
      setCurrentChat((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          response: {
            type: "error",
            data:
              error.response?.data?.message ||
              "Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.",
            status: "error",
            message: "Xử lý yêu cầu thất bại",
          },
          isTemp: false,
        };
      });
    } finally {
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
          response: {
            type: chat.movies ? ChatResponseType.SEARCH_MOVIE : ChatResponseType.CHITCHAT,
            data: chat.response,
            movies: chat.movies
          },
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

    switch (response.type) {
      case ChatResponseType.SEARCH_MOVIE:
        return (
          <div className="space-y-4">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data}</ReactMarkdown>
            {response.movies && response.movies.length > 0 && (
              <div className="flex flex-col gap-4 mt-4">
                {response.movies.map((movie) => (
                  <Link
                    href={`/movies/${movie.id}`}
                    key={movie.id}
                    className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                  >
                    <div className="relative w-20 h-28 flex-shrink-0">
                      {movie.posterUrl ? (
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No poster</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium truncate group-hover:text-primary transition-colors">
                        {movie.title.length > 21 ? `${movie.title.substring(0, 21)}...` : movie.title}
                      </h3>
                      {movie.releaseDate && (
                        <span className="text-sm text-muted-foreground block mt-0.5">
                          {new Date(movie.releaseDate).getFullYear()}
                        </span>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1.5 mb-2">
                        {movie.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {movie.genre?.slice(0, 2).map((g) => (
                          <span
                            key={g.id}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                          >
                            {g.categoryName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );

      case ChatResponseType.GET_UPCOMING_EVENTS:
        return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data}</ReactMarkdown>

      case ChatResponseType.CLEAR_HISTORY:
        return <p>{response.data}</p>;

      case ChatResponseType.GET_TRENDING_POSTS:
        return (
          <div className="space-y-4">
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data.response}</ReactMarkdown>
            {response.data.posts && response.data.posts.length > 0 && (
              <div className="flex flex-col gap-4 mt-4">
                {response.data.posts.map((post) => (
                  <Link
                    href={`/groups/${post.groupId}/posts/${post.id}`}
                    key={post.id}
                    className="group flex gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-border"
                  >
                    <div className="relative w-20 h-28 flex-shrink-0">
                      {post.mediaUrls && post.mediaUrls.length > 0 ? (
                        <img
                          src={post.mediaUrls[0]}
                          alt={post.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <img
                          src={post.owner.profilePictureUrl}
                          alt={post.owner.displayName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-sm font-medium">{post.owner.displayName}</span>
                      </div>
                      <h3 className="text-base font-medium truncate group-hover:text-primary transition-colors">
                        {post.title.length > 30 ? `${post.title.substring(0, 30)}...` : post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {post.content.length > 100 ? `${post.content.substring(0, 100)}...` : post.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          {post.voteNumber} upvotes
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      case ChatResponseType.GET_TOP_UPVOTED_POSTS:
        return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data}</ReactMarkdown>;

      case ChatResponseType.CHITCHAT:
        return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data}</ReactMarkdown>;

      default:
        return <ReactMarkdown rehypePlugins={[rehypeRaw]}>{response.data}</ReactMarkdown>
    }
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
