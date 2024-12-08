import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const addFavoriteActor = async (actorId) => {
    const res = await privateApi.post(`/favoriteActors/${actorId}`)
    return res.data
}

export const removeFavoriteActor = async (actorId) => {
    const res = await privateApi.delete(`/favoriteActors/${actorId}`)
    return res.data
}

const isActorFavorite = async (actorId) => {
    const res = await privateApi.get(`/favoriteActors/${actorId}`)
    return res.data
}

const getFavoriteActors = async ({ queryKey, pageParam = 0 }) => {
    const res = await privateApi.get('/favoriteActors', {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

export const favoriteActorsApi = {
    query: {
        useGetFavoriteActors() {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.favoriteActors(),
                queryFn: getFavoriteActors,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
    },
    mutation: {
        useAddFavoriteActor() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: addFavoriteActor,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteActors() })
                }
            })
        },
        useRemoveFavoriteActor() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: removeFavoriteActor,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.favoriteActors() })
                }
            })
        },
        useIsActorFavorite() {
            return useMutation({
                mutationFn: isActorFavorite,
            })
        }
    }
}