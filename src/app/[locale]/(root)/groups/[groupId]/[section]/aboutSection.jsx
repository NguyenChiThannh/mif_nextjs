'use client'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDateTime } from '@/lib/formatter'
import { CalendarDays, Clock5, Eye, Lock, SquareLibrary, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function AboutSection({ group, members }) {
    console.log('🚀 ~ AboutSection ~ group:', group)
    return (
        <>
            <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
                <CardContent>
                    <div className="grid gap-4 mt-6">
                        <p className="font-bold flex items-center">Giới thiệu về nhóm</p>
                        <Separator />
                        <p className='text-sm'>{group.description}</p>
                        {
                            group.isPublic
                                ?
                                <div className='gird gap-4'>
                                    <p className="flex gap-2 font-bold items-center">
                                        <Users className="h-4 w-4" />
                                        Công khai
                                    </p>
                                    <p> &middot; Bất kỳ ai cũng có thể nhìn thấy mọi người trong nhóm và những gì họ đăng. </p>
                                </div>
                                :
                                <div className='gird gap-4'>
                                    <p className="flex gap-2 font-bold items-center">
                                        <Lock className="h-4 w-4" />
                                        Riêng tư
                                    </p>
                                    <p> &middot; Chỉ thành viên mới nhìn thấy mọi người trong nhóm và những gì họ đăng. </p>
                                </div>
                        }
                        <p className="flex gap-2 font-bold items-center">
                            <Eye className="h-4 w-4" />
                            Hiển thị </p>
                        <p>&middot; Ai cũng có thể tìm thấy nhóm này. </p>
                        <p className="flex gap-2 font-bold items-center">
                            <SquareLibrary className="h-4 w-4" />
                            Thể loại</p>
                        <p>&middot; Phim hành động</p>
                    </div>
                </CardContent>
            </Card>
            <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
                <CardContent>
                    <div className="grid gap-4 mt-6">
                        <p className="font-bold flex items-center">Thành viên &middot; &nbsp;<p className='text-sm leading-3 text-muted-foreground'>100</p></p>
                        <Separator />
                        <div className="flex items-center gap-2">
                            <GroupAvatar images={members?.content?.map((user) => user.avatar)} names={members?.content?.map((user) => user?.displayName)} size="w-12 h-12" />
                        </div>
                        <Button variant='secondary'>
                            <Link
                                href={`/groups/${group?.id}/members`}
                                className='w-full h-full'
                            >
                                Xem tất cả thành viên
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
                <CardContent>
                    <div className="grid gap-4 mt-6">
                        <p className="font-bold flex items-center">Hoạt động</p>
                        <Separator />
                        <p className="flex gap-2 font-bold items-center">
                            <Clock5 className="h-4 w-4" />
                            Ngày thành lập </p>
                        <p>&middot; Thành lập ngày: {formatDateTime(group?.createdAt)} </p>

                        <p className="flex gap-2 font-bold items-center">
                            <CalendarDays className="h-4 w-4" />
                            Bài viết </p>
                        <p>&middot; {group?.weeklyPostCount} bài viết tuần này </p>
                    </div>
                </CardContent>
            </Card>

        </>
    )
}
