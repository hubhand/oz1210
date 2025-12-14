/**
 * @file components/tour-detail/detail-info.tsx
 * @description 관광지 기본 정보 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 기본 정보를 표시하는 섹션입니다.
 * getDetailCommon() API를 사용하여 데이터를 가져오고,
 * 관광지명, 이미지, 주소, 전화번호, 홈페이지, 개요, 관광 타입을 표시합니다.
 *
 * 주요 기능:
 * - 관광지명 (대제목)
 * - 대표 이미지 (크게 표시)
 * - 주소 표시 및 복사 기능
 * - 전화번호 (클릭 시 전화 연결)
 * - 홈페이지 (링크)
 * - 개요 (긴 설명문)
 * - 관광 타입 및 카테고리 뱃지
 * - 정보 없는 항목 숨김 처리
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailCommon() 함수
 * - lib/types/tour.ts: TourDetail 타입
 * - lib/types/stats.ts: getContentTypeName() 함수
 * - components/tour-detail/copy-address-button.tsx: 주소 복사 버튼
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @example
 * ```tsx
 * <DetailInfo contentId="125266" />
 * ```
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.1 기본 정보 섹션)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import Image from "next/image";
import { MapPin, Phone, ExternalLink, ImageIcon, Globe } from "lucide-react";
import { getDetailCommon, TourApiError } from "@/lib/api/tour-api";
import type { TourDetail } from "@/lib/types/tour";
import { getContentTypeName } from "@/lib/types/stats";
import { ErrorDisplay } from "@/components/ui/error";
import { CopyAddressButton } from "@/components/tour-detail/copy-address-button";
import { cn } from "@/lib/utils";

export interface DetailInfoProps {
  /** 관광지 콘텐츠 ID */
  contentId: string;
}

/**
 * 타입별 뱃지 색상 가져오기
 * @param contentTypeId 콘텐츠 타입 ID
 * @returns Tailwind CSS 클래스
 */
function getBadgeColor(contentTypeId: string): string {
  const colorMap: Record<string, string> = {
    "12": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200", // 관광지
    "14": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200", // 문화시설
    "15": "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200", // 축제/행사
    "25": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", // 여행코스
    "28": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200", // 레포츠
    "32": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200", // 숙박
    "38": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200", // 쇼핑
    "39": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200", // 음식점
  };

  return (
    colorMap[contentTypeId] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
  );
}

/**
 * 홈페이지 URL 유효성 검증
 * @param url 홈페이지 URL
 * @returns 유효한 URL인지 여부
 */
function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    // URL이 http:// 또는 https://로 시작하지 않으면 추가
    return url.startsWith("http://") || url.startsWith("https://");
  }
}

/**
 * 홈페이지 URL 정규화
 * @param url 홈페이지 URL
 * @returns 정규화된 URL
 */
function normalizeUrl(url: string): string {
  if (isValidUrl(url)) {
    return url;
  }
  // http:// 또는 https://가 없으면 추가
  return `https://${url}`;
}

/**
 * 관광지 기본 정보 섹션 컴포넌트
 * @param {DetailInfoProps} props - 컴포넌트 props
 * @returns {JSX.Element} 기본 정보 섹션 요소
 */
export async function DetailInfo({ contentId }: DetailInfoProps) {
  let detail: TourDetail | null = null;
  let error: Error | null = null;

  try {
    detail = await getDetailCommon({ contentId });
  } catch (err) {
    if (err instanceof TourApiError) {
      error = err;
    } else if (err instanceof Error) {
      error = err;
    } else {
      error = new Error("알 수 없는 오류가 발생했습니다.");
    }
  }

  // 에러 처리
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="관광지 정보를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 데이터가 없는 경우
  if (!detail) {
    return (
      <ErrorDisplay error="관광지 정보를 찾을 수 없습니다." title="정보 없음" />
    );
  }

  // 주소 조합
  const fullAddress = [detail.addr1, detail.addr2].filter(Boolean).join(" ");

  // 이미지 URL 가져오기
  const imageUrl = detail.firstimage || detail.firstimage2;

  // 카테고리 조합
  const categories = [detail.cat1, detail.cat2, detail.cat3]
    .filter(Boolean)
    .join(" > ");

  return (
    <section
      className="rounded-lg border bg-card p-4 md:p-6 space-y-6"
      aria-labelledby="info-heading"
    >
      {/* 관광지명 */}
      {detail.title && (
        <h1
          id="info-heading"
          className="text-2xl md:text-3xl font-bold leading-tight"
        >
          {detail.title}
        </h1>
      )}

      {/* 관광 타입 및 카테고리 뱃지 */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* 관광 타입 뱃지 */}
        {detail.contenttypeid && (
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
              getBadgeColor(detail.contenttypeid),
            )}
          >
            {getContentTypeName(detail.contenttypeid)}
          </span>
        )}
        {/* 카테고리 */}
        {categories && (
          <span className="text-sm text-muted-foreground">{categories}</span>
        )}
      </div>

      {/* 대표 이미지 */}
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
          <Image
            src={imageUrl}
            alt={detail.title || "관광지 이미지"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
            priority
          />
        </div>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <ImageIcon className="h-16 w-16" aria-hidden="true" />
            <span className="text-sm">이미지 없음</span>
          </div>
        </div>
      )}

      {/* 기본 정보 그룹 */}
      <div className="space-y-4">
        {/* 주소 */}
        {fullAddress && (
          <div className="flex items-start gap-3">
            <MapPin
              className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">주소</p>
              <p className="text-sm text-muted-foreground break-words">
                {fullAddress}
              </p>
              <div className="mt-2">
                <CopyAddressButton address={fullAddress} />
              </div>
            </div>
          </div>
        )}

        {/* 전화번호 */}
        {detail.tel && (
          <div className="flex items-start gap-3">
            <Phone
              className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">전화번호</p>
              <a
                href={`tel:${detail.tel.replace(/[^0-9]/g, "")}`}
                className="text-sm text-primary hover:underline break-all"
                aria-label={`전화하기: ${detail.tel}`}
              >
                {detail.tel}
              </a>
            </div>
          </div>
        )}

        {/* 홈페이지 */}
        {detail.homepage && (
          <div className="flex items-start gap-3">
            <Globe
              className="h-5 w-5 mt-0.5 text-muted-foreground flex-shrink-0"
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">홈페이지</p>
              <a
                href={normalizeUrl(detail.homepage)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
                aria-label={`홈페이지 열기: ${detail.homepage}`}
              >
                {detail.homepage}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* 개요 */}
      {detail.overview && (
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">개요</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {detail.overview}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
