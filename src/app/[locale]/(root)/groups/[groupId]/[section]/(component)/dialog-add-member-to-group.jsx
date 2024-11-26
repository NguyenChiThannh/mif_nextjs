'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { groupsApi } from '@/services/groupsApi'
import { Plus } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function DialogAddMemberToGroup({ groupId }) {
    const [isOpen, setIsOpen] = useState(false);

    const { handleSubmit, register, reset } = useForm();
    const mutation = groupsApi.mutation.useAddMemberToGroup();

    const onSubmit = (data) => {
        mutation.mutate(
            { ...data, groupId },
            {
                onSuccess: () => {
                    reset();
                    setIsOpen(false);
                },
            }
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="h-8 gap-1"
                    onClick={() => setIsOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Mời
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-semibold">
                            Mời thành viên
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="userId" className="text-sm text-muted-foreground">
                            Link/Id của người dùng
                        </Label>
                        <Input
                            id="userId"
                            placeholder="Nhập link hoặc ID..."
                            {...register('userId', { required: true })}
                            className="border rounded-md"
                            required
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={mutation.isLoading}
                        >
                            {mutation.isLoading ? 'Đang gửi...' : 'Mời'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
