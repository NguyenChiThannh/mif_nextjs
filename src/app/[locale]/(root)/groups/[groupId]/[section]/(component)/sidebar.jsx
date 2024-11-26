import { navGroupConfig } from "@/lib/navigationConfig"
import { ChartLine, Users } from "lucide-react"
import Link from "next/link"

export default function SideBar({ isOwner, groupId, pendingInvitations, t, section }) {
    return (
        <div className="h-full border-r bg-background">
            <div className="flex flex-col gap-2 p-4">
                {navGroupConfig(t).map((item, index) => {
                    const { icon: Icon } = item
                    return (
                        <Link
                            key={index}
                            href={item.href(groupId)}
                            prefetch={false}
                            className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors 
                                ${item.active(section) ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent hover:text-primary'}`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    )
                })}

                <Link
                    href={`/groups/${groupId}/members`}
                    prefetch={false}
                    className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors 
                        ${section === 'members' ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent hover:text-primary'}`}
                >
                    <Users className="h-4 w-4" />
                    {t('members')}
                    {isOwner && pendingInvitations.numberOfElements !== 0 && (
                        <div className="flex items-center justify-center bg-primary text-primary-foreground h-5 w-5 rounded-full">
                            {pendingInvitations.numberOfElements}
                        </div>
                    )}
                </Link>

                {isOwner && (
                    <Link
                        href={`/groups/${groupId}/statistical`}
                        prefetch={false}
                        className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors 
                            ${section === 'statistical' ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-accent hover:text-primary'}`}
                    >
                        <ChartLine className="h-4 w-4" />
                        {t('statistical')}
                    </Link>
                )}
            </div>
        </div>
    )
}
