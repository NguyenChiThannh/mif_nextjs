import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { BadgeIcon } from '@/components/badge-icon'

export function UserInfoSection({
  user,
  avatar,
  isOwnProfile,
  onAvatarChange,
}) {
  if (!user) return null

  // Count badges by level
  const badgeCounts = Object.values(user.badgeMap || {}).reduce(
    (acc, level) => {
      acc[level] = (acc[level] || 0) + 1
      return acc
    },
    {},
  )

  return (
    <div className='flex flex-col items-center gap-4'>
      <div className='relative'>
        <Avatar className='w-32 h-32'>
          <AvatarImage
            src={avatar || user.profilePictureUrl}
            alt={user.displayName}
          />
          <AvatarFallback className='uppercase text-xl font-bold'>
            {user.displayName?.[0]}
          </AvatarFallback>
        </Avatar>

        {isOwnProfile && (
          <div className='absolute -right-2 -bottom-2'>
            <Button
              variant='ghost'
              className='rounded-full bg-muted p-3 shadow-md hover:scale-105 transition'
            >
              <Camera className='text-primary' />
              <input
                type='file'
                accept='image/*'
                onChange={onAvatarChange}
                className='absolute inset-0 opacity-0 cursor-pointer'
              />
            </Button>
          </div>
        )}
      </div>

      <div className='text-lg font-bold text-center'>{user.displayName}</div>

      {/* Badge Counts */}
      {Object.keys(badgeCounts).length > 0 && (
        <div className='flex flex-wrap justify-center gap-6 mt-2'>
          {Object.entries(badgeCounts).map(([level, count]) => (
            <div key={level} className='flex flex-col items-center gap-1'>
              <div className='relative'>
                <BadgeIcon level={level} size='md' showAnimation />
                {count > 0 && (
                  <div className='absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center'>
                    {count}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
