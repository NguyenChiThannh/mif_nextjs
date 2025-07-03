'use client'

import CardMember from '@/components/card-member'
import { Card, CardContent } from '@/components/ui/card'
import { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
export default function MembersSection({
  members,
  group,
  pendingInvitations,
  isOwner,
  t,
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Render pending invitations section
  const renderPendingInvitations = useCallback(() => {
    if (!isOwner || !pendingInvitations?.numberOfElements) return null

    return (
      <motion.div variants={itemVariants} className='mb-8'>
        <Card className='w-full max-w-3xl mx-auto border-border bg-card'>
          <CardContent>
            <div className='grid gap-6 mt-6'>
              <div className='flex items-center gap-2'>
                <p className='text-lg font-bold text-foreground'>
                  {t('request_to_join_group')}
                </p>
                <span className='flex items-center justify-center bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full'>
                  {pendingInvitations.numberOfElements}
                </span>
              </div>
              <div className='space-y-4'>
                {pendingInvitations?.content?.map((invitation) => (
                  <motion.div
                    key={invitation.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CardMember
                      groupId={group?.id}
                      member={invitation}
                      type='invitation'
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }, [isOwner, pendingInvitations, group?.id])

  // Render group owner section
  const renderOwnerSection = useMemo(
    () => (
      <motion.div variants={itemVariants} className='space-y-4 mt-4'>
        <p className='text-lg font-bold text-foreground'>{t('founder')}</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardMember member={group?.owner} cardOwner={true} />
        </motion.div>
      </motion.div>
    ),
    [group?.owner],
  )

  // Render members section
  const renderMembersSection = useMemo(
    () => (
      <motion.div variants={itemVariants} className='space-y-4 mt-8'>
        <p className='text-lg font-bold text-foreground'>
          {t('recently_joined')}
        </p>
        <div className='grid grid-cols-1 gap-4'>
          {members?.content?.map((member, index) => {
            if (member.id !== group?.owner.id) {
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <CardMember
                    member={member}
                    groupId={group?.id}
                    isOwner={isOwner}
                  />
                </motion.div>
              )
            }
            return null
          })}
        </div>
      </motion.div>
    ),
    [members?.content, group?.id, group?.owner.id, isOwner],
  )

  // Render header section
  const renderHeader = useMemo(
    () => (
      <motion.div variants={itemVariants} className='mt-6'>
        <div className='flex items-center gap-2'>
          <p className='text-lg font-bold text-foreground'>{t('members')}</p>
          <span className='text-sm text-muted-foreground'>
            · {group?.memberCount}
          </span>
        </div>
      </motion.div>
    ),
    [group?.memberCount],
  )

  return (
    <motion.div
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      variants={containerVariants}
      className='space-y-8 mt-6'
    >
      {renderPendingInvitations()}

      <motion.div variants={itemVariants}>
        <Card className='w-full max-w-3xl mx-auto border-border bg-card'>
          <CardContent>
            {renderHeader}
            {renderOwnerSection}
            {renderMembersSection}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
