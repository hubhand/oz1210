/**
 * @file components/ui/loading.tsx
 * @description 로딩 스피너 컴포넌트
 *
 * 이 컴포넌트는 데이터 로딩 중임을 표시하는 스피너를 제공합니다.
 * 다양한 크기 변형을 지원하며, Tailwind CSS 애니메이션을 사용합니다.
 *
 * @example
 * ```tsx
 * <Loading size="md" />
 * <Loading size="sm" className="text-blue-500" />
 * ```
 */
import { cn } from "@/lib/utils";

interface LoadingProps {
  /** 스피너 크기 */
  size?: "sm" | "md" | "lg";
  /** 추가 CSS 클래스 */
  className?: string;
  /** 접근성을 위한 라벨 */
  "aria-label"?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
};

/**
 * 로딩 스피너 컴포넌트
 * @param {LoadingProps} props - 컴포넌트 props
 * @returns {JSX.Element} 로딩 스피너 요소
 */
export function Loading({
  size = "md",
  className,
  "aria-label": ariaLabel = "로딩 중...",
}: LoadingProps) {
  return (
    <div
      className={cn(
        "inline-block animate-spin rounded-full border-solid border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label={ariaLabel}
      aria-live="polite"
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
}

/**
 * 전체 화면 로딩 오버레이 컴포넌트
 * @param {LoadingProps} props - 컴포넌트 props
 * @returns {JSX.Element} 전체 화면 로딩 오버레이
 */
export function LoadingOverlay({
  size = "lg",
  className,
  "aria-label": ariaLabel = "로딩 중...",
}: LoadingProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loading size={size} className={className} aria-label={ariaLabel} />
        <p className="text-sm text-muted-foreground">{ariaLabel}</p>
      </div>
    </div>
  );
}

