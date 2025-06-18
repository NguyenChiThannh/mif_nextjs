import DialogConfirmDelete, {
  confirmDelete,
} from "@/components/dialog-confirm-delete";
import GroupAvatar from "@/components/group-avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { groupsApi } from "@/services/groupsApi";
import {
  LogOut,
  PencilLine,
  Trash,
  UserPlus,
  GripVertical,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGroupStatus, GROUP_STATUS } from "@/hooks/useGroupStatus";
import EditGroupDialog from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-edit-group";
import DialogAddMemberToGroup from "@/app/[locale]/(root)/groups/[groupId]/[section]/(component)/dialog-add-member-to-group";
import useUserId from "@/hooks/useUserId";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import useDragAndDrop from "@/hooks/useDragAndDrop";

export default function HeaderGroup({ group, members, t, isOwner }) {
  const router = useRouter();
  const deleteGroupMutation = groupsApi.mutation.useDeleteGroup();
  const [openDialogEditGroup, setOpenDialogEditGroup] = useState(false);
  const [isDragMode, setIsDragMode] = useState(false);
  const [isDragHover, setIsDragHover] = useState(false);
  const userId = useUserId();
  const {
    status,
    handleJoinGroup,
    handleRemovePendingGroup,
    handleLeaveGroup,
  } = useGroupStatus(group.id, userId);
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  const handleDeleteGroup = () => {
    confirmDelete("", (result) => {
      if (result) {
        deleteGroupMutation.mutate(
          { groupId: group.id },
          { onSuccess: () => router.push("/groups") }
        );
      }
    });
  };

  const handleEnableDragMode = (e) => {
    e.stopPropagation();
    setIsDragMode(true);
  };

  const handleDisableDragMode = () => {
    setIsDragMode(false);
    setIsDragHover(false);
  };

  const handleGroupDragStart = (e) => {
    if (!isDragMode) {
      e.preventDefault();
      return;
    }

    const dragData = {
      type: "group",
      id: group.id,
      name: group.groupName,
      avatar: group.avatarUrl,
    };
    handleDragStart(e, dragData);
    setIsDragHover(true);
  };

  const handleGroupDragEnd = () => {
    handleDragEnd();
    setIsDragHover(false);
    // Auto disable drag mode after drag
    setTimeout(() => setIsDragMode(false), 1000);
  };

    const renderGroupActions = () => {
        if (isOwner) {
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-primary hover:bg-muted/50 transition-all duration-200">
                            <PencilLine className="h-4 w-4" />
                            <span className="font-medium">Chỉnh sửa</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-background border-border">
                        <DropdownMenuLabel className="text-sm font-bold text-muted-foreground mb-2">Thao tác</DropdownMenuLabel>
                        {/* <DropdownMenuItem 
                            onClick={() => setOpenDialogEditGroup(true)}
                            className="hover:bg-muted transition-colors duration-200"
                        >
                            <PencilLine className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                        </DropdownMenuItem> */}
                        <DropdownMenuItem
                            onClick={handleDeleteGroup}
                            className="flex items-center gap-2 p-2 rounded-md cursor-pointer font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
                        >
                            <Trash className="h-4 w-4" />
                            Xóa nhóm
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    <EditGroupDialog group={group} open={openDialogEditGroup} setOpen={setOpenDialogEditGroup}/>
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
        <Button
          size="sm"
          onClick={handleJoinGroup}
          className="h-8 gap-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
        >
          <UserPlus className="h-4 w-4 mr-1" />
          Tham gia
        </Button>
      );
    }

    if (status === GROUP_STATUS.PENDING) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleRemovePendingGroup}
          className="h-8 border-border hover:bg-muted transition-colors duration-200"
        >
          Đang chờ duyệt
        </Button>
      );
    }

    if (status === GROUP_STATUS.JOINED && !isOwner) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleLeaveGroup}
          className="h-8 gap-1 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive transition-colors duration-200"
        >
          <LogOut className="h-4 w-4 mr-1" />
          Rời nhóm
        </Button>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-2 relative">
          {/* Drag Mode Toggle Button - Always visible */}
          <motion.div
            className="relative"
            initial={{ opacity: 0.75 }}
            whileHover={{ scale: 1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={
                isDragMode ? handleDisableDragMode : handleEnableDragMode
              }
              className={`h-10 w-10 rounded-full transition-all duration-200 ${
                isDragMode
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-lg border border-white/10"
              }`}
            >
              <GripVertical className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              isDragMode
                ? isDragHover
                  ? "bg-primary/10 border-2 border-primary/30 shadow-lg cursor-grabbing"
                  : "bg-primary/5 border-2 border-primary/20 cursor-grab"
                : "border-2 border-transparent"
            }`}
            draggable={isDragMode}
            onDragStart={handleGroupDragStart}
            onDragEnd={handleGroupDragEnd}
            whileHover={!isDragMode ? { scale: 1.02 } : {}}
            whileTap={!isDragMode ? { scale: 0.98 } : {}}
            animate={{
              boxShadow:
                isDragMode && isDragHover
                  ? "0 8px 25px rgba(var(--primary), 0.15)"
                  : "0 0px 0px rgba(0,0,0,0)",
              scale: isDragMode && isDragHover ? 1.05 : 1,
            }}
          >
            <motion.h2
              className={`text-xl font-bold transition-colors duration-200 select-none ${
                isDragMode && isDragHover ? "text-primary" : "text-foreground"
              }`}
            >
              {group.groupName}
            </motion.h2>

            {/* Drag hint */}
            <AnimatePresence>
              {isDragMode && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full"
                >
                  Kéo để mention
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {!isDragMode && renderGroupActions()}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between"
      >
        <Link
          className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
          href={`/groups/${group.id}/members`}
        >
          <GroupAvatar
            images={members.content.map((user) => user.avatar)}
            names={members.content.map((user) => user.displayName)}
            size="w-8 h-8"
          />
          <div className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
            {group.memberCount} {t("members")}
          </div>
        </Link>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2"
        >
          {!isDragMode && renderMembershipActions()}
        </motion.div>
      </motion.div>
      <DialogConfirmDelete />
    </motion.div>
  );
}
