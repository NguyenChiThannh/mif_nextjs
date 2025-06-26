'use client'

import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { useTranslations } from 'next-intl'
import { groupsApi } from '@/services/groupsApi'
import Loading from '@/components/loading'
import SideBar from './(component)/sidebar'
import HeaderGroup from './(component)/header-group'
import { useIsGroupOwner } from '@/hooks/useIsGroupOwner'
import AboutSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/about-section'
import FeedSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/feed-section'
import MembersSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/members-section'
import RulesSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/rules-section'
import Background from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/background'
import { useGroupStatus } from '@/hooks/useGroupStatus'
import { canCreatePost, checkSectionAccess } from '@/middleware/groupAccess'
import EventsSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/events-section'
import ReportSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/report-section'
import MembersFeaturedSection from '@/app/[locale]/(root)/groups/[groupId]/[section]/members-featured-section'

export default function GroupPage() {
  const { groupId, section } = useParams()
  const t = useTranslations('Groups')

  const { data: group, isLoading: isLoadingGroup } =
    groupsApi.query.useGetGroupByGroupId(groupId)
  const { data: members, isLoading: isLoadingMember } =
    groupsApi.query.useGetAllMember(groupId)
  const { data: pendingInvitations, isLoading: isLoadingPendingInvitations } =
    groupsApi.query.useGetPendingInvitations(groupId)
  const { data: activeMembers, isLoading: isLoadingActiveMembers } =
    groupsApi.query.useGetTopActiveUsers(groupId)

  const { status } = useGroupStatus(group?.id)
  const isOwner = useIsGroupOwner(group)

  if (
    isLoadingGroup ||
    isLoadingMember ||
    isLoadingPendingInvitations ||
    isLoadingActiveMembers
  ) {
    return <Loading />
  }

  const renderSection = () => {
    const hasAccess = checkSectionAccess(
      section,
      status,
      isOwner,
      group.isPublic,
    )
    if (!hasAccess) {
      return null
    }

    switch (section) {
      case undefined:
        return (
          <FeedSection
            activeMembers={activeMembers}
            t={t}
            group={group}
            isOwner={isOwner}
            canCreate={canCreatePost(status, isOwner)}
          />
        )
      case 'about':
        return <AboutSection group={group} members={members} t={t} />
      case 'feed':
        return (
          <FeedSection
            activeMembers={activeMembers}
            t={t}
            group={group}
            isOwner={isOwner}
            canCreate={canCreatePost(status, isOwner)}
          />
        )
      case 'members':
        return (
          <MembersSection
            members={members}
            group={group}
            pendingInvitations={pendingInvitations}
            isOwner={isOwner}
            t={t}
          />
        )
      case 'events':
        return <EventsSection />
      case 'rules':
        return <RulesSection isOwner={isOwner} group={group} t={t} />
      case 'report':
        return <ReportSection groupId={groupId} />
      default:
        return (
          <FeedSection
            activeMembers={activeMembers}
            t={t}
            group={group}
            isOwner={isOwner}
            canCreate={canCreatePost(status, isOwner)}
          />
        )
    }
  }

  return (
    <div className='flex flex-col min-h-screen bg-background'>
      <Background group={group} isOwner={isOwner} />
      <div className='flex flex-1'>
        <SideBar
          groupId={groupId}
          isOwner={isOwner}
          pendingInvitations={pendingInvitations}
          section={section}
          status={status}
          group={group}
        />
        <div className='flex-1 p-4 md:p-6'>
          <HeaderGroup
            group={group}
            members={members}
            isOwner={isOwner}
            section={section}
            t={t}
          />
          <Separator className='mt-4' />
          {renderSection()}
        </div>
      </div>
    </div>
  )
}
