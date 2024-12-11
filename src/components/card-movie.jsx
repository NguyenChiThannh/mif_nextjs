'use client'
import Rating from '@/components/rating'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function CardMovie({ direction = 'horizontal', movie }) {
    const router = useRouter();
    const t = useTranslations('Movie');

    const yearRelease = movie?.releaseDate?.split('-')[0] ?? 'N/A';
    const { title, posterUrl, duration, ratings } = movie;

    return (
        <div
            className={`gap-4 h-fit ${direction === 'vertical' ? 'flex-col w-fit flex' : 'grid grid-cols-2'}`}
        >

            {/* Movie Poster */}
            <div className='relative'>
                <Image
                    src={posterUrl}
                    alt={title}
                    height={400}
                    width={300}
                    className="rounded-lg object-cover aspect-[3/4]"
                />
            </div>

            {/* Movie Details */}
            <div className="grid gap-2">
                {/* Movie Title */}
                <Link

                    href={`/movies/${movie.id}`}>
                    <p className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2 hover:underline">
                        {title}
                    </p>
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
                    <span className="text-xs">{(Number(movie.ratings?.averageRating) * 2) || '0.0'}/10</span>
                </div>

                {/* Watch Trailer Button */}
                <Button>
                    <Link
                        href={`/movies/${movie.id}`}
                    >
                        {t('button_watch_trailer')}
                    </Link>

                </Button>

            </div>
        </div >
    )
}

export const CardMovieSkeleton = ({ direction = 'horizontal' }) => {
    return (
        <div className={`grid gap-4 h-full ${direction === 'vertical' ? 'flex-col w-full' : 'grid-cols-2'}`}>
            {/* Skeleton for Poster */}
            <div>
                <Skeleton
                    height={100}
                    width={200}
                    className="rounded-lg object-cover aspect-[3/4] h-full"
                />
            </div>

            {/* Skeleton for Details */}
            <div className={`flex gap-2 flex-col justify-around ${direction === 'vertical' ? 'h-40' : 'h-full'}`}>
                <Skeleton className="h-2/6" />
                <Skeleton className="w-3/4 h-1/6" />
                <Skeleton className="w-3/4 h-1/6" />
                <Skeleton className="h-1/6" />
            </div>
        </div>
    );
};
