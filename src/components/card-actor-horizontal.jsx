import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Triangle, Heart } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

export default function CardActorHorizontal({ actor, isTopRanked }) {
    if (!actor) return null;

    const { profilePictureUrl, name } = actor;

    return (
        <div className="flex p-1 rounded border-b-2 items-center">
            {/* Avatar and Actor Info */}
            <div className="flex items-center gap-2">
                <Avatar className="border w-10 h-10">
                    <AvatarImage src={profilePictureUrl} alt={name} />
                    <AvatarFallback>X</AvatarFallback>
                </Avatar>
                <div className="grid gap-2 py-2">
                    <Link
                        href={`/actor/${actor.id}`}
                    >
                        <p className="leading-none font-bold">{name}</p>
                    </Link>
                    <div className="flex items-center gap-1">
                        <span className="text-sm">#1(</span>
                        <Triangle
                            className={isTopRanked ? "fill-green-500 text-green-500" : "rotate-180 fill-red-500 text-red-500"}
                            size="10px"
                        />
                        <span className="text-sm">16)</span>
                    </div>
                </div>
            </div>

            {/* Like Button */}
            <div className="flex items-center gap-1 ml-auto">
                <Heart />
            </div>
        </div>
    );
}

export function CardActorHorizontalSkeleton() {
    return (
        <div className="flex p-1 rounded border-b-2 items-center">
            {/* Skeleton for Avatar */}
            <div className="flex items-center gap-2">
                <Skeleton className="rounded-full w-10 h-10" />
                <div className="grid gap-2 py-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-20 h-4" />
                </div>
            </div>
        </div>
    );
}
