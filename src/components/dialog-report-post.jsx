'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { reportPostApi } from '@/services/reportPostApi'
import { MessageSquareWarning } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function DialogReportPost({ groupId, postId, t }) {
  const [isOpen, setIsOpen] = useState(false)

  const { handleSubmit, register, reset } = useForm()
  const mutation = reportPostApi.mutation.useReportPost(groupId)

  const onSubmit = (data) => {
    mutation.mutate(
      { ...data, postId },
      {
        onSuccess: () => {
          reset()
          setIsOpen(false)
        },
      },
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='gap-2' variant='ghost' size='sm'>
          <MessageSquareWarning className='h-4 w-4 mr-2' />
          {t('report_post')}
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-2xl'>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <DialogHeader>
            <DialogTitle className='text-lg font-semibold'>
              Tố cáo bài viết
            </DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-2'>
            <Label htmlFor='userId' className='text-sm text-muted-foreground'>
              Lý do tố cáo
            </Label>
            <Textarea
              placeholder='Nhập lý do tố cáo'
              {...register('reason', { required: true })}
              className='border rounded-md'
              required
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              type='submit'
              className='w-full'
              disabled={mutation.isLoading}
            >
              {mutation.isLoading ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
