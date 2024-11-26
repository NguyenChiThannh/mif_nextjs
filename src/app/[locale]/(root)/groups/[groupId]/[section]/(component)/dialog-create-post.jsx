'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { schemaPost } from "@/lib/schemas/post-group.schema";
import { useMutation } from "@tanstack/react-query";
import { groupPostApi } from "@/services/groupPostApi";
import useUserId from "@/hooks/useUserId";
import { userApi } from "@/services/userApi";
import { useTranslations } from "next-intl";

export default function CreatePostDialog({ groupId }) {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState([]);

    const userId = useUserId();
    const { data: userInfo } = userApi.query.useGetUserInfoById(userId);
    const t = useTranslations("Groups.DialogCreatePost");

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaPost),
    });

    const createPostMutation = groupPostApi.mutation.useCreatePost();

    useEffect(() => {
        if (groupId) setValue("groupId", groupId);
    }, [groupId, setValue]);

    const onSubmit = (data) => {
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", data.content);
        images.forEach((image) => formData.append("images", image));

        createPostMutation.mutate(formData, {
            onSuccess: () => {
                reset();
                setImages([]);
                setOpen(false);
            },
        });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages((prevImages) => [...prevImages, ...files]);
    };

    const removeImage = (index) => setImages(images.filter((_, i) => i !== index));

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    {t("create_post")}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{t("create_post")}</DialogTitle>
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
                        <Label htmlFor="title" className="text-sm font-medium">{t("title")}</Label>
                        <Input
                            id="title"
                            placeholder={t("title_placeholder")}
                            {...register("title", { required: true })}
                            className="mt-2"
                            required
                        />
                        {errors.title && <p className="text-red-500 text-xs">{t("title_error")}</p>}
                    </div>

                    <div>
                        <Label htmlFor="content" className="text-sm font-medium">{t("content")}</Label>
                        <Textarea
                            id="content"
                            placeholder={t("content_placeholder")}
                            {...register("content", { required: true })}
                            className="mt-2"
                            rows={5}
                        />
                        {errors.content && <p className="text-red-500 text-xs">{t("content_error")}</p>}
                    </div>

                    <div>
                        <Label htmlFor="imageUpload" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                            <Upload className="w-4 h-4" />
                            {t("add_picture")}
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
                                        src={URL.createObjectURL(image)}
                                        alt={`image-${index}`}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded object-cover"
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
                        <Button type="submit" disabled={createPostMutation.isLoading}>
                            {createPostMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("button_submit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}


// const onSubmit = (data) => {
//     if (!data.title) {
//         toast.error('Tiêu đề không được để trống');
//         return;
//     }

//     if (data.title.length < 5) {
//         toast.error('Tiêu đề phải có ít nhất 5 ký tự');
//         return;
//     }

//     if (data.title.length > 100) {
//         toast.error('Tiêu đề không được quá 100 ký tự');
//         return;
//     }

//     if (!data.content) {
//         toast.error('Nội dung không được để trống');
//         return;
//     }

//     if (data.content.length < 10) {
//         toast.error('Nội dung phải có ít nhất 10 ký tự');
//         return;
//     }

//     // Tạo FormData để gửi lên server nếu validation thành công
//     const formData = new FormData();
//     formData.append("title", data.title);
//     formData.append("content", data.content);
//     formData.append("images", image);

//     const createPostMutation = useMutation({
//         mutationFn: async (formData) => {
//             try {
//                 const res = await privateApi.post(`/group-posts`, formData);
//                 return res.data;
//             } catch (error) {
//                 return Promise.reject(error);
//             }
//         },
//         onSuccess: () => {
//             toast.success(t('create_post_successful'));
//         },
//         onError: () => {
//             toast.error(t('create_post_failed'));
//         }
//     });

//     // Thực hiện gọi API khi form được submit
//     createPostMutation.mutate(formData);
// };