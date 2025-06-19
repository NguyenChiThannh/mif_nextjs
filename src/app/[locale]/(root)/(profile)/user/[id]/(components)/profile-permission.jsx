import { useProfilePermission } from '@/hooks/useProfilePermission'

export function ProfilePermissionGuard({
  id,
  children,
  fallback = null,
  requireOwner = false,
  t,
}) {
  const { isOwnProfile, canView } = useProfilePermission(id)

  if (!canView) {
    return <div className="text-center p-4">{t('no_permission')}</div>
  }

  if (requireOwner && !isOwnProfile) {
    return fallback
  }

  return children
}
