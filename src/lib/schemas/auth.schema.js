import { z } from "zod"

export const schemaLogin = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const schemaRegister = z.object({
    displayName: z.string().min(2, "Full name must be at least 2 characters."),
    email: z.string().email("Invalid email address."),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters."),
    repeatPassword: z
        .string()
        .min(6, "Password must be at least 6 characters."),
}).refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Passwords must match.",
});