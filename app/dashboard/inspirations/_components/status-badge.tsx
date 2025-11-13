"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, Archive } from "lucide-react";

type Status = "pending" | "approved" | "rejected" | "archived";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<
  Status,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  pending: {
    label: "En attente",
    icon: Clock,
    className: "bg-status-pending text-status-pending-foreground border-status-pending",
  },
  approved: {
    label: "Approuvé",
    icon: CheckCircle2,
    className: "bg-status-approved text-status-approved-foreground border-status-approved",
  },
  rejected: {
    label: "Refusé",
    icon: XCircle,
    className: "bg-status-rejected text-status-rejected-foreground border-status-rejected",
  },
  archived: {
    label: "Archivé",
    icon: Archive,
    className: "bg-status-archived text-status-archived-foreground border-status-archived",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 border transition-all duration-200",
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

