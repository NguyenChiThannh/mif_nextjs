import DialogAddMemberToGroup from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-member-to-group'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '@radix-ui/react-dropdown-menu'
import { ChevronDown, LogOut, Search } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function HeaderGroup({ group, members, t, isOwner }) {
    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{group.groupName} </h2>
                </div>
            </div>
            <div className="mb-4 flex items-center justify-between">
                <Link className="flex items-center gap-2"
                    href={`/groups/${group.id}/members`}
                >
                    <GroupAvatar images={members.content.map((user) => user.avatar)} names={members.content.map((user) => user.displayName)} size="w-8 h-8" />
                    <div className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">{group.memberCount} {t('members')}</div>
                </Link>
                <div className="flex items-center gap-2">
                    {/* <div className="hidden md:block relative">
                        <Input type="text" placeholder="Tìm kiếm..." className="pr-10 h-8" />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5" />
                    </div> */}
                    {
                        isOwner &&
                        <DialogAddMemberToGroup groupId={group.id} />
                    }
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <span className="sr-only sm:not-sr-only">Đã tham gia</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Tham gia</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {
                                !isOwner &&
                                <DropdownMenuItem>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Rời nhóm
                                </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    )
}
