import { privateApi } from "@/services/config";
import { QUERY_KEY } from "@/services/key";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getSavedPosts = async ({ queryKey, pageParam = 0 }) => {
    const res = await privateApi.get('/saved-posts', {
        params: {
            page: pageParam,
        }
    })
    return res.data
}


const savePost = async (id) => {
    const res = await privateApi.post(`/saved-posts/${id}`)
    return res.data
}

const unsavePost = async (id) => {
    const res = await privateApi.delete(`/saved-posts/${id}`)
    return res.data
}

const batchCheckSavedStatus = async (data) => {
    const res = await privateApi.post('/saved-posts/batch-check', data)
    return res.data
}

export const savedPostApi = {
    query: {
        useGetSavedPosts(userId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.savedPosts(userId),
                queryFn: getSavedPosts,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            })
        },
    },
    mutation: {
        useSavePost(userId) {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: savePost,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.savedPosts(userId) })
                }
            })
        },
        useUnsavePost(userId) {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: unsavePost,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.savedPosts(userId) })
                }
            })
        },
        useBatchCheckSavedStatus() {
            return useMutation({
                mutationFn: batchCheckSavedStatus,
            })
        }
    }
}