import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ForgetPassword } from '@/components/forget-password';
import { useTranslations } from 'next-intl';

export default function SignUp() {
    const t = useTranslations('Login_register');

    return (
        <div className="flex items-center justify-center">
            <div className="w-full bg-card border border-border rounded-lg shadow-lg p-6 space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground">{t('register_title')}</h1>
                    <p className="text-sm text-muted-foreground mt-2">{t('register_description')}</p>
                </div>

                {/* Form Fields */}
                <form className="space-y-4">
                    {/* Full Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="fullName">
                            {t('fullName')}
                        </Label>
                        <Input
                            id="fullName"
                            type="text"
                            placeholder={t('fullName_placeholder')}
                            required
                            className="bg-input text-foreground border border-border"
                        />
                    </div>

                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email">
                            {t('email')}
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder={t('email_placeholder')}
                            required
                            className="bg-input text-foreground border border-border"
                        />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="password">
                            {t('password')}
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder={t('password_placeholder')}
                            required
                            className="bg-input text-foreground border border-border"
                        />
                    </div>

                    {/* Repeat Password */}
                    <div className="grid gap-2">
                        <Label htmlFor="repeat_password" >
                            {t('repeat_password')}
                        </Label>
                        <Input
                            id="repeat_password"
                            type="password"
                            placeholder={t('repeat_password_placeholder')}
                            required
                            className="bg-input text-foreground border border-border"
                        />
                    </div>

                    {/* Forget Password */}
                    <div className="flex justify-end">
                        <ForgetPassword t={t} />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-all rounded-md"
                    >
                        {t('register_action')}
                    </Button>
                </form>

                {/* Social Login */}
                <div className="grid gap-2">
                    <Button variant="outline" className="w-full" type="button">
                        {t('login_with_google')}
                    </Button>
                    <Button variant="outline" className="w-full" type="button">
                        {t('login_with_facebook')}
                    </Button>
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
