import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ChevronDown, Heart, HeartOff } from 'lucide-react'

export default function HeaderSection({ actor, liked, onLike, onUnlike, t, favoriteCount }) {
    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <div className="relative">
                <Avatar className="w-32 h-32">
                    <AvatarImage src={actor.profilePictureUrl} alt={actor.name || 'Actor Avatar'} />
                    <AvatarFallback>Actor</AvatarFallback>
                </Avatar>
            </div>

            {/* Name */}
            <div className="text-xl font-bold text-center">{actor.name}</div>

            {/* Like Level */}
            <div className="text-sm font-medium">
                {t("like_level")}: {favoriteCount || 0}
            </div>

            {/* Favorite Actions */}
            {liked ? (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" className="flex items-center gap-1">
                            <span>{t("liked")}</span>
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={onUnlike}>
                            <HeartOff className="w-4 h-4 mr-2" />
                            {t("unlike")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button onClick={onLike} className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    <span>{t("like")}</span>
                </Button>
            )}
        </div>
    )
} 