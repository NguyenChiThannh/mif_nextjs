import { z } from 'zod'
export const schemaRatingMovie = (t) => z.object({
    ratingValue: z.number()
        .min(1, { message: t('rating_value_min') })
        .max(5, { message: t('rating_value_max') }),
    movieId: z.string(),
    comment: z.string().min(20, t('comment_length_min')),
})  
