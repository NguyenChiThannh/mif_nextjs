'use client'
import React, { useEffect, useState } from 'react'
import { categoryApi } from '@/services/movieCategoriesApi'
import useUserId from '@/hooks/useUserId'
import { SectionGroup } from '@/app/[locale]/(root)/groups/(sections)/section-group'
import SectionExploreGroup from '@/app/[locale]/(root)/groups/(sections)/section-explore-group'
import { useTranslations } from 'next-intl'

export default function Groups() {
    const t = useTranslations('Groups')
    const userId = useUserId()
    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()

    return (
        <div className="flex flex-col w-full min-h-screen">
            <SectionGroup movieCategories={movieCategories} userId={userId} t={t}/>
            <SectionExploreGroup movieCategories={movieCategories} t={t} />
        </div>
    );
}


