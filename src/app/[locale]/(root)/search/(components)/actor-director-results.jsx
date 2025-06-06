import CardActor from "@/components/card-actor";
import CardActorHorizontal from "@/components/card-actor-horizontal";
import Title from "@/components/title";

export const ActorDirectorResults = ({ activeTab, actors, t }) => (
    (activeTab === 'all' || activeTab === 'director_actor') && (
        <div className="mt-4 mb-8">
            <Title title={t("director_actor")} isMore={false} />
            <div className="grid gap-2 mt-4">
                {actors?.content?.map(actor =>
                    <CardActorHorizontal key={actor.id} actor={actor} />
                )}
            </div>
        </div>
    )
);