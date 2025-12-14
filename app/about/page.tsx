import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "About | My Trip",
  description: "My Trip에 대해 알아보세요. 한국의 관광지를 쉽게 찾고 북마크할 수 있는 서비스입니다.",
  openGraph: {
    title: "About | My Trip",
    description: "My Trip에 대해 알아보세요.",
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-3">
              <Info className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">About</h1>
          </div>

          {/* 내용 */}
          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">My Trip이란?</h2>
              <p className="leading-relaxed">
                My Trip은 한국의 다양한 관광지를 쉽게 찾고 탐색할 수 있도록 도와주는 서비스입니다.
                한국관광공사 API를 활용하여 전국의 관광지 정보를 제공하며, 지도를 통해 위치를 확인하고
                관심 있는 장소를 북마크하여 나중에 다시 찾아볼 수 있습니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">주요 기능</h2>
              <ul className="space-y-2 list-disc list-inside">
                <li>전국 관광지 검색 및 필터링</li>
                <li>지도에서 관광지 위치 확인</li>
                <li>관심 있는 관광지 북마크</li>
                <li>관광지 상세 정보 확인</li>
                <li>지역별, 타입별 통계 확인</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">데이터 출처</h2>
              <p className="leading-relaxed">
                본 서비스는 한국관광공사에서 제공하는 공공 API를 활용하여 관광지 정보를 제공합니다.
                지도 서비스는 네이버 클라우드 플랫폼의 Naver Maps API를 사용합니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">문의</h2>
              <p className="leading-relaxed">
                문의사항이 있으시면{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  Contact 페이지
                </Link>
                를 방문해주세요.
              </p>
            </section>
          </div>

          {/* 액션 버튼 */}
          <div className="pt-6 border-t">
            <Button asChild variant="default" className="gap-2">
              <Link href="/">
                <Home className="h-4 w-4" aria-hidden="true" />
                홈으로 돌아가기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

