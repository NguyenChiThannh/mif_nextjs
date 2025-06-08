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
import { motion } from 'framer-motion'

export default function Actor() {
  const t = useTranslations('Profile.Actor')
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [favoriteCount, setFavoriteCount] = useState(0)

  const { data: actor, isLoading: isActorLoading } = actorApi.query.useGetActorById(id)
  const addFavoriteActorMutation = favoriteActorsApi.mutation.useAddFavoriteActor()
  const removeFavoriteActorMutation = favoriteActorsApi.mutation.useRemoveFavoriteActor()
  const isActorFavoriteMutation = favoriteActorsApi.mutation.useIsActorFavorite()

  // Set initial favorite count
  useEffect(() => {
    if (actor?.favoriteCount) {
      setFavoriteCount(actor.favoriteCount)
    }
  }, [actor?.favoriteCount])

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
    setFavoriteCount(prev => prev + 1)
    addFavoriteActorMutation.mutate(id, {
      onError: () => {
        setLiked(false)
        setFavoriteCount(prev => prev - 1)
      }
    })
  }

  const handleUnlike = () => {
    setLiked(false)
    setFavoriteCount(prev => prev - 1)
    removeFavoriteActorMutation.mutate(id, {
      onError: () => {
        setLiked(true)
        setFavoriteCount(prev => prev + 1)
      }
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div
      className="max-w-4xl mx-auto p-4 space-y-8 bg-background min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <HeaderSection
          actor={actor}
          liked={liked}
          onLike={handleLike}
          onUnlike={handleUnlike}
          favoriteCount={favoriteCount}
          t={t}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <BiographySection bio={actor.bio} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AwardsSection awards={actor.awards} t={t} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Title title={t("images")} isMore={false} />
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <DynamicImageGallery type="actor" />
        </motion.div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <FilmographySection actorId={id} t={t} />
      </motion.div>
    </motion.div>
  )
}
