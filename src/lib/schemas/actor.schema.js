import { z } from "zod";

const award = z.object({
    name: z.string().min(1, 'Tên giải thưởng không được để trống').max(100, 'Tên giải thưởng tối đa 100 ký tự'),
    date: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date({ required_error: 'Ngày nhận giải không được để trống' })
            .max(new Date(), 'Ngày nhận giải phải là trong quá khứ')
    ),
})

export const schemaActor = z.object({
    name: z.string().min(2, 'Tên diễn viên phải có ít nhất 2 ký tự').max(50, 'Tên diễn viên tối đa 50 ký tự'),
    dateOfBirth: z.preprocess(
        (arg) => (typeof arg === 'string' || arg instanceof Date ? new Date(arg) : undefined),
        z.date({ required_error: 'Ngày sinh không được để trống' })
            .max(new Date(), 'Ngày sinh phải là trong quá khứ')
    ),
    bio: z.string().min(10, 'Tiểu sử phải có ít nhất 10 ký tự').max(1000, 'Tiểu sử tối đa 1000 ký tự'),
    awards: z.array(award).nullable(),
    profilePictureUrl: z.string().url('Ảnh đại diện phải là một URL hợp lệ').min(1, 'Ảnh đại diện không được để trống'),
})