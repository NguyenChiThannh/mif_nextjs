import { DialogCreateEvent } from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-create-event'
import { CardGroupsSkeleton } from '@/components/card-groups'
import React from 'react'

export default function EventsSection() {
    return (
        <>
            <div className="flex-1 mt-4">
                <div>
                    <DialogCreateEvent />
                </div>
                <div className="grid gap-8 mt-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {
                        Array.from({ length: 8 }).map((_, index) => {
                            return <CardGroupsSkeleton key={index} />
                        })
                    }
                </div>
            </div>
        </>
    )
}
