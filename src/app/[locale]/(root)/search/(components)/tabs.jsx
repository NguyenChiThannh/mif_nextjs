import { Button } from "@/components/ui/button";
import { tabSearchConfig } from "@/lib/navigationConfig";

export const Tabs = ({ activeTab, setActiveTab, t }) => (
    <div className="flex mt-4 gap-4">
        {tabSearchConfig(t).map(({ title, tab }) => (
            <Button
                key={tab}
                size="sm"
                variant={activeTab === tab ? undefined : 'outline'}
                className={tab === 'all' ? undefined : 'hidden md:block'}
                onClick={() => setActiveTab(tab)}
            >
                {title}
            </Button>
        ))}
    </div>
);