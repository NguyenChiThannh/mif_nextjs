import { useState, useEffect } from 'react'
import { userApi } from '@/services/userApi'
import useUploadImages from './useUploadImages'
import useUserId from './useUserId'

export function useProfile(profileId) {
  const [avatar, setAvatar] = useState('')
  const currentUserId = useUserId()
  const { uploadImage } = useUploadImages()
  const { data: user, isLoading } = userApi.query.useGetUserInfoById(profileId)
  const updateProfileMutation = userApi.mutation.useUpdateUserProfile(profileId)

  const isOwnProfile = currentUserId === profileId

  useEffect(() => {
    if (user?.profilePictureUrl) {
      setAvatar(user.profilePictureUrl)
    }
  }, [user])

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const uploadedImageUrl = await uploadImage(file)
      updateProfileMutation.mutate(
        {
          profilePictureUrl: uploadedImageUrl,
        },
        {
          onSuccess: () => {
            setAvatar(uploadedImageUrl)
          },
        },
      )
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  const handleUpdateProfile = async (data) => {
    try {
      await updateProfileMutation.mutateAsync(data)
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  return {
    user,
    isLoading,
    avatar,
    isOwnProfile,
    handleAvatarChange,
    handleUpdateProfile,
    updateProfile: updateProfileMutation.mutate,
  }
}
