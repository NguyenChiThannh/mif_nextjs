import CardActorHorizontal from '@/components/card-actor-horizontal'
import CardReview, { CardReviewSkeleton } from '@/components/card-review'
import { movieRatingsApi } from '@/services/movieRatingsApi'
import React from 'react'

export function SectionReviewMovie({ movieId }) {
    const { isLoading: isLoadingReview, data: review } = movieRatingsApi.query.useGetAllRatingsByMovieId(movieId)

    return (
        <div className="space-y-2">
            {
                isLoadingReview
                    ?
                    <>
                        {Array.from(4).map((_, index) => {
                            return <CardReviewSkeleton key={index} />
                        })}
                    </>
                    :
                    <>
                        {
                            review.content.map((review, index) => {
                                return <CardReview review={review} key={index} />
                            })
                        }
                    </>
            }
        </div>

    )
}
