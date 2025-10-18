import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MapPin, AlertTriangle, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MetricsCardsProps {
  totalStates?: number;
  totalFertilizerTypes?: number;
  criticalShortages?: number;
  averageAvailability?: number;
  isLoading?: boolean;
}

export function MetricsCards({
  totalStates = 0,
  totalFertilizerTypes = 0,
  criticalShortages = 0,
  averageAvailability = 0,
  isLoading = false,
}: MetricsCardsProps) {
  const metrics = [
    {
      title: "States Covered",
      value: totalStates,
      icon: MapPin,
      color: "text-chart-2",
      testId: "metric-states",
    },
    {
      title: "Fertilizer Types",
      value: totalFertilizerTypes,
      icon: Package,
      color: "text-primary",
      testId: "metric-types",
    },
    {
      title: "Critical Shortages",
      value: criticalShortages,
      icon: AlertTriangle,
      color: "text-destructive",
      testId: "metric-shortages",
    },
    {
      title: "Avg Availability",
      value: `${averageAvailability.toLocaleString()} MT`,
      icon: TrendingUp,
      color: "text-chart-1",
      testId: "metric-availability",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-5 w-5 rounded" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="hover-elevate transition-all duration-150">
            <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <Icon className={`h-5 w-5 ${metric.color}`} />
            </CardHeader>
            <CardContent>
              <div 
                className="text-2xl font-bold tabular-nums" 
                data-testid={metric.testId}
              >
                {metric.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
