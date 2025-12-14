/**
 * @file components/tour-detail/back-button.tsx
 * @description 뒤로가기 버튼 컴포넌트
 *
 * 이 컴포넌트는 상세페이지에서 이전 페이지로 돌아가는 버튼을 제공합니다.
 * 브라우저의 뒤로가기 기능을 사용하거나 홈으로 이동할 수 있습니다.
 *
 * 주요 기능:
 * - 브라우저 뒤로가기 기능
 * - 홈으로 이동 옵션
 * - ArrowLeft 아이콘 표시
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface BackButtonProps {
  /** 홈으로 이동할지 여부 (기본값: false, 뒤로가기) */
  toHome?: boolean;
  /** 추가 CSS 클래스 */
  className?: string;
}

/**
 * 뒤로가기 버튼 컴포넌트
 * @param {BackButtonProps} props - 컴포넌트 props
 * @returns {JSX.Element} 뒤로가기 버튼 요소
 */
export function BackButton({ toHome = false, className }: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (toHome) {
      router.push("/");
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={className}
      aria-label={toHome ? "홈으로 이동" : "이전 페이지로 이동"}
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{toHome ? "홈으로" : "뒤로가기"}</span>
      <span className="hidden sm:inline">{toHome ? "홈으로" : "뒤로가기"}</span>
    </Button>
  );
}
