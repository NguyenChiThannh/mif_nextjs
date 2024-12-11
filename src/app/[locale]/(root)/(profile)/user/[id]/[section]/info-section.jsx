'use client'

import Loading from '@/components/loading'
import React, { useState } from 'react'
import { useTranslations } from 'use-intl'
import { CardInfoUser } from '@/app/[locale]/(root)/(profile)/user/[id]/(components)/card-info-user'
import { DialogEditProfile } from '@/app/[locale]/(root)/(profile)/user/[id]/(components)/dialog-edit-profile'
import { userApi } from '@/services/userApi'

export default function InfoSection({ id }) {
    const t = useTranslations('Profile.User')
    const [openDialogEdit, setOpenDialogEdit] = useState(false)
    const { data: infoUser, isLoading } = userApi.query.useGetUserInfoById(id)

    if (isLoading) return <Loading />

    return (
        <>
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
        </>
    )
}