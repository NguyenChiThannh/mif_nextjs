import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, MapPinned, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { groupsApi } from "@/services/groupsApi";
import useUserId from "@/hooks/useUserId";
import { formatDateTime } from "@/lib/formatter";
import { Skeleton } from "@/components/ui/skeleton";

export default function CardEvent({ event }) {
    const userId = useUserId(); // Hook để lấy userId
    const [status, setStatus] = useState("");

    useEffect(() => {
        if (event.userJoin.some((user) => user.id === userId)) {
            setStatus("Đã tham gia");
        } else {
            setStatus("Chưa tham gia");
        }
    }, [event.userJoin, userId]);

    const handleJoinEvent = () => {
        // Hàm xử lý khi tham gia sự kiện
        console.log("Tham gia sự kiện:", event.id);
        // Gửi API tham gia và cập nhật lại trạng thái nếu cần
        setStatus("Đã tham gia");
    };

    return (
        <Card className="drop-shadow-lg animate-fade-in hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardContent className="flex flex-col gap-2 p-0">
                <Image
                    src="/group_default.jpg"
                    alt="Group"
                    width={1200}
                    height={2500}
                    className="rounded-t-lg object-cover w-full aspect-[16/12]"
                />
                <div className="p-2">
                    <div className="mb-2">
                        <h3 className="text-xl font-bold">{event.eventName}</h3>
                        <div className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">
                                {event.userJoin.length} tham gia
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">
                                {formatDateTime(event.startDate)}
                            </span>
                        </div>
                        {event.eventType === "ONLINE" ? (
                            <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span className="text-sm text-muted-foreground">
                                    Online
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MapPinned className="w-4 h-4" />
                                <span className="text-sm text-muted-foreground">
                                    Offline
                                </span>
                            </div>
                        )}
                    </div>

                    {status === "Đã tham gia" ? (
                        <p className="text-green-500 text-center font-medium">
                            {status}
                        </p>
                    ) : (
                        <Button
                            variant="outline"
                            className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                            onClick={handleJoinEvent}
                        >
                            Tham gia sự kiện
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export const CardEventSkeleton = () => {
    return (
        <Card className="drop-shadow-lg animate-pulse">
            <CardContent className="flex flex-col gap-2 p-0">
                <Skeleton
                    width={1200}
                    height={2500}
                    className="rounded-t-lg object-cover w-full aspect-[16/12]"
                />
                <div className="flex gap-2 flex-col p-2">
                    <Skeleton className="w-4/5 h-8" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-full h-12" />
                </div>
            </CardContent>
        </Card>
    );
};