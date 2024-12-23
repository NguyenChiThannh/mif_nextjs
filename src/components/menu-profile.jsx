import {
    CreditCard,
    House,
    LifeBuoy,
    LogOut,
    Settings,
    ShieldCheck,
    User,
} from "lucide-react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/store";
import { setAuthState } from "@/redux/slices/authSlice";
import { toast } from "react-toastify";
import Link from "next/link";
import { userApi } from "@/services/userApi";
import { useGetRole } from "@/hooks/useGetRole";

export function MenuProfile({ id, admin = false, goToAdmin, goToHome }) {
    const router = useRouter();
    const { role } = useGetRole()
    console.log('🚀 ~ MenuProfile ~ role:', role)
    console.log('🚀 ~ MenuProfile ~ role:', role)
    const dispatch = useAppDispatch();
    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const authState = {
                    isLogin: false,
                    accessToken: '',
                };
                dispatch(setAuthState(authState));

                toast.success('Đăng xuất thành công');
                admin ? router.push('/admin/sign-in') : router.push('/sign-in')
            } else {
                toast.error('Đăng xuất thất bại');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại');
        }
    };

    const { data, isLoading } = userApi.query.useGetUserInfoById(id)

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Avatar className="w-8 h-8 flex items-center justify-center object-contain">
                        <AvatarImage src={data?.profilePictureUrl} alt="@shadcn" />
                        <AvatarFallback className="flex items-center justify-center uppercase">{data?.displayName && data?.displayName[0]}</AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 overflow-hidden">
                    <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {
                        role === 'ADMIN' && goToAdmin &&
                        <DropdownMenuItem>
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            <Link
                                href={'/admin/dashboard'}
                            >Trang Admin
                            </Link>
                        </DropdownMenuItem>
                    }
                    {
                        goToHome &&
                        <DropdownMenuItem>
                            <House className="mr-2 h-4 w-4" />
                            <Link
                                href={'/'}
                            >Trang Home
                            </Link>
                        </DropdownMenuItem>
                    }
                    {
                        !admin &&
                        <>
                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <Link
                                        href={`/user/${id}`}
                                        className="w-full h-full flex"
                                    >
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Trang cá nhân</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    <span>Thanh toán</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Cài đặt</span>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <LifeBuoy className="mr-2 h-4 w-4" />
                                <span>Hỗ trợ</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    }
                    <DropdownMenuItem onClick={() => handleLogout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}