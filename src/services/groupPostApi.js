import { privateApi } from '@/services/config'
import { QUERY_KEY } from '@/services/key';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

const getPostsByGroupId = async ({ pageParam = 0, queryKey }) => {
    const [_key, { groupId }] = queryKey;
    const res = await privateApi.get(`/groups/${groupId}/posts`, {
        params: {
            page: pageParam,
        }
    });
    return res.data;
}

const upvotePost = async (postId) => {
    const res = await privateApi.post(`/group-posts/${postId}/upvote`)
    return res.data
}

const downvotePost = async (postId) => {
    const res = await privateApi.post(`/group-posts/${postId}/downvote`)
    return res.data
}

const removevotePost = async (postId) => {
    const res = await privateApi.delete(`/group-posts/${postId}/vote`)
    return res.data
}

const createPost = async (data) => {
    const res = await privateApi.post(`/group-posts`, data)
    return res.data
}

const getAllPosts = async ({ pageParam = 0, queryKey }) => {
    const res = await privateApi.get(`/group-posts`, {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const getAllPostsTable = async ({ queryKey }) => {
    const [_key, { page, size }] = queryKey;
    const res = await privateApi.get('/group-posts', {
        params: {
            page,
            size,
            pageView: true,
        }
    })
    return res.data
}

const getPostById = async (postId) => {
    const res = await privateApi.get(`/group-posts/${postId}`)
    return res.data
}

const deletePost = async (postId) => {
    const res = await privateApi.delete(`/group-posts/${postId}`)
    return res.data
}

const editPost = async (data) => {
    const res = await privateApi.put(`/group-posts/${data.postId}`, data)
    return res.data
}

export const groupPostApi = {
    query: {
        useGetPostsByGroupIdInfinite(groupId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.groupPosts(groupId),
                queryFn: getPostsByGroupId,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
        useGetPostByPostId(postId) {
            return useQuery({
                queryKey: QUERY_KEY.postById(postId),
                queryFn: ({ queryKey }) => getPostById(queryKey[1]),
            })
        },
        useGetAllPosts() {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.allPosts(),
                queryFn: getAllPosts,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            })
        },
        useGetAllPostsTable(page, size) {
            return useQuery({
                queryKey: QUERY_KEY.allPostsTable(page, size),
                queryFn: getAllPostsTable,
            })
        }
    },
    mutation: {
        useUpVotePost(groupId) {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: upvotePost,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                },
            })
        },
        useDownVotePost(groupId) {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: downvotePost,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                },
            })
        },
        useRemoveVotePost(groupId) {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: removevotePost,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                },
            })
        },
        useCreatePost(groupId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: createPost,
                onSuccess: () => {
                    toast.success(t('create_post_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                },
            })
        },
        useEditPost(groupId, postId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: editPost,
                onSuccess: () => {
                    toast.success(t('edit_post_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.allPosts() })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.postById(postId) })
                },
            })
        },
        useDeletePost(groupId, postId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: deletePost,
                onSuccess: () => {
                    toast.success(t('delete_post_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPosts(groupId) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.allPosts() })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.postById(postId) })
                },
            })
        },
    },
}