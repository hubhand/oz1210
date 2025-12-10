/**
 * @file app/layout.tsx
 * @description Next.js Root Layout with Clerk 한국어 로컬라이제이션
 *
 * 이 파일은 애플리케이션의 루트 레이아웃을 정의합니다.
 * Clerk 인증 제공자와 한국어 로컬라이제이션이 설정되어 있습니다.
 *
 * 주요 기능:
 * - ClerkProvider로 전체 앱에 인증 제공
 * - koKR 로컬라이제이션으로 모든 Clerk 컴포넌트를 한국어로 표시
 * - SyncUserProvider로 Clerk 사용자를 Supabase에 자동 동기화
 *
 * @see {@link /docs/CLERK_LOCALIZATION.md} - Clerk 로컬라이제이션 가이드
 */
import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            <Navbar />
            {children}
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
