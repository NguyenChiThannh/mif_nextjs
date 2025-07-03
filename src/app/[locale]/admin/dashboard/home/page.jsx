'use client'
import Loading from '@/components/loading'
import Title from '@/components/title'
import { adminStatisticsApi } from '@/services/adminStatisticsApi'
import React from 'react'
import StatsCard from '@/app/[locale]/admin/dashboard/home/(components)/stats-card'
import MonthlyChart from '@/app/[locale]/admin/dashboard/home/(components)/monthly-chart'
import SentimentAnalysis from '@/app/[locale]/admin/dashboard/home/(components)/sentiment-analysis'
import { motion } from 'framer-motion'

export default function DashboardHome() {
  const { data, isLoading } = adminStatisticsApi.query.useGetStatistics()
  const { data: sentimentData, isLoading: isLoadingSentiment } =
    adminStatisticsApi.query.useGetStatisticsSentimentStats()

  if (isLoading || isLoadingSentiment) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className='p-4'>
        <Title title={'Dashboard'} />
      </div>

      {/* Stats Cards */}
      <motion.div
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <StatsCard type='user' count={data.totalUser} />
        <StatsCard type='post' count={data.totalPost} />
        <StatsCard type='group' count={data.totalGroup} />
        <StatsCard type='movie' count={data.totalMovie} />
        <StatsCard type='rating' count={data.totalRatingMovie} />
        <StatsCard type='actor' count={data.totalActor} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MonthlyChart />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <SentimentAnalysis sentimentData={sentimentData} />
      </motion.div>
    </motion.div>
  )
}
