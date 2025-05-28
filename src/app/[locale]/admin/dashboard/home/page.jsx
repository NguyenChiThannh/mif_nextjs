'use client'
import Loading from '@/components/loading'
import Title from '@/components/title'
import { adminStatisticsApi } from '@/services/adminStatisticsApi'
import React, { useState } from 'react'
import StatsCard from '@/app/[locale]/admin/dashboard/home/(components)/stats-card'
import MonthlyChart from '@/app/[locale]/admin/dashboard/home/(components)/monthly-chart'
import SentimentAnalysis from '@/app/[locale]/admin/dashboard/home/(components)/sentiment-analysis'

export default function DashboardHome() {
    const { data, isLoading } = adminStatisticsApi.query.useGetStatistics()
    const { data: sentimentData, isLoading: isLoadingSentiment } = adminStatisticsApi.query.useGetStatisticsSentimentStats()


    if (isLoading || isLoadingSentiment) return <Loading />

    return (
        <div>
            <div className='p-4'>
                <Title title={'Dashboard'} />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <StatsCard type="user" count={data.totalUser} />
                <StatsCard type="post" count={data.totalPost} />
                <StatsCard type="group" count={data.totalGroup} />
                <StatsCard type="movie" count={data.totalMovie} />
                <StatsCard type="rating" count={data.totalRatingMovie} />
                <StatsCard type="actor" count={data.totalActor} />
            </div>

            <MonthlyChart />

            <SentimentAnalysis sentimentData={sentimentData}/>
        </div>
    )
}