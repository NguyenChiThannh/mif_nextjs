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
    } = groupPostApi.query.useGetPostsByGroupIdInfinite("67502356fe4f3d4f70a03bad")

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);
    return (
        <div>
            {isLoading && (
                <>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </>
            )}
            {data?.pages?.map((page, index) =>
                page.content.map((post) => (
                    <Post key={post.id} post={post} />
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
