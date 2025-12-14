/**
 * @file components/tour-detail/share-button.tsx
 * @description URL 공유 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지 상세페이지 URL을 클립보드에 복사하는 기능을 제공합니다.
 * 클립보드 API를 사용하여 URL을 복사하고, 복사 완료 토스트를 표시합니다.
 *
 * 주요 기능:
 * - 클립보드 API를 사용한 URL 복사
 * - 복사 완료 토스트 메시지
 * - HTTPS 환경 확인
 * - 현재 페이지 URL 자동 감지
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 공유 기능)
 */

"use client";

import { useState, useEffect } from "react";
import { Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export interface ShareButtonProps {
  /** 복사할 URL (기본값: 현재 페이지 URL) */
  url?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 버튼 크기 */
  size?: "sm" | "default" | "lg" | "icon";
  /** 버튼 variant */
  variant?: "default" | "outline" | "ghost" | "secondary";
}

/**
 * URL 공유 버튼 컴포넌트
 * @param {ShareButtonProps} props - 컴포넌트 props
 * @returns {JSX.Element} URL 공유 버튼 요소
 */
export function ShareButton({
  url,
  className,
  size = "sm",
  variant = "ghost",
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");

  // 클라이언트 사이드에서 현재 URL 가져오기
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handleCopy = async () => {
    // URL 결정 (props로 전달된 URL 또는 현재 페이지 URL)
    const urlToCopy = url || currentUrl;

    if (!urlToCopy) {
      toast.error("URL을 가져올 수 없습니다.");
      return;
    }

    // HTTPS 환경 확인
    if (typeof window === "undefined" || !navigator.clipboard) {
      toast.error("URL 복사 기능은 HTTPS 환경에서만 사용할 수 있습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      toast.success("URL이 복사되었습니다.");

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("URL 복사 실패:", error);
      toast.error("URL 복사에 실패했습니다.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("gap-2", className)}
      aria-label="URL 공유"
      title="URL 공유"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">복사 완료</span>
          <span className="hidden sm:inline">복사 완료</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">URL 공유</span>
          <span className="hidden sm:inline">공유</span>
        </>
      )}
    </Button>
  );
}

