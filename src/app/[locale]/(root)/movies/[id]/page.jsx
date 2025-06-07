'use client'
import { SectionActorMovie } from "@/app/[locale]/(root)/movies/[id]/(section)/actor-movie-section"
import MovieDetailsSection from "@/app/[locale]/(root)/movies/[id]/(section)/movie-details-section"
import { SectionReviewMovie } from "@/app/[locale]/(root)/movies/[id]/(section)/review-movie-section"
import DialogRating from "@/components/dialog-rating"
import DynamicImageGallery from "@/components/dynamic-image-gallery"
import Loading from "@/components/loading"
import Rating from "@/components/rating"
import { SectionExploreMovies } from "@/components/section-explore-movies"
import Title from "@/components/title"
import { Button } from "@/components/ui/button"
import { movieApi } from "@/services/movieApi"
import { savedMovieApi } from "@/services/savedMovie"
import { Check, Heart } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { useTranslations } from "use-intl"

export default function DetailMovie() {
    const t = useTranslations('Movie.Detail')
    const { id } = useParams();
    const [isSavedMovie, setIsSavedMovie] = useState('false')

    const { isLoading: isLoadingMovie, data: movie } = movieApi.query.useGetMovieById(id)
    const batchCheckSavedStatusMutation = savedMovieApi.mutation.useBatchCheckSavedStatus();
    const saveMovieMutation = savedMovieApi.mutation.useSaveMovie();
    const unSaveMovieMutation = savedMovieApi.mutation.useUnSaveMovie();

    const checkSavedStatus = () => {
        batchCheckSavedStatusMutation.mutate(
            { postIds: [id] },
            {
                onSuccess: (data) => {
                    setIsSavedMovie(data[id]);
                },
            }
        );
    };

    useEffect(() => {
        checkSavedStatus();
    }, [id]);

    if (isLoadingMovie) return <Loading />;

    const handleSaveStatusChange = (action) => {
        const mutation = action === "save" ? saveMovieMutation : unSaveMovieMutation;
        action === "save" ? setIsSavedMovie(true) : setIsSavedMovie(false)
        mutation.mutate(id, {
            onSuccess: checkSavedStatus,
        });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="w-full md:py-12"
        >
            <div className="grid gap-6">
                <motion.div variants={itemVariants} className="space-y-4">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold text-foreground"
                    >
                        {movie.title}
                    </motion.h1>
                    <div className="flex justify-between items-center">
                        <Rating
                            value={movie.ratings?.averageRating || 0}
                            iconSize="l"
                            showOutOf={true}
                            enableUserInteraction={false}
                        />
                        <div className="flex items-center gap-4">
                            <DialogRating movieId={id} />
                            {isSavedMovie ? (
                                <Button
                                    size="lg"
                                    onClick={() => handleSaveStatusChange("unsave")}
                                    className="bg-primary hover:bg-primary/90 transition-colors duration-300"
                                >
                                    <Check className="w-5 h-5 mr-2" />
                                    {t("saved_movie")}
                                </Button>
                            ) : (
                                <Button
                                    size="lg"
                                    onClick={() => handleSaveStatusChange("save")}
                                    className="bg-primary hover:bg-primary/90 transition-colors duration-300"
                                >
                                    <Heart className="w-5 h-5 mr-2" />
                                    {t("save_movie")}
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Poster + Trailer */}
                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-10 gap-6"
                >
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-3 flex justify-center"
                    >
                        <Image
                            src={movie?.posterUrl}
                            alt="Movie Poster"
                            width="300"
                            height="450"
                            className="w-auto h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                        />
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                        className="col-span-7 flex justify-center"
                    >
                        <div className="overflow-hidden w-full aspect-video rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                            {movie?.trailerUrl ? (
                                <iframe
                                    className="w-full h-full object-cover"
                                    src={movie.trailerUrl}
                                    allowFullScreen
                                />
                            ) : (
                                <iframe
                                    className="w-full h-full object-cover"
                                    src="https://www.youtube.com/embed/zA3_Bs8xePE?si=e9oUenQ5nHPhpRJ3"
                                    allowFullScreen
                                />
                            )}
                        </div>
                    </motion.div>
                </motion.div>

                {/* Info film */}
                <motion.div
                    variants={itemVariants}
                    className="grid gap-8 grid-cols-10"
                >
                    <MovieDetailsSection
                        movie={movie}
                        isSavedMovie={isSavedMovie}
                        handleSaveStatusChange={handleSaveStatusChange}
                        t={t}
                    />
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-10 mt-4 gap-6"
                >
                    <div className="col-span-7 space-y-8">
                        <motion.div
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <Title title={t("image")} isMore={false} />
                            <DynamicImageGallery type="movie" />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="space-y-4"
                        >
                            <Title title={t("review")} isMore={true} redirect={`/movies/${id}/review`} />
                            <SectionReviewMovie movieId={id} />
                        </motion.div>

                        <motion.div
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <Title title={t("actor")} isMore={true} />
                            <SectionActorMovie actors={movie?.cast || movie.director || []} />
                        </motion.div>
                    </div>
                    <motion.div
                        variants={itemVariants}
                        className="col-span-3"
                    >
                        <SectionExploreMovies />
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    )
}

