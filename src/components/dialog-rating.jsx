import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import Rating from '@/components/rating'
import { schemaRatingMovie } from '@/lib/schemas/rating-movie.schema'
import { movieRatingsApi } from '@/services/movieRatingsApi'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useTranslations } from 'next-intl'

export default function DialogRating({ movieId }) {
  const t = useTranslations('Movie.Review')
  const tSchema = useTranslations('Schema.ratingMovie')
  const [isOpen, setIsOpen] = useState(false)
  const createRatingMutation = movieRatingsApi.mutation.useCreateRating(movieId)
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaRatingMovie(tSchema)),
    defaultValues: {
      ratingValue: 0,
      movieId,
      comment: '',
    },
  })

  const onSubmit = (data) => {
    createRatingMutation.mutate(data, {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='lg' variant='outline' onClick={() => setIsOpen(true)}>
          {t('button_rating')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('rating')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4 py-4'>
          <div className='flex items-center gap-4'>
            <p className='font-bold'>{t('rating_score')}</p>
            <Controller
              name='ratingValue'
              control={control}
              render={({ field }) => (
                <Rating
                  key={field.value}
                  enableUserInteraction
                  iconSize='xl'
                  value={field.value}
                  onClick={(newValue) => field.onChange(newValue)}
                  showOutOf
                />
              )}
            />
          </div>
          {errors.ratingValue && (
            <p className='text-red-500 text-sm font-bold'>
              {errors.ratingValue.message}
            </p>
          )}

          <p className='font-bold'>{t('rating_input')}</p>
          <Controller
            name='comment'
            control={control}
            render={({ field }) => <Textarea {...field} />}
          />
          {errors.comment && (
            <p className='text-red-500 text-sm font-bold'>
              {errors.comment.message}
            </p>
          )}

          <DialogFooter>
            <Button type='submit'>{t('button_rating')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
