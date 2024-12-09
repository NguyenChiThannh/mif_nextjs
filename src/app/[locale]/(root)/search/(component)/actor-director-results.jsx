import { CardActorHorizontalSkeleton } from "@/components/card-actor-horizontal";
import Title from "@/components/title";

export const ActorDirectorResults = ({ activeTab }) => (
    (activeTab === 'all' || activeTab === 'director_actor') && (
        <div className="mt-4 mb-8">
            <Title title="Diễn viên/ Đạo diễn" isMore={false} />
            <div className="grid gap-2 mt-4">
                <CardActorHorizontalSkeleton />
                <CardActorHorizontalSkeleton />
                <CardActorHorizontalSkeleton />
                <CardActorHorizontalSkeleton />
            </div>
        </div>
    )
);