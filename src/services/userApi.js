import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

const getProfilePostByUserId = async ({ queryKey, pageParam = 0 }) => {
    const [_key, id] = queryKey;
    const res = await privateApi.get(`users/${id}/posts`, {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const getUserInfoById = async (id) => {
    const res = await privateApi.get(`/users/${id}/info`)
    return res.data
}

const updateUserProfile = async (data) => {
    const res = await privateApi.patch('/my-profile', data)
    return res.data
}

export const userApi = {
    query: {
        useGetUserInfoById(id) {
            return useQuery({
                queryKey: QUERY_KEY.userInfoById(id),
                queryFn: ({ queryKey }) => getUserInfoById(queryKey[1]),
            })
        },
        useGetProfilePostByUserId(id) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.profilePostByUserId(id),
                queryFn: getProfilePostByUserId,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
    },
    mutation: {
        useUpdateUserProfile(id) {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: updateUserProfile,
                onSuccess: () => {
                    toast.success(t('update_user_info_successful'))
                    queryClient.invalidateQueries(QUERY_KEY.userInfoById(id))
                },
            })
        }
    }
}
