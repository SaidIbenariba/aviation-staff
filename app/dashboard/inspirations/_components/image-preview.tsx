"use client";

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ImageIcon } from "lucide-react";

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

  if (!src) {
    return (
      <Avatar className={cn(sizeClasses[size], className)}>
        <AvatarFallback className="bg-muted text-muted-foreground">
          {fallbackText ? (
            fallbackText.charAt(0).toUpperCase()
          ) : (
            <ImageIcon className="h-4 w-4" />
          )}
        </AvatarFallback>
      </Avatar>
    );
  }

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
            src={src}
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
            src={src}
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

