/**
 * @file app/error.tsx
 * @description 전역 에러 바운더리 컴포넌트
 *
 * 이 컴포넌트는 Next.js App Router의 에러 바운더리로 사용됩니다.
 * ChunkLoadError와 모듈 해상도 에러를 감지하고 자동으로 재시도하는 기능을 제공합니다.
 *
 * 주요 기능:
 * - ChunkLoadError 감지 및 자동 재시도
 * - 모듈 해상도 에러 감지 및 자동 재시도
 * - 사용자 친화적 에러 메시지 표시
 * - 수동 재시도 버튼 제공
 * - 상세한 에러 로깅 (개발 환경)
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error} - Next.js Error Boundary
 */

"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 개발 환경에서 상세한 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Error Boundary - 에러 상세 정보");
      console.error("에러 메시지:", error.message);
      console.error("에러 이름:", error.name);
      console.error("에러 스택:", error.stack);
      console.error("에러 digest:", error.digest);
      console.groupEnd();
    }

    // 모듈 해상도 에러 감지
    const isModuleResolutionError =
      error.message.includes("Cannot read properties of undefined") ||
      error.message.includes("reading 'call'") ||
      error.message.includes("undefined is not a function");

    // ChunkLoadError 감지
    const isChunkError =
      error.message.includes("chunk") ||
      error.message.includes("Loading") ||
      error.message.includes("timeout");

    if (isModuleResolutionError) {
      console.error("Module resolution error detected:", error);
      // 자동 재시도 (5초 후)
      const timer = setTimeout(() => {
        window.location.reload();
      }, 5000);
      return () => clearTimeout(timer);
    }

    if (isChunkError) {
      console.error("ChunkLoadError detected:", error);
      // 자동 재시도 (3초 후)
      const timer = setTimeout(() => {
        window.location.reload();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const isModuleResolutionError =
    error.message.includes("Cannot read properties of undefined") ||
    error.message.includes("reading 'call'") ||
    error.message.includes("undefined is not a function");

  const isChunkError =
    error.message.includes("chunk") ||
    error.message.includes("Loading") ||
    error.message.includes("timeout");

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen p-4"
      role="alert"
      aria-live="assertive"
      aria-label="에러 발생"
    >
      <h2 className="text-2xl font-bold mb-4">문제가 발생했습니다</h2>
      <p className="text-muted-foreground mb-4 text-center max-w-md">
        {isModuleResolutionError
          ? "모듈 로딩 중 문제가 발생했습니다. 페이지를 새로고침하거나 개발 서버를 재시작해주세요."
          : isChunkError
            ? "페이지를 로드하는 중 문제가 발생했습니다. 자동으로 새로고침됩니다."
            : error.message || "예상치 못한 오류가 발생했습니다."}
      </p>
      {(isModuleResolutionError || isChunkError) && (
        <div
          className="text-sm text-muted-foreground mb-4 space-y-2 max-w-md"
          aria-live="polite"
        >
          {isModuleResolutionError && (
            <>
              <p className="font-semibold">해결 방법:</p>
              <ol className="list-decimal list-inside space-y-1 text-left">
                <li>브라우저를 새로고침하세요 (Ctrl+Shift+R 또는 Cmd+Shift+R)</li>
                <li>
                  개발 서버를 재시작하세요:{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    pnpm dev:clean
                  </code>
                </li>
                <li>브라우저 캐시를 삭제하거나 시크릿 모드에서 테스트하세요</li>
              </ol>
            </>
          )}
          {isChunkError && (
            <p aria-live="polite">3초 후 자동으로 새로고침됩니다...</p>
          )}
        </div>
      )}
      <div className="flex gap-2" role="group" aria-label="에러 복구 옵션">
        <Button onClick={reset} variant="default" aria-label="에러 복구 재시도">
          다시 시도
        </Button>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          aria-label="페이지 새로고침"
        >
          새로고침
        </Button>
      </div>
    </div>
  );
}
