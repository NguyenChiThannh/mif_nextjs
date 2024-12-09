'use client'
import React from "react";
import { useTranslations } from "next-intl";
import SignUpForm from "@/app/[locale]/(auth)/sign-up/(form)/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ButtonLoginWithGoogle from "@/app/[locale]/(auth)/sign-in/(component)/button-login-google";

export default function SignUp() {
    const t = useTranslations("Login_register");

    return (
        <div className="flex items-center justify-center">

            <div className="w-full bg-card border border-border rounded-lg shadow-lg p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground">
                        {t("register_title")}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-2">
                        {t("register_description")}
                    </p>
                </div>

                {/* SignUp Form */}
                <SignUpForm t={t} />

                {/* Social Login */}
                <div className="grid gap-2">
                    <ButtonLoginWithGoogle t={t} />
                    {/* <Button variant="outline" className="w-full" type="button">
                        {t('login_with_facebook')}
                    </Button> */}
                </div>

                {/* Login Redirect */}
                <div className="text-center text-sm text-muted-foreground mt-4">
                    {t('you_have_account_yet')}{' '}
                    <Link href="/sign-in" className="underline text-primary font-medium">
                        {t('login_title')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
