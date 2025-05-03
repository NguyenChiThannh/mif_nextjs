"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ChatList from "./(component)/chat-list";
import ChatWindow from "./(component)/chat-window";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chatApi } from "@/services/chatApi";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [selectedGroupId, setSelectedGroupId] = useState(
    searchParams.get("groupId")
  );
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupAvatar, setSelectedGroupAvatar] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  // Lấy danh sách nhóm chat
  const { data: groupsData } = chatApi.query.useGetGroupChats();

  // Cập nhật tên nhóm khi groupId thay đổi hoặc dữ liệu nhóm được tải
  useEffect(() => {
    if (selectedGroupId && groupsData?.pages) {
      // Tìm nhóm trong danh sách
      const allGroups = groupsData.pages.flatMap(page => page.content || []);
      const selectedGroup = allGroups.find(group => group.groupId === selectedGroupId);

      if (selectedGroup) {
        setSelectedGroupName(selectedGroup.groupName);
        setSelectedGroupAvatar(selectedGroup.avatarUrl || "");
      }
    }
  }, [selectedGroupId, groupsData]);

  const handleGroupSelect = (groupId, groupName, groupAvatar) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setSelectedGroupAvatar(groupAvatar || "");
    // Hide sidebar on mobile after group selection
    setShowMobileSidebar(false);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-background overflow-hidden p-2 md:p-4">
      <div className="flex w-full max-w-7xl mx-auto gap-4 h-full">
        {/* Chat sidebar - desktop version */}
        <div
          className={cn(
            // Desktop: always visible as normal sidebar
            "hidden md:block w-80 border-r border-border overflow-hidden rounded-l-lg shadow-md bg-card/90 backdrop-blur-sm",
            // Mobile: absolute positioned when visible, hidden otherwise
            showMobileSidebar && "block absolute z-20 w-full md:w-80 h-[calc(100vh-4rem-16px)] left-2 top-2 rounded-lg shadow-xl border border-border"
          )}
        >
          <div className="h-full overflow-y-auto">
            <ChatList onSelectGroup={handleGroupSelect} />
          </div>
        </div>

        {/* Chat main window */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Mobile toolbar - only shown when a chat is selected */}
          {selectedGroupId && (
            <div className="md:hidden border-b flex items-center p-2 shrink-0 bg-card shadow-sm rounded-t-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowMobileSidebar(true)}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Quay lại danh sách chat</span>
              </Button>
            </div>
          )}

          {/* Mobile: Show chat list if no group selected */}
          {!selectedGroupId && !showMobileSidebar ? (
            <div className="block md:hidden h-full overflow-hidden rounded-lg shadow-md border border-border bg-card/90 backdrop-blur-sm">
              <ChatList onSelectGroup={handleGroupSelect} />
            </div>
          ) : (
            // Show chat window if a group is selected
            <div className="flex-1 overflow-hidden">
              {selectedGroupId ? (
                <ChatWindow
                  groupId={selectedGroupId}
                  groupName={selectedGroupName}
                  groupAvatar={selectedGroupAvatar}
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-muted/20 rounded-lg shadow-md border border-border">
                  <div className="text-center text-muted-foreground max-w-md p-6">
                    <h3 className="text-lg font-medium mb-2">Chưa chọn cuộc trò chuyện</h3>
                    <p>Chọn một cuộc trò chuyện từ thanh bên để bắt đầu</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
