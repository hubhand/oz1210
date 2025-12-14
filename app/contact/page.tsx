import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact | My Trip",
  description: "My Trip에 문의하세요. 서비스 관련 문의사항을 남겨주시면 답변드리겠습니다.",
  openGraph: {
    title: "Contact | My Trip",
    description: "My Trip에 문의하세요.",
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-3xl mx-auto">
        <div className="space-y-8">
          {/* 헤더 */}
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-muted p-3">
              <Mail className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Contact</h1>
          </div>

          {/* 내용 */}
          <div className="space-y-6 text-muted-foreground">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">문의하기</h2>
              <p className="leading-relaxed">
                My Trip 서비스에 대한 문의사항, 버그 리포트, 기능 제안 등이 있으시면
                아래 방법으로 연락해주세요.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">문의 방법</h2>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold text-foreground mb-2">GitHub Issues</h3>
                  <p className="text-sm leading-relaxed">
                    버그 리포트나 기능 제안은 GitHub Issues를 통해 남겨주시면
                    빠르게 확인하고 처리하겠습니다.
                  </p>
                </div>

                <div className="p-4 rounded-lg border bg-card">
                  <h3 className="font-semibold text-foreground mb-2">일반 문의</h3>
                  <p className="text-sm leading-relaxed">
                    서비스 이용 중 궁금한 점이나 도움이 필요한 사항이 있으시면
                    언제든지 문의해주세요.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">응답 시간</h2>
              <p className="leading-relaxed">
                문의사항에 대해서는 가능한 빠르게 답변드리도록 노력하겠습니다.
                일반적으로 1-2일 이내에 답변드립니다.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">서비스 정보</h2>
              <p className="leading-relaxed">
                My Trip에 대한 자세한 정보는{" "}
                <Link href="/about" className="text-primary hover:underline">
                  About 페이지
                </Link>
                를 참고해주세요.
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

