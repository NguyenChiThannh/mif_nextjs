import { navGroupConfig } from '@/lib/navigationConfig'
import { ChartLine, Users } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function SideBar({ isOwner, groupId, pendingInvitations, t, section }) {
    return (
        <div className="h-full border-r bg-background">
            <div className="flex h-full flex-col gap-2 p-4">
                {
                    navGroupConfig(t).map((item, index) => {
                        const { icon: Icon } = item
                        return (
                            <Link
                                key={index}
                                href={item.href(groupId)}
                                className=
                                {`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors 
                                            hover:bg-accent hover:text-primary 
                                            ${item.active(section) ? 'text-primary bg-accent' : 'text-muted-foreground'} `}
                                prefetch={false}
                            >
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        )
                    }
                    )
                }
                <Link
                    href={`/groups/${groupId}/members`}
                    className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary ${section === 'members' ? 'text-primary bg-accent' : 'text-muted-foreground'} `}
                    prefetch={false}
                >
                    <Users className="h-4 w-4" />
                    {t('members')}
                    {
                        (isOwner && pendingInvitations.numberOfElements !== 0 &&
                            <div className="flex items-center bg-primary rounded-full text-primary-foreground h-5 w-5 justify-center">{pendingInvitations.numberOfElements}</div>) || undefined
                    }
                </Link>
                {
                    isOwner &&
                    <Link
                        href={`/groups/${groupId}/statistical`}
                        className={`flex items-center gap-2 rounded-md px-6 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-primary ${section === 'statistical' ? 'text-primary bg-accent' : 'text-muted-foreground'} `}
                        prefetch={false}
                    >
                        <ChartLine className="h-4 w-4" />
                        {t('statistical')}
                    </Link>
                }
            </div>
        </div>
    )
}
