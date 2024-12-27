'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/formatter';

export default function DialogDetailMovie({ isOpen, onClose, movieData, router }) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Movie Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p><strong>Id</strong> {movieData?.id}</p>
                    <p><strong>Title:</strong> {movieData?.title}</p>
                    <p><strong>Description:</strong> {movieData?.description}</p>
                    <p><strong>Release Date:</strong> {formatDate(movieData?.releaseDate)}</p>
                    <p><strong>Average Rating:</strong> {movieData?.ratings?.averageRating}</p>
                    <p><strong>Number Of Ratings:</strong> {movieData?.ratings?.numberOfRatings}</p>
                    <p><strong>Country:</strong> {movieData?.country}</p>
                    <p><strong>Budget:</strong> {`${movieData?.budget} VND`}</p>
                    {movieData?.awards?.length > 0 && (
                        <div>
                            <p><strong>Awards:</strong></p>
                            <ul className="list-disc pl-5 space-y-2">
                                {movieData.awards.map((award, index) => (
                                    <li key={index} className="text-sm">
                                        <p><strong>Title:</strong> {award.name}</p>
                                        <p><strong>Year:</strong> {formatDate(award.date)}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <DialogFooter>
                    <Button variant="secondary" onClick={onClose}>Close</Button>
                    <Button onClick={() => router.push(`/movies/${movieData.id}`)}>Go to page</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

