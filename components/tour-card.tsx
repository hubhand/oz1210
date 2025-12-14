/**
 * @file components/tour-card.tsx
 * @description 관광지 카드 컴포넌트
 *
 * 이 컴포넌트는 개별 관광지 정보를 카드 형태로 표시합니다.
 * 썸네일 이미지, 관광지명, 주소, 타입 뱃지를 표시하고,
 * 클릭 시 상세페이지로 이동합니다.
 *
 * 주요 기능:
 * - 썸네일 이미지 표시 (기본 이미지 fallback)
 * - 관광지명, 주소, 타입 뱃지 표시
 * - 호버 효과 (scale, shadow)
 * - 클릭 시 상세페이지 이동
 * - 반응형 디자인
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useState, memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, ImageIcon } from "lucide-react";
import type { TourItem } from "@/lib/types/tour";
import { getContentTypeName } from "@/lib/types/stats";
import { getPetSizeLabel } from "@/lib/utils/pet-filter";
import { cn } from "@/lib/utils";

export interface TourCardProps {
  /** 관광지 정보 */
  tour: TourItem;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 선택 상태 (지도-리스트 연동용) */
  isSelected?: boolean;
  /** 클릭 핸들러 (지도-리스트 연동용) */
  onClick?: () => void;
}

/**
 * 관광지 이미지 URL 가져오기
 * @param tour 관광지 정보
 * @returns 이미지 URL 또는 null
 */
function getTourImageUrl(tour: TourItem): string | null {
  return tour.firstimage || tour.firstimage2 || null;
}

/**
 * 타입별 뱃지 색상 가져오기
 * @param contentTypeId 콘텐츠 타입 ID
 * @returns Tailwind CSS 클래스
 */
function getBadgeColor(contentTypeId: string): string {
  const colorMap: Record<string, string> = {
    "12": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", // 관광지
    "14": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", // 문화시설
    "15": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", // 축제/행사
    "25": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", // 여행코스
    "28": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", // 레포츠
    "32": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", // 숙박
    "38": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", // 쇼핑
    "39": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", // 음식점
  };

  return (
    colorMap[contentTypeId] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  );
}

/**
 * 관광지 카드 컴포넌트
 * @param {TourCardProps} props - 컴포넌트 props
 * @returns {JSX.Element} 관광지 카드 요소
 */
function TourCardComponent({
  tour,
  className,
  isSelected = false,
  onClick,
}: TourCardProps) {
  const imageUrl = getTourImageUrl(tour);
  const contentTypeName = getContentTypeName(tour.contenttypeid);
  const badgeColor = getBadgeColor(tour.contenttypeid);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      href={`/places/${tour.contentid}`}
      className={cn(
        "group block rounded-xl border bg-card text-card-foreground shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
        "overflow-hidden",
        isSelected &&
          "ring-2 ring-primary border-primary shadow-lg scale-[1.02]", // 선택 상태 스타일
        className,
      )}
      aria-label={`${tour.title} 상세보기`}
      onClick={onClick}
    >
      {/* 썸네일 이미지 */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {imageUrl && !imageError ? (
          <Image
            src={imageUrl}
            alt={tour.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <ImageIcon className="h-12 w-12" aria-hidden="true" />
              <span className="text-xs">이미지 없음</span>
            </div>
          </div>
        )}
      </div>

      {/* 카드 내용 */}
      <div className="p-4 space-y-3">
        {/* 뱃지 그룹 (관광 타입 + 반려동물) */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 관광 타입 뱃지 */}
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              badgeColor,
            )}
          >
            {contentTypeName}
          </span>
          {/* 반려동물 동반 가능 뱃지 */}
          {tour.petInfo && tour.petInfo.chkpetleash === "Y" && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
                "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
              )}
              title="반려동물 동반 가능"
            >
              <span>🐾</span>
              {getPetSizeLabel(tour.petInfo) || "반려동물 OK"}
            </span>
          )}
        </div>

        {/* 관광지명 */}
        <h3 className="line-clamp-2 text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
          {tour.title}
        </h3>

        {/* 주소 */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span className="line-clamp-2">
            {tour.addr1}
            {tour.addr2 && ` ${tour.addr2}`}
          </span>
        </div>
      </div>
    </Link>
  );
}

// React.memo로 불필요한 리렌더링 방지
export const TourCard = memo(TourCardComponent, (prevProps, nextProps) => {
  // 선택 상태나 tour 데이터가 변경된 경우에만 리렌더링
  return (
    prevProps.tour.contentid === nextProps.tour.contentid &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.className === nextProps.className
  );
});

TourCard.displayName = "TourCard";
