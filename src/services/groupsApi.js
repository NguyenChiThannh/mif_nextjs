import { privateApi } from "@/services/config"
import { QUERY_KEY } from "@/services/key"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { toast } from "react-toastify"

const createGroup = async (data) => {
    const res = await privateApi.post('/groups', data)
    return res.data
}

const updateGroup = async (data) => {
    const res = await privateApi.patch(`/groups/${data.groupId}`, data)
    return res.data
}

const deleteGroup = async (data) => {
    const res = await privateApi.delete(`/groups/${data.groupId}`)
    return res.data
}

const addMemberToGroup = async (data) => {
    const res = await privateApi.post(`/groups/${data.groupId}/members/${data.userId}`)
    return res.data
}

const removeMemberFromGroup = async (data) => {
    const res = await privateApi.delete(`/groups/${data.groupId}/members/${data.userId}`)
    return res.data
}

const findByOwnerId = async ({ queryKey }) => {
    const [_key, { page, size }] = queryKey;
    const res = await privateApi.get('/my-groups', {
        params: {
            page,
            size,
            sort: 'asc',
        },
    })
    return res.data
}

const getUserGroups = async ({ queryKey }) => {
    const [_key, { page, size, id }] = queryKey;
    const res = await privateApi.get(`/user/${id}/groups`, {
        params: {
            page,
            size,
            sort: 'asc',
        },
    })
    return res.data
}

const findGroupUserNotJoin = async ({ queryKey }) => {
    const [_key, { size }] = queryKey;
    const res = await privateApi.get('/explore-groups', {
        params: {
            size
        },
    })
    return res.data
}

const addPendingInvitation = async (data) => {
    const res = await privateApi.post(`/groups/${data.groupId}/pending-invitations`)
    return res.data
}

const acceptInvitation = async (data) => {
    const res = await privateApi.post(`/groups/${data.groupId}/accept-invitations/${data.userId}`)
    return res.data
}

const getGroupByGroupId = async (groupId) => {
    const res = await privateApi.get(`/groups/${groupId}`)
    return res.data
}

const getAllMembers = async (groupId) => {
    const res = await privateApi.get(`/groups/${groupId}/members`, {
        params: {
            size: 100
        }
    })
    return res.data
}

const getPendingInvitations = async ({ queryKey }) => {
    const [_key, groupId] = queryKey
    const res = await privateApi.get(`/groups/${groupId}/pending-invitations`, {
        params: {
            size: 100
        }
    })
    return res.data
}

const removePendingInvitation = async (data) => {
    const res = await privateApi.delete(`/groups/${data.groupId}/pending-invitations/${data.userId}`)
    return res.data
}

const searchGroupByGroupName = async ({ queryKey }) => {
    const [_key, name] = queryKey
    const res = await privateApi.get('/groups/search', {
        params: {
            name,
            page: 0,
            size: 10,
        }
    })
    return res.data
}

const getUserStatusInGroups = async (data) => {
    const res = await privateApi.post('/groups/batch-status', data)
    return res.data
}

export const groupsApi = {
    query: {
        useFindByOwnerId(page, size) {
            return useQuery({
                queryKey: QUERY_KEY.groupsByOwnerId(page, size),
                queryFn: findByOwnerId,
            })
        },
        useGetUserGroups(page, size, id) {
            return useQuery({
                queryKey: QUERY_KEY.userGroups(page, size, id),
                queryFn: getUserGroups,
            })
        },
        useFindGroupUserNotJoin(size) {
            return useQuery({
                queryKey: QUERY_KEY.groupsUserNotJoin(size),
                queryFn: findGroupUserNotJoin,
            })
        },
        useGetGroupByGroupId(groupId) {
            return useQuery({
                queryKey: QUERY_KEY.detailGroup(groupId),
                queryFn: ({ queryKey }) => getGroupByGroupId(queryKey[1]),
            })
        },
        useGetAllMember(groupId) {
            return useQuery({
                queryKey: QUERY_KEY.memberGroup(groupId),
                queryFn: ({ queryKey }) => getAllMembers(queryKey[1]),

            })
        },
        useGetPendingInvitations(groupId) {
            return useQuery({
                queryKey: QUERY_KEY.pendingInvitations(groupId),
                queryFn: getPendingInvitations,
            })
        },
        useSearchGroupByGroupName(name) {
            return useQuery({
                queryKey: QUERY_KEY.searchGroupByGroupName(name),
                queryFn: searchGroupByGroupName,
            })
        }
    },
    mutation: {
        useCreateGroup() {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: createGroup,
                onSuccess: () => {
                    toast.success(t('create_group_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupsByOwnerId(0, 24) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.userGroups(0, 24) })
                },
            })
        },
        useUpdateGroup(groupId) {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: updateGroup,
                onSuccess: () => {
                    toast.success(t('update_group_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.detailGroup(groupId) })
                },
            })
        },
        useAddPendingInvitation() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: addPendingInvitation,
                onSuccess: () => {
                    toast.success(t('add_pending_invitation_successful'))
                },
            })
        },
        useAcceptInvitation(groupId) {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: acceptInvitation,
                onSuccess: () => {
                    toast.success(t('accept_invitation_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.pendingInvitations(groupId) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.memberGroup(groupId) })
                },
            })
        },
        useRejectInvitation(groupId) {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: removePendingInvitation,
                onSuccess: () => {
                    toast.success(t('reject_invitation_successful'))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.pendingInvitations(groupId) })
                },
            })
        },
        useRemoveMemberFromGroup(groupId) {
            const t = useTranslations('Toast');
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: removeMemberFromGroup,
                onSuccess: () => {
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.memberGroup(groupId) })
                    toast.success(t('remove_member_group_successful'))
                },
            })
        },
        useAddMemberToGroup() {
            const t = useTranslations('Toast');
            return useMutation({
                mutationFn: addMemberToGroup,
                onSuccess: () => {
                    toast.success(t('add_member_group_successful'))
                },
            })
        },
        useGetUserStatusInGroups() {
            return useMutation({
                mutationFn: getUserStatusInGroups,
            })
        },
        useDeleteGroup() {
            const t = useTranslations('Toast')
            const queryClient = useQueryClient()
            return useMutation({
                mutationFn: deleteGroup,
                onSuccess: () => {
                    toast.success(t("delete_group_successful"))
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.groupsByOwnerId(0, 24) })
                    queryClient.invalidateQueries({ queryKey: QUERY_KEY.userGroups(0, 24) })
                }
            })
        }

    },
}
