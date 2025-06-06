import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Pencil, Copy } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'

export function CardInfoUser({ setOpenDialogEdit, infoUser, t }) {
    const pathname = usePathname()
    const url = pathname.replace('/info', '')

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url)
            .then(() => toast.success(t('copy_link_profile_successful')))
            .catch(() => toast.error(t('copy_link_profile_error')))
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card className="w-full mx-auto shadow-lg border bg-card hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold text-foreground">{t('info')}</h3>
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="hover:bg-muted/50 transition-colors duration-200"
                                >
                                    <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem
                                    onClick={() => setOpenDialogEdit(true)}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                                >
                                    <Pencil className="mr-2 w-4 h-4 text-primary" />
                                    <span className="text-foreground">{t('edit_profile')}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={handleCopyLink}
                                    className="cursor-pointer hover:bg-muted/50 transition-colors duration-200"
                                >
                                    <Copy className="mr-2 w-4 h-4 text-primary" />
                                    <span className="text-foreground">{t('copy_link_profile')}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Info */}
                    <div className="grid grid-cols-2 gap-6 text-sm">
                        <div className="text-muted-foreground font-medium">{t('display_name')}:</div>
                        <div className="text-foreground">{infoUser.displayName}</div>
                        <div className="text-muted-foreground font-medium">{t('dob')}:</div>
                        <div className="text-foreground">{new Date(infoUser.dob).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                        })}</div>
                        <div className="text-muted-foreground font-medium">{t('member_type')}:</div>
                        <div className="text-foreground">{infoUser.userType}</div>
                    </div>

                    {/* Bio */}
                    <div className="mt-8 pt-6 border-t border-border">
                        <h4 className="text-base font-semibold text-foreground mb-2">{t('bio')}</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{infoUser.bio}</p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
