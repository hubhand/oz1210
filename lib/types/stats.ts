/**
 * @file lib/types/stats.ts
 * @description 통계 대시보드 관련 TypeScript 타입 정의
 *
 * 이 파일은 통계 페이지에서 사용하는 데이터 타입을 정의합니다.
 * PRD 2.6 통계 대시보드 요구사항을 기반으로 작성되었습니다.
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6 통계 대시보드)
 */

/**
 * 지역별 통계 정보
 * 각 시/도별 관광지 개수를 나타냅니다.
 */
export interface RegionStats {
  /** 지역코드 (예: "1" = 서울) */
  code: string;
  /** 지역명 (예: "서울") */
  name: string;
  /** 해당 지역의 관광지 개수 */
  count: number;
}

/**
 * 관광 타입별 통계 정보
 * 각 콘텐츠 타입별 관광지 개수와 비율을 나타냅니다.
 */
export interface TypeStats {
  /** 콘텐츠타입ID (12: 관광지, 14: 문화시설 등) */
  contentTypeId: string;
  /** 타입명 (예: "관광지", "문화시설") */
  typeName: string;
  /** 해당 타입의 관광지 개수 */
  count: number;
  /** 전체 대비 비율 (0-100) */
  percentage: number;
}

/**
 * 통계 요약 정보
 * 통계 대시보드 상단에 표시되는 요약 카드 데이터
 */
export interface StatsSummary {
  /** 전체 관광지 수 */
  totalCount: number;
  /** 가장 많은 관광지가 있는 지역 Top 3 */
  topRegions: Array<{
    /** 지역명 */
    name: string;
    /** 지역코드 */
    code: string;
    /** 관광지 개수 */
    count: number;
  }>;
  /** 가장 많은 관광 타입 Top 3 */
  topTypes: Array<{
    /** 타입명 */
    typeName: string;
    /** 콘텐츠타입ID */
    contentTypeId: string;
    /** 관광지 개수 */
    count: number;
  }>;
  /** 마지막 업데이트 시간 (ISO 8601 형식) */
  lastUpdated: string;
}

/**
 * 통계 데이터 응답 타입
 * API에서 받아온 통계 데이터를 담는 타입
 */
export interface StatsData {
  /** 지역별 통계 배열 */
  regionStats: RegionStats[];
  /** 타입별 통계 배열 */
  typeStats: TypeStats[];
  /** 통계 요약 */
  summary: StatsSummary;
}

/**
 * 콘텐츠 타입 ID와 이름 매핑
 * PRD 4.4 참고
 */
export const CONTENT_TYPE_MAP: Record<string, string> = {
  "12": "관광지",
  "14": "문화시설",
  "15": "축제/행사",
  "25": "여행코스",
  "28": "레포츠",
  "32": "숙박",
  "38": "쇼핑",
  "39": "음식점",
} as const;

/**
 * 콘텐츠 타입 ID 배열
 */
export const CONTENT_TYPE_IDS = Object.keys(CONTENT_TYPE_MAP) as Array<
  keyof typeof CONTENT_TYPE_MAP
>;

/**
 * 콘텐츠 타입 ID로 타입명 가져오기
 * @param contentTypeId 콘텐츠 타입 ID
 * @returns 타입명 또는 "알 수 없음"
 */
export function getContentTypeName(contentTypeId: string): string {
  return CONTENT_TYPE_MAP[contentTypeId] || "알 수 없음";
}
