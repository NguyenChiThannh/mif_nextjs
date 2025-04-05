'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailPost({ isOpen, onClose, postData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl rounded-xl border border-muted shadow-lg bg-background">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-foreground">Post Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-[70vh] overflow-y-auto">
                    {[
                        { label: 'Id', value: postData?.id },
                        { label: 'Title', value: postData?.title },
                        { label: 'Content', value: postData?.content },
                        { label: 'Group Id', value: postData?.groupId },
                        { label: 'Vote Number', value: postData?.voteNumber ?? 0 },
                        { label: 'Owner', value: postData?.owner?.displayName },
                        { label: 'Created At', value: formatDate(postData?.createdAt) },
                        { label: 'Updated At', value: formatDate(postData?.updatedAt) },
                    ].map((item, index) => (
                        <div key={index} className="flex justify-between px-4 py-2 rounded-md bg-muted/50 text-wrap">
                            <span className="text-muted-foreground">{item.label}:</span>
                            <span className="font-medium text-foreground">{item.value || 'N/A'}</span>
                        </div>
                    ))}
                </div>
                <DialogFooter className="mt-4 flex justify-end gap-2">
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/groups/${postData.groupId}/post/${postData.id}`)}>
                        Go to page
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
