/**
 * @file app/bookmarks/page.tsx
 * @description 북마크 목록 페이지
 *
 * 이 페이지는 사용자가 북마크한 관광지 목록을 표시합니다.
 * 인증된 사용자만 접근 가능하며, 로그인하지 않은 경우 로그인 페이지로 리다이렉트됩니다.
 *
 * 주요 기능:
 * 1. 인증 확인 및 리다이렉트
 * 2. 북마크 목록 조회 (Supabase)
 * 3. 북마크한 관광지 상세 정보 조회 (한국관광공사 API)
 * 4. 카드 레이아웃으로 관광지 표시
 * 5. 정렬 기능 (최신순, 이름순, 지역별)
 * 6. 일괄 삭제 및 개별 삭제 기능
 * 7. 빈 상태 처리 (북마크 없을 때)
 * 8. 로딩 상태 처리
 * 9. 에러 처리
 * 10. 반응형 디자인 (모바일/태블릿/데스크톱)
 *
 * @dependencies
 * - Next.js 15 App Router (Server Component)
 * - @clerk/nextjs/server: Clerk 인증 (currentUser)
 * - lib/supabase/server.ts: Supabase 클라이언트
 * - lib/api/supabase-api.ts: 북마크 관련 Supabase 함수
 * - lib/api/bookmark-api.ts: 북마크 관광지 정보 조회 함수
 * - components/bookmarks/bookmark-list.tsx: 북마크 목록 컴포넌트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { Suspense } from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { safeCurrentUser } from "@/lib/safeCurrentUser";
import { createClient } from "@/lib/supabase/server";
import { getUserFromClerkId, getUserBookmarks } from "@/lib/api/supabase-api";
import { getBookmarkedTours } from "@/lib/api/bookmark-api";
import {
  BookmarkList,
  BookmarkListSkeleton,
} from "@/components/bookmarks/bookmark-list";
import { BookmarkSort } from "@/components/bookmarks/bookmark-sort";
import { ErrorDisplay } from "@/components/ui/error";
import { ensureUserSynced } from "@/lib/api/user-sync";

export const metadata: Metadata = {
  title: "내 북마크 | My Trip",
  description: "북마크한 관광지 목록을 확인하세요.",
};

/**
 * 북마크 목록 페이지 메인 컴포넌트
 * @param {Object} props - 페이지 props
 * @param {Promise<{ sort?: string }>} props.searchParams - URL 쿼리 파라미터
 * @returns {Promise<JSX.Element>} 북마크 목록 페이지 요소
 */
export default async function BookmarksPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  // 인증 확인 (안전한 wrapper 사용)
  const user = await safeCurrentUser();

  // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
  if (!user) {
    redirect("/sign-in?redirect=/bookmarks");
  }

  // 사용자가 Supabase에 동기화되어 있는지 확인하고, 없으면 동기화
  // 동기화 실패해도 페이지는 계속 작동하도록 try-catch로 감싸기
  try {
    await ensureUserSynced(user.id, user);
  } catch (error) {
    // 동기화 실패는 로그만 남기고 계속 진행
    // BookmarkListContent에서 다시 시도할 수 있음
    console.error("사용자 동기화 실패 (북마크 페이지):", error);
  }

  // 정렬 옵션 파싱
  const params = await searchParams;
  const sortBy =
    params.sort === "name" || params.sort === "region" ? params.sort : "latest";

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* 페이지 제목 및 정렬 UI */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">내 북마크</h1>
          <BookmarkSort currentSort={sortBy} />
        </div>

        {/* 북마크 목록 섹션 */}
        <Suspense fallback={<BookmarkListSkeleton />}>
          <BookmarkListContent userId={user.id} sortBy={sortBy} />
        </Suspense>
      </div>
    </main>
  );
}

/**
 * 북마크 목록 콘텐츠 컴포넌트 (Server Component)
 * Suspense로 감싸서 로딩 상태를 처리합니다.
 *
 * @param {string} userId Clerk User ID
 * @param {"latest" | "name" | "region"} sortBy 정렬 옵션
 * @returns {Promise<JSX.Element>} 북마크 목록 요소
 */
async function BookmarkListContent({
  userId,
  sortBy,
}: {
  userId: string;
  sortBy: "latest" | "name" | "region";
}) {
  try {
    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // Clerk ID로 Supabase user_id 조회
    // 동기화가 완료되지 않았을 수 있으므로 재시도
    let supabaseUserId = await getUserFromClerkId(supabase, userId);

    // 사용자가 없으면 서비스 역할 클라이언트로 재시도
    if (!supabaseUserId) {
      const { getServiceRoleClient } = await import(
        "@/lib/supabase/service-role"
      );
      const serviceSupabase = getServiceRoleClient();
      supabaseUserId = await getUserFromClerkId(serviceSupabase, userId);
    }

    if (!supabaseUserId) {
      return (
        <ErrorDisplay
          error={
            new Error(
              "사용자 정보를 찾을 수 없습니다. 페이지를 새로고침하거나 다시 로그인해주세요.",
            )
          }
          title="사용자 정보 오류"
        />
      );
    }

    // 북마크 목록 조회 (created_at 내림차순으로 정렬됨)
    const bookmarks = await getUserBookmarks(supabase, supabaseUserId);

    // 북마크가 없는 경우
    if (bookmarks.length === 0) {
      return <BookmarkList tours={[]} />;
    }

    // 북마크한 관광지들의 상세 정보 조회 (북마크 정보 포함)
    const tours = await getBookmarkedTours(bookmarks);

    // 북마크 목록 표시
    return <BookmarkList tours={tours} sortBy={sortBy} />;
  } catch (error) {
    console.error("북마크 목록 조회 실패:", error);

    return (
      <ErrorDisplay
        error={error instanceof Error ? error : new Error("알 수 없는 에러")}
        title="북마크 목록을 불러올 수 없습니다"
      />
    );
  }
}
