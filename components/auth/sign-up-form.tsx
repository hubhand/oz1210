/**
 * @file components/auth/sign-up-form.tsx
 * @description Clerk SignUp 컴포넌트 래퍼 (클라이언트 컴포넌트)
 *
 * Clerk의 SignUp 컴포넌트는 클라이언트 사이드에서만 작동하므로
 * 별도의 클라이언트 컴포넌트로 분리하여 Hydration 에러를 방지합니다.
 *
 * @dependencies
 * - @clerk/nextjs: Clerk 인증 컴포넌트
 */

"use client";

import { SignUp } from "@clerk/nextjs";

interface SignUpFormProps {
  redirectUrl?: string;
}

export function SignUpForm({ redirectUrl }: SignUpFormProps) {
  return (
    <SignUp
      appearance={{
        elements: {
          rootBox: "mx-auto",
          card: "shadow-lg",
        },
      }}
      afterSignUpUrl={redirectUrl}
      afterSignInUrl={redirectUrl}
    />
  );
}

