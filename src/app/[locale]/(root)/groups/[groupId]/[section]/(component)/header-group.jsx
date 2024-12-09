import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete'
import GroupAvatar from '@/components/group-avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { groupsApi } from '@/services/groupsApi'
import { LogOut, PencilLine, Trash, UserPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useGroupStatus, GROUP_STATUS } from '@/hooks/useGroupStatus'
import EditGroupDialog from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-edit-group'
import DialogAddMemberToGroup from '@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-member-to-group'
import useUserId from '@/hooks/useUserId'

export default function HeaderGroup({ group, members, t, isOwner }) {
    const router = useRouter();
    const deleteGroupMutation = groupsApi.mutation.useDeleteGroup();
    const userId = useUserId()
    const { status, handleJoinGroup, handleRemovePendingGroup, handleRemoveGroup } = useGroupStatus(group.id, userId);

    const handleDeleteGroup = () => {
        confirmDelete('', (result) => {
            if (result) {
                deleteGroupMutation.mutate(
                    { groupId: group.id },
                    { onSuccess: () => router.push('/groups') }
                );
            }
        });
    };

    const renderGroupActions = () => {
        if (isOwner) {
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:underline transition-all">
                            <PencilLine className="h-4 w-4" />
                            <span className="font-medium">Chỉnh sửa</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="border rounded-lg shadow-lg p-2 w-48">
                        <DropdownMenuLabel className="text-sm font-bold text-muted-foreground mb-2">Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <EditGroupDialog group={group} />
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDeleteGroup} className="flex items-center gap-2 p-2 rounded-md cursor-pointer font-medium">
                            <Trash className="h-4 w-4" />
                            Xóa nhóm
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
        return null;
    };

    const renderMembershipActions = () => {
        if (isOwner) {
            return <DialogAddMemberToGroup groupId={group.id} />;
        }

        if (status === GROUP_STATUS.NOT_JOIN) {
            return (
                <Button size="sm" onClick={handleJoinGroup} className="h-8 gap-1">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Tham gia
                </Button>
            );
        }

        if (status === GROUP_STATUS.PENDING) {
            return (
                <Button variant="outline" size="sm" onClick={handleRemovePendingGroup} className="h-8">
                    Đang chờ duyệt
                </Button>
            );
        }

        if (status === GROUP_STATUS.JOINED && !isOwner) {
            return (
                <Button variant="outline" size="sm" onClick={handleRemoveGroup} className="h-8 gap-1">
                    <LogOut className="h-4 w-4 mr-1" />
                    Rời nhóm
                </Button>
            );
        }

        return null;
    };

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">{group.groupName}</h2>
                    {renderGroupActions()}
                </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
                <Link className="flex items-center gap-2" href={`/groups/${group.id}/members`}>
                    <GroupAvatar
                        images={members.content.map(user => user.avatar)}
                        names={members.content.map(user => user.displayName)}
                        size="w-8 h-8"
                    />
                    <div className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                        {group.memberCount} {t('members')}
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    {renderMembershipActions()}
                </div>
            </div>
            <DialogConfirmDelete />
        </>
    );
}
