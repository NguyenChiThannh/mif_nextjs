'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'
import { useQueryClient } from '@tanstack/react-query'
import { categoryApi } from '@/services/movieCategoriesApi'
import DialogCategory from '@/components/dialog-category'
import DialogConfirmDelete, {
  confirmDelete,
} from '@/components/dialog-confirm-delete'
import { formatDate } from '@/lib/formatter'

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [idEdit, setIdEdit] = useState(null)
  const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()
  const deleteMutation = categoryApi.mutation.useDeleteCategory()

  const handleDeleteCategory = async (id) => {
    confirmDelete('', (result) => {
      if (result) {
        deleteMutation.mutate(id)
      }
    })
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='flex items-center justify-end mb-6'>
        <Button
          onClick={() => {
            setIsOpenDialog(true)
            setIdEdit(null)
          }}
        >
          Add Category
        </Button>
      </div>

      {/* Table */}
      <div className='rounded-lg shadow-lg border border-border bg-card text-card-foreground'>
        <Table className='w-full'>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead className='px-4 py-3 text-left'>Category</TableHead>
              <TableHead className='px-4 py-3 text-left'>Description</TableHead>
              <TableHead className='px-4 py-3 text-left'>CreatedAt</TableHead>
              <TableHead className='px-4 py-3 text-left'>UpdatedAt</TableHead>
              <TableHead className='px-4 py-3 text-right'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieCategories?.map((category) => (
              <TableRow key={category.id} className='hover:bg-muted transition'>
                <TableCell className='px-4 py-3'>
                  {category?.categoryName}
                </TableCell>
                <TableCell className='px-4 py-3 truncate max-w-xs'>
                  {category?.description}
                </TableCell>
                <TableCell className='px-4 py-3'>
                  {formatDate(category?.createdAt)}
                </TableCell>
                <TableCell className='px-4 py-3'>
                  {formatDate(category?.updatedAt)}
                </TableCell>
                <TableCell className='px-4 py-3 flex items-center gap-2 justify-end'>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup='true' size='icon' variant='ghost'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setIsOpenDialog(true)
                          setIdEdit(category.id)
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DialogCategory
        isOpenDialog={isOpenDialog}
        setIsOpenDialog={setIsOpenDialog}
        queryClient={queryClient}
        idEdit={idEdit}
      />
      <DialogConfirmDelete />
    </div>
  )
}
