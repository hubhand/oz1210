/**
 * @file components/naver-map.tsx
 * @description 네이버 지도 컴포넌트
 *
 * 이 컴포넌트는 Naver Maps API v3 (NCP)를 사용하여 관광지 목록을 지도에 마커로 표시합니다.
 * 지도 초기화, 마커 표시, 인포윈도우 등 기본 기능을 제공합니다.
 *
 * 주요 기능:
 * - Naver Maps API v3 스크립트 동적 로드
 * - 지도 초기화 및 컨테이너 설정
 * - 한국관광공사 API 좌표 직접 사용 (mapx=longitude, mapy=latitude)
 * - 관광지 목록을 마커로 표시
 * - 마커 클릭 시 인포윈도우 표시
 * - 지도 컨트롤 (줌 인/아웃, 지도 유형 선택)
 * - 현재 위치로 이동 버튼
 * - 반응형 디자인
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.2 네이버 지도 연동)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";
import type { TourItem } from "@/lib/types/tour";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorDisplay } from "@/components/ui/error";
import { cn } from "@/lib/utils";

// Naver Maps API 타입 정의
declare global {
  interface Window {
    naver?: {
      maps: {
        Map: new (
          element: HTMLElement,
          options: {
            center: any; // LatLng 객체를 받음
            zoom: number;
            mapTypeId?: string;
          },
        ) => {
          setCenter: (center: any) => void; // LatLng 객체를 받음
          setZoom: (zoom: number) => void;
          getCenter: () => { lat: () => number; lng: () => number };
          getZoom: () => number;
          controls: {
            add: (control: any) => void;
          };
        };
        Marker: new (options: {
          position: any; // LatLng 객체를 받음
          map: any;
          title?: string;
        }) => {
          setMap: (map: any) => void;
          getPosition: () => { lat: () => number; lng: () => number };
        };
        InfoWindow: new (options: { content: string; maxWidth?: number }) => {
          open: (map: any, marker: any) => void;
          close: () => void;
        };
        LatLng: new (lat: number, lng: number) => {
          lat: () => number;
          lng: () => number;
        };
        Event: {
          addListener: (
            target: any,
            event: string,
            handler: () => void,
          ) => void;
        };
        ZoomControl: new (options: { position: number }) => void;
        MapTypeControl: new (options: { position: number }) => void;
        MapTypeId: {
          NORMAL: string;
          SATELLITE: string;
          HYBRID: string;
        };
        Position: {
          TOPLEFT: number;
          TOPRIGHT: number;
          BOTTOMLEFT: number;
          BOTTOMRIGHT: number;
        };
      };
    };
  }
}

export interface NaverMapProps {
  /** 관광지 목록 */
  tours: TourItem[];
  /** 초기 중심 좌표 (선택, 없으면 자동 계산) */
  center?: { lat: number; lng: number };
  /** 초기 줌 레벨 (선택, 기본값: 10) */
  zoom?: number;
  /** 지도 높이 (선택, 기본값: "600px") */
  height?: string;
  /** 추가 CSS 클래스 */
  className?: string;
  /** 마커 클릭 콜백 (향후 리스트 연동용) */
  onMarkerClick?: (tour: TourItem) => void;
  /** 특정 관광지로 지도 이동 (향후 리스트 연동용) */
  selectedTourId?: string;
}

/**
 * 한국관광공사 API에서 제공하는 좌표를 파싱
 * mapx = longitude (경도)
 * mapy = latitude (위도)
 *
 * KATEC 좌표계인 경우 10000000으로 나눠서 WGS84로 변환
 * 이미 WGS84 형식인 경우 직접 사용
 *
 * @param mapx 경도 (문자열)
 * @param mapy 위도 (문자열)
 * @returns 좌표 객체 { lat: number, lng: number } 또는 null
 */
function parseCoordinates(
  mapx: string,
  mapy: string,
): { lat: number; lng: number } | null {
  try {
    // Number()로 변환
    let lng = Number(mapx);
    let lat = Number(mapy);

    // 좌표 유효성 검증
    if (isNaN(lat) || isNaN(lng)) {
      console.warn(`유효하지 않은 좌표: mapx=${mapx}, mapy=${mapy}`);
      return null;
    }

    // KATEC 좌표계 감지: 값이 1000000보다 크면 KATEC 좌표계로 간주
    // (한국의 WGS84 좌표는 보통 33-39, 124-132 범위)
    if (Math.abs(lat) > 1000000 || Math.abs(lng) > 1000000) {
      // KATEC 좌표계 → WGS84 변환
      lng = lng / 10000000;
      lat = lat / 10000000;
      console.log(
        `KATEC 좌표 변환: mapx=${mapx} → lng=${lng}, mapy=${mapy} → lat=${lat}`,
      );
    }

    // 한국 영역 좌표 범위 체크 (대략적인 범위)
    if (lat < 33 || lat > 39 || lng < 124 || lng > 132) {
      console.warn(
        `유효하지 않은 좌표 범위: lat=${lat}, lng=${lng} (원본: mapx=${mapx}, mapy=${mapy})`,
      );
      return null;
    }

    return { lat, lng };
  } catch (error) {
    console.error("좌표 파싱 실패:", error, { mapx, mapy });
    return null;
  }
}

/**
 * 관광지 목록의 중심 좌표 계산
 * @param tours 관광지 목록
 * @returns 중심 좌표 { lat: number, lng: number } 또는 null
 */
function calculateCenter(
  tours: TourItem[],
): { lat: number; lng: number } | null {
  if (tours.length === 0) {
    return null;
  }

  const validCoords = tours
    .map((tour) => parseCoordinates(tour.mapx, tour.mapy))
    .filter((coord): coord is { lat: number; lng: number } => coord !== null);

  if (validCoords.length === 0) {
    return null;
  }

  const avgLat =
    validCoords.reduce((sum, coord) => sum + coord.lat, 0) / validCoords.length;
  const avgLng =
    validCoords.reduce((sum, coord) => sum + coord.lng, 0) / validCoords.length;

  return { lat: avgLat, lng: avgLng };
}

/**
 * 네이버 지도 컴포넌트
 * @param {NaverMapProps} props - 컴포넌트 props
 * @returns {JSX.Element} 지도 UI 요소
 */
export function NaverMap({
  tours,
  center,
  zoom = 10,
  height = "600px",
  className,
  onMarkerClick,
  selectedTourId,
}: NaverMapProps) {
  // 높이 처리: height prop이 있으면 사용, 없으면 기본값
  // "100%"일 때는 부모 컨테이너 높이에 맞춤
  const mapHeight = height;
  const isFullHeight = height === "100%";
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

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
      setIsLoading(false);
      return;
    }

    // 스크립트가 이미 로드 중인지 확인
    const existingScript = document.querySelector(
      'script[src*="oapi.map.naver.com"]',
    );
    if (existingScript) {
      // 스크립트 로드 대기 (최대 10초)
      let attempts = 0;
      const maxAttempts = 100; // 10초 (100ms * 100)
      const checkInterval = setInterval(() => {
        attempts++;
        if (window.naver && window.naver.maps) {
          setScriptLoaded(true);
          setIsLoading(false);
          clearInterval(checkInterval);
        } else if (attempts >= maxAttempts) {
          clearInterval(checkInterval);
          setError(
            new Error(
              "네이버 지도 API 스크립트 로드 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.",
            ),
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

    // 타임아웃 설정 (10초)
    const timeoutId = setTimeout(() => {
      if (!isLoaded) {
        setError(
          new Error(
            "네이버 지도 API 스크립트 로드 시간이 초과되었습니다. 네트워크 연결을 확인해주세요.",
          ),
        );
        setIsLoading(false);
      }
    }, 10000);

    script.onload = () => {
      isLoaded = true;
      clearTimeout(timeoutId);
      console.log("네이버 지도 스크립트 로드 완료");

      // 스크립트가 로드된 후 약간의 지연을 두고 확인
      setTimeout(() => {
        if (window.naver && window.naver.maps) {
          console.log("네이버 지도 API 사용 가능:", {
            naver: !!window.naver,
            maps: !!window.naver.maps,
            Map: !!window.naver.maps.Map,
          });
          setScriptLoaded(true);
          setIsLoading(false);
        } else {
          console.error("네이버 지도 API 초기화 실패:", {
            naver: !!window.naver,
            maps: window.naver ? !!window.naver.maps : false,
          });
          setError(
            new Error("네이버 지도 API가 로드되었지만 초기화에 실패했습니다."),
          );
          setIsLoading(false);
        }
      }, 100);
    };

    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error("네이버 지도 API 스크립트 로드 실패:", error);
      console.error(
        "API 키:",
        apiKey ? `${apiKey.substring(0, 10)}...` : "없음",
      );
      console.error("스크립트 URL:", script.src);

      let errorMessage = "네이버 지도 API 스크립트를 로드할 수 없습니다.";

      if (!apiKey) {
        errorMessage =
          "네이버 지도 API 키가 설정되지 않았습니다. NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수를 확인해주세요.";
      } else {
        errorMessage = `네이버 지도 API 스크립트를 로드할 수 없습니다.\n\n가능한 원인:\n1. 네트워크 연결 문제\n2. API 키가 잘못되었거나 만료됨\n3. 네이버 클라우드 플랫폼에서 Maps API 서비스가 비활성화됨\n4. 도메인이 등록되지 않음 (localhost 포함)\n\n브라우저 콘솔(F12)에서 자세한 에러를 확인해주세요.`;
      }

      setError(new Error(errorMessage));
      setIsLoading(false);
    };

    document.head.appendChild(script);

    return () => {
      clearTimeout(timeoutId);
      // cleanup: 스크립트는 제거하지 않음 (다른 컴포넌트에서도 사용 가능)
    };
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!scriptLoaded || !mapContainerRef.current || mapInstanceRef.current) {
      return;
    }

    try {
      const naver = window.naver;
      if (!naver || !naver.maps) {
        console.error(
          "네이버 지도 API를 사용할 수 없습니다. window.naver:",
          window.naver,
        );
        setError(new Error("네이버 지도 API를 사용할 수 없습니다."));
        return;
      }

      console.log("네이버 지도 초기화 시작...", {
        scriptLoaded,
        toursCount: tours.length,
      });

      // 중심 좌표 계산
      const mapCenter = center ||
        calculateCenter(tours) || { lat: 37.5665, lng: 126.978 }; // 기본값: 서울

      console.log("지도 중심 좌표:", mapCenter);

      // 지도 인스턴스 생성
      const map = new naver.maps.Map(mapContainerRef.current, {
        center: new naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
        zoom: zoom,
        mapTypeId: naver.maps.MapTypeId.NORMAL,
      });

      // 지도 컨트롤 추가 (controls가 존재하는 경우에만)
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
          console.log("지도 컨트롤 추가 완료");
        } catch (controlError) {
          console.warn("지도 컨트롤 추가 실패 (선택적 기능):", controlError);
          // 컨트롤 추가 실패는 치명적이지 않으므로 계속 진행
        }
      } else {
        console.warn(
          "지도 컨트롤 API를 사용할 수 없습니다. 지도는 계속 작동합니다.",
        );
      }

      mapInstanceRef.current = map;
      console.log("네이버 지도 초기화 완료");
    } catch (err) {
      console.error("지도 초기화 에러:", err);
      setError(
        err instanceof Error ? err : new Error("지도를 초기화할 수 없습니다."),
      );
    }
  }, [scriptLoaded, center, zoom, tours]);

  // 마커 생성 및 업데이트
  useEffect(() => {
    if (!scriptLoaded || !mapInstanceRef.current || tours.length === 0) {
      return;
    }

    const naver = window.naver;
    if (!naver || !naver.maps) {
      return;
    }

    const map = mapInstanceRef.current;

    // 기존 마커 및 인포윈도우 제거
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    infoWindowsRef.current.forEach((infoWindow) => {
      infoWindow.close();
    });
    markersRef.current = [];
    infoWindowsRef.current = [];

    // 새 마커 생성
    console.log(`마커 생성 시작: ${tours.length}개 관광지`);
    let validMarkerCount = 0;

    tours.forEach((tour) => {
      const coord = parseCoordinates(tour.mapx, tour.mapy);
      if (!coord) {
        console.warn(
          `관광지 "${tour.title}"의 좌표를 파싱할 수 없습니다. mapx=${tour.mapx}, mapy=${tour.mapy}`,
        );
        return;
      }

      try {
        // 마커 생성
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(coord.lat, coord.lng),
          map: map,
          title: tour.title,
        });

        // 인포윈도우 HTML 생성 (XSS 방지를 위해 텍스트 이스케이프)
        const escapeHtml = (text: string) => {
          const div = document.createElement("div");
          div.textContent = text;
          return div.innerHTML;
        };

        const infoWindowContent = `
        <div style="padding: 12px; min-width: 200px; max-width: 300px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1a1a1a; line-height: 1.4;">
            ${escapeHtml(tour.title)}
          </h3>
          <p style="margin: 0 0 12px 0; font-size: 14px; color: #666; line-height: 1.5;">
            ${escapeHtml(tour.addr1)}${
          tour.addr2 ? ` ${escapeHtml(tour.addr2)}` : ""
        }
          </p>
          <a 
            href="/places/${tour.contentid}" 
            style="display: inline-block; padding: 8px 16px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 500; transition: background-color 0.2s;"
            onmouseover="this.style.backgroundColor='#0056b3'"
            onmouseout="this.style.backgroundColor='#007bff'"
            onclick="event.stopPropagation();"
          >
            상세보기
          </a>
        </div>
      `;

        // 인포윈도우 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: infoWindowContent,
          maxWidth: 300,
        });

        // 마커 클릭 이벤트
        naver.maps.Event.addListener(marker, "click", () => {
          // 기존 인포윈도우 닫기
          infoWindowsRef.current.forEach((iw) => iw.close());

          // 인포윈도우 열기
          infoWindow.open(map, marker);

          // 콜백 호출
          if (onMarkerClick) {
            onMarkerClick(tour);
          }
        });

        markersRef.current.push(marker);
        infoWindowsRef.current.push(infoWindow);
        validMarkerCount++;
      } catch (markerError) {
        console.error(`마커 생성 실패 (${tour.title}):`, markerError, {
          coord,
          mapx: tour.mapx,
          mapy: tour.mapy,
        });
      }
    });

    console.log(`마커 생성 완료: ${validMarkerCount}/${tours.length}개 성공`);

    // 관광지가 있으면 지도 중심 조정
    if (tours.length > 0) {
      const centerCoord = calculateCenter(tours);
      if (centerCoord) {
        map.setCenter(new naver.maps.LatLng(centerCoord.lat, centerCoord.lng));
        // 관광지 개수에 따라 줌 레벨 조정
        if (tours.length === 1) {
          map.setZoom(15);
        } else if (tours.length < 5) {
          map.setZoom(12);
        } else {
          map.setZoom(10);
        }
      }
    }
  }, [scriptLoaded, tours, onMarkerClick]);

  // 선택된 관광지로 지도 이동 (향후 리스트 연동용)
  useEffect(() => {
    if (!scriptLoaded || !mapInstanceRef.current || !selectedTourId) {
      return;
    }

    const tour = tours.find((t) => t.contentid === selectedTourId);
    if (!tour) {
      return;
    }

    const coord = parseCoordinates(tour.mapx, tour.mapy);
    if (!coord) {
      return;
    }

    const naver = window.naver;
    if (!naver || !naver.maps) {
      return;
    }

    const map = mapInstanceRef.current;
    map.setCenter(new naver.maps.LatLng(coord.lat, coord.lng));
    map.setZoom(15);

    // 해당 마커의 인포윈도우 열기
    const markerIndex = tours.findIndex((t) => t.contentid === selectedTourId);
    if (markerIndex >= 0 && infoWindowsRef.current[markerIndex]) {
      infoWindowsRef.current.forEach((iw) => iw.close());
      infoWindowsRef.current[markerIndex].open(
        map,
        markersRef.current[markerIndex],
      );
    }
  }, [scriptLoaded, selectedTourId, tours]);

  /**
   * 현재 위치로 지도 이동
   */
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError(new Error("이 브라우저는 위치 서비스를 지원하지 않습니다."));
      return;
    }

    setIsGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        if (mapInstanceRef.current) {
          const naver = window.naver;
          if (naver && naver.maps) {
            mapInstanceRef.current.setCenter(
              new naver.maps.LatLng(latitude, longitude),
            );
            mapInstanceRef.current.setZoom(15);
          }
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setError(
          new Error(
            error.message === "User denied Geolocation"
              ? "위치 권한이 거부되었습니다."
              : "위치를 가져올 수 없습니다.",
          ),
        );
        setIsGettingLocation(false);
      },
    );
  };

  // 에러 상태
  if (error) {
    return (
      <div className={cn("w-full", className)} style={{ height: mapHeight }}>
        <ErrorDisplay
          error={error}
          onRetry={() => {
            setError(null);
            setIsLoading(true);
            setScriptLoaded(false);
            // 스크립트 재로드를 위해 페이지 새로고침 권장
            window.location.reload();
          }}
          title="지도를 불러올 수 없습니다"
          retryLabel="다시 시도"
        />
      </div>
    );
  }

  // 로딩 상태
  if (isLoading || !scriptLoaded) {
    return (
      <div
        className={cn(
          "w-full rounded-lg border bg-card",
          !isFullHeight && "h-[400px] md:h-[600px]",
          isFullHeight && "h-full",
          className,
        )}
        style={!isFullHeight ? { height: mapHeight } : undefined}
      >
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  // 지도 렌더링
  return (
    <div className={cn("relative w-full", className)}>
      <div
        ref={mapContainerRef}
        className={cn(
          "w-full rounded-lg border bg-card overflow-hidden",
          // height가 "100%"가 아닐 때만 반응형 높이 적용
          !isFullHeight && "h-[400px] md:h-[600px]",
          // height가 "100%"일 때는 부모 컨테이너 높이에 맞춤
          isFullHeight && "h-full",
        )}
        style={!isFullHeight ? { height: mapHeight } : undefined}
        aria-label="네이버 지도"
      />
      {/* 현재 위치 버튼 */}
      <button
        onClick={handleGetCurrentLocation}
        disabled={isGettingLocation}
        className={cn(
          "absolute bottom-4 right-4 z-10",
          "rounded-full bg-white p-3 shadow-lg",
          "hover:bg-gray-100 transition-colors",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        )}
        aria-label="현재 위치로 이동"
        title="현재 위치로 이동"
      >
        {isGettingLocation ? (
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        ) : (
          <MapPin className="h-5 w-5 text-gray-700" />
        )}
      </button>
    </div>
  );
}
