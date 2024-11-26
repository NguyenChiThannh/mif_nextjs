'use client'

import Loading from '@/components/loading'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { navProfileUserConfig } from '@/lib/navigationConfig'
import { userApi } from '@/services/userApi'
import { useQuery } from '@tanstack/react-query'
import { Camera, CircleDollarSign } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

export default function RootLayout({ children }) {
    const t = useTranslations('Profile.User.Navbar')
    const pathname = usePathname()
    const { id } = useParams()
    const { data: infoUser, isLoading } = userApi.query.useGetUserInfoById(id)

    if (isLoading) return <Loading />

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-8 p-4">
            {/* User Info Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <Avatar className="w-32 h-32 border-2 border-primary">
                        <AvatarImage src={infoUser.profilePictureUrl} alt={infoUser.displayName} />
                        <AvatarFallback className="uppercase text-xl font-bold">
                            {infoUser.displayName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        variant="ghost"
                        className="absolute -right-2 -bottom-2 rounded-full bg-muted p-3 shadow-md hover:scale-105 transition"
                    >
                        <Camera className="text-primary" />
                    </Button>
                </div>
                <div className="text-lg font-bold text-center">{infoUser.displayName}</div>
                <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <CircleDollarSign className="w-5 h-5" />
                    <span>1000 Xu</span>
                </div>
                <Button size="sm" className="px-6">
                    Nạp xu
                </Button>
            </div>

            {/* Navbar Section */}
            <div className="col-span-2">
                <nav className="flex flex-wrap gap-2">
                    {navProfileUserConfig(t).map((item, index) => (
                        <Link
                            key={index}
                            href={item.href(id)}
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${item.active(pathname, id) ? 'bg-primary text-background' : 'bg-muted hover:bg-primary hover:text-background'
                                }`}
                            prefetch={false}
                        >
                            {item.title}
                        </Link>
                    ))}
                </nav>
                <Separator className="mt-4" />
                <div className="mt-4">{children}</div>
            </div>
        </div>
    )
}
