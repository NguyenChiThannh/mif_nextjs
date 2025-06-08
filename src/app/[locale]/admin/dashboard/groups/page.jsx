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
import { groupsApi } from '@/services/groupsApi'
import DialogDetailGroup from '@/app/[locale]/admin/dashboard/groups/(components)/dialog-detail-group'


export default function GroupsAdmin() {
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedGroup, setSelectedGroup] = useState(null);

    const router = useRouter();

    const { isLoading: isLoadingGroups, data: groupsData } = groupsApi.query.useFindAllGroupsAsPage(currentPage, pageSize)

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const openDialog = (group) => {
        setSelectedGroup(group);
        setIsDialogOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'groupName',
                header: 'Group Name',
            },
            {
                accessorKey: 'owner.displayName',
                header: 'Owner',
            },
            {
                accessorKey: 'groupType',
                header: 'Group Type',
            },
            {
                accessorKey: 'memberCount',
                header: 'Member',
            },
            {
                accessorKey: 'weeklyPostCount',
                header: 'Post/week',
                cell: ({ row }) => row.original?.weeklyPostCount || 0,
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
                                <DropdownMenuItem onClick={() => openDialog(row.original)}>View</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: groupsData?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingGroups) return <Loading />

    return (
        <div className="bg-background p-6">
             <div className="flex items-center justify-end mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search groups..."
                        className="text-muted-foreground" />
                </div>
            </div>
            <div className="border border-border shadow-lg rounded-lg overflow-hidden mt-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
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
                            <TableRow key={row.id} className="hover:bg-muted transition">
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
            </div>

            <div className="mt-4">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem className="mt-4 shadow-md rounded-lg">
                            <PaginationPrevious
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 0}
                                className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>

                        {(() => {
                            const totalPages = groupsData?.totalPages || 1;
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
                                        <PaginationItem key={`ellipsis-${index}`} className="mt-4 shadow-md rounded-lg">
                                            <span className="px-4">...</span>
                                        </PaginationItem>
                                    );
                                }

                                return (
                                    <PaginationItem key={pageNumber} className="mt-4 shadow-md rounded-lg">
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

                        <PaginationItem className="mt-4 shadow-md rounded-lg">
                            <PaginationNext
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= (groupsData?.totalPages - 1)}
                                className={currentPage >= (groupsData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <DialogConfirmDelete />

            {selectedGroup && (
                <DialogDetailGroup
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    groupData={selectedGroup}
                    router={router}
                />
            )}

        </div>
    )
}
