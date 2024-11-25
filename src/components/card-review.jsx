import Rating from '@/components/rating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function CardReview({ review }) {
    return (
        <div className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="border w-12 h-12">
                    <AvatarImage src={review.user.profilePictureUrl} alt={review.user.displayName || 'User'} />
                    <AvatarFallback className="uppercase text-sm bg-muted">
                        {review.user.displayName?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>

                {/* User Details */}
                <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-semibold text-foreground">{review.user.displayName}</p>
                        <div className="flex items-center gap-2">
                            <Rating
                                value={review.ratingValue}
                                iconSize="m"
                                showOutOf={true}
                                enableUserInteraction={false}
                            />
                            <p className="text-xs text-muted-foreground">{Number(review.ratingValue) * 2}/10</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                        {review.comment}
                    </p>
                </div>
            </div>
        </div>
    )
}

export const CardReviewSkeleton = () => {
    return (
        <div className="p-4 rounded-lg border bg-card shadow-sm">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex flex-col w-full gap-3">
                    <Skeleton className="w-32 h-6 rounded bg-muted" />
                    <Skeleton className="w-full h-4 rounded bg-muted" />
                    <Skeleton className="w-full h-4 rounded bg-muted" />
                </div>
            </div>
        </div>
    )
}
