import { privateApi } from "@/services/config";
import { QUERY_KEY } from "@/services/key";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";

const getSavedPosts = async ({ queryKey, pageParam = 0 }) => {
    console.log('Here 1')
    const res = await privateApi.get('/saved-posts', {
        params: {
            page: pageParam,
        }
    })
    console.log('Here 2')
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
        useSavePost() {
            return useMutation({
                mutationFn: savePost,
            })
        },
        useUnsavePost() {
            return useMutation({
                mutationFn: unsavePost,
            })
        },
        useBatchCheckSavedStatus() {
            return useMutation({
                mutationFn: batchCheckSavedStatus,
            })
        }
    }
}