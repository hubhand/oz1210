/**
 * @file components/stats/stats-summary.tsx
 * @description 통계 요약 카드 컴포넌트
 *
 * 이 컴포넌트는 통계 대시보드의 요약 정보를 카드 형태로 표시합니다.
 * 전체 관광지 수, Top 3 지역, Top 3 타입, 마지막 업데이트 시간을 표시합니다.
 *
 * 주요 기능:
 * - 전체 관광지 수 표시 (큰 숫자로 강조)
 * - Top 3 지역 표시 (순위, 지역명, 개수)
 * - Top 3 타입 표시 (순위, 타입명, 개수)
 * - 마지막 업데이트 시간 표시
 * - 로딩 상태 (Skeleton UI)
 * - 에러 처리
 *
 * @dependencies
 * - lib/api/stats-api.ts: getStatsSummary() 함수
 * - lib/types/stats.ts: StatsSummary 타입
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 * - components/ui/skeleton.tsx: Skeleton 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6.3 통계 요약 카드)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import {
  BarChart3,
  MapPin,
  Tag,
  Clock,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import { getStatsSummary } from "@/lib/api/stats-api";
import { TourApiError } from "@/lib/api/tour-api";
import type { StatsSummary } from "@/lib/types/stats";
import { ErrorDisplayWithRetry } from "@/components/stats/error-with-retry";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/**
 * 숫자를 천 단위 구분 기호가 있는 문자열로 변환
 * @param num 숫자
 * @returns 포맷팅된 문자열 (예: 1234567 → "1,234,567")
 */
function formatNumber(num: number): string {
  return new Intl.NumberFormat("ko-KR").format(num);
}

/**
 * ISO 8601 형식의 날짜를 사용자 친화적 형식으로 변환
 * @param isoString ISO 8601 형식의 날짜 문자열
 * @returns 포맷팅된 날짜 문자열 (예: "2025-01-15 14:30")
 */
function formatLastUpdated(isoString: string): string {
  try {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch {
    return isoString;
  }
}

/**
 * 순위에 따른 아이콘 반환
 * @param rank 순위 (1, 2, 3)
 * @returns 아이콘 컴포넌트
 */
function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return Trophy;
    case 2:
      return Medal;
    case 3:
      return Award;
    default:
      return Award;
  }
}

/**
 * 순위에 따른 색상 클래스 반환
 * @param rank 순위 (1, 2, 3)
 * @returns Tailwind CSS 클래스
 */
function getRankColor(rank: number): string {
  switch (rank) {
    case 1:
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case 2:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    case 3:
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
}

/**
 * 통계 요약 카드 컴포넌트
 * @returns {JSX.Element} 통계 요약 카드 요소
 */
export async function StatsSummary() {
  let summary: StatsSummary | null = null;
  let error: Error | null = null;

  try {
    summary = await getStatsSummary();
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("통계 데이터를 불러올 수 없습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplayWithRetry
        error={error}
        title="통계 요약을 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (!summary) {
    return null;
  }

  return (
    <section
      aria-labelledby="stats-summary-heading"
      className="space-y-4 md:space-y-6"
    >
      <h2 id="stats-summary-heading" className="text-xl md:text-2xl font-bold">
        통계 요약
      </h2>

      {/* 카드 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 전체 관광지 수 카드 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              전체 관광지 수
            </h3>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-bold">
              {formatNumber(summary.totalCount)}
            </p>
            <p className="text-sm text-muted-foreground">개</p>
          </div>
        </div>

        {/* Top 3 지역 카드 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Top 3 지역
            </h3>
          </div>
          {summary.topRegions.length > 0 ? (
            <ul className="space-y-3" role="list">
              {summary.topRegions.map((region, index) => {
                const rank = index + 1;
                const RankIcon = getRankIcon(rank);
                return (
                  <li
                    key={region.code}
                    className="flex items-center justify-between"
                    role="listitem"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getRankColor(rank),
                        )}
                        aria-label={`${rank}위`}
                      >
                        <RankIcon className="h-3 w-3" aria-hidden="true" />
                        {rank}위
                      </span>
                      <span className="text-sm font-medium">{region.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(region.count)}개
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">데이터 없음</p>
          )}
        </div>

        {/* Top 3 타입 카드 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Tag className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Top 3 타입
            </h3>
          </div>
          {summary.topTypes.length > 0 ? (
            <ul className="space-y-3" role="list">
              {summary.topTypes.map((type, index) => {
                const rank = index + 1;
                const RankIcon = getRankIcon(rank);
                return (
                  <li
                    key={type.contentTypeId}
                    className="flex items-center justify-between"
                    role="listitem"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getRankColor(rank),
                        )}
                        aria-label={`${rank}위`}
                      >
                        <RankIcon className="h-3 w-3" aria-hidden="true" />
                        {rank}위
                      </span>
                      <span className="text-sm font-medium">
                        {type.typeName}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatNumber(type.count)}개
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">데이터 없음</p>
          )}
        </div>
      </div>

      {/* 마지막 업데이트 시간 */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Clock className="h-4 w-4" aria-hidden="true" />
        <span>마지막 업데이트: {formatLastUpdated(summary.lastUpdated)}</span>
      </div>
    </section>
  );
}

/**
 * 통계 요약 카드 스켈레톤 컴포넌트
 * 로딩 상태를 표시하는 스켈레톤 UI
 */
export function StatsSummarySkeleton() {
  return (
    <section
      aria-labelledby="stats-summary-heading"
      className="space-y-4 md:space-y-6"
    >
      <Skeleton className="h-7 w-32" /> {/* 제목 스켈레톤 */}
      {/* 카드 그리드 레이아웃 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* 전체 관광지 수 카드 스켈레톤 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>

        {/* Top 3 지역 카드 스켈레톤 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        </div>

        {/* Top 3 타입 카드 스켈레톤 */}
        <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <ul className="space-y-3">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-16" />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* 마지막 업데이트 시간 스켈레톤 */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-3 w-48" />
      </div>
    </section>
  );
}
