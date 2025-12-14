/**
 * @file components/ui/error.tsx
 * @description 에러 메시지 표시 컴포넌트
 *
 * 이 컴포넌트는 에러 상태를 사용자에게 표시하고 재시도 기능을 제공합니다.
 * 다양한 에러 타입에 맞는 메시지를 표시할 수 있습니다.
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={error}
 *   onRetry={() => refetch()}
 *   title="데이터를 불러올 수 없습니다"
 * />
 * ```
 */
"use client";

import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ErrorDisplayProps {
  /** 에러 객체 또는 에러 메시지 */
  error: Error | string | null | undefined;
  /** 재시도 콜백 함수 */
  onRetry?: () => void;
  /** 커스텀 에러 제목 */
  title?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 재시도 버튼 텍스트 */
  retryLabel?: string;
  /** 에러 타입에 따른 메시지 매핑 */
  errorMessages?: Record<string, string>;
}

/**
 * 에러 타입을 기반으로 사용자 친화적인 메시지를 반환합니다.
 * @param error - 에러 객체 또는 메시지
 * @param errorMessages - 커스텀 에러 메시지 매핑
 * @returns 사용자 친화적인 에러 메시지
 */
function getErrorMessage(
  error: Error | string | null | undefined,
  errorMessages?: Record<string, string>,
): string {
  if (!error) return "알 수 없는 오류가 발생했습니다.";

  const errorMessage = typeof error === "string" ? error : error.message;
  const errorName = typeof error === "string" ? "Unknown" : error.name;

  // 커스텀 메시지 매핑 확인
  if (errorMessages && errorMessages[errorName]) {
    return errorMessages[errorName];
  }

  // 기본 에러 타입별 메시지
  switch (errorName) {
    case "TourApiError":
      return errorMessage || "관광지 정보를 불러오는 중 오류가 발생했습니다.";
    case "NetworkError":
    case "TypeError":
      return "네트워크 연결을 확인해주세요.";
    case "TimeoutError":
      return "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.";
    default:
      return errorMessage || "알 수 없는 오류가 발생했습니다.";
  }
}

/**
 * 에러 메시지 표시 컴포넌트
 * @param {ErrorDisplayProps} props - 컴포넌트 props
 * @returns {JSX.Element} 에러 표시 요소
 */
export function ErrorDisplay({
  error,
  onRetry,
  title = "오류가 발생했습니다",
  className,
  retryLabel = "다시 시도",
  errorMessages,
}: ErrorDisplayProps) {
  if (!error) return null;

  const message = getErrorMessage(error, errorMessages);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 p-8 rounded-lg border border-destructive/50 bg-destructive/10",
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-8 w-8 text-destructive" aria-hidden="true" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}

/**
 * 인라인 에러 메시지 컴포넌트 (작은 크기)
 * @param {ErrorDisplayProps} props - 컴포넌트 props
 * @returns {JSX.Element} 인라인 에러 표시 요소
 */
export function InlineError({
  error,
  onRetry,
  className,
  retryLabel = "재시도",
  errorMessages,
}: Omit<ErrorDisplayProps, "title">) {
  if (!error) return null;

  const message = getErrorMessage(error, errorMessages);

  return (
    <div
      className={cn(
        "flex items-center gap-2 p-3 rounded-md border border-destructive/50 bg-destructive/10 text-sm",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
      <span className="flex-1 text-destructive">{message}</span>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="ghost"
          size="sm"
          className="h-auto p-1 text-destructive hover:text-destructive"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="sr-only">{retryLabel}</span>
        </Button>
      )}
    </div>
  );
}
