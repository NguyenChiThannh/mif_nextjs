import CardMovieHorizontal, { CardMovieHorizontalSkeleton } from '@/components/card-movie-horizontal';
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
                        <CardMovieHorizontalSkeleton />
                        <CardMovieHorizontalSkeleton />
                        <CardMovieHorizontalSkeleton />
                        <CardMovieHorizontalSkeleton />
                    </>
                )}
                {data?.pages?.map((page) =>
                    page.content.map((movie) => (
                        <CardMovieHorizontal key={movie.id} movie={movie} />
                    ))
                )}
                {isFetchingNextPage && (
                    <CardMovieHorizontalSkeleton />
                )}
                <div ref={observerElem}></div>
                {!hasNextPage && (
                    <div className="text-center my-4 text-sm text-muted-foreground">Bạn đã xem hết bài viết</div>
                )}
            </div>
        </div>
    )
}
