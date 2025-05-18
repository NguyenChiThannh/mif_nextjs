import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton';
import { calculateTimeAgo } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { notificationApi } from '@/services/notificationApi';
import { Award, Shield, Star, Trophy } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react'

export const BADGE_THRESHOLDS = [
  {
    level: "PLATINUM",
    color:
      "bg-gradient-to-r from-blue-200 via-slate-100 to-purple-200 text-slate-800 border-2 border-slate-300 shadow-inner",
  },
  {
    level: "GOLD",
    color: "bg-gradient-to-r from-yellow-300 to-amber-400 text-amber-900 border-2 border-yellow-500 shadow-inner",
  },
  {
    level: "SILVER",
    color: "bg-gradient-to-r from-gray-200 to-slate-300 text-slate-700 border-2 border-gray-400 shadow-inner",
  },
  {
    level: "BRONZE",
    color: "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 border-2 border-amber-900 shadow-inner",
  },
]

export function BadgeIcon({
  level,
  size = "md",
  showLabel = false,
  className,
  showAnimation = false,
}) {
  if (!level) return null

  const badgeInfo = getBadgeInfo(level)
  if (!badgeInfo) return null

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-base",
  }

  const getBadgeIcon = (level) => {
    switch (level) {
      case "PLATINUM":
        return <Trophy className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
      case "GOLD":
        return <Star className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
      case "SILVER":
        return <Shield className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
      case "BRONZE":
        return <Award className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
      default:
        return <Award className={cn("h-4 w-4")} />
    }
  }

  const animationClass = showAnimation
    ? "transition-all duration-700 hover:scale-110 hover:rotate-3 hover:shadow-lg"
    : ""

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          badgeInfo.color, 
          sizeClasses[size],
          animationClass,
          "relative overflow-hidden"
        )}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white via-transparent to-transparent" />

        {/* Badge icon */}
        {getBadgeIcon(level)}

        {/* Subtle ring */}
        <div className="absolute inset-0 rounded-full border border-white/20" />
      </div>
    </div>
  )
}

function getBadgeInfo(level) {
  return BADGE_THRESHOLDS.find((threshold) => threshold.level === level)
}


export default function NotificationItem({ notification, onClick }) {
  const router = useRouter()
  const locale = useLocale()
  const markAsReadMutation = notificationApi.mutation.useMarkAsRead()

  const handleReadNotification = () => {
    if (onClick) onClick()

    switch (notification.type) {
      case 'UP_VOTE':
      case 'DOWN_VOTE':
      case 'REMOVE_VOTE':
      case 'COMMENT':
        router.push(`/groups/${notification.groupId}/post/${notification.groupPostId}`)
        break
      case 'EVENT':
        router.push(notification.url || `/groups/${notification.groupId}/events`)
        break
      case 'ACCEPT_REQUEST':
      case 'JOIN_REQUEST':
      case 'BADGE_EARNED':
        router.push(`/badge?level=${badgeLevel}&groupId=${notification.groupId}`)
        break
      default:
        break
    }

    markAsReadMutation.mutate(notification.notifyId)
  }

  const badgeLevel = notification?.message?.split(' ').at(-1)?.replace(/!$/, '')

  return (
    <div
      className={`flex gap-2 p-2 rounded-md cursor-pointer ${notification.isRead ? '' : 'bg-secondary'}`}
      onClick={handleReadNotification}
    >
      <div className="relative size-8">
        <Avatar className="size-8">
          <AvatarImage src={notification.groupAvatar} alt="Group Avatar" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>

        {notification.type === "BADGE_EARNED" && badgeLevel && (
          <div className="absolute -bottom-1 -right-1">
            <BadgeIcon level={badgeLevel} size="sm" showAnimation />
          </div>
        )}
      </div>

      <div className="flex flex-col w-full">

        <div className='flex items-center gap-2'>
          <span className="text-sm gap-2 line-clamp-2">{notification.message}</span>
        </div>

        <span className="text-xs text-muted-foreground">
          {calculateTimeAgo(new Date(notification.createdAt), locale)}
        </span>
      </div>
    </div>
  )
}


export function NotificationItemSkeleton() {
  return (
    <div className="flex gap-2 p-2 rounded-md  animate-pulse">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="flex flex-col flex-1 space-y-2">
        <Skeleton className="w-1/2 h-4 rounded" />
        <Skeleton className="w-3/4 h-4 rounded" />
      </div>
    </div>
  );
}


