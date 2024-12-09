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

export function DialogEditProfile({ openDialogEdit, setOpenDialogEdit, infoUser, t }) {
    const { register, handleSubmit, control, reset } = useForm({
        resolver: zodResolver(schemaProfileUser),
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
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_profile')}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                    {/* Display Name */}
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold">{t('display_name')}</label>
                        <Input {...register("displayName")} />
                    </div>

                    {/* Date of Birth */}
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold">{t('dob')}</label>
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
                    {/* <div className="grid gap-2">
                        <Input />
                    </div>
                    <span className="text-red-500 text-sm font-bold">Ngày sinh bị không đúng định dạng</span> */}
                    {/* Bio */}
                    <div className="grid gap-2">
                        <label className="text-sm font-semibold">{t('bio')}</label>
                        <Textarea
                            {...register("bio")}
                            placeholder={t('bio_placeholder')}
                            rows={5}
                        />
                    </div>

                    {/* Footer */}
                    <DialogFooter>
                        <Button type="submit" className="w-full">
                            {t('button_submit_edit_profile')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// const onSubmit = (data, id) => {
//     if (!id) {
//         toast.error('ID không hợp lệ');
//         return;
//     }

//     if (!data.displayName) {
//         toast.error('Display không không được để trống');
//         return;
//     }

//     const queryClient = useQueryClient();

//     const updateProfileMutation = useMutation({
//         mutationFn: async (data) => {
//             try {
//                 const res = await privateApi.patch('/my-profile', data);
//                 return res.data;
//             } catch (error) {
//                 throw error;
//             }
//         },
//         onSuccess: () => {
//             toast.success(t('update_user_info_successful'));
//             queryClient.invalidateQueries(QUERY_KEY.userInfoById(id));
//             reset();
//             setOpenDialogEdit(false);
//         },
//         onError: (error) => {
//             toast.error(t('update_user_info_failed'));
//         }
//     });

//     updateProfileMutation.mutate(data);
// };

