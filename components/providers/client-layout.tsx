"use client";

import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import { ErrorHandler } from "@/components/providers/error-handler";

/**
 * ClientLayout - 클라이언트 사이드 레이아웃 래퍼
 *
 * 이 컴포넌트는 클라이언트 사이드에서만 실행되는 컴포넌트들을 래핑합니다.
 *
 * 주요 역할:
 * 1. SyncUserProvider를 포함하여 Clerk 사용자를 Supabase에 동기화
 * 2. Server Component인 RootLayout과 클라이언트 컴포넌트 사이의 경계 역할
 * 3. 개발 환경에서 Service Worker 에러 무시 (Chrome 확장 프로그램 때문)
 *
 * 이 컴포넌트는 RootLayout 내부에서 사용되지만,
 * "use client" 지시어로 인해 클라이언트 사이드에서만 실행됩니다.
 * 따라서 useAuth와 같은 Clerk 훅을 안전하게 사용할 수 있습니다.
 */
export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ErrorHandler />
      <SyncUserProvider>{children}</SyncUserProvider>
    </>
  );
}
