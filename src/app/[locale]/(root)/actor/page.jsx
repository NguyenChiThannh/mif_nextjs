'use client'
import CardActorHorizontal, {
  CardActorHorizontalSkeleton,
} from '@/components/card-actor-horizontal'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import Title from '@/components/title'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { actorApi } from '@/services/actorApi'
import { useTranslations } from 'next-intl'
import React from 'react'
import { motion } from 'framer-motion'

export default function Actor() {
  const t = useTranslations('Actor')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    actorApi.query.useGetTopActorsInfinite()

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className='grid grid-cols-3 gap-10 px-4 py-8'>
      <div className='grid col-span-2'>
        <Title title={t('title')} isMore={false} />
        <motion.div
          variants={containerVariants}
          initial='hidden'
          animate='visible'
          className='mt-6 space-y-0.5 bg-background rounded-lg'
        >
          {isLoading && (
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <CardActorHorizontalSkeleton key={index} />
              ))}
            </>
          )}
          {data?.pages?.map((page, pageIndex) =>
            page.content.map((actor, actorIndex) => (
              <motion.div
                key={actor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: (pageIndex * page.content.length + actorIndex) * 0.1,
                }}
              >
                <CardActorHorizontal key={actor.id} actor={actor} />
              </motion.div>
            )),
          )}
          {isFetchingNextPage && <CardActorHorizontalSkeleton />}
          <div ref={observerElem} className='h-4'></div>
        </motion.div>
      </div>
      <SectionExploreMovies />
    </div>
  )
}
