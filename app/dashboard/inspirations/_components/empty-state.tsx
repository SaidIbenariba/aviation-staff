"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Lightbulb, Plus } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon: Icon = Lightbulb,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 px-4 text-center",
        className
      )}
    >
      <div className="rounded-full bg-muted p-6 mb-4">
        <Icon className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">{description}</p>
      {actionLabel && actionHref && (
        <Button asChild>
          <Link href={actionHref} className="inline-flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {actionLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}

