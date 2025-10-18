import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import type { FertilizerRecord } from "@shared/schema";

interface FertilizerTrendsChartProps {
  allData: FertilizerRecord[];
}

export function FertilizerTrendsChart({ allData }: FertilizerTrendsChartProps) {
  const uniqueProducts = useMemo(() => {
    const products = new Set(allData.map((item) => item.product));
    return Array.from(products).sort();
  }, [allData]);

  const [selectedProduct, setSelectedProduct] = useState<string>(
    uniqueProducts[0] || "UREA"
  );

  const { data: chartData = [], isLoading } = useQuery<Array<{ month: string; requirement: number; availability: number }>>({
    queryKey: ["/api/fertilizer/trends", selectedProduct],
    queryFn: async () => {
      const response = await fetch(`/api/fertilizer/trends/${selectedProduct}`);
      if (!response.ok) throw new Error("Failed to fetch trends");
      return response.json();
    },
    enabled: !!selectedProduct,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 flex-1">
            <CardTitle>Yearly Trend Analysis</CardTitle>
            <CardDescription>
              Monthly requirement vs availability for {selectedProduct}
            </CardDescription>
          </div>
          <Select value={selectedProduct} onValueChange={setSelectedProduct}>
            <SelectTrigger className="w-[180px]" data-testid="select-product-chart">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uniqueProducts.map((product) => (
                <SelectItem key={product} value={product}>
                  {product}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              label={{
                value: "Metric Tons (MT)",
                angle: -90,
                position: "insideLeft",
                style: { fill: "hsl(var(--muted-foreground))", fontSize: 12 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
                color: "hsl(var(--popover-foreground))",
              }}
              formatter={(value: number) => `${value.toLocaleString()} MT`}
            />
            <Legend
              wrapperStyle={{
                paddingTop: "20px",
              }}
            />
            <Line
              type="monotone"
              dataKey="requirement"
              name="Requirement"
              stroke="hsl(var(--chart-2))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="availability"
              name="Availability"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
