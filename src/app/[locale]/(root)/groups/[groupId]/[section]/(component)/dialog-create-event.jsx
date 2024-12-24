import { z } from "zod";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { DateTimePicker } from "@/components/date-and-time-picker";
import useUserId from "@/hooks/useUserId";
import { userApi } from "@/services/userApi";
import { schemaEvent } from "@/lib/schemas/event.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import useUploadImages from "@/hooks/useUploadImages";
import { eventApi } from "@/services/eventApi";
import { Loader2 } from "lucide-react";

export function DialogCreateEvent({ groupId }) {
    const [eventType, setEventType] = useState(null);
    const [socialType, setSocialType] = useState("OTHER");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const createEventMutation = eventApi.mutation.useCreateEvent(groupId)
    const {
        images,
        handleImageChange,
        removeImage,
        uploadImage,
    } = useUploadImages();

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm({
        resolver: zodResolver(schemaEvent),
        defaultValues: {
            eventName: "",
            description: "",
            groupId,
            time: null,
            eventType: null,
            socialType: "OTHER",
            link: "",
            location: "",
        },
    });

    const userId = useUserId();
    const { data: userInfo } = userApi.query.useGetUserInfoById(userId);

    const onSubmit = async (data) => {
        const { year, month, day, hour, minute, second, millisecond } = data.startDate;
        const date = new Date(Date.UTC(year, month - 1, day, hour, minute, second, millisecond));

        // Convert startDate to ISO string
        const startDateIsoString = date.toISOString();

        const uploadedImageUrls = await Promise.all(images.map((image) => uploadImage(image)));
        const formData = {
            ...data,
            eventType,
            startDate: startDateIsoString,
            eventPicture: uploadedImageUrls[0],
        };
        console.log('🚀 ~ onSubmit ~ formData:', formData)

        createEventMutation.mutate(formData, {
            onSuccess: () => {
                setIsDialogOpen(false);
                reset();
            },
        })

    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-primary hover:bg-primary-dark"
                    onClick={() => setIsDialogOpen(true)}
                >
                    Tạo sự kiện
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-2xl bg-background text-foreground">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Tạo sự kiện</DialogTitle>
                </DialogHeader>
                <Separator />
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={userInfo?.profilePictureUrl} />
                            <AvatarFallback className="uppercase">
                                {userInfo?.displayName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-semibold">{userInfo?.displayName} &middot;</p>
                        <p className="text-xs text-secondary-foreground">Người tạo event</p>
                    </div>

                    {/* Event Name */}
                    <div>
                        <Label htmlFor="eventName" className="text-sm font-medium">Tên sự kiện</Label>
                        <Input
                            id="eventName"
                            placeholder="Nhập tên sự kiện"
                            {...register("eventName", { required: "Tên sự kiện là bắt buộc" })}
                            className="mt-2"
                        />
                        {errors.eventName && (
                            <p className="text-red-500 text-xs">{errors.eventName.message}</p>
                        )}
                    </div>

                    {/* Event Description */}
                    <div>
                        <Label htmlFor="description" className="text-sm font-medium">Mô tả</Label>
                        <Textarea
                            id="description"
                            placeholder="Nhập mô tả sự kiện"
                            {...register("description")}
                            className="mt-2"
                            rows={3}
                        />
                    </div>

                    {/* Date and Time Picker */}
                    <div>
                        <Label htmlFor="time" className="text-sm font-medium">Thời gian</Label>
                        <Controller
                            name="startDate"
                            control={control}
                            rules={{ required: "Thời gian là bắt buộc" }}
                            render={({ field }) => (
                                <DateTimePicker
                                    id="time"
                                    aria-label="Chọn ngày và giờ"
                                    granularity="minute"
                                    value={field.value}
                                    onChange={(date) => {
                                        field.onChange(date);
                                    }}
                                />
                            )}
                        />
                        {errors.time && (
                            <p className="text-red-500 text-xs">{errors.time.message}</p>
                        )}
                    </div>

                    {/* Event Type */}
                    <div>
                        <Label htmlFor="eventType" className="text-sm font-medium">Hình thức</Label>
                        <Controller
                            name="eventType"
                            control={control}
                            defaultValue={null}
                            rules={{ required: "Hình thức sự kiện là bắt buộc" }}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setEventType(value);
                                        if (value !== "ONLINE") {
                                            setSocialType("OTHER");
                                        }
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Chọn hình thức sự kiện" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="OFFLINE">Trực tiếp</SelectItem>
                                            <SelectItem value="ONLINE">Online</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.eventType && (
                            <p className="text-red-500 text-xs">{errors.eventType.message}</p>
                        )}
                    </div>

                    {/* Conditional Inputs */}
                    {eventType === "ONLINE" && (
                        <>
                            <div>
                                <Label htmlFor="socialType" className="text-sm font-medium">Nền tảng</Label>
                                <Controller
                                    name="socialType"
                                    control={control}
                                    defaultValue="OTHER"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSocialType(value);
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Chọn nền tảng" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="OTHER">Khác</SelectItem>
                                                    <SelectItem value="MIF_LIVE">MIF Live</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            {socialType === "OTHER" && (
                                <div>
                                    <Label htmlFor="link" className="text-sm font-medium">Link online</Label>
                                    <Input
                                        id="link"
                                        placeholder="Nhập link sự kiện"
                                        {...register("link", { required: socialType === "OTHER" ? "Link sự kiện là bắt buộc" : false })}
                                    />
                                    {errors.link && <p className="text-red-500 text-xs">{errors.link.message}</p>}
                                </div>
                            )}
                        </>
                    )}

                    {eventType === "OFFLINE" && (
                        <div>
                            <Label htmlFor="location" className="text-sm font-medium">Địa điểm</Label>
                            <Input
                                id="location"
                                placeholder="Nhập địa điểm tổ chức sự kiện"
                                {...register("location", { required: "Địa điểm là bắt buộc" })}
                            />
                            {errors.location && <p className="text-red-500 text-xs">{errors.location.message}</p>}
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <Label htmlFor="eventImage" className="text-sm font-medium">Ảnh sự kiện</Label>
                        <Input
                            type="file"
                            id="eventImage"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={createEventMutation.isPending}>
                            {createEventMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Tạo sự kiện
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}