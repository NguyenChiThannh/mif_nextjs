import { z } from "zod"

export const schemaLogin = (t) => z.object({
    email: z
        .string()
        .email(t('emailInvalid')),
    password: z
        .string()
        .min(6, t('passwordMin'))
    // .regex(
    //     /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/,
    //     t('passwordComplexity')
    // )
});

export const schemaRegister = (t) => z.object({
    displayName: z
        .string()
        .min(2, t('displayNameMin')),
    email: z
        .string()
        .email(t('emailInvalid')),
    password: z
        .string()
        .min(6, t('passwordMin')),
    repeatPassword: z
        .string()
        .min(6, t('passwordMin')),
}).refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: t('passwordMismatch'),
});