'use client'

import CardActorHorizontal from '@/components/card-actor-horizontal'
import CardMovieSmall from '@/components/card-movie-horizontal'
import CardGroups from '@/components/card-groups'
import Title from '@/components/title'
import { Button } from '@/components/ui/button'
import { groupsApi } from '@/services/groupsApi'
import { movieApi } from '@/services/movieApi'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { categoryApi } from '@/services/movieCategoriesApi'
import { useTranslations } from 'next-intl'
import { tabSearchConfig } from '@/lib/navigationConfig'

export default function Page() {
    const [activeTab, setActiveTab] = useState('all')
    const t = useTranslations('Search')
    const searchParams = useSearchParams()
    const search = searchParams.get('q')

    const { isLoading: isLoadingMovies, data: movies } = movieApi.query.useSearchMoviesByTitle(0, 10, search)

    const { isLoading: isLoadingGroup, data: groups } = groupsApi.query.useSearchGroupByGroupName(search)

    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories()
    const noResults = groups?.content?.length === 0 && movies?.content?.length === 0

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-2xl font-bold">Từ khóa tìm kiếm: {search}</div>

            {/* Tabs */}
            <div className="flex mt-4 gap-4">
                {tabSearchConfig(t).map(({ title, tab }) => (
                    <Button
                        key={tab}
                        size="sm"
                        variant={activeTab === tab ? undefined : 'outline'}
                        className={tab === 'all' ? undefined : 'hidden md:block'}
                        onClick={() => setActiveTab(tab)}
                    >
                        {title}
                    </Button>
                ))}
            </div>

            {/* No Results */}
            {noResults && (
                <div className="text-lg font-bold mt-8 flex justify-center">Không có kết quả nào phù hợp</div>
            )}

            {/* Results */}
            {!noResults && (
                <div>
                    {/* Movies */}
                    {(activeTab === 'all' || activeTab === 'movie') && (
                        <div className="mt-4">
                            <Title title="Phim" isMore={false} />
                            <div className="grid gap-2 mt-4">
                                {movies?.content?.map((movie) => (
                                    <CardMovieSmall key={movie.id} movie={movie} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Groups */}
                    {(activeTab === 'all' || activeTab === 'group') && (
                        <div className="mt-4">
                            <Title title="Nhóm" isMore={false} />
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mt-4">
                                {groups?.content?.map((group) => (
                                    <CardGroups
                                        key={group.id}
                                        initialStatus="joined"
                                        group={group}
                                        categories={movieCategories}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Actors/Directors */}
                    {(activeTab === 'all' || activeTab === 'director_actor') && (
                        <div className="mt-4 mb-8">
                            <Title title="Diễn viên/ Đạo diễn" isMore={false} />
                            <div className="grid gap-2 mt-4">
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
