'use client';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ChatListItem = ({ name, lastMessage, timeAgo, avatarSrc, avatarFallback, onClick }) => {
    return (
        <div
            className="flex items-center max-h-20 gap-4 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
            onClick={onClick}
        >
            <Avatar className="border w-10 h-10">
                <AvatarImage src={avatarSrc || "/placeholder-user.jpg"} alt={`${name}'s Image`} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 flex-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{lastMessage}</p>
                <p className="text-xs text-muted-foreground">&middot; {timeAgo}</p>
            </div>
        </div>
    );
}

export default ChatListItem;
