"use server";

/**
 * @file actions/delete-bookmarks.ts
 * @description 북마크 일괄 삭제 Server Action
 *
 * 이 파일은 여러 북마크를 한 번에 삭제하는 Server Action을 제공합니다.
 * Clerk 인증을 확인하고, 본인 북마크만 삭제할 수 있도록 보안을 강화합니다.
 *
 * 주요 기능:
 * - Clerk 인증 확인
 * - Supabase 클라이언트 생성
 * - Clerk ID로 Supabase user_id 조회
 * - 여러 북마크 일괄 삭제
 * - 에러 처리 및 결과 반환
 *
 * @dependencies
 * - @clerk/nextjs/server: Clerk 인증 (auth)
 * - lib/supabase/server.ts: Supabase 클라이언트
 * - lib/api/supabase-api.ts: removeBookmarks() 함수
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@/lib/supabase/server";
import { getUserFromClerkId, removeBookmarks } from "@/lib/api/supabase-api";

/**
 * 북마크 일괄 삭제 결과 타입
 */
export interface DeleteBookmarksResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

/**
 * 여러 북마크를 한 번에 삭제하는 Server Action
 *
 * @param bookmarkIds 삭제할 북마크 ID 배열
 * @returns 삭제 결과 (성공 여부, 삭제된 항목 수, 에러 메시지)
 *
 * @example
 * ```tsx
 * const result = await deleteBookmarks(["bookmark-id-1", "bookmark-id-2"]);
 * if (result.success) {
 *   console.log(`${result.deletedCount}개의 북마크가 삭제되었습니다.`);
 * }
 * ```
 */
export async function deleteBookmarks(
  bookmarkIds: string[],
): Promise<DeleteBookmarksResult> {
  try {
    // Clerk 인증 확인
    const { userId } = await auth();

    if (!userId) {
      return {
        success: false,
        deletedCount: 0,
        error: "로그인이 필요합니다.",
      };
    }

    // 빈 배열인 경우 즉시 반환
    if (bookmarkIds.length === 0) {
      return {
        success: true,
        deletedCount: 0,
      };
    }

    // Supabase 클라이언트 생성
    const supabase = await createClient();

    // Clerk ID로 Supabase user_id 조회
    const supabaseUserId = await getUserFromClerkId(supabase, userId);

    if (!supabaseUserId) {
      return {
        success: false,
        deletedCount: 0,
        error: "사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.",
      };
    }

    // 여러 북마크 일괄 삭제
    const result = await removeBookmarks(supabase, supabaseUserId, bookmarkIds);

    if (!result.success) {
      return {
        success: false,
        deletedCount: 0,
        error: "북마크 삭제에 실패했습니다. 다시 시도해주세요.",
      };
    }

    return {
      success: true,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    console.error("deleteBookmarks exception:", error);

    return {
      success: false,
      deletedCount: 0,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다.",
    };
  }
}
