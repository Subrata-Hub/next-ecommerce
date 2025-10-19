"use client";

import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

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

export const description = "A donut chart";

const chartData = [
  { status: "pending", count: 275, fill: "var(--color-pending)" },
  { status: "processing", count: 200, fill: "var(--color-processing)" },
  { status: "shipped", count: 187, fill: "var(--color-shipped)" },
  { status: "delivered", count: 173, fill: "var(--color-delivered)" },
  { status: "cancelled", count: 173, fill: "var(--color-cancelled)" },
  { status: "unverified", count: 90, fill: "var(--color-unverified)" },
];

const chartConfig = {
  status: {
    label: "Status",
  },
  pending: {
    label: "Pending",
    color: "#3b82f6",
  },
  processing: {
    label: "Processing",
    color: "#eab308",
  },
  shipped: {
    label: "Shipped",
    color: "#06b6d4",
  },
  delivered: {
    label: "Delivered",
    color: "#22c55e",
  },
  cancelled: {
    label: "Cancelled",
    color: "#ef4444",
  },
  unverified: {
    label: "Unverified",
    color: "#f97316",
  },
};

export function OrderStatus() {
  return (
    // <Card className="flex flex-col">
    //   <CardHeader className="items-center pb-0">
    //     <CardTitle>Pie Chart - Donut</CardTitle>
    //     <CardDescription>January - June 2024</CardDescription>
    //   </CardHeader>
    //   <CardContent className="flex-1 pb-0">

    //   </CardContent>
    //   <CardFooter className="flex-col gap-2 text-sm">
    //     <div className="flex items-center gap-2 leading-none font-medium">
    //       Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
    //     </div>
    //     <div className="text-muted-foreground leading-none">
    //       Showing total count for the last 6 months
    //     </div>
    //   </CardFooter>
    // </Card>
    <div>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {/* {totalVisitors.toLocaleString()} */}
                        100
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div>
        <ul>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>Pending</span>
            <span className="rounded-full px-2 text-sm bg-blue-500 text-white">
              0
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>processing</span>
            <span className="rounded-full px-2 text-sm bg-yellow-500 text-white">
              0
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>shipped</span>
            <span className="rounded-full px-2 text-sm bg-cyan-500 text-white">
              0
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>delivered</span>
            <span className="rounded-full px-2 text-sm bg-green-500 text-white">
              0
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>cancelled</span>
            <span className="rounded-full px-2 text-sm bg-red-500 text-white">
              0
            </span>
          </li>
          <li className="flex justify-between items-center mb-3 text-sm">
            <span>unverified</span>
            <span className="rounded-full px-2 text-sm bg-orange-500 text-white">
              0
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
