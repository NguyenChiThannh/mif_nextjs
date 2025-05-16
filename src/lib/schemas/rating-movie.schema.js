import { z } from 'zod'
export const schemaRatingMovie = z.object({
    ratingValue: z.number()
        .min(1, { message: "Bạn phải chọn ít nhất 1 sao" })
        .max(5, { message: "Điểm đánh giá tối đa là 5" }),
    movieId: z.string(),
    comment: z.string().min(10, 'Tối thiểu 20 ký tự'),
})  
