/**
 * @file components/Navbar.tsx
 * @description 메인 네비게이션 바 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션의 상단 네비게이션 바를 제공합니다.
 * 로고, 검색창, 네비게이션 링크, 인증 버튼을 포함합니다.
 *
 * 주요 기능:
 * - 로고 및 브랜드명 표시
 * - 검색창 (TourSearch 컴포넌트)
 * - 네비게이션 링크 (홈, 통계, 북마크)
 * - Clerk 인증 버튼
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */
"use client";

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { TourSearch } from "@/components/tour-search";
import { Skeleton } from "@/components/ui/skeleton";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 max-w-7xl mx-auto px-4">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold">My Trip</span>
        </Link>

        {/* 검색창 */}
        <div className="flex-1 max-w-lg mx-4 hidden md:flex">
          <Suspense fallback={<Skeleton className="h-9 w-full max-w-lg" />}>
            <TourSearch compact />
          </Suspense>
        </div>

        {/* 네비게이션 링크 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            홈
          </Link>
          <Link
            href="/stats"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            통계
          </Link>
          <Link
            href="/bookmarks"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            북마크
          </Link>
        </nav>

        {/* 인증 버튼 */}
        <div className="flex items-center gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
