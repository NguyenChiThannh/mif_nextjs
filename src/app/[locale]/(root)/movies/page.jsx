'use client'
import CardMovieSmall, { CardMovieSmallSkeleton } from '@/components/card-movie-horizontal'
import { ComboboxMovieCategory } from '@/components/combobox-category-movie'
import Loading from '@/components/loading'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { movieApi } from '@/services/movieApi'
import React, { useEffect, useRef } from 'react'
import { useTranslations } from 'use-intl'
import { motion } from 'framer-motion'

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

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    return (
        <div className='grid grid-cols-3 gap-10 px-4 py-8'>
            <div className='grid col-span-2'>
                <div className='flex items-center'>
                    <div className='flex items-center'>
                        <div className='w-1 bg-primary h-8 rounded'></div>
                        <h1 className='text-xl md:text-xl lg:text-2xl font-bold pl-4 text-foreground'>{t("title")}</h1>
                    </div>
                </div>
                <motion.div
                    className='grid mt-6 space-y-0.5 bg-background rounded-lg'
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {isLoading && (
                        <>
                            {Array.from({ length: 10 }).map((_, index) => (
                                <CardMovieSmallSkeleton key={index} />
                            ))}
                        </>
                    )}
                    {data?.pages?.map((page, pageIndex) =>
                        page.content.map((movie, movieIndex) => (
                            <motion.div
                                key={movie.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: (pageIndex * page.content.length + movieIndex) * 0.1
                                }}
                            >
                                <CardMovieSmall key={movie.id} movie={movie} />
                            </motion.div>
                        ))
                    )}
                    {isFetchingNextPage && (
                        <CardMovieSmallSkeleton />
                    )}
                    <div ref={observerRef} className="h-4" />
                </motion.div>
            </div>
            <SectionExploreMovies />
        </div>
    )
}

