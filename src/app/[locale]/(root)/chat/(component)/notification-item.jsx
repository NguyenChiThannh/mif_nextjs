import { cn } from "@/lib/utils"; // Hàm `cn` để kết hợp classNames (nếu cần)

const NotificationItemInChat = ({ icon: Icon, title, description, active = false }) => (
    <div
        className={cn(
            "-mx-2 flex items-start gap-4 rounded-md p-2 transition-all",
            active
                ? "bg-accent text-accent-foreground"
                : "hover:bg-accent hover:text-accent-foreground"
        )}
    >
        <Icon className="mt-px h-5 w-5" />
        <div className="space-y-1">
            <p className="text-sm font-medium leading-none">{title}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    </div>
);

export default NotificationItemInChat;
