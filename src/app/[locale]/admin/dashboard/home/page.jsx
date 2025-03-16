'use client'
import Loading from '@/components/loading'
import Title from '@/components/title'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { adminStatisticsApi } from '@/services/adminStatisticsApi'
import { Clock, FileText, Film, Heart, Star, Tag, TrendingUp, UserPlus, Users, Zap } from 'lucide-react'
import React from 'react'
export default function DashboardHome() {
    const { data, isLoading } = adminStatisticsApi.query.useGetStatistics()
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