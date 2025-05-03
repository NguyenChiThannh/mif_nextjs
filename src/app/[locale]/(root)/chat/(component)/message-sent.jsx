import React from 'react';
import { format } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const MessageSent = ({ message, timestamp = new Date() }) => {
    const hasImage = message?.image;
    const messageTime = format(new Date(timestamp), 'HH:mm');

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="flex items-start justify-end gap-2 mb-4">
                        <div className="flex flex-col items-end space-y-2 max-w-[75%]">
                            {hasImage && (
                                <div className="rounded-lg overflow-hidden ml-auto">
                                    <Image
                                        src={message.image}
                                        width={300}
                                        height={300}
                                        alt="Message image"
                                        className="w-full rounded-lg aspect-auto object-cover"
                                    />
                                </div>
                            )}

                            {message?.content && (
                                <div className={cn(
                                    "rounded-2xl rounded-tr-sm px-4 py-2 text-sm ml-auto",
                                    "bg-primary text-primary-foreground shadow-sm"
                                )}>
                                    {message.content}
                                </div>
                            )}

                            <span className="text-xs text-muted-foreground">
                                {messageTime}
                            </span>
                        </div>

                        <Avatar className="w-8 h-8 mt-1">
                            <AvatarImage src={message?.sender?.avatar || "/avatars/default.png"} alt="Your Avatar" />
                            <AvatarFallback>{message?.sender?.name?.[0] || 'Y'}</AvatarFallback>
                        </Avatar>
                    </div>
                </TooltipTrigger>
                <TooltipContent side="left">
                    <p className="text-xs">{format(new Date(timestamp), 'PPP')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default MessageSent;
