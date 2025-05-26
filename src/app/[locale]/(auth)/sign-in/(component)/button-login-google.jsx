import { Button } from '@/components/ui/button'
import React from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

export default function ButtonLoginWithGoogle({ t }) {
  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    const decoded = jwtDecode(credentialResponse.credential);
    console.log("User Info:", decoded);
    // Ở đây bạn có thể gửi token ID đến server để xác thực
    // hoặc xử lý đăng nhập theo logic của ứng dụng
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
  };

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID'}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="outline"
          size="large"
          ux_mode="popup" // Quan trọng để không hiện auto One Tap
          useOneTap={false}
          text="signin_with"
          shape="rectangular"
          logo_alignment="center"
          width="100%"
          render={({ onClick }) => (
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={onClick}
            >
              {t('login_with_google')}
            </Button>
          )}
        />
      </GoogleOAuthProvider>
    </div>
  )
}
