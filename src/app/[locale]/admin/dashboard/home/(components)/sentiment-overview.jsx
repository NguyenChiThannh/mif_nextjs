'use client'
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Clock, FileText, Heart } from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { motion } from 'framer-motion'

export default function SentimentOverview({ sentimentData }) {
  const sentimentPie = [
    {
      name: 'Positive',
      value: Number(sentimentData.positivePercentage.toFixed(2)),
      color: '#10b981',
    },
    {
      name: 'Negative',
      value: Number(sentimentData.negativePercentage.toFixed(2)),
      color: '#ef4444',
    },
    {
      name: 'Neutral',
      value: Number(sentimentData.neutralPercentage.toFixed(2)),
      color: '#6b7280',
    },
  ]

  return (
    <motion.div
      className='grid grid-cols-1 md:grid-cols-3 gap-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Enhanced Pie Chart */}
      <motion.div
        className='md:col-span-1 bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300'
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className='text-lg font-semibold mb-4 text-foreground'>
          Phân bố cảm xúc
        </h3>
        <div className='h-[300px]'>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              <defs>
                <filter
                  id='shadow'
                  x='-20%'
                  y='-20%'
                  width='140%'
                  height='140%'
                >
                  <feDropShadow
                    dx='0'
                    dy='0'
                    stdDeviation='3'
                    floodOpacity='0.3'
                  />
                </filter>
              </defs>
              <Pie
                data={sentimentPie}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey='value'
                filter='url(#shadow)'
              >
                {sentimentPie.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke='#ffffff'
                    strokeWidth={2}
                    className='hover:opacity-80 transition-opacity cursor-pointer'
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value}%`, name]}
                contentStyle={{
                  backgroundColor: 'hsl(0, 0%, 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  color: 'hsl(240, 10%, 3.9%)',
                  padding: '8px 12px',
                  fontWeight: 'bold',
                }}
                itemStyle={{
                  padding: '4px 0',
                }}
                wrapperStyle={{
                  zIndex: 100,
                }}
              />
              <Legend
                verticalAlign='bottom'
                align='center'
                layout='horizontal'
                iconSize={10}
                iconType='circle'
                formatter={(value) => (
                  <span
                    style={{
                      color: 'hsl(240, 10%, 3.9%)',
                      fontWeight: 'medium',
                      padding: '0 8px',
                    }}
                  >
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Stats and Info */}
      <motion.div
        className='md:col-span-2'
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className='text-lg font-semibold mb-4 text-foreground'>
          Thống kê cảm xúc
        </h3>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className='bg-green-50 border-green-200 hover:shadow-md transition-all duration-300'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-green-600 font-medium'>
                      Tích cực
                    </p>
                    <h4 className='text-2xl font-bold text-green-700'>
                      {Number(sentimentData.positivePercentage.toFixed(2))} %
                    </h4>
                  </div>
                  <div className='h-10 w-10 rounded-full bg-green-100 flex items-center justify-center'>
                    <Heart className='h-5 w-5 text-green-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <Card className='bg-red-50 border-red-200 hover:shadow-md transition-all duration-300'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-red-600 font-medium'>Tiêu cực</p>
                    <h4 className='text-2xl font-bold text-red-700'>
                      {Number(sentimentData.negativePercentage.toFixed(2))} %
                    </h4>
                  </div>
                  <div className='h-10 w-10 rounded-full bg-red-100 flex items-center justify-center'>
                    <FileText className='h-5 w-5 text-red-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card className='bg-gray-50 border-gray-200 hover:shadow-md transition-all duration-300'>
              <CardContent className='p-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <p className='text-sm text-gray-600 font-medium'>
                      Trung tính
                    </p>
                    <h4 className='text-2xl font-bold text-gray-700'>
                      {Number(sentimentData.neutralPercentage.toFixed(2))} %
                    </h4>
                  </div>
                  <div className='h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center'>
                    <Clock className='h-5 w-5 text-gray-600' />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className='bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-300'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <h4 className='font-medium mb-2 text-foreground'>
            Thông tin chi tiết
          </h4>
          <ul className='space-y-2'>
            <li className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>
                Tổng số bình luận phân tích:
              </span>
              <span className='font-medium text-foreground'>
                {sentimentData.totalComments}
              </span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>
                Phim có cảm xúc tích cực nhất:
              </span>
              <span className='font-medium text-foreground'>
                {sentimentData.mostPositiveMovie} (
                {Number(sentimentData.mostPositivePercentage.toFixed(2))} %)
              </span>
            </li>
            <li className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>
                Phim có cảm xúc tiêu cực nhất:
              </span>
              <span className='font-medium text-foreground'>
                {sentimentData.mostNegativeMovie} (
                {Number(sentimentData.mostNegativePercentage.toFixed(2))} %)
              </span>
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
