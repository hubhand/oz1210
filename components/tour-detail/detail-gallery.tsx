/**
 * @file components/tour-detail/detail-gallery.tsx
 * @description 관광지 이미지 갤러리 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 이미지 갤러리를 표시하는 섹션입니다.
 * getDetailImage() API를 사용하여 이미지 목록을 가져오고,
 * 이미지 슬라이드 기능과 전체화면 모달을 제공합니다.
 *
 * 주요 기능:
 * - 이미지 목록 표시 (대표 이미지 + 서브 이미지)
 * - 이미지 슬라이드 기능
 * - 이미지 클릭 시 전체화면 모달
 * - 이미지 없을 때 처리
 * - Next.js Image 컴포넌트 사용 (최적화)
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailImage() 함수
 * - lib/types/tour.ts: TourImage 타입
 * - components/tour-detail/image-modal.tsx: 이미지 모달 컴포넌트
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @example
 * ```tsx
 * <DetailGallery contentId="125266" />
 * ```
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.3 이미지 갤러리)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getDetailImage, TourApiError } from "@/lib/api/tour-api";
import type { TourImage } from "@/lib/types/tour";
import { ErrorDisplay } from "@/components/ui/error";
import { ImageGalleryClient } from "@/components/tour-detail/image-gallery-client";

export interface DetailGalleryProps {
  /** 관광지 콘텐츠 ID */
  contentId: string;
}

/**
 * 이미지 URL 가져오기 (원본 우선, 썸네일 fallback)
 * @param image 이미지 객체
 * @returns 이미지 URL 또는 null
 */
function getImageUrl(image: TourImage): string | null {
  return image.originimgurl || image.smallimageurl || null;
}

/**
 * 관광지 이미지 갤러리 섹션 컴포넌트
 * @param {DetailGalleryProps} props - 컴포넌트 props
 * @returns {JSX.Element} 이미지 갤러리 섹션 요소
 */
export async function DetailGallery({ contentId }: DetailGalleryProps) {
  let images: TourImage[] = [];
  let error: Error | null = null;

  try {
    images = await getDetailImage({
      contentId,
      numOfRows: 20, // 충분한 이미지 로드
      pageNo: 1,
      imageYN: "Y",
    });
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
        title="이미지를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 이미지가 없는 경우 섹션 숨김
  if (!images || images.length === 0) {
    return null;
  }

  // 유효한 이미지 URL이 있는 이미지만 필터링
  const validImages = images.filter((img) => getImageUrl(img) !== null);

  // 유효한 이미지가 없으면 섹션 숨김
  if (validImages.length === 0) {
    return null;
  }

  // 첫 번째 이미지 (대표 이미지)
  const mainImage = validImages[0];
  const mainImageUrl = getImageUrl(mainImage);

  // 나머지 이미지들 (서브 이미지)
  const subImages = validImages.slice(1);

  return (
    <section
      className="rounded-lg border bg-card p-4 md:p-6 space-y-4"
      aria-labelledby="gallery-heading"
    >
      {/* 섹션 제목 */}
      <h2 id="gallery-heading" className="text-xl md:text-2xl font-bold">
        이미지 갤러리
      </h2>

      {/* 이미지 갤러리 (Client Component로 전달) */}
      <ImageGalleryClient
        mainImage={mainImage}
        mainImageUrl={mainImageUrl}
        subImages={subImages}
      />
    </section>
  );
}
