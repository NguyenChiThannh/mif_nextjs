import { z } from 'zod'
export const schemaProfileUser = (t) => z.object({
  displayName: z.string().min(2, t('display_name_min')),
  dob: z.date(),
  bio: z.string().max(500, t('bio_max_length')),
})  
