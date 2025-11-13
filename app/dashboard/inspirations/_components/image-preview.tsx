"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { getImageUrl } from "@/lib/utils/placeholder-image";

interface ImagePreviewProps {
  src: string | null | undefined;
  alt?: string;
  className?: string;
  fallbackText?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-16 w-16",
  lg: "h-24 w-24",
};

export function ImagePreview({
  src,
  alt = "Image",
  className,
  fallbackText,
  size = "md",
}: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Get dimensions based on size
  const dimensions = {
    sm: { width: 100, height: 100 },
    md: { width: 200, height: 200 },
    lg: { width: 400, height: 300 },
  }[size];

  // Use placeholder if no src provided
  const imageUrl = getImageUrl(src, dimensions.width, dimensions.height, fallbackText);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div
          className={cn(
            "relative cursor-pointer rounded-md overflow-hidden border border-border transition-all duration-200 hover:shadow-md hover:scale-105",
            sizeClasses[size],
            className
          )}
        >
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-200" />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="relative w-full h-[80vh]">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

