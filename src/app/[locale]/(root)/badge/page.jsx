'use client'
import { Badge, Badges } from '@/app/[locale]/(root)/badge/badge'
import { Button } from '@/components/ui/button'
import { Home, Share2, Users, Users2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function BadgePage({ searchParams }) {
  const badgeLevel = searchParams?.level?.toUpperCase() || null
  const groupId = searchParams?.groupId || null
  const validLevels = ['PLATINUM', 'GOLD', 'SILVER', 'BRONZE']
  const isValidLevel = badgeLevel && validLevels.includes(badgeLevel)
  const t = useTranslations('Badge')

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

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={containerVariants}
      className='max-w-4xl mx-auto'
    >
      <main className='flex-1 p-4'>
        <motion.div variants={itemVariants} className='mt-2 mb-12'>
          <h1 className='text-3xl font-bold text-center text-foreground'>
            {t('title')}
          </h1>
          <p className='text-center mt-4 text-muted-foreground text-lg'>
            {t('title_description')}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          {isValidLevel ? (
            <div className='flex flex-col items-center mb-16'>
              <Badge level={badgeLevel} size='lg' />
            </div>
          ) : (
            <Badges />
          )}
        </motion.div>

        <motion.div
          variants={itemVariants}
          className='mt-16 space-y-6 text-center'
        >
          <h2 className='text-2xl font-semibold text-foreground'>
            {t('descrioption_1')}
          </h2>
          <p className='text-lg text-muted-foreground'>{t('descrioption_2')}</p>
          <div className='mt-6 space-y-4'>
            <p className='text-lg text-muted-foreground'>
              {t('descrioption_3')}
            </p>
            <p className='text-lg text-muted-foreground'>
              {t('descrioption_4')}
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className='mt-16 space-y-4'>
          <Link href={`/groups/${groupId}`}>
            <Button className='w-full py-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] bg-primary hover:bg-primary/90'>
              <Users className='w-5 h-5' />
              {t('go_to_groups_button')}
            </Button>
          </Link>
          <Link href={`/`}>
            <Button
              variant='outline'
              className='w-full py-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:bg-muted'
            >
              <Home className='w-5 h-5' />
              {t('go_to_back_home_button')}
            </Button>
          </Link>
        </motion.div>
      </main>
    </motion.div>
  )
}
