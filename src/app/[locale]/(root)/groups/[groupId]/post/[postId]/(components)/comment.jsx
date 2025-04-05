import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { formatDateOrTimeAgo, formateTimestampToIso, formatToVietnameseDateTime } from '@/lib/formatter';
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
                <p className="text-xs text-muted-foreground">{formatDateOrTimeAgo(comment.createAt)}</p>
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
        <div className="flex p-1 rounded border-b-2 items-center">
            <div className="flex items-center gap-2">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="grid gap-2 py-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-64 h-4" />
                </div>
            </div>
        </div>
    );
};
