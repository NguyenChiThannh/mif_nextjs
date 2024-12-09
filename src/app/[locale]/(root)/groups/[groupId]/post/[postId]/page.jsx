"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Post, { PostSkeleton } from "@/components/post";
import { Input } from "@/components/ui/input";
import { Ellipsis, MessageCircle, Play, Send } from "lucide-react";
import { useParams } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import { mockComments } from "@/app/[locale]/(root)/groups/[groupId]/post/[postId]/(component)/mock-data";
import Comment, { CommentSkeleton } from "@/app/[locale]/(root)/groups/[groupId]/post/[postId]/(component)/comment";
import { groupPostApi } from "@/services/groupPostApi";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { commentApi } from "@/services/commentApi";
import Loading from "@/components/loading";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { useAppSelector } from "@/redux/store";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useQueryClient } from "@tanstack/react-query";

const SOCKET_URL = "http://localhost:8080/ws";

export default function DetailPost() {
    const { postId } = useParams();
    const authState = useAppSelector((state) => state.auth.authState);
    const [replyContent, setReplyContent] = useState("");
    const [replyTo, setReplyTo] = useState(null);
    const [liveComments, setLiveComments] = useState([]);
    const queryClient = useQueryClient();
    const [userVotes, setUserVotes] = useState({});

    const { data: post, isLoading: isLoadingPost } = groupPostApi.query.useGetPostByPostId(postId);
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingComment,
    } = commentApi.query.useGetAllCommentByPostId(postId);

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    const { isConnected, client } = useWebSocket(
        SOCKET_URL,
        authState.accessToken,
        `/topic/comments/${postId}`,
        (newComment) => {
            setLiveComments((prev) => {
                const isDuplicate = prev.some(
                    (existingComment) => existingComment.id === newComment.id
                );
                if (isDuplicate) {
                    return prev;
                }
                return [newComment, ...prev];
            });
            // Invalidate và refetch query để cập nhật UI
            queryClient.invalidateQueries({
                queryKey: ['comments', postId]
            });
        }
    );

    // Send comment function
    const handleSendComment = () => {
        if (replyContent.trim() && client?.active) {
            const comment = {
                postId: postId,
                content: replyContent,
                createAt: new Date().toISOString(),
            };

            client.publish({
                destination: "/app/comment.sendComment",
                body: JSON.stringify(comment),
            });

            setReplyContent("");
        }
    };

    // Thay đổi cách kết hợp comments
    const combinedComments = useMemo(() => {
        const commentMap = new Map();

        // Thêm comments từ API theo thứ tự trang
        data?.pages?.forEach((page) => {
            page.content.forEach((comment) => {
                if (!commentMap.has(comment.id)) {
                    commentMap.set(comment.id, comment);
                }
            });
        });

        // Thêm live comments vào đầu danh sách
        liveComments.forEach((comment) => {
            if (!commentMap.has(comment.id)) {
                commentMap.set(comment.id, comment);
            }
        });

        // Sắp xếp comments theo thời gian tạo (mới nhất lên đầu)
        return Array.from(commentMap.values()).sort((a, b) =>
            new Date(b.createAt) - new Date(a.createAt)
        );
    }, [data?.pages, liveComments]);

    if (isLoadingComment || isLoadingPost) return <Loading />

    const handleReply = (parentCommentId, replyContent, level = 1) => {
        const addReply = (comments, parentCommentId, newReply) => {
            return comments.map((comment) => {
                if (comment.id === parentCommentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), newReply],
                    };
                } else if (comment.replies) {
                    return {
                        ...comment,
                        replies: addReply(comment.replies, parentCommentId, newReply),
                    };
                }
                return comment;
            });
        };

        const newReply = {
            id: Date.now(),
            author: "You",
            content: replyContent,
            timestamp: "Just now",
            upvotes: 0,
            replies: [],
        };

        setComments(addReply(comments, parentCommentId, newReply));
        setReplyContent("");
        setReplyTo(null);
    };

    const renderComments = (comments, level = 1) => {
        return comments.map((comment, index) => (
            <div key={comment.id} className={`${level === 1 ? 'relative' : 'ml-8 relative'}`}>
                {/* Straight line from parent element to first child element */}
                {comment?.replies?.length && (
                    <div
                        className={`absolute h-full border-l-2 border-s-muted left-4 top-12`}
                        style={{
                            height: 'calc(100% - 50px)',
                        }}
                    ></div>
                )}
                {level > 1 && (
                    <div
                        className={`absolute h-full border-t-2 w-4 -left-4 top-4 z-10 border-l-2 border-t-muted 
                    ${index === (comments.length - 1) ? "border-s-card" : "border-s-muted"}`}
                        style={{
                            height: 'calc(100% - 20px)',
                        }}
                    ></div>
                )}
                <Comment
                    comment={comment}
                    setReplyTo={setReplyTo}
                    replyTo={replyTo}
                    onVote={handleVote}
                    userVotes={userVotes}
                />
                {replyTo === comment.id && (
                    <div className="my-2 ml-8 flex items-start gap-4 z-10">
                        <Input
                            placeholder="Nhập bình luận..."
                            className="h-auto resize-none overflow-hidden"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <Button
                            size="icon"
                            onClick={() => handleReply(comment.id, replyContent, level)}
                        >
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                )}
                {comment.replies && renderComments(comment.replies, level + 1)}
            </div>
        ));
    };

    const handleVote = (commentId, voteType) => {
        const hasVoted = userVotes[commentId] === voteType;
        if (hasVoted) {
            // Remove vote
            client.publish({
                destination: "/app/comment.removeVote",
                body: JSON.stringify(commentId),
            });
            setUserVotes((prev) => ({ ...prev, [commentId]: null }));
        } else {
            // Upvote or downvote comment
            client.publish({
                destination: `/app/comment.${voteType}`,
                body: JSON.stringify(commentId),
            });
            setUserVotes((prev) => ({ ...prev, [commentId]: voteType }));
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto shadow-xl rounded-lg bg-card h-full">
            {isLoadingPost ? (
                <PostSkeleton />
            ) : (
                <Post post={post} className={'drop-shadow-sm'} />
            )}
            <div className="flex items-center gap-2 px-2 mt-4">
                <Textarea
                    placeholder="Nhập bình luận..."
                    rows={1}
                    className="h-auto resize-none overflow-hidden"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                />
                <Button size="icon" onClick={handleSendComment}>
                    <Send className="w-4 h-4" />
                    <span className="sr-only">Send</span>
                </Button>
            </div>
            <div className="space-y-1 mx-2 bg-inherit">
                {isLoadingComment && (
                    <>
                        <CommentSkeleton />
                        <CommentSkeleton />
                        <CommentSkeleton />
                    </>
                )}
                {!isLoadingComment && combinedComments.map(comment => (
                    <div key={comment.id} className="relative">
                        <Comment
                            comment={comment}
                            setReplyTo={setReplyTo}
                            replyTo={replyTo}
                            onVote={handleVote}
                            userVotes={userVotes}
                        />
                        {replyTo === comment.id && (
                            <div className="my-2 ml-8 flex items-start gap-4 z-10">
                                <Input
                                    placeholder="Nhập bình luận..."
                                    className="h-auto resize-none overflow-hidden"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                />
                                <Button
                                    size="icon"
                                    onClick={() => handleReply(comment.id, replyContent, 1)}
                                >
                                    <Send className="w-4 h-4" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        )}
                        {comment.replies && renderComments(comment.replies, 2)}
                    </div>
                ))}
                {isFetchingNextPage && <CommentSkeleton />}
            </div>
            <div ref={observerElem} className="mb-4">Het comment</div>
        </div>
    );
}
