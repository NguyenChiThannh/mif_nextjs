'use client';
import DialogConfirmDelete, { confirmDelete } from '@/components/dialog-confirm-delete';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDate } from '@/lib/formatter';
import { movieApi } from '@/services/movieApi';
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import DialogDetailMovie from '@/app/[locale]/admin/dashboard/movies/(components)/dialog-detail-movie';
import { Input } from '@/components/ui/input';

export default function Movies() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize] = useState(7);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const { data: moviesData, isLoading } = movieApi.query.useGetAllMoviesTable(currentPage, pageSize);
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
            { accessorKey: 'title', header: 'Title' },
            { accessorKey: 'releaseDate', header: 'Release Date', cell: ({ row }) => formatDate(row.original?.releaseDate) },
            { accessorKey: 'genre', header: 'Genre', cell: ({ row }) => row.original.genre.map((g) => g.categoryName).join(", "), enableSorting: false },
            { accessorKey: 'ratings.averageRating', header: 'Rating', cell: ({ row }) => row.original.ratings?.averageRating || '0.0' },
            { accessorKey: 'budget', header: 'Budget', cell: ({ row }) => row.original.budget != null ? `${row.original.budget.toLocaleString()} VND` : 'N/A' },
            {
                id: 'actions',
                header: 'Actions',
                enableSorting: false,
                cell: ({ row }) => (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => setSelectedMovie(row.original)}>View</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/movies/edit?id=${row.original.id}`)}>Edit</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMovie(row.original.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ),
            },
        ],
        [router]
    );

    const table = useReactTable({ data: moviesData?.content || [], columns, getCoreRowModel: getCoreRowModel(), getSortedRowModel: getSortedRowModel() });
    if (isLoading) return <Loading />;

    return (
        <div className="bg-background p-6">
            <div className="flex items-center justify-end mb-6 gap-4">
                <div className="flex items-center gap-4">
                                        <Input
                                            placeholder="Search movies..."
                                            className="text-muted-foreground" />
                                    </div>
                <Button onClick={() => router.push('/admin/dashboard/movies/create')}>Add Movie</Button>
            </div>
            <div className="border border-border shadow-lg rounded-lg overflow-hidden mt-4">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="bg-muted">
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} className="hover:bg-muted transition">
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
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
                                disabled={currentPage >= (moviesData?.totalPages - 1)}
                                className={currentPage >= (moviesData?.totalPages - 1) ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <DialogConfirmDelete />
            {selectedMovie && <DialogDetailMovie isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} movieData={selectedMovie} router={router} />}
        </div >
    );
}
