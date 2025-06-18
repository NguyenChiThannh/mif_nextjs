"use client";
import React, { useEffect, useState } from "react";
import { categoryApi } from "@/services/movieCategoriesApi";
import useUserId from "@/hooks/useUserId";
import { SectionGroup } from "@/app/[locale]/(root)/groups/(sections)/section-group";
import SectionExploreGroup from "@/app/[locale]/(root)/groups/(sections)/section-explore-group";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Info } from "lucide-react";

export default function Groups() {
  const t = useTranslations("Groups");
  const userId = useUserId();
  const [showDragHint, setShowDragHint] = useState(true);
  const { data: movieCategories } =
    categoryApi.query.useGetAllmovieCategories();

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Drag and Drop Hint */}
      <AnimatePresence>
        {showDragHint && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4 mb-6 mx-4 mt-4"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">
                  🎬 Tính năng mới: Kéo thả Group để Mention!
                </h4>
                <p className="text-sm text-muted-foreground">
                  Bấm vào nút <strong>3 chấm dọc</strong> trên group, sau đó kéo
                  và thả vào chatbot MIF để tự động mention group đó. Nút 3 chấm
                  xuất hiện khi hover vào group!
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-primary">
                  <span className="bg-primary/10 px-2 py-1 rounded">Tip:</span>
                  <span>
                    Bấm ⋮ → Kéo "Rạp chiếu nhà mình" → Chatbot = "@Rạp chiếu nhà
                    mình"
                  </span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDragHint(false)}
                className="flex-shrink-0 hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <SectionGroup movieCategories={movieCategories} userId={userId} t={t} />
      <SectionExploreGroup movieCategories={movieCategories} t={t} />
    </div>
  );
}
