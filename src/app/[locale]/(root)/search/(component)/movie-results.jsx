import CardMovieSmall from "@/components/card-movie-horizontal";
import Title from "@/components/title";


export const MovieResults = ({ activeTab, movies }) => (
    (activeTab === 'all' || activeTab === 'movie') && (
        <div className="mt-4">
            <Title title="Phim" isMore={false} />
            <div className="grid gap-2 mt-4">
                {movies?.content?.map((movie) => (
                    <CardMovieSmall key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    )
);