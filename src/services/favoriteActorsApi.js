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
    const res = await privateApi.get('/favoriteActors')
    return res.data
}

export const favoriteActorsApi = {
    query: {
        useGetFavoriteActors(actorId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.isActorFavorite(actorId),
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
            return useMutation({
                mutationFn: addFavoriteActor,
            })
        },
        useRemoveFavoriteActor() {
            return useMutation({
                mutationFn: removeFavoriteActor,
            })
        },
        useIsActorFavorite() {
            return useMutation({
                mutationFn: isActorFavorite,
            })
        }
    }
}