import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

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

const getFavoriteActors = async ({ queryKey }) => {
    const res = await privateApi.get('/favoriteActors')
    return res.data
}

export const favoriteActorsApi = {
    query: {
        useIsActorFavorite(actorId) {
            return useQuery({
                queryKey: QUERY_KEY.isActorFavorite(actorId),
                queryFn: ({ queryKey }) => isActorFavorite(queryKey[1]),
            });
        },
    },
    mutation: {
        useAddFavoriteActor() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: addFavoriteActor,
                // onSuccess: () => {
                //     queryClient.invalidateQueries('group_posts')
                // },
            })
        },
        useRemoveFavoriteActor() {
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: removeFavoriteActor,
                // onSuccess: () => {
                //     queryClient.invalidateQueries('group_posts')
                // },
            })
        }
    }
}