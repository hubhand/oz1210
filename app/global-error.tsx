/**
 * @file app/global-error.tsx
 * @description 루트 레벨 전역 에러 바운더리 컴포넌트
 *
 * 이 컴포넌트는 Next.js App Router의 루트 레벨 에러 바운더리로 사용됩니다.
 * 레이아웃 레벨에서 발생하는 에러를 처리하며, app/error.tsx에서 처리하지 못한
 * 에러를 최종적으로 처리합니다.
 *
 * 주요 기능:
 * - 레이아웃 레벨 에러 처리
 * - ChunkLoadError 감지 및 자동 재시도
 * - 모듈 해상도 에러 감지 및 자동 재시도
 * - 사용자 친화적 에러 메시지 표시
 * - 수동 재시도 버튼 제공
 * - 상세한 에러 로깅 (개발 환경)
 *
 * 주의사항:
 * - 이 컴포넌트는 html, body 태그를 포함해야 합니다.
 * - app/error.tsx와 스타일 일관성을 유지합니다.
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/error#global-errorjs} - Next.js Global Error Boundary
 */

"use client";

import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: (Error & { digest?: string }) | string;
  reset: () => void;
}) {
  // --- 1) error 객체 표준화 (string → object) ---
  const err: Error & { digest?: string } = useMemo(
    () =>
      typeof error === "string"
        ? { name: "Error", message: error, stack: "", digest: undefined }
        : {
            name: error?.name ?? "Error",
            message: error?.message ?? "Unknown error",
            stack: error?.stack ?? "",
            digest: (error as any)?.digest,
          },
    [error],
  );

  // --- 2) 안전 includes 함수 (문자열이 아닐 때 대비) ---
  const safeIncludes = (target: unknown, keyword: string) => {
    return typeof target === "string" && target.includes(keyword);
  };

  // --- 3) 오류 유형 판별 ---
  const isModuleResolutionError = useMemo(
    () =>
      safeIncludes(err.message, "Cannot read properties of undefined") ||
      safeIncludes(err.message, "reading 'call'") ||
      safeIncludes(err.message, "undefined is not a function"),
    [err.message],
  );

  const isChunkError = useMemo(
    () =>
      safeIncludes(err.message, "chunk") ||
      safeIncludes(err.message, "Loading") ||
      safeIncludes(err.message, "timeout"),
    [err.message],
  );

  // --- 4) 에러 자동 처리 ---
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.group("🚨 Global Error Boundary - 에러 상세 정보");
      console.error("에러 메시지:", err.message);
      console.error("에러 이름:", err.name);
      console.error("에러 스택:", err.stack);
      console.error("에러 digest:", err.digest);
      console.groupEnd();
    }

    if (isModuleResolutionError) {
      console.error("Module resolution error detected:", err);
      const timer = setTimeout(() => window.location.reload(), 5000);
      return () => clearTimeout(timer);
    }

    if (isChunkError) {
      console.error("ChunkLoadError detected:", err);
      const timer = setTimeout(() => window.location.reload(), 3000);
      return () => clearTimeout(timer);
    }
  }, [err, isModuleResolutionError, isChunkError]);

  // --- 5) UI ---
  return (
    <html lang="ko">
      <body className="min-h-screen p-4 flex flex-col items-center justify-center bg-background">
        <div
          className="flex flex-col items-center justify-center w-full max-w-md"
          role="alert"
          aria-live="assertive"
          aria-label="시스템 오류 발생"
        >
          <h2 className="text-2xl font-bold mb-4">
            시스템 오류가 발생했습니다
          </h2>

          <p className="text-muted-foreground mb-4 text-center">
            {isModuleResolutionError
              ? "모듈 로딩 중 문제가 발생했습니다. 페이지를 새로고침하거나 개발 서버를 재시작해주세요."
              : isChunkError
              ? "페이지를 로드하는 중 문제가 발생했습니다. 자동으로 새로고침됩니다."
              : err.message || "예상치 못한 오류가 발생했습니다."}
          </p>

          {(isModuleResolutionError || isChunkError) && (
            <div
              className="text-sm text-muted-foreground mb-4 space-y-2 w-full"
              aria-live="polite"
            >
              {isModuleResolutionError && (
                <>
                  <p className="font-semibold">해결 방법:</p>
                  <ol className="list-decimal list-inside space-y-1 text-left">
                    <li>
                      브라우저를 새로고침하세요 (Ctrl+Shift+R 또는 Cmd+Shift+R)
                    </li>
                    <li>
                      개발 서버를 재시작하세요:{" "}
                      <code className="bg-muted px-1 py-0.5 rounded">
                        pnpm dev:clean
                      </code>
                    </li>
                    <li>
                      브라우저 캐시를 삭제하거나 시크릿 모드에서 테스트하세요
                    </li>
                  </ol>
                </>
              )}
              {isChunkError && (
                <p className="text-center" aria-live="polite">
                  3초 후 자동으로 새로고침됩니다...
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2" role="group" aria-label="에러 복구 옵션">
            <Button
              onClick={reset}
              variant="default"
              aria-label="에러 복구 재시도"
            >
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

          {process.env.NODE_ENV === "development" && err.stack && (
            <pre className="mt-8 bg-card p-5 rounded-lg border text-xs max-w-2xl w-full overflow-auto whitespace-pre-wrap">
              {err.stack}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
