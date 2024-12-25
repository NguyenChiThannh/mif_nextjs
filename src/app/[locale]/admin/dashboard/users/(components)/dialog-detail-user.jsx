'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailUser({ isOpen, onClose, userData }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Id</strong> {userData?.id}</p>
                    <p><strong>Email:</strong> {userData?.email}</p>
                    <p><strong>Display Name:</strong> {userData?.displayName}</p>
                    <p><strong>Bio:</strong> {userData?.bio}</p>
                    <p><strong>Day of Birth:</strong> {formatDate(userData?.dob)}</p>
                    <p><strong>isActive:</strong> {userData?.isActive ? 'Yes' : 'No'}</p>
                    <p><strong>Type:</strong> {userData?.userType}</p>
                    <p><strong>Role:</strong> {userData?.authorities?.[userData?.authorities.length - 1]?.authority}</p>
                    <p><strong>Created At:</strong> {formatDate(userData?.createdAt)}</p>
                    <p><strong>Updated At:</strong> {formatDate(userData?.updatedAt)}</p>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

