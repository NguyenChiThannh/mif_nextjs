import { navProfileUserConfig } from '@/lib/navigationConfig'
import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function ProfileNavbar({ pathname, id }) {
  const t = useTranslations('Profile.User.Navbar')
  return (
    <nav className='flex flex-wrap gap-2'>
      {navProfileUserConfig(t).map((item, index) => (
        <Link
          key={index}
          href={item.href(id)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
            item.active(pathname, id)
              ? 'bg-primary text-background'
              : 'bg-muted hover:bg-primary hover:text-background'
          }`}
          prefetch={false}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
