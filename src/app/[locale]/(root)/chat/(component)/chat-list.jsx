"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { formatDateOrTimeAgo } from "@/lib/formatter";
import { chatApi } from "@/services/chatApi";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ChatList({ onSelectGroup }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGroupId = searchParams.get("groupId");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: groupPages,
    fetchNextPage,
    hasNextPage = false,
    isFetchingNextPage,
    isLoading: isLoadingGroups,
  } = chatApi.query.useGetGroupChats();

  const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

  const handleGroupSelect = (groupId, groupName, groupAvatar) => {
    if (groupId === activeGroupId) return; // Prevent reload if same group
    router.push(`/chat?groupId=${groupId}`);
    if (onSelectGroup) {
      onSelectGroup(groupId, groupName, groupAvatar);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search groups..."
            className="pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoadingGroups ? (
          <div className="text-center text-muted-foreground">
            Loading groups...
          </div>
        ) : groupPages?.pages?.[0]?.content?.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No groups found
          </div>
        ) : (
          <>
            {groupPages?.pages
              ?.flatMap((page) => page.content || [])
              .map((group) => (
                <div
                  key={group.groupId}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer",
                    activeGroupId === group.groupId && "bg-muted"
                  )}
                  onClick={() => handleGroupSelect(group.groupId, group.groupName, group.avatarUrl)}
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={group.avatarUrl} alt={group.groupName} />
                    <AvatarFallback>{group.groupName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">
                        {group.groupName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDateOrTimeAgo(group.updateTime)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {group.newestMessage}
                    </p>
                  </div>
                </div>
              ))}
            <div ref={observerElem} className="h-4" />
            {isFetchingNextPage && (
              <div className="text-center text-muted-foreground">
                Loading more groups...
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
