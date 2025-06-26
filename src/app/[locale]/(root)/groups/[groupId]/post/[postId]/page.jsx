'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { useAppSelector } from '@/redux/store'
import { useQueryClient } from '@tanstack/react-query'
import { useWebSocket } from '@/hooks/useWebSocket'
import { groupPostApi } from '@/services/groupPostApi'
import { commentApi } from '@/services/commentApi'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import Post, { PostSkeleton } from '@/components/post'
import Comment, { CommentSkeleton } from './(components)/comment'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Send } from 'lucide-react'
import useUserId from '@/hooks/useUserId'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

export default function DetailPost() {
  const { postId } = useParams()
  const userId = useUserId()
  const authState = useAppSelector((state) => state.auth.authState)
  const queryClient = useQueryClient()
  const t = useTranslations('Groups.Post')
  const router = useRouter()
  const pathname = usePathname()

  // State management
  const [replyContent, setReplyContent] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [liveComments, setLiveComments] = useState([])

  // Queries
  const { data: post, isLoading: isLoadingPost } =
    groupPostApi.query.useGetPostByPostId(postId)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingComment,
  } = commentApi.query.useGetAllCommentByPostId(postId)

  // WebSocket connection
  const { isConnected, client } = useWebSocket(
    authState.accessToken,
    `/topic/comments/${postId}`,
    handleNewComment,
  )

  // Infinite scroll
  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage)

  function handleNewComment(newComment) {
    setLiveComments((prev) => {
      const isDuplicate = prev.some((comment) => comment.id === newComment.id)
      if (isDuplicate) return prev
      return [newComment, ...prev]
    })
    queryClient.invalidateQueries(['comments', postId])
  }

  const handleSendComment = () => {
    if (!replyContent.trim() || !client?.active) return

    const comment = {
      postId: postId,
      content: replyContent,
      createAt: new Date().toISOString(),
    }

    client.publish({
      destination: '/app/comment.sendComment',
      body: JSON.stringify(comment),
    })

    setReplyContent('')
  }

  const handleReply = (commentId, content, level) => {
    if (!content.trim() || !client?.active) return

    const reply = {
      postId: postId,
      content: content,
      parentId: commentId,
      level: level,
      createAt: new Date().toISOString(),
    }

    client.publish({
      destination: '/app/comment.reply',
      body: JSON.stringify(reply),
    })

    setReplyContent('')
    setReplyTo(null)
  }

  const handleVote = (comment, voteType) => {
    const currentVote = comment.upvotes.some((id) => id === userId)
      ? 'upvote'
      : comment.downvotes.some((id) => id === userId)
        ? 'downvote'
        : null

    if (currentVote === voteType) {
      client.publish({
        destination: `/app/comment.${voteType}`,
        body: JSON.stringify(comment.id),
      })
    } else {
      if (currentVote) {
        client.publish({
          destination: `/app/comment.${currentVote === 'upvote' ? 'downvote' : 'upvote'}`,
          body: JSON.stringify(comment.id),
        })
      }
      client.publish({
        destination: `/app/comment.${voteType}`,
        body: JSON.stringify(comment.id),
      })
    }
  }

  // Combine and sort comments
  const combinedComments = useMemo(() => {
    const commentMap = new Map()

    data?.pages?.forEach((page) => {
      page.content.forEach((comment) => {
        if (!commentMap.has(comment.id)) {
          commentMap.set(comment.id, comment)
        }
      })
    })

    liveComments.forEach((comment) => {
      if (!commentMap.has(comment.id)) {
        commentMap.set(comment.id, comment)
      }
    })

    return Array.from(commentMap.values()).sort(
      (a, b) => new Date(b.createAt) - new Date(a.createAt),
    )
  }, [data?.pages, liveComments])

  // Render nested comments
  const renderComments = (comments, level = 1) => {
    return comments.map((comment, index) => (
      <div
        key={comment.id}
        className={`${level === 1 ? 'relative' : 'ml-8 relative'}`}
      >
        {comment?.replies?.length > 0 && (
          <div
            className={`absolute h-full border-l-2 border-s-muted left-4 top-12`}
            style={{ height: 'calc(100% - 50px)' }}
          />
        )}
        {level > 1 && (
          <div
            className={`absolute h-full border-t-2 w-4 -left-4 top-4 z-10 border-l-2 border-t-muted 
                        ${index === comments.length - 1 ? 'border-s-card' : 'border-s-muted'}`}
            style={{ height: 'calc(100% - 20px)' }}
          />
        )}
        <Comment
          comment={comment}
          setReplyTo={setReplyTo}
          replyTo={replyTo}
          onVote={handleVote}
          userId={userId}
        />
        {replyTo === comment.id && (
          <div className='my-2 ml-8 flex items-start gap-4 z-10'>
            <Input
              placeholder={t('comment')}
              className='h-auto resize-none overflow-hidden'
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <Button
              size='icon'
              onClick={() => handleReply(comment.id, replyContent, level)}
            >
              <Send className='w-4 h-4' />
              <span className='sr-only'>Send</span>
            </Button>
          </div>
        )}
        {comment.replies && renderComments(comment.replies, level + 1)}
      </div>
    ))
  }

  const handleBackHome = () => {
    console.log('Current pathname:', pathname)

    const segments = pathname.split('/')
    if (segments.length >= 6) {
      const locale = segments[1]
      const groupId = segments[3]
      const newPath = `/${locale}/groups/${groupId}`
      console.log('Redirecting to:', newPath)
      router.push(newPath)
    }
  }

  return (
    <div>
      <div className='w-full max-w-3xl mx-auto shadow-xl py-2 rounded-lg bg-card h-full'>
        <Button
          onClick={handleBackHome}
          className='flex items-center gap-2 my-4'
        >
          <ArrowLeft className='w-4 h-4' />
          Quay lại
        </Button>
        <div className='pb-2'></div>
        {isLoadingPost ? (
          <PostSkeleton />
        ) : (
          <Post post={post} className={'drop-shadow-sm'} />
        )}

        <div className='flex items-center gap-2 px-2 mt-4'>
          <Textarea
            placeholder={t('comment')}
            rows={1}
            className='h-auto resize-none overflow-hidden'
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <Button size='icon' onClick={handleSendComment}>
            <Send className='w-4 h-4' />
            <span className='sr-only'>{t('send')}</span>
          </Button>
        </div>

        <div className='space-y-1 mx-2 mt-4 bg-inherit'>
          {isLoadingComment && (
            <>
              <CommentSkeleton />
              <CommentSkeleton />
              <CommentSkeleton />
            </>
          )}
          {!isLoadingComment &&
            combinedComments.map((comment) => (
              <div key={comment.id} className='relative'>
                <Comment
                  comment={comment}
                  setReplyTo={setReplyTo}
                  replyTo={replyTo}
                  onVote={handleVote}
                  userId={userId}
                />
                {replyTo === comment.id && (
                  <div className='my-2 ml-8 flex items-start gap-4 z-10'>
                    <Input
                      placeholder={t('comment')}
                      className='h-auto resize-none overflow-hidden'
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <Button
                      size='icon'
                      onClick={() => handleReply(comment.id, replyContent, 1)}
                    >
                      <Send className='w-4 h-4' />
                      <span className='sr-only'>Send</span>
                    </Button>
                  </div>
                )}
                {comment.replies && renderComments(comment.replies, 2)}
              </div>
            ))}
          {isFetchingNextPage && <CommentSkeleton />}
        </div>
      </div>
      <div ref={observerElem} className='mb-4'></div>
    </div>
  )
}
