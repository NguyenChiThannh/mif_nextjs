import { QUERY_KEY } from "@/services/key";
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { privateApi } from "@/services/config";
export const getTopActors = async ({ queryKey }) => {
    const [_key, { page, size, pageView }] = queryKey;
    const res = await privateApi.get('/actors', {
        params: {
            page,
            size,
            pageView,
        }
    })
    return res.data
}

export const getTopActorsInfinite = async ({ queryKey, pageParam = 0 }) => {
    const res = await privateApi.get('/actors', {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const getActorById = async (actorId) => {
    const res = await privateApi.get(`/actors/${actorId}`)
    return res.data
}

const getActorFilmography = async (actorId) => {
    const res = await privateApi.get(`/actors/${actorId}/filmography`)
    return res.data
}

const createActor = async (data) => {
    const res = await privateApi.post('/actors', data)
    return res.data
}

const deleteActor = async ({ actorId }) => {
    console.log('🚀 ~ deleteActor ~ actorId:', actorId)
    const res = await privateApi.delete(`/actors/${actorId}`)
    return res.data
}


const searchActorsByTitle = async ({ queryKey }) => {
    const [_key, name] = queryKey
    const res = await privateApi.get('/actors/search', {
        params: {
            title: name
        }
    })
    return res.data
}

export const actorApi = {
    query: {
        useGetActorFilmography(actorId) {
            return useQuery({
                queryKey: QUERY_KEY.actorMovieography(actorId),
                queryFn: ({ queryKey }) => getActorFilmography(queryKey[1]),
            })
        },
        useGetActorById(actorId, enabled = true) {
            return useQuery({
                queryKey: QUERY_KEY.actorById(actorId),
                queryFn: ({ queryKey }) => getActorById(queryKey[1]),
                enabled,
            })
        },
        useGetTopActors(page, size, pageView = false) {
            return useQuery({
                queryKey: QUERY_KEY.topActors(page, size, pageView),
                queryFn: getTopActors,
            })
        },
        useGetTopActorsInfinite() {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.topActorsInfinite(),
                queryFn: getTopActorsInfinite,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
        useSearchActorsByTitle(name) {
            return useQuery({
                queryKey: QUERY_KEY.searchActorsByTitle(name),
                queryFn: searchActorsByTitle,
                enabled: !!name,
            })
        }
    },
    mutation: {
        useCreateActor() {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: createActor,
                onSuccess: () => {
                    queryClient.invalidateQueries({
                        queryKey: QUERY_KEY.topActors(0, 10, true),
                    })
                    toast.success(t('create_actor_successful'))
                },
            })
        },
        useDeleteActor() {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: deleteActor,
                onSuccess: (_, variables) => {
                    // Lấy page, size, pageView từ variables (nếu cần, hoặc có thể lấy từ context nếu bạn đã lưu thông tin này)
                    const { page, size, pageView } = variables || {};
                    console.log('🚀 ~ useDeleteActor ~ variables:', variables)
                    console.log('🚀 ~ useDeleteActor ~ page, size, pageView:', page, size, pageView)

                    // Invalidate query cho đúng page, size và pageView
                    queryClient.invalidateQueries({
                        queryKey: QUERY_KEY.topActors(page, size, pageView),
                    });
                    toast.success(t('delete_actor_successful'));
                },
            })
        },
    }
}
