import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useState } from 'react'

export function DialogInfoSystem() {
  const [open, setOpen] = useState(true)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='w-full max-w-4xl'>
        <DialogHeader>
          <DialogTitle>Thông báo hệ thống</DialogTitle>
          <DialogDescription>
            Cảm ơn bạn đã truy cập ứng dụng!
          </DialogDescription>
        </DialogHeader>
        <div className='text-sm text-muted-foreground space-y-2 leading-relaxed text-justify'>
          <p>
            Đây là đồ án tốt nghiệp của mình và mình đảm nhận vai trò{' '}
            <strong>Frontend Developer</strong>. Hệ thống đã được hoàn thiện và
            demo thành công.
          </p>
          <p>
            Do chi phí vận hành backend (bao gồm <strong>Spring Boot</strong>,{' '}
            <strong>RabbitMQ</strong>, <strong>Redis</strong> và{' '}
            <strong>AI server</strong>) khá cao, đồng thời source backend không
            thuộc quyền sở hữu của mình và có chứa một số key riêng tư từ bạn
            backend, nên mình tạm thời triển khai frontend sử dụng một{' '}
            <strong>server mock data JSON</strong>.
          </p>
          <p>
            Ứng dụng được deploy trên <strong>Render</strong>, vì vậy lần tải
            đầu tiên có thể hơi chậm. Ngoài ra, do sử dụng mock data nên dữ liệu
            không phải là dữ liệu thật và các chức năng nâng cao sẽ không hoạt
            động chính xác như trong môi trường thực tế.
          </p>
          <p>Tất cả mọi tài khoản sẽ vào được ứng dụng</p>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Tôi đã hiểu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
