import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Lock, LogOut } from 'lucide-react'
import React from 'react'

function SecuritySection({ t }) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password and manage your account security.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="current-password">Current password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">New password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Confirm password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button >Update password</Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="2fa">Two-factor authentication</Label>
                            <p className="text-sm text-muted-foreground">
                                Protect your account with an additional security layer.
                            </p>
                        </div>
                        <Switch id="2fa" />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        Set up two-factor authentication
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sessions</CardTitle>
                    <CardDescription>Manage your active sessions and devices.</CardDescription>
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
                        Log out of all devices
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>Irreversible and destructive actions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-medium">Delete Account</h3>
                        <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all of your content. This action cannot be undone.
                        </p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="destructive" className="w-full">
                        Delete account
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default SecuritySection