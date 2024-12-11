import { userApi } from '@/services/userApi'
import React from 'react'

export default function LiveStreamPage() {
    const { data, isLoading } = userApi.query.useGetUserInfoById(id)
    console.log('🚀 ~ LiveStreamPage ~ data:', data)
    console.log('🚀 ~ LiveStreamPage ~ isLoading:', isLoading)
    return (
        <div>LiveStreamPage</div>
    )
}