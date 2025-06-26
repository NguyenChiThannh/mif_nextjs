'use client'

import { useTranslations } from 'next-intl'
import { MainSection } from '@/app/[locale]/(root)/home/(sections)/main-section'
import { ContentSection } from '@/app/[locale]/(root)/home/(sections)/content-section'
import { SidebarSection } from '@/app/[locale]/(root)/home/(sections)/sidebar-section'
import { motion } from 'framer-motion'

export default function HomePage() {
  const t = useTranslations('Home')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.div
      className='w-full min-h-screen bg-background'
      initial='hidden'
      animate='visible'
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <MainSection t={t} />
      </motion.div>

      <motion.div
        className='grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pt-8 md:pt-12 lg:pt-16 px-4 md:px-6 lg:px-8'
        variants={itemVariants}
      >
        <motion.div className='md:col-span-2' variants={itemVariants}>
          <ContentSection t={t} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <SidebarSection t={t} />
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
