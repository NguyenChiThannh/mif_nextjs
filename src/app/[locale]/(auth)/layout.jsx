'use client'

import Background from '@/app/[locale]/(auth)/bg-movie/background'
import { Film } from 'lucide-react'
import Link from 'next/link'

const LOGO_TEXT = 'MIF'

export default function AuthLayout({ children }) {
  return (
    <main className='relative w-full min-h-screen bg-black'>
      {/* Logo */}
      <div className='absolute flex top-2 left-20 z-50'>
        <Link href='/home' className='flex items-center gap-2'>
          <Film className='h-6 w-6' />
          <span className='text-xl font-bold tracking-[.25em]'>
            {LOGO_TEXT}
          </span>
        </Link>
      </div>

      {/* Background */}
      <div className='absolute inset-0 z-0'>
        <Background />
      </div>

      {/* Overlay with blur */}
      <div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blu-none z-10 h-screen'></div>

      {/* Content */}
      <div className='relative z-20 flex items-center justify-center lg:min-h-screen xl:min-h-screen'>
        <div className='bg-background border border-border rounded-lg shadow-md mx-auto w-fit max-w-md sm:max-w-lg'>
          {children}
        </div>
      </div>
    </main>
  )
}
