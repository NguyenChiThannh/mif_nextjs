'use client'
import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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

export default function FormLogin({ t }) {
    const [rememberMe, setRememberMe] = useState(false)
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { register, handleSubmit, reset } = useForm({
        resolver: zodResolver(schemaLogin),
    })

    useEffect(() => {
        const rememberLogin = JSON.parse(localStorage.getItem('rememberLogin'))
        if (rememberLogin) {
            const { isRememberMe, ...data } = rememberLogin
            reset(data)
            setRememberMe(isRememberMe)
        }
    }, [])

    const mutation = authApi.mutation.useLogin()
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
                router.push('/home')
            },
        })
        if (rememberMe) {
            localStorage.setItem(
                'rememberLogin',
                JSON.stringify({ ...data, isRememberMe: true })
            )
        } else {
            localStorage.removeItem('rememberLogin')
        }
    }

    return (
        <>
            {mutation.isPending && <Loading />}
            <form onSubmit={handleSubmit(handleLogin)} className="grid gap-6">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('email_placeholder')}
                            {...register("email")}
                            className="bg-input border border-border"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">{t('password')}</Label>
                        <PasswordInput
                            id="password"
                            placeholder={t('password_placeholder')}
                            {...register("password")}
                            className="bg-input border border-border"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox
                            id="rememberMe"
                            checked={rememberMe}
                            onCheckedChange={setRememberMe}
                            className="bg-muted"
                        />
                        <Label htmlFor="rememberMe">{t('remember_me')}</Label>
                        <ForgetPassword t={t} />
                    </div>
                </div>
                <Button type="submit" className="w-full">{t('login_action')}</Button>
                <div className="grid gap-2">
                    <Button variant="outline" className="w-full" type="button">
                        {t('login_with_google')}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                        {t('login_with_facebook')}
                    </Button>
                </div>
            </form>
        </>
    )
}



// const handleLogin = (data) => {
//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     if (!emailRegex.test(data.email)) {
//         toast.error('Email không hợp lệ');
//         return;
//     }

//     if (data.password.length < 6) {
//         toast.error('Mật khẩu cần ít nhất 6 ký tự');
//         return;
//     }

//     const loginMutation = useMutation({
//         mutationFn: async (data) => {
//             try {
//                 const res = await publicApi.post('auth/login', data)
//                 return res.data
//             } catch (error) {
//                 throw error
//             }
//         },
//         onSuccess: (data) => {
//             toast.success('Đăng nhập thành công')
//             const authState = {
//                 isLogin: true,
//                 accessToken: data.access_token,
//             }
//             dispatch(setAuthState(authState))
//             router.push('/home')
//         },
//         onError: () => {
//             toast.error('Email hoặc mật khẩu sai. Vui lòng thử lại')
//         }
//     })
//     if (rememberMe) {
//         localStorage.setItem(
//             'rememberLogin',
//             JSON.stringify({ ...data, isRememberMe: true })
//         )
//     } else {
//         localStorage.removeItem('rememberLogin')
//     }
//     loginMutation.mutate(data)
// }