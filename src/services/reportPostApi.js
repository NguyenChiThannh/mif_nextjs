import { privateApi } from "@/services/config"
import { QUERY_KEY } from '@/services/key';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

const reportPost = async (data) => {
    const { postId, ...rest } = data
    const res = await privateApi.post(`/group-posts/${postId}/report`, rest)
    return res.data
}

const getUnresolvedReportsByGroup = async ({ pageParam = 0, queryKey }) => {
    const [_key, groupId] = queryKey;
    const res = await privateApi.get(`/group-posts/${groupId}/reports`, {
        params: {
            page: pageParam,
            status: 'PENDING'
        }
    });
    return res.data;
}

const getBlockReportedPostsByGroup = async ({ pageParam = 0, queryKey }) => {
    const [_key, groupId] = queryKey;
    const res = await privateApi.get(`/group-posts/${groupId}/reports`, {
        params: {
            page: pageParam,
            status: 'BLOCKED'
        }
    });
    return res.data;
}

const getReportCounts = async (postId) => {
    const res = await privateApi.get(`/group-posts/reports/${postId}/count`)
    return res.data
}

const blockPost = async (reportId) => {
    const res = await privateApi.post(`/group-posts/reports/${reportId}/handle?status=BLOCKED`)
    return res.data
}

const unBlockPost = async (reportId) => {
    const res = await privateApi.post(`/group-posts/reports/${reportId}/handle?status=PENDING`)
    return res.data
}

const analyzeReport = async (reportId) => {
    const res = await privateApi.get(`/group-posts/reports/${reportId}/analyze`)
    return res.data
}

export const reportPostApi = {
    query: {
        useGetUnresolvedReportsByGroup(groupId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.groupPendingReports(groupId),
                queryFn: getUnresolvedReportsByGroup,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
        useGetBlockedPostsByGroup(groupId) {
            return useInfiniteQuery({
                queryKey: QUERY_KEY.groupBlockReports(groupId),
                queryFn: getBlockReportedPostsByGroup,
                getNextPageParam: (lastPage, allPages) => {
                    const nextPage = allPages.length;
                    return lastPage.last ? undefined : nextPage;
                },
            });
        },
        useGetReportCounts(postId) {
            return useQuery({
                queryKey: QUERY_KEY.postReportCounts(postId),
                queryFn: () => getReportCounts(postId),
            });
        },
        useAnalyzeReport(reportId, selectedReport, showAnalysis) {
            return useQuery({
                queryKey: QUERY_KEY.reportAnalysis(reportId),
                queryFn: () => analyzeReport(reportId),
                enabled: !!selectedReport && showAnalysis,
            });
        }
    },
    mutation: {
        useReportPost(groupId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: reportPost,
                onSuccess: () => {
                    toast.success(t('report_post_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupBlockReports(groupId) })
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
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupBlockReports(groupId) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPendingReports(groupId) })
                },
                onError: () => {
                    toast.error(t('block_post_failed'))
                }
            })
        },
        useUnBlockPost(groupId) {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: blockPost,
                onSuccess: () => {
                    toast.success(t('block_post_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupBlockReports(groupId) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupPendingReports(groupId) })
                },
                onError: () => {
                    toast.error(t('block_post_failed'))
                }
            })
        }
    }
}