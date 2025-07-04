'use client'

import CardReview, { CardReviewSkeleton } from '@/components/card-review'
import Loading from '@/components/loading'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import Title from '@/components/title'
import { Pagination } from '@/components/ui/pagination'
import { movieApi } from '@/services/movieApi'
import { movieRatingsApi } from '@/services/movieRatingsApi'
import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import React from 'react'

export default function MovieReviewsPage() {
  const t = useTranslations('Movie.Review')
  const { id: movieId } = useParams()

  const { isLoading: isLoadingMovie, data: movie } =
    movieApi.query.useGetMovieById(movieId)
  const {
    data: review,
    isLoading: isLoadingReview,
    isError: isErrorReview,
  } = movieRatingsApi.query.useGetAllRatingsByMovieId(movieId, 0, 100)

  if (isLoadingMovie) {
    return <Loading />
  }
  if (isLoadingReview) {
    return (
      <div className='p-4'>
        <Title title={t('movie_review')} isMore={false} />
        <div className='grid gap-4 mt-6'>
          {Array.from({ length: 5 }).map((_, index) => (
            <CardReviewSkeleton key={index} />
          ))}
        </div>
      </div>
    )
  }

  if (isErrorReview || !review?.content.length) {
    return (
      <div className='p-4 text-center'>
        <Title title={t('movie_review')} isMore={false} />
        <p className='text-muted-foreground mt-4'>{t('no_review')}</p>
      </div>
    )
  }

  return (
    <div>
      <p className='text-2xl md:text-3xl font-bold px-4'>{movie.title}</p>
      <div className='grid grid-cols-[7fr,3fr]'>
        <div className='p-4'>
          <Title title={t('movie_review')} isMore={false} />
          <div className='grid gap-4 mt-6'>
            {review.content.map((review) => (
              <CardReview key={review.id} review={review} />
            ))}
          </div>
        </div>
        <SectionExploreMovies />
      </div>
    </div>
  )
}
