import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Users, CalendarDays, MapPinned, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { groupsApi } from '@/services/groupsApi'
import useUserId from '@/hooks/useUserId'
import { formatToVietnameseDateTime } from '@/lib/formatter'
import { Skeleton } from '@/components/ui/skeleton'
import { eventApi } from '@/services/eventApi'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function CardEvent({ event }) {
  const t = useTranslations('Event')
  const userId = useUserId()
  const [status, setStatus] = useState('')

  const subscribeToEventMutation = eventApi.mutation.useSubscribeToEvent()
  const unsubscribeFromEventMutation =
    eventApi.mutation.useUnsubscribeFromEvent()

  useEffect(() => {
    if (event.userJoin.some((id) => id === userId)) {
      setStatus('joined')
    } else {
      setStatus('join')
    }
  }, [userId])

  const handleEventAction = async (action) => {
    action === 'join' ? setStatus('joined') : setStatus('join')
    const mutation =
      action === 'join'
        ? subscribeToEventMutation
        : unsubscribeFromEventMutation
    mutation.mutate(event.id, {
      onError: () => {
        action === 'join' ? setStatus('join') : setStatus('joined')
      },
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <Card className='border-border bg-card hover:shadow-lg transition-all duration-300'>
        <CardContent className='flex flex-col gap-3 p-0 overflow-hidden'>
          <div className='relative w-full aspect-[16/12] overflow-hidden'>
            <Image
              src={event.eventPicture || '/group_default.jpg'}
              alt={event.eventName}
              fill
              className='object-cover transition-transform duration-300 hover:scale-105'
            />
          </div>
          <div className='p-4 space-y-3'>
            <div className='space-y-2'>
              <h3
                className='text-xl font-semibold text-foreground line-clamp-1'
                title={event.eventName}
              >
                {event.eventName}
              </h3>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <Users className='w-4 h-4' />
                <span className='text-sm'>
                  {event.userJoin.length || 0} {t('participate')}
                </span>
              </div>
              <div className='flex items-center gap-2 text-muted-foreground'>
                <CalendarDays className='w-4 h-4' />
                <span className='text-sm'>
                  {formatToVietnameseDateTime(event.startDate)}
                </span>
              </div>
              {event.eventType === 'ONLINE' ? (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <Monitor className='w-4 h-4' />
                  <span className='text-sm'>Online</span>
                </div>
              ) : (
                <div className='flex items-center gap-2 text-muted-foreground'>
                  <MapPinned className='w-4 h-4' />
                  <span className='text-sm'>Offline</span>
                </div>
              )}
            </div>

            <Button
              variant={status === 'join' ? 'default' : 'outline'}
              className={`w-full transition-all duration-200 ${
                status === 'join'
                  ? 'hover:bg-primary hover:text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() =>
                handleEventAction(status === 'joined' ? 'leave' : 'join')
              }
            >
              {status === 'joined'
                ? t('cancel_participate_event')
                : t('participate_event')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export const CardEventSkeleton = () => {
  return (
    <Card className='border-border bg-card'>
      <CardContent className='flex flex-col gap-3 p-0'>
        <Skeleton className='w-full aspect-[16/12] rounded-t-lg' />
        <div className='p-4 space-y-3'>
          <div className='space-y-2'>
            <Skeleton className='w-4/5 h-7' />
            <Skeleton className='w-3/5 h-4' />
            <Skeleton className='w-3/5 h-4' />
            <Skeleton className='w-3/5 h-4' />
          </div>
          <Skeleton className='w-full h-10' />
        </div>
      </CardContent>
    </Card>
  )
}
