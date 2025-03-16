import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, HeartIcon, UsersIcon, FileTextIcon, FilmIcon, StarIcon, UserIcon } from "lucide-react";

const iconMap = {
    actor: HeartIcon,
    group: UsersIcon,
    movie: FilmIcon,
    post: FileTextIcon,
    rating: StarIcon,
    user: UserIcon,
};

const titleMap = {
    actor: "Diễn viên",
    group: "Nhóm và cộng đồng",
    movie: "Phim",
    post: "Bài viết",
    rating: "Đánh giá và Xếp hạng",
    user: "Người dùng"
};

const descriptionMap = {
    actor: "Tổng số diễn viên trong cơ sở dữ liệu",
    group: "Số lượng nhóm được tạo",
    movie: "Tổng số phim trong cơ sở dữ liệu",
    post: "Số lượng bài viết được tạo",
    rating: "Số lượng đánh giá được thực hiện",
    user: "Số lượng người dùng đã đăng ký"
};

function StatsCard({ type, count }) {
    const Icon = iconMap[type] || Users;
    return (
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {titleMap[type] || "Thống kê"}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{count}</div>
                <p className="text-xs text-muted-foreground">
                    {descriptionMap[type] || "Mô tả không xác định"}
                </p>
            </CardContent>
        </Card>
    );
}

export default StatsCard;
