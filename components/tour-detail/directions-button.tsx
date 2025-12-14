/**
 * @file components/tour-detail/directions-button.tsx
 * @description 네이버 지도 길찾기 버튼 컴포넌트
 *
 * 이 컴포넌트는 네이버 지도 길찾기 기능을 제공하는 버튼입니다.
 * 클릭 시 네이버 지도 앱 또는 웹에서 길찾기를 시작합니다.
 *
 * 주요 기능:
 * - 네이버 지도 길찾기 URL 생성
 * - 외부 링크로 열기
 * - 반응형 디자인
 *
 * @dependencies
 * - lucide-react: Navigation 아이콘
 */

"use client";

import Link from "next/link";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DirectionsButtonProps {
  /** 위도 */
  lat: number;
  /** 경도 */
  lng: number;
}

/**
 * 네이버 지도 길찾기 URL 생성
 * @param lat 위도
 * @param lng 경도
 * @returns 네이버 지도 길찾기 URL
 */
function getDirectionsUrl(lat: number, lng: number): string {
  // 네이버 지도 v5 길찾기 URL 형식
  // 형식: https://map.naver.com/v5/directions/-/{lng},{lat}
  return `https://map.naver.com/v5/directions/-/${lng},${lat}`;
}

/**
 * 네이버 지도 길찾기 버튼 컴포넌트
 */
export function DirectionsButton({ lat, lng }: DirectionsButtonProps) {
  const directionsUrl = getDirectionsUrl(lat, lng);

  return (
    <Button
      asChild
      variant="outline"
      className="w-full md:w-auto"
      aria-label={`${lat}, ${lng} 위치로 길찾기`}
    >
      <Link
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2"
      >
        <Navigation className="h-4 w-4" aria-hidden="true" />
        <span>길찾기</span>
      </Link>
    </Button>
  );
}
