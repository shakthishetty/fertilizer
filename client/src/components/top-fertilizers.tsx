import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, AlertCircle } from "lucide-react";
import type { TopFertilizer } from "@shared/schema";

export function TopFertilizers() {
  const { data: topRequired = [], isLoading: isTopRequiredLoading } = useQuery<TopFertilizer[]>({
    queryKey: ["/api/fertilizer/top-required"],
  });

  const { data: leastAvailable = [], isLoading: isLeastAvailableLoading } = useQuery<TopFertilizer[]>({
    queryKey: ["/api/fertilizer/least-available"],
  });

  const isLoading = isTopRequiredLoading || isLeastAvailableLoading;

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64 mt-2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-16 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-1/10">
              <TrendingUp className="h-4 w-4 text-chart-1" />
            </div>
            <div>
              <CardTitle>Top 5 Most Required</CardTitle>
              <CardDescription className="mt-1">
                Fertilizers with highest demand
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {topRequired.map((item, index) => (
            <div key={item.product} className="space-y-2" data-testid={`top-required-${index}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-chart-1/20 text-sm font-semibold text-chart-1">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item.product}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {item.value.toLocaleString()} MT
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-chart-1 transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
          {topRequired.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No requirement data available
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive/10">
              <AlertCircle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <CardTitle>Top 5 Least Available</CardTitle>
              <CardDescription className="mt-1">
                Fertilizers with lowest stock
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {leastAvailable.map((item, index) => (
            <div key={item.product} className="space-y-2" data-testid={`least-available-${index}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-destructive/20 text-sm font-semibold text-destructive">
                    {index + 1}
                  </div>
                  <span className="font-medium">{item.product}</span>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {item.value.toLocaleString()} MT
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-destructive to-orange-500 transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
          {leastAvailable.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No availability data found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
