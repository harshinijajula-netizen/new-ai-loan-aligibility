"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface EligibilityScoreRingProps {
  score: number;
 riskLevel: string;
}

export function EligibilityScoreRing({
  score,
  riskLevel,
}: EligibilityScoreRingProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [circumference] = useState(2 * Math.PI * 70);

  useEffect(() => {
    const duration = 1500;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(score * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [score]);

  const getScoreColor = () => {
    if (score >= 80) return { stroke: "#10b981", bg: "rgba(16,185,129,0.12)", text: "text-emerald-600" };
    if (score >= 60) return { stroke: "#f59e0b", bg: "rgba(245,158,11,0.12)", text: "text-amber-600" };
    if (score >= 40) return { stroke: "#f97316", bg: "rgba(249,115,22,0.12)", text: "text-orange-600" };
    return { stroke: "#ef4444", bg: "rgba(239,68,68,0.12)", text: "text-red-600" };
  };

  const getRiskBadge = () => {
    switch (riskLevel.toLowerCase()) {
      case "low":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "very high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const colors = getScoreColor();
  const dashOffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-muted/30"
          />
          <motion.circle
            cx="80"
            cy="80"
            r="70"
            fill="none"
            stroke={colors.stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-bold tabular-nums ${colors.text}`}>
            {animatedScore}
          </span>
          <span className="text-xs text-muted-foreground font-medium mt-0.5">
            out of 100
          </span>
        </div>
      </div>
      <div className="text-center">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRiskBadge()}`}
        >
          {riskLevel} Risk
        </span>
        <p className="text-sm text-muted-foreground mt-2">
          {score >= 80
            ? "Excellent! You have a high chance of approval."
            : score >= 60
            ? "Good standing. Minor improvements could help."
            : score >= 40
            ? "Moderate risk. Consider improving your profile."
            : "Higher risk. Significant improvements needed."}
        </p>
      </div>
    </div>
  );
}
