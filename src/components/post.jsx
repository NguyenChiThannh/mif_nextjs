"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useUserId from "@/hooks/useUserId";
import { formatDateOrTimeAgo } from "@/lib/formatter";
import { groupPostApi } from "@/services/groupPostApi";
import { savedPostApi } from "@/services/savedPostApi";
import {
  Bookmark,
  Ellipsis,
  LogOut,
  MessageCircle,
  MessageSquareWarning,
  PencilLine,
  Play,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Post({ className, post, isGroup }) {
  const t = useTranslations("Groups.Post");
  const userId = useUserId();
  const [vote, setVote] = useState(post?.userVotes || null);
  const [voteNumber, setVoteNumber] = useState(post?.voteNumber || 0);
  const [saved, setSaved] = useState(false);

  const upvoteMutation = groupPostApi.mutation.useUpVotePost(post.groupId);
  const downvoteMutation = groupPostApi.mutation.useDownVotePost(post.groupId);
  const removevoteMutation = groupPostApi.mutation.useRemoveVotePost(
    post.groupId
  );

  const savePostMutation = savedPostApi.mutation.useSavePost(userId);
  const unSavePostMutation = savedPostApi.mutation.useUnsavePost(userId);
  const batchCheckSavedStatusMutation =
    savedPostApi.mutation.useBatchCheckSavedStatus();

  const checkSavedStatus = () => {
    batchCheckSavedStatusMutation.mutate(
      { postIds: [post.id] },
      {
        onSuccess: (data) => {
          setSaved(data[post.id]);
        },
      }
    );
  };

  useEffect(() => {
    checkSavedStatus();
  }, [post.id]);

  const handleSaveStatusChange = (action) => {
    const mutation = action === "save" ? savePostMutation : unSavePostMutation;
    action === "save" ? setSaved(true) : setSaved(false);
    mutation.mutate(post.id, {
      onSuccess: checkSavedStatus,
    });
  };

  const handleUpvote = (postId) => {
    if (vote === "UPVOTE") {
      setVote(null);
      setVoteNumber(voteNumber - 1);
      removevoteMutation.mutate(postId);
    } else {
      setVote("UPVOTE");
      vote === "DOWNVOTE"
        ? setVoteNumber(voteNumber + 2)
        : setVoteNumber(voteNumber + 1);
      upvoteMutation.mutate(postId);
    }
  };

  const handleDownvote = (postId) => {
    if (vote === "DOWNVOTE") {
      setVote(null);
      setVoteNumber(voteNumber + 1);
      removevoteMutation.mutate(postId);
    } else {
      setVote("DOWNVOTE");
      vote === "UPVOTE"
        ? setVoteNumber(voteNumber - 2)
        : setVoteNumber(voteNumber - 1);
      downvoteMutation.mutate(postId);
    }
  };

  const hashtags = "#Hành động #Hài kịch";

  return (
    <div
      className={`grid w-full bg-card rounded-lg drop-shadow-2xl ${className}`}
    >
      <div className="grid gap-3 p-2 pt-4">
        <div className="flex justify-between w-full">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <Avatar className="w-10 h-10 flex items-center justify-center object-cover rounded-full border border-border">
              <AvatarImage
                src={post.owner.profilePictureUrl}
                alt={post.owner.displayName}
              />
              <AvatarFallback className="text-sm font-medium text-primary">
                T
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className="flex flex-col">
              <Link
                className="text-base font-semibold hover:underline"
                href={`/user/${post.owner.id}`}
              >
                {post.owner.displayName}
              </Link>
              <div className="flex items-center text-sm">
                {isGroup && (
                  <Link
                    href={`/groups/${post.groupId}`}
                    className="font-bold hover:underline"
                  >
                    G/{post.groupName}
                  </Link>
                )}
                <span className="mx-1">&middot;</span>
                <span>{formatDateOrTimeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Join Button */}
            {/* {joinStatus === "NOT_JOIN" && (
                            <div
                                className="px-2 py-1 text-sm font-medium cursor-pointer text-center transition-all bg-primary text-primary-foreground rounded-2xl shadow-md active:scale-95"
                            >
                                Tham gia
                            </div>
                        )}

                        {joinStatus === "PENDING" && (
                            <div
                                className="px-2 py-1 text-sm font-medium cursor-pointer border text-center transition-all rounded-2xl active:scale-95"
                            >
                                Hủy tham gia
                            </div>
                        )} */}

            {/* Dropdown Menu */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Ellipsis className="w-4 h-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <MessageSquareWarning className="h-4 w-4 mr-2" />
                  {t("report_post")}
                </DropdownMenuItem>
                {post.owner.id === userId && (
                  <>
                    <DropdownMenuItem onClick={() => {}}>
                      <PencilLine className="h-4 w-4 mr-2" />
                      {t("edit_post")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {}}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("delete_post")}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-lg font-bold">{post?.title}</p>
        <ContentWithReadMore content={post.content} maxLength={200} t={t} />
      </div>
      {post?.mediaUrls.length !== 0 && (
        <div className="w-full">
          <Image
            src={post.mediaUrls[0]}
            width={400}
            height={400}
            alt="Image"
            className="w-full h-[400px] object-contain"
            quality={75}
          />
        </div>
      )}
      <Separator />
      <div className="flex justify-around items-center">
        <div className="flex items-center">
          <Button
            variant="ghost rounded-full"
            onClick={() => handleUpvote(post.id)}
          >
            <Play
              className={`-rotate-90 font-bold h-5 w-5 ${
                vote === "UPVOTE" ? "text-green-500 fill-green-500" : ""
              }`}
            />
          </Button>
          <span>{voteNumber || 0}</span>
          <Button
            variant="ghost rounded-full"
            onClick={() => handleDownvote(post.id)}
          >
            <Play
              className={`rotate-90 font-bold h-5 w-5 ${
                vote === "DOWNVOTE" ? "text-blue-500 fill-blue-500" : ""
              }`}
            />
          </Button>
        </div>
        <Link href={`/groups/${post.groupId}/post/${post.id}`}>
          <Button variant="ghost" className="gap-1 items-center rounded-full">
            <MessageCircle className="h-5 w-5" />
            {t("comment")}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className={`flex items-center gap-1 rounded-full ${
            saved ? "text-yellow-500 hover:text-yellow-500" : ""
          }`}
          onClick={() => handleSaveStatusChange(saved ? "unsave" : "save")}
        >
          <Bookmark
            className={`h-5 w-5 ${saved ? "fill-yellow-500" : "fill-none"}`}
          />
          {saved ? t("saved") : t("save")}
        </Button>
      </div>
    </div>
  );
}

function ContentWithReadMore({ content, maxLength = 200, t }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isContentLong = content.length > maxLength;

  const toggleContent = () => {
    setIsExpanded(!isExpanded);
  };

  const renderContent = () => {
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    return parts.map((part, index) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        const [_, display, id] = match;
        return (
          <Link
            key={index}
            href={`/movies/${id}`}
            className="text-blue-500 hover:underline"
          >
            {display}
          </Link>
        );
      }
      return part;
    });
  };

  return (
    <div>
      <p className="text-sm md:text-base lg:text-sm w-full inline">
        {isContentLong && !isExpanded
          ? renderContent().slice(0, maxLength) + "..."
          : renderContent()}
      </p>
      {isContentLong && (
        <Button
          variant="link"
          onClick={() => toggleContent()}
          className="ml-2 text-blue-600 h-4"
        >
          {isExpanded ? "" : t("more")}
        </Button>
      )}
    </div>
  );
}

export const PostSkeleton = () => {
  return (
    <div className={"grid w-full bg-card rounded-lg drop-shadow-2xl"}>
      <div className="grid gap-3 p-2 pt-4">
        <div className="flex gap-2 items-center">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-1/5 h-6" />
        </div>
        <Skeleton className="w-2/3 h-8" />
        <Skeleton className="w-full h-16" />
      </div>
      <div className="w-full">
        <Skeleton
          width={1000}
          height={1000}
          className="w-full aspect-[16/6] object-cover"
        />
      </div>
      <Separator />
      <div className="flex justify-around items-centerm mt-1">
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-24 h-8" />
        <Skeleton className="w-24 h-8" />
      </div>
    </div>
  );
};

// const handleUpvote = (postId) => {
//     const upvoteMutation = useMutation({
//         mutationFn: async (postId) => {
//             try {
//                 await privateApi.post(`/group-posts/${postId}/vote`, { type: 'UPVOTE' });
//             } catch (error) {
//                 return Promise.reject(error);
//             }
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries('group_posts');
//         },
//         onError: () => {
//             toast('Có lỗi, vui lòng thử lại');
//         },
//     });

//     setVote('UPVOTE');
//     if (vote === 'DOWNVOTE') {
//         setVoteNumber(voteNumber + 2)
//     }
//     else {
//         setVoteNumber(voteNumber + 1)
//     }
//     upvoteMutation.mutate(postId);
// }
// }
