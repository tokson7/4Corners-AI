"use client";

import { cn } from "@/lib/utils";

export interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
}

export default function Skeleton({
  className,
  variant = "rectangular",
}: SkeletonProps) {
  const baseStyles = "animate-pulse bg-white/10 rounded";
  
  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "w-full",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        className
      )}
    />
  );
}
