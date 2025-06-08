'use client'

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Triangle, Heart } from 'lucide-react';

import Loading from '@/components/loading';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { favoriteActorsApi } from '@/services/favoriteActorsApi';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslations } from 'use-intl';
import { motion } from 'framer-motion';

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
        return '';
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
        <motion.div
            className="flex p-4 items-center hover:bg-muted/30 transition-colors duration-200 border-b last:border-b-0"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
        >
            <ActorInfo actor={actor} isTopRanked={isTopRanked} t={t} />
            <LikeButton
                isLiked={isLiked}
                onLike={handleAddFavoriteActor}
                onUnlike={handleRemoveFavoriteActor}
            />
        </motion.div>
    );
}

function ActorInfo({ actor, isTopRanked, t }) {
    return (
        <div className="flex items-center gap-4">
            <Avatar className="border border-border w-12 h-12 transition-transform duration-200 hover:scale-105">
                <AvatarImage src={actor.profilePictureUrl} alt={actor.name} />
                <AvatarFallback className="bg-muted text-muted-foreground">
                    {actor.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>
            <div className="grid gap-1">
                <Link href={`/actor/${actor.id}`}>
                    <p className="leading-none font-semibold text-foreground hover:text-primary transition-colors duration-200">
                        {actor.name}
                    </p>
                </Link>
                <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground">{t("actor")}</span>
                </div>
            </div>
        </div>
    );
}

function LikeButton({ isLiked, onLike, onUnlike }) {
    return (
        <motion.div
            className="flex items-center gap-1 ml-auto"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <button
                onClick={isLiked ? onUnlike : onLike}
                aria-label="Toggle Favorite"
                className="p-2 rounded-full hover:bg-muted/30 transition-colors duration-200"
            >
                <Heart
                    className={`w-5 h-5 transition-colors duration-200 ${isLiked ? "fill-primary text-primary" : "text-muted-foreground"
                        }`}
                />
            </button>
        </motion.div>
    );
}

export function CardActorHorizontalSkeleton() {
    return (
        <div className="flex p-4 items-center border-b last:border-b-0">
            <div className="flex items-center gap-4">
                <Skeleton className="rounded-full w-12 h-12" />
                <div className="grid gap-1">
                    <Skeleton className="w-32 h-5" />
                    <Skeleton className="w-20 h-4" />
                </div>
            </div>
        </div>
    );
}
