"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Award, Shield, Star, Trophy } from 'lucide-react'

export const BADGE_THRESHOLDS = [
  {
    level: "PLATINUM",
    color: "bg-gradient-to-r from-blue-200 via-slate-100 to-purple-200 text-slate-800 border-2 border-slate-300 shadow-inner",
  },
  {
    level: "GOLD",
    color: "bg-gradient-to-r from-yellow-200 to-amber-400 text-amber-900 border-2 border-yellow-500 shadow-inner",
  },
  {
    level: "SILVER",
    color: "bg-gradient-to-r from-gray-200 to-slate-300 text-slate-700 border-2 border-gray-400 shadow-inner",
  },
  {
    level: "BRONZE",
    color: "bg-gradient-to-r from-amber-600 to-amber-800 text-amber-100 border-2 border-amber-900 shadow-inner",
  },
]

function getBadgeIcon(level, size = "md") {
  switch (level) {
    case "PLATINUM":
      return <Trophy className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
    case "GOLD":
      return <Star className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
    case "SILVER":
      return <Shield className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
    case "BRONZE":
      return <Award className={cn("h-4 w-4", size === "md" && "h-5 w-5", size === "lg" && "h-7 w-7")} />
    default:
      return <Award className={cn("h-4 w-4")} />
  }
}

export function Badge({ level, size = "lg", showLabel = true }) {
  const badgeInfo = BADGE_THRESHOLDS.find((threshold) => threshold.level === level)
  if (!badgeInfo) return null

  const sizeClasses = {
    sm: "h-6 w-6 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-20 w-20 text-lg",
    xl: "h-32 w-32 text-2xl",
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={cn(
          "rounded-full flex items-center justify-center",
          badgeInfo.color,
          sizeClasses[size],
          "transition-all duration-700 hover:scale-110 hover:rotate-3 hover:shadow-lg",
          "relative overflow-hidden"
        )}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-white via-transparent to-transparent" />

        {/* Badge icon */}
        {getBadgeIcon(level, size)}

        {/* Subtle ring */}
        <div className="absolute inset-0 rounded-full border border-white/20" />
      </div>

      {showLabel && (
        <div className="text-center">
          <h3 className="font-semibold text-xl">{badgeInfo.level}</h3>
        </div>
      )}
    </div>
  )
}

export function Badges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {BADGE_THRESHOLDS.map((badge) => (
        <Badge key={badge.level} level={badge.level} />
      ))}
    </div>
  )
}
