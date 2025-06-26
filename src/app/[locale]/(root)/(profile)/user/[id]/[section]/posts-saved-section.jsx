import Post, { PostSkeleton } from '@/components/post'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { savedPostApi } from '@/services/savedPostApi'
import React from 'react'

export default function PostsSavedSection({ id }) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    savedPostApi.query.useGetSavedPosts(id)

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage)

  return (
    <div>
      <div className='grid gap-8 mt-4 col-span-2'>
        {isLoading && (
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        )}
        {data?.pages?.map((page) =>
          page.content.map((post) => <Post key={post.id} post={post} />),
        )}
        {isFetchingNextPage && <PostSkeleton />}
        <div ref={observerElem}></div>
      </div>
    </div>
  )
}
