'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailPost({ isOpen, onClose, postData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Post Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Id</strong> {postData?.id}</p>
                    <p><strong>Title:</strong> {postData?.title}</p>
                    <p><strong>Content:</strong> {postData?.content}</p>
                    <p><strong>GroupId:</strong> {postData?.groupId}</p>
                    <p><strong>Vote Number:</strong> {postData?.voteNumber}</p>
                    <p><strong>Owner:</strong> {postData?.owner?.displayName}</p>
                    <p><strong>Created At:</strong> {formatDate(postData?.createdAt)}</p>
                    <p><strong>Updated At:</strong> {formatDate(postData?.updatedAt)}</p>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/groups/${postData.groupId}/post/${postData.id}`)}>Go to page</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

