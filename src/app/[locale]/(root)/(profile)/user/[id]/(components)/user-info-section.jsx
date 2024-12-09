import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'

export function UserInfoSection({ user, avatar, isOwnProfile, onAvatarChange }) {
    if (!user) return null

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative">
                <Avatar className="w-32 h-32">
                    <AvatarImage
                        src={avatar || user.profilePictureUrl}
                        alt={user.displayName}
                    />
                    <AvatarFallback className="uppercase text-xl font-bold">
                        {user.displayName?.[0]}
                    </AvatarFallback>
                </Avatar>

                {isOwnProfile && (
                    <div className="absolute -right-2 -bottom-2">
                        <Button
                            variant="ghost"
                            className="rounded-full bg-muted p-3 shadow-md hover:scale-105 transition"
                        >
                            <Camera className="text-primary" />
                            <input
                                type="file"
                                accept="image/*"
                                onChange={onAvatarChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </Button>
                    </div>
                )}
            </div>

            <div className="text-lg font-bold text-center">
                {user.displayName}
            </div>
        </div>
    )
} 