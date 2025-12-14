/**
 * @file lib/api/supabase-api.ts
 * @description Supabase 데이터베이스 쿼리 함수들
 *
 * 이 파일은 Supabase 데이터베이스와의 상호작용을 위한 함수들을 제공합니다.
 * 북마크 기능과 관련된 쿼리 함수들을 포함합니다.
 *
 * 주요 기능:
 * - 사용자 조회 (Clerk ID 기반)
 * - 북마크 조회, 추가, 제거
 * - 사용자 북마크 목록 조회
 *
 * @dependencies
 * - @supabase/supabase-js: Supabase 클라이언트
 * - lib/supabase/clerk-client.ts: Clerk 통합 Supabase 클라이언트
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 * @see {@link /supabase/migrations/db.sql} - 데이터베이스 스키마
 */

import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase users 테이블 타입
 */
export interface SupabaseUser {
  id: string; // UUID
  clerk_id: string; // Clerk User ID
  name: string;
  created_at: string;
}

/**
 * Supabase bookmarks 테이블 타입
 */
export interface SupabaseBookmark {
  id: string; // UUID
  user_id: string; // UUID (users.id 참조)
  content_id: string; // 한국관광공사 API contentid
  created_at: string;
}

/**
 * Clerk ID로 Supabase users 테이블에서 user_id 조회
 * @param supabase Supabase 클라이언트
 * @param clerkId Clerk User ID
 * @returns Supabase user_id (UUID) 또는 null
 */
export async function getUserFromClerkId(
  supabase: SupabaseClient,
  clerkId: string,
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkId)
      .maybeSingle();

    if (error) {
      // maybeSingle()은 결과가 없을 때 null을 반환하므로 PGRST116 체크 불필요
      // 다른 에러만 처리

      // 다른 에러는 상세 정보와 함께 로깅
      console.error("getUserFromClerkId error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
        clerkId: clerkId.substring(0, 8) + "...", // 일부만 로깅 (보안)
      });
      return null;
    }

    return data?.id || null;
  } catch (error) {
    // 예외 발생 시 상세 정보 로깅
    console.error("getUserFromClerkId exception:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      clerkId: clerkId.substring(0, 8) + "...", // 일부만 로깅 (보안)
    });
    return null;
  }
}

/**
 * 특정 관광지의 북마크 조회
 * @param supabase Supabase 클라이언트
 * @param userId Supabase user_id (UUID)
 * @param contentId 관광지 콘텐츠 ID
 * @returns 북마크 정보 또는 null
 */
export async function getBookmark(
  supabase: SupabaseClient,
  userId: string,
  contentId: string,
): Promise<SupabaseBookmark | null> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .eq("content_id", contentId)
      .maybeSingle();

    if (error) {
      // maybeSingle()은 결과가 없을 때 null을 반환하므로 PGRST116 체크 불필요
      // 다른 에러만 처리
      console.error("getBookmark error:", error);
      return null;
    }

    return data as SupabaseBookmark | null;
  } catch (error) {
    console.error("getBookmark exception:", error);
    return null;
  }
}

/**
 * 북마크 추가
 * @param supabase Supabase 클라이언트
 * @param userId Supabase user_id (UUID)
 * @param contentId 관광지 콘텐츠 ID
 * @returns 성공 여부
 */
export async function addBookmark(
  supabase: SupabaseClient,
  userId: string,
  contentId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase.from("bookmarks").insert({
      user_id: userId,
      content_id: contentId,
    });

    if (error) {
      // 중복 북마크 시도 (UNIQUE 제약 위반)
      if (error.code === "23505") {
        console.warn("Bookmark already exists");
        return true; // 이미 존재하므로 성공으로 처리
      }
      console.error("addBookmark error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("addBookmark exception:", error);
    return false;
  }
}

/**
 * 북마크 제거
 * @param supabase Supabase 클라이언트
 * @param userId Supabase user_id (UUID)
 * @param contentId 관광지 콘텐츠 ID
 * @returns 성공 여부
 */
export async function removeBookmark(
  supabase: SupabaseClient,
  userId: string,
  contentId: string,
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("content_id", contentId);

    if (error) {
      console.error("removeBookmark error:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("removeBookmark exception:", error);
    return false;
  }
}

/**
 * 사용자의 모든 북마크 목록 조회
 * @param supabase Supabase 클라이언트
 * @param userId Supabase user_id (UUID)
 * @returns 북마크 목록 (created_at 내림차순)
 */
export async function getUserBookmarks(
  supabase: SupabaseClient,
  userId: string,
): Promise<SupabaseBookmark[]> {
  try {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getUserBookmarks error:", error);
      return [];
    }

    return (data as SupabaseBookmark[]) || [];
  } catch (error) {
    console.error("getUserBookmarks exception:", error);
    return [];
  }
}

/**
 * 여러 북마크를 한 번에 삭제 (일괄 삭제)
 * @param supabase Supabase 클라이언트
 * @param userId Supabase user_id (UUID)
 * @param bookmarkIds 삭제할 북마크 ID 배열
 * @returns 삭제 결과 (성공 여부 및 삭제된 항목 수)
 */
export async function removeBookmarks(
  supabase: SupabaseClient,
  userId: string,
  bookmarkIds: string[],
): Promise<{ success: boolean; deletedCount: number }> {
  // 빈 배열인 경우 즉시 반환
  if (bookmarkIds.length === 0) {
    return { success: true, deletedCount: 0 };
  }

  try {
    // IN 연산자를 사용하여 배치 삭제
    // user_id도 함께 확인하여 본인 북마크만 삭제 가능하도록 보안 강화
    const { data, error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .in("id", bookmarkIds)
      .select();

    if (error) {
      console.error("removeBookmarks error:", error);
      return { success: false, deletedCount: 0 };
    }

    // 삭제된 항목 수 반환
    const deletedCount = data?.length || 0;

    return { success: true, deletedCount };
  } catch (error) {
    console.error("removeBookmarks exception:", error);
    return { success: false, deletedCount: 0 };
  }
}
