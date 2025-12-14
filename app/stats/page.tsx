/**
 * @file app/stats/page.tsx
 * @description 통계 대시보드 페이지
 *
 * 이 페이지는 전국 관광지 데이터를 차트로 시각화하여
 * 사용자가 한눈에 관광지 현황을 파악할 수 있는 통계 페이지입니다.
 *
 * 주요 기능 (현재 단계 - Phase 4.6):
 * 1. 기본 레이아웃 구조
 * 2. 반응형 디자인 설정
 * 3. 통계 요약 카드 (전체 개수, Top 3 지역/타입)
 * 4. 지역별 분포 차트 (Bar Chart)
 * 5. 타입별 분포 차트 (Donut Chart)
 * 6. 에러 처리 및 재시도 기능
 *
 * @dependencies
 * - Next.js 15 App Router (Server Component)
 * - components/stats/stats-summary.tsx: StatsSummary 컴포넌트
 * - components/stats/region-chart.tsx: RegionChart 컴포넌트
 * - components/stats/type-chart.tsx: TypeChart 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { Suspense } from "react";
import { Metadata } from "next";

/**
 * 사이트 기본 URL 가져오기
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return "https://my-trip.vercel.app";
}

export const metadata: Metadata = {
  title: "통계 대시보드 | My Trip",
  description:
    "전국 관광지 데이터를 차트로 시각화하여 지역별, 타입별 분포를 한눈에 확인할 수 있습니다.",
  openGraph: {
    title: "통계 대시보드 | My Trip",
    description:
      "전국 관광지 데이터를 차트로 시각화하여 지역별, 타입별 분포를 한눈에 확인할 수 있습니다.",
    url: `${getSiteUrl()}/stats`,
    siteName: "My Trip",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "통계 대시보드 | My Trip",
    description:
      "전국 관광지 데이터를 차트로 시각화하여 지역별, 타입별 분포를 한눈에 확인할 수 있습니다.",
  },
};
import {
  StatsSummary,
  StatsSummarySkeleton,
} from "@/components/stats/stats-summary";
import {
  RegionChart,
  RegionChartSkeleton,
} from "@/components/stats/region-chart";
import { TypeChart, TypeChartSkeleton } from "@/components/stats/type-chart";

/**
 * 통계 대시보드 페이지 메인 컴포넌트
 * @returns {JSX.Element} 통계 대시보드 페이지 요소
 */
export default async function StatsPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* 페이지 제목 */}
        <h1 className="text-2xl md:text-3xl font-bold mb-8">통계 대시보드</h1>

        {/* 섹션 컨테이너 */}
        <div className="space-y-8">
          {/* 통계 요약 카드 섹션 */}
          <Suspense fallback={<StatsSummarySkeleton />}>
            <StatsSummary />
          </Suspense>

          {/* 지역별 분포 차트 섹션 */}
          <Suspense fallback={<RegionChartSkeleton />}>
            <RegionChart />
          </Suspense>

          {/* 타입별 분포 차트 섹션 */}
          <Suspense fallback={<TypeChartSkeleton />}>
            <TypeChart />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
