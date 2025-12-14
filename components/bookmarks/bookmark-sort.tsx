/**
 * @file components/bookmarks/bookmark-sort.tsx
 * @description 북마크 정렬 UI 컴포넌트
 *
 * 이 컴포넌트는 북마크 목록의 정렬 옵션을 선택할 수 있는 UI를 제공합니다.
 * URL 쿼리 파라미터로 정렬 상태를 관리합니다.
 *
 * 주요 기능:
 * - 정렬 옵션 선택 (최신순, 이름순, 지역별)
 * - URL 쿼리 파라미터로 상태 관리
 * - 선택된 옵션 시각적 구분
 *
 * @dependencies
 * - Next.js 15 App Router (useRouter, useSearchParams)
 * - components/ui/button.tsx: Button 컴포넌트
 * - components/tour-filters.tsx: 필터 UI 패턴 참고
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, Calendar, FileText, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BookmarkSortProps {
  /** 현재 선택된 정렬 옵션 */
  currentSort?: "latest" | "name" | "region";
}

/**
 * 정렬 옵션 타입
 */
type SortOption = "latest" | "name" | "region";

/**
 * 정렬 옵션 설정
 */
const SORT_OPTIONS: Array<{
  value: SortOption;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    value: "latest",
    label: "최신순",
    icon: Calendar,
  },
  {
    value: "name",
    label: "이름순",
    icon: FileText,
  },
  {
    value: "region",
    label: "지역별",
    icon: MapPin,
  },
];

/**
 * 북마크 정렬 UI 컴포넌트
 * @param {BookmarkSortProps} props - 컴포넌트 props
 * @returns {JSX.Element} 정렬 UI 요소
 */
export function BookmarkSort({ currentSort = "latest" }: BookmarkSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * 정렬 옵션 변경 핸들러
   * @param {SortOption} sort 정렬 옵션
   */
  const handleSortChange = (sort: SortOption) => {
    const params = new URLSearchParams(searchParams.toString());

    if (sort === "latest") {
      // 기본값인 경우 쿼리 파라미터 제거
      params.delete("sort");
    } else {
      params.set("sort", sort);
    }

    // URL 업데이트
    const newUrl = params.toString()
      ? `/bookmarks?${params.toString()}`
      : "/bookmarks";
    router.push(newUrl);
  };

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown
        className="h-4 w-4 text-muted-foreground"
        aria-hidden="true"
      />
      <span className="text-sm text-muted-foreground sr-only sm:not-sr-only">
        정렬:
      </span>
      <div className="flex gap-2 flex-wrap" role="group" aria-label="정렬 옵션">
        {SORT_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = currentSort === option.value;

          return (
            <Button
              key={option.value}
              type="button"
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => handleSortChange(option.value)}
              className={cn(
                "gap-2 min-h-[44px] sm:min-h-0",
                isActive && "bg-primary text-primary-foreground",
              )}
              aria-label={`${option.label}로 정렬`}
              aria-pressed={isActive}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">{option.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
