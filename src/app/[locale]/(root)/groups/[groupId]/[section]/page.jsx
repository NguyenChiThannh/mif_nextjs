'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { Book, ChartLine, ChevronDown, FilePen, Info, LogOut, MessageCircle, Search, Users } from "lucide-react"
import GroupAvatar from "@/components/group-avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { groupsApi } from "@/services/groupsApi"
import { useParams } from "next/navigation"
import FeedSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/feedSection"
import MembersSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/membersSection"
import RulesSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/rulesSection"
import AboutSection from "@/app/[locale]/(root)/groups/[groupId]/[section]/aboutSection"
import DialogAddMemberToGroup from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-member-to-group"
import { useIsGroupOwner } from "@/hooks/useIsGroupOwner"
import { navGroupConfig } from "@/lib/navigationConfig"
import { useTranslations } from "next-intl"
import Loading from "@/components/loading"
import HeaderGroup from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/header"
import SideBar from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/sidebar"

export default function Page() {
    const { groupId, section } = useParams();
    console.log('🚀 ~ Page ~ section:', section)

    const { isLoading: isLoadingGroup, data: group } = groupsApi.query.useGetGroupByGroupId(groupId)
    const { isLoading: isLoadingMember, data: members } = groupsApi.query.useGetAllMember(groupId)
    const { isLoading: isLoadingPendingInvitations, data: pendingInvitations } = groupsApi.query.useGetPendingInvitations(groupId, 100)

    const isOwner = useIsGroupOwner(group);

    const t = useTranslations('Groups.NavbarGroup')

    if (isLoadingGroup || isLoadingMember || isLoadingPendingInvitations) return <Loading />

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            {/* Background */}
            <Image
                src={group?.avatarUrl || "/group_default.jpg"}
                alt="Movie"
                width={2000}
                height={200}
                className="rounded-lg object-cover h-[200] aspect-ratio-[26/9]"
            />
            <div className="flex flex-1">

                <SideBar
                    groupId={groupId}
                    isOwner={isOwner}
                    pendingInvitations={pendingInvitations}
                    section={section}
                    t={t} />

                <div className="flex-1 p-4 md:p-6">

                    <HeaderGroup
                        group={group}
                        members={members}
                        isOwner={isOwner}
                        section={section}
                        t={t} />

                    <Separator />

                    {/* Content */}
                    {(!section || section === 'feed') && <FeedSection group={group} isOwner={isOwner} />}
                    {section === 'members' && <MembersSection members={members} group={group} pendingInvitations={pendingInvitations} isOwner={isOwner} />}
                    {section === 'rules' && <RulesSection isOwner={isOwner} group={group} />}
                    {section === 'about' && <AboutSection group={group} members={members} isOwner={isOwner} />}
                </div>
            </div>
        </div >
    )
}