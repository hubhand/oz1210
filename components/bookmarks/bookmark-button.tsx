/**
 * @file components/bookmarks/bookmark-button.tsx
 * @description 북마크 버튼 컴포넌트
 *
 * 이 컴포넌트는 관광지를 북마크(즐겨찾기)하는 기능을 제공합니다.
 * Clerk 인증 사용자만 북마크를 추가/제거할 수 있으며, Supabase에 저장됩니다.
 *
 * 주요 기능:
 * - Clerk 인증 상태 확인
 * - 북마크 상태 조회 및 표시
 * - 북마크 추가/제거 토글
 * - 로그인하지 않은 경우 로그인 유도
 *
 * @dependencies
 * - @clerk/nextjs: Clerk 인증 (useAuth, useUser, SignInButton)
 * - lib/supabase/clerk-client.ts: Supabase 클라이언트
 * - lib/api/supabase-api.ts: 북마크 관련 API 함수
 * - components/ui/toast.tsx: 토스트 메시지
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /supabase/migrations/db.sql} - 데이터베이스 스키마
 */

"use client";

import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import { useAuth, useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import {
  getUserFromClerkId,
  getBookmark,
  addBookmark,
  removeBookmark,
} from "@/lib/api/supabase-api";

export interface BookmarkButtonProps {
  /** 관광지 콘텐츠 ID (필수) */
  contentId: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 버튼 크기 */
  size?: "sm" | "default" | "lg" | "icon";
  /** 버튼 variant */
  variant?: "default" | "outline" | "ghost" | "secondary";
}

/**
 * 북마크 버튼 컴포넌트
 * @param {BookmarkButtonProps} props - 컴포넌트 props
 * @returns {JSX.Element} 북마크 버튼 요소
 */
export function BookmarkButton({
  contentId,
  className,
  size = "sm",
  variant = "ghost",
}: BookmarkButtonProps) {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // 북마크 상태 확인
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!isLoaded || !userId || !user) {
        setIsChecking(false);
        return;
      }

      try {
        // Clerk ID로 Supabase user_id 조회
        const supabaseUserId = await getUserFromClerkId(supabase, userId);

        if (!supabaseUserId) {
          setIsChecking(false);
          return;
        }

        // 북마크 상태 확인
        const bookmark = await getBookmark(supabase, supabaseUserId, contentId);
        setIsBookmarked(!!bookmark);
      } catch (error) {
        console.error("북마크 상태 확인 실패:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkBookmarkStatus();
  }, [isLoaded, userId, user, supabase, contentId]);

  const handleToggleBookmark = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault(); // 기본 동작 방지 (페이지 새로고침 방지)
    e.stopPropagation(); // 이벤트 전파 방지

    // 로그인하지 않은 경우
    if (!isLoaded || !userId || !user) {
      toast.error("북마크 기능을 사용하려면 로그인이 필요합니다.");
      return;
    }

    setIsLoading(true);

    try {
      // Clerk ID로 Supabase user_id 조회
      const supabaseUserId = await getUserFromClerkId(supabase, userId);

      if (!supabaseUserId) {
        toast.error("사용자 정보를 찾을 수 없습니다.");
        setIsLoading(false);
        return;
      }

      if (isBookmarked) {
        // 북마크 제거
        const success = await removeBookmark(
          supabase,
          supabaseUserId,
          contentId,
        );
        if (success) {
          setIsBookmarked(false);
          toast.success("북마크가 제거되었습니다.");
        } else {
          toast.error("북마크 제거에 실패했습니다.");
        }
      } else {
        // 북마크 추가
        const success = await addBookmark(supabase, supabaseUserId, contentId);
        if (success) {
          setIsBookmarked(true);
          toast.success("북마크에 추가되었습니다.");
        } else {
          toast.error("북마크 추가에 실패했습니다.");
        }
      }
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      toast.error("북마크 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인하지 않은 경우: 로그인 버튼 표시
  if (!isLoaded) {
    return (
      <Button
        variant={variant}
        size={size}
        type="button"
        disabled
        className={cn("gap-2", className)}
        aria-label="북마크 로딩 중"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="sr-only">로딩 중</span>
        <span className="hidden sm:inline">로딩 중</span>
      </Button>
    );
  }

  if (!userId) {
    return (
      <SignInButton mode="modal">
        <Button
          variant={variant}
          size={size}
          type="button"
          className={cn("gap-2", className)}
          aria-label="북마크 (로그인 필요)"
          title="북마크 (로그인 필요)"
        >
          <Star className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">북마크 (로그인 필요)</span>
          <span className="hidden sm:inline">북마크</span>
        </Button>
      </SignInButton>
    );
  }

  // 로딩 중 또는 상태 확인 중
  if (isChecking || isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        type="button"
        disabled
        className={cn("gap-2", className)}
        aria-label="북마크 로딩 중"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        <span className="sr-only">로딩 중</span>
        <span className="hidden sm:inline">로딩 중</span>
      </Button>
    );
  }

  // 북마크 버튼
  return (
    <Button
      variant={variant}
      size={size}
      type="button"
      onClick={handleToggleBookmark}
      className={cn("gap-2", className)}
      aria-label={isBookmarked ? "북마크 제거" : "북마크 추가"}
      title={isBookmarked ? "북마크 제거" : "북마크 추가"}
    >
      <Star
        className={cn(
          "h-4 w-4",
          isBookmarked && "fill-yellow-400 text-yellow-400",
        )}
        aria-hidden="true"
      />
      <span className="sr-only">
        {isBookmarked ? "북마크 제거" : "북마크 추가"}
      </span>
      <span className="hidden sm:inline">
        {isBookmarked ? "북마크됨" : "북마크"}
      </span>
    </Button>
  );
}
