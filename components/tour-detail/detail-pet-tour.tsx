/**
 * @file components/tour-detail/detail-pet-tour.tsx
 * @description 관광지 반려동물 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 반려동물 동반 여행 정보를 표시하는 섹션입니다.
 * getDetailPetTour() API를 사용하여 데이터를 가져오고,
 * 반려동물 동반 가능 여부, 크기 제한, 입장 가능 장소, 추가 요금,
 * 기타 반려동물 정보, 주차장 정보를 표시합니다.
 *
 * 주요 기능:
 * - 반려동물 동반 가능 여부 표시
 * - 반려동물 크기 제한 정보 표시
 * - 입장 가능 장소 (실내/실외) 표시
 * - 반려동물 동반 추가 요금 표시
 * - 기타 반려동물 정보 표시
 * - 주차장 정보 표시 (반려동물 하차 공간 관련)
 * - 주의사항 강조 표시
 * - 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailPetTour() 함수
 * - lib/types/tour.ts: PetTourInfo 타입
 * - lib/utils/pet-filter.ts: getPetSizeLabel() 함수
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @example
 * ```tsx
 * <DetailPetTour contentId="125266" />
 * ```
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.5 반려동물 동반 여행)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import {
  PawPrint,
  Ruler,
  Home,
  DollarSign,
  Info,
  Car,
  AlertTriangle,
} from "lucide-react";
import { getDetailPetTour, TourApiError } from "@/lib/api/tour-api";
import type { PetTourInfo } from "@/lib/types/tour";
import { ErrorDisplay } from "@/components/ui/error";
import { getPetSizeLabel } from "@/lib/utils/pet-filter";
import { cn } from "@/lib/utils";

export interface DetailPetTourProps {
  /** 관광지 콘텐츠 ID */
  contentId: string;
}

/**
 * 관광지 반려동물 정보 섹션 컴포넌트
 * @param {DetailPetTourProps} props - 컴포넌트 props
 * @returns {JSX.Element} 반려동물 정보 섹션 요소
 */
export async function DetailPetTour({ contentId }: DetailPetTourProps) {
  let petInfo: PetTourInfo | null = null;
  let error: Error | null = null;

  try {
    petInfo = await getDetailPetTour({ contentId });
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("알 수 없는 오류가 발생했습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="반려동물 정보를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (!petInfo) {
    return null; // 반려동물 정보가 없으면 섹션 자체를 숨김
  }

  // 반려동물 동반 가능 여부 확인
  const isPetAllowed = petInfo.chkpetleash === "Y";

  // 표시할 정보 항목들
  const infoItems = [
    {
      key: "chkpetleash",
      label: "반려동물 동반 가능",
      value: isPetAllowed ? "가능" : "불가능",
      icon: PawPrint,
      highlight: isPetAllowed,
    },
    {
      key: "chkpetsize",
      label: "반려동물 크기 제한",
      value: getPetSizeLabel(petInfo) || petInfo.chkpetsize,
      icon: Ruler,
    },
    {
      key: "chkpetplace",
      label: "입장 가능 장소",
      value: petInfo.chkpetplace,
      icon: Home,
    },
    {
      key: "chkpetfee",
      label: "추가 요금",
      value: petInfo.chkpetfee,
      icon: DollarSign,
    },
    {
      key: "parking",
      label: "주차장 정보",
      value: petInfo.parking,
      icon: Car,
    },
  ].filter((item) => item.value && item.value.toString().trim() !== ""); // 값이 있는 항목만 필터링

  // 모든 정보가 없으면 섹션을 숨김
  if (infoItems.length === 0 && !petInfo.petinfo) {
    return null;
  }

  return (
    <section
      className="rounded-lg border bg-card p-4 md:p-6 space-y-4"
      aria-labelledby="pet-tour-heading"
    >
      {/* 섹션 제목 */}
      <h2 id="pet-tour-heading" className="text-xl md:text-2xl font-bold">
        반려동물 정보
      </h2>

      {/* 반려동물 정보 목록 */}
      {infoItems.length > 0 && (
        <div className="space-y-4" role="list">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="flex items-start gap-3"
                role="listitem"
              >
                <Icon
                  className={cn(
                    "h-5 w-5 mt-0.5 flex-shrink-0",
                    item.highlight
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-1">{item.label}</p>
                  <p
                    className={cn(
                      "text-sm break-words whitespace-pre-line",
                      item.highlight
                        ? "text-emerald-700 dark:text-emerald-300 font-medium"
                        : "text-muted-foreground",
                    )}
                    aria-label={`${item.label}: ${item.value}`}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 기타 반려동물 정보 (주의사항 포함) */}
      {petInfo.petinfo && (
        <div className="flex items-start gap-3 pt-2 border-t">
          <Info
            className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium mb-1">기타 정보</p>
            <p
              className="text-sm text-muted-foreground break-words whitespace-pre-line"
              aria-label={`기타 정보: ${petInfo.petinfo}`}
            >
              {petInfo.petinfo}
            </p>
          </div>
        </div>
      )}

      {/* 주의사항 강조 표시 (petinfo에 주의사항 키워드가 포함된 경우) */}
      {petInfo.petinfo &&
        (petInfo.petinfo.includes("주의") ||
          petInfo.petinfo.includes("금지") ||
          petInfo.petinfo.includes("제한") ||
          petInfo.petinfo.includes("불가")) && (
          <div className="flex items-start gap-3 pt-2 border-t border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-3">
            <AlertTriangle
              className="h-5 w-5 mt-0.5 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold mb-1 text-yellow-800 dark:text-yellow-200">
                주의사항
              </p>
              <p
                className="text-sm text-yellow-700 dark:text-yellow-300 break-words whitespace-pre-line"
                aria-label={`주의사항: ${petInfo.petinfo}`}
              >
                {petInfo.petinfo}
              </p>
            </div>
          </div>
        )}
    </section>
  );
}

