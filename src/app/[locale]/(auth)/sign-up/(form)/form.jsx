'use client'
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { schemaRegister } from "@/lib/schemas/auth.schema";
import { useForm } from "react-hook-form";
import { authApi } from "@/services/authApi";
import Loading from "@/components/loading";
import DialogOTP from "@/components/dialog-otp";
import { toast } from "react-toastify";


const SignUpForm = ({ t }) => {
    const [isRegistered, setIsRegistered] = useState(false);

    const registerMutation = authApi.mutation.useRegister()
    const form = useForm({
        resolver: zodResolver(schemaRegister),
        defaultValues: {
            displayName: "",
            email: "",
            password: "",
            repeatPassword: "",
        },
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = form;

    // Handle form submission
    const onSubmit = async (data) => {
        registerMutation.mutate(data, {
            onSuccess: () => {
                reset()
                setIsRegistered(true)
            }
        })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Loading when submit */}
            {registerMutation.isPending && <Loading />}

            {/* Display DialogOTP when register success */}
            {isRegistered && <DialogOTP />}

            {/* Full Name */}
            <div className="grid gap-2">
                <Label htmlFor="displayName">{t("fullName")}</Label>
                <Input
                    id="displayName"
                    type="text"
                    placeholder={t("fullName_placeholder")}
                    {...register("displayName")}
                    className="bg-input text-foreground border border-border"
                />
                {errors.displayName && (
                    <p className="text-red-500 text-sm font-bold">{errors.displayName.message}</p>
                )}
            </div>

            {/* Email */}
            <div className="grid gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t("email_placeholder")}
                    {...register("email")}
                    className="bg-input text-foreground border border-border"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm font-bold">{errors.email.message}</p>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={t("password_placeholder")}
                    {...register("password")}
                    className="bg-input text-foreground border border-border"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm font-bold">{errors.password.message}</p>
                )}
            </div>

            {/* Repeat Password */}
            <div className="grid gap-2">
                <Label htmlFor="repeatPassword">{t("repeat_password")}</Label>
                <Input
                    id="repeatPassword"
                    type="password"
                    placeholder={t("repeat_password_placeholder")}
                    {...register("repeatPassword")}
                    className="bg-input text-foreground border border-border"
                />
                {errors.repeatPassword && (
                    <p className="text-red-500 text-sm font-bold">{errors.repeatPassword.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md"
            >
                {t("register_action")}
            </Button>
        </form>
    );
};

export default SignUpForm;


// const onSubmit = async (data) => {
//     if (data.displayName.length < 6) {
//         toast.error('Tên hiển thị cần ít nhất 6 ký tự');
//         return;
//     }

//     const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
//     if (!emailRegex.test(data.email)) {
//         toast.error('Email không hợp lệ');
//         return;
//     }

//     // Kiểm tra độ dài của mật khẩu
//     if (data.password.length < 6) {
//         toast.error('Mật khẩu cần ít nhất 6 ký tự');
//         return;
//     }


//     if (data.password !== data.repeatPassword) {
//         toast.error('Mật khẩu nhập lại không giống');
//         return;
//     }

//     const registerMutation = useMutation({
//         mutationFn: async (data) => {
//             try {
//                 const res = await publicApi.post('auth/register', data);
//                 return res.data;
//             } catch (error) {
//                 throw error;
//             }
//         },
//         onSuccess: () => {
//             toast.success('Mã OTP được gửi về Email. Vui lòng nhập để xác nhận tài khoản.');
//             reset();
//             setIsRegistered(true);
//         },
//         onError: () => {
//             toast.error('Đăng ký thất bại. Vui lòng thử lại');
//         }
//     });

//     registerMutation.mutate(data);
// };
