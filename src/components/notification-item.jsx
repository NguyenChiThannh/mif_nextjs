import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton';
import { calculateTimeAgo } from '@/lib/formatter';
import { notificationApi } from '@/services/notificationApi';
import { useRouter } from 'next/navigation';
import React from 'react'

export default function NotificationItem({ notification, onClick }) {
  const router = useRouter();
  const markAsReadMutation = notificationApi.mutation.useMarkAsRead();
  console.log('🚀 ~ NotificationItem ~ notification.message:', notification.message)

  const handleReadNotification = () => {
    // Gọi callback onClick để đóng popover
    if (onClick) onClick();

    if (notification.type === 'UP_VOTE' || notification.type === 'DOWN_VOTE' || notification.type === 'REMOVE_VOTE' || notification.type === 'COMMENT') {
      router.push(`/groups/${notification.groupId}/post/${notification.groupPostId}`);
    }
    else if (notification.type === 'EVENT') {
      router.push(`/groups/${notification.groupId}/events`);
    }
    else if (notification.type === 'ACCEPT_REQUEST' || notification.type === 'JOIN_REQUEST') {
      router.push(`/groups/${notification.groupId}`);
    }
    markAsReadMutation.mutate(notification.notifyId);
  };

  return (
    <div
      className={`flex gap-2 p-2 rounded-md cursor-pointer ${notification.isRead ? "" : "bg-secondary"}`}
      onClick={handleReadNotification}
    >
      <Avatar className="size-8 flex items-center justify-center">
        <AvatarImage src={notification.groupAvatar} alt="@shadcn" />
        <AvatarFallback className="flex items-center justify-center">T</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <span className="text-sm gap-2 line-clamp-2">
          {notification.message}
        </span>
        <span className="text-xs text-muted-foreground">{calculateTimeAgo(new Date(notification.createdAt))}</span>
      </div>
    </div>
  );
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


