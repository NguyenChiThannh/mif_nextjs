'use client'

import { useRouter } from 'next/navigation'
import CardActor, { CardActorSkeleton } from '@/components/card-actor'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { actorApi } from '@/services/actorApi'

export default function ActorCarousel() {
  const router = useRouter()
  const { data, isLoading } = actorApi.query.useGetTopActors(0, 8)

  const handleDetailActor = (id) => {
    router.push(`/actor/${id}`)
  }

  if (isLoading) {
    return (
      <Carousel className='w-full h-auto'>
        <CarouselContent>
          {Array.from({ length: 5 }, (_, index) => (
            <CarouselItem
              key={index}
              className='lg:basis-1/4 md:basis-1/2 flex justify-center my-8'
            >
              <CardActorSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    )
  }

  return (
    <Carousel className='w-full h-auto'>
      <CarouselContent>
        {data?.content?.map((actor) => (
          <CarouselItem
            key={actor.id}
            className='lg:basis-1/5 md:basis-1/2 flex justify-center my-8 cursor-pointer'
            onClick={() => handleDetailActor(actor.id)}
          >
            <CardActor actor={actor} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
