import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Copy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'react-toastify'

export function CardInfoUser({ setOpenDialogEdit, infoUser, t }) {
    const pathname = usePathname()
    const url = pathname.replace('/info', '')

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url)
            .then(() => toast.success(t('copy_link_profile_successful')))
            .catch(() => toast.error(t('copy_link_profile_error')))
    }

    return (
        <Card className="w-full mx-auto shadow-lg border">
            <CardContent className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">{t('info')}</h3>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost" className="hover:bg-muted/50">
                                <MoreHorizontal className="w-5 h-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setOpenDialogEdit(true)}>
                                <Pencil className="mr-2 w-4 h-4 text-primary" />
                                {t('edit_profile')}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleCopyLink}>
                                <Copy className="mr-2 w-4 h-4 text-primary" />
                                {t('copy_link_profile')}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Info */}
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>{t('display_name')}:</div>
                    <div>{infoUser.displayName}</div>
                    <div>{t('dob')}:</div>
                    <div>{new Date(infoUser.dob).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })}</div>
                    <div>{t('member_type')}:</div>
                    <div>{infoUser.userType}</div>
                </div>

                {/* Bio */}
                <div className="mt-6">
                    <h4 className="text-base font-semibold">{t('bio')}</h4>
                    <p className="text-sm text-muted-foreground">{infoUser.bio}</p>
                </div>
            </CardContent>
        </Card>
    )
}
