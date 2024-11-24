'use client'
import CardActorHorizontal from "@/components/card-actor-horizontal"
import CardMovie from "@/components/card-movie"
import CardReview, { CardReviewSkeleton } from "@/components/card-review"
import DialogRating from "@/components/dialog-rating"
import DynamicImageGallery from "@/components/dynamic-image-gallery"
import Loading from "@/components/loading"
import Rating from "@/components/rating"
import Title from "@/components/title"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { movieApi } from "@/services/movieApi"
import { categoryApi } from "@/services/movieCategoriesApi"
import { movieRatingsApi } from "@/services/movieRatingsApi"
import { savedMovieApi } from "@/services/savedMovie"
import { useQuery } from "@tanstack/react-query"
import { Check, Copy, Heart, Star, Triangle } from "lucide-react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"


export default function DetailMovie() {
    const { id } = useParams();
    const [isSavedMovie, setIsSavedMovie] = useState('false')

    const { isLoading: isLoadingMovie, data: movie } = movieApi.query.useGetMovieById(id)
    const { isLoading: isLoadingmovieCategories, data: movieCategories } = categoryApi.query.useGetAllmovieCategories()
    const { isLoading: isLoadingReview, data: review } = movieRatingsApi.query.useGetAllRatingsByMovieId(id)
    const batchCheckSavedStatusMutation = savedMovieApi.mutation.useBatchCheckSavedStatus();
    const saveMovieMutation = savedMovieApi.mutation.useSaveMovie();
    const unSaveMovieMutation = savedMovieApi.mutation.useUnSaveMovie();

    const checkSavedStatus = () => {
        batchCheckSavedStatusMutation.mutate(
            { postIds: [id] },
            {
                onSuccess: (data) => {
                    console.log('🚀 ~ checkSavedStatus ~ data[id]:', data[id])
                    setIsSavedMovie(data[id]);
                },
                onError: () => toast.error("Không thể cập nhật trạng thái lưu phim."),
            }
        );
    };

    useEffect(() => {
        checkSavedStatus();
    }, [id]);

    if (isLoadingMovie || isLoadingmovieCategories) return <Loading />;

    const categoriesName = movie?.genre?.map((element) =>
        movieCategories?.find((category) => element?.id === category?.id)
    );

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
                    <div className="grid gap-6 col-span-7">
                        <div className="grid gap-4">
                            <div className="grid gap-2 text-sm">
                                <div className="bg-muted rounded-lg p-6">
                                    <h2 className="text-xl font-bold mb-4">Về phim</h2>
                                    <p className="text-sm leading-relaxed">
                                        {movie.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground">Năm phát hành:</div>
                                    <div>{movie.releaseDate?.split('-')[0]}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground">Thời lượng:</div>
                                    <div>{movie.duration} min</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground">Thể loại:</div>
                                    <div>{categoriesName?.map((category) => {
                                        return category?.categoryName
                                    }).join(', ')}</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground ">Điểm đánh giá:</div>
                                    <div>{Number(movie.ratings?.averageRating) * 2}/10</div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-muted-foreground">Đạo diễn:</div>
                                    <div>R</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid col-span-3 h-fit gap-6 bg-secondary p-6 rounded-lg shadow-md">
                        <div className="grid grid-cols-3 gap-6">
                            {/* Điểm đánh giá */}
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-muted-foreground font-semibold text-sm">Điểm đánh giá</p>
                                <div className="flex items-center gap-1 text-xl font-bold text-primary">
                                    {Number(movie.ratings?.averageRating) * 2}/10
                                    <Star className="text-warning" />
                                </div>
                            </div>

                            {/* Xếp hạng */}
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-muted-foreground font-semibold text-sm">Xếp hạng</p>
                                <div className="flex items-center gap-1 text-base font-medium">
                                    <span className="text-primary">#13 (</span>
                                    {true ? (
                                        <Triangle className="text-success" size="12px" />
                                    ) : (
                                        <Triangle className="rotate-180 text-danger" size="12px" />
                                    )}
                                    <span className="text-primary">16)</span>
                                </div>
                            </div>

                            {/* Nhận xét */}
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-muted-foreground font-semibold text-sm">Nhận xét</p>
                                <div className="text-xl font-bold text-primary">{movie.ratings?.numberOfRatings}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            {/* Lưu phim */}
                            {isSavedMovie ? (
                                <Button size="lg" className="w-full" onClick={() => handleSaveStatusChange("unsave")}>
                                    <Check className="w-5 h-5 mr-2" />
                                    Đã lưu phim
                                </Button>
                            ) : (
                                <Button size="lg" className="w-full" onClick={() => handleSaveStatusChange("save")}>
                                    <Heart className="w-5 h-5 mr-2" />
                                    Lưu phim
                                </Button>
                            )}

                            {/* Chia sẻ */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="lg">Share</Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-4 rounded-md bg-popover shadow-md">
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="link"
                                            defaultValue={window.location.href}
                                            readOnly
                                            className="flex-1 text-sm"
                                        />
                                        <Button size="sm" variant="secondary" className="px-3">
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-10 mt-4 gap-4">
                    <div className="col-span-7 ">
                        <div className="grid gap-4">

                            <Title title="Ảnh" isMore={false} />
                            <DynamicImageGallery />
                        </div>

                        <div className="grid gap-4 mt-4">

                            <Title title="Đánh giá" isMore={true} />
                            <div className="space-y-2">
                                {
                                    isLoadingReview
                                        ?
                                        <>
                                            {Array.from(4).map((_, index) => {
                                                return <CardReviewSkeleton key={index} />
                                            })}
                                        </>
                                        :
                                        <>
                                            {
                                                review.content.map((review, index) => {
                                                    return <CardReview review={review} key={index} />
                                                })
                                            }
                                        </>
                                }
                            </div>
                        </div>


                        <div className="grid gap-4 mt-4">

                            <Title title="Diễn viên" isMore={true} />
                            <div className="grid grid-cols-2 gap-4">
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                                <CardActorHorizontal />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-3 ">
                        <div className="grid gap-4">

                            <Title title="Khám phá" isMore={false} />
                            {/* <CardMovie />
                            <CardMovie />
                            <CardMovie /> */}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
