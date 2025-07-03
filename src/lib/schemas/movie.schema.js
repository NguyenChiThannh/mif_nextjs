import { z } from 'zod'

const award = z.object({
  name: z
    .string()
    .min(1, 'Tên giải thưởng không được để trống')
    .max(100, 'Tên giải thưởng tối đa 100 ký tự'),
  date: z.preprocess(
    (arg) =>
      typeof arg === 'string' || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z
      .date({ required_error: 'Ngày nhận giải không được để trống' })
      .max(new Date(), 'Ngày nhận giải phải là trong quá khứ hoặc hôm nay'),
  ),
})

export const schemaMovie = z.object({
  title: z
    .string()
    .min(2, 'Tên phim phải có ít nhất 2 ký tự')
    .max(100, 'Tên phim tối đa 100 ký tự'),
  description: z
    .string()
    .min(10, 'Mô tả phải có ít nhất 10 ký tự')
    .max(2000, 'Mô tả tối đa 2000 ký tự'),
  genreIds: z.array(z.string()).min(1, 'Phim phải có ít nhất 1 thể loại'),
  releaseDate: z.preprocess(
    (arg) =>
      typeof arg === 'string' || arg instanceof Date
        ? new Date(arg)
        : undefined,
    z
      .date({ required_error: 'Ngày phát hành không được để trống' })
      .max(new Date(), 'Ngày phát hành phải là trong quá khứ hoặc hôm nay'),
  ),
  directorId: z.array(z.string()).min(1, 'Phim phải có ít nhất 1 đạo diễn'),
  castIds: z.array(z.string()).min(1, 'Phim phải có ít nhất 1 diễn viên'),
  posterUrl: z
    .string()
    .url('Poster phải là một URL hợp lệ')
    .min(1, 'Poster không được để trống'),
  trailerUrl: z
    .string()
    .url('Trailer phải là một URL hợp lệ')
    .min(1, 'Trailer không được để trống'),
  duration: z
    .string()
    .min(1, 'Thời lượng không được để trống')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Thời lượng phải là số phút dương',
    }),
  country: z.string().min(1, 'Quốc gia không được để trống'),
  budget: z.number().min(0, 'Ngân sách phải lớn hơn hoặc bằng 0'),
  awards: z.array(award),
})
