import { Button } from "@/components/ui/button";
import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { groupRulesApi } from "@/services/groupRulesApi";
import { groupsApi } from "@/services/groupsApi";
import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function DialogAddOrEditRuleToGroup({ groupId, rule, isOpen, setIsOpen, setRule }) {

    const t = useTranslations('Groups.DialogAddOrEditRule')

    const { handleSubmit, register, reset } = useForm();

    const addRuleMutation = groupRulesApi.mutation.useAddRuleToGroup(groupId)

    const updateRuleMutation = groupRulesApi.mutation.useUpdateRuleInGroup(groupId)

    useEffect(() => {
        if (rule) reset({
            ruleDescription: rule.ruleDescription
        })
    }, [rule])

    const onSubmit = (data) => {
        !rule
            ?
            addRuleMutation.mutate({ groupId, data }, {
                onSuccess: () => {
                    setIsOpen(false)
                    setRule('')
                    reset()
                }
            })
            :
            updateRuleMutation.mutate({ groupId, ruleId: rule.id, data }, {
                onSuccess: () => {
                    setIsOpen(false)
                    setRule('')
                    reset()
                }
            })
    };

    // const queryClient = useQueryClient()
    // const onSubmit = (data) => {
    //     if (!data.ruleDescription) { 
    //         toast.error('Mô tả quy tắc không được để trống'); 
    //         return; 
    //     }
    //     if (isOwner) { 3 
    //             const addRuleMutation = useMutation({ 
    //                 mutationFn: async ({ groupId, data }) => {
    //                     try {
    //                         await privateApi.post(`/groups/${groupId}/rules`, data); 
    //                     } catch (error) {
    //                         return Promise.reject(error); 
    //                     }
    //                 },
    //                 onSuccess: () => {
    //                     toast.success('Thêm quy tắc nhóm thành công'); 
    //                     queryClient.invalidateQueries({ queryKey: ['groupRules', groupId] });
    //                 },
    //                 onError: () => {
    //                     toast.error('Thêm quy tắc nhóm thất bại'); 
    //                 }
    //             });
    //             addRuleMutation.mutate({ groupId, data }); 
    //     } else {
    //         // Nếu không phải owner
    //         toast.error('Bạn không có quyền thêm quy tắc');
    //     }
    // };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-8 gap-1" size='sm' onClick={() => setIsOpen(true)}>
                    <Plus className="h-4 w-4" />
                    {rule ? t('edit') : t('add')}
                </Button>

            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl ">
                <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
                    <DialogHeader>
                        <DialogTitle>{rule ? t('edit') : t('add')}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <p className="text-sm font-bold">{t('content')}</p>
                        <Textarea
                            {...register("ruleDescription", { required: true })}
                            className="w-full"
                            placeholder={t('content_placeholder')}
                            rows={5}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit"
                            disabled={addRuleMutation.isPending || updateRuleMutation.isPending}>
                            {(addRuleMutation.isPending || updateRuleMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('button_submit')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
