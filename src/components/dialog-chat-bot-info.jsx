'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Info } from 'lucide-react'

export default function ChatbotInfoDialog() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant='ghost'
        size='icon'
        onClick={() => setOpen(true)}
        className='h-7 w-7'
      >
        <Info className='w-4 h-4' />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='max-w-lg'>
          <DialogHeader>
            <DialogTitle>🤖 Chatbot AI – Thông tin</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 text-sm leading-relaxed text-muted-foreground p-4'>
            <div>
              <strong className='text-foreground'>🌟 Tính năng nổi bật:</strong>
              <ul className='mt-2 list-disc list-inside space-y-2'>
                <li>
                  <span className='font-medium text-foreground'>
                    Hiểu ý từ mô tả về phim:
                  </span>{' '}
                  <br />
                  Chỉ cần gõ một đoạn mô tả, chatbot sẽ tìm ra bộ phim bạn đang
                  nhắc đến trong hệ thống. <br />
                  <em>Ví dụ:</em> “Phim hoạt hình có cậu bé tên Miguel, đam mê
                  âm nhạc” → 🎬 <strong>Coco</strong>
                </li>
                <li>
                  <span className='font-medium text-foreground'>
                    Phản hồi theo ngữ cảnh nhóm hoặc phim mà người dùng cung
                    cấp:
                  </span>{' '}
                  <br />
                  Chatbot hiểu được các từ khóa như tên group hoặc chủ đề liên
                  quan để đưa ra kết quả chính xác. <br />
                  <em>Ví dụ:</em> “@Rạp Chiếu Nhà Mình top bài viết nổi bật” →
                  ✅ danh sách bài viết nhiều lượt thích nhất từ nhóm đó.
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
