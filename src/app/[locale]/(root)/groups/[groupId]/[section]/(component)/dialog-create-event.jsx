import { DatePickerPopover } from "@/components/date-picker-popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import useUserId from "@/hooks/useUserId"
import { schemaPost } from "@/lib/schemas/post-group.schema"
import { userApi } from "@/services/userApi"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload, X } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useForm } from "react-hook-form"

export function DialogCreateEvent() {
    const t = useTranslations('Groups')
    const userId = useUserId();
    const { data: userInfo } = userApi.query.useGetUserInfoById(userId)

    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schemaPost),
    });

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm">
                    Tạo sự kiện
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Tạo sự kiện</DialogTitle>
                </DialogHeader>
                <Separator />
                <form
                    // onSubmit={handleSubmit(onSubmit)}
                    className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={userInfo?.profilePictureUrl} />
                            <AvatarFallback className="uppercase">
                                {userInfo?.displayName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">{userInfo?.displayName}</p>
                    </div>

                    <div>
                        <Label htmlFor="title" className="text-sm font-medium">Tên sự kiện</Label>
                        <Input
                            id="title"
                            placeholder={t("title_placeholder")}
                            {...register("title", { required: true })}
                            className="mt-2"
                            required
                        />
                        {errors.title && <p className="text-red-500 text-xs">{t("title_error")}</p>}
                    </div>

                    <div>
                        <Label htmlFor="content" className="text-sm font-medium">Mô tả</Label>
                        <Textarea
                            id="content"
                            placeholder={t("content_placeholder")}
                            {...register("content", { required: true })}
                            className="mt-2"
                            rows={5}
                        />
                        {errors.content && <p className="text-red-500 text-xs">{t("content_error")}</p>}
                    </div>

                    <div>
                        <Label htmlFor="imageUpload" className="cursor-pointer flex items-center gap-2 text-sm font-medium">
                            <Upload className="w-4 h-4" />
                            Ảnh sự kiện
                        </Label>
                        <input
                            type="file"
                            id="imageUpload"
                            className="hidden"
                            multiple
                        // onChange={handleImageChange}
                        />
                        <div className="flex flex-wrap gap-3 mt-3">
                            {/* {images.map((image, index) => (
                                <div key={index} className="relative group">
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt={`image-${index}`}
                                        width={64}
                                        height={64}
                                        className="w-32 h-32 rounded object-cover"
                                    />
                                    <Button
                                        size="icon"
                                        variant="destructive"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))} */}
                        </div>
                    </div>
                    <div className="flex">
                        <Label htmlFor="content" className="text-sm font-medium">Thời gian</Label>
                        <DatePickerPopover
                        // selected={field.value ?? undefined}
                        // onSelect={field.onChange}
                        />
                        <Input
                            id="title"
                            placeholder={t("title_placeholder")}
                            {...register("title", { required: true })}
                            className="mt-2"
                            required
                        />
                    </div>

                    <div >
                        <Label htmlFor="content" className="text-sm font-medium">Hình thức</Label>
                        <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Fruits</SelectLabel>
                                    <SelectItem value="apple">Apple</SelectItem>
                                    <SelectItem value="banana">Banana</SelectItem>
                                    <SelectItem value="blueberry">Blueberry</SelectItem>
                                    <SelectItem value="grapes">Grapes</SelectItem>
                                    <SelectItem value="pineapple">Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="flex justify-end">
                        <Button type="submit" >
                            Tạo
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
