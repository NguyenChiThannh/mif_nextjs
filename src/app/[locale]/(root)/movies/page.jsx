'use client'
import CardMovieSmall, { CardMovieSmallSkeleton } from '@/components/card-movie-horizontal'
import { ComboboxMovieCategory } from '@/components/combobox-category-movie'
import Loading from '@/components/loading'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { movieApi } from '@/services/movieApi'
import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'use-intl'

export default function MoviePage() {
    const t = useTranslations('Movie')
    const observerRef = useRef(null)
    const isFetchingRef = useRef(false)

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = movieApi.query.useGetAllMoviesInfinity()

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const target = entries[0]
                if (target.isIntersecting && hasNextPage && !isFetchingRef.current) {
                    isFetchingRef.current = true
                    fetchNextPage().finally(() => {
                        isFetchingRef.current = false
                    })
                }
            },
            {
                root: null,
                rootMargin: '100px',
                threshold: 0.1,
            }
        )

        if (observerRef.current) {
            observer.observe(observerRef.current)
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current)
            }
        }
    }, [hasNextPage, fetchNextPage])

    if (isLoading) return (<Loading />)

    return (
        <div className='grid grid-cols-3 gap-10'>
            <div className='grid col-span-2'>
                <div className='flex'>
                    <div className='flex items-center'>
                        <div className='w-2 bg-primary h-8 rounded'></div>
                        <h1 className='text-xl md:text-xl lg:text-2xl font-bold pl-4'>{t("title")}</h1>
                    </div>
                    {/* <div className='ml-auto mt-4 gap-2'>
                        <div className='flex gap-2 items-center'>
                            <ComboboxMovieCategory />
                        </div>
                    </div> */}
                </div>
                <div className='grid mt-4 gap-2'>
                    {isLoading && (
                        <>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <CardMovieSmallSkeleton key={index} />
                            ))}
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
                    <div ref={observerRef} className="h-4" />
                </div>
            </div>
            <SectionExploreMovies />
        </div>
    )
}

