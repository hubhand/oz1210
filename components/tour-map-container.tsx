/**
 * @file components/tour-map-container.tsx
 * @description 관광지 목록과 지도 연동 컨테이너 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록과 네이버 지도를 양방향으로 연동하는 기능을 제공합니다.
 * 리스트 항목 클릭 시 지도 이동 및 마커 강조, 마커 클릭 시 리스트 항목 강조 기능을 포함합니다.
 *
 * 주요 기능:
 * - 선택된 관광지 ID 상태 관리
 * - 리스트 항목 클릭 시 지도 이동
 * - 마커 클릭 시 리스트 항목 강조
 * - 리스트와 지도 컴포넌트 통합 렌더링
 * - 반응형 레이아웃 (데스크톱: 분할, 모바일: 탭)
 * - 무한 스크롤 데이터 업데이트 처리
 * - 성능 최적화 (useCallback, useMemo)
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.2 네이버 지도 연동)
 */

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { List, MapPin } from "lucide-react";
import { TourList } from "./tour-list";
import { NaverMap } from "./naver-map";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { TourItem } from "@/lib/types/tour";
import type { InfiniteScrollParams } from "@/hooks/use-infinite-scroll";
import { cn } from "@/lib/utils";

export interface TourMapContainerProps {
  /** 초기 관광지 목록 (Server Component에서 로드) */
  initialTours: TourItem[];
  /** 초기 전체 개수 */
  initialTotalCount: number;
  /** 에러 상태 */
  error?: Error | null;
  /** 검색 키워드 */
  searchKeyword?: string;
  /** 무한 스크롤 파라미터 */
  infiniteScrollParams?: InfiniteScrollParams;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 무한 스크롤로 로드된 전체 관광지 목록 (TourList에서 업데이트) */
  onToursUpdate?: (tours: TourItem[]) => void;
}

/**
 * 관광지 목록과 지도 연동 컨테이너 컴포넌트
 * @param {TourMapContainerProps} props - 컴포넌트 props
 * @returns {JSX.Element} 리스트와 지도 연동 요소
 */
export function TourMapContainer({
  initialTours,
  initialTotalCount,
  error,
  searchKeyword,
  infiniteScrollParams,
  className,
}: TourMapContainerProps) {
  const [selectedTourId, setSelectedTourId] = useState<string | undefined>();
  const [displayTours, setDisplayTours] = useState<TourItem[]>(initialTours);

  // 초기 관광지 목록이 변경되면 업데이트 (useMemo로 최적화)
  const initialToursMemo = useMemo(() => initialTours, [initialTours]);

  useEffect(() => {
    setDisplayTours(initialToursMemo);
    setSelectedTourId(undefined);
  }, [initialToursMemo]);

  // 무한 스크롤로 로드된 데이터 업데이트 (useCallback으로 최적화)
  const handleToursUpdate = useCallback((tours: TourItem[]) => {
    setDisplayTours(tours);
  }, []);

  /**
   * 리스트 항목 클릭 핸들러
   * 선택 상태를 업데이트하여 지도가 해당 마커로 이동하도록 함
   */
  const handleCardClick = useCallback((tourId: string) => {
    setSelectedTourId(tourId);
  }, []);

  /**
   * 마커 클릭 핸들러
   * 선택 상태를 업데이트하여 리스트 항목이 강조 표시되도록 함
   */
  const handleMarkerClick = useCallback((tour: TourItem) => {
    setSelectedTourId(tour.contentid);
  }, []);

  return (
    <div className={cn("w-full", className)}>
      {/* 모바일: 탭 형태로 리스트/지도 전환 */}
      <div className="md:hidden">
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              <span>목록</span>
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <MapPin className="h-4 w-4" />
              <span>지도</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="list" className="mt-0">
            <TourList
              initialTours={initialTours}
              initialTotalCount={initialTotalCount}
              infiniteScrollParams={infiniteScrollParams}
              error={error}
              searchKeyword={searchKeyword}
              selectedTourId={selectedTourId}
              onCardClick={handleCardClick}
              onToursUpdate={handleToursUpdate}
            />
          </TabsContent>
          <TabsContent value="map" className="mt-0">
            {displayTours.length > 0 && !error ? (
              <NaverMap
                tours={displayTours}
                selectedTourId={selectedTourId}
                onMarkerClick={handleMarkerClick}
                height="400px"
              />
            ) : (
              <div className="flex items-center justify-center h-[400px] rounded-lg border bg-muted">
                <p className="text-sm text-muted-foreground">
                  지도를 표시할 수 없습니다
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* 데스크톱: 좌우 분할 레이아웃 (50%씩) */}
      <div className="hidden md:flex md:flex-row md:gap-6 md:h-[calc(100vh-280px)] md:min-h-[600px]">
        {/* 좌측: 관광지 목록 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
          <TourList
            initialTours={initialTours}
            initialTotalCount={initialTotalCount}
            infiniteScrollParams={infiniteScrollParams}
            error={error}
            searchKeyword={searchKeyword}
            selectedTourId={selectedTourId}
            onCardClick={handleCardClick}
            className="h-full grid-cols-1"
            onToursUpdate={handleToursUpdate}
          />
        </div>

        {/* 우측: 네이버 지도 (고정 높이) */}
        <div className="flex-1 flex-shrink-0 min-w-0">
          {displayTours.length > 0 && !error ? (
            <NaverMap
              tours={displayTours}
              selectedTourId={selectedTourId}
              onMarkerClick={handleMarkerClick}
              height="100%"
              className="h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full rounded-lg border bg-muted">
              <p className="text-sm text-muted-foreground">
                지도를 표시할 수 없습니다
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
