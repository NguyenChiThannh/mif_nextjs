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
                                        {t("saved_movie")}
                                    </Button>
                                    :
                                    <Button size="lg" onClick={() => handleSaveStatusChange("save")}>
                                        <Heart className="w-5 h-5 mr-2 " />
                                        {t("save_movie")}
                                    </Button>
                            }

                        </div>
                    </div>
                </div>

                {/* Poster + Trailer */}
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

                {/* Info film */}
                <div className="grid gap-8 grid-cols-10">
                    <MovieDetailsSection movie={movie} isSavedMovie={isSavedMovie} handleSaveStatusChange={handleSaveStatusChange} t={t} />

                </div>

                <div className="grid grid-cols-10 mt-4 gap-4">
                    <div className="col-span-7 ">
                        <div className="grid gap-4">

                            <Title title={t("image")} isMore={false} />
                            <DynamicImageGallery type="movie" />
                        </div>

                        <div className="grid gap-4 mt-6">

                            <Title title={t("review")} isMore={true} redirect={`/movies/${id}/review`} />
                            <SectionReviewMovie movieId={id} />
                        </div>


                        <div className="grid gap-6 mt-6">
                            <Title title={t("actor")} isMore={true} />
                            <SectionActorMovie actors={movie?.cast || movie.director || []} />
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


// const handleSaveStatusChange = (action, id) => {
//     let mutation
//     if (action === "save") {
//         mutation = useMutation({
//             mutationFn: async (movieId) => {
//                 try {
//                     const res = await privateApi.post(`saved-movies/${movieId}`)
//                     return res.data
//                 } catch (error) {
//                     throw error
//                 }
//             },
//         })
//         setIsSavedMovie(true)
//     }
//     else if (action === "saved") {
//         mutation = useMutation({
//             mutationFn: async (movieId) => {
//                 try {
//                     const res = await privateApi.delete(`saved-movies/${movieId}`)
//                     return res.data
//                 } catch (error) {
//                     throw error
//                 }
//             },
//         })
//         setIsSavedMovie(false)
//     }
//     else{
//         toast.error('Hành động không hợp lệ')
//     }
//     mutation.mutate(id, {
//         onSuccess: ()=> {
//             checkSavedStatus(),
//         },
//         onError: () => {
//             if (action === "save"){
//                 setIsSavedMovie(false)
//             }
//             else{
//                 setIsSavedMovie(true)
//             }
//         }
//     });
// };