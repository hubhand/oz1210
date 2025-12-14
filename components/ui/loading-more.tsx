/**
 * @file components/ui/loading-more.tsx
 * @description 하단 로딩 인디케이터 컴포넌트
 *
 * 이 컴포넌트는 무한 스크롤에서 추가 데이터를 로드할 때 표시되는 로딩 인디케이터입니다.
 * Intersection Observer의 sentinel 요소로도 사용됩니다.
 *
 * 주요 기능:
 * - 로딩 스피너 표시
 * - "더 불러오는 중..." 텍스트
 * - 더 이상 데이터 없음 메시지
 * - Sentinel 요소 역할
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface LoadingMoreProps {
  /** 로딩 중 여부 */
  isLoading?: boolean;
  /** 더 불러올 데이터가 있는지 여부 */
  hasMore?: boolean;
  /** Sentinel 요소 ref (Intersection Observer용) */
  sentinelRef?: (node: HTMLElement | null) => void;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 하단 로딩 인디케이터 컴포넌트
 * @param {LoadingMoreProps} props - 컴포넌트 props
 * @returns {JSX.Element} 로딩 인디케이터 요소
 */
export function LoadingMore({
  isLoading = false,
  hasMore = true,
  sentinelRef,
  className,
}: LoadingMoreProps) {
  // 더 이상 데이터가 없으면 완료 메시지 표시
  if (!hasMore && !isLoading) {
    return (
      <div
        className={cn(
          "flex items-center justify-center py-8 text-sm text-muted-foreground",
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <p>모든 관광지를 불러왔습니다</p>
      </div>
    );
  }

  // 로딩 중이면 스피너 표시
  return (
    <div
      ref={sentinelRef}
      className={cn(
        "flex flex-col items-center justify-center py-8 gap-2",
        className,
      )}
      role="status"
      aria-live="polite"
      aria-label="더 불러오는 중"
    >
      <Loader2
        className="h-5 w-5 animate-spin text-muted-foreground"
        aria-hidden="true"
      />
      <p className="text-sm text-muted-foreground">
        <span className="sr-only">로딩 중: </span>더 불러오는 중...
      </p>
    </div>
  );
}
