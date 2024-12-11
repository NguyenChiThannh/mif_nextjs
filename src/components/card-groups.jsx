import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import useUserId from "@/hooks/useUserId";
import { useGroupStatus } from "@/hooks/useGroupStatus";

export default function CardGroups({ group, categories }) {
  const userId = useUserId();
  const { status, handleJoinGroup, handleRemovePendingGroup } = useGroupStatus(group.id, userId);
  const router = useRouter();

  const handleDetailGroup = () => {
    router.push(`/groups/${group.id}`);
  };


  return (
    <Card className="drop-shadow-lg animate-fade-in hover:scale-105 transition-transform duration-300 ease-in-out">
      <CardContent className="flex flex-col gap-2 p-0">
        <Image
          src={group.avatarUrl || "/group_default.jpg"}
          alt="Group"
          width={1200}
          height={2500}
          className="rounded-t-lg object-cover w-full aspect-[16/12]"
        />
        <div className="p-2">
          <div className="mb-2">
            <h3 className="text-xl font-bold hover:underline hover:cursor-pointer" onClick={handleDetailGroup}>{group?.groupName}</h3>
            <p className="text-sm text-secondary-foreground bg-secondary inline-block px-2 rounded-full ">
              {categories?.find((category) => group.categoryId === category.id)?.categoryName}
            </p>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                {group?.memberCount} thành viên
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="text-sm text-muted-foreground">
                {group?.weeklyPostCount} bài viết tuần này
              </span>
            </div>
          </div>

          {status === "NOT_JOIN" && (
            <Button
              onClick={handleJoinGroup}
              variant="outline"
              className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Tham gia nhóm
            </Button>
          )}
          {status === "PENDING" && (
            <Button
              onClick={handleRemovePendingGroup}
              variant="outline"
              className="w-full"
            >
              Đang chờ duyệt
            </Button>
          )}
          {status === "JOINED" && (
            <Button
              onClick={handleDetailGroup}
              className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            >
              Xem Nhóm
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export const CardGroupsSkeleton = () => {
  return (
    <Card className="drop-shadow-lg animate-pulse">
      <CardContent className="flex flex-col gap-2 p-0">
        <Skeleton
          width={1200}
          height={2500}
          className="rounded-t-lg object-cover w-full aspect-[16/12]"
        />
        <div className="flex gap-2 flex-col p-2">
          <Skeleton className="w-3/5 h-8" />
          <Skeleton className="w-2/5 h-6" />
          <Skeleton className="w-2/5 h-6" />
          <Skeleton className="w-full h-12" />
        </div>
      </CardContent>
    </Card>
  );
};
