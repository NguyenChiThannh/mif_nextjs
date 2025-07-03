'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Trash2, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { chatBotApi } from '@/services/chatBotApi'
import DialogConfirmDelete, {
  confirmDelete,
} from '@/components/dialog-confirm-delete'
import Loading from '@/components/loading'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import useDragAndDrop from '@/hooks/useDragAndDrop'
import { motion, AnimatePresence } from 'framer-motion'
import { renderContent, renderHashtagContent } from '@/lib/convert'
import Link from 'next/link'
import MovieMentionInput from './movie-mention-input'

export default function ChatBotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentChat, setCurrentChat] = useState(null)
  const [isDropZone, setIsDropZone] = useState(false)
  const [mentions, setMentions] = useState([])
  const historyContainerRef = useRef(null)
  const observerRef = useRef(null)
  const inputRef = useRef(null)

  const { handleDragOver, handleDrop } = useDragAndDrop()

  // Utility function để đảm bảo mentions array luôn distinct
  const cleanMentions = (mentionsArray) => {
    const uniqueMentions = new Map()

    mentionsArray.forEach((mention) => {
      const uniqueKey = `${mention.id}-${mention.type}`
      if (uniqueMentions.has(uniqueKey)) {
        // Nếu đã có, merge count
        const existing = uniqueMentions.get(uniqueKey)
        uniqueMentions.set(uniqueKey, {
          ...existing,
          count: (existing.count || 1) + (mention.count || 1),
        })
      } else {
        uniqueMentions.set(uniqueKey, {
          ...mention,
          count: mention.count || 1,
        })
      }
    })

    return Array.from(uniqueMentions.values())
  }

  // Function để filter distinct mentions khi gửi backend
  const getDistinctMentions = (mentionsArray) => {
    const seen = new Set()
    return mentionsArray.filter((mention) => {
      const uniqueKey = `${mention.id}-${mention.type}`
      if (seen.has(uniqueKey)) {
        return false
      }
      seen.add(uniqueKey)
      return true
    })
  }

  // Chat API integration
  const chatWithBotMutation = chatBotApi.mutation.useChatWithBot()
  const deleteHistoryMutation = chatBotApi.mutation.useDeleteHistoryChatBot()
  const {
    data: historyData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = chatBotApi.query.useGetHistoryChatBot()

  // Custom infinite scroll for loading older messages at the top
  useEffect(() => {
    const historyContainer = historyContainerRef.current
    if (!historyContainer || !hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Handle drag and drop
  const handleItemDrop = (dragData) => {
    console.log('Dropped data:', dragData)

    let mention = ''
    if (dragData.type === 'group') {
      // Group -> #[name](id)
      mention = `#[${dragData.name}](${dragData.id})`
    } else if (dragData.type === 'movie') {
      // Movie -> @[name](id)
      mention = `@[${dragData.name}](${dragData.id})`
    }

    if (mention) {
      const newInput = input ? `${input} ${mention}` : mention
      setInput(newInput)

      // Add to mentions array for context - với count logic
      setMentions((prev) => {
        console.log('Current mentions before update:', prev)
        console.log('Adding mention:', dragData)

        // Thêm mention mới vào array
        const newMention = {
          id: dragData.id,
          name: dragData.name,
          type: dragData.type,
          count: 1,
        }

        // Sử dụng cleanMentions để đảm bảo distinct và merge count
        const updated = cleanMentions([...prev, newMention])
        console.log('Updated mentions after clean:', updated)
        return updated
      })

      // Focus input
      if (inputRef.current) {
        inputRef.current.focus()
      }

      // Show success animation
      setIsDropZone(false)
    }
  }

  const handleInputDragOver = (e) => {
    e.preventDefault()
    console.log('🟡 Drag over chatbot input')
    handleDragOver(e)
    setIsDropZone(true)
  }

  const handleInputDragLeave = (e) => {
    // Only hide drop zone if we're leaving the input area completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDropZone(false)
    }
  }

  const handleInputDrop = (e) => {
    console.log('🎯 Drop on chatbot input')
    handleDrop(e, handleItemDrop)
    setIsDropZone(false)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    console.log('Starting chat request...')
    const startTime = Date.now()

    // Create a temporary chat to display immediately
    const tempChat = {
      id: `temp-${Date.now()}`,
      query: input,
      userId: null,
      timestamp: new Date().toISOString(),
      response: null,
      isTemp: true,
    }

    setCurrentChat(tempChat)
    setInput('')
    setMentions([]) // Clear mentions after sending
    setIsLoading(true)

    try {
      console.log('Sending request to backend...')

      // Chuẩn bị mentions data - filter distinct để gửi backend
      const distinctMentions = getDistinctMentions(mentions)
      const mentionsForBackend = distinctMentions.map((mention) => ({
        id: mention.id,
        name: mention.name,
        type: mention.type,
      }))

      console.log('Original mentions:', mentions)
      console.log('Distinct mentions for backend:', mentionsForBackend)

      const response = await chatWithBotMutation.mutateAsync({
        message: input,
        mentions: mentionsForBackend, // Send distinct mentions only
      })
      console.log('Received response from backend:', response)
      console.log('Time taken:', Date.now() - startTime, 'ms')

      // Update the temporary chat with the response
      setCurrentChat(null)
    } catch (error) {
      console.error('Error chatting with bot:', error)
      // Update with error message
      setCurrentChat((prev) => {
        if (!prev) return null
        return {
          ...prev,
          response:
            error.response?.data?.message ||
            'Xin lỗi, đã xảy ra lỗi khi xử lý yêu cầu của bạn.',
          isTemp: false,
        }
      })
    } finally {
      console.log('Setting loading to false')
      setIsLoading(false)
    }
  }

  const handleDeleteHistory = async () => {
    confirmDelete('', (result) => {
      if (result) {
        deleteHistoryMutation.mutate()
      }
    })
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (historyContainerRef.current) {
      historyContainerRef.current.scrollTop =
        historyContainerRef.current.scrollHeight
    }
  }, [currentChat, historyData?.pages])

  if (deleteHistoryMutation.isPending) {
    return <Loading />
  }

  // Group chats by date for better UI
  const groupChatsByDate = () => {
    const groups = new Map()

    // Add history data
    historyData?.pages?.forEach((page) => {
      page?.content?.forEach((chat) => {
        const dateKey = getDateString(chat.timestamp)
        if (!groups.has(dateKey)) {
          groups.set(dateKey, [])
        }
        // Transform the chat data to match our expected format
        const transformedChat = {
          id: chat.id,
          query: chat.query,
          userId: chat.userId,
          timestamp: chat.timestamp,
          response: chat.response,
          isTemp: false,
        }
        groups.get(dateKey).push(transformedChat)
      })
    })

    // Add current temporary chat if it exists
    if (currentChat) {
      const dateKey = getDateString(currentChat.timestamp)
      if (!groups.has(dateKey)) {
        groups.set(dateKey, [])
      }
      groups.get(dateKey).push(currentChat)
    }

    // Convert map to array of objects for rendering
    return Array.from(groups.entries()).map(([date, chats]) => ({
      date,
      chats: chats.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
      ),
    }))
  }

  // Render response dựa vào type
  const renderResponse = (response) => {
    if (!response) return null

    const decodedResponse = response.replace(/\\"/g, '"')

    // Default to markdown rendering
    return (
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {decodedResponse}
      </ReactMarkdown>
    )
  }

  // Format timestamps
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Helper to get dates for grouping chats by day
  const getDateString = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <div className='fixed bottom-4 right-4 z-50'>
      {!isOpen && (
        <div className='flex flex-col items-center gap-1'>
          <Button
            variant='ghost'
            onClick={() => setIsOpen(true)}
            className='relative rounded-full shadow-lg overflow-hidden border border-border w-14 h-14 hover:scale-105 transition-transform duration-300 animate-float'
          >
            <Image
              src='/logo.png'
              alt='AI Avatar'
              fill
              className='object-cover'
            />
          </Button>
          <span className='text-xs font-medium text-foreground'>
            Trợ lý MIF
          </span>
        </div>
      )}

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className='w-96 h-[500px] bg-background text-foreground rounded-lg shadow-xl flex flex-col border border-border'
        >
          {/* Header */}
          <div className='flex items-center justify-between px-3 py-2 border-b border-border'>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-sm'>Trợ lý MIF AI</span>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleDeleteHistory}
                className='h-7 w-7'
              >
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setIsOpen(false)}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>

          <div ref={historyContainerRef} className='flex-1 overflow-y-auto p-3'>
            {/* Loading indicator at the top (when scrolling up) */}
            {isFetchingNextPage && (
              <div className='text-center py-2 mb-4'>
                <div className='flex justify-center space-x-1'>
                  <div className='w-2 h-2 rounded-full bg-foreground animate-bounce'></div>
                  <div
                    className='w-2 h-2 rounded-full bg-foreground animate-bounce'
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className='w-2 h-2 rounded-full bg-foreground animate-bounce'
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            )}

            {/* Observer element at the top for infinite scrolling */}
            <div ref={observerRef} className='h-1 w-full'></div>

            {/* Display grouped chat history */}
            <div className='space-y-8'>
              {groupChatsByDate().map((group, groupIndex) => (
                <div key={groupIndex} className='space-y-6'>
                  {/* Date header */}
                  <div className='flex justify-center my-3'>
                    <span className='text-xs font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full'>
                      {group.date}
                    </span>
                  </div>

                  {/* Chats in this group */}
                  {group.chats.map((chat) => (
                    <div key={chat.id} className='space-y-3 text-sm'>
                      {/* Small timestamp for each message */}
                      <div className='flex justify-center'>
                        <span className='text-[10px] text-muted-foreground'>
                          {formatDate(chat.timestamp)}
                        </span>
                      </div>
                      {/* User message */}
                      <div className='flex justify-end'>
                        <div className='bg-primary text-primary-foreground px-3 py-2 rounded-lg max-w-[85%]'>
                          {renderContent(chat.query, 'chat')}
                        </div>
                      </div>
                      {/* AI response or loading */}
                      {chat.response ? (
                        <div className='flex justify-start'>
                          <div className='bg-muted px-3 py-2 rounded-lg max-w-[85%]'>
                            {renderResponse(chat.response)}
                          </div>
                        </div>
                      ) : (
                        <div className='flex justify-start px-1 py-1'>
                          <div className='bg-muted px-2.5 py-3 rounded-xl max-w-[75%] flex items-center'>
                            <div className='flex gap-1'>
                              <span
                                className='w-1.5 h-1.5 rounded-full bg-foreground animate-bounce'
                                style={{ animationDelay: '0s' }}
                              ></span>
                              <span
                                className='w-1.5 h-1.5 rounded-full bg-foreground animate-bounce'
                                style={{ animationDelay: '0.2s' }}
                              ></span>
                              <span
                                className='w-1.5 h-1.5 rounded-full bg-foreground animate-bounce'
                                style={{ animationDelay: '0.4s' }}
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
              <div className='text-center my-4 text-sm text-muted-foreground'>
                Hãy bắt đầu chat
              </div>
            )}
          </div>

          {/* Input */}
          <div className='p-2 border-t border-border'>
            {/* Mentions display */}
            <AnimatePresence>
              {mentions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className='mb-2 flex flex-wrap gap-1'
                >
                  {mentions.map((mention, index) => (
                    <motion.div
                      key={`${mention.id}-${mention.type}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        mention.type === 'movie'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}
                    >
                      <span>
                        {mention.type === 'movie' ? '@' : '#'}
                        {mention.name}
                        {mention.year && ` (${mention.year})`}
                        {mention.count > 1 && (
                          <span className='ml-1 font-semibold'>
                            ×{mention.count}
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() =>
                          setMentions((prev) => {
                            console.log('Removing mention:', mention)
                            console.log('Current mentions before remove:', prev)

                            const uniqueKey = `${mention.id}-${mention.type}`
                            const existingIndex = prev.findIndex(
                              (m) => `${m.id}-${m.type}` === uniqueKey,
                            )

                            if (existingIndex >= 0) {
                              const updated = [...prev]
                              if (updated[existingIndex].count > 1) {
                                // Giảm count xuống 1
                                updated[existingIndex] = {
                                  ...updated[existingIndex],
                                  count: updated[existingIndex].count - 1,
                                }
                                console.log(
                                  'Updated mentions (decrement):',
                                  updated,
                                )
                                return updated
                              } else {
                                // Remove hoàn toàn nếu count = 1
                                const filtered = prev.filter(
                                  (m) => `${m.id}-${m.type}` !== uniqueKey,
                                )
                                console.log(
                                  'Updated mentions (remove):',
                                  filtered,
                                )
                                return filtered
                              }
                            }
                            console.log(
                              'No matching mention found, returning unchanged',
                            )
                            return prev
                          })
                        }
                        className='hover:bg-black/10 rounded-full p-0.5'
                      >
                        <X className='w-3 h-3' />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <div className='flex items-center gap-2'>
              <motion.div
                className={`flex-1 relative transition-all duration-300 ${
                  isDropZone
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : ''
                }`}
                animate={{
                  scale: isDropZone ? 1.02 : 1,
                }}
                onDragOver={handleInputDragOver}
                onDragLeave={handleInputDragLeave}
                onDrop={handleInputDrop}
              >
                <MovieMentionInput
                  minHeight={10}
                  cleanMentions={cleanMentions}
                  setMentions={setMentions}
                  value={input}
                  onChange={setInput}
                  placeholder={
                    isDropZone
                      ? 'Thả group/movie vào đây để mention...'
                      : 'Nhập tin nhắn...'
                  }
                  enableDropZone={true}
                  suggestionsPosition='top'
                />

                {/* Drop zone overlay */}
                <AnimatePresence>
                  {isDropZone && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className='absolute inset-0 bg-primary/20 rounded-md border-2 border-dashed border-primary flex items-center justify-center z-20'
                    >
                      <span className='text-primary text-xs font-medium'>
                        Thả để mention group/movie
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <Button
                onClick={handleSend}
                size='sm'
                disabled={isLoading || !input.trim()}
                className='shrink-0'
              >
                <Send className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </motion.div>
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
  )
}
