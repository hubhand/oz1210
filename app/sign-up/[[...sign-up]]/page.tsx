/**
 * @file app/sign-up/[[...sign-up]]/page.tsx
 * @description Clerk 회원가입 페이지
 *
 * 이 페이지는 Clerk의 SignUp 컴포넌트를 렌더링합니다.
 * [[...sign-up]] 동적 라우트를 사용하여 Clerk의 모든 회원가입 경로를 처리합니다.
 *
 * 주요 기능:
 * - Clerk 회원가입 UI 표시
 * - 회원가입 후 리다이렉트 처리
 *
 * @dependencies
 * - components/auth/sign-up-form.tsx: SignUp 클라이언트 컴포넌트
 */

import { SignUpForm } from "@/components/auth/sign-up-form";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>;
}) {
  const params = await searchParams;
  const redirectUrl = params.redirect;

  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignUpForm redirectUrl={redirectUrl} />
    </div>
  );
}

