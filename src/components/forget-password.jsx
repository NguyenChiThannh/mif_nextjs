"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPasswordApi } from "@/services/resetPassword";
import { useState } from "react"
import DialogOTP from "@/components/dialog-otp";
import DialogNewPassword from "@/components/dialog-new-password"

export function ForgetPassword({ t }) {
  const [email, setEmail] = useState("");
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);
  const requestPasswordResetMutation = resetPasswordApi.mutation.useRequestPasswordReset();

  const handleSendEmail = async () => {
    await requestPasswordResetMutation.mutateAsync({ email }, {
      onSuccess: () => {
        setIsOTPOpen(true);
      },
    });
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Label
            className="ml-auto text-sm underline"
          >
            {t('forget_password_title')}
          </Label>
        </DialogTrigger>
        <DialogContent className="max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('forget_password_title')}</DialogTitle>
            <DialogDescription>
              {t('forget_password_description')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t('email')}
              </Label>
              <Input
                id="email"
                placeholder={t('email')}
                className="col-span-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleSendEmail}>{t('forget_password_action')}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isOTPOpen && <DialogOTP t={t} onClose={() => setIsOTPOpen(false)} type={"reset"} setIsNewPasswordOpen={setIsNewPasswordOpen}/>}
      {isNewPasswordOpen && <DialogNewPassword t={t} onClose={() => setIsNewPasswordOpen(false)} />}
    </>
  )
}


