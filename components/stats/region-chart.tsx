/**
 * @file components/stats/region-chart.tsx
 * @description 지역별 관광지 분포 차트 컴포넌트
 *
 * 이 컴포넌트는 지역별 관광지 개수를 Bar Chart로 시각화합니다.
 * 각 시/도별 관광지 개수를 막대 그래프로 표시하고, 바 클릭 시 해당 지역 목록 페이지로 이동합니다.
 *
 * 주요 기능:
 * - 지역별 관광지 개수 Bar Chart 표시
 * - 상위 10개 지역 표시
 * - 바 클릭 시 해당 지역 목록 페이지로 이동
 * - 호버 시 정확한 개수 표시
 * - 로딩 상태 (Skeleton UI)
 * - 에러 처리
 *
 * @dependencies
 * - lib/api/stats-api.ts: getRegionStats() 함수
 * - lib/types/stats.ts: RegionStats 타입
 * - components/stats/region-chart-client.tsx: 차트 클라이언트 컴포넌트
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6.1 지역별 관광지 분포)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getRegionStats } from "@/lib/api/stats-api";
import { TourApiError } from "@/lib/api/tour-api";
import type { RegionStats } from "@/lib/types/stats";
import { ErrorDisplayWithRetry } from "@/components/stats/error-with-retry";
import { Skeleton } from "@/components/ui/skeleton";
import { RegionChartClient } from "@/components/stats/region-chart-client";

/**
 * 지역별 관광지 분포 차트 컴포넌트
 * @returns {JSX.Element} 지역별 분포 차트 요소
 */
export async function RegionChart() {
  let regionStats: RegionStats[] = [];
  let error: Error | null = null;

  try {
    regionStats = await getRegionStats();
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("지역별 통계 데이터를 불러올 수 없습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplayWithRetry
        error={error}
        title="지역별 통계를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (regionStats.length === 0) {
    return (
      <section
        aria-labelledby="region-chart-heading"
        className="rounded-lg border bg-card p-4 md:p-6"
      >
        <h2
          id="region-chart-heading"
          className="text-xl md:text-2xl font-bold mb-4"
        >
          지역별 관광지 분포
        </h2>
        <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="region-chart-heading"
      className="space-y-4 md:space-y-6"
    >
      <h2
        id="region-chart-heading"
        className="text-xl md:text-2xl font-bold"
      >
        지역별 관광지 분포
      </h2>

      <div className="rounded-lg border bg-card p-4 md:p-6">
        <RegionChartClient regionStats={regionStats} />
      </div>
    </section>
  );
}

/**
 * 지역별 관광지 분포 차트 스켈레톤 컴포넌트
 * 로딩 상태를 표시하는 스켈레톤 UI
 */
export function RegionChartSkeleton() {
  return (
    <section
      aria-labelledby="region-chart-heading"
      className="space-y-4 md:space-y-6"
    >
      <Skeleton className="h-7 w-48" />
      <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* 차트 영역 스켈레톤 */}
        <div className="h-[300px] md:h-[400px] space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton
                className="h-8 flex-1"
                style={{
                  width: `${Math.random() * 40 + 30}%`,
                }}
              />
            </div>
          ))}
        </div>
        <Skeleton className="h-3 w-full max-w-md mx-auto" />
      </div>
    </section>
  );
}

