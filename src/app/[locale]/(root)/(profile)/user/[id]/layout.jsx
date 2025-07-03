'use client'

import { useParams, usePathname } from 'next/navigation'
import Loading from '@/components/loading'
import { useProfile } from '@/hooks/useProfile'
import { UserInfoSection } from './(components)/user-info-section'
import ProfileNavbar from './(components)/profile-navbar'

export default function UserLayout({ children }) {
  const { id } = useParams()
  const pathname = usePathname()

  const { user, isLoading, avatar, isOwnProfile, handleAvatarChange } =
    useProfile(id)

  if (isLoading) return <Loading />

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-8 p-4'>
      <UserInfoSection
        user={user}
        avatar={avatar}
        isOwnProfile={isOwnProfile}
        onAvatarChange={handleAvatarChange}
      />

      <div className='col-span-2'>
        {isOwnProfile && <ProfileNavbar pathname={pathname} id={id} />}

        <div className='mt-4'>{children}</div>
      </div>
    </div>
  )
}
