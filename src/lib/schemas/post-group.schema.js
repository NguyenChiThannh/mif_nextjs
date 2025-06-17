import { z } from 'zod'

export const schemaPost = (t) => z.object({
    groupId: z.string(),
    title: z.string()
        .min(5, t('title_length_min'))
        .max(100, t('title_length_max')),
    content: z.string()
        .min(10, t('content_length_min')),
    mediaUrls: z.array(z.string()).optional()
})  
