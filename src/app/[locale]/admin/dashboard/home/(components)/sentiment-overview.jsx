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
    ResponsiveContainer
} from 'recharts'

export default function SentimentOverview({ sentimentData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Enhanced Pie Chart */}
            <div className="md:col-span-1 bg-accent/20 rounded-lg p-4 transition-shadow">
                <h3 className="text-lg font-semibold mb-4">Phân bố cảm xúc</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodOpacity="0.3" />
                                </filter>
                            </defs>
                            <Pie
                                data={sentimentData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                filter="url(#shadow)"
                            >
                                {sentimentData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        stroke="#ffffff"
                                        strokeWidth={2}
                                        className="hover:opacity-80 transition-opacity cursor-pointer"
                                    />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value, name) => [`${value}%`, name]}
                                contentStyle={{
                                    backgroundColor: "hsl(0, 0%, 100%)",
                                    border: 'none',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    color: "hsl(240, 10%, 3.9%)",
                                    padding: '8px 12px',
                                    fontWeight: 'bold'
                                }}
                                itemStyle={{
                                    padding: '4px 0'
                                }}
                                wrapperStyle={{
                                    zIndex: 100
                                }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                align="center"
                                layout="horizontal"
                                iconSize={10}
                                iconType="circle"
                                formatter={(value) => (
                                    <span style={{ color: "hsl(240, 10%, 3.9%)", fontWeight: "medium", padding: "0 8px" }}>
                                        {value}
                                    </span>
                                )}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Stats and Info */}
            <div className="md:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Thống kê cảm xúc</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 font-medium">Tích cực</p>
                                    <h4 className="text-2xl font-bold text-green-700">65%</h4>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <Heart className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-red-50 border-red-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-red-600 font-medium">Tiêu cực</p>
                                    <h4 className="text-2xl font-bold text-red-700">20%</h4>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <FileText className="h-5 w-5 text-red-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">Trung tính</p>
                                    <h4 className="text-2xl font-bold text-gray-700">15%</h4>
                                </div>
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <Clock className="h-5 w-5 text-gray-600" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="bg-accent/20 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Thông tin chi tiết</h4>
                    <ul className="space-y-2">
                        <li className="flex items-center justify-between">
                            <span className="text-sm">Tổng số bình luận phân tích:</span>
                            <span className="font-medium">5,230</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm">Phim có cảm xúc tích cực nhất:</span>
                            <span className="font-medium">The Godfather (85%)</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm">Phim có cảm xúc tiêu cực nhất:</span>
                            <span className="font-medium">Star Wars: The Last Jedi (40%)</span>
                        </li>
                        <li className="flex items-center justify-between">
                            <span className="text-sm">Thời gian cập nhật gần nhất:</span>
                            <span className="font-medium">Hôm nay, 15:30</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
} 