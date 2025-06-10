'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as XLSX from 'xlsx'
import SentimentOverview from './sentiment-overview'
import MovieComparison from './movie-comparison'
import MovieDetail from './movie-detail'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import Loading from '@/components/loading'
import { movieApi } from '@/services/movieApi'

export default function SentimentAnalysis({ sentimentData }) {
    const [selectedSentimentView, setSentimentView] = useState('overview')
    const [selectedMovie, setSelectedMovie] = useState(null)
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    const { data: moviesData, isLoading } = movieApi.query.useGetAllMoviesTable(currentPage, pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    if (isLoading) return <Loading />

    const handleExportSentimentCSV = () => {
        const data = {
            totalComments: sentimentData.totalComments,
            positivePercentage: Number(sentimentData.positivePercentage.toFixed(2)),
            negativePercentage: Number(sentimentData.negativePercentage.toFixed(2)),
            neutralPercentage: Number(sentimentData.neutralPercentage.toFixed(2)),
            mostPositiveMovie: sentimentData.mostPositiveMovie,
            mostPositivePercentage: Number(sentimentData.mostPositivePercentage.toFixed(2)),
            mostNegativeMovie: sentimentData.mostNegativeMovie,
            mostNegativePercentage: Number(sentimentData.mostNegativePercentage.toFixed(2)),
            lastUpdated: sentimentData.lastUpdated
        };

        // Convert data to CSV format
        const headers = Object.keys(data);
        const csvContent = [
            headers.join(','),
            headers.map(header => data[header]).join(',')
        ].join('\n');

        // Create and download CSV file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `sentiment_analysis_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleExportSentimentExcel = () => {
        const data = {
            totalComments: sentimentData.totalComments,
            positivePercentage: Number(sentimentData.positivePercentage.toFixed(2)),
            negativePercentage: Number(sentimentData.negativePercentage.toFixed(2)),
            neutralPercentage: Number(sentimentData.neutralPercentage.toFixed(2)),
            mostPositiveMovie: sentimentData.mostPositiveMovie,
            mostPositivePercentage: Number(sentimentData.mostPositivePercentage.toFixed(2)),
            mostNegativeMovie: sentimentData.mostNegativeMovie,
            mostNegativePercentage: Number(sentimentData.mostNegativePercentage.toFixed(2)),
            lastUpdated: sentimentData.lastUpdated
        };

        // Create worksheet
        const ws = XLSX.utils.json_to_sheet([data]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sentiment Analysis");

        // Generate and download Excel file
        XLSX.writeFile(wb, `sentiment_analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-4"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
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
                </Card>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8"
            >
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
            </motion.div>
        </motion.div>
    )
} 