import { z } from 'zod'

export const schemaCategory = z.object({
  categoryName: z
    .string()
    .min(2, 'Tên thể loại phải có ít nhất 2 ký tự')
    .max(50, 'Tên thể loại tối đa 50 ký tự'),
  description: z
    .string()
    .min(5, 'Mô tả phải có ít nhất 5 ký tự')
    .max(200, 'Mô tả tối đa 200 ký tự'),
})
