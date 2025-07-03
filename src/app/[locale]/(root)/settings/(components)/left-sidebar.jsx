import { Bell, Moon, Shield, User } from 'lucide-react'
import React from 'react'
import { cn } from '@/lib/utils'

function LeftSidebar({ activeTab, setActiveTab, t }) {
  return (
    <div className='md:w-64 shrink-0'>
      <div className='sticky top-20'>
        <nav className='flex flex-col space-y-1'>
          <button
            onClick={() => setActiveTab('account')}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'account'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )}
          >
            <User className='h-4 w-4' />
            {t('navbar.account')}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'notifications'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )}
          >
            <Bell className='h-4 w-4' />
            {t('navbar.notifications')}
          </button>
          <button
            onClick={() => setActiveTab('appearance')}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'appearance'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )}
          >
            <Moon className='h-4 w-4' />
            {t('navbar.appearance')}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              activeTab === 'security'
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted',
            )}
          >
            <Shield className='h-4 w-4' />
            {t('navbar.security')}
          </button>
        </nav>
      </div>
    </div>
  )
}

export default LeftSidebar
