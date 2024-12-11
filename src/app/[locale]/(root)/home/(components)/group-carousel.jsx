'use client';
import * as React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CardGroups, { CardGroupsSkeleton } from '@/components/card-groups';
import { groupsApi } from '@/services/groupsApi';
import { categoryApi } from '@/services/movieCategoriesApi';

export function GroupCarousel() {
    const { isLoading, data: groupNotJoin } = groupsApi.query.useFindGroupUserNotJoin(6)
    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()
    if (isLoading) {
        return (
            <div className="relative rounded-lg overflow-hidden">
                <Carousel
                    opts={{ align: 'start' }}
                >
                    <CarouselContent>
                        {groupNotJoin?.content?.map((group) => (
                            <CarouselItem key={group?.id}
                                className="lg:basis-1/3 md:basis-1/2 flex justify-center my-8 cursor-pointer"
                            >
                                <CardGroupsSkeleton />

                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        );
    }

    return (
        <div className="relative rounded-lg overflow-hidden">
            <Carousel
                opts={{ align: 'start' }}
            >
                <CarouselContent>
                    {groupNotJoin?.content?.map((group) => (
                        <CarouselItem key={group?.id}
                            className="lg:basis-1/3 md:basis-1/2 flex justify-center my-8 cursor-pointer"
                        >
                            <CardGroups key={group.id} group={group} initialStatus="join" categories={movieCategories} />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
