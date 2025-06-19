'use client'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/formatter'
import {
  CalendarDays,
  Clock5,
  Eye,
  Lock,
  SquareLibrary,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { motion } from 'framer-motion'
import { categoryApi } from '@/services/movieCategoriesApi'

export default function AboutSection({ group, members, t }) {
  const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()

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
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="space-y-8"
    >
      {/* Information Group */}
      <motion.div variants={itemVariants}>
        <CardInformationGroup
          group={group}
          t={t}
          movieCategories={movieCategories}
        />
      </motion.div>

      {/* Member Group */}
      <motion.div variants={itemVariants}>
        <CardMemberGroup group={group} members={members} t={t} />
      </motion.div>

      {/* Activity Group */}
      <motion.div variants={itemVariants}>
        <CardActivityGroup group={group} t={t} />
      </motion.div>
    </motion.div>
  )
}

function CardInformationGroup({ group, t, movieCategories }) {
  return (
    <Card className="w-full max-w-3xl mx-auto border-border bg-card mt-6">
      <CardContent>
        <div className="grid gap-6 mt-6">
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-foreground flex items-center">
              {t('title_about')}
            </p>
          </div>
          <Separator className="bg-border" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {group.description}
          </p>
          <div className="space-y-4">
            {group.isPublic ? (
              <div className="space-y-2">
                <p className="flex gap-2 font-medium text-foreground items-center">
                  <Users className="h-4 w-4 text-primary" />
                  {t('public')}
                </p>
                <p className="text-sm text-muted-foreground pl-6">
                  &middot; {t('public_description')}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="flex gap-2 font-medium text-foreground items-center">
                  <Lock className="h-4 w-4 text-primary" />
                  {t('private')}
                </p>
                <p className="text-sm text-muted-foreground pl-6">
                  &middot; {t('private_description')}
                </p>
              </div>
            )}
            <div className="space-y-2">
              <p className="flex gap-2 font-medium text-foreground items-center">
                <Eye className="h-4 w-4 text-primary" />
                {t('display')}
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                &middot; {t('display_description')}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex gap-2 font-medium text-foreground items-center">
                <SquareLibrary className="h-4 w-4 text-primary" />
                {t('category')}
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                &middot;{' '}
                {movieCategories?.find(
                  (category) => category.id === group.categoryId,
                )?.categoryName || t('category_action')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CardMemberGroup({ group, members, t }) {
  return (
    <Card className="w-full max-w-3xl mx-auto border-border bg-card">
      <CardContent>
        <div className="grid gap-6 mt-6">
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-foreground">{t('members')}</p>
            <span className="text-sm text-muted-foreground">
              · {members?.numberOfElements}
            </span>
          </div>
          <Separator className="bg-border" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <GroupAvatar
              images={members?.content?.map((user) => user.avatar)}
              names={members?.content?.map((user) => user?.displayName)}
              size="w-12 h-12"
            />
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="secondary"
              className="w-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors duration-200"
            >
              <Link
                href={`/groups/${group?.id}/members`}
                className="w-full h-full"
              >
                {t('button_see_all_members')}
              </Link>
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}

function CardActivityGroup({ group, t }) {
  return (
    <Card className="w-full max-w-3xl mx-auto border-border bg-card">
      <CardContent>
        <div className="grid gap-6 mt-6">
          <p className="text-lg font-bold text-foreground">{t('activity')}</p>
          <Separator className="bg-border" />
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="flex gap-2 font-medium text-foreground items-center">
                <Clock5 className="h-4 w-4 text-primary" />
                {t('date_of_establishment')}
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                &middot; {t('established_on')}: {formatDate(group?.createdAt)}
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex gap-2 font-medium text-foreground items-center">
                <CalendarDays className="h-4 w-4 text-primary" />
                Bài viết
              </p>
              <p className="text-sm text-muted-foreground pl-6">
                &middot; {group?.weeklyPostCount || 0} {t('week_this_post')}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
