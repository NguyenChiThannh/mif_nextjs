'use client'
import { DialogCreateEvent } from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-create-event'
import CardEvent, { CardEventSkeleton } from '@/components/card-event'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { eventApi } from '@/services/eventApi'
import { useParams } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'

export default function EventsSection() {
  const { groupId } = useParams()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    eventApi.query.useGetEventsByGroupId(groupId)

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={containerVariants}
      className='flex-1 mt-6'
    >
      <motion.div
        variants={itemVariants}
        className='flex items-center justify-end mb-6'
      >
        <DialogCreateEvent groupId={groupId} />
      </motion.div>

      <motion.div
        variants={containerVariants}
        className='grid gap-6 w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3'
      >
        {isLoading && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <CardEventSkeleton />
              </motion.div>
            ))}
          </>
        )}
        {data?.pages?.map((page) =>
          page.content.map((event, index) => (
            <motion.div
              key={event.id}
              variants={itemVariants}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className='transition-all duration-200'
            >
              <CardEvent event={event} />
            </motion.div>
          )),
        )}
        {isFetchingNextPage && (
          <motion.div variants={itemVariants} className='col-span-full'>
            <CardEventSkeleton />
          </motion.div>
        )}
        <div ref={observerElem} className='h-4' />
      </motion.div>
    </motion.div>
  )
}
