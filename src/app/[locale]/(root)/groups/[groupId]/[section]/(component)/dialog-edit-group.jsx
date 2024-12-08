'use client';

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Loader2, PencilLine, Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { schemaGroup } from "@/lib/schemas/group.schema";
import { categoryApi } from "@/services/movieCategoriesApi";
import { groupsApi } from "@/services/groupsApi";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";


export default function EditGroupDialog({ group }) {

    const [open, setOpen] = useState(false);
    const t = useTranslations("Groups.DialogEditInfoGroup");

    const { control, register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaGroup),
        defaultValues: {
            groupName: group.groupName,
            description: group.description,
            categoryId: group.categoryId,
            isPublic: group.isPublic,
            groupType: group.groupType,
        }
    });

    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()

    const updateGroupMutation = groupsApi.mutation.useUpdateGroup(group.id)

    const onSubmit = async (data) => {
        console.log('🚀 ~ onSubmit ~ data:', data)
        updateGroupMutation.mutate({
            ...data,
            groupId: group.id
        }, {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>

                <Button className='gap-2 p-0' variant="ghost" size="sm">
                    <PencilLine className="h-4 w-4" />
                    {t("edit_info_group")}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl max-h-screen overflow-y-auto bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">{t("edit_info_group")}</DialogTitle>
                </DialogHeader>
                <Separator />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Label htmlFor="groupName" className="text-sm font-medium">{t("group_name")}</Label>
                        <Input
                            id="groupName"
                            placeholder={t("group_name_placeholder")}
                            {...register("groupName", { required: true })}
                            className="mt-2"
                            required
                        />
                        {errors.groupName && <p className="text-red-500 text-xs">{t("group_name_error")}</p>}
                    </div>

                    <div>
                        <Label htmlFor="description" className="text-sm font-medium">{t("group_description")}</Label>
                        <Textarea
                            id="description"
                            placeholder={t("group_description_placeholder")}
                            {...register("description", { required: true })}
                            className="mt-2"
                            rows={5}
                        />
                        {errors.description && <p className="text-red-500 text-xs">{t("group_description_error")}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="categoryId" className="text-right">
                                {t('category')}
                            </Label>
                            <Controller
                                name="categoryId"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        onValueChange={(value) => field.onChange(value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t('category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{t('category')}</SelectLabel>
                                                {movieCategories?.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.categoryName}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.categoryId && (
                                <p className="text-red-500 text-xs font-bold mt-1">{errors.categoryId.message}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="isPublic" className="text-right">
                                {t('group_status')}
                            </Label>
                            <Controller
                                name="isPublic"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value !== undefined ? String(field.value) : undefined}
                                        onValueChange={(value) => field.onChange(value === 'true')}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder={t('group_status')}>
                                                {field.value !== undefined
                                                    ? field.value
                                                        ? t('public')
                                                        : t('private')
                                                    : t('group_status')}
                                            </SelectValue>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>{t('group_status')}</SelectLabel>
                                                <SelectItem value="true">
                                                    {t('public')}
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    {t('private')}
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>


                    <div className="flex justify-end">
                        <Button type="submit" disabled={updateGroupMutation.isLoading}>
                            {updateGroupMutation.isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t("button_submit")}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
