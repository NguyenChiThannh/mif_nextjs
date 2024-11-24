'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { AlignJustify, AtSign, AtSignIcon, Bell, BellIcon, EyeOff, EyeOffIcon, Search, Send, Settings } from "lucide-react"
import { useState } from "react"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import MessageReceived from "@/app/[locale]/(root)/chat/(component)/message-received"
import MessageSent from "@/app/[locale]/(root)/chat/(component)/message-sent"
import ChatListItem from "@/app/[locale]/(root)/chat/(component)/chat-list-item"
import NotificationItemInChat from "@/app/[locale]/(root)/chat/(component)/notification-item"

const Chat = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const toggleNotifications = () => setShowNotifications(prev => !prev);

    const chatList = [
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
        { name: "Alex Johnson", lastMessage: "Just finished a great book!", timeAgo: "45m", avatar: "/placeholder-user.jpg" },
    ];

    return (
        <div className={`grid border max-w-full mb-12 h-[600px] rounded-lg transition-all duration-300 grid-cols-1 grid-rows-[auto_1fr_auto] ${showNotifications ? 'md:grid-cols-[300px_1fr_300px]' : 'md:grid-cols-[300px_1fr]'}`}>
            <div className="h-[600px] bg-muted/20 p-4 border-r md:border-b md:col-span-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="font-base text-base">Chats</div>
                </div>
                <div className="hidden md:block relative mb-4">
                    <Input type="text" placeholder="Tìm kiếm..." className="pr-10 h-8" />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                <div className="grid gap-2 h-full pb-3">
                    {chatList.map((chat, index) => (
                        <ChatListItem
                            key={index}
                            name={chat.name}
                            lastMessage={chat.lastMessage}
                            timeAgo={chat.timeAgo}
                            avatarSrc={chat.avatar}
                            avatarFallback={chat.name.charAt(0)}
                            onClick={() => console.log(`Clicked on ${chat.name}`)}
                        />
                    ))}
                </div>
            </div>

            {/* Chat Content */}
            <div className="transition-transform duration-300 w-full md:col-span-1 h-[600px]">
                <div className="p-3 flex border-b items-center">
                    <div className="flex items-center gap-2">
                        <Avatar className="border w-10 h-10">
                            <AvatarImage src="/placeholder-user.jpg" alt="Image" />
                            <AvatarFallback>OM</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="text-sm font-medium leading-none">Sofia Davis</p>
                            <p className="text-xs text-muted-foreground">Active 2h ago</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 ml-auto">
                        <Button variant="ghost" size="icon" onClick={toggleNotifications}>
                            <span className="sr-only">Settings</span>
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="grid gap-4 p-3 overflow-auto h-[472px] w-full">
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                    <MessageSent />
                    <MessageReceived />
                </div>

                <div className="border-t">
                    <form className="flex w-full items-center space-x-2 p-3">
                        <Input id="message" placeholder="Type your message..." className="flex-1" autoComplete="off" />
                        <Button type="submit" size="icon">
                            <span className="sr-only">Send</span>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            {/* Notifications Panel */}
            <div
                className={`bg-muted/20 p-4 border-l transition-transform duration-300 transform ${showNotifications ? 'translate-x-0' : 'translate-x-full hidden'
                    } md:col-span-1 md:border-t md:border-l-0`}
            >
                <div className="grid gap-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-medium text-base">Cài đặt</h2>
                    </div>

                    {/* Notification List */}
                    <div className="grid gap-4">
                        {notifications.map((notification, index) => (
                            <NotificationItemInChat
                                key={index}
                                icon={notification.icon}
                                title={notification.title}
                                description={notification.description}
                                active={notification.active}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chat;


const notifications = [
    {
        icon: BellIcon,
        title: "New message",
        description: "You have a new message from Alex.",
        active: false,
    },
    {
        icon: AtSignIcon,
        title: "Mentioned",
        description: "You were mentioned in a group chat.",
        active: true,
    },
    {
        icon: EyeOffIcon,
        title: "Muted",
        description: "You have muted a group chat.",
        active: false,
    },
];