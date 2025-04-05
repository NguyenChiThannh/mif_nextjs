'use client'

import CardMember from '@/components/card-member'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useCallback, useMemo } from 'react'

export default function MembersSection({ members, group, pendingInvitations, isOwner, t }) {
    // Render pending invitations section
    const renderPendingInvitations = useCallback(() => {
        if (!isOwner || !pendingInvitations?.numberOfElements) return null;

        return (
            <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
                <CardContent>
                    <div className='grid gap-4 mt-4'>
                        <p className='font-bold'>{t("request_to_join_group")}</p>
                        {pendingInvitations?.content?.map((invitation) => (
                            <CardMember
                                key={invitation.id}
                                groupId={group?.id}
                                member={invitation}
                                type='invitation'
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }, [isOwner, pendingInvitations, group?.id]);

    // Render group owner section
    const renderOwnerSection = useMemo(() => (
        <div className='grid gap-4 mt-4'>
            <p className='font-bold'>{t("founder")}</p>
            <CardMember
                member={group?.owner}
                cardOwner={true}
            />
        </div>
    ), [group?.owner]);

    // Render members section
    const renderMembersSection = useMemo(() => (
        <div className="grid grid-cols-1 gap-4 mt-4">
            <p className='font-bold'>{t("recently_joined")}</p>
            {members?.content?.map((member) => {
                if (member.id !== group?.owner.id) {
                    return (
                        <CardMember
                            key={member.id}
                            member={member}
                            groupId={group?.id}
                            isOwner={isOwner}
                        />
                    );
                }
                return null;
            })}
        </div>
    ), [members?.content, group?.id, group?.owner.id, isOwner]);

    // Render header section
    const renderHeader = useMemo(() => (
        <div className="mt-6">
            <p className="font-bold flex items-center">
                {t("members")} &middot; &nbsp;
                <span className='text-xs leading-3 text-muted-foreground'>
                    {group?.memberCount}
                </span>
            </p>

            {/* <div className="hidden md:block relative mt-2">
                <Input 
                    type="text" 
                    placeholder="Tìm kiếm..." 
                    className="pr-10" 
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div> */}
        </div>
    ), [group?.memberCount]);

    return (
        <>
            {renderPendingInvitations()}

            <Card className="w-full max-w-3xl mx-auto my-8 drop-shadow-lg">
                <CardContent>
                    {renderHeader}
                    {renderOwnerSection}
                    {renderMembersSection}
                </CardContent>
            </Card>
        </>
    );
}