/**
 * @file components/tour-detail/detail-map.tsx
 * @description 관광지 지도 섹션 컴포넌트
 *
 * 이 컴포넌트는 관광지의 위치를 네이버 지도에 표시하는 섹션입니다.
 * getDetailCommon() API를 사용하여 좌표 정보를 가져오고,
 * 네이버 지도를 통해 해당 관광지 위치를 표시합니다.
 *
 * 주요 기능:
 * - 관광지 위치 지도 표시
 * - 마커 1개 표시
 * - 길찾기 버튼
 * - 좌표 정보 표시 (선택 사항)
 *
 * @dependencies
 * - lib/api/tour-api.ts: getDetailCommon() 함수
 * - lib/types/tour.ts: TourDetail 타입
 * - components/tour-detail/detail-map-client.tsx: 지도 클라이언트 컴포넌트
 * - components/ui/error.tsx: ErrorDisplay 컴포넌트
 *
 * @example
 * ```tsx
 * <DetailMap contentId="125266" />
 * ```
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.4 지도 섹션)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getDetailCommon, TourApiError } from "@/lib/api/tour-api";
import type { TourDetail } from "@/lib/types/tour";
import { ErrorDisplay } from "@/components/ui/error";
import { DetailMapClient } from "@/components/tour-detail/detail-map-client";

export interface DetailMapProps {
  /** 관광지 콘텐츠 ID */
  contentId: string;
}

/**
 * 관광지 지도 섹션 컴포넌트
 * @param {DetailMapProps} props - 컴포넌트 props
 * @returns {JSX.Element} 지도 섹션 요소
 */
export async function DetailMap({ contentId }: DetailMapProps) {
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
    return null;
  }

  // 좌표 정보가 없으면 안내 메시지 표시
  if (!detail.mapx || !detail.mapy) {
    return (
      <section
        className="rounded-lg border bg-card p-4 md:p-6 space-y-4"
        aria-labelledby="map-heading"
      >
        <h2 id="map-heading" className="text-xl md:text-2xl font-bold">
          위치
        </h2>
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <p>위치 정보가 제공되지 않습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="rounded-lg border bg-card p-4 md:p-6 space-y-4"
      aria-labelledby="map-heading"
    >
      {/* 섹션 제목 */}
      <h2 id="map-heading" className="text-xl md:text-2xl font-bold">
        위치
      </h2>

      {/* 지도 (Client Component로 전달) */}
      <DetailMapClient
        mapx={detail.mapx}
        mapy={detail.mapy}
        title={detail.title}
        address={[detail.addr1, detail.addr2].filter(Boolean).join(" ")}
      />
    </section>
  );
}

