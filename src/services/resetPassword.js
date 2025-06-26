import { privateApi } from '@/services/config'
import { useMutation } from '@tanstack/react-query'

const requestPasswordReset = async (data) => {
  const res = await privateApi.post('/auth/reset-password/OTP', data)
  return res.data
}

const verifyRequestPassOTP = async (data) => {
  const res = await privateApi.post('/auth/reset-password/OTP/verify', data)
  return res.data
}

const resetPassword = async (data) => {
  const res = await privateApi.post('/auth/reset-password', data)
  return res.data
}

export const resetPasswordApi = {
  mutation: {
    useRequestPasswordReset() {
      return useMutation({
        mutationFn: requestPasswordReset,
      })
    },
    useVerifyRequestPassOTP() {
      return useMutation({
        mutationFn: verifyRequestPassOTP,
        onSuccess: () => {},
      })
    },
    useResetPassword() {
      return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {},
      })
    },
  },
}
