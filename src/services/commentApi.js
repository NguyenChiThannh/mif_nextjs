import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getCommentsByPostId = async ({ pageParam = 0, queryKey }) => {
    const [_key, postId] = queryKey;
    const res = await privateApi.get(`/post/${postId}/comments`, {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const voteComment = async ({ commentId, voteType }) => {
    const res = await privateApi.post(`/comments/${commentId}/${voteType}`);
    return res.data;
};

export const commentApi = {
    query: {
        useGetAllCommentByPostId(postId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.commentByPostId(postId),
                queryFn: getCommentsByPostId,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            })
        }
    },
    mutation: {
        useVoteComment() {
            const queryClient = useQueryClient();
            return useMutation({
                mutationFn: voteComment,
                onSuccess: (data, variables) => {
                    // Invalidate the comments query to refetch with updated votes
                    queryClient.invalidateQueries({
                        queryKey: QUERY_KEY.commentByPostId(data.postId)
                    });
                },
            });
        }
    }
}
