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
import { Loader2, Upload, X } from "lucide-react";
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

export default function CreatePostDialog({ groupId }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { images, setImages, handleImageChange, removeImage, uploadImage } =
    useUploadImages();

  const userId = useUserId();
  const { data: userInfo } = userApi.query.useGetUserInfoById(userId);
  const t = useTranslations("Groups.DialogCreatePost");
  const tSchema = useTranslations("Schema.postGroup");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaPost(tSchema)),
  });

  const createPostMutation = groupPostApi.mutation.useCreatePost(groupId);

  useEffect(() => {
    if (groupId) setValue("groupId", groupId);
  }, [groupId, setValue]);

  if (isLoading) return <Loading />;

  // Function để extract movie mentions từ content - distinct only
  const extractMovieMentions = (content) => {
    if (!content) return [];

    // Regex để tìm movie mentions với format @[MovieTitle](movieId)
    const movieMentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const movieIds = new Set(); // Sử dụng Set để tự động distinct
    let match;

    while ((match = movieMentionRegex.exec(content)) !== null) {
      const movieId = match[2].trim(); // movieId từ (movieId), trim để clean
      if (movieId) {
        movieIds.add(movieId);
      }
    }

    const distinctMovieIds = Array.from(movieIds);
    console.log("Extracted distinct movie mentions:", distinctMovieIds);
    return distinctMovieIds;

    /* Test cases:
     * Input: "@[Inception](683f2e74f259647e8295a6b1) và @[The Dark Knight](683f32bbf259647e8295a74e) @[Inception](683f2e74f259647e8295a6b1)"
     * Output: ["683f2e74f259647e8295a6b1", "683f32bbf259647e8295a74e"] (distinct)
     *
     * Input: "Xem #[Group A](groupId1) và @[Movie A](movieId1) thật tuyệt!"
     * Output: ["movieId1"] (chỉ movie, không group)
     */
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      // Upload images
      const mediaUrls = await Promise.all(
        images.map((image) => uploadImage(image))
      );

      // Extract distinct movie mentions from content
      const mentionedMovieIds = extractMovieMentions(data.content);

      const updatedData = {
        ...data,
        mediaUrls,
        mentionedMovieIds, // Add distinct movie IDs
      };

      console.log("Post content:", data.content);
      console.log("Extracted movie IDs:", mentionedMovieIds);
      console.log("Final post data being sent to backend:", updatedData);

      createPostMutation.mutate(updatedData, {
        onSuccess: () => {
          reset();
          setImages([]);
          setOpen(false);
        },
        onSettled: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error creating post:", error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">{t("create_post")}</Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {t("create_post")}
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
              {t("title")}
            </Label>
            <Input
              id="title"
              placeholder={t("title_placeholder")}
              {...register("title")}
              className="mt-2"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-2 font-bold">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="content" className="text-sm font-medium">
              {t("content")}
            </Label>
            <MovieMentionInput
              value={watch("content") || ""}
              onChange={(value) => setValue("content", value)}
              placeholder={t("content_placeholder")}
              enableDropZone={true}
            />
            {errors.content && (
              <p className="text-red-500 text-xs mt-2 font-bold">
                {errors.content.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="imageUpload"
              className="cursor-pointer flex items-center gap-2 text-sm font-medium"
            >
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
              {t("button_submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
