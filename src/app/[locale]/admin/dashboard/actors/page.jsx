'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar, ChevronLeft, ChevronRight, Clock, Ellipsis, Eye, FilePen, Filter, House, LineChart, ListOrdered, MoreHorizontal, Newspaper, Package, Star, Tag, Trash, TrendingUp, User, Users } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import Link from "next/link"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { actorApi, getTopActors } from '@/services/actorApi'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import DialogConfirmDelete from '@/components/dialog-confirm-delete'
import Loading from '@/components/loading'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'


export default function Actors() {
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)

    const router = useRouter();

    const { isLoading: isLoadingActors, data: actorsData } = actorApi.query.useGetTopActors(currentPage, pageSize, true)
    console.log('🚀 ~ Actors ~ actorsData:', actorsData)

    const deleteMutation = actorApi.mutation.useDeleteActor()


    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const hanleEditActor = (id) => {
        router.push(`/dashboard/actors/edit?id=${id}`)
    }

    const hanleDeleteActor = (actorId) => {
        confirmDelete('', (result) => {
            if (result) {
                deleteMutation.mutate(actorId);
            }
        });

    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'name',
                header: 'Name',
            },
            {
                accessorKey: 'favoriteCount',
                header: 'Favorite Count',
            },
            {
                accessorKey: 'awards',
                header: 'Awards',
                cell: ({ row }) => row.original.awards.length || 0,
            },
            {
                accessorKey: 'ratings.scoreRank',
                header: 'Score',
                cell: ({ row }) => Number(row.original.scoreRank).toFixed(1),
            },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => router.push(`/actor/${row.original.id}`)}>View</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/actors/edit/${row.original.id}`)}>Edit</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteMovie(row.original.id)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        ],
        [router]
    );

    const table = useReactTable({
        data: actorsData?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingActors) return <Loading />

    return (
        <div>
            <div className="bg-background p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Input
                            placeholder="Search articles..."
                            className="text-muted-foreground" />
                    </div>
                    <div className='flex items-center gap-2'>
                        <Button onClick={() => { router.push('/admin/dashboard/actors/create') }}>Add Actor</Button>
                    </div>
                </div>
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {(() => {
                                const totalPages = actorsData?.totalPages || 1;
                                const pageNumbers = [];

                                pageNumbers.push(0);

                                let start = Math.max(1, currentPage - 1);
                                let end = Math.min(currentPage + 1, totalPages - 2);

                                if (start > 1) {
                                    pageNumbers.push('...');
                                }

                                for (let i = start; i <= end; i++) {
                                    pageNumbers.push(i);
                                }

                                if (end < totalPages - 2) {
                                    pageNumbers.push('...');
                                }

                                if (totalPages > 1) {
                                    pageNumbers.push(totalPages - 1);
                                }

                                return pageNumbers.map((pageNumber, index) => {
                                    if (pageNumber === '...') {
                                        return (
                                            <PaginationItem key={`ellipsis-${index}`}>
                                                <span className="px-4">...</span>
                                            </PaginationItem>
                                        );
                                    }

                                    return (
                                        <PaginationItem key={pageNumber}>
                                            <PaginationLink
                                                href="#"
                                                isActive={pageNumber === currentPage}
                                                onClick={() => handlePageChange(pageNumber)}
                                            >
                                                {pageNumber + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                });
                            })()}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= (actorsData?.totalPages - 1)}
                                    className={currentPage >= (actorsData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                <DialogConfirmDelete />
            </div>
        </div>
    )
}
