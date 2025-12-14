/**
 * @file components/tour-detail/image-modal.tsx
 * @description 이미지 전체화면 모달 컴포넌트
 *
 * 이 컴포넌트는 이미지를 전체화면으로 보여주는 모달입니다.
 * Dialog 컴포넌트를 사용하여 구현되었으며, 이미지 슬라이드 기능을 제공합니다.
 *
 * 주요 기능:
 * - 전체화면 이미지 표시
 * - 좌우 화살표로 이미지 이동
 * - 이미지 번호 표시 (예: "1 / 10")
 * - ESC 키로 닫기
 * - 배경 클릭으로 닫기
 * - 키보드 네비게이션 (ArrowLeft, ArrowRight)
 *
 * @dependencies
 * - components/ui/dialog.tsx: Dialog 컴포넌트
 * - next/image: Next.js Image 컴포넌트
 */

"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { TourImage } from "@/lib/types/tour";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export interface ImageModalProps {
  /** 이미지 배열 */
  images: TourImage[];
  /** 초기 이미지 인덱스 */
  initialIndex: number;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 이전 이미지 핸들러 */
  onPrevious: () => void;
  /** 다음 이미지 핸들러 */
  onNext: () => void;
}

/**
 * 이미지 URL 가져오기
 */
function getImageUrl(image: TourImage): string | null {
  return image.originimgurl || image.smallimageurl || null;
}

/**
 * 이미지 전체화면 모달 컴포넌트
 */
export function ImageModal({
  images,
  initialIndex,
  onClose,
  onPrevious,
  onNext,
}: ImageModalProps) {
  const currentImage = images[initialIndex];
  const imageUrl = currentImage ? getImageUrl(currentImage) : null;
  const currentNumber = initialIndex + 1;
  const totalNumber = images.length;
  const canGoPrevious = initialIndex > 0;
  const canGoNext = initialIndex < images.length - 1;

  // 키보드 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && canGoPrevious) {
        onPrevious();
      } else if (e.key === "ArrowRight" && canGoNext) {
        onNext();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canGoPrevious, canGoNext, onPrevious, onNext, onClose]);

  if (!currentImage || !imageUrl) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[95vw] max-h-[95vh] w-full h-full p-0 bg-black/95 border-none"
        aria-label="이미지 갤러리 모달"
      >
        {/* 닫기 버튼 */}
        <DialogClose
          className="absolute top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors"
          aria-label="모달 닫기"
        >
          <X className="h-6 w-6" />
        </DialogClose>

        {/* 이미지 컨테이너 */}
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8">
          {/* 이전 버튼 */}
          {canGoPrevious && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={onPrevious}
              aria-label="이전 이미지"
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
          )}

          {/* 이미지 */}
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={imageUrl}
              alt={currentImage.imagename || `관광지 이미지 ${currentNumber}`}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
              // 모달은 사용자 액션 후 표시되므로 priority 불필요
              // next.config.ts에 remotePatterns가 설정되어 있으므로 unoptimized 제거
            />
          </div>

          {/* 다음 버튼 */}
          {canGoNext && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 z-50 text-white hover:bg-white/20 rounded-full"
              onClick={onNext}
              aria-label="다음 이미지"
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
          )}

          {/* 이미지 번호 표시 */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
            {currentNumber} / {totalNumber}
          </div>

          {/* 이미지 설명 (있는 경우) */}
          {currentImage.imagename && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-black/50 text-white px-4 py-2 rounded-lg text-sm max-w-[80%] text-center">
              {currentImage.imagename}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
