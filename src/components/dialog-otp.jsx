"use client"
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { authApi } from '@/services/authApi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { OTPInput } from "input-otp";
import { useTranslations } from 'next-intl';

export default function DialogOTP({ t, type, setIsNewPasswordOpen }) {
    const tSchema = useTranslations('Schema.auth');
    const [otp, setOtp] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(true);
    const [error, setError] = useState("");

    const verifyOTPmutation = authApi.mutation.useVerifyOTP();
    const verifyRequestPassOTPMutation = authApi.mutation.useVerifyRequestPassOTP();

    const router = useRouter();

    const handleChange = (value) => {
        const numericValue = value.replace(/[^0-9]/g, '');
        setOtp(numericValue);
        setError("");
    };

    const handleSubmit = (e) => {
        e.stopPropagation();

        if (otp.length !== 6) {
            setError(tSchema("otp_length_error"));
            return;
        }

        const data = { otp: otp };
        if (type === "reset") {
            verifyRequestPassOTPMutation.mutate(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setIsNewPasswordOpen(true);
                },
            });
        } else if (type === "verify") {
            verifyOTPmutation.mutate(data, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    router.push('/sign-in');
                },
            });
        }
    };

    const handleClose = (e) => {
        e.stopPropagation();
        setIsDialogOpen(false);
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
            </DialogTrigger>

            <DialogContent className="w-fit p-6 bg-background border border-border rounded-lg shadow-lg">
                <DialogHeader className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">{t("otp_title")}</h2>
                    <p className="text-sm text-muted-foreground mt-2">{t("otp_description")}</p>
                </DialogHeader>

                <div className="flex justify-center">
                    <OTPInput
                        id="input-58"
                        containerClassName="flex items-center gap-3 has-[:disabled]:opacity-50"
                        maxLength={6}
                        value={otp}
                        onChange={handleChange}
                        inputType="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        render={({ slots }) => (
                            <div className="flex gap-2">
                                {slots.map((slot, idx) => (
                                    <Slot key={idx} {...slot} />
                                ))}
                            </div>
                        )}
                    />
                </div>
                {error && (
                    <p className="text-red-500 text-sm text-center mt-2">{error}</p>
                )}

                <DialogFooter className="mt-6 flex justify-center gap-4">
                    <Button onClick={handleSubmit} className="w-1/3">
                        {t("otp_action")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function Slot(props) {
    return (
        <div
            className={cn(
                "flex size-9 items-center justify-center rounded-lg border border-input bg-background font-medium text-foreground shadow-sm shadow-black/5 transition-shadow",
                { "z-10 border border-ring ring-[3px] ring-ring/20": props.isActive },
            )}
        >
            {props.char !== null && <div>{props.char}</div>}
        </div>
    );
}
