'use client'

import Image from "next/image"
import { useParams } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { useTranslations } from "next-intl"
import { groupsApi } from "@/services/groupsApi"
import FeedSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/feed-section"
import MembersSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/members-section"
import RulesSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/rules-section"
import AboutSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/about-section"
import Loading from "@/components/loading"
import SideBar from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/sidebar"
import HeaderGroup from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/header"
import { useIsGroupOwner } from "@/hooks/useIsGroupOwner"
import EventsSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/events-section"
import Background from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/background"

export default function Page() {
    const { groupId, section } = useParams()
    const t = useTranslations('Groups.NavbarGroup')

    const {
        isLoading: isLoadingGroup,
        data: group
    } = groupsApi.query.useGetGroupByGroupId(groupId)
    const {
        isLoading: isLoadingMember,
        data: members
    } = groupsApi.query.useGetAllMember(groupId)
    const {
        isLoading: isLoadingPendingInvitations,
        data: pendingInvitations
    } = groupsApi.query.useGetPendingInvitations(groupId)

    const isOwner = useIsGroupOwner(group)

    if (isLoadingGroup || isLoadingMember || isLoadingPendingInvitations) {
        return <Loading />
    }

    return (
        <div className="flex flex-col min-h-screen bg-background">
            {/* Background */}
            <Background group={group} isOwner={isOwner} />

            <div className="flex flex-1">
                {/* Sidebar */}
                <SideBar
                    groupId={groupId}
                    isOwner={isOwner}
                    pendingInvitations={pendingInvitations}
                    section={section}
                    t={t}
                />

                {/* Main Content */}
                <div className="flex-1 p-4 md:p-6">
                    <HeaderGroup
                        group={group}
                        members={members}
                        isOwner={isOwner}
                        section={section}
                        t={t}
                    />

                    <Separator />

                    {/* Dynamic Sections */}
                    {(!section || section === 'feed') &&
                        <FeedSection group={group} isOwner={isOwner} />}
                    {section === 'members' && (
                        <MembersSection
                            members={members}
                            group={group}
                            pendingInvitations={pendingInvitations}
                            isOwner={isOwner}
                        />
                    )}
                    {section === 'rules' && <RulesSection isOwner={isOwner} group={group} />}
                    {section === 'about' && <AboutSection group={group} members={members} />}
                    {section === 'events' && <EventsSection />}
                </div>
            </div>
        </div>
    )
}