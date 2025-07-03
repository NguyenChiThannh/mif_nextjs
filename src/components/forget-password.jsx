'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { resetPasswordApi } from '@/services/resetPassword'
import { useState } from 'react'
import DialogOTP from '@/components/dialog-otp'
import DialogNewPassword from '@/components/dialog-new-password'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaForgotPassword } from '@/lib/schemas/auth.schema'
import { useTranslations } from 'next-intl'

export function ForgetPassword({ t }) {
  const tSchema = useTranslations('Schema.auth')
  const [isOTPOpen, setIsOTPOpen] = useState(false)
  const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false)
  const requestPasswordResetMutation =
    resetPasswordApi.mutation.useRequestPasswordReset()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaForgotPassword(tSchema)),
  })

  const handleSendEmail = async (data) => {
    await requestPasswordResetMutation.mutateAsync(
      { email: data.email },
      {
        onSuccess: () => {
          setIsOTPOpen(true)
          reset()
        },
      },
    )
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Label className='ml-auto text-sm underline'>
            {t('forget_password_title')}
          </Label>
        </DialogTrigger>
        <DialogContent className='max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>{t('forget_password_title')}</DialogTitle>
            <DialogDescription>
              {t('forget_password_description')}
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.stopPropagation()
              handleSubmit(handleSendEmail)(e)
            }}
            className='grid gap-4 py-4'
          >
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='email' className='text-right'>
                {t('email')}
              </Label>
              <Input
                id='email'
                placeholder={t('email')}
                className={`col-span-3 ${errors.email ? 'border-red-500' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <span className='text-red-500 text-sm font-bold'>
                {errors.email.message}
              </span>
            )}
            <DialogFooter>
              <Button type='submit'>{t('forget_password_action')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {isOTPOpen && (
        <DialogOTP
          t={t}
          onClose={() => setIsOTPOpen(false)}
          type={'reset'}
          setIsNewPasswordOpen={setIsNewPasswordOpen}
        />
      )}
      {isNewPasswordOpen && (
        <DialogNewPassword t={t} onClose={() => setIsNewPasswordOpen(false)} />
      )}
    </>
  )
}
