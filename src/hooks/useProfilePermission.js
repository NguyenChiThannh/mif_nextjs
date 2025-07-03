import useUserId from './useUserId'

export function useProfilePermission(profileId) {
  const currentUserId = useUserId()

  return {
    isOwnProfile: currentUserId === profileId,
    canEdit: currentUserId === profileId,
    canView: true, // Có thể thêm logic kiểm tra quyền xem profile
  }
}
