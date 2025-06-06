'use client'
import Rating from '@/components/rating'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'

export default function CardMovie({ direction = 'horizontal', movie }) {
    const router = useRouter();
    const t = useTranslations('Movie');

    const yearRelease = movie?.releaseDate?.split('-')[0] ?? 'N/A';
    const { title, posterUrl, duration, ratings } = movie;

    return (
        <motion.div
            className={`gap-4 h-fit ${direction === 'vertical' ? 'flex-col w-fit flex' : 'grid grid-cols-2'}`}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
        >
            {/* Movie Poster */}
            <motion.div
                className='relative overflow-hidden rounded-lg'
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
            >
                <Image
                    src={posterUrl}
                    alt={title}
                    height={400}
                    width={300}
                    className="rounded-lg object-cover aspect-[3/4] transition-transform duration-300"
                />
            </motion.div>

            {/* Movie Details */}
            <div className="grid gap-2">
                {/* Movie Title */}
                <Link href={`/movies/${movie.id}`}>
                    <motion.p
                        className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2 hover:text-primary transition-colors duration-200"
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        {title}
                    </motion.p>
                </Link>
                {/* Movie Information */}
                {direction === 'vertical' ? (
                    <p className="text-muted-foreground text-sm">
                        {yearRelease} &middot; {duration}
                    </p>
                ) : (
                    <>
                        <p className="text-muted-foreground text-sm">{t('year_release')}: {yearRelease}</p>
                        <p className="text-muted-foreground text-sm">{t('duration')}: {duration}p</p>
                        <p className="text-muted-foreground text-sm"><strong>{movie.country}</strong></p>
                    </>
                )}

                {/* Rating Section */}
                <div className="flex items-center space-x-1">
                    <Rating
                        value={ratings?.averageRating}
                        iconSize="m"
                        showOutOf={true}
                        enableUserInteraction={false}
                    />
                    <span className="text-xs text-muted-foreground">{(Number(movie.ratings?.averageRating) * 2) || '0.0'}/10</span>
                </div>

                {/* Watch Trailer Button */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Button className="w-full">
                        <Link href={`/movies/${movie.id}`}>
                            {t('button_watch_trailer')}
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </motion.div>
    )
}

export const CardMovieSkeleton = ({ direction = 'horizontal' }) => {
    return (
        <motion.div
            className={`grid gap-4 h-full ${direction === 'vertical' ? 'flex-col w-full' : 'grid-cols-2'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Skeleton for Poster */}
            <div>
                <Skeleton
                    height={100}
                    width={200}
                    className="rounded-lg object-cover aspect-[3/4] h-full bg-muted"
                />
            </div>

            {/* Skeleton for Details */}
            <div className={`flex gap-2 flex-col justify-around ${direction === 'vertical' ? 'h-40' : 'h-full'}`}>
                <Skeleton className="h-2/6 bg-muted" />
                <Skeleton className="w-3/4 h-1/6 bg-muted" />
                <Skeleton className="w-3/4 h-1/6 bg-muted" />
                <Skeleton className="h-1/6 bg-muted" />
            </div>
        </motion.div>
    );
};
