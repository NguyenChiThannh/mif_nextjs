import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import React from 'react'

function NotificationsSection({ t }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive and how you receive them.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <Separator />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email_comments">Comments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails when someone comments on your posts.
                                </p>
                            </div>
                            <Switch id="email_comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email_mentions">Mentions</Label>
                                <p className="text-sm text-muted-foreground">Receive emails when someone mentions you.</p>
                            </div>
                            <Switch id="email_mentions" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email_updates">Product Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive emails about product updates and features.
                                </p>
                            </div>
                            <Switch id="email_updates" />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="email_marketing">Marketing</Label>
                                <p className="text-sm text-muted-foreground">Receive marketing emails and offers.</p>
                            </div>
                            <Switch id="email_marketing" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <Separator />
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push_comments">Comments</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications when someone comments on your posts.
                                </p>
                            </div>
                            <Switch id="push_comments" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push_mentions">Mentions</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications when someone mentions you.
                                </p>
                            </div>
                            <Switch id="push_mentions" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="push_updates">Product Updates</Label>
                                <p className="text-sm text-muted-foreground">
                                    Receive push notifications about product updates and features.
                                </p>
                            </div>
                            <Switch id="push_updates" />
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button >Save changes</Button>
            </CardFooter>
        </Card>
    )
}

export default NotificationsSection