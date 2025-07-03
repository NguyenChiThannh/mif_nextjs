import { Card, CardContent } from '@/components/ui/card'
import { Users, CalendarDays, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Skeleton } from '@/components/ui/skeleton'
import { useRouter } from 'next/navigation'
import useUserId from '@/hooks/useUserId'
import { useGroupStatus } from '@/hooks/useGroupStatus'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import useDragAndDrop from '@/hooks/useDragAndDrop'
import { useState } from 'react'

export default function CardGroups({ group, categories }) {
  const t = useTranslations('Groups')
  const userId = useUserId()
  const { status, handleJoinGroup, handleRemovePendingGroup } = useGroupStatus(
    group.id,
    userId,
  )
  const { handleDragStart, handleDragEnd } = useDragAndDrop()
  const [isDragMode, setIsDragMode] = useState(false)
  const [isDragHover, setIsDragHover] = useState(false)
  const router = useRouter()

  const handleDetailGroup = () => {
    if (!isDragMode) {
      router.push(`/groups/${group.id}`)
    }
  }

  const handleEnableDragMode = (e) => {
    e.stopPropagation()
    setIsDragMode(true)
  }

  const handleDisableDragMode = () => {
    setIsDragMode(false)
    setIsDragHover(false)
  }

  const handleGroupDragStart = (e) => {
    if (!isDragMode) {
      e.preventDefault()
      return
    }

    const dragData = {
      type: 'group',
      id: group.id,
      name: group.groupName,
      avatar: group.avatarUrl,
    }
    handleDragStart(e, dragData)
    setIsDragHover(true)
  }

  const handleGroupDragEnd = () => {
    handleDragEnd()
    setIsDragHover(false)
    // Auto disable drag mode after drag
    setTimeout(() => setIsDragMode(false), 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className='relative'
    >
      {/* Drag Mode Toggle Button - Always visible */}
      <motion.div
        className='absolute top-2 right-2 z-20'
        initial={{ opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          size='sm'
          variant='ghost'
          onClick={isDragMode ? handleDisableDragMode : handleEnableDragMode}
          className={`h-9 w-9 rounded-full transition-all duration-200 ${
            isDragMode
              ? 'bg-primary text-primary-foreground shadow-lg'
              : 'bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border border-white/10'
          }`}
        >
          <GripVertical className='h-5 w-5' />
        </Button>
      </motion.div>

      <motion.div
        className={`transition-all duration-300 ${
          isDragMode && isDragHover
            ? 'scale-105 rotate-2 shadow-2xl'
            : 'scale-100 rotate-0'
        }`}
        animate={{
          boxShadow:
            isDragMode && isDragHover
              ? '0 25px 50px rgba(var(--primary), 0.25)'
              : '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        draggable={isDragMode}
        onDragStart={handleGroupDragStart}
        onDragEnd={handleGroupDragEnd}
      >
        <Card
          className={`overflow-hidden transition-all duration-300 cursor-pointer ${
            isDragMode
              ? 'border-primary/50 cursor-grab active:cursor-grabbing'
              : 'border-border hover:shadow-lg'
          }`}
        >
          <CardContent className='flex flex-col gap-2 p-0 relative'>
            {/* Drag Mode Overlay */}
            <AnimatePresence>
              {isDragMode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isDragHover ? [1, 1.02, 1] : 1,
                    transition: {
                      duration: 1,
                      repeat: isDragHover ? Infinity : 0,
                    },
                  }}
                  exit={{ opacity: 0 }}
                  className={`absolute inset-0 bg-primary/10 backdrop-blur-sm rounded-lg border-2 border-dashed border-primary z-10 flex items-center justify-center ${
                    isDragHover ? 'bg-primary/20' : ''
                  } transition-all duration-200`}
                >
                  <motion.div
                    className='flex flex-col items-center gap-2 text-primary'
                    animate={{
                      y: isDragHover ? [-2, 2, -2] : 0,
                      transition: {
                        duration: 1.5,
                        repeat: isDragHover ? Infinity : 0,
                      },
                    }}
                  >
                    <GripVertical className='h-6 w-6' />
                    <span className='text-sm font-medium'>Kéo để mention</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className='relative overflow-hidden'
              whileHover={!isDragMode ? { scale: 1.05 } : {}}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={group.avatarUrl || '/group_default.jpg'}
                alt='Group'
                width={1200}
                height={2500}
                className={`object-cover w-full aspect-[16/12] transition-all duration-300 ${
                  isDragMode && isDragHover
                    ? 'brightness-110 saturate-110'
                    : 'brightness-100'
                }`}
              />
            </motion.div>

            <div className='p-4'>
              <div className='mb-3 space-y-2'>
                <motion.h3
                  className={`text-xl font-bold transition-colors duration-200 cursor-pointer truncate  ${
                    isDragMode
                      ? isDragHover
                        ? 'text-primary'
                        : 'text-foreground'
                      : 'text-foreground hover:text-primary'
                  }`}
                  onClick={handleDetailGroup}
                  whileHover={!isDragMode ? { x: 5 } : {}}
                  transition={{ duration: 0.2 }}
                  animate={{
                    scale: isDragMode && isDragHover ? 1.05 : 1,
                  }}
                >
                  {group?.groupName}
                </motion.h3>

                <motion.p
                  className={`text-sm px-3 py-1 rounded-full transition-all duration-300 ${
                    isDragMode && isDragHover
                      ? 'text-primary-foreground bg-primary/90 shadow-lg'
                      : 'text-primary-foreground bg-primary'
                  }`}
                  style={{ display: 'inline-block' }}
                  animate={{
                    scale: isDragMode && isDragHover ? 1.05 : 1,
                  }}
                >
                  {
                    categories?.find(
                      (category) => group.categoryId === category.id,
                    )?.categoryName
                  }
                </motion.p>

                <motion.div
                  className='flex items-center gap-2 text-muted-foreground'
                  animate={{
                    x: isDragMode && isDragHover ? 2 : 0,
                  }}
                >
                  <Users className='w-4 h-4' />
                  <span className='text-sm'>
                    {group?.memberCount} {t('members')}
                  </span>
                </motion.div>

                <motion.div
                  className='flex items-center gap-2 text-muted-foreground'
                  animate={{
                    x: isDragMode && isDragHover ? 2 : 0,
                  }}
                >
                  <CalendarDays className='w-4 h-4' />
                  <span className='text-sm'>
                    {group?.weeklyPostCount} {t('week_this_post')}
                  </span>
                </motion.div>
              </div>

              {/* Action Buttons - Disabled in drag mode */}
              <div
                className={isDragMode ? 'pointer-events-none opacity-50' : ''}
              >
                {status === 'NOT_JOIN' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleJoinGroup}
                      variant='outline'
                      className='w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200'
                    >
                      {t('join_group')}
                    </Button>
                  </motion.div>
                )}
                {status === 'PENDING' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleRemovePendingGroup}
                      variant='outline'
                      className='w-full hover:bg-destructive hover:text-destructive-foreground transition-all duration-200'
                    >
                      {t('cancel_join_group')}
                    </Button>
                  </motion.div>
                )}
                {status === 'JOINED' && (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleDetailGroup}
                      className='w-full bg-primary hover:bg-primary/90 transition-all duration-200'
                    >
                      {t('view_group')}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export const CardGroupsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className='overflow-hidden border-border'>
        <CardContent className='flex flex-col gap-2 p-0'>
          <Skeleton className='w-full aspect-[16/12] bg-muted' />
          <div className='flex gap-2 flex-col p-4'>
            <Skeleton className='w-3/5 h-8 bg-muted' />
            <Skeleton className='w-2/5 h-6 bg-muted' />
            <Skeleton className='w-2/5 h-6 bg-muted' />
            <Skeleton className='w-full h-10 bg-muted' />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
