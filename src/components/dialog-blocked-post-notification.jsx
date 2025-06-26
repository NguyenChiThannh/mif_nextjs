import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import Image from 'next/image'

export const BlockedPostDialog = ({ notification, open, onOpenChange }) => {
  const router = useRouter()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='text-destructive'>
            Bài viết bị chặn
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <div>
            <h4 className='font-medium mb-2'>Tiêu đề</h4>
            <p className='text-sm text-muted-foreground'>
              {notification.title}
            </p>
          </div>

          <div>
            <h4 className='font-medium mb-2'>Nội dung</h4>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {notification.content}
            </p>
          </div>

          {notification.mediaUrls?.length > 0 && (
            <div>
              <h4 className='font-medium mb-2'>Hình ảnh</h4>
              <div className='grid grid-cols-2 gap-2'>
                {notification.mediaUrls.map((url, index) => (
                  <Image
                    key={index}
                    src={url}
                    alt={`Media ${index + 1}`}
                    className='w-full h-40 object-cover rounded-md'
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className='font-medium mb-2'>Lý do</h4>
            <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
              {notification.message}
            </p>
          </div>
        </div>

        <DialogFooter className='flex gap-2 sm:gap-0'>
          <Button variant='secondary' onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              router.push(`/groups/${notification.groupId}`)
            }}
          >
            Đi đến nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
