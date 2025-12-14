/**
 * @file components/tour-detail/image-gallery-client.tsx
 * @description 이미지 갤러리 클라이언트 컴포넌트
 *
 * 이 컴포넌트는 이미지 갤러리의 클라이언트 사이드 기능을 제공합니다.
 * 이미지 슬라이드, 전체화면 모달, 이미지 클릭 이벤트를 처리합니다.
 *
 * 주요 기능:
 * - 대표 이미지 표시
 * - 서브 이미지 그리드 표시
 * - 이미지 클릭 시 전체화면 모달
 * - 모달 내 이미지 슬라이드
 *
 * @dependencies
 * - components/tour-detail/image-modal.tsx: 이미지 모달 컴포넌트
 * - next/image: Next.js Image 컴포넌트
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import type { TourImage } from "@/lib/types/tour";
import { ImageModal } from "@/components/tour-detail/image-modal";

export interface ImageGalleryClientProps {
  /** 대표 이미지 */
  mainImage: TourImage;
  /** 대표 이미지 URL */
  mainImageUrl: string | null;
  /** 서브 이미지 배열 */
  subImages: TourImage[];
}

/**
 * 이미지 URL 가져오기
 */
function getImageUrl(image: TourImage): string | null {
  return image.originimgurl || image.smallimageurl || null;
}

/**
 * 이미지 갤러리 클라이언트 컴포넌트
 */
export function ImageGalleryClient({
  mainImage,
  mainImageUrl,
  subImages,
}: ImageGalleryClientProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // 모든 이미지 (대표 + 서브)
  const allImages = [mainImage, ...subImages];
  const validImages = allImages.filter((img) => getImageUrl(img) !== null);

  // 이미지 클릭 핸들러
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  // 이미지 에러 처리
  const handleImageError = (index: number) => {
    setImageErrors((prev) => new Set(prev).add(index));
  };

  // 모달 내 이미지 변경
  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < validImages.length - 1
    ) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* 대표 이미지 */}
        {mainImageUrl && !imageErrors.has(0) ? (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={mainImageUrl}
              alt={mainImage.imagename || "관광지 대표 이미지"}
              fill
              className="object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
              priority
              onClick={() => handleImageClick(0)}
              onError={() => handleImageError(0)}
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

        {/* 서브 이미지 그리드 */}
        {subImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {subImages.map((image, index) => {
              const imageUrl = getImageUrl(image);
              const actualIndex = index + 1; // 대표 이미지 다음부터
              const hasError = imageErrors.has(actualIndex);

              if (!imageUrl || hasError) {
                return (
                  <div
                    key={`${image.contentid}-${index}`}
                    className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center"
                  >
                    <ImageIcon
                      className="h-8 w-8 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                );
              }

              return (
                <div
                  key={`${image.contentid}-${index}`}
                  className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted cursor-pointer group"
                  onClick={() => handleImageClick(actualIndex)}
                >
                  <Image
                    src={imageUrl}
                    alt={image.imagename || `관광지 이미지 ${actualIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                    onError={() => handleImageError(actualIndex)}
                  />
                  {/* 호버 시 오버레이 */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 이미지 모달 */}
      {selectedImageIndex !== null && (
        <ImageModal
          images={validImages}
          initialIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onPrevious={handlePreviousImage}
          onNext={handleNextImage}
        />
      )}
    </>
  );
}
