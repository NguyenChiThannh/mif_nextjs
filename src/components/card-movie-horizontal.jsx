import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Bookmark, GripVertical } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useDragAndDrop from "@/hooks/useDragAndDrop";

export default function CardMovieSmall({ movie }) {
  const router = useRouter();
  const t = useTranslations("Movie");
  const [isDragMode, setIsDragMode] = useState(false);
  const [isDragHover, setIsDragHover] = useState(false);
  const { handleDragStart, handleDragEnd } = useDragAndDrop();

  const handleDetailMovie = () => {
    router.push(`/movies/${movie.id}`);
  };

  const handleEnableDragMode = (e) => {
    e.stopPropagation();
    setIsDragMode(true);
  };

  const handleDisableDragMode = () => {
    setIsDragMode(false);
    setIsDragHover(false);
  };

  const handleMovieDragStart = (e) => {
    if (!isDragMode) {
      e.preventDefault();
      return;
    }

    const dragData = {
      type: "movie",
      id: movie.id,
      name: movie.title,
      poster: movie.posterUrl,
      year: movie.releaseDate?.split("-")[0] || "",
    };
    handleDragStart(e, dragData);
    setIsDragHover(true);
  };

  const handleMovieDragEnd = () => {
    handleDragEnd();
    setIsDragHover(false);
    // Auto disable drag mode after drag
    setTimeout(() => setIsDragMode(false), 1000);
  };

  const yearRelease = movie?.releaseDate?.split("-")[0] || "N/A";
  const duration = movie?.duration;

  return (
    <motion.div
      className={`flex items-center w-full p-4 transition-colors duration-200 border-b last:border-b-0 ${
        isDragMode
          ? isDragHover
            ? "bg-primary/10 border-primary/30"
            : "bg-primary/5 border-primary/20"
          : "hover:bg-muted/30"
      }`}
      whileHover={!isDragMode ? { scale: 1.01 } : {}}
      transition={{ duration: 0.2 }}
      draggable={isDragMode}
      onDragStart={handleMovieDragStart}
      onDragEnd={handleMovieDragEnd}
    >
      {/* Drag Toggle Button */}
      <motion.div className="mr-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={isDragMode ? handleDisableDragMode : handleEnableDragMode}
          className={`h-8 w-8 rounded-full transition-all duration-200 ${
            isDragMode
              ? "bg-primary text-primary-foreground shadow-lg"
              : "bg-white/20 backdrop-blur-md hover:bg-white/30 shadow-sm border border-white/10"
          }`}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </motion.div>

      {/* Movie Details */}
      <div
        className={`flex items-stretch gap-4 w-full relative ${
          isDragMode ? "cursor-grab" : "cursor-pointer"
        }`}
        onClick={!isDragMode ? handleDetailMovie : undefined}
      >
        <div className="relative overflow-hidden rounded-lg aspect-[3/4] w-24 flex-shrink-0">
          <Image
            src={movie?.posterUrl}
            alt={movie?.title || "Movie Poster"}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="grid gap-1 my-1 min-w-0 flex-1">
          <h3
            className={`text-base font-semibold line-clamp-2 transition-colors duration-200 ${
              isDragMode && isDragHover
                ? "text-primary"
                : isDragMode
                ? "text-foreground select-none"
                : "text-foreground hover:text-primary"
            }`}
          >
            {movie?.title}
          </h3>
          <div className="grid gap-0.5 text-sm text-muted-foreground">
            <p>
              {t("year_release")}: {yearRelease}
            </p>
            <p>
              {t("duration")}: {duration} {t("minutes")}
            </p>
            <p>
              <span className="font-medium">{movie.country}</span>
            </p>
          </div>
        </div>

        {/* Drag hint */}
        <AnimatePresence>
          {isDragMode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10"
            >
              Kéo để mention
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function CardMovieSmallSkeleton() {
  return (
    <div className="flex items-center w-full p-4 border-b last:border-b-0">
      {/* Skeleton for Movie Poster */}
      <div className="flex items-stretch gap-4 w-full">
        <Skeleton className="rounded-lg w-24 aspect-[3/4] flex-shrink-0" />
        <div className="grid gap-1 my-1 min-w-0 flex-1">
          <Skeleton className="w-full h-6" />
          <div className="grid gap-0.5">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-28 h-4" />
            <Skeleton className="w-24 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
