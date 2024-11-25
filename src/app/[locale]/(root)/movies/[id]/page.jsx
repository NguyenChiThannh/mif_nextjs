'use client'
import { SectionActorMovie } from "@/app/[locale]/(root)/movies/[id]/(section)/actor-movie-section"
import MovieDetailsSection from "@/app/[locale]/(root)/movies/[id]/(section)/movie-details-section"
import { SectionReviewMovie } from "@/app/[locale]/(root)/movies/[id]/(section)/review-movie-section"
import CardActorHorizontal from "@/components/card-actor-horizontal"
import CardReview, { CardReviewSkeleton } from "@/components/card-review"
import DialogRating from "@/components/dialog-rating"
import DynamicImageGallery from "@/components/dynamic-image-gallery"
import Loading from "@/components/loading"
import Rating from "@/components/rating"
import { SectionExploreMovies } from "@/components/section-explore-movies"
import Title from "@/components/title"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { movieApi } from "@/services/movieApi"
import { movieRatingsApi } from "@/services/movieRatingsApi"
import { savedMovieApi } from "@/services/savedMovie"
import { Check, Copy, Heart, Triangle } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function DetailMovie() {
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

    return (
        <div className="w-full md:py-12">
            <div className="grid gap-4">
                <div className="">
                    <p className="text-2xl md:text-3xl font-bold">{movie.title}</p>
                    <div className="flex justify-between">
                        <Rating
                            value={movie.ratings?.averageRating || 0}
                            iconSize="l"
                            showOutOf={true}
                            enableUserInteraction={false}
                        />
                        <div className="flex items-center gap-4">
                            <DialogRating movieId={id} />
                            {
                                isSavedMovie
                                    ?
                                    <Button size="lg" onClick={() => handleSaveStatusChange("unsave")}>
                                        <Check className="w-5 h-5 mr-2 " />
                                        Đã lưu phim
                                    </Button>
                                    :
                                    <Button size="lg" onClick={() => handleSaveStatusChange("save")}>
                                        <Heart className="w-5 h-5 mr-2 " />
                                        Lưu phim
                                    </Button>
                            }

                        </div>
                    </div>
                </div>

                {/* Poster + trailer */}
                <div className="grid grid-cols-10 gap-1">
                    <div className="col-span-3 flex justify-center">
                        <Image
                            src={movie?.posterUrl}
                            alt="Movie Poster"
                            width="300"
                            height="450"
                            className="w-auto h-auto object-cover"
                        />
                    </div>
                    <div className="col-span-7 flex justify-center">
                        <div className="overflow-hidden w-full aspect-video">
                            <iframe className="w-full h-full object-cover" src="https://www.youtube.com/embed/zA3_Bs8xePE?si=e9oUenQ5nHPhpRJ3" allowFullScreen />
                        </div>
                    </div>
                </div>

                {/* Thông tin phim */}
                <div className="grid gap-8 grid-cols-10">
                    <MovieDetailsSection movie={movie} isSavedMovie={isSavedMovie} handleSaveStatusChange={handleSaveStatusChange} />

                </div>

                <div className="grid grid-cols-10 mt-4 gap-4">
                    <div className="col-span-7 ">
                        <div className="grid gap-4">

                            <Title title="Ảnh" isMore={false} />
                            <DynamicImageGallery />
                        </div>

                        <div className="grid gap-4 mt-6">

                            <Title title="Đánh giá" isMore={true} redirect={`/movies/${id}/review`} />
                            <SectionReviewMovie movieId={id} />
                        </div>


                        <div className="grid gap-6 mt-6">
                            <Title title="Diễn viên" isMore={true} />
                            <SectionActorMovie actors={movie.director} />
                        </div>
                    </div>
                    <div className="col-span-3 ">
                        <SectionExploreMovies />
                    </div>
                </div>
            </div>
        </div>
    )
}
