'use client'
import CardActorHorizontal, { CardActorHorizontalSkeleton } from '@/components/card-actor-horizontal'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import Title from '@/components/title'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { actorApi } from '@/services/actorApi'
import { useTranslations } from 'next-intl'
import React from 'react'

export default function Actor() {
    const t = useTranslations('Actor')

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = actorApi.query.useGetTopActorsInfinite()

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    return (
        <div className='grid grid-cols-3 gap-10'>
            <div className='grid col-span-2'>
                <Title title={t('title')} isMore={false} />
                <div>
                    {isLoading && (
                        <>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <CardActorHorizontalSkeleton key={index} />
                            ))}
                        </>
                    )}
                    {data?.pages?.map((page) =>
                        page.content.map((actor) => (
                            <CardActorHorizontal key={actor.id} actor={actor} />
                        ))
                    )}
                    {isFetchingNextPage && (
                        <CardActorHorizontalSkeleton />
                    )}
                    <div ref={observerElem}></div>
                </div>
            </div>
            <SectionExploreMovies />
        </div>
    )
}
