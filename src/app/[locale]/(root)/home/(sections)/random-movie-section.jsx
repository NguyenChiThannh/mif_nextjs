'use client'
import CardMovie, { CardMovieSkeleton } from '@/components/card-movie'
import { movieApi } from '@/services/movieApi'
import React from 'react'

export default function RandomMovieSection() {
  const { data, isLoading } = movieApi.query.useGetRandomMovies()
  if (isLoading)
    return (
      <>
        {Array.from({ length: 4 }, (_, index) => (
          <CardMovieSkeleton key={index} />
        ))}
      </>
    )
  return (
    <>
      {data?.map((movie) => (
        <CardMovie key={movie.id} movie={movie} />
      ))}
    </>
  )
}
