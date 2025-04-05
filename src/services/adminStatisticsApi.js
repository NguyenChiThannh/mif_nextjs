import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useQuery } from "@tanstack/react-query"

const getStatistics = async () => {
    const res = await privateApi.get('admin/statistics')
    return res.data
}

export const adminStatisticsApi = {
    query: {
        useGetStatistics() {
            return useQuery({
                queryKey: QUERY_KEY.dashboardStatistics(),
                queryFn: getStatistics,
            })
        }
    }
} 