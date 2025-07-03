'use client'

import Loading from '@/components/loading'
import React, { useState } from 'react'
import { useTranslations } from 'use-intl'
import { CardInfoUser } from '@/app/[locale]/(root)/(profile)/user/[id]/(components)/card-info-user'
import { DialogEditProfile } from '@/app/[locale]/(root)/(profile)/user/[id]/(components)/dialog-edit-profile'
import { userApi } from '@/services/userApi'
import { motion } from 'framer-motion'

export default function InfoSection({ id }) {
  const t = useTranslations('Profile.User')
  const [openDialogEdit, setOpenDialogEdit] = useState(false)
  const { data: infoUser, isLoading } = userApi.query.useGetUserInfoById(id)

  if (isLoading) return <Loading />

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='w-full'
    >
      <CardInfoUser
        setOpenDialogEdit={setOpenDialogEdit}
        infoUser={infoUser}
        t={t}
      />
      <DialogEditProfile
        openDialogEdit={openDialogEdit}
        setOpenDialogEdit={setOpenDialogEdit}
        infoUser={infoUser}
        t={t}
      />
    </motion.div>
  )
}
