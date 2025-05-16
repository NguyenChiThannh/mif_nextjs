import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Copy, Heart, Triangle } from "lucide-react";

export default function MovieDetailsSection({ movie, isSavedMovie, handleSaveStatusChange, t }) {
    return (
        <>
            <div className="grid gap-6 col-span-7">
                <div className="bg-muted rounded-lg p-6">

                    <h2 className="text-xl font-bold mb-4">{t("about_movie")}</h2>
                    <p className="text-sm leading-relaxed">{movie.description}</p>
                </div>
                <div className="mt-4 space-y-2">
                    <MovieInfoRow label={t("release_year")} value={movie.releaseDate?.split('-')[0]} />
                    <MovieInfoRow label={t("duration")} value={`${movie.duration} phút`} />
                    <MovieInfoRow
                        label={t("category")}
                        value={movie.genre?.map((category) => category?.categoryName).join(", ")}
                    />
                    <MovieInfoRow label={t("rating_score")} value={`${Number(movie.ratings?.averageRating) * 2 || '0.0'}/10`} />
                    <MovieInfoRow label={t("director")} value="R" />
                </div>
            </div>
            {/* Right Info  */}
            <div className="grid col-span-3 h-fit gap-6 bg-secondary px-4 py-6 rounded-lg shadow-md">
                <div className="grid grid-cols-3 gap-2">
                    {/* Rating Score */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground font-semibold text-sm">{t("rating_score")}</p>
                        <div className="flex items-center gap-1 text-base font-bold text-primary">
                            {(Number(movie.ratings?.averageRating) * 2) || '0.0'}/10
                        </div>
                    </div>

                    {/* Ranking */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground font-semibold text-sm">{t("ranking")}</p>
                        <div className="flex items-center text-base font-bold">
                            <span className="text-primary">#13 (</span>
                            <Triangle
                                className={`${true ? 'fill-green-500 text-green-500' : 'rotate-180 fill-red-500 text-red-500'
                                    }`}
                                size={10}
                            />
                            <span className="text-primary">16)</span>
                        </div>
                    </div>

                    {/* Review */}
                    <div className="flex flex-col items-center gap-2">
                        <p className="text-muted-foreground font-semibold text-sm">{t("review")}</p>
                        <div className="text-base font-bold text-primary">{movie.ratings?.numberOfRatings || 0}</div>
                    </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                    {/* Save Movie */}
                    {isSavedMovie ? (
                        <Button size="lg" className="w-full" onClick={() => handleSaveStatusChange("unsave")}>
                            <Check className="w-5 h-5 mr-2" />
                            {t("saved_movie")}
                        </Button>
                    ) : (
                        <Button size="lg" className="w-full" onClick={() => handleSaveStatusChange("save")}>
                            <Heart className="w-5 h-5 mr-2" />
                            {t("save_movie")}
                        </Button>
                    )}

                    {/* Share */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="lg">{t("share")}</Button>
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
        </>
    );
}

function MovieInfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}:</span>
            <span>{value}</span>
        </div>
    );
}
