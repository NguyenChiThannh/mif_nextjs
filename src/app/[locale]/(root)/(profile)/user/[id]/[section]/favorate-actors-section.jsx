import CardActorHorizontal, { CardActorHorizontalSkeleton } from '@/components/card-actor-horizontal';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { favoriteActorsApi } from '@/services/favoriteActorsApi';
import React from 'react'

export default function FavorateActorsSection() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = favoriteActorsApi.query.useGetFavoriteActors()

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);
    return (
        <div className='grid col-span-2'>
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
    )
}
