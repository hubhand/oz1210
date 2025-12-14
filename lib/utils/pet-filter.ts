/**
 * @file lib/utils/pet-filter.ts
 * @description 반려동물 필터링 유틸리티 함수
 *
 * 이 파일은 반려동물 동반 가능 필터링을 위한 유틸리티 함수를 제공합니다.
 * 관광지 목록에 반려동물 정보를 병렬로 조회하고 필터링하는 기능을 포함합니다.
 *
 * 주요 기능:
 * - 관광지 목록에 반려동물 정보 병렬 조회
 * - 반려동물 필터 조건에 맞는 관광지만 필터링
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.5 반려동물 동반 여행)
 */

import { getDetailPetTour } from "@/lib/api/tour-api";
import type { TourItem, PetTourInfo, PetFilterParams } from "@/lib/types/tour";

/**
 * 관광지 목록에 반려동물 정보를 병렬로 조회
 * @param tours 관광지 목록
 * @returns 반려동물 정보가 추가된 관광지 목록
 *
 * @example
 * ```ts
 * const toursWithPetInfo = await fetchPetInfoForTours(tours);
 * // 각 tour에 petInfo 필드가 추가됨 (있을 경우)
 * ```
 */
export async function fetchPetInfoForTours(
  tours: TourItem[],
): Promise<TourItem[]> {
  if (tours.length === 0) {
    return tours;
  }

  // 각 관광지의 반려동물 정보를 병렬로 조회
  const petInfoPromises = tours.map(async (tour) => {
    try {
      const petInfo = await getDetailPetTour({ contentId: tour.contentid });
      return { tour, petInfo };
    } catch (error) {
      // 개별 관광지의 반려동물 정보 조회 실패 시 해당 관광지는 petInfo 없이 반환
      console.warn(
        `반려동물 정보 조회 실패 (contentId: ${tour.contentid}):`,
        error,
      );
      return { tour, petInfo: null };
    }
  });

  // 모든 요청이 완료될 때까지 대기
  const results = await Promise.all(petInfoPromises);

  // 반려동물 정보를 관광지에 추가
  return results.map(({ tour, petInfo }) => ({
    ...tour,
    petInfo: petInfo || undefined,
  }));
}

/**
 * 반려동물 필터 조건에 맞는 관광지만 필터링
 * @param tours 관광지 목록 (petInfo 포함 가능)
 * @param filter 반려동물 필터 조건
 * @returns 필터링된 관광지 목록
 *
 * @example
 * ```ts
 * // 반려동물 동반 가능한 관광지만 필터링
 * const filtered = filterToursByPetInfo(tours, { petAllowed: true });
 *
 * // 소형견 가능한 관광지만 필터링
 * const smallPetTours = filterToursByPetInfo(tours, {
 *   petAllowed: true,
 *   petSize: "small"
 * });
 * ```
 */
export function filterToursByPetInfo(
  tours: TourItem[],
  filter: PetFilterParams,
): TourItem[] {
  // 필터 조건이 없으면 모든 관광지 반환
  if (!filter.petAllowed && !filter.petSize) {
    return tours;
  }

  return tours.filter((tour) => {
    const petInfo = tour.petInfo;

    // 반려동물 동반 가능 필터
    if (filter.petAllowed) {
      // 반려동물 정보가 없거나 chkpetleash가 "Y"가 아니면 제외
      if (!petInfo || petInfo.chkpetleash !== "Y") {
        return false;
      }
    }

    // 반려동물 크기 필터
    if (filter.petSize && petInfo?.chkpetsize) {
      const petSize = petInfo.chkpetsize.toLowerCase();

      // 크기 매핑 (API 응답 형식에 따라 다를 수 있음)
      const sizeMap: Record<string, string[]> = {
        small: ["소형", "소", "small"],
        medium: ["중형", "중", "medium"],
        large: ["대형", "대", "large"],
      };

      const allowedSizes = sizeMap[filter.petSize] || [];
      const matchesSize = allowedSizes.some((size) =>
        petSize.includes(size.toLowerCase()),
      );

      // 크기가 일치하지 않으면 제외
      if (!matchesSize) {
        return false;
      }
    }

    return true;
  });
}

/**
 * 반려동물 크기 라벨 가져오기
 * @param petInfo 반려동물 정보
 * @returns 크기 라벨 (예: "소형견 OK", "대형견 가능")
 */
export function getPetSizeLabel(
  petInfo: PetTourInfo | undefined,
): string | null {
  if (!petInfo || !petInfo.chkpetsize) {
    return null;
  }

  const size = petInfo.chkpetsize.toLowerCase();

  // 크기 매핑
  if (size.includes("소") || size.includes("small")) {
    return "소형견 OK";
  }
  if (size.includes("중") || size.includes("medium")) {
    return "중형견 OK";
  }
  if (size.includes("대") || size.includes("large")) {
    return "대형견 OK";
  }

  // 매핑되지 않은 경우 원본 값 반환
  return petInfo.chkpetsize;
}
