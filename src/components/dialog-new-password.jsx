"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState } from "react"
import { schemaNewPassword } from "@/lib/schemas/auth.schema"
import { useTranslations } from "next-intl"
import { authApi } from "@/services/authApi"


export default function DialogNewPassword() {
  const [isOpen, setIsOpen] = useState(true)
  const tSchema = useTranslations('Schema.auth');
  const newPasswordMutation = authApi.mutation.useNewPassword()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schemaNewPassword(tSchema))
  })

  const onSubmit = (data) => {
    newPasswordMutation.mutate(data, {
      onSuccess: () => {
        reset()
        setIsOpen(false)
      },
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Đổi mật khẩu</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div>
            <label className="font-medium">Mật khẩu mới</label>
            <Input type="password" {...register("newPassword")} />
            {errors.newPassword && (
              <p className="text-sm text-red-500 font-semibold mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="font-medium">Xác nhận mật khẩu mới</label>
            <Input type="password" {...register("confirmPassword")} />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 font-semibold mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
