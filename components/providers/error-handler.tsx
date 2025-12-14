"use client";

import { useEffect } from "react";

/**
 * 개발 환경에서 Service Worker 에러 무시
 * Chrome 확장 프로그램이 Service Worker의 Cache API를 사용하려고 할 때 발생하는 에러를 무시합니다.
 */
export function ErrorHandler() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    // Service Worker 에러 무시 (Chrome 확장 프로그램 때문)
    const handleError = (e: ErrorEvent) => {
      if (
        e.message &&
        e.message.includes("chrome-extension") &&
        e.message.includes("Cache")
      ) {
        e.preventDefault();
        console.warn(
          "[개발 환경] Service Worker 에러 무시됨 (Chrome 확장 프로그램 때문):",
          e.message,
        );
        return false;
      }
    };

    // Promise rejection 에러 무시
    const handleUnhandledRejection = (e: PromiseRejectionEvent) => {
      if (
        e.reason &&
        e.reason.message &&
        e.reason.message.includes("chrome-extension") &&
        e.reason.message.includes("Cache")
      ) {
        e.preventDefault();
        console.warn(
          "[개발 환경] Service Worker Promise 에러 무시됨 (Chrome 확장 프로그램 때문):",
          e.reason.message,
        );
        return false;
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}

