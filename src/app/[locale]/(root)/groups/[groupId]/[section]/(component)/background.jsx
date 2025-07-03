'use client'
import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import useUploadImages from '@/hooks/useUploadImages'
import { groupsApi } from '@/services/groupsApi'
import { Camera } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export default function Background({ group, isOwner }) {
  const [background, setBackground] = useState(group?.avatarUrl)
  const updateGroupMutation = groupsApi.mutation.useUpdateGroup(group.id)
  const { uploadImage } = useUploadImages()

  const handleBackgroundChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      const uploadedImageUrl = await uploadImage(file)
      updateGroupMutation.mutate(
        {
          groupId: group.id,
          avatarUrl: uploadedImageUrl,
        },
        {
          onSuccess: () => {
            setBackground(uploadedImageUrl)
          },
        },
      )
    }
  }

  if (updateGroupMutation.isPending) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='relative group'
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className='relative overflow-hidden rounded-lg'
      >
        <Image
          src={background || '/group_default.jpg'}
          alt='Group Cover'
          width={2000}
          height={200}
          className='object-cover h-[200px] w-full transition-transform duration-500 group-hover:scale-105'
        />
        <div className='absolute inset-0 bg-gradient-to-t from-background/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
      </motion.div>

      {isOwner && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className='absolute right-4 bottom-4'
        >
          <Button
            variant='ghost'
            className='flex items-center gap-2 rounded-full bg-background/80 backdrop-blur-sm p-3 shadow-lg hover:bg-background/90 transition-all duration-200'
          >
            <span className='text-foreground font-medium'>Đổi ảnh nhóm</span>
            <Camera className='h-4 w-4 text-primary' />
          </Button>
          <input
            type='file'
            accept='image/*'
            onChange={handleBackgroundChange}
            className='absolute inset-0 opacity-0 cursor-pointer'
          />
        </motion.div>
      )}
    </motion.div>
  )
}
