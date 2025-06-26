'use client'
import React from 'react'
import { useTranslations } from 'next-intl'
import FormLoginADMIN from '@/app/[locale]/admin/sign-in/(form)/form'

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
        </div>

        <FormLoginADMIN t={t} />
      </div>
    </div>
  )
}
