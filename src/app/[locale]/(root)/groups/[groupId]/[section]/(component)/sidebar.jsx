import { navGroupConfig } from '@/lib/navigationConfig'
import { InfoIcon, OctagonAlert, Users } from 'lucide-react'
import Link from 'next/link'
import { GROUP_STATUS } from '@/hooks/useGroupStatus'
import { useTranslations } from 'next-intl'
import { chatApi } from '@/services/chatApi'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SideBar({
  isOwner,
  groupId,
  pendingInvitations,
  section,
  status,
  group,
}) {
  const t = useTranslations('Groups.NavbarGroup')
  const joinGroupChatMutation = chatApi.mutation.useJoinGroupChat()
  const router = useRouter()

  const getNavItems = () =>
    status === GROUP_STATUS.JOINED || isOwner
      ? navGroupConfig.member(t)
      : group.isPublic
        ? navGroupConfig.public_group(t)
        : navGroupConfig.always_visible(t)

  const handleChatClick = (e, href) => {
    e.preventDefault()
    joinGroupChatMutation.mutate(groupId, {
      onSuccess: () => {
        router.push(href)
      },
    })
  }

  const containerVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='h-full border-r border-border bg-background'
    >
      <div className='flex flex-col gap-2 p-4'>
        {getNavItems().map((item, index) => {
          const { icon: Icon } = item
          const href = item.href(groupId)
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={href}
                prefetch={false}
                onClick={(e) =>
                  item.title === t('message')
                    ? handleChatClick(e, href)
                    : undefined
                }
                className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200
                                    ${
                                      item.active(section)
                                        ? 'bg-accent text-primary shadow-sm'
                                        : 'text-muted-foreground hover:bg-accent/50 hover:text-primary'
                                    }`}
              >
                <Icon className='h-4 w-4' />
                {item.title}
              </Link>
            </motion.div>
          )
        })}

        {(status === GROUP_STATUS.JOINED || isOwner || group.isPublic) && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/groups/${groupId}/members`}
              prefetch={false}
              className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200
                                ${
                                  section === 'members'
                                    ? 'bg-accent text-primary shadow-sm'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-primary'
                                }`}
            >
              <Users className='h-4 w-4' />
              {t('members')}
              {isOwner && pendingInvitations?.numberOfElements > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full text-xs font-medium'
                >
                  {pendingInvitations.numberOfElements}
                </motion.div>
              )}
            </Link>
          </motion.div>
        )}

        {isOwner && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/groups/${groupId}/report`}
              prefetch={false}
              className={`flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200
                                ${
                                  section === 'report'
                                    ? 'bg-accent text-primary shadow-sm'
                                    : 'text-muted-foreground hover:bg-accent/50 hover:text-primary'
                                }`}
            >
              <OctagonAlert className='h-4 w-4' />
              {t('report')}
              {/* {isOwner && pendingInvitations?.numberOfElements > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full text-xs font-medium'
                >
                  {pendingInvitations.numberOfElements}
                </motion.div>
              )} */}
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
