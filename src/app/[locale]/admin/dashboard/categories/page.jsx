'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, Calendar, ChevronLeft, ChevronRight, Ellipsis, Eye, FilePen, Filter, House, LineChart, ListOrdered, MoreHorizontal, Newspaper, Package, Tag, Trash, User, Users } from 'lucide-react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/services/movieCategoriesApi'
import DialogCategory from '@/components/dialog-category'
import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete'
import { formatDate } from '@/lib/formatter'


export default function CategoriesPage() {
    const queryClient = useQueryClient();
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const [idEdit, setIdEdit] = useState(false);
    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()

    const deleteMutation = categoryApi.mutation.useDeleteCategory()

    const hanleDeleteCategory = async (id) => {
        confirmDelete('', (result) => {
            if (result) {
                deleteMutation.mutate(id);
            }
        });
    }

    return (
        <div>
            <div className="bg-background p-6">
                {/* Header */}
                <div className="flex items-center justify-end mb-6">
                    <div className='flex items-center gap-2'>
                        {/* <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <Filter className="w-5 h-5 mr-2" />
                                    Filter
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-64">
                                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuCheckboxItem>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Published Date
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    <User className="w-4 h-4 mr-2" />
                                    Author
                                </DropdownMenuCheckboxItem>
                                <DropdownMenuCheckboxItem>
                                    <Tag className="w-4 h-4 mr-2" />
                                    Category
                                </DropdownMenuCheckboxItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    <ListOrdered className="w-5 h-5 mr-2" />
                                    Sort
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuRadioGroup value="published_date">
                                    <DropdownMenuRadioItem value="published_date">Published Date</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="author">Author</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="title">Title</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu> */}
                        <Button onClick={() => {
                            setIsOpenDialog(true)
                            setIdEdit(null)
                        }}>Add</Button>
                        <DialogCategory
                            isOpenDialog={isOpenDialog}
                            setIsOpenDialog={setIsOpenDialog}
                            queryClient={queryClient}
                            idEdit={idEdit}
                        />
                    </div>
                </div>
                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>CreatedAt</TableHead>
                            <TableHead>UpdatedAt</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movieCategories?.map(category => {
                            return (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        {category?.categoryName}
                                    </TableCell>
                                    <TableCell className="truncate max-w-xs">
                                        {category?.description}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(category?.createdAt)}
                                    </TableCell>
                                    <TableCell>
                                        {formatDate(category?.updatedAt)}
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <DropdownMenu modal={false}>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem onClick={() => {
                                                    setIsOpenDialog(true)
                                                    setIdEdit(category.id)
                                                }}>Edit</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => { hanleDeleteCategory(category.id) }}>Delete</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
            <DialogConfirmDelete />
        </div>
    )
}
