import { groupsApi } from '@/services/groupsApi'
import { useState, useEffect } from 'react'

export const GROUP_STATUS = {
  JOINED: 'JOINED',
  PENDING: 'PENDING',
  NOT_JOIN: 'NOT_JOIN',
}

export const useGroupStatus = (groupId, userId) => {
  const [status, setStatus] = useState(null)
  const statusMutation = groupsApi.mutation.useGetUserStatusInGroups()
  const joinGroupMutation = groupsApi.mutation.useAddPendingInvitation()
  const removePendingGroupMutation = groupsApi.mutation.useRejectInvitation()
  const leaveGroupMutation = groupsApi.mutation.useLeaveGroup()

  useEffect(() => {
    if (groupId) {
      checkStatus()
    }
  }, [groupId])

  const checkStatus = () => {
    statusMutation.mutate(
      { groupIds: [groupId] },
      {
        onSuccess: (data) => {
          setStatus(data[groupId])
        },
      },
    )
  }

  const handleJoinGroup = () => {
    joinGroupMutation.mutate(
      { groupId },
      {
        onSuccess: () => {
          checkStatus()
        },
      },
    )
  }

  const handleRemovePendingGroup = () => {
    removePendingGroupMutation.mutate(
      { groupId, userId },
      {
        onSuccess: () => {
          checkStatus()
        },
      },
    )
  }

  const handleLeaveGroup = () => {
    leaveGroupMutation.mutate(
      { groupId, userId },
      {
        onSuccess: () => {
          checkStatus()
        },
      },
    )
  }

  return {
    status,
    isLoading: statusMutation.isLoading,
    handleJoinGroup,
    handleRemovePendingGroup,
    handleLeaveGroup,
  }
}
