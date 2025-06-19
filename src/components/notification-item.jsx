import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton';
import { calculateTimeAgo } from '@/lib/formatter';
import { cn } from '@/lib/utils';
import { notificationApi } from '@/services/notificationApi';
import { Award, Shield, Star, Trophy } from 'lucide-react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import React from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BlockedPostDialog } from '@/components/dialog-blocked-post-notification';

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

  return (
    <motion.div
      className={cn("flex items-center gap-2", className)}
      whileHover={{ scale: 1.1, rotate: 5 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          badgeInfo.color,
          sizeClasses[size],
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
    </motion.div>
  )
}

function getBadgeInfo(level) {
  return BADGE_THRESHOLDS.find((threshold) => threshold.level === level)
}

export default function NotificationItem({ notification, onClick }) {
  const router = useRouter()
  const locale = useLocale()
  const markAsReadMutation = notificationApi.mutation.useMarkAsRead()
  const [showBlockedDialog, setShowBlockedDialog] = React.useState(false)

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
        router.push(`/groups/${notification.groupId}/members`)
        break
      case 'BADGE_EARNED':
        router.push(`/badge?level=${badgeLevel}&groupId=${notification.groupId}`)
        break
      case 'POST_BLOCKED':
        setShowBlockedDialog(true)
        break
      default:
        break
    }

    markAsReadMutation.mutate(notification.notifyId)
  }

  const badgeLevel = notification?.message?.split(' ').at(-1)?.replace(/!$/, '')

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        className={cn(
          "px-4 pt-4 pb-2 rounded-lg cursor-pointer transition-all duration-300",
          "bg-card shadow-sm hover:shadow-lg",
          "border border-border/50 hover:border-border",
          notification.isRead ? '' : 'bg-secondary'
        )}
        onClick={handleReadNotification}
      >
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="relative size-8">
              <Avatar className="size-10 border-2 border-border hover:border-primary transition-colors duration-300">
                <AvatarImage src={notification.groupAvatar} alt="Group Avatar" />
                <AvatarFallback className="uppercase text-sm bg-muted text-muted-foreground">
                  {notification.groupName?.[0] || 'G'}
                </AvatarFallback>
              </Avatar>

              {notification.type === "BADGE_EARNED" && badgeLevel && (
                <div className="absolute -bottom-3 -right-3">
                  <BadgeIcon level={badgeLevel} size="sm" showAnimation />
                </div>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex flex-col w-full gap-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex items-center justify-between"
            >
              <span className="text-sm font-medium line-clamp-2 text-foreground">
                {notification.message}
              </span>
            </motion.div>

            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-xs text-muted-foreground"
            >
              {calculateTimeAgo(new Date(notification.createdAt), locale)}
            </motion.span>
          </div>
        </div>
      </motion.div>

      {/* Blocked Post Dialog */}
      <BlockedPostDialog
        notification={notification}
        open={showBlockedDialog}
        onOpenChange={setShowBlockedDialog}
      />
    </>
  )
}

export function NotificationItemSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg border border-border/50 bg-card shadow-sm"
    >
      <div className="flex items-start gap-4">
        <Skeleton className="w-10 h-10 rounded-full bg-muted/50" />
        <div className="flex flex-col w-full gap-2">
          <Skeleton className="w-3/4 h-4 rounded bg-muted/50" />
          <Skeleton className="w-1/4 h-3 rounded bg-muted/50" />
        </div>
      </div>
    </motion.div>
  );
}

// Add this at the end of the file
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
`

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style")
  styleSheet.textContent = styles
  document.head.appendChild(styleSheet)
}


