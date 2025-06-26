import { QUERY_KEY } from '@/services/key'
import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
  useQuery,
} from '@tanstack/react-query'
import { privateApi } from '@/services/config'

const getAllNotifications = async ({ pageParam = 0, queryKey }) => {
  const res = await privateApi.get('/notifications', {
    params: {
      page: pageParam,
      size: 50,
    },
  })
  return res.data
}

const markAsRead = async (id) => {
  const res = await privateApi.put(`/notifications/${id}/read`)
  return res.data
}

const getUnreadNotificationCount = async () => {
  const res = await privateApi.get('/notifications/unread-count')
  return res.data
}

export const notificationApi = {
  query: {
    useGetAllNotifications() {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.notifications(),
        queryFn: getAllNotifications,
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length
          return lastPage.last ? undefined : nextPage
        },
      })
    },
    useGetUnreadNotificationCount() {
      return useQuery({
        queryKey: QUERY_KEY.unreadNotificationCount(),
        queryFn: getUnreadNotificationCount,
      })
    },
  },
  mutation: {
    useMarkAsRead() {
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: markAsRead,
        onSuccess: () => {
          queryClient.invalidateQueries(QUERY_KEY.notifications())
          queryClient.invalidateQueries(QUERY_KEY.unreadNotificationCount())
        },
      })
    },
  },
}
