'use client'
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button'
import useUploadImage from '@/hooks/useUploadImage';
import { groupsApi } from '@/services/groupsApi';
import { Camera } from 'lucide-react'
import Image from 'next/image'
import React, { useState } from 'react'

export default function Background({ group, isOwner }) {
    const [background, setBackground] = useState(group?.avatarUrl)
    const updateGroupMutation = groupsApi.mutation.useUpdateGroup(group.id)
    const { uploadImage } = useUploadImage();
    const handleBackgroundChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const uploadedImageUrl = await uploadImage(file);
            updateGroupMutation.mutate({
                groupId: group.id,
                avatarUrl: uploadedImageUrl
            }, {
                onSuccess: () => {
                    setBackground(uploadedImageUrl);
                },
            })
        }
    };
    if (updateGroupMutation.isPending) return <Loading />
    return (
        <div className="relative">
            <Image
                src={background || "/group_default.jpg"}
                alt="Group Cover"
                width={2000}
                height={200}
                className="object-cover rounded-lg h-[200px]"
            />
            {isOwner && (
                <div className="absolute right-2 bottom-2 hover: cursor-pointer">
                    <Button
                        variant="ghost"
                        className="flex items-center gap-2 rounded-full bg-muted p-3 shadow-md "
                    >
                        <span className="text-primary font-bold">
                            Đổi ảnh nhóm
                        </span>
                        <Camera className="text-primary" />
                    </Button>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                </div>
            )}
        </div>
    )
}