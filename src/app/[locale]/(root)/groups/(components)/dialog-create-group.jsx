"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { schemaGroup } from "@/lib/schemas/group.schema";
import { groupsApi } from "@/services/groupsApi";
import { useState } from "react";
import { Loader2, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export function DialogCreateGroup({ movieCategories }) {
  const t = useTranslations("Groups");
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schemaGroup),
    defaultValues: {
      groupName: "",
      description: "",
      categoryId: "",
      isPublic: false,
      groupType: "SMALL",
    },
  });

  const mutation = groupsApi.mutation.useCreateGroup();

  const onSubmit = (data) => {
    mutation.mutate(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          onClick={() => setIsOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t("DialogCreateGroup.create_group")}
        </Button>
      </DialogTrigger>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="sm:max-w-[480px] bg-background border-border">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-foreground">{t("DialogCreateGroup.create_group")}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="groupName" className="text-right text-foreground">
                      {t("DialogCreateGroup.group_name")}
                    </Label>
                    <Input
                      id="groupName"
                      {...register("groupName")}
                      className="col-span-3 bg-background border-border focus:border-primary transition-colors duration-200"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right text-foreground">
                      {t("DialogCreateGroup.category")}
                    </Label>
                    <Controller
                      name="categoryId"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger className="col-span-3 bg-background border-border focus:border-primary transition-colors duration-200">
                            <SelectValue
                              placeholder={t("DialogCreateGroup.category")}
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectGroup>
                              <SelectLabel className="text-foreground">
                                {t("DialogCreateGroup.category")}
                              </SelectLabel>
                              {movieCategories?.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                  className="focus:bg-muted transition-colors duration-200"
                                >
                                  {category.categoryName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  {errors.categoryId && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <p></p>
                      <p className="text-destructive col-span-3 text-xs font-bold">
                        {errors.categoryId.message}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="isPublic" className="text-right text-foreground">
                      {t("DialogCreateGroup.group_status")}
                    </Label>
                    <Controller
                      name="isPublic"
                      control={control}
                      render={({ field }) => (
                        <Select
                          value={
                            field.value !== undefined
                              ? String(field.value)
                              : undefined
                          }
                          onValueChange={(value) => field.onChange(value === "true")}
                        >
                          <SelectTrigger className="col-span-3 bg-background border-border focus:border-primary transition-colors duration-200">
                            <SelectValue
                              placeholder={t("DialogCreateGroup.group_status")}
                            >
                              {field.value !== undefined
                                ? field.value
                                  ? t("DialogCreateGroup.public")
                                  : t("DialogCreateGroup.private")
                                : t("DialogCreateGroup.group_status")}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="bg-background border-border">
                            <SelectGroup>
                              <SelectLabel className="text-foreground">
                                {t("DialogCreateGroup.group_status")}
                              </SelectLabel>
                              <SelectItem
                                value="true"
                                className="focus:bg-muted transition-colors duration-200"
                              >
                                {t("DialogCreateGroup.public")}
                              </SelectItem>
                              <SelectItem
                                value="false"
                                className="focus:bg-muted transition-colors duration-200"
                              >
                                {t("DialogCreateGroup.private")}
                              </SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <Controller
                    name="groupType"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="flex justify-evenly mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="SMALL" id="small" className="text-primary" />
                          <Label htmlFor="small" className="text-foreground">500 {t("members")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="MEDIUM" id="medium" className="text-primary" />
                          <Label htmlFor="medium" className="text-foreground">1000 {t("members")}</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="LARGE" id="large" className="text-primary" />
                          <Label htmlFor="large" className="text-foreground">1500 {t("members")}</Label>
                        </div>
                      </RadioGroup>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-muted transition-colors duration-200"
                  >
                    {t("DialogCreateGroup.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-200"
                  >
                    {mutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("DialogCreateGroup.create_group")}
                  </Button>
                </DialogFooter>
              </form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
