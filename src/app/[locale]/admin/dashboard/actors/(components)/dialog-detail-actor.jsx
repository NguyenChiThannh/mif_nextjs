'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/formatter'

export default function DialogDetailActor({
  isOpen,
  onClose,
  actorData,
  router,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-2xl rounded-xl border border-muted shadow-lg bg-background'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-foreground'>
            Actor Details
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-3 max-h-[70vh] overflow-y-auto'>
          {[
            { label: 'Id', value: actorData?.id },
            { label: 'Name', value: actorData?.name },
            { label: 'Bio', value: actorData?.bio || 'N/A' },
            {
              label: 'Day of Birth',
              value: formatDate(actorData?.dateOfBirth),
            },
            { label: 'Favorite Count', value: actorData?.favoriteCount ?? 0 },
            { label: 'Created At', value: formatDate(actorData?.createdAt) },
            { label: 'Updated At', value: formatDate(actorData?.updatedAt) },
          ].map((item, index) => (
            <div
              key={index}
              className='flex justify-between px-4 py-2 rounded-md bg-muted/50 text-wrap'
            >
              <span className='text-muted-foreground'>{item.label}:</span>
              <span className='font-medium text-foreground'>{item.value}</span>
            </div>
          ))}

          {actorData?.awards?.length > 0 && (
            <div className='bg-muted/50 rounded-md p-4'>
              <p className='text-muted-foreground font-medium mb-2'>Awards:</p>
              <ul className='list-disc pl-5 space-y-2'>
                {actorData.awards.map((award, index) => (
                  <li key={index} className='text-sm'>
                    <p>
                      <strong>Title:</strong> {award.name}
                    </p>
                    <p>
                      <strong>Year:</strong> {formatDate(award.date)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter className='mt-4 flex justify-end gap-2'>
          <Button variant='secondary' onClick={onClose}>
            Close
          </Button>
          <Button onClick={() => router.push(`/actor/${actorData.id}`)}>
            Go to page
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
