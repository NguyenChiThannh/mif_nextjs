import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

const getNewestMovie = async ({ queryKey }) => {
    const [_key, { page, size }] = queryKey;
    const res = await privateApi.get('/movies/newest', {
        params: {
            page,
            size,
        },
    })
    return res.data
}

const getRandomMovies = async () => {
    const res = await privateApi.get('/movies/random')
    return res.data
}

const getAllMovies = async ({ queryKey, pageParam = 0 }) => {
    const res = await privateApi.get('/movies', {
        params: {
            page: pageParam,
        }
    })
    return res.data
}

const searchMoviesByTitle = async ({ queryKey }) => {
    const [_key, { page, size, title }] = queryKey
    const res = await privateApi.get('/movies/search', {
        params: {
            title,
            page,
            size,
        }
    })
    return res.data
}

const getMovieById = async (id) => {
    const res = await privateApi.get(`/movies/${id}`)
    return res.data
}

const createMovie = async (data) => {
    const res = await privateApi.post('/movies', data)
    return res.data
}

const getAllMoviesTable = async ({ queryKey }) => {
    const [_key, { page, size }] = queryKey;
    const res = await privateApi.get('/movies', {
        params: {
            page,
            size,
            pageView: true,
        }
    })
    return res.data
}

const deleteMovie = async (movieId) => {
    const res = await privateApi.delete(`/movies/${movieId}`)
    return res.data
}

const updateMovie = async (data) => {
    const { movieId, ...updateData } = data
    const res = await privateApi.put(`/movies/${movieId}`, updateData)
    return res.data
}

const getMovieImages = async (movieId) => {
    const res = await privateApi.get(`/movies/${movieId}/images`)
    return res.data
}

const updateMovieImages = async (data) => {
    const { movieId, ...updateData } = data
    const res = await privateApi.put(`/movies/${movieId}/images`, updateData)
    return res.data
}

export const movieApi = {
    query: {
        useGetNewestMovie(page, size) {
            return useQuery({
                queryKey: QUERY_KEY.newestMovies(page, size),
                queryFn: getNewestMovie,
            })
        },
        useGetRandomMovies() {
            return useQuery({
                queryKey: QUERY_KEY.randomMovies,
                queryFn: getRandomMovies,
            })
        },
        useGetAllMoviesInfinity() {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.allMovies(),
                queryFn: getAllMovies,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            })
        },
        useSearchMoviesByTitle(page, size, title) {
            return useQuery({
                queryKey: QUERY_KEY.searchMoviesByTitle(page, size, title),
                queryFn: searchMoviesByTitle,
            })
        },
        useGetMovieById(id, enabled = true) {
            return useQuery({
                queryKey: QUERY_KEY.movieById(id),
                queryFn: ({ queryKey }) => getMovieById(queryKey[1]),
                enabled,
            })
        },
        useGetAllMoviesTable(page = 0, size = 10) {
            return useQuery({
                queryKey: QUERY_KEY.moviesTable(page, size),
                queryFn: getAllMoviesTable,
            })
        },
        useGetMovieImages(movieId) {
            return useQuery({
                queryKey: QUERY_KEY.movieImages(movieId),
                queryFn: ({ queryKey }) => getMovieImages(queryKey[1]),
            })
        }
    },
    mutation: {
        useCreateMovie() {
            const queryClient = useQueryClient()
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: createMovie,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: ['movies_table'] })
                    toast.success(t('create_movie_successful'))
                },
            })
        },
        useDeleteMovie() {
            const queryClient = useQueryClient()
            const t = useTranslations('Toast')
            return useMutation({
                mutationFn: deleteMovie,
                onSuccess: () => {
                    toast.success(t('delete_movie_successful'))
                    queryClient.invalidateQueries({ queryKey: ['movies_table'] })
                }
            })
        },
        useUpdateMovie() {
            const queryClient = useQueryClient()
            const t = useTranslations('Toast')
            return useMutation({
                mutationFn: updateMovie,
                onSuccess: () => {
                    toast.success(t('update_movie_successful'))
                    queryClient.invalidateQueries({ queryKey: ['movies_table'] })
                }
            })
        },
        useUpdateMovieImages() {
            const t = useTranslations('Toast')
            return useMutation({
                mutationFn: updateMovieImages,
                onSuccess: () => {
                    toast.success(t('update_movie_successful'))
                }
            })
        }
    }
}
