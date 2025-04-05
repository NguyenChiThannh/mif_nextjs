'use client'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { movieRatingsApi } from '@/services/movieRatingsApi'

export default function MovieDetail({ selectedMovie, setSelectedMovie }) {
    const { isLoading: isLoadingReview, data: review } = movieRatingsApi.query.useGetRatingsByMovieId(selectedMovie.id)

    console.log(review)

    if (isLoadingReview) return <div>Loading...</div>
    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Chi tiết đánh giá: {selectedMovie.title}</h3>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedMovie(null)}
                >
                    Đóng
                </Button>
            </div>

            <div className="overflow-x-auto shadow rounded-lg">
                <table className="w-full border-collapse min-w-[1200px]">
                    <thead>
                        <tr className="bg-accent/30">
                            <th className="p-3 text-left min-w-[180px]">Người dùng</th>
                            <th className="p-3 text-center min-w-[100px]">Đánh giá</th>
                            <th className="p-3 text-left min-w-[250px]">Bình luận</th>
                            <th className="p-3 text-center min-w-[100px]">Cảm xúc</th>
                            <th className="p-3 text-center min-w-[120px]">Tích cực</th>
                            <th className="p-3 text-center min-w-[120px]">Tiêu cực</th>
                            <th className="p-3 text-center min-w-[120px]">Trung tính</th>
                            <th className="p-3 text-center min-w-[120px]">Hỗn hợp</th>
                            <th className="p-3 text-center min-w-[100px]">Ngày tạo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {review?.content.map((rating, index) => (
                            <tr key={index} className="border-b border-border hover:bg-accent/10">
                                <td className="p-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                                            <img
                                                src={rating.user.profilePictureUrl}
                                                alt={rating.user.displayName}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(rating.user.displayName);
                                                }}
                                            />
                                        </div>
                                        <span className="font-medium truncate">{rating.user.displayName}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    <div className="flex items-center justify-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < rating.ratingValue ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
                                            />
                                        ))}
                                    </div>
                                </td>
                                <td className="p-3 max-w-[250px]">
                                    <div className="truncate" title={rating.comment}>
                                        {rating.comment}
                                    </div>
                                </td>
                                <td className="p-3 text-center">
                                    {!rating.sentiment ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Chưa phân tích
                                        </span>
                                    ) : rating.sentiment === "POSITIVE" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Tích cực
                                        </span>
                                    ) : rating.sentiment === "NEGATIVE" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Tiêu cực
                                        </span>
                                    ) : rating.sentiment === "NEUTRAL" ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Trung tính
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                            Hỗn hợp
                                        </span>
                                    )}
                                </td>
                                <td className="p-3 text-center min-w-[120px]">
                                    {rating.positiveScore ? (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-green-500 h-2.5 rounded-full"
                                                    style={{ width: `${rating.positiveScore * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs mt-1 block">{(rating.positiveScore * 100).toFixed(1)}%</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3 text-center min-w-[120px]">
                                    {rating.negativeScore ? (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-red-500 h-2.5 rounded-full"
                                                    style={{ width: `${rating.negativeScore * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs mt-1 block">{(rating.negativeScore * 100).toFixed(1)}%</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3 text-center min-w-[120px]">
                                    {rating.neutralScore ? (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-gray-500 h-2.5 rounded-full"
                                                    style={{ width: `${rating.neutralScore * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs mt-1 block">{(rating.neutralScore * 100).toFixed(1)}%</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3 text-center min-w-[120px]">
                                    {rating.mixedScore ? (
                                        <>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-purple-500 h-2.5 rounded-full"
                                                    style={{ width: `${rating.mixedScore * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs mt-1 block">{(rating.mixedScore * 100).toFixed(1)}%</span>
                                        </>
                                    ) : (
                                        <span className="text-xs text-gray-500">N/A</span>
                                    )}
                                </td>
                                <td className="p-3 text-center text-sm">
                                    {new Date(rating.createdAt).toLocaleDateString('vi-VN')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {review?.content.length === 0 && (
                <div className="text-center p-8 bg-accent/10 rounded-lg">
                    <p className="text-muted-foreground">Không có dữ liệu đánh giá chi tiết cho phim này.</p>
                </div>
            )}

            <div className="mt-4 p-4 bg-accent/10 rounded-lg">
                <h4 className="font-medium mb-2">Thông tin chi tiết</h4>
                <p className="text-sm text-muted-foreground">
                    Bảng trên hiển thị chi tiết từng đánh giá của người dùng về phim &quot;{selectedMovie.title}&quot;.
                    Mỗi đánh giá được hiển thị kèm theo điểm số và phân tích cảm xúc (nếu có).
                    Các đánh giá được phân tích thành các điểm số cảm xúc tích cực, tiêu cực, trung tính và hỗn hợp.
                </p>
            </div>
        </div>
    )
} 