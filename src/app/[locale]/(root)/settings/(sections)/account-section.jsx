import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useTranslations } from 'next-intl'
import React from 'react'

function AccountSection() {
    const t = useTranslations('Settings.Account')
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("profile")}</CardTitle>
                    <CardDescription>
                    {t("profile_description")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Avatar" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <Button size="sm">{t("upload_photo_button")}</Button>
                            <p className="text-xs text-muted-foreground">{t("format_file_updload_photo")}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">{t("first_name")}</Label>
                            <Input id="firstName" placeholder="John" defaultValue="John" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">{t("last_name")}</Label>
                            <Input id="lastName" placeholder="Doe" defaultValue="Doe" />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">{t("email")}</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="john.doe@example.com"
                            defaultValue="john.doe@example.com"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio">{t("bio")}</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself"
                            defaultValue="I'm a software developer with a passion for building great user experiences."
                            className="min-h-[100px]"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button >{t("save_button")}</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Manage your account preferences and settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                            <SelectTrigger id="language">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="fr">French</SelectItem>
                                <SelectItem value="de">German</SelectItem>
                                <SelectItem value="es">Spanish</SelectItem>
                                <SelectItem value="pt">Portuguese</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select defaultValue="utc-8">
                            <SelectTrigger id="timezone">
                                <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="utc-12">UTC-12:00</SelectItem>
                                <SelectItem value="utc-11">UTC-11:00</SelectItem>
                                <SelectItem value="utc-10">UTC-10:00</SelectItem>
                                <SelectItem value="utc-9">UTC-09:00</SelectItem>
                                <SelectItem value="utc-8">UTC-08:00 (PST)</SelectItem>
                                <SelectItem value="utc-7">UTC-07:00 (MST)</SelectItem>
                                <SelectItem value="utc-6">UTC-06:00 (CST)</SelectItem>
                                <SelectItem value="utc-5">UTC-05:00 (EST)</SelectItem>
                                <SelectItem value="utc-4">UTC-04:00</SelectItem>
                                <SelectItem value="utc-3">UTC-03:00</SelectItem>
                                <SelectItem value="utc-2">UTC-02:00</SelectItem>
                                <SelectItem value="utc-1">UTC-01:00</SelectItem>
                                <SelectItem value="utc">UTC+00:00</SelectItem>
                                <SelectItem value="utc+1">UTC+01:00</SelectItem>
                                <SelectItem value="utc+2">UTC+02:00</SelectItem>
                                <SelectItem value="utc+3">UTC+03:00</SelectItem>
                                <SelectItem value="utc+4">UTC+04:00</SelectItem>
                                <SelectItem value="utc+5">UTC+05:00</SelectItem>
                                <SelectItem value="utc+5:30">UTC+05:30</SelectItem>
                                <SelectItem value="utc+6">UTC+06:00</SelectItem>
                                <SelectItem value="utc+7">UTC+07:00</SelectItem>
                                <SelectItem value="utc+8">UTC+08:00</SelectItem>
                                <SelectItem value="utc+9">UTC+09:00</SelectItem>
                                <SelectItem value="utc+10">UTC+10:00</SelectItem>
                                <SelectItem value="utc+11">UTC+11:00</SelectItem>
                                <SelectItem value="utc+12">UTC+12:00</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button >Save changes</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default AccountSection