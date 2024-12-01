'use client'
import CardMovieHorizontal, { CardMovieHorizontalSkeleton } from '@/components/card-movie-horizontal'
import { ComboboxMovieCategory } from '@/components/combobox-category-movie'
import Loading from '@/components/loading'
import { SectionExploreMovies } from '@/components/section-explore-movies'
import Title from '@/components/title'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { movieApi } from '@/services/movieApi'
import { Clock, Filter, Star, TrendingUp } from 'lucide-react'
import React from 'react'

export default function MoviePage() {

    const { isLoading, data } = movieApi.query.useGetAllMovies(0, 10)

    if (isLoading) return (<Loading />)
    return (
        <div className='grid grid-cols-3 gap-10'>
            <div className='grid col-span-2'>
                <div className='flex justify-around'>
                    <div className='flex items-center'>
                        <div className='w-2 bg-primary h-8 rounded'></div>
                        <h1 className='text-xl md:text-xl lg:text-2xl font-bold pl-4'>Phim đang hot</h1>
                    </div>
                    <div className='ml-auto mt-4 gap-2'>
                        <div className='flex gap-2 items-center'>
                            <ComboboxMovieCategory />
                        </div>
                    </div>
                </div>
                <div className='grid mt-4 gap-2'>
                    {data.content.map((movie, index) => (
                        <CardMovieHorizontal movie={movie} key={index} />
                    ))}
                </div>
            </div>
            <SectionExploreMovies />
        </div>
    )
}

