'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export default function MovieComparison({ moviesData, setSelectedMovie }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3 className="text-lg font-semibold mb-4 text-foreground">So sánh cảm xúc theo phim</h3>

            <div className="overflow-x-auto rounded-lg border border-border/50 shadow-sm">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-accent/30">
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">STT</th>
                            <th className="p-3 text-left text-sm font-medium text-muted-foreground">Tên phim</th>
                            <th className="p-3 text-center text-sm font-medium text-muted-foreground">Số lượng đánh giá</th>
                            <th className="p-3 text-center text-sm font-medium text-muted-foreground">Điểm trung bình</th>
                            <th className="p-3 text-center text-sm font-medium text-muted-foreground">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {moviesData.map((movie, index) => (
                            <motion.tr
                                key={index}
                                className="border-b border-border hover:bg-accent/10 transition-colors duration-200"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <td className="p-3 font-medium text-foreground">{index + 1}</td>
                                <td className="p-3 font-medium text-foreground">{movie.title}</td>
                                <td className="p-3 text-center text-foreground">{movie.ratings?.numberOfRatings || 0}</td>
                                <td className="p-3 text-center text-foreground">{movie.ratings?.averageRating || 0}</td>
                                <td className="p-3 text-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedMovie(movie)}
                                        className="hover:bg-accent/20 transition-colors duration-200"
                                    >
                                        Chi tiết
                                    </Button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    )
} 