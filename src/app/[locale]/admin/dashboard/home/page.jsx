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
                {/* <div className="mt-4 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">The Godfather</span>
                    <span className="text-xs text-muted-foreground">diễn viên được yêu thích nhất</span>
                </div> */}
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
                {/* <div className="mt-4 flex items-center space-x-2">
                    <UserPlus className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">15,678</span>
                    <span className="text-xs text-muted-foreground">thành viên trong các nhóm</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">Nhóm Phim Hài</span>
                    <span className="text-xs text-muted-foreground">tương tác cao nhất</span>
                </div> */}
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
                {/* <div className="mt-4 flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-500">Hành động (2,345)</span>
                    <span className="text-xs text-muted-foreground">thể loại phổ biến nhất</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-yellow-500">The Shawshank Redemption</span>
                    <span className="text-xs text-muted-foreground">đánh giá cao nhất</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">50</span>
                    <span className="text-xs text-muted-foreground">phim mới thêm gần đây</span>
                </div> */}
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
                {/* <div className="mt-4 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">1,234</span>
                    <span className="text-xs text-muted-foreground">bài viết phổ biến</span>
                </div> */}
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
                {/* <div className="mt-4 flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Inception (2010)</span>
                    <span className="text-xs text-muted-foreground">xếp hạng cao nhất năm</span>
                </div> */}
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