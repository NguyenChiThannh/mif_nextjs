'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailActor({ isOpen, onClose, actorData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Actor Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Id</strong> {actorData?.id}</p>
                    <p><strong>Name:</strong> {actorData?.name}</p>
                    <p><strong>Bio:</strong> {actorData?.bio}</p>
                    <p><strong>Day of Birth:</strong> {formatDate(actorData?.dateOfBirth)}</p>
                    <p><strong>Favorite Count:</strong> {actorData?.favoriteCount}</p>
                    {actorData?.awards?.length > 0 && (
                        <div>
                            <p><strong>Awards:</strong></p>
                            <ul className="list-disc pl-5 space-y-2">
                                {actorData.awards.map((award, index) => (
                                    <li key={index} className="text-sm">
                                        <p><strong>Title:</strong> {award.name}</p>
                                        <p><strong>Year:</strong> {formatDate(award.date)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p><strong>Created At:</strong> {formatDate(actorData?.createdAt)}</p>
                    <p><strong>Updated At:</strong> {formatDate(actorData?.updatedAt)}</p>
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/actor/${actorData.id}`)}>Go to page</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

