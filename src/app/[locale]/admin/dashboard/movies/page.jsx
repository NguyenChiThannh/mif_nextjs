'use client';
import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatter';
import { movieApi } from '@/services/movieApi';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"


export default function Movies() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(10);

    const {
        data: moviesData,
        isLoading,
    } = movieApi.query.useGetAllMoviesTable(currentPage, pageSize);

    const deleteMovieMutation = movieApi.mutation.useDeleteMovie();

    const handleDeleteMovie = (movieId) => {
        confirmDelete('', (result) => {
            if (result) {
                deleteMovieMutation.mutate(movieId);
            }
        });

    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const columns = useMemo(
        () => [
            {
                accessorKey: 'title',
                header: 'Title',
            },
            {
                accessorKey: 'releaseDate',
                header: 'Release Date',
                cell: ({ row }) => formatDate(row.original?.releaseDate),
            },
            {
                accessorKey: 'genre',
                header: 'Genre',
                cell: ({ row }) => {
                    const genres = row.original.genre;
                    const genreNames = genres.map((genre) => genre.categoryName).join(", ");
                    return genreNames;
                },
                enableSorting: false,
            },
            {
                accessorKey: 'ratings.averageRating',
                header: 'Rating',
                cell: ({ row }) => row.original.ratings?.averageRating || '0.0',
            },
            {
                accessorKey: 'budget',
                header: 'Budget',
                cell: ({ row }) => `$${row.original.budget?.toLocaleString() || 'N/A'}`,
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
                                <DropdownMenuItem onClick={() => router.push(`/movies/${row.original.id}`)}>View</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/movies/edit/${row.original.id}`)}>Edit</DropdownMenuItem>
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
        data: moviesData?.content || [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // onSortingChange: setSorting,
        // state: {
        //     sorting,
        // },
    });

    if (isLoading) return <Loading />;

    return (
        <div className="bg-background p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search movies..."
                        className="max-w-sm"
                    />
                </div>
                <Button onClick={() => router.push('/admin/dashboard/movies/create')}>
                    Add Movie
                </Button>
            </div>

            <div className="rounded-md">
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
            </div>

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
                            const totalPages = moviesData?.totalPages || 1;
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
                                disabled={currentPage >= (moviesData?.totalPages - 1)}
                                className={currentPage >= (moviesData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <DialogConfirmDelete />
        </div>
    );

}
