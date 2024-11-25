
import { Button } from '@/components/ui/button'; // Chỉnh sửa đường dẫn theo cấu trúc của bạn
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input'; // Chỉnh sửa đường dẫn theo cấu trúc của bạn
import { authApi } from '@/services/authApi';
import { useState } from 'react';

export default function DialogOTP() {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const [isDialogOpen, setIsDialogOpen] = useState(true);

    const verifyOTPmutation = authApi.mutation.useVerifyOTP()

    const router = useRouter()

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (/[^0-9]/.test(value)) return; // Chỉ cho phép nhập số
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < otp.length - 1) {
            // Tự động chuyển sang input tiếp theo
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleSubmit = () => {
        const data = {
            otp: otp.join('')
        }
        verifyOTPmutation.mutate(data, {
            onSuccess: () => {
                setIsDialogOpen(false);
                router.push('/sign-up');
            }
        })
    };

    return (
        <Dialog open={isDialogOpen}>
            {/* <DialogTrigger asChild>
                <Button className="w-full">Nhập mã OTP</Button>
            </DialogTrigger> */}

            <DialogContent className="w-[90%] sm:w-[400px] p-6 bg-background border border-border rounded-lg shadow-lg">
                <DialogHeader className="text-center">
                    <h2 className="text-2xl font-semibold text-foreground">Xác nhận OTP</h2>
                    <p className="text-sm text-muted-foreground mt-2">Nhập mã OTP gửi đến số điện thoại của bạn</p>
                </DialogHeader>

                <div className="flex justify-center space-x-2 mt-6">
                    {otp.map((digit, index) => (
                        <Input
                            key={index}
                            id={`otp-input-${index}`}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center text-xl border border-border rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                            autoFocus={index === 0}
                        />
                    ))}
                </div>

                <DialogFooter className="mt-6 flex justify-center gap-4">
                    {/* <Button variant="outline" onClick={() => alert('OTP đã hết hạn!')} className="w-1/3">
                        Hủy
                    </Button> */}
                    <Button onClick={handleSubmit} className="w-1/3">
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
