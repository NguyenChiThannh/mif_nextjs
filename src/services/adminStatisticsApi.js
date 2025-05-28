import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useQuery } from "@tanstack/react-query"

const getStatistics = async () => {
    const res = await privateApi.get('admin/statistics')
    return res.data
}

const getStatisticsSentimentStats = async () => {
    const res = await privateApi.get('movies/sentiment-stats')
    return res.data
}

const getUserStatisticsByYear = async (year) => {
    const res = await privateApi.get(`users/statistics/monthly?year=${year}`)
    return res.data
}

const getPostStatisticsByYear = async (year) => {
    const res = await privateApi.get(`group-posts/statistics/monthly?year=${year}`)
    return res.data
} 

const getRatingStatisticsByYear = async (year) => {
    const res = await privateApi.get(`movie-ratings/statistics/monthly?year=${year}`)
    return res.data
}

export const adminStatisticsApi = {
    query: {
        useGetStatistics() {
            return useQuery({
                queryKey: QUERY_KEY.dashboardStatistics(),
                queryFn: getStatistics,
            })
        },
        useGetStatisticsSentimentStats() {
            return useQuery({
                queryKey: QUERY_KEY.dashboardStatisticsSentimentStats(),
                queryFn: getStatisticsSentimentStats,
            })
        },
        useGetUserStatisticsByYear(year) {
            return useQuery({
                queryKey: QUERY_KEY.userStatisticsByYear(year),
                queryFn: () => getUserStatisticsByYear(year),
            })
        },
        useGetPostStatisticsByYear(year) {
            return useQuery({
                queryKey: QUERY_KEY.postStatisticsByYear(year),
                queryFn: () => getPostStatisticsByYear(year),
            })
        },
        useGetRatingStatisticsByYear(year) {
            return useQuery({
                queryKey: QUERY_KEY.ratingStatisticsByYear(year),
                queryFn: () => getRatingStatisticsByYear(year),
            })
        },
    }
} 