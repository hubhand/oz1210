/**
 * @file app/sign-in/[[...sign-in]]/page.tsx
 * @description Clerk 로그인 페이지
 *
 * 이 페이지는 Clerk의 SignIn 컴포넌트를 렌더링합니다.
 * [[...sign-in]] 동적 라우트를 사용하여 Clerk의 모든 인증 경로를 처리합니다.
 *
 * 주요 기능:
 * - Clerk 로그인 UI 표시
 * - 로그인 후 리다이렉트 처리 (URL 쿼리 파라미터의 redirect 값 사용)
 *
 * @dependencies
 * - components/auth/sign-in-form.tsx: SignIn 클라이언트 컴포넌트
 */

import { SignInForm } from "@/components/auth/sign-in-form";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = params.redirect || "/bookmarks";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInForm redirectUrl={redirectUrl} />
    </div>
  );
}
