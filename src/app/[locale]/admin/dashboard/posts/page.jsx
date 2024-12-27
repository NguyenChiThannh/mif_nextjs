'use client'
import { Button } from '@/components/ui/button'
import React, { useMemo, useState } from 'react'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { useRouter } from 'next/navigation'
import DialogConfirmDelete from '@/components/dialog-confirm-delete'
import Loading from '@/components/loading'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { groupsApi } from '@/services/groupsApi'
import { MoreHorizontal } from 'lucide-react'
import { groupPostApi } from '@/services/groupPostApi'
import DialogDetailPost from '@/app/[locale]/admin/dashboard/posts/(components)/dialog-detail-post'


export default function PostsAdmin() {
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize] = useState(10)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    const router = useRouter();

    const { isLoading: isLoadingPosts, data: postsData } = groupPostApi.query.useGetAllPostsTable(currentPage, pageSize)

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage)
    }

    const openDialog = (user) => {
        setSelectedPost(user);
        setIsDialogOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
            },
            {
                accessorKey: 'content',
                header: 'Content',
                className: '',
                cell: ({ row }) => (
                    <div className="max-w-xs">{row.getValue('content')}</div>
                )
            },
            {
                accessorKey: 'owner.displayName',
                header: 'Owner',
            },
            {
                accessorKey: 'voteNumber',
                header: 'Vote Number',
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
                                <DropdownMenuItem onClick={() => router.push(`/groups/${row.original.id}`)}>Block</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ),
            },
        ],
        [router]
    );

    const table = useReactTable({
        data: postsData?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoadingPosts) return <Loading />

    return (
        <div>
            <div className="bg-background p-6">
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
                                const totalPages = postsData?.totalPages || 1;
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
                                    disabled={currentPage >= (postsData?.totalPages - 1)}
                                    className={currentPage >= (postsData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>

                <DialogConfirmDelete />

                {selectedPost && (
                    <DialogDetailPost
                        isOpen={isDialogOpen}
                        onClose={() => setIsDialogOpen(false)}
                        postData={selectedPost}
                        router={router}
                    />
                )}
            </div>
        </div>
    )
}
