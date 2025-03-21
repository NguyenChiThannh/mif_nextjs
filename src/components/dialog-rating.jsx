import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Rating from "@/components/rating";
import { schemaRatingMovie } from "@/lib/schemas/rating-movie.schema";
import { movieRatingsApi } from "@/services/movieRatingsApi";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

export default function DialogRating({ movieId }) {
    const [isOpen, setIsOpen] = useState(false);
    const createRatingMutation = movieRatingsApi.mutation.useCreateRating(movieId);
    const { handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaRatingMovie),
        defaultValues: {
            ratingValue: 0,
            movieId,
            comment: "",
        },
    });

    const onSubmit = (data) => {
        createRatingMutation.mutate(data, {
            onSuccess: () => {
                reset();
                setIsOpen(false);
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" variant='outline' onClick={() => setIsOpen(true)}>Đánh giá</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đánh giá phim</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                        <p className="font-bold">Điểm đánh giá</p>
                        <Controller
                            name="ratingValue"
                            control={control}
                            render={({ field }) => (
                                <Rating
                                    key={field.value}
                                    enableUserInteraction
                                    iconSize="xl"
                                    value={field.value}
                                    onClick={(newValue) => field.onChange(newValue)}
                                    showOutOf
                                />
                            )}
                        />
                    </div>
                    {errors.ratingValue && (
                        <p className="text-red-500 text-sm font-bold">{errors.ratingValue.message}</p>
                    )}

                    <p className="font-bold">Nội dung đánh giá</p>
                    <Controller
                        name="comment"
                        control={control}
                        render={({ field }) => (
                            <Textarea {...field} />
                        )}
                    />
                    {errors.comment && (
                        <p className="text-red-500 text-sm font-bold">{errors.comment.message}</p>
                    )}

                    <DialogFooter>
                        <Button type="submit">Đánh giá</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
