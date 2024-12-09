'use client'

import FavorateActorsSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/favorate-actors-section'
import InfoSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/info-section'
import MoviesSavedSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/movies-saved-section'
import PostsSavedSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/posts-saved-section'
import PostsSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/posts-section'
import SubscribedEventsSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/subscribed-events-section'
import useUserId from '@/hooks/useUserId'
import { useParams } from 'next/navigation'
import React from 'react'

export default function UserSection() {
    const { id, section } = useParams()
    return (
        <div>
            {(!section || section === 'posts') && <PostsSection id={id} />}
            {(section === 'info') && <InfoSection id={id} />}
            {section === 'posts_saved' && <PostsSavedSection id={id} />}
            {section === 'movies_saved' && <MoviesSavedSection id={id} />}
            {section === 'favorate_actors' && <FavorateActorsSection />}
            {(section === 'event') && <SubscribedEventsSection />}
        </div>
    )
}
