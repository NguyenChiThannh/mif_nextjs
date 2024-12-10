import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays, MapPinned, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { groupsApi } from "@/services/groupsApi";
import useUserId from "@/hooks/useUserId";
import { formatToVietnameseDateTime } from "@/lib/formatter";
import { Skeleton } from "@/components/ui/skeleton";
import { eventApi } from "@/services/eventApi";

export default function CardEvent({ event }) {
    const userId = useUserId();
    const [status, setStatus] = useState("");

    const subscribeToEventMutation = eventApi.mutation.useSubscribeToEvent();
    const unsubscribeFromEventMutation = eventApi.mutation.useUnsubscribeFromEvent();

    useEffect(() => {
        if (event.userJoin.some((id) => id === userId)) {
            setStatus("joined");
        } else {
            setStatus("join");
        }
    }, [userId]);

    const handleEventAction = async (action) => {
        action === "join" ? setStatus('joined') : setStatus('join')
        const mutation = action === "join" ? subscribeToEventMutation : unsubscribeFromEventMutation;
        mutation.mutate(event.id, {
            onError: () => {
                action === "join" ? setStatus('join') : setStatus('joined')
            }
        });

    };

    return (
        <Card className="drop-shadow-lg animate-fade-in hover:scale-105 transition-transform duration-300 ease-in-out">
            <CardContent className="flex flex-col gap-2 p-0">
                <Image
                    src={event.eventPicture || "/group_default.jpg"}
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
                                {event.userJoin.length || 0} tham gia
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-sm text-muted-foreground">
                                {formatToVietnameseDateTime(event.startDate)}
                            </span>
                        </div>
                        {event.eventType === "ONLINE" ? (
                            <div className="flex items-center gap-2">
                                <Monitor className="w-4 h-4" />
                                <span className="text-sm text-muted-foreground">Online</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <MapPinned className="w-4 h-4" />
                                <span className="text-sm text-muted-foreground">Offline</span>
                            </div>
                        )}
                    </div>

                    <Button
                        variant={status === "join" ? "default" : "outline"}
                        className={`w-full ${status === "join" ? "hover:bg-primary hover:text-primary-foreground transition-all duration-200" : ""} `}
                        onClick={() => handleEventAction(status === "joined" ? "leave" : "join")}
                    >
                        {status === "joined" ? "Hủy tham gia sự kiện" : "Tham gia sự kiện"}
                    </Button>
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