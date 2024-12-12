'use client';

import { groupsApi } from '@/services/groupsApi';
import { movieApi } from '@/services/movieApi';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { categoryApi } from '@/services/movieCategoriesApi';
import { useTranslations } from 'next-intl';
import Loading from '@/components/loading';
import { Tabs } from '@/app/[locale]/(root)/search/(component)/tabs';
import { MovieResults } from '@/app/[locale]/(root)/search/(component)/movie-results';
import { GroupResults } from '@/app/[locale]/(root)/search/(component)/group-results';
import { ActorDirectorResults } from '@/app/[locale]/(root)/search/(component)/actor-director-results';
import { actorApi } from '@/services/actorApi';

export default function SearchPage() {
    const [activeTab, setActiveTab] = useState('all');
    const t = useTranslations('Search');
    const searchParams = useSearchParams();
    const search = searchParams.get('q');

    const {
        isLoading: isLoadingMovies,
        data: movies
    } = movieApi.query.useSearchMoviesByTitle(0, 10, search);
    const {
        isLoading: isLoadingGroup,
        data: groups
    } = groupsApi.query.useSearchGroupByGroupName(search);
    const { data: movieCategories } = categoryApi.query.useGetAllmovieCategories();

    const {
        isLoading: isLoadingActor,
        data: actors,
    } = actorApi.query.useSearchActorsByTitle(search)

    const noResults = groups?.content?.length === 0 && movies?.content?.length === 0 && actors?.content?.length === 0;

    if (isLoadingMovies || isLoadingGroup || isLoadingActor) return <Loading />

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-2xl font-bold">
                {t("search_keywords")}: {search}
            </div>

            <Tabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                t={t}
            />

            {noResults ? (
                <div className="text-lg font-bold mt-8 flex justify-center">{
                    t("no_matching_results_found")}
                </div>
            ) : (
                <div>
                    <MovieResults
                        activeTab={activeTab}
                        movies={movies}
                    />
                    <GroupResults
                        activeTab={activeTab}
                        groups={groups}
                        movieCategories={movieCategories}
                    />
                    <ActorDirectorResults
                        activeTab={activeTab}
                        actors={actors}
                    />
                </div>
            )}
        </div>
    );
}
