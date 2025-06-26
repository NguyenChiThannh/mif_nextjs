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

export default function DialogDetailUser({ isOpen, onClose, userData }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-lg rounded-xl border border-muted shadow-lg bg-background'>
        <DialogHeader>
          <DialogTitle className='text-lg font-semibold text-foreground'>
            User Details
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-3'>
          {[
            { label: 'Id', value: userData?.id },
            { label: 'Email', value: userData?.email },
            { label: 'Display Name', value: userData?.displayName },
            { label: 'Bio', value: userData?.bio },
            { label: 'Day of Birth', value: formatDate(userData?.dob) },
            { label: 'isActive', value: userData?.isActive ? 'Yes' : 'No' },
            { label: 'Type', value: userData?.userType },
            {
              label: 'Role',
              value:
                userData?.authorities?.[userData?.authorities.length - 1]
                  ?.authority,
            },
            { label: 'Created At', value: formatDate(userData?.createdAt) },
            { label: 'Updated At', value: formatDate(userData?.updatedAt) },
          ].map((item, index) => (
            <div
              key={index}
              className='flex justify-between px-4 py-2 rounded-md bg-muted/50'
            >
              <span className='text-muted-foreground'>{item.label}:</span>
              <span className='font-medium text-foreground'>
                {item.value || 'N/A'}
              </span>
            </div>
          ))}
        </div>
        <DialogFooter className='mt-4'>
          <Button variant='secondary' onClick={onClose} className='w-full'>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
