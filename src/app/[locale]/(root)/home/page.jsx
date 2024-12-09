'use client'

import { useTranslations } from "next-intl"
import { MainSection } from "@/app/[locale]/(root)/home/(sections)/main-section"
import { ContentSection } from "@/app/[locale]/(root)/home/(sections)/content-section"
import { SidebarSection } from "@/app/[locale]/(root)/home/(sections)/sidebar-section"

export default function Home() {
  const t = useTranslations('Home')

  return (
    <div className="w-full">
      <MainSection t={t} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-10 pt-8 md:pt-12 lg:pt-16">
        <ContentSection t={t} />
        <SidebarSection t={t} />
      </div>
    </div>
  )
}