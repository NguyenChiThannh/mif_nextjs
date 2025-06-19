import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { DatePickerPopover } from '@/components/date-picker-popover'
import { schemaProfileUser } from '@/lib/schemas/profile-user.schema'
import { userApi } from '@/services/userApi'
import { useTranslations } from 'next-intl'

export function DialogEditProfile({ openDialogEdit, setOpenDialogEdit, infoUser, t }) {
    const tSchema = useTranslations('Schema.userInfo')
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaProfileUser(tSchema)),
    })

    useEffect(() => {
        if (infoUser) {
            reset({
                displayName: infoUser.displayName || '',
                dob: infoUser.dob ? new Date(infoUser.dob) : undefined,
                bio: infoUser.bio || '',
            })
        }
    }, [infoUser])

    const updateProfileMutation = userApi.mutation.useUpdateUserProfile(infoUser.id)

    const onSubmit = (data) => {
        updateProfileMutation.mutate(data, {
            onSuccess: () => {
                reset()
                setOpenDialogEdit(false)
            },
        })
    }

    return (
        <Dialog open={openDialogEdit} onOpenChange={setOpenDialogEdit}>
            <DialogContent className="sm:max-w-[425px] bg-background">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold text-foreground">
                        {t('edit_profile')}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                    {/* Display Name */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">{t('display_name')}</label>
                        <Input
                            {...register("displayName")}
                            className="bg-card border-input focus-visible:ring-primary"
                        />
                        {errors.displayName && (
                            <p className="text-red-500 text-sm font-bold">{errors.displayName.message}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">{t('dob')}</label>
                        <Controller
                            control={control}
                            name="dob"
                            render={({ field }) => (
                                <DatePickerPopover
                                    selected={field.value ?? undefined}
                                    onSelect={field.onChange}
                                />
                            )}
                        />
                    </div>

                    {/* Bio */}
                    <div className="grid gap-2">
                        <label className="text-sm font-medium text-foreground">{t('bio')}</label>
                        <Textarea
                            {...register("bio")}
                            placeholder={t('bio_placeholder')}
                            rows={5}
                            className="bg-card border-input focus-visible:ring-primary resize-none overflow-y-auto max-h-[200px]"
                        />
                        {errors.bio && (
                            <p className="text-red-500 text-sm font-bold">{errors.bio.message}</p>
                        )}
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                        >
                            {t('button_submit_edit_profile')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}