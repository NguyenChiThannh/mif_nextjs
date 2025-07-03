'use client'
import React, { useEffect, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DatePickerPopover } from '@/components/date-picker-popover'
import { Loader2, X } from 'lucide-react'
import { schemaActor } from '@/lib/schemas/actor.schema'
import { useMutation, useQuery } from '@tanstack/react-query'
import { actorApi } from '@/services/actorApi'
import { toast } from 'react-toastify'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Loading from '@/components/loading'
import useUploadImages from '@/hooks/useUploadImages'

export default function ActionsActor() {
  const [idEdit, setIdEdit] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const { data: actor, isLoading: isLoading } = actorApi.query.useGetActorById(
    idEdit,
    !!idEdit,
  )

  useEffect(() => {
    const id = searchParams.get('id')
    if (id) setIdEdit(id)
  }, [])

  useEffect(() => {
    if (actor) {
      reset({
        name: actor.name,
        dateOfBirth: actor.dateOfBirth,
        bio: actor.bio,
        profilePictureUrl: actor.profilePictureUrl,
        awards: actor.awards.map((award) => ({
          name: award.name,
          date: award.date,
        })),
      })
    }
  }, [actor])

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaActor),
    defaultValues: {
      name: '',
      dateOfBirth: undefined,
      bio: '',
      profilePictureUrl: '',
      awards: [{ name: '', date: undefined }],
    },
  })

  const { images, handleImageChange, removeImage, uploadImage } =
    useUploadImages()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'awards',
  })

  const createActorMutation = actorApi.mutation.useCreateActor()

  const updateActorMutation = useMutation({
    mutationFn: (data) => update,
  })

  const onSubmit = async (data) => {
    const uploadedImageUrls = await Promise.all(
      images.map((image) => uploadImage(image)),
    )
    idEdit
      ? ''
      : createActorMutation.mutate(
          {
            ...data,
            profilePictureUrl: uploadedImageUrls[0],
          },
          {
            onSuccess: () => {
              router.push('/admin/dashboard/actors')
            },
          },
        )
  }

  if (isLoading) return <Loading />

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
      <div className='flex justify-between'>
        <p className='text-2xl font-bold'>Create Actor</p>
        <Button
          type='submit'
          disabled={
            createActorMutation.isPending || updateActorMutation.isPending
          }
        >
          {(createActorMutation.isPending || updateActorMutation.isPending) && (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          )}
          Submit
        </Button>
      </div>

      <div className='grid grid-cols-5 gap-4'>
        <div className='col-span-4'>
          <p className='text-sm whitespace-nowrap font-semibold pb-2'>
            Name Actor
          </p>
          <Input {...register('name')} />
          {errors.name && (
            <span className='text-red-500 text-xs mt-1 font-bold'>
              {errors.name.message}
            </span>
          )}
        </div>
        <div className='col-span-1'>
          <p className='text-sm font-semibold pb-2'>Day of birth</p>
          <Controller
            control={control}
            name='dateOfBirth'
            render={({ field }) => (
              <>
                <DatePickerPopover
                  {...field}
                  selected={field.value ?? undefined}
                  onSelect={field.onChange}
                />
                {errors.dateOfBirth && (
                  <span className='text-red-500 text-xs mt-1 font-bold'>
                    {errors.dateOfBirth.message}
                  </span>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div>
        <p className='text-sm pb-2 font-semibold'>Bio</p>
        <Textarea {...register('bio')} />
        {errors.bio && (
          <span className='text-red-500 text-xs mt-1 font-bold'>
            {errors.bio.message}
          </span>
        )}
      </div>

      <div>
        <p className='text-sm pb-2 font-semibold'>Avatar</p>
        <Input
          type='file'
          accept='image/*'
          onChange={handleImageChange}
          multiple
        />
        {errors.profilePictureUrl && (
          <span className='text-red-500 text-xs mt-1 font-bold'>
            {errors.profilePictureUrl.message}
          </span>
        )}
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
