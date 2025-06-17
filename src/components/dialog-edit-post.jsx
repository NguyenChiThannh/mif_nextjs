"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, PencilLine, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { schemaPost } from "@/lib/schemas/post-group.schema";
import { groupPostApi } from "@/services/groupPostApi";
import useUserId from "@/hooks/useUserId";
import { userApi } from "@/services/userApi";
import { useTranslations } from "next-intl";
import useUploadImages from "@/hooks/useUploadImages";
import Loading from "@/components/loading";
import MovieMentionInput from "@/components/movie-mention-input";

export default function DialogEditPost({ post, groupId }) {
    const [open, setOpen] = useState(false);
    const t = useTranslations("Groups.Post");
    const tForm = useTranslations("Groups.DialogCreatePost");
    const tSchema = useTranslations("Schema.postGroup");
    const [isLoading, setIsLoading] = useState(false);

    const { images, setImages, handleImageChange, removeImage, uploadImage } =
        useUploadImages();

    const userId = useUserId();
    const { data: userInfo } = userApi.query.useGetUserInfoById(userId);


    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schemaPost(tSchema)),
        defaultValues: {
            title: post?.title,
            content: post?.content,
            groupId: groupId,
        },
    });

    const editPostMutation = groupPostApi.mutation.useEditPost(groupId, post?.id);

    useEffect(() => {
        if (post?.mediaUrls?.length > 0) {
            setImages(post.mediaUrls.map(url => ({ url })));
        }
    }, [post?.mediaUrls]);

    if (isLoading) return <Loading />;

    const onSubmit = async (data) => {
        setIsLoading(true);
        const mediaUrls = await Promise.all(
            images.map((image) => {
                if (image.url) return image.url;
                return uploadImage(image);
            })
        );

        const updatedData = {
            ...data,
            mediaUrls,
            postId: post.id,
        };

        editPostMutation.mutate(updatedData, {
            onSuccess: () => {
                reset();
                setImages([]);
                setOpen(false);
            },
            onSettled: () => {
                setIsLoading(false);
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='gap-2' variant="ghost" size="sm">
                    <PencilLine className="h-4 w-4 mr-2" />
                    {t("edit_post")}
                </Button>      
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">
                        {t("edit_post")}
                    </DialogTitle>
                </DialogHeader>
                <Separator />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={userInfo?.profilePictureUrl} />
                            <AvatarFallback className="uppercase">
                                {userInfo?.displayName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">{userInfo?.displayName}</p>
                    </div>

                    <div>
                        <Label htmlFor="title" className="text-sm font-medium">
                            {tForm("title")}
                        </Label>
                        <Input
                            id="title"
                            placeholder={tForm("title_placeholder")}
                            {...register("title")}
                            className="mt-2"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-xs mt-2 font-bold">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="content" className="text-sm font-medium">
                            {tForm("content")}
                        </Label>
                        <MovieMentionInput
                            value={watch("content") || ""}
                            onChange={(value) => setValue("content", value)}
                            placeholder={tForm("content_placeholder")}
                        />
                        {errors.content && (
                            <p className="text-red-500 text-xs mt-2 font-bold">{errors.content.message}</p>
                        )}
                    </div>

                    <div>
                        <Label
                            htmlFor="imageUpload"
                            className="cursor-pointer flex items-center gap-2 text-sm font-medium"
                        >
                            <Upload className="w-4 h-4" />
                            {tForm("add_picture")}
                        </Label>
                        <input
                            type="file"
                            id="imageUpload"
                            className="hidden"
                            multiple
                            onChange={handleImageChange}
                        />
                        <div className="flex flex-wrap gap-3 mt-3">
                            {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={image.url || URL.createObjectURL(image)}
                                        alt={`image-${index}`}
                                        width={64}
                                        height={64}
                                        className="w-32 h-32 rounded object-cover"
                                    />
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {tForm("button_submit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
} 