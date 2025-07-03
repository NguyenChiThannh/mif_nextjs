'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { ForgetPassword } from '@/components/forget-password'
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
import ButtonLoginWithGoogle from '@/app/[locale]/(auth)/sign-in/(component)/button-login-google'

export default function FormLogin({ t }) {
  const tSchema = useTranslations('Schema.auth')
  const [rememberMe, setRememberMe] = useState(false)
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
      setRememberMe(isRememberMe)
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
            window.location.href = '/home'
            console.log('Login successful, redirecting to home page')
          })
          .catch((error) => {
            console.error('Error sending token to server:', error)
          })
      },
    })

    if (rememberMe) {
      localStorage.setItem(
        'rememberLogin',
        JSON.stringify({ ...data, isRememberMe: true }),
      )
    } else {
      localStorage.removeItem('rememberLogin')
    }
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

          {/* Remember Me Checkbox */}
          <div className='flex items-center gap-2'>
            <Checkbox
              id='rememberMe'
              checked={rememberMe}
              onCheckedChange={setRememberMe}
              className='bg-muted'
            />
            <Label htmlFor='rememberMe'>{t('remember_me')}</Label>
            <ForgetPassword t={t} />
          </div>
        </div>

        {/* Submit Button */}
        <Button type='submit' className='w-full'>
          {t('login_action')}
        </Button>

        <div className='flex items-center'>
          <div className='flex-grow h-px bg-border' />
          <span className='mx-2 text-sm text-muted-foreground'>{t('or')}</span>
          <div className='flex-grow h-px bg-border' />
        </div>

        <ButtonLoginWithGoogle t={t} />
        {/* Social Login Buttons */}
        <div className='grid gap-2'></div>
      </form>
    </>
  )
}
