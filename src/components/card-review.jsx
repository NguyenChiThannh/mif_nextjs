import Rating from '@/components/rating'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function CardReview({ review }) {
    return (
        <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <Avatar className="border w-12 h-12">
                    <AvatarImage src={review.user.profilePictureUrl} alt={review.user.displayName || 'User'} />
                    <AvatarFallback className="uppercase text-sm">
                        {review.user.displayName?.[0] || 'U'}
                    </AvatarFallback>
                </Avatar>

                {/* User Details */}
                <div className="flex flex-col w-full gap-2">
                    <div className="flex items-center justify-between">
                        <p className="text-base font-semibold">{review.user.displayName || 'Ẩn danh'}</p>
                        <div className="flex items-center gap-2">
                            <Rating
                                value={review.ratingValue}
                                iconSize="m"
                                showOutOf={true}
                                enableUserInteraction={false}
                            />
                            <p className="text-xs text-gray-500">{Number(review.ratingValue) * 2}/10</p>
                        </div>
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-4">{review.comment || 'Không có nhận xét.'}</p>
                </div>
            </div>
        </div>
    )
}

export const CardReviewSkeleton = () => {
    return (
        <div className="p-4 rounded-lg border bg-white shadow-sm">
            <div className="flex items-center gap-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex flex-col w-full gap-3">
                    <Skeleton className="w-32 h-6 rounded" />
                    <Skeleton className="w-full h-4 rounded" />
                    <Skeleton className="w-full h-4 rounded" />
                </div>
            </div>
        </div>
    )
}
