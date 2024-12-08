import DialogAddMemberToGroup from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-member-to-group'
import EditGroupDialog from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-edit-group'
import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { groupsApi } from '@/services/groupsApi'
import { ChevronDown, LogOut, PencilLine, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function HeaderGroup({ group, members, t, isOwner }) {
    const router = useRouter();
    const deleteGroupMutation = groupsApi.mutation.useDeleteGroup()

    const handleDeleteGroup = () => {
        confirmDelete('', (result) => {
            if (result) {
                deleteGroupMutation.mutate({
                    groupId: group.id,
                }, {
                    onSuccess: () => {
                        router.push('/groups')
                    }
                })
            }
        });

    }

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{group.groupName} </h2>
                    {isOwner &&
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline transition-all"
                                    variant="ghost"
                                >
                                    <PencilLine className="h-4 w-4" />
                                    <span className="font-medium">Chỉnh sửa</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="start"
                                className=" border rounded-lg shadow-lg p-2 w-48"
                            >
                                <DropdownMenuLabel className="text-sm font-bold text-muted-foreground mb-2">
                                    Thao tác
                                </DropdownMenuLabel>
                                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md cursor-pointer " onSelect={(e) => e.preventDefault()}>
                                    <EditGroupDialog group={group} />
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex items-center gap-2 p-2 rounded-md cursor-pointer font-medium" onClick={handleDeleteGroup}>
                                    <Trash className="h-4 w-4" />
                                    Xóa nhóm
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    }
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
            <DialogConfirmDelete />
        </>
    )
}
