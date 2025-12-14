import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Server Component용)
 *
 * Supabase 공식 Next.js 가이드 패턴을 따르면서 Clerk 통합을 유지합니다.
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk 토큰을 Supabase가 자동 검증
 * - auth().getToken()으로 현재 세션 토큰 사용
 *
 * @example
 * ```tsx
 * // Server Component (Supabase 공식 패턴)
 * import { createClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = await createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 *
 * @example
 * ```tsx
 * // 기존 방식도 지원 (하위 호환성)
 * import { createClerkSupabaseClient } from '@/lib/supabase/server';
 *
 * export default async function MyPage() {
 *   const supabase = createClerkSupabaseClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 */
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      try {
        const authInstance = await auth();
        if (!authInstance) {
          return null;
        }
        const token = await authInstance.getToken();
        return token || null;
      } catch (error) {
        // Realtime 연결 실패 시에도 앱이 계속 작동하도록 null 반환
        console.error("Failed to get access token for Supabase Realtime:", error);
        return null;
      }
    },
  });
}

/**
 * @deprecated Supabase 공식 패턴을 사용하세요: `await createClient()`
 * 하위 호환성을 위해 유지됩니다.
 */
export async function createClerkSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    async accessToken() {
      try {
        const authInstance = await auth();
        if (!authInstance) {
          return null;
        }
        const token = await authInstance.getToken();
        return token || null;
      } catch (error) {
        // Realtime 연결 실패 시에도 앱이 계속 작동하도록 null 반환
        console.error("Failed to get access token for Supabase Realtime:", error);
        return null;
      }
    },
  });
}
