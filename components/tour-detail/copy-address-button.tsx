/**
 * @file components/tour-detail/copy-address-button.tsx
 * @description 주소 복사 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지 주소를 클립보드에 복사하는 기능을 제공합니다.
 * 클립보드 API를 사용하여 주소를 복사하고, 복사 완료 토스트를 표시합니다.
 *
 * 주요 기능:
 * - 클립보드 API를 사용한 주소 복사
 * - 복사 완료 토스트 메시지
 * - HTTPS 환경 확인
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

export interface CopyAddressButtonProps {
  /** 복사할 주소 텍스트 */
  address: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 버튼 크기 */
  size?: "sm" | "default" | "lg" | "icon";
  /** 버튼 variant */
  variant?: "default" | "outline" | "ghost" | "secondary";
}

/**
 * 주소 복사 버튼 컴포넌트
 * @param {CopyAddressButtonProps} props - 컴포넌트 props
 * @returns {JSX.Element} 주소 복사 버튼 요소
 */
export function CopyAddressButton({
  address,
  className,
  size = "sm",
  variant = "ghost",
}: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // HTTPS 환경 확인
    if (typeof window === "undefined" || !navigator.clipboard) {
      toast.error("주소 복사 기능은 HTTPS 환경에서만 사용할 수 있습니다.");
      return;
    }

    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("주소가 복사되었습니다.");

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("주소 복사 실패:", error);
      toast.error("주소 복사에 실패했습니다.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn("gap-2", className)}
      aria-label="주소 복사"
      title="주소 복사"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">복사 완료</span>
          <span className="hidden sm:inline">복사 완료</span>
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">주소 복사</span>
          <span className="hidden sm:inline">주소 복사</span>
        </>
      )}
    </Button>
  );
}
