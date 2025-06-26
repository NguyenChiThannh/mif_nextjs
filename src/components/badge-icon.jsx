import { Award, Shield, Star, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export const BADGE_THRESHOLDS = [
  {
    level: 'PLATINUM',
    color:
      'bg-gradient-to-r from-blue-200 via-slate-100 to-purple-200 text-slate-800 border-2 border-slate-300 shadow-inner',
  },
  {
    level: 'GOLD',
    color:
      'bg-gradient-to-r from-yellow-200 to-amber-400 text-amber-900 border-2 border-yellow-500 shadow-inner',
  },
  {
    level: 'SILVER',
    color:
      'bg-gradient-to-r from-gray-200 to-slate-300 text-slate-700 border-2 border-gray-400 shadow-inner',
  },
  {
    level: 'BRONZE',
    color:
      'bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 border-2 border-amber-900 shadow-inner',
  },
]

export function BadgeIcon({
  level,
  size = 'sm',
  className,
  showAnimation = false,
}) {
  if (!level) return null

  const badgeInfo = BADGE_THRESHOLDS.find(
    (threshold) => threshold.level === level,
  )
  if (!badgeInfo) return null

  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
  }

  const getBadgeIcon = (level) => {
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

  const animationClass = showAnimation
    ? 'transition-all duration-700 hover:scale-110 hover:rotate-3 hover:shadow-lg'
    : ''

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center',
          badgeInfo.color,
          sizeClasses[size],
          animationClass,
          'relative overflow-hidden',
        )}
      >
        {/* Shine effect */}
        <div className='absolute inset-0 opacity-30 bg-gradient-to-br from-white via-transparent to-transparent' />

        {/* Badge icon */}
        {getBadgeIcon(level)}

        {/* Subtle ring */}
        <div className='absolute inset-0 rounded-full border border-white/20' />
      </div>
    </div>
  )
}
