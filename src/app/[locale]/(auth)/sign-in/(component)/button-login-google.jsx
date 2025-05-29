'use client'

import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

import { authApi } from '@/services/authApi'
import { setAuthState } from '@/redux/slices/authSlice'
import { getUserIdFromToken } from '@/lib/helper'
import { useAppDispatch } from '@/redux/store'

function GoogleLoginButton({ t }) {
  const tToast = useTranslations('Toast')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const loginWithGoogleMutation = authApi.mutation.useLoginWithGoogle()

  return (
    <div className="w-full flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          const idToken = credentialResponse.credential 
          if (!idToken) {
            toast.error(tToast('login_google_error'))
            return
          }

          loginWithGoogleMutation.mutate(
            { idToken },
            {
              onSuccess: (data) => {
                const id = getUserIdFromToken(data.access_token)

                dispatch(
                  setAuthState({
                    isLogin: true,
                    accessToken: data.access_token,
                    id,
                  })
                )

                fetch('/api/auth', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    accesstoken: data.access_token,
                  }),
                })
                  .then((res) => res.json())
                  .then(() => {
                    router.push('/home')
                  })
                  .catch((err) => {
                    console.error('Error sending token to server:', err)
                  })
              },
              onError: () => {
                toast.error(tToast('login_google_error'))
              },
            }
          )
        }}
        onError={() => {
          toast.error(tToast('login_google_error'))
        }}
        useOneTap={false}
      />
    </div>
  )
}

export default function ButtonLoginWithGoogle({ t }) {
  const locale = useLocale()

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
      key={locale}
    >
      <GoogleLoginButton t={t} />
    </GoogleOAuthProvider>
  )
}
