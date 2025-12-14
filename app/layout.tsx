import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ClientLayout } from "@/components/providers/client-layout";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * 사이트 기본 URL 가져오기
 * 환경변수 또는 동적 생성
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // 개발 환경에서는 기본값 사용
  return "https://my-trip.vercel.app";
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "My Trip - 한국 관광지 정보 서비스",
    template: "%s | My Trip",
  },
  description:
    "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
  keywords: [
    "한국 관광",
    "여행",
    "관광지",
    "한국관광공사",
    "여행 정보",
    "관광 정보",
  ],
  authors: [{ name: "My Trip" }],
  creator: "My Trip",
  publisher: "My Trip",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: getSiteUrl(),
    siteName: "My Trip",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
    images: [
      {
        url: `${getSiteUrl()}/og-image.jpg`, // 기본 OG 이미지 (선택 사항)
        width: 1200,
        height: 630,
        alt: "My Trip - 한국 관광지 정보 서비스",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Trip - 한국 관광지 정보 서비스",
    description:
      "전국 관광지 정보를 검색하고, 지도에서 확인하며, 상세 정보를 조회할 수 있는 웹 서비스",
    images: [`${getSiteUrl()}/og-image.jpg`], // 기본 Twitter 이미지 (선택 사항)
  },
  alternates: {
    canonical: getSiteUrl(),
  },
  verification: {
    // Google Search Console 인증 (선택 사항)
    // google: "verification-code",
  },
};

/**
 * RootLayout - Server Component
 *
 * 이 레이아웃은 Server Component로 유지되어야 합니다.
 * ClerkProvider는 클라이언트 컴포넌트이지만, Next.js App Router에서는
 * Server Component 내에서 직접 사용할 수 있습니다.
 *
 * SyncUserProvider는 클라이언트 훅(useAuth)을 사용하므로
 * ClientLayout 컴포넌트로 분리하여 클라이언트 사이드에서만 실행되도록 합니다.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ClientLayout>
            <Navbar />
            {children}
            <Footer />
            <Toaster />
          </ClientLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
