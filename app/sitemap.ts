/**
 * @file app/sitemap.ts
 * @description 사이트맵 생성
 *
 * Next.js 15 App Router의 sitemap.ts를 사용하여 사이트맵을 동적으로 생성합니다.
 * 정적 페이지와 주요 동적 페이지를 포함합니다.
 *
 * 주요 기능:
 * - 정적 페이지 URL 포함 (홈, 통계, 북마크)
 * - 동적 페이지 URL 생성 (관광지 상세페이지, 선택 사항)
 * - lastModified, changeFrequency, priority 설정
 *
 * 성능 고려:
 * - 모든 관광지 URL 생성 시 성능 이슈 가능
 * - 현재는 정적 페이지만 포함 (동적 페이지는 선택 사항)
 * - 필요시 주요 관광지만 포함하도록 확장 가능
 *
 * @see {@link https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap} - Next.js Sitemap
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
 * 사이트맵 생성
 * @returns 사이트맵 데이터
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const currentDate = new Date();

  // 정적 페이지
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/stats`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bookmarks`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.7,
    },
  ];

  // 동적 페이지 (관광지 상세페이지)
  // 성능을 고려하여 현재는 제외
  // 필요시 주요 관광지만 포함하도록 확장 가능
  // 예: 인기 관광지 상위 100개만 포함

  return staticPages;
}
