'use client'
import { Badge, Badges } from "@/app/[locale]/(root)/badge/badge"
import { Button } from "@/components/ui/button"
import { Home, Share2, Users, Users2 } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export default function BadgePage({ searchParams }) {
  const badgeLevel = searchParams?.level?.toUpperCase() || null
  const groupId = searchParams?.groupId || null
  const validLevels = ["PLATINUM", "GOLD", "SILVER", "BRONZE"]
  const isValidLevel = badgeLevel && validLevels.includes(badgeLevel)
  const t = useTranslations("Badge")

  return (
    <div className="max-w-4xl mx-auto">
      <main className="flex-1 p-4">
        <div className="mt-2 mb-8">
          <h1 className="text-2xl font-bold text-center">{t('title')}</h1>
          <p className="text-center  mt-2">
            {t('title_description')}
          </p>
        </div>

        {isValidLevel ? (
          <div className="flex flex-col items-center mb-12">
            <Badge level={badgeLevel} size="lg" />
          </div>
        ) : (
          <Badges />
        )}

        <div className="mt-12 space-y-4 text-center text-muted-foreground">
          <h2 className="text-xl font-semibold text-muted-foreground">{t('descrioption_1')}</h2>
          <p className="text-base">{t('descrioption_2')}</p>
          <div className="mt-4">
            <p className="text-base"> {t('descrioption_3')} </p>
            <p className="text-base"> {t('descrioption_4')} </p>
          </div>
        </div>

        <div className="mt-10">
          <div className="mt-4">
            <Link href={`/groups/${groupId}`}>
              <Button className="w-full py-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Users className="w-5 h-5" />
                {t('go_to_groups_button')}
              </Button>
            </Link>
          </div>
          <div className="mt-4">
            <Link href={`/`}>
              <Button variant="outline" className="w-full py-6 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                <Home className="w-5 h-5" />
                {t('go_to_back_home_button')}
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
