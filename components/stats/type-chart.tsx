/**
 * @file components/stats/type-chart.tsx
 * @description 타입별 관광지 분포 차트 컴포넌트
 *
 * 이 컴포넌트는 타입별 관광지 개수와 비율을 Donut Chart로 시각화합니다.
 * 각 관광 타입별 비율을 도넛 차트로 표시하고, 섹션 클릭 시 해당 타입 목록 페이지로 이동합니다.
 *
 * 주요 기능:
 * - 타입별 관광지 개수 및 비율 Donut Chart 표시
 * - 8개 타입 모두 표시 (관광지, 문화시설, 축제/행사, 여행코스, 레포츠, 숙박, 쇼핑, 음식점)
 * - 섹션 클릭 시 해당 타입 목록 페이지로 이동
 * - 호버 시 정확한 개수 및 비율 표시
 * - 로딩 상태 (Skeleton UI)
 * - 에러 처리
 *
 * @dependencies
 * - lib/api/stats-api.ts: getTypeStats() 함수
 * - lib/types/stats.ts: TypeStats 타입
 * - components/stats/type-chart-client.tsx: 차트 클라이언트 컴포넌트
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6.2 관광 타입별 분포)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getTypeStats } from "@/lib/api/stats-api";
import { TourApiError } from "@/lib/api/tour-api";
import type { TypeStats } from "@/lib/types/stats";
import { ErrorDisplayWithRetry } from "@/components/stats/error-with-retry";
import { Skeleton } from "@/components/ui/skeleton";
import { TypeChartClient } from "@/components/stats/type-chart-client";

/**
 * 타입별 관광지 분포 차트 컴포넌트
 * @returns {JSX.Element} 타입별 분포 차트 요소
 */
export async function TypeChart() {
  let typeStats: TypeStats[] = [];
  let error: Error | null = null;

  try {
    typeStats = await getTypeStats();
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("타입별 통계 데이터를 불러올 수 없습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplayWithRetry
        error={error}
        title="타입별 통계를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (typeStats.length === 0) {
    return (
      <section
        aria-labelledby="type-chart-heading"
        className="rounded-lg border bg-card p-4 md:p-6"
      >
        <h2
          id="type-chart-heading"
          className="text-xl md:text-2xl font-bold mb-4"
        >
          타입별 관광지 분포
        </h2>
        <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="type-chart-heading"
      className="space-y-4 md:space-y-6"
    >
      <h2 id="type-chart-heading" className="text-xl md:text-2xl font-bold">
        타입별 관광지 분포
      </h2>

      <div className="rounded-lg border bg-card p-4 md:p-6">
        <TypeChartClient typeStats={typeStats} />
      </div>
    </section>
  );
}

/**
 * 타입별 관광지 분포 차트 스켈레톤 컴포넌트
 * 로딩 상태를 표시하는 스켈레톤 UI
 */
export function TypeChartSkeleton() {
  return (
    <section
      aria-labelledby="type-chart-heading"
      className="space-y-4 md:space-y-6"
    >
      <Skeleton className="h-7 w-48" />
      <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-24" />
        </div>
        {/* 차트 영역 스켈레톤 */}
        <div className="flex items-center justify-center">
          <Skeleton className="h-[300px] w-[300px] md:h-[400px] md:w-[400px] rounded-full" />
        </div>
        {/* 범례 스켈레톤 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-3 w-full max-w-md mx-auto" />
      </div>
    </section>
  );
}
