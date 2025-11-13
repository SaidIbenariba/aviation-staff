"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { getCategoryDistributionData } from "@/lib/utils/dashboard-stats";

const chartConfig = {
  value: {
    label: "Nombre",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function CategoryDistributionChart() {
  const data = React.useMemo(() => getCategoryDistributionData(), []);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Répartition par catégorie</CardTitle>
          <CardDescription>
            Distribution des inspirations par catégorie
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            Aucune donnée disponible
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition par catégorie</CardTitle>
        <CardDescription>
          Distribution des inspirations par catégorie
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" tickLine={false} axisLine={false} />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={120}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value} inspirations`, "Nombre"]}
                />
              }
            />
            <Bar dataKey="value" fill="var(--color-value)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

