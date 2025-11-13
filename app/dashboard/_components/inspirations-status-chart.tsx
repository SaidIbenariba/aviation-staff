"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
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
import { getInspirationsStatusData } from "@/lib/utils/dashboard-stats";

const chartConfig = {
  value: {
    label: "Valeur",
  },
} satisfies ChartConfig;

const COLORS = {
  "Approuvé": "var(--status-approved)",
  "En attente": "var(--status-pending)",
  "Refusé": "var(--status-rejected)",
  "Archivé": "var(--status-archived)",
};

export function InspirationsStatusChart() {
  const data = React.useMemo(() => getInspirationsStatusData(), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Statut des inspirations</CardTitle>
        <CardDescription>
          Répartition des inspirations par statut
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name) => [
                    `${value} inspirations`,
                    name,
                  ]}
                />
              }
            />
            <Pie
              data={data}
              dataKey="value"
              nameKey="status"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ status, value }) => `${status}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.status as keyof typeof COLORS] || "var(--muted)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

