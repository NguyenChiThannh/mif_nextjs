import CardActorHorizontal from '@/components/card-actor-horizontal'
import CardReview, { CardReviewSkeleton } from '@/components/card-review'
import { movieRatingsApi } from '@/services/movieRatingsApi'
import { motion } from 'framer-motion'
import React from 'react'

export function SectionReviewMovie({ movieId }) {
    const { isLoading: isLoadingReview, data: review } = movieRatingsApi.query.useGetAllRatingsByMovieId(movieId)

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4"
        >
            {isLoadingReview ? (
                <>
                    {Array.from(4).map((_, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                        >
                            <CardReviewSkeleton />
                        </motion.div>
                    ))}
                </>
            ) : (
                <>
                    {review.content.map((review, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                        >
                            <CardReview review={review} />
                        </motion.div>
                    ))}
                </>
            )}
        </motion.div>
    )
}
