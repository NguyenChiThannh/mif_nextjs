'use client'
import NotificationItem, {
  NotificationItemSkeleton,
} from '@/components/notification-item'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import useInfiniteScroll from '@/hooks/useInfiniteScroll'
import { useWebSocket } from '@/hooks/useWebSocket'
import { useAppSelector } from '@/redux/store'
import { notificationApi } from '@/services/notificationApi'
import { Bell } from 'lucide-react'
import { useState, useMemo } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDateOrTimeAgo } from '@/lib/formatter'
import BadgeIconNotification from '@/components/badge-icon-notification'
import { cn } from '@/lib/utils'

export function NotificationPopover({ t }) {
  const authState = useAppSelector((state) => state.auth.authState)
  const [liveNotifications, setLiveNotifications] = useState([])
  const [localUnreadCount, setLocalUnreadCount] = useState(0)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const {
    data: notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingNotifications,
  } = notificationApi.query.useGetAllNotifications()

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage)

  const {
    data: unreadNotificationCount,
    isLoading: isLoadingUnreadNotificationCount,
  } = notificationApi.query.useGetUnreadNotificationCount()

  const { isConnected } = useWebSocket(
    authState.accessToken,
    '/user/queue/notifications',
    (notification) => {
      setLiveNotifications((prev) => {
        const isDuplicate = prev.some(
          (existingNotification) => existingNotification.id === notification.id,
        )
        if (isDuplicate) {
          return prev
        } else {
          setLocalUnreadCount((prevCount) => prevCount + 1)
        }
        return [notification, ...prev]
      })
    },
  )

  // Tổng số lượng thông báo chưa đọc
  const totalUnreadNotificationCount =
    unreadNotificationCount + localUnreadCount

  // Kết hợp và sắp xếp thông báo theo thời gian
  const combinedNotifications = useMemo(() => {
    const notificationMap = new Map()

    // Thêm các thông báo từ API
    notifications?.pages.forEach((page) => {
      page.content.forEach((notification) => {
        notificationMap.set(notification.notifyId, {
          ...notification,
          createdAt: new Date(notification.createdAt),
        })
      })
    })

    // Thêm các thông báo từ liveNotifications
    liveNotifications.forEach((notification) => {
      notificationMap.set(notification.notifyId, {
        ...notification,
        createdAt: new Date(notification.createdAt),
      })
    })

    // Chuyển Map thành mảng và sắp xếp theo thời gian (mới nhất lên đầu)
    return Array.from(notificationMap.values()).sort(
      (a, b) => b.createdAt - a.createdAt,
    )
  }, [notifications?.pages, liveNotifications])

  if (isLoadingNotifications || isLoadingUnreadNotificationCount) return <></>

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className={cn(
            'relative transition-all duration-200',
            'hover:bg-accent/50 active:bg-accent/70',
            isPopoverOpen && 'bg-accent/30',
          )}
        >
          <BadgeIconNotification
            icon={Bell}
            {...(totalUnreadNotificationCount !== 0 && {
              badgeContent: totalUnreadNotificationCount,
            })}
          />
          <span className='sr-only'>Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[400px] p-0 border-border/50 shadow-lg'>
        <div className='flex flex-col h-[600px]'>
          {/* Header */}
          <div className='p-4 border-b border-border/50'>
            <h4 className='text-lg font-semibold text-foreground'>
              {t('notifications')}
            </h4>
          </div>

          {/* Content */}
          <ScrollArea className='flex-1'>
            <div className='p-2 space-y-1'>
              {combinedNotifications.length === 0 &&
                !isLoadingNotifications && (
                  <div className='flex items-center justify-center h-32 text-muted-foreground'>
                    <p>{t('no_have_notifications')}</p>
                  </div>
                )}

              {isLoadingNotifications && (
                <div className='space-y-1'>
                  <NotificationItemSkeleton />
                  <NotificationItemSkeleton />
                  <NotificationItemSkeleton />
                </div>
              )}

              {combinedNotifications.map((notification) => (
                <NotificationItem
                  key={notification.notifyId}
                  notification={notification}
                  t={t}
                />
              ))}

              {isFetchingNextPage && (
                <div className='py-2'>
                  <NotificationItemSkeleton />
                </div>
              )}

              <div ref={observerElem} className='h-4' />
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  )
}
