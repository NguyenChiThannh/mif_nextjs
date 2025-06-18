'use client'
import React, { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { groupPostApi } from '@/services/groupPostApi'

// Components
import { Button } from '@/components/ui/button'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import DialogConfirmDelete from '@/components/dialog-confirm-delete'
import Loading from '@/components/loading'
import DialogDetailPost from '@/app/[locale]/admin/dashboard/posts/(components)/dialog-detail-post'
import { MoreHorizontal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { renderContent } from '@/lib/convert'

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

    const openDialog = (post) => {
        setSelectedPost(post);
        setIsDialogOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
                cell: ({ row }) => {
                    const title = row.getValue('title');
                    const truncated = title.length > 50 ? title.slice(0, 50) + '...' : title;
                    return <span title={title}>{truncated}</span>;
                }
            },
            {
                accessorKey: 'content',
                header: 'Content',
                cell: ({ row }) => {
                    const content = row.getValue('content');
                    return (
                        <div className="max-w-xs text-justify">
                            {renderContent(content)}
                        </div>
                    );
                }
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
        <div className="bg-background p-6">
            <div className="flex items-center justify-end mb-6 gap-4">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search posts..."
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

            <PaginationComponent
                currentPage={currentPage}
                totalPages={postsData?.totalPages || 1}
                onPageChange={handlePageChange}
            />

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
    )
}

// Extracted pagination component for better readability
function PaginationComponent({ currentPage, totalPages, onPageChange }) {
    return (
        <div className="mt-4">
            <Pagination>
                <PaginationContent>
                    <PaginationItem className="mt-4 shadow-md rounded-lg">
                        <PaginationPrevious
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    {(() => {
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
                                        onClick={() => onPageChange(pageNumber)}
                                    >
                                        {pageNumber + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        });
                    })()}

                    <PaginationItem className="mt-4 shadow-md rounded-lg">
                        <PaginationNext
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage >= (totalPages - 1)}
                            className={currentPage >= (totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
}
