'use client'
import InfoSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/infoSection'
import MoviesSavedSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/moviesSaved'
import PostsSavedSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/postsSaved'
import PostsSection from '@/app/[locale]/(root)/(profile)/user/[id]/[section]/postsSection'
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
            {/* {(section === 'info') && <InfoSection id={id} />}
            {(section === 'info') && <InfoSection id={id} />}
            {(section === 'info') && <InfoSection id={id} />} */}
        </div>
    )
}
