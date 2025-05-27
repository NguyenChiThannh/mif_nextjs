'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/services/authApi';
import { toast } from 'react-toastify';
import { useLocale, useTranslations } from 'next-intl';
import { setAuthState } from '@/redux/slices/authSlice';
import { getUserIdFromToken } from '@/lib/helper';
import { useAppDispatch } from '@/redux/store';
import { useRouter } from 'next/navigation';

export default function ButtonLoginWithGoogle({ t }) {
  const tToast = useTranslations('Toast');
  const locale = useLocale();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const loginWithGoogleMutation = authApi.mutation.useLoginWithGoogle();
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    // const decoded = jwtDecode(credentialResponse.credential);
    // console.log("User Info:", decoded);
    loginWithGoogleMutation.mutate(
      { idToken: credentialResponse.credential },
      {
        onSuccess: (data) => {
            const id = getUserIdFromToken(data.access_token);
            const authState = {
                isLogin: true,
                accessToken: data.access_token,
                id,
            };
            dispatch(setAuthState(authState));

            fetch('/api/auth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accesstoken: data.access_token,
                }),
            })
                .then(response => response.json())
                .then(responseData => {
                    console.log('Server response:', responseData);
                    router.push('/home');
                })
                .catch(error => {
                    console.error('Error sending token to server:', error);
                });
        },
      }
    );
  };

  const handleGoogleError = () => {
    toast.error('Đăng nhập bằng Google không thành công');
    // toast.error(tToast('login_google_error'));
  };

  return (
    <div>
      <GoogleOAuthProvider 
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}
        key={locale}
        >
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          locale={locale}
          theme="outline"
          size="large"
          text="signin_with"
          shape="rectangular"
          logo_alignment="center"
          width="100%"
          ux_mode="popup"
          useOneTap={false}
          auto_select={false}
        />
      </GoogleOAuthProvider>
    </div>
  )
}
