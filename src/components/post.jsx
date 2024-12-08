'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import useUserId from '@/hooks/useUserId'
import { formatDateTime } from '@/lib/formatter'
import { groupPostApi } from '@/services/groupPostApi'
import { savedPostApi } from '@/services/savedPostApi'
import { Bookmark, Ellipsis, LogOut, MessageCircle, MessageSquareWarning, Play, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

export default function Post({ className, post }) {
    const userId = useUserId()
    const [vote, setVote] = useState(post?.userVotes || null);
    const [voteNumber, setVoteNumber] = useState(post?.voteNumber || 0);
    const [saved, setSaved] = useState(false);

    const upvoteMutation = groupPostApi.mutation.useUpVotePost(post.groupId)
    const downvoteMutation = groupPostApi.mutation.useDownVotePost(post.groupId)
    const removevoteMutation = groupPostApi.mutation.useRemoveVotePost(post.groupId)

    const savePostMutation = savedPostApi.mutation.useSavePost(userId)
    const unSavePostMutation = savedPostApi.mutation.useUnsavePost(userId)
    const batchCheckSavedStatusMutation = savedPostApi.mutation.useBatchCheckSavedStatus()

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
        action === "save" ? setSaved(true) : setSaved(false)
        mutation.mutate(post.id, {
            onSuccess: checkSavedStatus,
        });
    };

    const handleUpvote = (postId) => {
        if (vote === 'UPVOTE') {
            setVote(null);
            setVoteNumber(voteNumber - 1)
            removevoteMutation.mutate(postId);
        } else {
            setVote('UPVOTE');
            vote === 'DOWNVOTE' ? setVoteNumber(voteNumber + 2) : setVoteNumber(voteNumber + 1)
            upvoteMutation.mutate(postId);
        }
    };

    const handleDownvote = (postId) => {
        if (vote === 'DOWNVOTE') {
            setVote(null);
            setVoteNumber(voteNumber + 1)
            removevoteMutation.mutate(postId);
        } else {
            setVote('DOWNVOTE');
            vote === 'UPVOTE' ? setVoteNumber(voteNumber - 2) : setVoteNumber(voteNumber - 1)
            downvoteMutation.mutate(postId);
        }
    };

    const hashtags = "#Hành động #Hài kịch";

    return (
        <div className={`grid w-full bg-card rounded-lg drop-shadow-2xl ${className}`}>
            <div className='grid gap-3 p-2 pt-4'>
                <div className='flex justify-between w-full'>
                    <div className='flex items-center gap-2'>
                        <Avatar className="w-8 h-8 flex items-center justify-center object-contain">
                            <AvatarImage src={post.owner.profilePictureUrl} alt="@shadcn" />
                            <AvatarFallback className="flex items-center justify-center">T</AvatarFallback>
                        </Avatar>
                        <p className='font-bold'>{post.owner.displayName} &middot;</p>
                        <p className='text-xs text-muted-foreground'>{formatDateTime(post.createdAt)}</p>
                    </div>
                    <div>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Ellipsis className='w-4 h-4' />
                                    <span className="sr-only">More</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { }}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Xóa bài viết
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <MessageSquareWarning className="h-4 w-4 mr-2" />
                                    Báo cáo bài viết
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
                <p className='text-lg font-bold'>{post?.title}</p>
                <ContentWithReadMore content={post.content} maxLength={200} />
            </div>
            {
                post?.mediaUrls.length !== 0
                &&
                <div className="w-full">
                    <Image
                        src={post.mediaUrls[0]}
                        width={1000}
                        height={1000}
                        alt="Image"
                        className="w-full object-cover"
                    />
                </div>
            }
            <Separator />
            <div className='flex justify-around items-center'>
                <div className='flex items-center'>
                    <Button variant="ghost rounded-full" onClick={() => handleUpvote(post.id)}>
                        <Play
                            className={`-rotate-90 font-bold h-5 w-5 ${vote === 'UPVOTE' ? 'text-green-500 fill-green-500' : ''}`}
                        />
                    </Button>
                    <span>{voteNumber || 0}</span>
                    <Button variant="ghost rounded-full" onClick={() => handleDownvote(post.id)}>
                        <Play
                            className={`rotate-90 font-bold h-5 w-5 ${vote === 'DOWNVOTE' ? 'text-blue-500 fill-blue-500' : ''}`}
                        />
                    </Button>
                </div>
                <Link
                    href={`/groups/${post.groupId}/post/${post.id}`}
                >
                    <Button variant="ghost" className="gap-1 items-center rounded-full">
                        <MessageCircle className='h-5 w-5' />
                        Bình luận
                    </Button>
                </Link>
                <Button
                    variant="ghost"
                    className={`flex items-center gap-1 rounded-full ${saved ? 'text-yellow-500 hover:text-yellow-500' : ''
                        }`}
                    onClick={() => handleSaveStatusChange(saved ? "unsave" : "save")}
                >
                    <Bookmark
                        className={`h-5 w-5 ${saved ? 'fill-yellow-500' : 'fill-none'}`}
                    />
                    {saved ? 'Đã lưu' : 'Lưu'}
                </Button>
            </div>
        </div>
    )
}

function ContentWithReadMore({ content, hashtags, maxLength = 200 }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const isContentLong = content.length > maxLength;

    const toggleContent = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div>
            <p className='text-sm md:text-base lg:text-sm w-full inline'>
                {isContentLong && !isExpanded ? content.slice(0, maxLength) + "..." : content}
            </p>
            {isContentLong && (
                <Button
                    variant="link"
                    onClick={() => toggleContent()}
                    className="ml-2 text-blue-600 h-4"
                >
                    {isExpanded ? "" : "Xem thêm"}
                </Button>
            )}
            {isExpanded && (
                <p className='text-xs italic mt-2'>{hashtags}</p>

            )}
        </div>
    );
}

export const PostSkeleton = () => {
    return (
        <div className={'grid w-full bg-card rounded-lg drop-shadow-2xl'}>
            <div className='grid gap-3 p-2 pt-4'>
                <div className='flex gap-2 items-center'>
                    <Skeleton className='w-8 h-8 rounded-full' />
                    <Skeleton className='w-1/5 h-6' />
                </div>
                <Skeleton className='w-2/3 h-8' />
                <Skeleton className='w-full h-16' />
            </div>
            <div className="w-full">
                <Skeleton
                    width={1000}
                    height={1000}
                    className="w-full aspect-[16/6] object-cover"
                />
            </div>
            <Separator />
            <div className='flex justify-around items-centerm mt-1'>
                <Skeleton className='w-24 h-8' />
                <Skeleton className='w-24 h-8' />
                <Skeleton className='w-24 h-8' />
            </div>
        </div>
    )
}

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