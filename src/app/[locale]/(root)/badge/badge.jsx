'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Award, Shield, Star, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export const BADGE_THRESHOLDS = [
  {
    level: 'PLATINUM',
    color:
      'bg-gradient-to-r from-blue-200 via-slate-100 to-purple-200 text-slate-800 border-2 border-slate-300 shadow-inner',
    hoverColor: 'hover:from-blue-300 hover:via-slate-200 hover:to-purple-300',
  },
  {
    level: 'GOLD',
    color:
      'bg-gradient-to-r from-yellow-200 to-amber-400 text-amber-900 border-2 border-yellow-500 shadow-inner',
    hoverColor: 'hover:from-yellow-300 hover:to-amber-500',
  },
  {
    level: 'SILVER',
    color:
      'bg-gradient-to-r from-gray-200 to-slate-300 text-slate-700 border-2 border-gray-400 shadow-inner',
    hoverColor: 'hover:from-gray-300 hover:to-slate-400',
  },
  {
    level: 'BRONZE',
    color:
      'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 border-2 border-amber-900 shadow-inner',
    hoverColor: 'hover:from-amber-700 hover:to-amber-900',
  },
]

function getBadgeIcon(level, size = 'md') {
  switch (level) {
    case 'PLATINUM':
      return (
        <Trophy
          className={cn(
            'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-7 w-7',
          )}
        />
      )
    case 'GOLD':
      return (
        <Star
          className={cn(
            'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-7 w-7',
          )}
        />
      )
    case 'SILVER':
      return (
        <Shield
          className={cn(
            'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-7 w-7',
          )}
        />
      )
    case 'BRONZE':
      return (
        <Award
          className={cn(
            'h-4 w-4',
            size === 'md' && 'h-5 w-5',
            size === 'lg' && 'h-7 w-7',
          )}
        />
      )
    default:
      return <Award className={cn('h-4 w-4')} />
  }
}

export function Badge({ level, size = 'lg', showLabel = true }) {
  const badgeInfo = BADGE_THRESHOLDS.find(
    (threshold) => threshold.level === level,
  )
  if (!badgeInfo) return null

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-20 w-20 text-lg',
    xl: 'h-32 w-32 text-2xl',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='flex flex-col items-center gap-6'
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'rounded-full flex items-center justify-center',
          badgeInfo.color,
          badgeInfo.hoverColor,
          sizeClasses[size],
          'transition-all duration-500',
          'relative overflow-hidden group',
        )}
      >
        {/* Shine effect */}
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: 'linear',
          }}
          className='absolute inset-0 opacity-30 bg-gradient-to-br from-white via-transparent to-transparent'
        />

        {/* Badge icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {getBadgeIcon(level, size)}
        </motion.div>

        {/* Subtle ring */}
        <div className='absolute inset-0 rounded-full border border-white/20' />
      </motion.div>

      {showLabel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className='text-center'
        >
          <h3 className='font-semibold text-xl text-foreground'>
            {badgeInfo.level}
          </h3>
        </motion.div>
      )}
    </motion.div>
  )
}

export function Badges() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      className='grid grid-cols-2 md:grid-cols-4 gap-8'
    >
      {BADGE_THRESHOLDS.map((badge) => (
        <motion.div
          key={badge.level}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Badge level={badge.level} />
        </motion.div>
      ))}
    </motion.div>
  )
}
