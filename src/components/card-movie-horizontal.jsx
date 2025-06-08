import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { motion } from 'framer-motion';

export default function CardMovieSmall({ movie }) {
    const router = useRouter();
    const t = useTranslations('Movie');

    const handleDetailMovie = () => {
        router.push(`/movies/${movie.id}`);
    };

    const yearRelease = movie?.releaseDate?.split('-')[0] || 'N/A';
    const duration = movie?.duration;

    return (
        <motion.div
            className="flex items-center w-full p-4 hover:bg-muted/30 transition-colors duration-200 border-b last:border-b-0"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            {/* Movie Details */}
            <div
                className="flex items-stretch gap-4 cursor-pointer w-full"
                onClick={handleDetailMovie}
            >
                <div className="relative overflow-hidden rounded-lg aspect-[3/4] w-24 flex-shrink-0">
                    <Image
                        src={movie?.posterUrl}
                        alt={movie?.title || 'Movie Poster'}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                </div>
                <div className="grid gap-1 my-1 min-w-0 flex-1">
                    <h3 className="text-base font-semibold text-foreground line-clamp-2 hover:text-primary transition-colors duration-200">
                        {movie?.title}
                    </h3>
                    <div className="grid gap-0.5 text-sm text-muted-foreground">
                        <p>
                            {t('year_release')}: {yearRelease}
                        </p>
                        <p>
                            {t('duration')}: {duration} {t('minutes')}
                        </p>
                        <p>
                            <span className="font-medium">{movie.country}</span>
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function CardMovieSmallSkeleton() {
    return (
        <div className="flex items-center w-full p-4 border-b last:border-b-0">
            {/* Skeleton for Movie Poster */}
            <div className="flex items-stretch gap-4 w-full">
                <Skeleton className="rounded-lg w-24 aspect-[3/4] flex-shrink-0" />
                <div className="grid gap-1 my-1 min-w-0 flex-1">
                    <Skeleton className="w-full h-6" />
                    <div className="grid gap-0.5">
                        <Skeleton className="w-32 h-4" />
                        <Skeleton className="w-28 h-4" />
                        <Skeleton className="w-24 h-4" />
                    </div>
                </div>
            </div>
        </div>
    );
}
