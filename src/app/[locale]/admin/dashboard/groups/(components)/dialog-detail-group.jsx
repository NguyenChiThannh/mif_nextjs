'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailGroup({ isOpen, onClose, groupData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Group Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Id</strong> {groupData?.id}</p>
                    <p><strong>Group Name:</strong> {groupData?.groupName}</p>
                    <p><strong>Description:</strong> {groupData?.description}</p>
                    <p><strong>Group Type:</strong> {groupData?.groupType}</p>
                    <p><strong>IsPublic:</strong> {groupData?.isPublic ? 'Public' : 'Pravite'}</p>
                    <p><strong>Number of Member:</strong> {groupData?.memberCount}</p>
                    <p><strong>Post Weekly:</strong> {groupData?.weeklyPostCount || 0}</p>
                    <p><strong>Created At:</strong> {formatDate(groupData?.createdAt)}</p>
                    <p><strong>Updated At:</strong> {formatDate(groupData?.updatedAt)}</p>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/groups/${groupData.id}`)}>Go to page</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
