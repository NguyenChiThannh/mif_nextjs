import CardActorHorizontal from '@/components/card-actor-horizontal'
import { motion } from 'framer-motion'
import React from 'react'

export function SectionActorMovie({ actors }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true }}
      className='grid grid-cols-2 gap-6'
    >
      {actors.map((actor, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3 }}
        >
          <CardActorHorizontal actor={actor} />
        </motion.div>
      ))}
    </motion.div>
  )
}
