import { Button } from '@/components/ui/button'
import React from 'react'

export default function ButtonLoginWithGoogle({ t }) {
  return (
    <div>
      <Button variant="outline" className="w-full" type="button">
        {t('login_with_google')}
      </Button>
    </div>
  )
}
