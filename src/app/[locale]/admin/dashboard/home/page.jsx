'use client'
import Loading from '@/components/loading'
import Title from '@/components/title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminStatisticsApi } from '@/services/adminStatisticsApi'
import { Clock, FileText, Film, Heart, Star, Tag, TrendingUp, UserPlus, Users, Zap, Download } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import { useTheme } from 'next-themes'

export default function DashboardHome() {
    const { data, isLoading } = adminStatisticsApi.query.useGetStatistics()
    const [selectedDataType, setSelectedDataType] = useState('users')
    const [chartType, setChartType] = useState('line')
    const { theme, resolvedTheme } = useTheme()

    // Màu sắc cho biểu đồ dựa trên theme
    const chartColors = {
        primary: '#8884d8',
        border: '#e5e7eb',
        background: '#ffffff',
        text: '#374151',
        tooltip: {
            background: '#ffffff',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
    }

    // Cập nhật màu sắc dựa trên theme
    useEffect(() => {
        if (resolvedTheme === 'dark') {
            chartColors.border = '#2d3748'
            chartColors.background = '#1f2937'
            chartColors.text = '#e5e7eb'
            chartColors.tooltip.background = '#374151'
            chartColors.tooltip.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)'
        } else {
            chartColors.border = '#e5e7eb'
            chartColors.background = '#ffffff'
            chartColors.text = '#374151'
            chartColors.tooltip.background = '#ffffff'
            chartColors.tooltip.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'
        }
    }, [resolvedTheme])

    // Giả lập dữ liệu theo tháng cho các loại thống kê
    const monthlyData = {
        users: [
            { month: 'Tháng 1', count: 120 },
            { month: 'Tháng 2', count: 150 },
            { month: 'Tháng 3', count: 200 },
            { month: 'Tháng 4', count: 180 },
            { month: 'Tháng 5', count: 220 },
            { month: 'Tháng 6', count: 250 },
            { month: 'Tháng 7', count: 280 },
            { month: 'Tháng 8', count: 310 },
            { month: 'Tháng 9', count: 340 },
            { month: 'Tháng 10', count: 360 },
            { month: 'Tháng 11', count: 390 },
            { month: 'Tháng 12', count: data?.totalUser || 400 },
        ],
        posts: [
            { month: 'Tháng 1', count: 50 },
            { month: 'Tháng 2', count: 65 },
            { month: 'Tháng 3', count: 80 },
            { month: 'Tháng 4', count: 95 },
            { month: 'Tháng 5', count: 110 },
            { month: 'Tháng 6', count: 125 },
            { month: 'Tháng 7', count: 140 },
            { month: 'Tháng 8', count: 155 },
            { month: 'Tháng 9', count: 170 },
            { month: 'Tháng 10', count: 185 },
            { month: 'Tháng 11', count: 200 },
            { month: 'Tháng 12', count: data?.totalPost || 215 },
        ],
        groups: [
            { month: 'Tháng 1', count: 10 },
            { month: 'Tháng 2', count: 15 },
            { month: 'Tháng 3', count: 20 },
            { month: 'Tháng 4', count: 25 },
            { month: 'Tháng 5', count: 30 },
            { month: 'Tháng 6', count: 35 },
            { month: 'Tháng 7', count: 40 },
            { month: 'Tháng 8', count: 45 },
            { month: 'Tháng 9', count: 50 },
            { month: 'Tháng 10', count: 55 },
            { month: 'Tháng 11', count: 60 },
            { month: 'Tháng 12', count: data?.totalGroup || 65 },
        ],
        movies: [
            { month: 'Tháng 1', count: 30 },
            { month: 'Tháng 2', count: 40 },
            { month: 'Tháng 3', count: 50 },
            { month: 'Tháng 4', count: 60 },
            { month: 'Tháng 5', count: 70 },
            { month: 'Tháng 6', count: 80 },
            { month: 'Tháng 7', count: 90 },
            { month: 'Tháng 8', count: 100 },
            { month: 'Tháng 9', count: 110 },
            { month: 'Tháng 10', count: 120 },
            { month: 'Tháng 11', count: 130 },
            { month: 'Tháng 12', count: data?.totalMovie || 140 },
        ],
        ratings: [
            { month: 'Tháng 1', count: 200 },
            { month: 'Tháng 2', count: 250 },
            { month: 'Tháng 3', count: 300 },
            { month: 'Tháng 4', count: 350 },
            { month: 'Tháng 5', count: 400 },
            { month: 'Tháng 6', count: 450 },
            { month: 'Tháng 7', count: 500 },
            { month: 'Tháng 8', count: 550 },
            { month: 'Tháng 9', count: 600 },
            { month: 'Tháng 10', count: 650 },
            { month: 'Tháng 11', count: 700 },
            { month: 'Tháng 12', count: data?.totalRatingMovie || 750 },
        ],
        actors: [
            { month: 'Tháng 1', count: 20 },
            { month: 'Tháng 2', count: 25 },
            { month: 'Tháng 3', count: 30 },
            { month: 'Tháng 4', count: 35 },
            { month: 'Tháng 5', count: 40 },
            { month: 'Tháng 6', count: 45 },
            { month: 'Tháng 7', count: 50 },
            { month: 'Tháng 8', count: 55 },
            { month: 'Tháng 9', count: 60 },
            { month: 'Tháng 10', count: 65 },
            { month: 'Tháng 11', count: 70 },
            { month: 'Tháng 12', count: data?.totalActor || 75 },
        ],
    }

    const dataTypeOptions = [
        { value: 'users', label: 'Người dùng' },
        { value: 'posts', label: 'Bài viết' },
        { value: 'groups', label: 'Nhóm' },
        { value: 'movies', label: 'Phim' },
        { value: 'ratings', label: 'Đánh giá' },
        { value: 'actors', label: 'Diễn viên' },
    ]

    const handleExportCSV = () => {
        const currentData = monthlyData[selectedDataType]
        let csvContent = "data:text/csv;charset=utf-8,Tháng,Số lượng\n"

        currentData.forEach(item => {
            csvContent += `${item.month},${item.count}\n`
        })

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `thong_ke_${selectedDataType}_theo_thang.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportExcel = () => {
        const currentData = monthlyData[selectedDataType]
        const worksheet = XLSX.utils.json_to_sheet(currentData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Thống kê theo tháng")
        XLSX.writeFile(workbook, `thong_ke_${selectedDataType}_theo_thang.xlsx`)
    }

    if (isLoading) return <Loading />

    return (
        <div>
            <div className='p-4 '>
                <Title title={'Dashboard'} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <UserStats data={data} />
                <PostStats data={data} />
                <GroupStats data={data} />
                <MovieStats data={data} />
                <RatingStats data={data} />
                <ActorStats data={data} />
            </div>

            {/* Phần biểu đồ phân tích */}
            <div className="p-4">
                <Card className="w-full">
                    <CardHeader className="pb-6">
                        <div className="flex flex-col space-y-1.5">
                            <CardTitle className="text-xl font-semibold">Phân tích dữ liệu theo tháng</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Theo dõi sự phát triển của {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label.toLowerCase() || selectedDataType} theo thời gian
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Loại dữ liệu</label>
                                <Select value={selectedDataType} onValueChange={setSelectedDataType}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn loại dữ liệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {dataTypeOptions.map(option => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Kiểu biểu đồ</label>
                                <Tabs defaultValue="line" className="w-full" onValueChange={setChartType}>
                                    <TabsList className="w-full grid grid-cols-2">
                                        <TabsTrigger value="line">
                                            <div className="flex items-center">
                                                <TrendingUp className="h-4 w-4 mr-2" />
                                                Đường
                                            </div>
                                        </TabsTrigger>
                                        <TabsTrigger value="bar">
                                            <div className="flex items-center">
                                                <Tag className="h-4 w-4 mr-2" />
                                                Cột
                                            </div>
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Xuất dữ liệu</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Button variant="outline" onClick={handleExportCSV}>
                                        <Download className="h-4 w-4 mr-2" />
                                        CSV
                                    </Button>
                                    <Button variant="outline" onClick={handleExportExcel}>
                                        <Download className="h-4 w-4 mr-2" />
                                        Excel
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Tổng: {monthlyData[selectedDataType].reduce((sum, item) => sum + item.count, 0)}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-primary"></div>
                                    <span className="text-sm text-muted-foreground">
                                        {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                {chartType === 'line' ? (
                                    <LineChart
                                        data={monthlyData[selectedDataType]}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={chartColors.primary} stopOpacity={0.8} />
                                                <stop offset="95%" stopColor={chartColors.primary} stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: chartColors.text }}
                                            tickLine={false}
                                            axisLine={{ stroke: chartColors.border }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: chartColors.text }}
                                            tickLine={false}
                                            axisLine={{ stroke: chartColors.border }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: chartColors.tooltip.background,
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: chartColors.tooltip.boxShadow,
                                                color: chartColors.text
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: 10 }}
                                            formatter={(value) => <span style={{ color: chartColors.text }}>{value}</span>}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            name={dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType}
                                            stroke={chartColors.primary}
                                            strokeWidth={2}
                                            activeDot={{ r: 8, fill: chartColors.primary, stroke: chartColors.background, strokeWidth: 2 }}
                                            dot={{ r: 4, fill: chartColors.background, stroke: chartColors.primary, strokeWidth: 2 }}
                                            fill="url(#colorCount)"
                                        />
                                    </LineChart>
                                ) : (
                                    <BarChart
                                        data={monthlyData[selectedDataType]}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                    >
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={chartColors.primary} stopOpacity={0.8} />
                                                <stop offset="100%" stopColor={chartColors.primary} stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.border} vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: chartColors.text }}
                                            tickLine={false}
                                            axisLine={{ stroke: chartColors.border }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: chartColors.text }}
                                            tickLine={false}
                                            axisLine={{ stroke: chartColors.border }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: `${chartColors.primary}20` }}
                                            contentStyle={{
                                                backgroundColor: chartColors.tooltip.background,
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: chartColors.tooltip.boxShadow,
                                                color: chartColors.text
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: 10 }}
                                            formatter={(value) => <span style={{ color: chartColors.text }}>{value}</span>}
                                        />
                                        <Bar
                                            dataKey="count"
                                            name={dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType}
                                            fill="url(#barGradient)"
                                            radius={[4, 4, 0, 0]}
                                            barSize={30}
                                        />
                                    </BarChart>
                                )}
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function ActorStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Diễn viên
                </CardTitle>
                <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalActor}</div>
                <p className="text-xs text-muted-foreground">
                    Tổng số phim trong cơ sở dữ liệu
                </p>
            </CardContent>
        </Card>
    )
}

function GroupStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Nhóm và cộng đồng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalGroup}</div>
                <p className="text-xs text-muted-foreground">
                    Số lượng nhóm được tạo
                </p>
            </CardContent>
        </Card>
    )
}

function MovieStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Phim
                </CardTitle>
                <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalMovie}</div>
                <p className="text-xs text-muted-foreground">
                    Tổng số phim trong cơ sở dữ liệu
                </p>
            </CardContent>
        </Card>
    )
}

function PostStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Bài viết
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalPost}</div>
                <p className="text-xs text-muted-foreground">
                    Số lượng bài viết được tạo
                </p>
            </CardContent>
        </Card>
    )
}

function RatingStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Đánh giá và Xếp hạng
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalRatingMovie}</div>
                <p className="text-xs text-muted-foreground">
                    Số lượng đánh giá được thực hiện
                </p>
            </CardContent>
        </Card>
    )
}

function UserStats({ data }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    Người dùng
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{data.totalUser}</div>
                <p className="text-xs text-muted-foreground">
                    Số lượng người dùng đã đăng ký
                </p>
            </CardContent>
        </Card>
    )
}