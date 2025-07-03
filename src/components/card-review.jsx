import Rating from '@/components/rating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function CardReview({ review }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className='p-6 rounded-lg border border-border bg-card shadow-sm hover:shadow-lg transition-all duration-300'
    >
      <div className='flex items-start gap-4'>
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Avatar className='border-2 border-border w-12 h-12 hover:border-primary transition-colors duration-300'>
            <AvatarImage
              src={review.user.profilePictureUrl}
              alt={review.user.displayName || 'User'}
              className='object-cover'
            />
            <AvatarFallback className='uppercase text-sm bg-muted text-muted-foreground'>
              {review.user.displayName?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
        </motion.div>

        {/* User Details */}
        <div className='flex flex-col w-full gap-3'>
          <div className='flex items-center justify-between'>
            <Link href={`/user/${review.user.id}`} className='group'>
              <motion.p
                whileHover={{ x: 5 }}
                className='text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300'
              >
                {review.user.displayName}
              </motion.p>
            </Link>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className='flex items-center gap-2'
            >
              <Rating
                value={review.ratingValue}
                iconSize='m'
                showOutOf={true}
                enableUserInteraction={false}
              />
              <p className='text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-full'>
                {Number(review.ratingValue) * 2}/10
              </p>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className='text-sm text-muted-foreground line-clamp-4 leading-relaxed'
          >
            {review.comment}
          </motion.p>
        </div>
      </div>
    </motion.div>
  )
}

export const CardReviewSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className='p-6 rounded-lg border border-border bg-card shadow-sm'
    >
      <div className='flex items-start gap-4'>
        <Skeleton className='w-12 h-12 rounded-full bg-muted/50' />
        <div className='flex flex-col w-full gap-3'>
          <div className='flex items-center justify-between'>
            <Skeleton className='w-32 h-6 rounded bg-muted/50' />
            <Skeleton className='w-24 h-6 rounded bg-muted/50' />
          </div>
          <Skeleton className='w-full h-4 rounded bg-muted/50' />
          <Skeleton className='w-3/4 h-4 rounded bg-muted/50' />
        </div>
      </div>
    </motion.div>
  )
}
