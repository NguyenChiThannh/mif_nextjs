import { Card, CardContent } from "@/components/ui/card";
import { Users, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import useUserId from "@/hooks/useUserId";
import { useGroupStatus } from "@/hooks/useGroupStatus";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

export default function CardGroups({ group, categories }) {
  const t = useTranslations('Groups');
  const userId = useUserId();
  const { status, handleJoinGroup, handleRemovePendingGroup } = useGroupStatus(group.id, userId);
  const router = useRouter();

  const handleDetailGroup = () => {
    router.push(`/groups/${group.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border transition-colors duration-300">
        <CardContent className="flex flex-col gap-2 p-0">
          <motion.div
            className="relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={group.avatarUrl || "/group_default.jpg"}
              alt="Group"
              width={1200}
              height={2500}
              className="object-cover w-full aspect-[16/12]"
            />
          </motion.div>
          <div className="p-4">
            <div className="mb-3 space-y-2">
              <motion.h3
                className="text-xl font-bold text-foreground hover:text-primary transition-colors duration-200 cursor-pointer"
                onClick={handleDetailGroup}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                {group?.groupName}
              </motion.h3>
              <p className="text-sm text-primary-foreground bg-primary inline-block px-3 py-1 rounded-full">
                {categories?.find((category) => group.categoryId === category.id)?.categoryName}
              </p>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="w-4 h-4" />
                <span className="text-sm">
                  {group?.memberCount} {t("members")}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CalendarDays className="w-4 h-4" />
                <span className="text-sm">
                  {group?.weeklyPostCount} {t("week_this_post")}
                </span>
              </div>
            </div>

            {status === "NOT_JOIN" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleJoinGroup}
                  variant="outline"
                  className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                >
                  {t("join_group")}
                </Button>
              </motion.div>
            )}
            {status === "PENDING" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleRemovePendingGroup}
                  variant="outline"
                  className="w-full hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                >
                  {t("cancel_join_group")}
                </Button>
              </motion.div>
            )}
            {status === "JOINED" && (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleDetailGroup}
                  className="w-full bg-primary hover:bg-primary/90 transition-all duration-200"
                >
                  {t("view_group")}
                </Button>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export const CardGroupsSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-border">
        <CardContent className="flex flex-col gap-2 p-0">
          <Skeleton className="w-full aspect-[16/12] bg-muted" />
          <div className="flex gap-2 flex-col p-4">
            <Skeleton className="w-3/5 h-8 bg-muted" />
            <Skeleton className="w-2/5 h-6 bg-muted" />
            <Skeleton className="w-2/5 h-6 bg-muted" />
            <Skeleton className="w-full h-10 bg-muted" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
