/**
 * @file components/tour-filters.tsx
 * @description 관광지 필터 컴포넌트
 *
 * 이 컴포넌트는 관광지 목록을 필터링하기 위한 UI를 제공합니다.
 * 지역 필터, 관광 타입 필터, 정렬 옵션, 반려동물 필터를 포함합니다.
 *
 * 주요 기능:
 * - 지역 필터 (시/도 선택)
 * - 관광 타입 필터 (단일 선택)
 * - 정렬 옵션 (최신순, 이름순)
 * - 반려동물 동반 가능 필터 (토글, 크기별)
 * - URL 쿼리 파라미터와 동기화
 * - 필터 변경 시 URL 업데이트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.5 반려동물 동반 여행)
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { MapPin, Filter, ArrowUpDown } from "lucide-react";
import type { AreaCode } from "@/lib/types/tour";
import { CONTENT_TYPE_MAP, CONTENT_TYPE_IDS } from "@/lib/types/stats";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface TourFiltersProps {
  /** 지역 목록 */
  areas: AreaCode[];
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 정렬 옵션 타입 (API arrange 파라미터 값)
 * API 문서에 따르면:
 * - "B": 수정일순 (최신순)
 * - "A": 제목순 (이름순)
 */
type ArrangeOption = "A" | "B";

/**
 * 정렬 옵션 라벨 매핑
 */
const ARRANGE_LABELS: Record<ArrangeOption, string> = {
  B: "최신순",
  A: "이름순",
} as const;

/**
 * 관광지 필터 컴포넌트
 * @param {TourFiltersProps} props - 컴포넌트 props
 * @returns {JSX.Element} 필터 UI 요소
 */
export function TourFilters({ areas, className }: TourFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 현재 필터 값 읽기
  const currentAreaCode = searchParams.get("areaCode") || undefined;
  const currentContentTypeId = searchParams.get("contentTypeId") || undefined;
  const currentArrange =
    (searchParams.get("arrange") as ArrangeOption) || undefined;
  const currentPetAllowed = searchParams.get("petAllowed") === "true";
  const currentPetSize = searchParams.get("petSize") as
    | "small"
    | "medium"
    | "large"
    | undefined;

  /**
   * URL 쿼리 파라미터 업데이트
   * 검색 키워드는 유지하면서 필터만 업데이트
   * useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
   */
  const updateFilters = useCallback(
    (
      areaCode?: string,
      contentTypeId?: string,
      arrange?: ArrangeOption,
      petAllowed?: boolean,
      petSize?: "small" | "medium" | "large",
    ) => {
      const params = new URLSearchParams(searchParams.toString());

      // 필터 파라미터 업데이트 (keyword는 유지)
      if (areaCode) {
        params.set("areaCode", areaCode);
      } else {
        params.delete("areaCode");
      }

      if (contentTypeId) {
        params.set("contentTypeId", contentTypeId);
      } else {
        params.delete("contentTypeId");
      }

      if (arrange) {
        params.set("arrange", arrange);
      } else {
        params.delete("arrange");
      }

      // 반려동물 필터 파라미터 업데이트
      if (petAllowed !== undefined) {
        if (petAllowed) {
          params.set("petAllowed", "true");
        } else {
          params.delete("petAllowed");
          // petAllowed가 false가 되면 petSize도 제거
          params.delete("petSize");
        }
      }

      if (petSize) {
        params.set("petSize", petSize);
      } else if (petAllowed === undefined) {
        // petAllowed가 undefined인 경우에만 petSize 삭제 (명시적으로 false가 아닌 경우)
        params.delete("petSize");
      }

      // 페이지 번호 초기화
      params.delete("pageNo");

      // URL 업데이트 (keyword는 자동으로 유지됨)
      router.push(`/?${params.toString()}`);
    },
    [router, searchParams],
  );

  /**
   * 지역 필터 변경 핸들러 (useCallback으로 메모이제이션)
   */
  const handleAreaChange = useCallback(
    (areaCode: string) => {
      if (areaCode === "all") {
        updateFilters(
          undefined,
          currentContentTypeId,
          currentArrange,
          currentPetAllowed,
          currentPetSize,
        );
      } else {
        updateFilters(
          areaCode,
          currentContentTypeId,
          currentArrange,
          currentPetAllowed,
          currentPetSize,
        );
      }
    },
    [
      updateFilters,
      currentContentTypeId,
      currentArrange,
      currentPetAllowed,
      currentPetSize,
    ],
  );

  /**
   * 관광 타입 필터 변경 핸들러 (useCallback으로 메모이제이션)
   */
  const handleContentTypeChange = useCallback(
    (contentTypeId: string) => {
      if (contentTypeId === "all") {
        updateFilters(
          currentAreaCode,
          undefined,
          currentArrange,
          currentPetAllowed,
          currentPetSize,
        );
      } else {
        updateFilters(
          currentAreaCode,
          contentTypeId,
          currentArrange,
          currentPetAllowed,
          currentPetSize,
        );
      }
    },
    [
      updateFilters,
      currentAreaCode,
      currentArrange,
      currentPetAllowed,
      currentPetSize,
    ],
  );

  /**
   * 정렬 옵션 변경 핸들러 (useCallback으로 메모이제이션)
   */
  const handleArrangeChange = useCallback(
    (arrange: ArrangeOption) => {
      updateFilters(
        currentAreaCode,
        currentContentTypeId,
        arrange,
        currentPetAllowed,
        currentPetSize,
      );
    },
    [
      updateFilters,
      currentAreaCode,
      currentContentTypeId,
      currentPetAllowed,
      currentPetSize,
    ],
  );

  /**
   * 반려동물 동반 가능 토글 핸들러 (useCallback으로 메모이제이션)
   */
  const handlePetAllowedToggle = useCallback(() => {
    const newPetAllowed = !currentPetAllowed;
    updateFilters(
      currentAreaCode,
      currentContentTypeId,
      currentArrange,
      newPetAllowed,
      newPetAllowed ? currentPetSize : undefined,
    );
  }, [
    updateFilters,
    currentAreaCode,
    currentContentTypeId,
    currentArrange,
    currentPetAllowed,
    currentPetSize,
  ]);

  /**
   * 반려동물 크기 필터 변경 핸들러 (useCallback으로 메모이제이션)
   */
  const handlePetSizeChange = useCallback(
    (petSize: "small" | "medium" | "large" | "all") => {
      if (petSize === "all") {
        updateFilters(
          currentAreaCode,
          currentContentTypeId,
          currentArrange,
          currentPetAllowed,
          undefined,
        );
      } else {
        updateFilters(
          currentAreaCode,
          currentContentTypeId,
          currentArrange,
          currentPetAllowed,
          petSize,
        );
      }
    },
    [
      updateFilters,
      currentAreaCode,
      currentContentTypeId,
      currentArrange,
      currentPetAllowed,
    ],
  );

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 md:p-6 space-y-4",
        className,
      )}
    >
      {/* 필터 제목 */}
      <div className="flex items-center gap-2">
        <Filter className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-lg font-semibold">필터</h2>
      </div>

      {/* 필터 그룹 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* 지역 필터 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            지역
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentAreaCode === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => handleAreaChange("all")}
              className="text-xs"
            >
              전체
            </Button>
            {areas.map((area) => (
              <Button
                key={area.code}
                variant={currentAreaCode === area.code ? "default" : "outline"}
                size="sm"
                onClick={() => handleAreaChange(area.code)}
                className="text-xs"
              >
                {area.name}
              </Button>
            ))}
          </div>
        </div>

        {/* 관광 타입 필터 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <Filter className="h-4 w-4" aria-hidden="true" />
            관광 타입
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={
                currentContentTypeId === undefined ? "default" : "outline"
              }
              size="sm"
              onClick={() => handleContentTypeChange("all")}
              className="text-xs"
            >
              전체
            </Button>
            {CONTENT_TYPE_IDS.map((typeId) => (
              <Button
                key={typeId}
                variant={
                  currentContentTypeId === typeId ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleContentTypeChange(typeId)}
                className="text-xs"
              >
                {CONTENT_TYPE_MAP[typeId]}
              </Button>
            ))}
          </div>
        </div>

        {/* 반려동물 필터 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <span className="text-base" aria-hidden="true">
              🐾
            </span>
            반려동물
          </label>
          <div className="space-y-2">
            {/* 반려동물 동반 가능 토글 */}
            <Button
              variant={currentPetAllowed ? "default" : "outline"}
              size="sm"
              onClick={handlePetAllowedToggle}
              className="text-xs w-full justify-start"
            >
              <span className="mr-1">🐾</span>
              반려동물 동반 가능
            </Button>
            {/* 크기별 필터 (반려동물 필터가 활성화된 경우에만 표시) */}
            {currentPetAllowed && (
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={currentPetSize === undefined ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePetSizeChange("all")}
                  className="text-xs"
                >
                  전체
                </Button>
                <Button
                  variant={currentPetSize === "small" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePetSizeChange("small")}
                  className="text-xs"
                >
                  소형
                </Button>
                <Button
                  variant={currentPetSize === "medium" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePetSizeChange("medium")}
                  className="text-xs"
                >
                  중형
                </Button>
                <Button
                  variant={currentPetSize === "large" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePetSizeChange("large")}
                  className="text-xs"
                >
                  대형
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 정렬 옵션 */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium">
            <ArrowUpDown className="h-4 w-4" aria-hidden="true" />
            정렬
          </label>
          <div className="flex gap-2">
            {Object.entries(ARRANGE_LABELS).map(([value, label]) => (
              <Button
                key={value}
                variant={currentArrange === value ? "default" : "outline"}
                size="sm"
                onClick={() => handleArrangeChange(value as ArrangeOption)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
