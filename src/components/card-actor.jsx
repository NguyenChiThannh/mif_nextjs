import { Skeleton } from '@/components/ui/skeleton';
import { Triangle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function CardActor({ actor }) {
    const { name, rank } = actor;

    return (
        <div className="grid rounded-lg gap-4 w-40">
            {/* Actor Image */}
            <Image
                src="https://i1-dulich.vnecdn.net/2021/07/16/1-1626437591.jpg?w=1200&h=0&q=100&dpr=1&fit=crop&s=BWzFqMmUWVFC1OfpPSUqMA"
                alt={`${name} image`}
                width={200}
                height={200}
                className="h-full w-full object-cover rounded-full aspect-square shadow-lg"
            />

            {/* Actor Details */}
            <div className="pb-2">
                <Link
                    href={`/actor/${actor.id}`}
                >
                    <p className="flex justify-center text-base font-bold">{name}</p>
                </Link>

                <div className="flex justify-center items-center gap-[2px]">
                    <span className="text-sm">#{rank} (</span>

                    {/* Rank Indicator */}
                    <Triangle
                        className={`${true ? 'fill-green-500 text-green-500' : 'rotate-180 fill-red-500 text-red-500'
                            }`}
                        size={10}
                    />

                    <span className="text-sm">16)</span>
                </div>
            </div>
        </div>
    );
}

export const CardActorSkeleton = () => {
    return (
        <div className="grid rounded-lg gap-4 w-40">
            {/* Skeleton for Image */}
            <Skeleton className="h-full w-full object-cover rounded-full aspect-square" />

            <div className="grid pb-2 gap-2">
                {/* Skeleton for Name and Rank */}
                <Skeleton className="flex justify-center h-4" />
                <Skeleton className="flex justify-center h-4" />
            </div>
        </div>
    );
};
