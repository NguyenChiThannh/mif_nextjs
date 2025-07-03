'use client'
import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import FormLogin from '@/app/[locale]/(auth)/sign-in/(form)/form'

export default function SignIn() {
  const t = useTranslations('Login_register')

  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='mx-auto grid w-full max-w-md p-6 gap-6'>
        {/* Header section */}
        <div className='grid gap-4 text-center'>
          <h1 className='text-4xl font-bold text-foreground'>
            {t('login_title')}
          </h1>
          <p className='text-muted-foreground text-sm'>
            {t('login_description')}
          </p>
        </div>

        <FormLogin t={t} />

        <div className='text-center text-sm text-muted-foreground'>
          {t('you_dont_have_account_yet')}{' '}
          <Link href='/sign-up' className='text-primary underline font-medium'>
            {t('register_title')}
          </Link>
        </div>
      </div>
    </div>
  )
}
