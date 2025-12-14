/**
 * @file app/page.tsx
 * @description My Trip 홈페이지 - 관광지 목록 페이지
 *
 * 이 페이지는 My Trip 서비스의 메인 홈페이지입니다.
 * 관광지 목록을 표시하고 필터링 및 검색 기능을 제공합니다.
 *
 * 주요 기능:
 * 1. 관광지 목록 표시 (Phase 2.2에서 구현)
 * 2. 필터 기능 (지역, 타입, 정렬) - Phase 2.3에서 구현
 * 3. 검색 기능 - Phase 2.4에서 구현
 * 4. 네이버 지도 연동 - Phase 2.5에서 구현 완료
 * 5. 무한 스크롤 페이지네이션 - Phase 2.6에서 구현 완료
 *
 * 현재 단계 (Phase 2.6):
 * - 무한 스크롤 페이지네이션 통합 완료
 * - 리스트-지도 연동 (양방향)
 * - 반응형 레이아웃 (모바일: 탭, 데스크톱: 분할)
 * - 에러 처리 및 로딩 상태 개선
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
  title: "홈 | My Trip",
  description:
    "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
  openGraph: {
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
    url: getSiteUrl(),
    siteName: "My Trip",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
  },
};

/**
 * 페이지 재검증 주기 (초)
 * 관광지 목록은 30분마다 재검증 (1800초)
 * ISR (Incremental Static Regeneration) 적용
 */
export const revalidate = 1800;
import {
  getAreaCode,
  getAreaBasedList,
  searchKeyword,
} from "@/lib/api/tour-api";
import { TourFilters } from "@/components/tour-filters";
import { TourMapContainer } from "@/components/tour-map-container";
import { TourApiError } from "@/lib/api/tour-api";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchPetInfoForTours,
  filterToursByPetInfo,
} from "@/lib/utils/pet-filter";

interface HomePageProps {
  searchParams: Promise<{
    keyword?: string;
    areaCode?: string;
    contentTypeId?: string;
    arrange?: string;
    pageNo?: string;
    petAllowed?: string;
    petSize?: string;
  }>;
}

/**
 * 필터 파라미터를 API 파라미터로 변환 (getAreaBasedList용)
 */
function buildAreaBasedListParams(searchParams: {
  areaCode?: string;
  contentTypeId?: string;
  arrange?: string;
  pageNo?: string;
}) {
  return {
    areaCode: searchParams.areaCode || "1", // 기본값: 서울
    contentTypeId: searchParams.contentTypeId || undefined,
    arrange:
      (searchParams.arrange as
        | "A"
        | "B"
        | "C"
        | "D"
        | "E"
        | "O"
        | "Q"
        | "R"
        | "S") || undefined,
    numOfRows: 12,
    pageNo: parseInt(searchParams.pageNo || "1", 10),
  };
}

/**
 * 검색 파라미터를 API 파라미터로 변환 (searchKeyword용)
 */
function buildSearchParams(searchParams: {
  keyword: string;
  areaCode?: string;
  contentTypeId?: string;
  arrange?: string;
  pageNo?: string;
}) {
  return {
    keyword: searchParams.keyword,
    areaCode: searchParams.areaCode || undefined,
    contentTypeId: searchParams.contentTypeId || undefined,
    arrange:
      (searchParams.arrange as
        | "A"
        | "B"
        | "C"
        | "D"
        | "E"
        | "O"
        | "Q"
        | "R"
        | "S") || undefined,
    numOfRows: 12,
    pageNo: parseInt(searchParams.pageNo || "1", 10),
  };
}

/**
 * 지역 목록 로딩 스켈레톤
 */
function AreaListSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-8 w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 홈페이지 메인 컴포넌트
 */
async function HomePageContent({ searchParams }: HomePageProps) {
  const params = await searchParams;

  // 지역 목록 로드
  let areas: Awaited<ReturnType<typeof getAreaCode>> = [];
  try {
    areas = await getAreaCode();
  } catch (err) {
    console.error("지역 목록 로드 실패:", err);
    // 에러 발생 시 빈 배열 사용
  }

  // 관광지 목록 또는 검색 결과 로드
  let tours = [];
  let totalCount = 0;
  let error: Error | null = null;
  let searchKeywordValue: string | undefined = undefined;

  // 반려동물 필터 파라미터 파싱
  const petAllowed = params.petAllowed === "true";
  const petSize = params.petSize as "small" | "medium" | "large" | undefined;

  try {
    // 검색 키워드가 있으면 검색 API 호출, 없으면 지역 기반 목록 API 호출
    if (params.keyword && params.keyword.trim()) {
      searchKeywordValue = params.keyword.trim();
      const searchParams = buildSearchParams({
        keyword: searchKeywordValue,
        areaCode: params.areaCode,
        contentTypeId: params.contentTypeId,
        arrange: params.arrange,
        pageNo: params.pageNo,
      });
      const result = await searchKeyword(searchParams);
      tours = result.items || [];
      totalCount = result.totalCount || 0;
    } else {
      const apiParams = buildAreaBasedListParams(params);
      const result = await getAreaBasedList(apiParams);
      tours = result.items || [];
      totalCount = result.totalCount || 0;
    }

    // 반려동물 필터가 활성화된 경우 반려동물 정보 조회 및 필터링
    if (petAllowed) {
      // 반려동물 정보 병렬 조회
      tours = await fetchPetInfoForTours(tours);

      // 반려동물 필터 조건에 맞는 관광지만 필터링
      tours = filterToursByPetInfo(tours, {
        petAllowed: true,
        petSize: petSize,
      });

      // 반려동물 필터링 후 totalCount 조정 (정확하지 않을 수 있음)
      // 실제로는 필터링된 결과의 개수를 사용
      totalCount = tours.length;
    }
  } catch (err) {
    // 에러 처리
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("알 수 없는 오류가 발생했습니다.");
    }
  }

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto">
        <section className="space-y-6">
          {/* 필터 컴포넌트 */}
          <Suspense fallback={<AreaListSkeleton />}>
            <TourFilters areas={areas} />
          </Suspense>

          {/* 검색 결과 개수 표시 */}
          {searchKeywordValue && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  &quot;{searchKeywordValue}&quot;
                </span>{" "}
                검색 결과: {tours.length}개
              </p>
            </div>
          )}

          {/* 관광지 목록 및 지도 연동 */}
          <TourMapContainer
            initialTours={tours}
            initialTotalCount={totalCount}
            error={error}
            searchKeyword={searchKeywordValue}
            infiniteScrollParams={{
              areaCode: params.areaCode,
              contentTypeId: params.contentTypeId,
              arrange: params.arrange,
              keyword: searchKeywordValue,
              petAllowed: petAllowed,
              petSize: petSize,
            }}
          />
        </section>
      </div>
    </main>
  );
}

/**
 * 홈페이지 (Suspense로 감싸서 searchParams 처리)
 */
export default async function HomePage(props: HomePageProps) {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
          <div className="w-full max-w-7xl mx-auto">
            <section className="space-y-6">
              <AreaListSkeleton />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card shadow-md overflow-hidden"
                  >
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      }
    >
      <HomePageContent {...props} />
    </Suspense>
  );
}
