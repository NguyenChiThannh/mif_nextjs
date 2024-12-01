"use client"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Loading from "@/components/loading"
import { useState } from "react"
import { categoryApi } from "@/services/movieCategoriesApi"

export function ComboboxMovieCategory() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")

    const { data: movieCategories, isLoading: isLoadingMovieCategories } = categoryApi.query.useGetAllmovieCategories()

    if (isLoadingMovieCategories) return <Loading />

    // Format category 
    const formattedCategories = movieCategories.map((category) => ({
        value: category.categoryName,
        label: category.categoryName,
    }));

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? formattedCategories.find((category) => category.value === value)?.label
                        : "Thể loại"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Thể loại" />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy category</CommandEmpty>
                        <CommandGroup>
                            {formattedCategories.map((category) => (
                                <CommandItem
                                    key={category.value}
                                    value={category.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === category.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {category.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
