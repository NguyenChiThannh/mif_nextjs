import { QUERY_KEY } from "@/services/key"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

const { privateApi } = require("@/services/config")

const createRating = async (data) => {
    const res = await privateApi.post('/movie-ratings', data)
    return res.data
}

const removeRating = async (data) => {
    const res = await privateApi.delete(`/movie-ratings/${data.id}`)
    return res.data
}

const getAllRatingsByMovieId = async ({ queryKey }) => {
    const [_key, { page, size, movieId }] = queryKey
    const res = await privateApi.get(`/movies/${movieId}/ratings`, {
        params: {
            page,
            size,
        },
    })
    return res.data
}

export const movieRatingsApi = {
    query: {
        useGetAllRatingsByMovieId(movieId, page = 0, size = 4) {
            return useQuery({
                queryKey: QUERY_KEY.movieRatings(page, size, movieId),
                queryFn: getAllRatingsByMovieId,
            })
        }
    },
    mutation: {
        useCreateRating(movieId) {
            const queryClient = useQueryClient()
            const t = useTranslations('Toast')
            return useMutation({
                mutationFn: createRating,
                onSuccess: () => {
                    toast.success(t('create_rating_movie_successful'))
                    queryClient.invalidateQueries(QUERY_KEY.movieRatings(0, 4, movieId))
                }
            })
        },
        useRemoveRating() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: removeRating,
                onSuccess: () => {
                    toast.success(t('delete_rating_movie_successful'))
                }
            })
        }
    }
}