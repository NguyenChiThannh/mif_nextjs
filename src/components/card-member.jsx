'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateTimeAgo } from '@/lib/formatter'
import { groupsApi } from '@/services/groupsApi'
import { useMutation } from '@tanstack/react-query'
import { Check, EllipsisVertical, LogOut, Plus, User, X } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import React from 'react'

export default function CardMember({ member, groupId, type, isOwner, cardOwner }) {
    const t = useTranslations('Groups')
    const date = new Date(member?.joinedAt)
    const acceptInvitationMutation = groupsApi.mutation.useAcceptInvitation(groupId)
    const rejectInvationMutation = groupsApi.mutation.useRejectInvitation(groupId)
    const removeMemberFromGroupMutation = groupsApi.mutation.useRemoveMemberFromGroup(groupId)

    const handleAcceptInvitation = () => {
        acceptInvitationMutation.mutate({
            groupId,
            userId: member?.id
        })
    }

    const handleRejectInvitation = () => {
        rejectInvationMutation.mutate({
            groupId,
            userId: member?.id
        })
    }

    const handleRemoveMemberFromGroup = () => {
        removeMemberFromGroupMutation.mutate({
            groupId,
            userId: member?.id
        })
    }

    return (
        <div className="bg-background rounded-lg shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <Avatar>
                    <AvatarImage src={member?.avatar} alt={member?.displayName} />
                    <AvatarFallback className='uppercase'>{member?.displayName && member?.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <Link className='flex'
                        href={`/user/${member?.id}`}>
                        <h3 className="font-bold hover:underline">{member?.displayName}</h3>
                    </Link>
                    {type === 'invitation' ||
                        cardOwner ||
                        <p className="text-muted-foreground text-xs font-bold">{t("joined_a_while_ago")} {calculateTimeAgo(date)}</p>}
                </div>
            </div>
            {type === 'invitation'
                ?
                <div>
                    <Button variant="ghost" size="icon" onClick={() => handleRejectInvitation()}>
                        <X className='w-4 h-4 text-red-500' />
                        <span className="sr-only">Add to team</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleAcceptInvitation()}>
                        <Check className='w-4 h-4 text-green-500' />
                        <span className="sr-only">Add to team</span>
                    </Button>
                </div>
                :

                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <EllipsisVertical className='w-4 h-4' />
                            <span className="sr-only">Add to team</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link className='flex'
                                href={`/user/${member?.id}`}>
                                <User className="h-4 w-4 mr-2" />
                                {t("view_profile")}
                            </Link>
                        </DropdownMenuItem>
                        {
                            (!cardOwner && isOwner) ?
                                <DropdownMenuItem onClick={() => handleRemoveMemberFromGroup()}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    {t("leave_group")}
                                </DropdownMenuItem>
                                : ''
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            }
        </div>
    )
}

export const CardMemberSkeleton = () => {
    return (
        <div className='shadow-md w-full flex p-4 gap-2 rounded-lg'>
            <Skeleton className='w-12 h-12 rounded-full' />
            <div className='grid gap-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-40' />
            </div>
        </div>
    )
}
