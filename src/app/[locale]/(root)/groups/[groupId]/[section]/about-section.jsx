'use client'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/formatter'
import { CalendarDays, Clock5, Eye, Lock, SquareLibrary, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AboutSection({ group, members , t  }) {

    return (
        <>
            {/* Information Group */}
            <CardInformationGroup group={group} />

            {/* Member Group */}
            <CardMemberGroup group={group} members={members} />

            {/* Activity Group */}
            <CardActivityGroup group={group} />

        </>
    )
}

function CardInformationGroup({ group }) {
    return (
        <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
            <CardContent>
                <div className="grid gap-4 mt-6">
                    <div className='flex justify-between'>
                        <p className="font-bold flex items-center">{t("title_about")}</p>
                    </div>
                    <Separator />
                    <p className='text-sm'>{group.description}</p>
                    {
                        group.isPublic
                            ?
                            <div className='gird gap-4'>
                                <p className="flex gap-2 font-bold items-center">
                                    <Users className="h-4 w-4" />
                                    {t("public")}
                                </p>
                                <p> &middot; {t("public_description")}</p>
                            </div>
                            :
                            <div className='gird gap-4'>
                                <p className="flex gap-2 font-bold items-center">
                                    <Lock className="h-4 w-4" />
                                    {t("private")}
                                </p>
                                <p> &middot; {t("private_description")} </p>
                            </div>
                    }
                    <p className="flex gap-2 font-bold items-center">
                        <Eye className="h-4 w-4" />
                        {t("display")} </p>
                    <p>&middot; {t("display_description")} </p>
                    <p className="flex gap-2 font-bold items-center">
                        <SquareLibrary className="h-4 w-4" />
                        {t("category")}</p>
                    <p>&middot; Phim hành động</p>
                </div>
            </CardContent>
        </Card>
    )
}

function CardMemberGroup({ group, members }) {
    return (
        <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
            <CardContent>
                <div className="grid gap-4 mt-6">
                    <p className="font-bold flex items-center">{t("members")} &middot; &nbsp;<p className='text-sm leading-3 text-muted-foreground'>{members?.numberOfElements}</p></p>
                    <Separator />
                    <div className="flex items-center gap-2">
                        <GroupAvatar images={members?.content?.map((user) => user.avatar)} names={members?.content?.map((user) => user?.displayName)} size="w-12 h-12" />
                    </div>
                    <Button variant='secondary'>
                        <Link
                            href={`/groups/${group?.id}/members`}
                            className='w-full h-full'
                        >
                            {t("button_see_all_members")}
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

function CardActivityGroup({ group }) {
    return (
        <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
            <CardContent>
                <div className="grid gap-4 mt-6">
                    <p className="font-bold flex items-center">{t("activity")}</p>
                    <Separator />
                    <p className="flex gap-2 font-bold items-center">
                        <Clock5 className="h-4 w-4" />
                        {t("date_of_establishment")} 
                    </p>
                    <p>&middot; {t("established_on")}: {formatDate(group?.createdAt)} </p>

                    <p className="flex gap-2 font-bold items-center">
                        <CalendarDays className="h-4 w-4" />
                        Bài viết </p>
                    <p>&middot; {group?.weeklyPostCount || 0} {t("week_this_post")} </p>
                </div>
            </CardContent>
        </Card>
    )
}


