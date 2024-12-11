'use client';
import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Autoplay from 'embla-carousel-autoplay';
import Rating from '@/components/rating';
import { Button } from '@/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useState } from 'react';
import clsx from 'clsx';
import { movieApi } from '@/services/movieApi';
import { Skeleton } from '@/components/ui/skeleton';

export function MainCarousel() {
    const [saved, setSaved] = useState(false);
    const router = useRouter();

    const { isLoading, data } = movieApi.query.useGetNewestMovie(0, 6);

    const handleDetailMovie = (id) => {
        router.push(`/movies/${id}`);
    };

    if (isLoading) {
        return (
            <Skeleton className="lg:h-[550px] md:h-[450px] h-[300px] w-full drop-shadow-2xl rounded-lg" />
        );
    }

    return (
        <div className="relative rounded-lg overflow-hidden">
            <Carousel
                opts={{ align: 'start', loop: true }}
                plugins={[Autoplay({ delay: 3000 })]}
                className="lg:h-[550px] md:h-[450px] h-[300px] w-full drop-shadow-2xl rounded-lg"
            >
                <CarouselContent>
                    {data?.content?.map((movie) => (
                        <CarouselItem key={movie?.id}>
                            <div >
                                <Card className="rounded-lg overflow-hidden">
                                    <CardContent
                                        className="lg:h-[550px] md:h-[450px] h-[300px] relative flex items-center justify-center "
                                        onClick={() => handleDetailMovie(movie?.id)}
                                    >
                                        <div className="absolute inset-0">
                                            <Image
                                                src={movie?.posterUrl}
                                                alt={movie?.title}
                                                layout="fill"
                                                objectFit="cover"
                                                className="rounded-lg"
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="lg:space-y-6 lg:p-10 md:p-8 md:space-y-2 space-y-2 absolute bottom-0 left-0 flex flex-col items-start p-2 w-full">
                                            <h1 className="text-xl md:text-3xl lg:text-5xl font-bold text-white">{movie?.title}</h1>
                                            <div className="md:space-x-4 space-x-2 flex items-center">
                                                <Rating
                                                    value={movie.ratings?.averageRating}
                                                    iconSize="l"
                                                    showOutOf
                                                    enableUserInteraction={false}
                                                />
                                                <span className="text-white text-sm md:text-lg font-medium">
                                                    {(Number(movie.ratings?.averageRating) * 2) || '0.0'} /10
                                                </span>
                                                <div onClick={() => setSaved(!saved)} className="cursor-pointer">
                                                    <Bookmark
                                                        className={clsx({
                                                            'text-yellow-500 fill-yellow-500': saved,
                                                            'text-white fill-none': !saved,
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                            <p className="text-white text-sm md:text-lg lg:text-base w-full line-clamp-2 text-justify">
                                                {movie?.description}
                                            </p>
                                            <Button
                                                size="lg"
                                                className="text-base font-bold"
                                                onClick={() => handleDetailMovie(movie?.id)}
                                            >
                                                Xem Trailer
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
