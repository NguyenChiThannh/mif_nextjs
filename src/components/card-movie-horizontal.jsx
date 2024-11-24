import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function CardMovieHorizontal({ movie }) {
    const router = useRouter();
    const t = useTranslations('Movie');

    const handleDetailMovie = () => {
        router.push(`/movies/${movie.id}`);
    };

    const yearRelease = movie?.releaseDate?.split('-')[0] || 'N/A';
    const duration = movie?.duration || 'Unknown';

    return (
        <div className="flex items-center w-full gap-4">
            {/* Movie Details */}
            <div
                className="flex items-stretch gap-2 cursor-pointer"
                onClick={handleDetailMovie}
            >
                <Image
                    src={movie?.posterUrl}
                    alt={movie?.title || 'Movie Poster'}
                    width={80}
                    height={120}
                    className="rounded-lg object-cover aspect-[3/4]"
                />
                <div className="grid gap-0.5 my-1">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold line-clamp-2">
                        {movie?.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {t('year_release')}: {yearRelease}
                    </p>
                    <p className="text-muted-foreground text-sm">
                        {t('duration')}: {duration} {t('minutes')}
                    </p>
                </div>
            </div>

            {/* Bookmark Icon */}
            <div className="ml-auto flex items-center gap-1 cursor-pointer">
                <Bookmark />
            </div>
        </div>
    );
}

export function CardMovieHorizontalSkeleton() {
    return (
        <div className="flex items-center w-full gap-4">
            {/* Skeleton for Movie Poster */}
            <div className="flex items-stretch gap-2">
                <Skeleton className="rounded-lg w-20 h-32" />
                <div className="grid gap-1 my-1">
                    <Skeleton className="w-40 h-6" />
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-28 h-5" />
                </div>
            </div>

            {/* Skeleton for Bookmark */}
            <div className="ml-auto flex items-center gap-1">
                <Skeleton className="w-6 h-6 rounded-full" />
            </div>
        </div>
    );
}
