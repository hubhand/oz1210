/**
 * @file lib/api/user-sync.ts
 * @description 사용자 동기화 보장 함수
 *
 * 이 파일은 Clerk 사용자가 Supabase에 동기화되어 있는지 확인하고,
 * 없으면 자동으로 동기화하는 함수를 제공합니다.
 *
 * @dependencies
 * - @clerk/nextjs/server: Clerk 사용자 정보
 * - lib/supabase/service-role.ts: Supabase 서비스 역할 클라이언트
 * - lib/api/supabase-api.ts: 사용자 조회 함수
 */

import type { User } from "@clerk/nextjs/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import { getUserFromClerkId } from "@/lib/api/supabase-api";

/**
 * Clerk 사용자가 Supabase에 동기화되어 있는지 확인하고,
 * 없으면 자동으로 동기화합니다.
 *
 * @param clerkId Clerk User ID
 * @param clerkUser Clerk User 객체 (선택적, 없으면 조회)
 * @returns Supabase user_id (UUID)
 * @throws 사용자 동기화 실패 시 에러
 */
export async function ensureUserSynced(
  clerkId: string,
  clerkUser?: User,
): Promise<string> {
  const supabase = getServiceRoleClient();

  // 먼저 사용자가 이미 존재하는지 확인
  const existingUserId = await getUserFromClerkId(supabase, clerkId);

  if (existingUserId) {
    return existingUserId;
  }

  // 사용자가 없으면 동기화
  // clerkUser가 제공되지 않았으면 여기서는 동기화하지 않고
  // 클라이언트 사이드 동기화에 의존
  // 하지만 서버 사이드에서도 동기화할 수 있도록 처리
  if (!clerkUser) {
    // clerkUser가 없으면 클라이언트 사이드 동기화를 기다려야 함
    // 재시도 로직 추가
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
      const retryUserId = await getUserFromClerkId(supabase, clerkId);
      if (retryUserId) {
        return retryUserId;
      }
    }
    throw new Error("사용자 동기화가 완료되지 않았습니다. 잠시 후 다시 시도해주세요.");
  }

  // 사용자 정보 동기화
  const userName =
    clerkUser.fullName ||
    clerkUser.username ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    "Unknown";

  const { data, error } = await supabase
    .from("users")
    .upsert(
      {
        clerk_id: clerkId,
        name: userName,
      },
      {
        onConflict: "clerk_id",
      },
    )
    .select("id")
    .single();

  if (error) {
    console.error("User sync error:", error);
    throw new Error(`사용자 동기화 실패: ${error.message}`);
  }

  if (!data?.id) {
    throw new Error("사용자 동기화 후 ID를 가져올 수 없습니다.");
  }

  return data.id;
}

