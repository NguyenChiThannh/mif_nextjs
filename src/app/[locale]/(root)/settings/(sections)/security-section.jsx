import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Lock, LogOut } from 'lucide-react'
import React from 'react'

function SecuritySection() {
    const t = useTranslations('Settings.Security')
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("password")}</CardTitle>
                    <CardDescription>{t("password_description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">{t("current_password")}</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">{t("new_password")}</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">{t("confirm_password")}</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button >{t("save_button")}</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("two_factor_authentication")}</CardTitle>
                    <CardDescription>{t("two_factor_authentication_description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="2fa">{t("two_factor_authentication")}</Label>
                            <p className="text-sm text-muted-foreground">
                                {t("two_factor_authentication_description")}
                            </p>
                        </div>
                        <Switch id="2fa" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        {t("set_up_two_factor_authentication")}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("sessions")}</CardTitle>
                    <CardDescription>{t("sessions_description")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Chrome on Windows</div>
                                <div className="text-sm text-muted-foreground">Active now • Seattle, USA</div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Lock className="h-4 w-4 mr-2" />
                                Current
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Safari on Mac</div>
                                <div className="text-sm text-muted-foreground">Last active 2 days ago • Portland, USA</div>
                            </div>
                            <Button variant="outline" size="sm">
                                <LogOut className="h-4 w-4 mr-2" />
                                Log out
                            </Button>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="font-medium">Chrome on iPhone</div>
                                <div className="text-sm text-muted-foreground">Last active 5 days ago • Seattle, USA</div>
                            </div>
                            <Button variant="outline" size="sm">
                                <LogOut className="h-4 w-4 mr-2" />
                                Log out
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" className="w-full">
                        {t("log_out_of_all_devices")}
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("delete_account")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">{t("delete_account")}</h3>
                        <p className="text-sm text-muted-foreground">
                            {t("delete_account_description")}
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" className="w-full">
                        {t("delete_account")}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SecuritySection