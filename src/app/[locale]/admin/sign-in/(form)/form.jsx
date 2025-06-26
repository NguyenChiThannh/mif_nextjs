'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { schemaLogin } from '@/lib/schemas/auth.schema'
import { authApi } from '@/services/authApi'
import { setAuthState } from '@/redux/slices/authSlice'
import { useAppDispatch } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { PasswordInput } from '@/components/password-input'
import { getUserIdFromToken } from '@/lib/helper'
import Loading from '@/components/loading'
import { useTranslations } from 'next-intl'

export default function FormLoginADMIN({ t }) {
  const tSchema = useTranslations('Schema.auth')
  const router = useRouter()
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaLogin(tSchema)),
  })

  const mutation = authApi.mutation.useLogin()

  useEffect(() => {
    const rememberLogin = JSON.parse(localStorage.getItem('rememberLogin'))
    if (rememberLogin) {
      const { isRememberMe, ...data } = rememberLogin
      reset(data)
    }
  }, [reset])

  const handleLogin = (data) => {
    mutation.mutate(data, {
      onSuccess: (data) => {
        const id = getUserIdFromToken(data.access_token)
        const authState = {
          isLogin: true,
          accessToken: data.access_token,
          id,
        }
        dispatch(setAuthState(authState))

        fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accesstoken: data.access_token,
          }),
        })
          .then((response) => response.json())
          .then((responseData) => {
            console.log('Server response:', responseData)
            router.push('/admin/dashboard')
          })
          .catch((error) => {
            console.error('Error sending token to server:', error)
          })
      },
    })
  }

  return (
    <>
      {mutation.isPending && <Loading />}

      <form onSubmit={handleSubmit(handleLogin)} className='grid gap-6'>
        <div className='grid gap-4'>
          {/* Email Input */}
          <div className='grid gap-2'>
            <Label htmlFor='email'>{t('email')}</Label>
            <Input
              id='email'
              type='email'
              placeholder={t('email_placeholder')}
              {...register('email')}
              className={`bg-input border border-border ${errors.email ? 'border-red-500' : ''}`}
            />
            {errors.email && (
              <span className='text-red-500 text-sm font-bold'>
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password Input */}
          <div className='grid gap-2'>
            <Label htmlFor='password'>{t('password')}</Label>
            <PasswordInput
              id='password'
              placeholder={t('password_placeholder')}
              {...register('password')}
              className={`bg-input border border-border ${errors.password ? 'border-red-500' : ''}`}
            />
            {errors.password && (
              <span className='text-red-500 text-sm font-bold'>
                {errors.password.message}
              </span>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full'>
          {t('login_action')}
        </Button>
      </form>
    </>
  )
}
