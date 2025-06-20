import { z } from 'zod';

export const schemaEvent = z
  .object({
    eventName: z
      .string()
      .min(2, 'Tên sự kiện phải có ít nhất 2 ký tự')
      .max(100, 'Tên sự kiện tối đa 100 ký tự'),
    description: z
      .string()
      .min(10, 'Mô tả phải có ít nhất 10 ký tự')
      .max(1000, 'Mô tả tối đa 1000 ký tự'),
    groupId: z.string().min(1, 'GroupId là bắt buộc'),
    startDate: z.any().refine(
      (val) => {
        if (!val) return false;
        // val là object {year, month, day, hour, minute, ...}
        if (typeof val === 'object' && val.year && val.month && val.day) {
          const date = new Date(
            Date.UTC(
              val.year,
              val.month - 1,
              val.day,
              val.hour || 0,
              val.minute || 0,
              val.second || 0,
              val.millisecond || 0,
            ),
          );
          return date > new Date();
        }
        // Nếu là string hoặc Date
        const date = new Date(val);
        return date > new Date();
      },
      { message: 'Thời gian sự kiện phải ở tương lai' },
    ),
    eventType: z.enum(['OFFLINE', 'ONLINE'], {
      required_error: 'Hình thức sự kiện là bắt buộc',
    }),
    eventPicture: z.string().optional(),
    socialType: z.enum(['MIF_LIVE', 'OTHER'], {
      required_error: 'Nền tảng là bắt buộc',
    }),
    link: z.string().optional(),
    location: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.eventType === 'ONLINE' && data.socialType === 'OTHER') {
      if (!data.link || data.link.trim() === '') {
        ctx.addIssue({
          path: ['link'],
          code: z.ZodIssueCode.custom,
          message: 'Link sự kiện là bắt buộc',
        });
      }
    }
    if (data.eventType === 'OFFLINE') {
      if (!data.location || data.location.trim() === '') {
        ctx.addIssue({
          path: ['location'],
          code: z.ZodIssueCode.custom,
          message: 'Địa điểm là bắt buộc',
        });
      }
    }
  });
