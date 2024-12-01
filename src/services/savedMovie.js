import { QUERY_KEY } from "@/services/key"
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { privateApi } from "@/services/config"

const saveMovie = async (movieId) => {
    const res = await privateApi.post(`saved-movies/${movieId}`)
    return res.data
}

const getSavedMovies = async ({ queryKey, pageParam = 0 }) => {
    const [_key, userId] = queryKey;
    const res = await privateApi.get('saved-movies', {
        params: {
            page: pageParam,
        },
    });
    return res.data;
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
        useGetSavedMovies(userId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.savedMovie(userId),
                queryFn: getSavedMovies,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            })
        },
    },
    mutation: {
        useSaveMovie() {
            return useMutation({
                mutationFn: saveMovie,
            })
        },
        useUnSaveMovie() {
            return useMutation({
                mutationFn: unSaveMovie,
            })
        },
        useBatchCheckSavedStatus() {
            return useMutation({
                mutationFn: batchCheckSavedStatus,
            })
        }
    }
}