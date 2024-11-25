import { publicApi } from "@/services/config"
import { useMutation } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

const register = async (data) => {
    const res = await publicApi.post('auth/register', data)
    return res.data
}

const verifyOTP = async (data) => {
    const res = await publicApi.post('auth/register/OTP', data)
    return res.data
}

const login = async (data) => {
    const res = await publicApi.post('auth/login', data)
    return res.data
}

export const authApi = {
    mutation: {
        useLogin() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: login,
                onSuccess: () => {
                    toast.success(t('login_successful'))
                }
            })
        },
        useRegister() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: register,
                onSuccess: () => {
                    toast.success(t('register_successful'))
                }
            })
        },
        useVerifyOTP() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: verifyOTP,
                onSuccess: () => {
                    toast.success(t('verify_otp_successful'))
                }
            })
        }
    }
}