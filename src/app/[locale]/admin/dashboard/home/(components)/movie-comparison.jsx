'use client'
import React from 'react'
import { Button } from '@/components/ui/button'

export default function MovieComparison({ moviesData, setSelectedMovie }) {
    return (
        <div>
            <h3 className="text-lg font-semibold mb-4">So sánh cảm xúc theo phim</h3>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-accent/30">
                            <th className="p-3 text-left">STT</th>
                            <th className="p-3 text-left">Tên phim</th>
                            <th className="p-3 text-center">Số lượng đánh giá</th>
                            <th className="p-3 text-center">Điểm trung bình</th>
                            <th className="p-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moviesData.map((movie, index) => (
                            <tr key={index} className="border-b border-border hover:bg-accent/10">
                                <td className="p-3 font-medium">{index + 1}</td>
                                <td className="p-3 font-medium">{movie.title}</td>
                                <td className="p-3 text-center">{movie.ratings?.numberOfRatings || 0}</td>
                                <td className="p-3 text-center">{movie.ratings?.averageRating || 0}</td>
                                <td className="p-3 text-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedMovie(movie)}
                                    >
                                        Chi tiết
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
} 