"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "A bar chart";

const chartData = [
  { month: "January", amount: 186 },
  { month: "February", amount: 305 },
  { month: "March", amount: 427 },
  { month: "April", amount: 268 },
  { month: "May", amount: 375 },
  { month: "June", amount: 600 },
  { month: "July", amount: 214 },
  { month: "August", amount: 500 },
  { month: "Septembar", amount: 238 },
  { month: "October", amount: 380 },
  { month: "November", amount: 286 },
  { month: "December", amount: 214 },
];

const chartConfig = {
  amount: {
    label: "Amount",
    color: "var(--chart-1)",
  },
};

export function OrderOverView() {
  return (
    <div>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="amount" fill="var(--color-amount)" radius={5} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
