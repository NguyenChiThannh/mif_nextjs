import { useProfilePermission } from '@/hooks/useProfilePermission'

export function ProfilePermissionGuard({
    id,
    children,
    fallback = null,
    requireOwner = false
}) {
    const { isOwnProfile, canView } = useProfilePermission(id)

    if (!canView) {
        return <div className="text-center p-4">Bạn không có quyền xem trang này</div>
    }

    if (requireOwner && !isOwnProfile) {
        return fallback
    }

    return children
} 