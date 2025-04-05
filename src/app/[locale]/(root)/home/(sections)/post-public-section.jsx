'use client'
import Post, { PostSkeleton } from '@/components/post';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { groupPostApi } from '@/services/groupPostApi';
import { useTranslations } from 'next-intl';
import React from 'react'

export default function PostPublicSection() {
    const t = useTranslations()
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
                <div className="text-center my-4 text-sm text-muted-foreground">{t("you_have_read_the_entire_article")}</div>
            )}
        </div>
    )
}
