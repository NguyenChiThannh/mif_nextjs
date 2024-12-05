'use client'

import DynamicImageGallery from '@/components/dynamic-image-gallery'
import Title from '@/components/title'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { actorApi } from '@/services/actorApi'
import { favoriteActorsApi } from '@/services/favoriteActorsApi'
import { Award, Camera, ChevronDown, Heart, HeartOff, Triangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import CardMovie, { CardMovieSkeleton } from '@/components/card-movie'
import Loading from '@/components/loading'
import { useTranslations } from 'next-intl'
import FilmographySection from '@/app/[locale]/(root)/(profile)/actor/[id]/(section)/filmography-section'
import { useParams } from 'next/navigation'

export default function Actor() {
  const t = useTranslations('Profile.Actor')
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  const { data: actor, isLoading: isActorLoading } = actorApi.query.useGetActorById(id)


  const addFavoriteActorMutation = favoriteActorsApi.mutation.useAddFavoriteActor()
  const removeFavoriteActorMutation = favoriteActorsApi.mutation.useRemoveFavoriteActor()
  const isActorFavoriteMutation = favoriteActorsApi.mutation.useIsActorFavorite()

  useEffect(() => {
    isActorFavoriteMutation.mutate(id, {
      onSuccess: (isFavorite) => {
        setLiked(isFavorite)
        setIsInitialLoading(false)
      },
      onError: () => {
        setIsInitialLoading(false)
      },
    })
  }, [id])


  if (isInitialLoading || isActorLoading) {
    return <Loading />
  }

  const handleAddFavoriteActor = () => {
    setLiked(true)
    addFavoriteActorMutation.mutate(id, {
      onError: () => setLiked(false),
    })
  }

  const handleRemoveFavoriteActor = () => {
    setLiked(false)
    removeFavoriteActorMutation.mutate(id, {
      onError: () => setLiked(true),
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Avatar className="w-32 h-32">
            <AvatarImage src={actor.profilePictureUrl} alt={actor.name || 'Actor Avatar'} />
            <AvatarFallback>Actor</AvatarFallback>
          </Avatar>
        </div>

        <div className="text-xl font-bold text-center">{actor.name}</div>

        <div className="text-sm font-medium">
          {t("like_level")}: {10}
        </div>

        <div className="flex items-center text-sm font-medium">
          <span>{t("rank")}: #16 (</span>
          <Triangle
            className={`${true ? 'fill-green-500 text-green-500' : 'rotate-180 fill-red-500 text-red-500'} mx-1`}
            size="10px"
          />
          <span>16)</span>
        </div>

        {/* Favorite Actions */}
        {liked ? (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" className="flex items-center gap-1">
                <span>{t("liked")}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleRemoveFavoriteActor}>
                <HeartOff className="w-4 h-4 mr-2" />
                {t("unlike")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleAddFavoriteActor} className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            <span>{t("like")}</span>
          </Button>
        )}
      </div>

      {/* Biography Section */}
      {actor?.bio && (
        <div className="bg-card rounded-lg p-4 shadow">
          <p className="text-justify">{actor.bio}</p>
        </div>
      )}

      {/* Awards Section */}
      {actor?.awards?.length > 0 && (
        <div>
          <Title title="Giải thưởng" isMore={false} />
          <ul className="mt-4 space-y-2">
            {actor.awards.map((award) => (
              <li key={award.id} className="flex items-center gap-2 font-medium">
                <Award className="text-yellow-500 w-5 h-5" />
                <span>{award.name} - {award?.date?.split('-')[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Images Section */}
      <div>
        <Title title="Ảnh" isMore={false} />
        <div className="mt-4">
          <DynamicImageGallery />
        </div>
      </div>

      {/* Filmography Section */}
      <FilmographySection actorId={id} t={t} />
    </div>
  )
}
