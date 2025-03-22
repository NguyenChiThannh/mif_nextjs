'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Triangle, Heart } from 'lucide-react';

import Loading from '@/components/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { favoriteActorsApi } from '@/services/favoriteActorsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'use-intl';


export default function CardActorHorizontal({ actor, isTopRanked }) {
    const t = useTranslations('Actor');
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLiked, setLiked] = useState(false);

    const addFavoriteActorMutation = favoriteActorsApi.mutation.useAddFavoriteActor();
    const removeFavoriteActorMutation = favoriteActorsApi.mutation.useRemoveFavoriteActor();
    const isActorFavoriteMutation = favoriteActorsApi.mutation.useIsActorFavorite();

    useEffect(() => {
        isActorFavoriteMutation.mutate(actor.id, {
            onSuccess: (isFavorite) => {
                setLiked(isFavorite);
                setIsInitialLoading(false);
            },
            onError: () => {
                setIsInitialLoading(false);
            },
        });
    }, [actor.id]);

    if (isInitialLoading) {
        return <Loading />;
    }

    const handleAddFavoriteActor = () => {
        addFavoriteActorMutation.mutate(actor.id, {
            onSuccess: () => setLiked(true),
            onError: () => setLiked(false),
        });
    };

    const handleRemoveFavoriteActor = () => {
        removeFavoriteActorMutation.mutate(actor.id, {
            onSuccess: () => setLiked(false),
            onError: () => setLiked(true),
        });
    };

    return (
        <div className="flex p-1 rounded border-b-2 items-center">
            <ActorInfo actor={actor} isTopRanked={isTopRanked} />
            <LikeButton
                isLiked={isLiked}
                onLike={handleAddFavoriteActor}
                onUnlike={handleRemoveFavoriteActor}
            />
        </div>
    );
}

function ActorInfo({ actor, isTopRanked }) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="border w-10 h-10">
                <AvatarImage src={actor.profilePictureUrl} alt={actor.name} />
                <AvatarFallback>{actor.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="grid gap-2 py-2">
                <Link href={`/actor/${actor.id}`}>
                    <p className="leading-none font-bold">{actor.name}</p>
                </Link>
                {/* Rank actor */}
                {/* <div className="flex items-center gap-1">
                    <span className="text-sm">#1(</span>
                    <Triangle
                        className={isTopRanked
                            ? "fill-green-500 text-green-500"
                            : "rotate-180 fill-red-500 text-red-500"}
                        size="10px"
                    />
                    <span className="text-sm">16)</span>
                </div> */}
                <div className="flex items-center gap-1">
                    <span className="text-sm">{t("actor")}</span>

                </div>
            </div>
        </div>
    );
}


function LikeButton({ isLiked, onLike, onUnlike }) {
    return (
        <div className="flex items-center gap-1 ml-auto">
            <button onClick={isLiked ? onUnlike : onLike} aria-label="Toggle Favorite">
                <Heart className={isLiked ? "fill-red-500 text-red-500" : "text-gray-500"} />
            </button>
        </div>
    );
}

export function CardActorHorizontalSkeleton() {
    return (
        <div className="flex p-1 rounded border-b-2 items-center">
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
