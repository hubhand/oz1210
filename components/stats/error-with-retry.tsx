/**
 * @file components/stats/error-with-retry.tsx
 * @description 통계 컴포넌트용 에러 표시 및 재시도 래퍼 컴포넌트
 *
 * 이 컴포넌트는 Server Component에서 사용할 수 있는 에러 표시 래퍼입니다.
 * 내부적으로 Client Component로 구현되어 재시도 기능을 제공합니다.
 *
 * 주요 기능:
 * - Server Component에서 사용 가능한 에러 표시
 * - 재시도 버튼 제공 (페이지 새로고침)
 * - 기존 ErrorDisplay 컴포넌트 래핑
 *
 * @dependencies
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6 통계 대시보드)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

"use client";

import { ErrorDisplay } from "@/components/ui/error";

export interface ErrorDisplayWithRetryProps {
  /** 에러 객체 */
  error: Error | null;
  /** 커스텀 에러 제목 */
  title?: string;
  /** 재시도 버튼 텍스트 */
  retryLabel?: string;
}

/**
 * 통계 컴포넌트용 에러 표시 및 재시도 래퍼 컴포넌트
 * Server Component에서 사용할 수 있도록 Client Component로 구현
 *
 * @param {ErrorDisplayWithRetryProps} props - 컴포넌트 props
 * @returns {JSX.Element | null} 에러 표시 요소 또는 null
 */
export function ErrorDisplayWithRetry({
  error,
  title,
  retryLabel = "다시 시도",
}: ErrorDisplayWithRetryProps) {
  /**
   * 재시도 핸들러
   * 페이지를 새로고침하여 Server Component를 재실행
   */
  const handleRetry = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <ErrorDisplay
      error={error}
      onRetry={handleRetry}
      title={title}
      retryLabel={retryLabel}
    />
  );
}

