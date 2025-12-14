/**
 * @file app/robots.ts
 * @description robots.txt 생성
 *
 * Next.js 15 App Router의 robots.ts를 사용하여 robots.txt를 동적으로 생성합니다.
 * 검색 엔진 크롤링 규칙을 설정하고 sitemap URL을 포함합니다.
 *
 * 주요 기능:
 * - 검색 엔진 크롤링 규칙 설정
 * - API 라우트 및 Next.js 내부 파일 제외
 * - sitemap URL 포함
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots} - Next.js Robots
 */

import { MetadataRoute } from "next";

/**
 * 사이트 기본 URL 가져오기
 */
function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return "https://my-trip.vercel.app";
}

/**
 * robots.txt 생성
 * @returns robots.txt 데이터
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
