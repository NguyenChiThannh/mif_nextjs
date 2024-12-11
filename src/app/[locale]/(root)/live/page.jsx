'use client'
import useUserId from '@/hooks/useUserId'
import { userApi } from '@/services/userApi'
import React from 'react'

export default function LiveStreamPage() {
    const userId = useUserId()
    const { data, isLoading } = userApi.query.useGetUserInfoById(userId)
    console.log('🚀 ~ LiveStreamPage ~ data:', data)
    console.log('🚀 ~ LiveStreamPage ~ isLoading:', isLoading)
    return (
        <div>LiveStreamPage</div>
    )
}