import { useQuery } from "@tanstack/react-query";
import { DashboardHeader } from "@/components/dashboard-header";
import { MetricsCards } from "@/components/metrics-cards";
import { FertilizerTable } from "@/components/fertilizer-table";
import { FertilizerTrendsChart } from "@/components/fertilizer-trends-chart";
import { TopFertilizers } from "@/components/top-fertilizers";
import type { FertilizerRecord, DashboardMetrics } from "@shared/schema";

export default function Dashboard() {
  const { data: fertilizerData = [], isLoading: isDataLoading } = useQuery<FertilizerRecord[]>({
    queryKey: ["/api/fertilizer/data"],
  });

  const { data: metrics, isLoading: isMetricsLoading } = useQuery<DashboardMetrics>({
    queryKey: ["/api/fertilizer/metrics"],
  });

  const isLoading = isDataLoading || isMetricsLoading;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Supply Chain Overview
            </h2>
            <p className="text-muted-foreground">
              Monitor fertilizer availability and requirements across India
            </p>
          </div>

          <MetricsCards
            totalStates={metrics?.totalStates || 0}
            totalFertilizerTypes={metrics?.totalFertilizerTypes || 0}
            criticalShortages={metrics?.criticalShortages || 0}
            averageAvailability={metrics?.averageAvailability || 0}
            isLoading={isMetricsLoading}
          />

          <TopFertilizers />

          <FertilizerTrendsChart allData={fertilizerData} />

          <FertilizerTable data={fertilizerData} isLoading={isDataLoading} />
        </div>
      </main>
    </div>
  );
}
