/**
 * @file components/Footer.tsx
 * @description 푸터 컴포넌트
 *
 * 이 컴포넌트는 애플리케이션의 하단 푸터를 제공합니다.
 * 저작권 정보, 링크, API 출처를 표시합니다.
 *
 * 주요 기능:
 * - 저작권 정보 표시
 * - About, Contact 링크 (향후 구현 예정)
 * - 한국관광공사 API 출처 표시
 * - 반응형 디자인 (모바일: 세로 정렬, 데스크톱: 가로 정렬)
 * - 다크 모드 지원
 *
 * @see {@link /docs/DESIGN.md} - 디자인 문서
 */

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          {/* 저작권 정보 */}
          <div className="text-sm text-muted-foreground">
            <span>My Trip © {currentYear}</span>
          </div>

          {/* 링크 (향후 구현 예정) */}
          <nav className="flex items-center gap-4 md:gap-6">
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="About 페이지"
            >
              About
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Contact 페이지"
            >
              Contact
            </Link>
          </nav>

          {/* API 출처 */}
          <div className="text-sm text-muted-foreground">
            <span>한국관광공사 API 제공</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
