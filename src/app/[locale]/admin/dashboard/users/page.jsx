'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MoreHorizontal } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import Loading from '@/components/loading'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useRouter } from 'next/navigation'
import { userApi } from '@/services/userApi'
import { formatDate } from '@/lib/formatter'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import DialogDetailUser from '@/app/[locale]/admin/dashboard/users/(components)/dialog-detail-user'

export default function Users() {
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const router = useRouter();

    const { isLoading: isLoadingUsers, data: usersData } = userApi.query.useGetAllUsersTable(currentPage, pageSize);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const openDialog = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'email',
                header: 'Email',
            },
            {
                accessorKey: 'displayName',
                header: 'Display Name',
            },
            {
                accessorKey: 'dob',
                header: 'Day of birth',
                cell: ({ row }) => formatDate(row.original.dob),
            },
            {
                accessorKey: 'isActive',
                header: 'isActive',
            },
            {
                accessorKey: 'userType',
                header: 'Type',
            },
            {
                accessorKey: 'authorities',
                header: 'Role',
                cell: ({ row }) => row.getValue('authorities')?.[row.getValue('authorities').length - 1]?.authority,
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
                                <DropdownMenuItem>Ban</DropdownMenuItem>
                                <DropdownMenuItem>Block</DropdownMenuItem>
                                <DropdownMenuItem>Promote</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: usersData?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingUsers) return <Loading />;

    return (
        <div>
            <div className="bg-background p-6">
                {/* Table */}
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={header.column.getCanSort() ? "cursor-pointer select-none" : ""}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination */}
                <div className="mt-4">
                    <Pagination>
                        <PaginationContent>
                            {/* Previous Button */}
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 0}
                                    className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>

                            {/* Page Numbers */}
                            {(() => {
                                const totalPages = usersData?.totalPages || 1;
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
                            {/* Next Button */}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage >= (usersData?.totalPages - 1)}
                                    className={currentPage >= (usersData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                {selectedUser && (
                    <DialogDetailUser
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        userData={selectedUser}
                    />
                )}
            </div>
        </div>
    );
}
