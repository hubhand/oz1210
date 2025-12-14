/**
 * @file components/tour-list.tsx
 * @description 관광지 목록 컴포넌트
 *
 * 이 컴포넌트는 관광지 카드들을 그리드 레이아웃으로 표시합니다.
 * 로딩 상태, 빈 상태, 에러 상태를 처리합니다.
 * 무한 스크롤 기능을 포함합니다.
 *
 * 주요 기능:
 * - 그리드 레이아웃으로 관광지 카드 표시
 * - 로딩 상태 (Skeleton UI)
 * - 빈 상태 처리
 * - 에러 상태 처리 (초기 에러와 무한 스크롤 에러 구분)
 * - 반응형 디자인 (모바일/태블릿/데스크톱)
 * - 무한 스크롤 (Intersection Observer)
 * - 지도-리스트 연동 (선택 상태 관리)
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useEffect } from "react";
import { Inbox } from "lucide-react";
import type { TourItem } from "@/lib/types/tour";
import { TourCard } from "./tour-card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorDisplay } from "@/components/ui/error";
import { LoadingMore } from "@/components/ui/loading-more";
import {
  useInfiniteScroll,
  type InfiniteScrollParams,
} from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";

export interface TourListProps {
  /** 초기 관광지 목록 (Server Component에서 로드) */
  initialTours: TourItem[];
  /** 초기 전체 개수 */
  initialTotalCount: number;
  /** 필터/검색 파라미터 (무한 스크롤용) */
  infiniteScrollParams?: InfiniteScrollParams;
  /** 로딩 상태 (초기 로딩) */
  isLoading?: boolean;
  /** 에러 상태 */
  error?: Error | null;
  /** 재시도 콜백 함수 */
  onRetry?: () => void;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 검색 키워드 (검색 결과 없음 메시지 개선용) */
  searchKeyword?: string;
  /** 선택된 관광지 ID (지도-리스트 연동용) */
  selectedTourId?: string;
  /** 카드 클릭 핸들러 (지도-리스트 연동용) */
  onCardClick?: (tourId: string) => void;
  /** 무한 스크롤 비활성화 (선택 사항) */
  disableInfiniteScroll?: boolean;
  /** 무한 스크롤로 로드된 데이터 업데이트 콜백 */
  onToursUpdate?: (tours: TourItem[]) => void;
}

/**
 * 스켈레톤 카드 컴포넌트
 */
function TourCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card shadow-md overflow-hidden">
      {/* 이미지 스켈레톤 */}
      <Skeleton className="aspect-video w-full" />
      {/* 내용 스켈레톤 */}
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-20" /> {/* 뱃지 */}
        <Skeleton className="h-6 w-full" /> {/* 제목 */}
        <Skeleton className="h-6 w-3/4" /> {/* 제목 2줄 */}
        <Skeleton className="h-4 w-full" /> {/* 주소 */}
        <Skeleton className="h-4 w-2/3" /> {/* 주소 2줄 */}
      </div>
    </div>
  );
}

/**
 * 빈 상태 컴포넌트
 */
function EmptyState({ searchKeyword }: { searchKeyword?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold mb-2">
        {searchKeyword ? "검색 결과가 없습니다" : "관광지가 없습니다"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {searchKeyword ? (
          <>
            &quot;{searchKeyword}&quot;에 대한 검색 결과를 찾을 수 없습니다.
            <br />
            다른 키워드로 검색하거나 필터를 변경해보세요.
          </>
        ) : (
          <>
            검색 조건에 맞는 관광지를 찾을 수 없습니다.
            <br />
            다른 지역이나 타입을 선택해보세요.
          </>
        )}
      </p>
    </div>
  );
}

/**
 * 관광지 목록 컴포넌트
 * @param {TourListProps} props - 컴포넌트 props
 * @returns {JSX.Element} 관광지 목록 요소
 */
export function TourList({
  initialTours,
  initialTotalCount,
  infiniteScrollParams,
  isLoading = false,
  error = null,
  onRetry,
  className,
  searchKeyword,
  selectedTourId,
  onCardClick,
  disableInfiniteScroll = false,
  onToursUpdate,
}: TourListProps) {
  // 무한 스크롤 훅 사용
  const {
    tours,
    isLoading: isLoadingMore,
    hasMore,
    error: infiniteScrollError,
    sentinelRef,
    loadMore,
  } = useInfiniteScroll(
    initialTours,
    initialTotalCount,
    infiniteScrollParams || {},
  );

  // 무한 스크롤이 비활성화된 경우 초기 데이터만 사용
  const displayTours = disableInfiniteScroll ? initialTours : tours;
  // 초기 로딩 에러와 무한 스크롤 에러 구분
  const initialError = error;
  const scrollError = infiniteScrollError;

  // 무한 스크롤로 로드된 데이터를 부모 컴포넌트에 전달
  useEffect(() => {
    if (!disableInfiniteScroll && onToursUpdate) {
      onToursUpdate(displayTours);
    }
  }, [displayTours, disableInfiniteScroll, onToursUpdate]);

  // 초기 로딩 에러 상태 (전체 목록 대체)
  if (initialError && displayTours.length === 0) {
    return (
      <div className={cn("w-full", className)}>
        <ErrorDisplay
          error={initialError}
          onRetry={onRetry}
          title="관광지 목록을 불러올 수 없습니다"
          retryLabel="다시 시도"
        />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
          className,
        )}
        role="status"
        aria-label="로딩 중"
      >
        {Array.from({ length: 6 }).map((_, index) => (
          <TourCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  // 빈 상태
  if (displayTours.length === 0 && !isLoading) {
    return (
      <div className={cn("w-full", className)} role="status" aria-live="polite">
        <EmptyState searchKeyword={searchKeyword} />
      </div>
    );
  }

  // 관광지 목록 표시
  // 데스크톱 분할 레이아웃에서는 단일 컬럼, 모바일에서는 그리드 레이아웃
  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "grid gap-4",
          // 기본: 모바일/태블릿 그리드 레이아웃
          "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        )}
        role="list"
        aria-label="관광지 목록"
      >
        {displayTours.map((tour) => (
          <div key={tour.contentid} role="listitem">
            <TourCard
              tour={tour}
              isSelected={tour.contentid === selectedTourId}
              onClick={() => onCardClick?.(tour.contentid)}
            />
          </div>
        ))}
      </div>

      {/* 무한 스크롤 로딩 인디케이터 */}
      {!disableInfiniteScroll && (
        <>
          {/* 무한 스크롤 에러 표시 (부분 에러) */}
          {scrollError && (
            <div className="py-4">
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
                <p className="text-sm text-destructive font-medium mb-2">
                  추가 데이터를 불러오는 중 오류가 발생했습니다
                </p>
                <p className="text-xs text-muted-foreground mb-3">
                  {scrollError.message}
                </p>
                <button
                  onClick={() => {
                    // 무한 스크롤 재시도는 loadMore 호출
                    loadMore();
                  }}
                  className="text-xs text-primary hover:underline font-medium"
                  aria-label="다시 시도"
                >
                  다시 시도
                </button>
              </div>
            </div>
          )}
          <LoadingMore
            isLoading={isLoadingMore}
            hasMore={hasMore}
            sentinelRef={sentinelRef}
          />
        </>
      )}
    </div>
  );
}
