import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateTime } from '@/lib/formatter';
import { MessageCircle, Play } from 'lucide-react'
import React from 'react'

export default function Comment({ comment, setReplyTo, replyTo, onVote, userId }) {
    const voteCount = (comment.upvotes?.length || 0) - (comment.downvotes?.length || 0);
    const currentVote = comment.upvotes.some((id) => id === userId) ? 'upvote' : comment.downvotes.some((id) => id === userId) ? 'downvote' : null

    return (
        <div className="grid gap-3">
            <div className="flex gap-3 items-center">
                <Avatar className="w-8 h-8 flex items-center justify-center object-contain">
                    <AvatarImage src={comment.userAvatar} alt="@shadcn" />
                    <AvatarFallback className="flex items-center justify-center">T</AvatarFallback>
                </Avatar>
                <p className="font-bold">{comment.username} &middot;</p>
                <p className="text-xs text-muted-foreground">{formatDateTime(new Date(comment.createdAt))}</p>
            </div>
            <p className="ml-10 text-sm">{comment.content}</p>
            <div className="ml-4 flex items-center text-sm">
                <Button
                    variant="ghost"
                    className={`rounded-full ${currentVote === 'upvote'
                        ? 'text-green-500'
                        : ''
                        }`}
                    onClick={() => onVote(comment, 'upvote')}
                >
                    <Play
                        className="-rotate-90"
                        strokeWidth={1.5}
                        size={16}
                        fill={currentVote === 'upvote' ? 'currentColor' : 'none'}
                    />
                </Button>
                <span className={'min-w-8 text-center'}>
                    {voteCount}
                </span>
                <Button
                    variant="ghost"
                    className={`rounded-full ${currentVote === 'downvote'
                        ? 'text-red-500'
                        : ''
                        }`}
                    onClick={() => onVote(comment, 'downvote')}
                >
                    <Play
                        className="rotate-90"
                        strokeWidth={1.5}
                        size={16}
                        fill={currentVote === 'downvote' ? 'currentColor' : 'none'}
                    />
                </Button>
                {/* <Button
                    variant="ghost"
                    className="gap-1 items-center rounded-full text-sm hover:bg-muted"
                    onClick={() => {
                        setReplyTo(replyTo === comment.id ? null : comment.id);
                    }}
                >
                    <MessageCircle size={16} />
                    Phản hồi
                </Button> */}
            </div>
        </div>
    );
}


export const CommentSkeleton = () => {
    return (
        <div className="grid rounded-lg gap-4 w-40">
            {/* Skeleton for Image */}
            <Skeleton className="h-full w-full object-cover rounded-full aspect-square" />

            <div className="grid pb-2 gap-2">
                {/* Skeleton for Info */}
                <Skeleton className="flex justify-center h-4" />
                <Skeleton className="flex justify-center h-4" />
            </div>
        </div>
    );
};
