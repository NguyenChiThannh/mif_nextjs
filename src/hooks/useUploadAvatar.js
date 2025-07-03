import { useState, useEffect } from 'react'
import { userApi } from '@/services/userApi'
import useUploadImages from './useUploadImages'

export function useUploadAvatar(user) {
  const [avatar, setAvatar] = useState('')
  const { uploadImage } = useUploadImages()
  const updateProfileMutation = userApi.mutation.useUpdateUserProfile(user?.id)

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
          onSuccess: () => setAvatar(uploadedImageUrl),
        },
      )
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  return {
    avatar,
    handleAvatarChange,
  }
}
