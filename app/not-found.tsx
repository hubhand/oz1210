/**
 * @file app/not-found.tsx
 * @description 404 페이지 - 페이지를 찾을 수 없음
 *
 * 이 컴포넌트는 Next.js App Router의 not-found 페이지로 사용됩니다.
 * 존재하지 않는 페이지에 접근하거나 `notFound()` 함수가 호출될 때 표시됩니다.
 *
 * 주요 기능:
 * - 사용자 친화적인 404 에러 메시지 표시
 * - 홈으로 돌아가기 버튼 제공
 * - 접근성 지원 (ARIA 속성, 시맨틱 HTML)
 * - 반응형 디자인 (모바일 우선)
 * - SEO 최적화 메타데이터 설정
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/not-found} - Next.js Not Found
 */

import { Metadata } from "next";
import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 - 페이지를 찾을 수 없습니다 | My Trip",
  description: "요청하신 페이지를 찾을 수 없습니다. 주소를 확인하거나 홈으로 돌아가주세요.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main
      className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4"
      role="status"
      aria-live="polite"
      aria-label="404 페이지"
    >
      <div className="flex flex-col items-center justify-center max-w-md w-full space-y-6 text-center">
        {/* 404 아이콘 및 제목 */}
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-muted p-6">
            <FileQuestion className="h-16 w-16 text-muted-foreground" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold">404</h1>
            <h2 className="text-2xl md:text-3xl font-bold">페이지를 찾을 수 없습니다</h2>
          </div>
        </div>

        {/* 설명 메시지 */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-base md:text-lg">
            요청하신 페이지가 존재하지 않습니다.
          </p>
          <p className="text-sm text-muted-foreground">
            주소를 확인하거나 홈으로 돌아가주세요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto" role="group" aria-label="네비게이션 옵션">
          <Button asChild variant="default" size="lg" className="gap-2" aria-label="홈으로 돌아가기">
            <Link href="/">
              <Home className="h-5 w-5" aria-hidden="true" />
              홈으로 돌아가기
            </Link>
          </Button>
        </div>

        {/* 추가 링크 (선택 사항) */}
        <div className="pt-4 border-t w-full">
          <p className="text-sm text-muted-foreground mb-3">다른 페이지 둘러보기:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild variant="ghost" size="sm" aria-label="통계 페이지로 이동">
              <Link href="/stats">통계</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" aria-label="북마크 페이지로 이동">
              <Link href="/bookmarks">북마크</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

