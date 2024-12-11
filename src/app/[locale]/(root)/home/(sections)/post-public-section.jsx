'use client'
import Post, { PostSkeleton } from '@/components/post';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { groupPostApi } from '@/services/groupPostApi';
import React from 'react'

export default function PostPublicSection() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = groupPostApi.query.useGetAllPosts()

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);
    return (
        <div className='grid gap-8'>
            {isLoading && (
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            )}
            {data?.pages?.map((page, index) =>
                page.content.map((post) => (
                    <Post key={post.id} post={post} isGroup={true} />
                ))
            )}
            {isFetchingNextPage && (
                <PostSkeleton />
            )}
            <div ref={observerElem}></div>
            {!hasNextPage && (
                <div className="text-center my-4 text-sm text-muted-foreground">Bạn đã xem hết bài viết</div>
            )}
        </div>
    )
}
