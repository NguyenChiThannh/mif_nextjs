'use client'
import { CountrySelect } from '@/components/country-select'
import { DatePickerPopover } from '@/components/date-picker-popover'
import { FancyMultiSelect } from '@/components/fancy-multi-select'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useUploadImages from '@/hooks/useUploadImages'
import { schemaMovie } from '@/lib/schemas/movie.schema'
import { actorApi } from '@/services/actorApi'
import { movieApi } from '@/services/movieApi'
import { categoryApi } from '@/services/movieCategoriesApi'
import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'

export default function ActionsMovie() {
  const [idEdit, setIdEdit] = useState(false)

  const searchParams = useSearchParams()

  const { data: movie, isLoading: isLoadingMovie } =
    movieApi.query.useGetMovieById(idEdit, !!idEdit)

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setIdEdit(id)
  }, [])
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaMovie),
    defaultValues: {
      title: '',
      description: '',
      genreIds: [],
      releaseDate: undefined,
      directorId: [],
      castIds: [],
      posterUrl: '',
      trailerUrl: '',
      duration: '',
      country: '',
      budget: undefined,
      awards: [{ name: '', date: undefined }],
    },
  })

  useEffect(() => {
    if (movie) {
      reset({
        title: movie.title,
        description: movie.description,
        genreIds: movie.genre?.map((gerne) => gerne.id),
        releaseDate: new Date(movie.releaseDate),
        directorId: [],
        castIds: movie.castIds,
        posterUrl: movie.posterUrl,
        trailerUrl: movie.trailerUrl,
        duration: String(movie.duration),
        country: movie.country,
        budget: movie.budget,
        awards: movie.awards.map((award) => ({
          name: award.name,
          date: new Date(award.date),
        })),
      })
    }
  }, [movie])

  const { images, handleImageChange, removeImage, uploadImage } =
    useUploadImages()

  const handleSelectionGenre = (selected) => {
    setValue(
      'genreIds',
      selected.map((option) => option.value),
    )
  }

  const handleSelectionActor = (selected) => {
    setValue(
      'castIds',
      selected.map((option) => option.value),
    )
  }

  const route = useRouter()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'awards',
  })

  const { data: movieCategories, isLoading: isLoadingMovieCategories } =
    categoryApi.query.useGetAllmovieCategories()
  const { data: allActors, isLoading: isLoadingActors } =
    actorApi.query.useGetTopActors(0, 100)
  const createMovieMutation = movieApi.mutation.useCreateMovie()
  const updateMovieMutation = movieApi.mutation.useUpdateMovie()
  const addCastMutation = movieApi.mutation.useAddCast()

  if (isLoadingMovieCategories || isLoadingActors || isLoadingMovie)
    return <Loading />

  const initGernes = !!idEdit
    ? movie?.genre?.map((gerne) => {
        return {
          value: gerne.id,
          label: gerne.categoryName,
        }
      })
    : []

  const genres = movieCategories?.map((category) => {
    return {
      value: category.id,
      label: category.categoryName,
    }
  })

  const actors = allActors?.content?.map((actor) => {
    return {
      value: actor.id,
      label: actor.name,
    }
  })

  const onSubmit = async (data) => {
    if (idEdit) {
      const movieData = { ...data, movieId: idEdit }

      if (images) {
        const uploadedImageUrls = await Promise.all(images.map(uploadImage))
        movieData.posterUrl = uploadedImageUrls[0]
      }

      addCastMutation.mutate({
        movieId: movieData.movieId,
        castIds: movieData.castIds,
      })

      updateMovieMutation.mutate(movieData, {
        onSuccess: () => {
          route.push('/admin/dashboard/movies')
        },
      })
    } else {
      const uploadedImageUrls = await Promise.all(
        images.map((image) => uploadImage(image)),
      )

      createMovieMutation.mutate(
        {
          ...data,
          posterUrl: uploadedImageUrls[0],
        },
        {
          onSuccess: () => {
            route.push('/admin/dashboard/movies')
          },
        },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
      <div className='flex justify-between'>
        <p className='text-2xl font-bold'>Create Movie</p>
        <Button type='submit'>Submit</Button>
      </div>

      <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-4'>
          <p className='text-sm font-semibold pb-2'>Title</p>
          <Input {...register('title')} />
          {errors.title && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.title.message}
            </span>
          )}
        </div>
        <div className='col-span-1'>
          <p className='text-sm font-semibold pb-2'>Release Date</p>
          <Controller
            control={control}
            name='releaseDate'
            render={({ field }) => (
              <>
                <DatePickerPopover
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                />
                {errors.releaseDate && (
                  <span className='text-red-500 text-xs mt-1 font-bold'>
                    {errors.releaseDate.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div>
        <p className='text-sm pb-2 font-semibold'>Description</p>
        <Textarea {...register('description')} />
        {errors.description && (
          <span className='text-red-500 text-xs mt-1 font-bold'>
            {errors.description.message}
          </span>
        )}
      </div>

      <div>
        <p className='text-sm pb-2 font-semibold'>Actors</p>
        <FancyMultiSelect
          values={actors}
          initialSelected={[]}
          onSelectionChange={handleSelectionActor}
          placeholder={'Chọn diễn viên ...'}
        />
        {errors.castIds && (
          <span className='text-red-500 text-xs mt-1 font-bold'>
            {errors.castIds.message}
          </span>
        )}
      </div>

      <div className='grid grid-cols-9 gap-4'>
        <div className='col-span-7'>
          <p className='text-sm font-semibold pb-2'>Genre</p>
          <FancyMultiSelect
            values={genres}
            initialSelected={initGernes}
            onSelectionChange={handleSelectionGenre}
            placeholder={'Chọn thể loại ...'}
          />
          {errors.genreIds && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.genreIds.message}
            </span>
          )}
        </div>
        <div>
          <p className='text-sm font-semibold pb-2'>Country</p>
          <CountrySelect
            value={watch('country')}
            onChange={(newValue) => setValue('country', newValue)}
          />
          {errors.country && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.country.message}
            </span>
          )}
        </div>
      </div>

      <div className='grid grid-cols-4 gap-4'>
        <div className='col-span-2'>
          <p className='text-sm pb-2 font-semibold'>Poster</p>
          <Input
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            multiple
          />
          {errors.posterUrl && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.posterUrl.message}
            </span>
          )}
        </div>

        <div className='col-span-2'>
          <p className='text-sm pb-2 font-semibold'>Trailer URL</p>
          <Input {...register('trailerUrl')} />
          {errors.trailerUrl && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.trailerUrl.message}
            </span>
          )}
        </div>
      </div>

      <div className='grid grid-cols-2 gap-4'>
        <div className=''>
          <p className='text-sm font-semibold pb-2'>Duration</p>
          <Input {...register('duration')} />
          {errors.duration && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.duration.message}
            </span>
          )}
        </div>

        <div className=''>
          <p className='text-sm font-semibold pb-2'>Budget</p>
          <Input
            type='number'
            {...register('budget', {
              setValueAs: (v) => (v === '' ? undefined : parseFloat(v)),
            })}
          />
          {errors.budget && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.budget.message}
            </span>
          )}
        </div>
      </div>

      <div>
        <p className='text-sm pb-2 font-semibold'>Awards</p>
        {fields.map((field, index) => (
          <div key={field.id} className='grid grid-cols-5 gap-4 mb-2'>
            <div className='col-span-3'>
              <Input
                {...register(`awards.${index}.name`)}
                placeholder='Award Name'
              />
              {errors.awards &&
                errors.awards[index] &&
                errors.awards[index].name && (
                  <span className='text-red-500 text-xs mt-1 font-bold'>
                    {errors.awards[index].name.message}
                  </span>
                )}
            </div>
            <div className='flex col-span-2 items-center gap-2'>
              <Controller
                control={control}
                name={`awards.${index}.date`}
                render={({ field }) => (
                  <>
                    <DatePickerPopover
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                    />
                    {errors.awards &&
                      errors.awards[index] &&
                      errors.awards[index].date && (
                        <span className='text-red-500 text-xs mt-1 font-bold'>
                          {errors.awards[index].date.message}
                        </span>
                      )}
                  </>
                )}
              />
              <Button
                aria-haspopup='true'
                size='icon'
                variant='outline'
                onClick={() => remove(index)}
              >
                <X className='h-4 w-4' />
                <span className='sr-only'>Remove Award</span>
              </Button>
            </div>
          </div>
        ))}
        <Button
          variant='outline'
          onClick={() => append({ name: '', date: undefined })}
          className='w-fit'
        >
          Add Award
        </Button>
      </div>
    </form>
  )
}
