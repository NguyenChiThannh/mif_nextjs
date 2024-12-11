import CardActorHorizontal from '@/components/card-actor-horizontal'
import React from 'react'

export function SectionActorMovie({ actors }) {
    return (
        <div className="grid grid-cols-2 gap-4">
            {
                actors.map((actor, index) => (
                    <CardActorHorizontal actor={actor} key={index} />
                ))
            }
        </div>

    )
}
