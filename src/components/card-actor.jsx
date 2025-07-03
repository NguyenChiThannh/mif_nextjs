import { Skeleton } from '@/components/ui/skeleton'
import { Triangle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'

export default function CardActor({ actor }) {
  const { name, rank } = actor

  return (
    <motion.div
      className='grid rounded-lg gap-4 w-40 group'
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      {/* Actor Image */}
      <motion.div
        className='relative overflow-hidden rounded-full'
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={actor.profilePictureUrl}
          alt={`${name} image`}
          width={200}
          height={200}
          className='h-full w-full object-cover rounded-full aspect-square border-2 border-border transition-colors duration-300'
        />
      </motion.div>

      {/* Actor Details */}
      <div className='pb-2'>
        <Link href={`/actor/${actor.id}`}>
          <motion.p
            className='flex justify-center text-base font-semibold text-foreground hover:text-primary transition-colors duration-200'
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            {name}
          </motion.p>
        </Link>
      </div>
    </motion.div>
  )
}

export const CardActorSkeleton = () => {
  return (
    <motion.div
      className='grid rounded-lg gap-4 w-40'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Skeleton for Image */}
      <Skeleton className='h-full w-full object-cover rounded-full aspect-square bg-muted' />

      <div className='grid pb-2 gap-2'>
        {/* Skeleton for Name and Rank */}
        <Skeleton className='flex justify-center h-4 bg-muted' />
        <Skeleton className='flex justify-center h-4 bg-muted' />
      </div>
    </motion.div>
  )
}
