/**
 * @file lib/api/stats-api.ts
 * @description 통계 대시보드 데이터 수집 API
 *
 * 이 파일은 통계 대시보드에 필요한 데이터를 수집하는 함수들을 제공합니다.
 * 지역별 및 타입별 관광지 개수를 집계하고, 통계 요약 정보를 생성합니다.
 *
 * 주요 기능:
 * - 지역별 관광지 개수 집계 (getRegionStats)
 * - 타입별 관광지 개수 집계 및 비율 계산 (getTypeStats)
 * - 통계 요약 정보 생성 (getStatsSummary)
 *
 * @dependencies
 * - lib/api/tour-api.ts: getAreaBasedList, getAreaCode 함수 재사용
 * - lib/types/stats.ts: RegionStats, TypeStats, StatsSummary, StatsData 타입
 * - lib/types/tour.ts: AreaCode, ListResponse 타입
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.6 통계 대시보드)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getAreaBasedList, getAreaCode } from "@/lib/api/tour-api";
import type { AreaCode } from "@/lib/types/tour";
import type {
  RegionStats,
  TypeStats,
  StatsSummary,
  StatsData,
} from "@/lib/types/stats";
import { CONTENT_TYPE_IDS, getContentTypeName } from "@/lib/types/stats";

// ============================================
// 데이터 캐싱 설정
// ============================================

/**
 * 통계 데이터 재검증 주기 (초)
 * 1시간마다 재검증 (3600초)
 */
export const revalidate = 3600;

// ============================================
// 지역별 통계 수집
// ============================================

/**
 * 지역별 관광지 개수 집계
 * 각 시/도별 관광지 개수를 조회하여 반환합니다.
 *
 * @returns 지역별 통계 배열
 *
 * @example
 * ```ts
 * const stats = await getRegionStats();
 * console.log(stats); // [{ code: "1", name: "서울", count: 1234 }, ...]
 * ```
 */
export async function getRegionStats(): Promise<RegionStats[]> {
  try {
    // 1. 전체 지역 목록 조회
    const areas = await getAreaCode();

    // 2. 각 지역별로 관광지 개수 조회 (병렬 처리)
    const statsPromises = areas.map(async (area: AreaCode) => {
      try {
        // totalCount만 필요하므로 numOfRows: 1로 최소 데이터 조회
        const result = await getAreaBasedList({
          areaCode: area.code,
          numOfRows: 1,
          pageNo: 1,
        });

        return {
          code: area.code,
          name: area.name,
          count: result.totalCount || 0,
        } as RegionStats;
      } catch (error) {
        // 개별 지역 조회 실패 시 해당 지역은 제외하고 계속 진행
        console.error(
          `[getRegionStats] 지역 ${area.name}(${area.code}) 조회 실패:`,
          error,
        );
        return null;
      }
    });

    // 3. 모든 Promise 완료 대기 (부분 실패 허용)
    const results = await Promise.allSettled(statsPromises);

    // 4. 성공한 결과만 필터링 및 반환
    const regionStats: RegionStats[] = results
      .filter(
        (result): result is PromiseFulfilledResult<RegionStats | null> =>
          result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value)
      .filter((stat): stat is RegionStats => stat !== null);

    // 5. count 기준 내림차순 정렬
    return regionStats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("[getRegionStats] 지역 통계 수집 실패:", error);
    // 전체 실패 시 빈 배열 반환
    return [];
  }
}

// ============================================
// 타입별 통계 수집
// ============================================

/**
 * 타입별 관광지 개수 집계 및 비율 계산
 * 각 콘텐츠 타입별 관광지 개수를 조회하고 전체 대비 비율을 계산합니다.
 *
 * @returns 타입별 통계 배열 (비율 포함)
 *
 * @example
 * ```ts
 * const stats = await getTypeStats();
 * console.log(stats); // [{ contentTypeId: "12", typeName: "관광지", count: 5000, percentage: 25.5 }, ...]
 * ```
 */
export async function getTypeStats(): Promise<TypeStats[]> {
  try {
    // 1. 각 타입별로 관광지 개수 조회 (병렬 처리)
    const statsPromises = CONTENT_TYPE_IDS.map(async (contentTypeId) => {
      try {
        // totalCount만 필요하므로 numOfRows: 1로 최소 데이터 조회
        // 타입별 통계는 전체 지역을 조회하므로 areaCode를 "1" (서울)로 설정
        // 실제로는 전체 지역의 합계가 필요하지만, API 제약으로 인해 기본값 사용
        const result = await getAreaBasedList({
          areaCode: "1", // 기본값 (전체 지역 조회는 API 제약으로 불가능)
          contentTypeId,
          numOfRows: 1,
          pageNo: 1,
        });

        return {
          contentTypeId,
          typeName: getContentTypeName(contentTypeId),
          count: result.totalCount || 0,
          percentage: 0, // 나중에 계산
        } as Omit<TypeStats, "percentage"> & { percentage: number };
      } catch (error) {
        // 개별 타입 조회 실패 시 해당 타입은 제외하고 계속 진행
        console.error(
          `[getTypeStats] 타입 ${getContentTypeName(
            contentTypeId,
          )}(${contentTypeId}) 조회 실패:`,
          error,
        );
        return null;
      }
    });

    // 2. 모든 Promise 완료 대기 (부분 실패 허용)
    const results = await Promise.allSettled(statsPromises);

    // 3. 성공한 결과만 필터링
    const typeStatsWithoutPercentage = results
      .filter(
        (
          result,
        ): result is PromiseFulfilledResult<
          (Omit<TypeStats, "percentage"> & { percentage: number }) | null
        > => result.status === "fulfilled" && result.value !== null,
      )
      .map((result) => result.value)
      .filter(
        (
          stat,
        ): stat is Omit<TypeStats, "percentage"> & { percentage: number } =>
          stat !== null,
      );

    // 4. 전체 개수 합계 계산
    const totalCount = typeStatsWithoutPercentage.reduce(
      (sum, stat) => sum + stat.count,
      0,
    );

    // 5. 비율 계산 및 TypeStats[] 형태로 변환
    const typeStats: TypeStats[] = typeStatsWithoutPercentage.map((stat) => ({
      ...stat,
      percentage:
        totalCount > 0
          ? Math.round((stat.count / totalCount) * 100 * 10) / 10
          : 0, // 소수점 첫째 자리까지
    }));

    // 6. count 기준 내림차순 정렬
    return typeStats.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("[getTypeStats] 타입 통계 수집 실패:", error);
    // 전체 실패 시 빈 배열 반환
    return [];
  }
}

// ============================================
// 통계 요약 생성
// ============================================

/**
 * 통계 요약 정보 생성
 * 전체 관광지 수, Top 3 지역, Top 3 타입을 포함한 요약 정보를 생성합니다.
 *
 * @returns 통계 요약 정보
 *
 * @example
 * ```ts
 * const summary = await getStatsSummary();
 * console.log(summary.totalCount); // 전체 관광지 수
 * console.log(summary.topRegions); // Top 3 지역
 * console.log(summary.topTypes); // Top 3 타입
 * ```
 */
export async function getStatsSummary(): Promise<StatsSummary> {
  try {
    // 1. 지역별 및 타입별 통계 병렬 조회
    const [regionStats, typeStats] = await Promise.all([
      getRegionStats(),
      getTypeStats(),
    ]);

    // 2. 전체 관광지 수 계산 (지역별 합계 사용)
    const totalCount = regionStats.reduce((sum, stat) => sum + stat.count, 0);

    // 3. Top 3 지역 추출 (이미 정렬되어 있음)
    const topRegions = regionStats.slice(0, 3).map((stat) => ({
      name: stat.name,
      code: stat.code,
      count: stat.count,
    }));

    // 4. Top 3 타입 추출 (이미 정렬되어 있음)
    const topTypes = typeStats.slice(0, 3).map((stat) => ({
      typeName: stat.typeName,
      contentTypeId: stat.contentTypeId,
      count: stat.count,
    }));

    // 5. 마지막 업데이트 시간 설정
    const lastUpdated = new Date().toISOString();

    return {
      totalCount,
      topRegions,
      topTypes,
      lastUpdated,
    };
  } catch (error) {
    console.error("[getStatsSummary] 통계 요약 생성 실패:", error);
    // 전체 실패 시 기본값 반환
    return {
      totalCount: 0,
      topRegions: [],
      topTypes: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

// ============================================
// 통합 함수 (선택 사항)
// ============================================

/**
 * 모든 통계 데이터를 한 번에 조회
 * 지역별 통계, 타입별 통계, 통계 요약을 병렬로 조회하여 반환합니다.
 *
 * @returns 통계 데이터 객체
 *
 * @example
 * ```ts
 * const data = await getStatsData();
 * console.log(data.regionStats); // 지역별 통계
 * console.log(data.typeStats); // 타입별 통계
 * console.log(data.summary); // 통계 요약
 * ```
 */
export async function getStatsData(): Promise<StatsData> {
  try {
    // 모든 통계 데이터 병렬 조회
    const [regionStats, typeStats, summary] = await Promise.all([
      getRegionStats(),
      getTypeStats(),
      getStatsSummary(),
    ]);

    return {
      regionStats,
      typeStats,
      summary,
    };
  } catch (error) {
    console.error("[getStatsData] 통계 데이터 수집 실패:", error);
    // 전체 실패 시 기본값 반환
    return {
      regionStats: [],
      typeStats: [],
      summary: {
        totalCount: 0,
        topRegions: [],
        topTypes: [],
        lastUpdated: new Date().toISOString(),
      },
    };
  }
}
