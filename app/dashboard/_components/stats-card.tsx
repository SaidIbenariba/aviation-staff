"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: number;
  icon: LucideIcon;
  href?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon: Icon,
  href,
  className,
}: StatsCardProps) {
  const content = (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        href && "cursor-pointer hover:border-primary/50",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {trend >= 0 ? (
              <TrendingUp className="h-3 w-3 text-chart-2" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                trend >= 0 ? "text-chart-2" : "text-destructive"
              )}
            >
              {Math.abs(trend)}% {trend >= 0 ? "augmentation" : "diminution"}
            </span>
            <span className="text-xs text-muted-foreground">vs mois dernier</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

