import CardMovie, { CardMovieSkeleton } from '@/components/card-movie'
import Title from '@/components/title'
import { actorApi } from '@/services/actorApi'
import React from 'react'

export default function FilmographySection({ actorId, t }) {
    const { data: actorFilmography, isLoading: isActorFilmographyLoading } = actorApi.query.useGetActorFilmography(actorId)

    return (
        <div>
            <Title title={t("joined_movies")} isMore={false} />
            {isActorFilmographyLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="pl-1 flex justify-center">
                            <CardMovieSkeleton direction="vertical" />
                        </div>
                    ))}
                </div>
            ) : actorFilmography?.length === 0 ? (
                <div className="flex justify-center mt-4 font-bold mb-8">
                    {t("not_participated_in_any_movie")}
                </div>
            ) : (
                <div className="flex mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {actorFilmography.map((movie) => (
                            <div key={movie.id} className="pl-1 flex justify-center">
                                <CardMovie movie={movie} direction="vertical" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}