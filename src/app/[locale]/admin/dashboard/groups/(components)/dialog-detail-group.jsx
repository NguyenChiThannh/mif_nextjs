'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailGroup({ isOpen, onClose, groupData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-xl border border-muted shadow-lg bg-background">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">Group Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {[
                        { label: 'Id', value: groupData?.id },
                        { label: 'Group Name', value: groupData?.groupName },
                        { label: 'Description', value: groupData?.description },
                        { label: 'Group Type', value: groupData?.groupType },
                        { label: 'Is Public', value: groupData?.isPublic ? 'Public' : 'Private' },
                        { label: 'Number of Members', value: groupData?.memberCount },
                        { label: 'Post Weekly', value: groupData?.weeklyPostCount ?? 0 },
                        { label: 'Created At', value: formatDate(groupData?.createdAt) },
                        { label: 'Updated At', value: formatDate(groupData?.updatedAt) },
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between px-4 py-2 rounded-md bg-muted/50 text-wrap">
                            <span className="text-muted-foreground">{item.label}:</span>
                            <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                    ))}
                </div>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/groups/${groupData.id}`)}>
                        Go to page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
