import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'
import React from 'react'

function AppearanceSection() {
  const t = useTranslations('Settings.Appearance')
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('title')}</CardTitle>
        <CardDescription>{t('title_description')}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='space-y-4'>
          <h3 className='text-lg font-medium'>{t('theme')}</h3>
          <Separator />
          <div className='grid grid-cols-3 gap-4'>
            <div className='flex flex-col items-center gap-2'>
              <Button
                variant='outline'
                className='w-full h-24 border-2 bg-background'
                onClick={() =>
                  document.documentElement.classList.remove('dark')
                }
              >
                <Sun className='h-6 w-6' />
              </Button>
              <span className='text-sm'>{t('light')}</span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <Button
                variant='outline'
                className='w-full h-24 border-2 bg-zinc-950'
                onClick={() => document.documentElement.classList.add('dark')}
              >
                <Moon className='h-6 w-6 text-white' />
              </Button>
              <span className='text-sm'>{t('dark')}</span>
            </div>
            <div className='flex flex-col items-center gap-2'>
              <Button
                variant='outline'
                className='w-full h-24 border-2 bg-gradient-to-b from-background to-zinc-950'
                onClick={() => {
                  const prefersDark = window.matchMedia(
                    '(prefers-color-scheme: dark)',
                  ).matches
                  document.documentElement.classList.toggle('dark', prefersDark)
                }}
              >
                <div className='flex'>
                  <Sun className='h-6 w-6' />
                  <Moon className='h-6 w-6 text-white' />
                </div>
              </Button>
              <span className='text-sm'>{t('system')}</span>
            </div>
          </div>
        </div>

        {/* <div className="space-y-4">
                    <h3 className="text-lg font-medium">Font Size</h3>
                    <Separator />
                    <div className="grid gap-2">
                        <Label htmlFor="font-size">Adjust font size</Label>
                        <Select defaultValue="medium">
                            <SelectTrigger id="font-size">
                                <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="x-large">Extra Large</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Density</h3>
                    <Separator />
                    <div className="grid gap-2">
                        <Label htmlFor="density">Interface density</Label>
                        <Select defaultValue="comfortable">
                            <SelectTrigger id="density">
                                <SelectValue placeholder="Select density" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="compact">Compact</SelectItem>
                                <SelectItem value="comfortable">Comfortable</SelectItem>
                                <SelectItem value="spacious">Spacious</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div> */}
      </CardContent>
      <CardFooter className='flex justify-between'>
        <Button>{t('save_button')}</Button>
      </CardFooter>
    </Card>
  )
}

export default AppearanceSection
