'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import SentimentOverview from './sentiment-overview'
import MovieComparison from './movie-comparison'
import MovieDetail from './movie-detail'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { sentimentData, movieSentimentData } from '@/app/[locale]/admin/dashboard/home/sentiment-data'
import Loading from '@/components/loading'
import { movieApi } from '@/services/movieApi'

export default function SentimentAnalysis() {
    const [selectedSentimentView, setSentimentView] = useState('overview')
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    const { data: moviesData, isLoading } = movieApi.query.useGetAllMoviesTable(currentPage, pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    if (isLoading) return <Loading />
    // Export functions for sentiment data
    // const handleExportSentimentCSV = () => {
    //     let csvContent = `data:text/csv;charset=utf-8,`

    //     if (selectedSentimentView === 'overview') {
    //         // Export overall sentiment data
    //         csvContent += `Loại cảm xúc,Tỷ lệ (%)\n`
    //         sentimentData.forEach(item => {
    //             csvContent += `${item.name},${item.value}\n`
    //         })
    //     } else if (selectedMovie) {
    //         // Export detailed movie ratings
    //         csvContent += `Người dùng,Đánh giá,Bình luận,Cảm xúc,Tích cực (%),Tiêu cực (%),Trung tính (%),Hỗn hợp (%),Ngày tạo\n`
    //         getMovieRatings(selectedMovie).forEach(rating => {
    //             const positiveScore = rating.positiveScore ? (rating.positiveScore * 100).toFixed(1) : 'N/A'
    //             const negativeScore = rating.negativeScore ? (rating.negativeScore * 100).toFixed(1) : 'N/A'
    //             const neutralScore = rating.neutralScore ? (rating.neutralScore * 100).toFixed(1) : 'N/A'
    //             const mixedScore = rating.mixedScore ? (rating.mixedScore * 100).toFixed(1) : 'N/A'

    //             csvContent += `${rating.user.displayName},"${rating.ratingValue}","${rating.comment}",${rating.sentiment || 'Chưa phân tích'},${positiveScore},${negativeScore},${neutralScore},${mixedScore},${new Date(rating.createdAt).toLocaleDateString('vi-VN')}\n`
    //         })
    //     } else {
    //         // Export movie comparison data
    //         csvContent += `Tên phim,Tích cực (%),Tiêu cực (%),Trung tính (%),Tổng bình luận\n`
    //         movieSentimentData.forEach(movie => {
    //             csvContent += `${movie.name},${movie.positive},${movie.negative},${movie.neutral},${movie.totalComments}\n`
    //         })
    //     }

    //     const encodedUri = encodeURI(csvContent)
    //     const link = document.createElement("a")
    //     link.setAttribute("href", encodedUri)
    //     link.setAttribute("download", `phan_tich_cam_xuc_${selectedMovie || selectedSentimentView}.csv`)
    //     document.body.appendChild(link)
    //     link.click()
    //     document.body.removeChild(link)
    // }

    // const handleExportSentimentExcel = () => {
    //     let data = []
    //     let sheetName = ''

    //     if (selectedSentimentView === 'overview') {
    //         // Export overall sentiment data
    //         data = sentimentData.map(item => ({
    //             'Loại cảm xúc': item.name,
    //             'Tỷ lệ (%)': item.value
    //         }))
    //         sheetName = 'Tổng quan cảm xúc'
    //     } else if (selectedMovie) {
    //         // Export detailed movie ratings
    //         data = getMovieRatings(selectedMovie).map(rating => ({
    //             'Người dùng': rating.user.displayName,
    //             'Đánh giá': rating.ratingValue,
    //             'Bình luận': rating.comment,
    //             'Cảm xúc': rating.sentiment || 'Chưa phân tích',
    //             'Tích cực (%)': rating.positiveScore ? (rating.positiveScore * 100).toFixed(1) : 'N/A',
    //             'Tiêu cực (%)': rating.negativeScore ? (rating.negativeScore * 100).toFixed(1) : 'N/A',
    //             'Trung tính (%)': rating.neutralScore ? (rating.neutralScore * 100).toFixed(1) : 'N/A',
    //             'Hỗn hợp (%)': rating.mixedScore ? (rating.mixedScore * 100).toFixed(1) : 'N/A',
    //             'Ngày tạo': new Date(rating.createdAt).toLocaleDateString('vi-VN')
    //         }))
    //         sheetName = `Chi tiết ${selectedMovie}`
    //     } else {
    //         // Export movie comparison data
    //         data = movieSentimentData.map(movie => ({
    //             'Tên phim': movie.name,
    //             'Tích cực (%)': movie.positive,
    //             'Tiêu cực (%)': movie.negative,
    //             'Trung tính (%)': movie.neutral,
    //             'Tổng bình luận': movie.totalComments
    //         }))
    //         sheetName = 'So sánh phim'
    //     }

    //     const worksheet = XLSX.utils.json_to_sheet(data)
    //     const workbook = XLSX.utils.book_new()
    //     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
    //     XLSX.writeFile(workbook, `phan_tich_cam_xuc_${selectedMovie || selectedSentimentView}.xlsx`)
    // }

    const handleExportSentimentCSV = () => { }

    const handleExportSentimentExcel = () => { }

    return (
        <div className="p-4 mt-4">
            <Card>
                <CardHeader className="pb-6 border-b">
                    <div className="flex flex-col space-y-1.5">
                        <CardTitle className="text-xl font-semibold">Phân tích cảm xúc người dùng</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Theo dõi xu hướng cảm xúc của người dùng đối với các bộ phim
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {/* View Selector */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Chế độ xem</label>
                            <Tabs defaultValue="overview" className="w-full" onValueChange={setSentimentView}>
                                <TabsList className="w-full grid grid-cols-2">
                                    <TabsTrigger value="overview">
                                        <div className="flex items-center">
                                            Tổng quan
                                        </div>
                                    </TabsTrigger>
                                    <TabsTrigger value="comparison">
                                        <div className="flex items-center">
                                            So sánh phim
                                        </div>
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        {/* Export File */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Xuất dữ liệu</label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={handleExportSentimentCSV}>
                                    <Download className="h-4 w-4 mr-2" />
                                    CSV
                                </Button>
                                <Button variant="outline" onClick={handleExportSentimentExcel}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Excel
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {selectedSentimentView === 'overview' ? (
                        <SentimentOverview sentimentData={sentimentData} />
                    ) : (
                        <div>
                            <MovieComparison
                                moviesData={moviesData?.content}
                                setSelectedMovie={setSelectedMovie}
                            />

                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem className="mt-4 shadow-md rounded-lg">
                                            <PaginationPrevious
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 0}
                                                className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>

                                        {(() => {
                                            const totalPages = moviesData?.totalPages || 1;
                                            const pageNumbers = [];

                                            pageNumbers.push(0);

                                            let start = Math.max(1, currentPage - 1);
                                            let end = Math.min(currentPage + 1, totalPages - 2);

                                            if (start > 1) {
                                                pageNumbers.push('...');
                                            }

                                            for (let i = start; i <= end; i++) {
                                                pageNumbers.push(i);
                                            }

                                            if (end < totalPages - 2) {
                                                pageNumbers.push('...');
                                            }

                                            if (totalPages > 1) {
                                                pageNumbers.push(totalPages - 1);
                                            }

                                            return pageNumbers.map((pageNumber, index) => {
                                                if (pageNumber === '...') {
                                                    return (
                                                        <PaginationItem key={`ellipsis-${index}`} className="mt-4 shadow-md rounded-lg">
                                                            <span className="px-4">...</span>
                                                        </PaginationItem>
                                                    );
                                                }

                                                return (
                                                    <PaginationItem key={pageNumber} className="mt-4 shadow-md rounded-lg">
                                                        <PaginationLink
                                                            href="#"
                                                            isActive={pageNumber === currentPage}
                                                            onClick={() => handlePageChange(pageNumber)}
                                                        >
                                                            {pageNumber + 1}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                );
                                            });
                                        })()}

                                        <PaginationItem className="mt-4 shadow-md rounded-lg">
                                            <PaginationNext
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage >= (moviesData?.totalPages - 1)}
                                                className={currentPage >= (moviesData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>

                            {selectedMovie && (
                                <MovieDetail
                                    selectedMovie={selectedMovie}
                                    setSelectedMovie={setSelectedMovie}
                                />
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
} 