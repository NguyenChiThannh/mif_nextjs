import CardMovieSmall, { CardMovieSmallSkeleton } from '@/components/card-movie-horizontal';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { savedMovieApi } from '@/services/savedMovie';
import React from 'react'

export default function MoviesSavedSection({ id }) {

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = savedMovieApi.query.useGetSavedMovies(id)

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    return (
        <div>
            <div className="grid gap-8 mt-4 col-span-2">
                {isLoading && (
                    <>
                        <CardMovieSmallSkeleton />
                        <CardMovieSmallSkeleton />
                        <CardMovieSmallSkeleton />
                        <CardMovieSmallSkeleton />
                    </>
                )}
                {data?.pages?.map((page) =>
                    page.content.map((movie) => (
                        <CardMovieSmall key={movie.id} movie={movie} />
                    ))
                )}
                {isFetchingNextPage && (
                    <CardMovieSmallSkeleton />
                )}
                <div ref={observerElem}></div>
            </div>
        </div>
    )
}
