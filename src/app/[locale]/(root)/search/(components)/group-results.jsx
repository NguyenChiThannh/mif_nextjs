import CardGroups from "@/components/card-groups";
import Title from "@/components/title";

export const GroupResults = ({ activeTab, groups, movieCategories, t }) => (
    (activeTab === 'all' || activeTab === 'group') && (
        <div className="mt-4">
            <Title title={t("group")} isMore={false} />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-4">
                {groups?.content?.map((group) => (
                    <CardGroups
                        key={group.id}
                        initialStatus="joined"
                        group={group}
                        categories={movieCategories}
                    />
                ))}
            </div>
        </div>
    )
);