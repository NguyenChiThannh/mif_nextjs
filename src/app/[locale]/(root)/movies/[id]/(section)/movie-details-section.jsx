import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, Copy, Heart, Triangle } from "lucide-react";
import { motion } from "framer-motion";

export default function MovieDetailsSection({ movie, isSavedMovie, handleSaveStatusChange, t }) {
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
        <>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 col-span-7"
            >
                <motion.div
                    variants={itemVariants}
                    className="bg-card rounded-lg p-6 border border-border shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                    <h2 className="text-xl font-bold mb-4 text-foreground">{t("about_movie")}</h2>
                    <p className="text-sm leading-relaxed text-muted-foreground">{movie.description}</p>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="mt-4 space-y-3 bg-card p-6 rounded-lg border border-border shadow-sm"
                >
                    <MovieInfoRow label={t("release_year")} value={movie.releaseDate?.split('-')[0]} />
                    <MovieInfoRow label={t("duration")} value={`${movie.duration} phút`} />
                    <MovieInfoRow
                        label={t("category")}
                        value={movie.genre?.map((category) => category?.categoryName).join(", ")}
                    />
                    <MovieInfoRow label={t("rating_score")} value={`${Number(movie.ratings?.averageRating) * 2 || '0.0'}/10`} />
                    <MovieInfoRow label={t("director")} value={movie?.director[0]?.name || "Alan"} />
                </motion.div>
            </motion.div>

            {/* Right Info  */}
            <motion.div
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid col-span-3 h-fit gap-6 bg-secondary px-4 py-6 rounded-lg shadow-md"
            >
                <div className="grid grid-cols-3 gap-2">
                    {/* Rating Score */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-muted-foreground font-medium text-sm">{t("rating_score")}</p>
                        <div className="flex items-center gap-1 text-base font-bold text-primary">
                            {(Number(movie.ratings?.averageRating) * 2) || '0.0'}/10
                        </div>
                    </motion.div>

                    {/* Ranking */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-muted-foreground font-medium text-sm">{t("ranking")}</p>
                        <div className="flex items-center text-base font-bold">
                            <span className="text-primary">#13 (</span>
                            <Triangle
                                className={`${true ? 'fill-green-500 text-green-500' : 'rotate-180 fill-red-500 text-red-500'}`}
                                size={12}
                            />
                            <span className="text-primary">16)</span>
                        </div>
                    </motion.div>

                    {/* Review */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-col items-center gap-2"
                    >
                        <p className="text-muted-foreground font-medium text-sm">{t("review")}</p>
                        <div className="text-lg font-bold text-primary">{movie.ratings?.numberOfRatings || 0}</div>
                    </motion.div>
                </div>

                <motion.div
                    variants={itemVariants}
                    className="flex items-center gap-4 mt-4"
                >
                    {/* Save Movie */}
                    {isSavedMovie ? (
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                            onClick={() => handleSaveStatusChange("unsave")}
                        >
                            <Check className="w-5 h-5 mr-2" />
                            {t("saved_movie")}
                        </Button>
                    ) : (
                        <Button
                            size="lg"
                            className="w-full bg-primary hover:bg-primary/90 transition-colors duration-300"
                            onClick={() => handleSaveStatusChange("save")}
                        >
                            <Heart className="w-5 h-5 mr-2" />
                            {t("save_movie")}
                        </Button>
                    )}

                    {/* Share */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                size="lg"
                                variant="outline"
                                className="hover:bg-muted transition-colors duration-300"
                            >
                                {t("share")}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-4 rounded-lg bg-card border border-border shadow-lg">
                            <div className="flex items-center gap-2">
                                <Input
                                    id="link"
                                    defaultValue={window.location.href}
                                    readOnly
                                    className="flex-1 text-sm bg-muted/50"
                                />
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    className="px-3 hover:bg-muted transition-colors duration-300"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </motion.div>
            </motion.div>
        </>
    );
}

function MovieInfoRow({ label, value }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
        >
            <span className="text-muted-foreground font-medium">{label}:</span>
            <span className="text-foreground font-medium">{value}</span>
        </motion.div>
    );
}
