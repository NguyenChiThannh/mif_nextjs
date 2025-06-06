'use client';

import { groupsApi } from '@/services/groupsApi';
import { movieApi } from '@/services/movieApi';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { categoryApi } from '@/services/movieCategoriesApi';
import { useTranslations } from 'next-intl';
import Loading from '@/components/loading';
import { Tabs } from '@/app/[locale]/(root)/search/(components)/tabs';
import { MovieResults } from '@/app/[locale]/(root)/search/(components)/movie-results';
import { GroupResults } from '@/app/[locale]/(root)/search/(components)/group-results';
import { ActorDirectorResults } from '@/app/[locale]/(root)/search/(components)/actor-director-results';
import { actorApi } from '@/services/actorApi';
import { motion, AnimatePresence } from 'framer-motion';

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

    const noResults =
        groups?.content?.length === 0 &&
        movies?.content?.length === 0 &&
        actors?.content?.length === 0;

    if (isLoadingMovies || isLoadingGroup || isLoadingActor) return <Loading />

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        }
    };

    const NoResultsMessage = ({ type }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-medium mt-8 flex justify-center text-muted-foreground"
        >
            {t(`no_${type}_found`)}
        </motion.div>
    );

    const renderResults = () => {
        switch (activeTab) {
            case 'movies':
                return movies?.content?.length > 0 ? (
                    <motion.div variants={itemVariants}>
                        <MovieResults
                            activeTab={activeTab}
                            movies={movies}
                            t={t}
                            showTitle={false}
                        />
                    </motion.div>
                ) : <NoResultsMessage type="movies" />;
            case 'groups':
                return groups?.content?.length > 0 ? (
                    <motion.div variants={itemVariants}>
                        <GroupResults
                            activeTab={activeTab}
                            groups={groups}
                            movieCategories={movieCategories}
                            t={t}
                            showTitle={false}
                        />
                    </motion.div>
                ) : <NoResultsMessage type="groups" />;
            case 'actors':
                return actors?.content?.length > 0 ? (
                    <motion.div variants={itemVariants}>
                        <ActorDirectorResults
                            activeTab={activeTab}
                            actors={actors}
                            t={t}
                            showTitle={false}
                        />
                    </motion.div>
                ) : <NoResultsMessage type="actors" />;
            case 'all':
            default:
                if (noResults) {
                    return <NoResultsMessage type="matching_results" />;
                }
                return (
                    <>
                        {movies?.content?.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <MovieResults
                                    activeTab={activeTab}
                                    movies={movies}
                                    t={t}
                                    showTitle={true}
                                />
                            </motion.div>
                        )}
                        {groups?.content?.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <GroupResults
                                    activeTab={activeTab}
                                    groups={groups}
                                    movieCategories={movieCategories}
                                    t={t}
                                    showTitle={true}
                                />
                            </motion.div>
                        )}
                        {actors?.content?.length > 0 && (
                            <motion.div variants={itemVariants}>
                                <ActorDirectorResults
                                    activeTab={activeTab}
                                    actors={actors}
                                    t={t}
                                    showTitle={true}
                                />
                            </motion.div>
                        )}
                    </>
                );
        }
    };

    return (
        <motion.div
            className="max-w-4xl mx-auto px-4 py-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <motion.div
                className="text-2xl font-bold mb-6 text-foreground"
                variants={itemVariants}
            >
                {t("search_keywords")}: <span className="text-primary">{search}</span>
            </motion.div>

            <motion.div variants={itemVariants}>
                <Tabs
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    t={t}
                />
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.div
                    key="results"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8 mt-6"
                >
                    {renderResults()}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
}
