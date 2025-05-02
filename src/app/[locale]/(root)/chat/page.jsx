"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ChatList from "./(component)/chat-list";
import ChatWindow from "./(component)/chat-window";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const [selectedGroupId, setSelectedGroupId] = useState(
    searchParams.get("groupId")
  );

  const handleGroupSelect = (groupId) => {
    setSelectedGroupId(groupId);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-80 border-r">
        <ChatList onSelectGroup={handleGroupSelect} />
      </div>
      <div className="flex-1">
        {selectedGroupId ? (
          <ChatWindow groupId={selectedGroupId} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              Select a group to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
