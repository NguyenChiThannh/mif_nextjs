import { privateApi } from '@/services/config'
import { QUERY_KEY } from '@/services/key'
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { toast } from 'react-toastify'

const reportPost = async (data) => {
  const { postId, ...rest } = data
  const res = await privateApi.post(`/group-posts/${postId}/report`, rest)
  return res.data
}

const getUnresolvedReportsByGroup = async ({ pageParam = 0, queryKey }) => {
  const [_key, groupId] = queryKey
  const res = await privateApi.get(`/group-posts/${groupId}/reports`, {
    params: {
      page: pageParam,
      status: 'PENDING',
    },
  })
  return res.data
}

const getBlockReportedPostsByGroup = async ({ pageParam = 0, queryKey }) => {
  const [_key, groupId] = queryKey
  const res = await privateApi.get(`/group-posts/${groupId}/reports`, {
    params: {
      page: pageParam,
      status: 'BLOCKED',
    },
  })
  return res.data
}

const getReportCounts = async (postId) => {
  const res = await privateApi.get(`/group-posts/reports/${postId}/count`)
  return res.data
}

const blockPost = async (reportId) => {
  const res = await privateApi.post(
    `/group-posts/reports/${reportId}/handle?status=BLOCKED`,
  )
  return res.data
}

const unBlockPost = async (reportId) => {
  const res = await privateApi.post(`/group-posts/${reportId}/unblock`)
  return res.data
}

const analyzeReport = async (reportId) => {
  const res = await privateApi.get(`/group-posts/reports/${reportId}/analyze`)
  return res.data
}

const rejectReportPost = async (reportId) => {
  const res = await privateApi.post(
    `/group-posts/reports/${reportId}/handle?status=REJECTED`,
  )
  return res.data
}

const checkAutoModerationStatus = async (groupId) => {
  const res = await privateApi.get(`/groups/${groupId}/auto-moderation`)
  return res.data
}

const toggleAutoModeration = async (data) => {
  const res = await privateApi.patch(
    `/groups/${data.groupId}/auto-moderation?enabled=${data.status}`,
  )
  return res.data
}

export const reportPostApi = {
  query: {
    useGetUnresolvedReportsByGroup(groupId) {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.groupPendingReports(groupId),
        queryFn: getUnresolvedReportsByGroup,
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length
          return lastPage.last ? undefined : nextPage
        },
      })
    },
    useGetBlockedPostsByGroup(groupId) {
      return useInfiniteQuery({
        queryKey: QUERY_KEY.groupBlockReports(groupId),
        queryFn: getBlockReportedPostsByGroup,
        getNextPageParam: (lastPage, allPages) => {
          const nextPage = allPages.length
          return lastPage.last ? undefined : nextPage
        },
      })
    },
    useGetReportCounts(postId) {
      return useQuery({
        queryKey: QUERY_KEY.postReportCounts(postId),
        queryFn: () => getReportCounts(postId),
      })
    },
    useAnalyzeReport(reportId, selectedReport, showAnalysis) {
      return useQuery({
        queryKey: QUERY_KEY.reportAnalysis(reportId),
        queryFn: () => analyzeReport(reportId),
        enabled: !!selectedReport && showAnalysis,
      })
    },
    useCheckAutoModerationStatus(groupId) {
      return useQuery({
        queryKey: QUERY_KEY.groupAutoModerationStatus(groupId),
        queryFn: () => checkAutoModerationStatus(groupId),
      })
    },
  },
  mutation: {
    useReportPost(groupId) {
      const t = useTranslations('Toast')
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: reportPost,
        onSuccess: () => {
          toast.success(t('report_post_successful'))
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupBlockReports(groupId),
          })
        },
      })
    },
    useBlockPost(groupId) {
      const t = useTranslations('Toast')
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: blockPost,
        onSuccess: () => {
          toast.success(t('block_post_successful'))
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupBlockReports(groupId),
          })
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupPendingReports(groupId),
          })
        },
      })
    },
    useUnBlockPost(groupId) {
      const t = useTranslations('Toast')
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: unBlockPost,
        onSuccess: () => {
          toast.success(t('block_post_successful'))
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupBlockReports(groupId),
          })
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupPendingReports(groupId),
          })
        },
      })
    },
    useRejectReportPost(groupId) {
      const t = useTranslations('Toast')
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: rejectReportPost,
        onSuccess: () => {
          toast.success(t('reject_report_successful'))
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupPendingReports(groupId),
          })
        },
      })
    },
    useToggleAutoModeration(groupId) {
      const t = useTranslations('Toast')
      const queryClient = useQueryClient()
      return useMutation({
        mutationFn: toggleAutoModeration,
        onSuccess: () => {
          toast.success(t('toggle_auto_moderation_successful'))
          queryClient.invalidateQueries({
            queryKey: QUERY_KEY.groupAutoModerationStatus(groupId),
          })
        },
      })
    },
  },
}
