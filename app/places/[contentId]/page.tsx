/**
 * @file app/places/[contentId]/page.tsx
 * @description 관광지 상세페이지
 *
 * 이 페이지는 개별 관광지의 상세 정보를 표시하는 페이지입니다.
 * 동적 라우팅을 사용하여 `/places/[contentId]` 경로로 접근합니다.
 *
 * 주요 기능 (현재 단계 - Phase 3.9):
 * 1. 동적 라우팅 설정 (contentId 파라미터 추출)
 * 2. 기본 레이아웃 구조
 * 3. 뒤로가기 버튼
 * 4. 기본 정보 섹션 (MVP 2.4.1): 관광지명, 이미지, 주소, 전화번호, 홈페이지, 개요
 * 5. 운영 정보 섹션 (MVP 2.4.2): 운영시간, 휴무일, 이용요금, 주차 정보, 수용인원, 체험 프로그램
 * 6. 반려동물 정보 섹션 (MVP 2.5): 반려동물 동반 가능 여부, 크기 제한 정보, 입장 가능 장소, 추가 요금
 * 7. 이미지 갤러리 섹션 (MVP 2.4.3): 대표 이미지 + 서브 이미지들, 슬라이드 기능, 전체화면 모달
 * 8. 지도 섹션 (MVP 2.4.4): 관광지 위치 표시, 길찾기 버튼
 * 9. 공유 기능 (MVP 2.4.5): URL 복사, Open Graph 메타태그
 * 10. 북마크 기능 (MVP 2.4.5): 즐겨찾기 추가/제거, Supabase 연동
 * 11. 최종 통합 및 스타일링: 반응형 디자인, 모바일 최적화, 접근성 개선
 *
 * 향후 구현 예정 기능:
 * - 북마크 목록 페이지 (`/bookmarks`): 북마크한 관광지 목록
 *
 * @dependencies
 * - Next.js 15 App Router (동적 라우팅)
 * - components/tour-detail/back-button.tsx: 뒤로가기 버튼
 * - components/tour-detail/share-button.tsx: URL 공유 버튼
 * - components/bookmarks/bookmark-button.tsx: 북마크 버튼
 * - components/tour-detail/detail-info.tsx: 기본 정보 섹션
 * - components/tour-detail/detail-intro.tsx: 운영 정보 섹션
 * - components/tour-detail/detail-pet-tour.tsx: 반려동물 정보 섹션
 * - components/tour-detail/detail-gallery.tsx: 이미지 갤러리 섹션
 * - components/tour-detail/detail-map.tsx: 지도 섹션
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { Suspense } from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { BackButton } from "@/components/tour-detail/back-button";
import { ShareButton } from "@/components/tour-detail/share-button";
import { BookmarkButton } from "@/components/bookmarks/bookmark-button";
import { DetailInfo } from "@/components/tour-detail/detail-info";
import { DetailIntro } from "@/components/tour-detail/detail-intro";
import { DetailGallery } from "@/components/tour-detail/detail-gallery";
import { DetailMap } from "@/components/tour-detail/detail-map";
import { DetailPetTour } from "@/components/tour-detail/detail-pet-tour";
import { Skeleton } from "@/components/ui/skeleton";
import { getDetailCommon, TourApiError } from "@/lib/api/tour-api";
import { prepareDescription } from "@/lib/utils/metadata";

interface PlaceDetailPageProps {
  params: Promise<{ contentId: string }>;
}

/**
 * Open Graph 메타태그 동적 생성
 * @param props 페이지 props
 * @returns 메타데이터 객체
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ contentId: string }>;
}): Promise<Metadata> {
  const { contentId } = await params;

  // 기본 메타데이터
  const defaultMetadata: Metadata = {
    title: "관광지 정보 | My Trip",
    description: "한국관광공사 관광지 상세 정보를 확인하세요.",
  };

  try {
    // 관광지 정보 조회
    const detail = await getDetailCommon({ contentId });

    // 절대 URL 생성
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`;
    const pageUrl = `${baseUrl}/places/${contentId}`;

    // 이미지 URL (대표 이미지 우선, 없으면 기본 이미지)
    const imageUrl =
      detail.firstimage ||
      detail.firstimage2 ||
      `${baseUrl}/images/default-tour-image.jpg`;

    // 설명 텍스트 정리 (HTML 태그 제거, 100자 이내)
    const description = detail.overview
      ? prepareDescription(detail.overview, 100)
      : `${detail.title}의 상세 정보를 확인하세요.`;

    // 메타데이터 생성
    const metadata: Metadata = {
      title: `${detail.title} | My Trip`,
      description: description,
      openGraph: {
        title: detail.title,
        description: description,
        url: pageUrl,
        siteName: "My Trip",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: detail.title,
          },
        ],
        locale: "ko_KR",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: detail.title,
        description: description,
        images: [imageUrl],
      },
    };

    return metadata;
  } catch (error) {
    // API 호출 실패 시 기본 메타데이터 반환
    // 개발 환경에서만 상세 에러 로깅
    if (process.env.NODE_ENV === "development") {
      const errorInfo: Record<string, unknown> = {
        contentId,
        errorMessage: error instanceof Error ? error.message : String(error),
      };

      if (error instanceof Error && error.stack) {
        errorInfo.stack = error.stack;
      }

      // TourApiError인 경우 추가 정보
      if (error instanceof TourApiError) {
        if (error.statusCode !== undefined) {
          errorInfo.statusCode = error.statusCode;
        }
        if (error.errorCode !== undefined) {
          errorInfo.errorCode = error.errorCode;
        }
      }

      console.error("메타데이터 생성 실패:", errorInfo);
    }
    // 프로덕션에서는 조용히 기본 메타데이터 반환
    return defaultMetadata;
  }
}

/**
 * 기본 정보 섹션 로딩 스켈레톤
 */
function DetailInfoSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-4 md:p-6 space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-32" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </section>
  );
}

/**
 * 운영 정보 섹션 로딩 스켈레톤
 */
function DetailIntroSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 이미지 갤러리 섹션 로딩 스켈레톤
 */
function DetailGallerySkeleton() {
  return (
    <section className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-video w-full rounded-lg" />
        ))}
      </div>
    </section>
  );
}

/**
 * 지도 섹션 로딩 스켈레톤
 */
function DetailMapSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <Skeleton className="h-7 w-32" />
      <Skeleton className="h-[400px] md:h-[500px] w-full rounded-lg" />
      <Skeleton className="h-10 w-24" />
    </section>
  );
}

/**
 * 반려동물 정보 섹션 로딩 스켈레톤
 */
function DetailPetTourSkeleton() {
  return (
    <section className="rounded-lg border bg-card p-4 md:p-6 space-y-4">
      <Skeleton className="h-7 w-32" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * 페이지 재검증 주기 (초)
 * 관광지 상세 정보는 1시간마다 재검증 (3600초)
 * ISR (Incremental Static Regeneration) 적용
 */
export const revalidate = 3600;

/**
 * 관광지 상세페이지 메인 컴포넌트
 * @param {PlaceDetailPageProps} props - 페이지 props
 * @returns {JSX.Element} 상세페이지 요소
 */
export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  // Next.js 15에서는 params가 Promise로 처리됨
  const { contentId } = await params;

  return (
    <main className="min-h-[calc(100vh-80px)] px-4 md:px-6 py-8 md:py-12">
      <div className="w-full max-w-7xl mx-auto">
        {/* 뒤로가기 버튼, 공유 버튼, 북마크 버튼 */}
        <div className="mb-6 flex items-center gap-2">
          <BackButton />
          <ShareButton />
          <BookmarkButton contentId={contentId} />
        </div>

        {/* 기본 레이아웃 구조 */}
        <div className="space-y-8">
          {/* 기본 정보 섹션 */}
          <Suspense fallback={<DetailInfoSkeleton />}>
            <DetailInfo contentId={contentId} />
          </Suspense>

          {/* 운영 정보 섹션 */}
          <Suspense fallback={<DetailIntroSkeleton />}>
            <DetailIntro contentId={contentId} />
          </Suspense>

          {/* 반려동물 정보 섹션 */}
          <Suspense fallback={<DetailPetTourSkeleton />}>
            <DetailPetTour contentId={contentId} />
          </Suspense>

          {/* 이미지 갤러리 섹션 */}
          <Suspense fallback={<DetailGallerySkeleton />}>
            <DetailGallery contentId={contentId} />
          </Suspense>

          {/* 지도 섹션 */}
          <Suspense fallback={<DetailMapSkeleton />}>
            <DetailMap contentId={contentId} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
