import { QUERY_KEY } from "@/services/key"
import { useMutation, useQuery } from "@tanstack/react-query"

const { privateApi } = require("@/services/config")

const saveMovie = async (movieId) => {
    const res = await privateApi.post(`saved-movies/${movieId}`)
    return res.data
}

const getSavedMovies = async ({ queryKey }) => {
    const [_key, { page, size }] = queryKey;
    const res = await privateApi.get('saved-movies', {
        params: {
            page,
            size,
        },
    })
    return res.data
}

const unSaveMovie = async (movieId) => {
    const res = await privateApi.delete(`saved-movies/${movieId}`)
    return res.data
}

const batchCheckSavedStatus = async (data) => {
    const res = await privateApi.post('saved-movies/batch-check', data)
    return res.data
}

export const savedMovieApi = {
    query: {
        useGetSavedMovies(page = 0, size = 5) {
            return useQuery({
                queryKey: QUERY_KEY.movieRatings(page, size),
                queryFn: getSavedMovies,
            })
        },

    },
    mutation: {
        useSaveMovie() {
            return useMutation({
                mutationFn: saveMovie,
                onSuccess: () => {

                }
            })
        },
        useUnSaveMovie() {
            return useMutation({
                mutationFn: unSaveMovie,
                onSuccess: () => {

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