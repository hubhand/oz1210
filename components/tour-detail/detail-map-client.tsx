/**
 * @file components/tour-detail/detail-map-client.tsx
 * @description 관광지 지도 클라이언트 컴포넌트
 *
 * 이 컴포넌트는 네이버 지도를 사용하여 단일 관광지의 위치를 표시합니다.
 * Naver Maps API v3 (NCP)를 사용하여 지도를 초기화하고 마커를 표시합니다.
 *
 * 주요 기능:
 * - Naver Maps API 스크립트 동적 로드
 * - 지도 초기화 (관광지 좌표 중심)
 * - 마커 1개 표시
 * - 인포윈도우 (관광지명, 주소)
 * - 지도 컨트롤 (줌, 지도 유형)
 * - 길찾기 버튼
 *
 * @dependencies
 * - Naver Maps API v3 (NCP)
 * - components/tour-detail/directions-button.tsx: 길찾기 버튼
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorDisplay } from "@/components/ui/error";
import { DirectionsButton } from "@/components/tour-detail/directions-button";

// Naver Maps API 타입 정의는 components/naver-map.tsx에서 공통으로 사용됩니다.

export interface DetailMapClientProps {
  /** 경도 (KATEC 좌표계) */
  mapx: string;
  /** 위도 (KATEC 좌표계) */
  mapy: string;
  /** 관광지명 */
  title: string;
  /** 주소 */
  address: string;
}

/**
 * 한국관광공사 API에서 제공하는 좌표를 파싱
 * KATEC 좌표계인 경우 10000000으로 나눠서 WGS84로 변환
 */
function parseCoordinates(
  mapx: string,
  mapy: string,
): { lat: number; lng: number } | null {
  try {
    let lng = Number(mapx);
    let lat = Number(mapy);

    if (isNaN(lat) || isNaN(lng)) {
      return null;
    }

    // KATEC 좌표계 감지 및 변환
    if (Math.abs(lat) > 1000000 || Math.abs(lng) > 1000000) {
      lng = lng / 10000000;
      lat = lat / 10000000;
    }

    // 한국 영역 좌표 범위 체크
    if (lat < 33 || lat > 39 || lng < 124 || lng > 132) {
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error("좌표 파싱 실패:", error, { mapx, mapy });
    return null;
  }
}

/**
 * 관광지 지도 클라이언트 컴포넌트
 */
export function DetailMapClient({
  mapx,
  mapy,
  title,
  address,
}: DetailMapClientProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const infoWindowRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // 좌표 파싱
  useEffect(() => {
    const coord = parseCoordinates(mapx, mapy);
    if (!coord) {
      setError(new Error("유효하지 않은 좌표입니다."));
      setIsLoading(false);
      return;
    }
    setCoordinates(coord);
  }, [mapx, mapy]);

  // 네이버 지도 API 스크립트 로드
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;

    if (!apiKey) {
      setError(
        new Error(
          "네이버 지도 API 키가 설정되지 않았습니다. NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수를 설정해주세요.",
        ),
      );
      setIsLoading(false);
      return;
    }

    // 이미 스크립트가 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      setScriptLoaded(true);
      return;
    }

    // 스크립트가 이미 로드 중인지 확인
    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]',
    );
    if (existingScript) {
      let attempts = 0;
      const maxAttempts = 100;
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.naver && window.naver.maps) {
          setScriptLoaded(true);
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setError(
            new Error("네이버 지도 API 스크립트 로드 시간이 초과되었습니다."),
          );
          setIsLoading(false);
        }
      }, 100);

      return () => clearInterval(checkInterval);
    }

    // 스크립트 동적 로드
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${apiKey}`;
    script.async = true;
    script.defer = true;

    let isLoaded = false;
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setError(
          new Error("네이버 지도 API 스크립트 로드 시간이 초과되었습니다."),
        );
        setIsLoading(false);
      }
    }, 10000);

    script.onload = () => {
      isLoaded = true;
      clearTimeout(timeoutId);
      setTimeout(() => {
        if (window.naver && window.naver.maps) {
          setScriptLoaded(true);
        } else {
          setError(
            new Error("네이버 지도 API가 로드되었지만 초기화에 실패했습니다."),
          );
          setIsLoading(false);
        }
      }, 100);
    };

    script.onerror = () => {
      clearTimeout(timeoutId);
      setError(new Error("네이버 지도 API 스크립트를 로드할 수 없습니다."));
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // 지도 초기화 및 마커 표시
  useEffect(() => {
    if (
      !scriptLoaded ||
      !mapContainerRef.current ||
      !coordinates ||
      mapInstanceRef.current
    ) {
      return;
    }

    try {
      const naver = window.naver;
      if (!naver || !naver.maps) {
        setError(new Error("네이버 지도 API를 사용할 수 없습니다."));
        setIsLoading(false);
        return;
      }

      // 지도 인스턴스 생성
      const map = new naver.maps.Map(mapContainerRef.current, {
        center: new naver.maps.LatLng(coordinates.lat, coordinates.lng),
        zoom: 15, // 상세 위치 표시에 적합
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      });

      // 지도 컨트롤 추가
      if (map.controls && typeof map.controls.add === "function") {
        try {
          const zoomControl = new naver.maps.ZoomControl({
            position: naver.maps.Position.TOPRIGHT,
          });
          map.controls.add(zoomControl);

          const mapTypeControl = new naver.maps.MapTypeControl({
            position: naver.maps.Position.TOPRIGHT,
          });
          map.controls.add(mapTypeControl);
        } catch (controlError) {
          console.warn("지도 컨트롤 추가 실패:", controlError);
        }
      }

      mapInstanceRef.current = map;

      // 마커 생성
      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(coordinates.lat, coordinates.lng),
        map: map,
        title: title,
      });

      // 인포윈도우 HTML 생성
      const escapeHtml = (text: string) => {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
      };

      const infoWindowContent = `
        <div style="padding: 12px; min-width: 200px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
            ${escapeHtml(title)}
          </h3>
          <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.5;">
            ${escapeHtml(address)}
          </p>
        </div>
      `;

      const infoWindow = new naver.maps.InfoWindow({
        content: infoWindowContent,
        maxWidth: 300,
      });

      // 마커 클릭 시 인포윈도우 열기
      naver.maps.Event.addListener(marker, "click", () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.close();
        }
        infoWindow.open(map, marker);
        infoWindowRef.current = infoWindow;
      });

      // 초기 인포윈도우 열기
      infoWindow.open(map, marker);
      infoWindowRef.current = infoWindow;
      markerRef.current = marker;

      setIsLoading(false);
    } catch (err) {
      console.error("지도 초기화 에러:", err);
      setError(
        err instanceof Error ? err : new Error("지도를 초기화할 수 없습니다."),
      );
      setIsLoading(false);
    }
  }, [scriptLoaded, coordinates, title, address]);

  // cleanup
  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, []);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[400px] md:h-[500px] w-full rounded-lg" />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <ErrorDisplay
        error={error}
        title="지도를 불러올 수 없습니다"
        retryLabel="다시 시도"
      />
    );
  }

  // 좌표가 없는 경우
  if (!coordinates) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* 지도 컨테이너 */}
      <div
        ref={mapContainerRef}
        className="h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden bg-muted"
        aria-label="관광지 위치 지도"
        role="application"
      />

      {/* 길찾기 버튼 */}
      <div className="flex justify-start">
        <DirectionsButton lat={coordinates.lat} lng={coordinates.lng} />
      </div>
    </div>
  );
}
