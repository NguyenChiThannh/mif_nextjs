'use client'

import { useTranslations } from 'next-intl'
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { actorApi } from '@/services/actorApi'
import { favoriteActorsApi } from '@/services/favoriteActorsApi'
import Loading from '@/components/loading'
import DynamicImageGallery from '@/components/dynamic-image-gallery'
import Title from '@/components/title'
import HeaderSection from '@/app/[locale]/(root)/(profile)/actor/[id]/(sections)/header-section'
import BiographySection from '@/app/[locale]/(root)/(profile)/actor/[id]/(sections)/biography-section'
import AwardsSection from '@/app/[locale]/(root)/(profile)/actor/[id]/(sections)/awards-section'
import FilmographySection from '@/app/[locale]/(root)/(profile)/actor/[id]/(sections)/filmography-section'

export default function Actor() {
  const t = useTranslations('Profile.Actor')
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const { data: actor, isLoading: isActorLoading } = actorApi.query.useGetActorById(id)
  const addFavoriteActorMutation = favoriteActorsApi.mutation.useAddFavoriteActor()
  const removeFavoriteActorMutation = favoriteActorsApi.mutation.useRemoveFavoriteActor()
  const isActorFavoriteMutation = favoriteActorsApi.mutation.useIsActorFavorite()

  // Check if actor is favorite
  useEffect(() => {
    isActorFavoriteMutation.mutate(id, {
      onSuccess: (isFavorite) => {
        setLiked(isFavorite)
        setIsInitialLoading(false)
      },
      onError: () => setIsInitialLoading(false),
    })
  }, [id])

  if (isInitialLoading || isActorLoading) return <Loading />

  const handleLike = () => {
    setLiked(true)
    addFavoriteActorMutation.mutate(id, {
      onError: () => setLiked(false),
    })
  }

  const handleUnlike = () => {
    setLiked(false)
    removeFavoriteActorMutation.mutate(id, {
      onError: () => setLiked(true),
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <HeaderSection
        actor={actor}
        liked={liked}
        onLike={handleLike}
        onUnlike={handleUnlike}
        t={t}
      />

      <BiographySection bio={actor.bio} />

      <AwardsSection awards={actor.awards} t={t} />

      <div>
        <Title title={t("images")} isMore={false} />
        <div className="mt-4">
          <DynamicImageGallery />
        </div>
      </div>

      <FilmographySection actorId={id} t={t} />
    </div>
  )
}
