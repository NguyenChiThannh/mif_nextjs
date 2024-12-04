'use client';
import BadgeIcon from "@/components/badge-icon";
import NotificationItem, { NotificationItemSkeleton } from "@/components/notification-item";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useAppSelector } from "@/redux/store";
import { notificationApi } from "@/services/notificationApi";
import { Bell } from "lucide-react";
import { useState, useEffect } from "react";

const SOCKET_URL = "http://localhost:8080/ws";

export function NotificationPopover() {
    const authState = useAppSelector((state) => state.auth.authState);
    const [liveNotifications, setLiveNotifications] = useState([]);
    const [localUnreadCount, setLocalUnreadCount] = useState(0);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isRealtime, setIsRealtime] = useState(false); // Trạng thái xem liệu có dữ liệu realtime hay không

    const {
        data: notifications,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading: isLoadingNotifications,
    } = notificationApi.query.useGetAllNotifications();

    const observerElem = useInfiniteScroll(hasNextPage, fetchNextPage);

    const { data: unreadNotificationCount, isLoading: isLoadingUnreadNotificationCount } =
        notificationApi.query.useGetUnreadNotificationCount();

    const { isConnected } = useWebSocket(
        SOCKET_URL,
        authState.accessToken,
        "/user/queue/notifications",
        (notification) => {
            setIsRealtime(true); // Bật chế độ realtime khi có sự kiện mới từ WebSocket
            setLiveNotifications((prev) => {
                const isDuplicate = prev.some((existingNotification) => existingNotification.id === notification.id);
                if (isDuplicate) {
                    return prev;
                } else {
                    setLocalUnreadCount((prevCount) => prevCount + 1);
                }
                return [notification, ...prev];
            });
        }
    );

    // Tổng số lượng thông báo chưa đọc
    const totalUnreadNotificationCount =
        unreadNotificationCount + localUnreadCount;

    // Kết hợp thông báo từ API và WebSocket
    // Kết hợp thông báo từ API và WebSocket
    const combinedNotifications = (() => {
        const notificationMap = new Map();

        // Thêm các thông báo từ API
        notifications?.pages.forEach((page) => {
            page.content.forEach((notification) => {
                notificationMap.set(notification.id, notification);
            });
        });

        // Thêm các thông báo từ liveNotifications
        liveNotifications.forEach((notification) => {
            notificationMap.set(notification.id, notification);
        });

        // Chuyển Map trở lại thành mảng
        return Array.from(notificationMap.values());
    })();

    if (isLoadingNotifications || isLoadingUnreadNotificationCount) return <></>;

    return (
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <BadgeIcon
                        icon={Bell}
                        {...(totalUnreadNotificationCount !== 0 && { badgeContent: totalUnreadNotificationCount })}
                    />
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[400px] pr-0">
                <div className="grid gap-4 divide-y overflow-y-scroll max-h-[600px]">
                    <div>
                        <h4 className="text-xl font-medium">Thông báo</h4>
                    </div>
                    <div className="pt-3 grid space-y-1 pr-2">
                        {combinedNotifications.length === 0 && !isLoadingNotifications && (
                            <p>Không có thông báo nào</p>
                        )}
                        {isLoadingNotifications && (
                            <>
                                <NotificationItemSkeleton />
                                <NotificationItemSkeleton />
                                <NotificationItemSkeleton />
                            </>
                        )}
                        {combinedNotifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => setIsPopoverOpen(false)}
                            />
                        ))}
                        {isFetchingNextPage && <NotificationItemSkeleton />}
                        <div ref={observerElem}></div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
