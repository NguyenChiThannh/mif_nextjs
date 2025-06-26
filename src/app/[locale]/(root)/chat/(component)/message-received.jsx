import React from 'react'
import { format } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import Image from 'next/image'
import { cn } from '@/lib/utils'

const MessageReceived = ({ message, timestamp = new Date() }) => {
  const hasImage = message?.image
  const messageTime = format(new Date(timestamp), 'HH:mm')

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='flex items-start gap-2 mb-4'>
            <Avatar className='w-8 h-8 mt-1'>
              <AvatarImage
                src={message?.sender?.avatar || '/avatars/default.png'}
                alt='User Avatar'
              />
              <AvatarFallback>
                {message?.sender?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>

            <div className='flex flex-col space-y-2 max-w-[75%]'>
              {message?.sender?.name && (
                <span className='text-xs font-medium text-muted-foreground'>
                  {message.sender.name}
                </span>
              )}

              {hasImage && (
                <div className='rounded-lg overflow-hidden'>
                  <Image
                    src={message.image}
                    width={300}
                    height={300}
                    alt='Message image'
                    className='w-full rounded-lg aspect-auto object-cover'
                  />
                </div>
              )}

              {message?.content && (
                <div
                  className={cn(
                    'rounded-2xl rounded-tl-sm px-4 py-2 text-sm',
                    'bg-muted shadow-sm',
                  )}
                >
                  {message.content}
                </div>
              )}

              <span className='text-xs text-muted-foreground'>
                {messageTime}
              </span>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side='right'>
          <p className='text-xs'>{format(new Date(timestamp), 'PPP')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default MessageReceived
