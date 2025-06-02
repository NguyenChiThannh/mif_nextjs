'use client'
import React, { useState } from 'react'
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
import { TrendingUp, Tag, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminStatisticsApi } from '@/services/adminStatisticsApi'
import { dataTypeOptions } from '@/lib/constant'

export default function MonthlyChart() {
    const [chartType, setChartType] = useState('line')
    const [selectedDataType, setSelectedDataType] = useState('users')
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString())
    const [showAllMonths, setShowAllMonths] = useState(false)
    const { data: userStatsData, isLoading: isLoadingUserStatsData } = adminStatisticsApi.query.useGetUserStatisticsByYear(selectedYear)
    const { data: postStatsData, isLoading: isLoadingPostStatsData } = adminStatisticsApi.query.useGetPostStatisticsByYear(selectedYear)
    const { data: ratingStatsData, isLoading: isLoadingRatingStatsData } = adminStatisticsApi.query.useGetRatingStatisticsByYear(selectedYear)

    // Get current date
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1 // JavaScript months are 0-based

    // Danh sách các năm để chọn
    const yearOptions = [
        { value: '2024', label: '2024' },
        { value: '2025', label: '2025' },
        { value: '2026', label: '2026' },
        { value: '2027', label: '2027' },
        { value: '2028', label: '2028' },
    ]

    // Lọc dữ liệu theo năm đã chọn
    const getFilteredData = () => {
        let data;
        switch (selectedDataType) {
            case 'users':
                data = userStatsData;
                break;
            case 'posts':
                data = postStatsData;
                break;
            case 'ratings':
                data = ratingStatsData;
                break;
            default:
                return []
        }

        if (!data) return []

        // Transform API response into chart data format and filter out future months if needed
        return Object.entries(data)
            .filter(([month]) => {
                const monthNum = parseInt(month);
                const yearNum = parseInt(selectedYear);
                return showAllMonths || yearNum < currentYear || (yearNum === currentYear && monthNum <= currentMonth);
            })
            .map(([month, count]) => ({
                month: `Tháng ${month}`,
                count: count
            }));
    }

    const handleExportCSV = () => {
        const currentData = getFilteredData()
        let csvContent = `data:text/csv;charset=utf-8,Tháng,Số lượng (${selectedYear})\n`

        currentData.forEach(item => {
            csvContent += `${item.month},${item.count}\n`
        })

        const encodedUri = encodeURI(csvContent)
        const link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", `thong_ke_${selectedDataType}_${selectedYear}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const handleExportExcel = () => {
        const currentData = getFilteredData()
        const worksheet = XLSX.utils.json_to_sheet(currentData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, `Thống kê ${selectedYear}`)
        XLSX.writeFile(workbook, `thong_ke_${selectedDataType}_${selectedYear}.xlsx`)
    }

    return (
        <div className="p-4">
            <Card>
                <CardHeader className="pb-6 border-b">
                    {/* Title */}
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle className="text-xl font-semibold">Phân tích dữ liệu theo tháng</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Theo dõi sự phát triển của
                            {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label.toLowerCase() || selectedDataType} theo thời gian
                        </p>
                    </div>

                    <div className="grid grid-cols-1  md:[grid-template-columns:repeat(20,_minmax(0,_1fr))] gap-4 mt-4">
                        {/* Data filter */}
                        <div className="space-y-2 col-span-3">
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

                        {/* Select Year */}
                        <div className="space-y-2 col-span-2">
                            <label className="text-sm font-medium">Năm</label>
                            <Select value={selectedYear} onValueChange={setSelectedYear}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn năm" />
                                </SelectTrigger>
                                <SelectContent>
                                    {yearOptions.map(option =>
                                    {
                                        if (parseInt(option.value) > currentYear) return null;
                                        return (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        )
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Chart Type */}
                        <div className="space-y-2 col-span-4">
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

                        {/* Month View Toggle */}
                        <div className="space-y-2 col-span-7">
                            <label className="text-sm font-medium">Hiển thị tháng</label>
                            <Tabs
                                defaultValue="current"
                                className="w-full"
                                onValueChange={(value) => setShowAllMonths(value === 'all')}
                            >
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="current">
                                        <div className="flex items-center">
                                            <TrendingUp className="h-4 w-4 mr-2" />
                                            Tới tháng hiện tại
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="all">
                                        <div className="flex items-center">
                                            <Tag className="h-4 w-4 mr-2" />
                                            Tất cả tháng
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Export File */}
                        <div className="space-y-2 col-span-4">
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

                <CardContent className="pt-6">
                    {/* Info Section */}
                    <div className="mb-6 p-4 bg-accent rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">
                                    {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType} - {selectedYear}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Tổng: {getFilteredData().reduce((sum, item) => sum + item.count, 0)}
                                </p>
                            </div>
                            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-card">
                                <div className="w-3 h-3 rounded-full bg-primary"></div>
                                <span className="text-sm text-muted-foreground">
                                    {dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px] w-full p-2 rounded-lg bg-accent/20">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartType === 'line'
                                ? (
                                    <LineChart
                                        data={getFilteredData()}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="hsl(346.8, 77.2%, 49.8%)" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="hsl(346.8, 77.2%, 49.8%)" stopOpacity={0.1} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5.9%, 90%)" />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: "hsl(240, 10%, 3.9%)" }}
                                            tickLine={false}
                                            axisLine={{ stroke: "hsl(240, 5.9%, 90%)" }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: "hsl(240, 10%, 3.9%)" }}
                                            tickLine={false}
                                            axisLine={{ stroke: "hsl(240, 5.9%, 90%)" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "hsl(0, 0%, 100%)",
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                color: "hsl(240, 10%, 3.9%)"
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: 10 }}
                                            formatter={(value) => <span style={{ color: "hsl(240, 10%, 3.9%)" }}>{value}</span>}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            name={`${dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType} (${selectedYear})`}
                                            stroke="hsl(346.8, 77.2%, 49.8%)"
                                            strokeWidth={2}
                                            activeDot={{ r: 8, fill: "hsl(346.8, 77.2%, 49.8%)", stroke: "hsl(0, 0%, 100%)", strokeWidth: 2 }}
                                            dot={{ r: 4, fill: "hsl(0, 0%, 100%)", stroke: "hsl(346.8, 77.2%, 49.8%)", strokeWidth: 2 }}
                                            fill="url(#colorCount)"
                                        />
                                    </LineChart>
                                ) : (
                                    <BarChart
                                        data={getFilteredData()}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                                    >
                                        <defs>
                                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(346.8, 77.2%, 49.8%)" stopOpacity={0.8} />
                                                <stop offset="100%" stopColor="hsl(346.8, 77.2%, 49.8%)" stopOpacity={0.4} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(240, 5.9%, 90%)" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: "hsl(240, 10%, 3.9%)" }}
                                            tickLine={false}
                                            axisLine={{ stroke: "hsl(240, 5.9%, 90%)" }}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: "hsl(240, 10%, 3.9%)" }}
                                            tickLine={false}
                                            axisLine={{ stroke: "hsl(240, 5.9%, 90%)" }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: 'hsl(346.8, 77.2%, 49.8%, 0.1)' }}
                                            contentStyle={{
                                                backgroundColor: "hsl(0, 0%, 100%)",
                                                border: 'none',
                                                borderRadius: '8px',
                                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                                color: "hsl(240, 10%, 3.9%)"
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ paddingTop: 10 }}
                                            formatter={(value) => <span style={{ color: "hsl(240, 10%, 3.9%)" }}>{value}</span>}
                                        />
                                        <Bar
                                            dataKey="count"
                                            name={`${dataTypeOptions.find(opt => opt.value === selectedDataType)?.label || selectedDataType} (${selectedYear})`}
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
    )
} 