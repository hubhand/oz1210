/**
 * @file lib/api/bookmark-api.ts
 * @description 북마크 관련 API 함수들
 *
 * 이 파일은 북마크한 관광지들의 상세 정보를 조회하는 함수들을 제공합니다.
 * 여러 관광지 정보를 병렬로 조회하여 성능을 최적화합니다.
 *
 * 주요 기능:
 * - 북마크한 관광지들의 상세 정보 조회
 * - 병렬 API 호출로 성능 최적화
 * - 부분 실패 허용 (일부 실패해도 나머지 성공한 데이터 반환)
 * - 북마크 메타데이터 유지 (created_at, bookmark_id)
 *
 * @dependencies
 * - lib/api/tour-api.ts: 관광지 정보 조회 함수
 * - lib/types/tour.ts: TourItem 타입 정의
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서 (2.4.5 북마크 기능)
 * @see {@link /docs/TODO.md} - 개발 TODO 리스트
 */

import { getDetailCommon } from "@/lib/api/tour-api";
import type { TourItem } from "@/lib/types/tour";

/**
 * 북마크 정보가 포함된 관광지 항목
 * 북마크의 메타데이터(created_at, bookmark_id)를 포함하여 정렬 기능을 지원합니다.
 */
export interface BookmarkedTourItem extends TourItem {
  /** 북마크 생성 시간 (최신순 정렬용) */
  bookmarkCreatedAt: string;
  /** 북마크 ID (삭제 기능용, 향후 확장) */
  bookmarkId?: string;
}

/**
 * 북마크한 관광지들의 상세 정보 조회
 *
 * 여러 관광지 정보를 병렬로 조회하여 성능을 최적화합니다.
 * 일부 관광지 정보 조회가 실패해도 나머지 성공한 데이터는 반환합니다.
 * 북마크의 메타데이터(created_at, bookmark_id)를 유지하여 정렬 기능을 지원합니다.
 *
 * @param bookmarks 북마크 배열 (content_id, created_at, id 포함)
 * @returns 북마크 정보가 포함된 관광지 상세 정보 배열
 *
 * @example
 * ```ts
 * const bookmarks = [
 *   { content_id: "125266", created_at: "2025-01-01T00:00:00Z", id: "bookmark-uuid" },
 *   { content_id: "125267", created_at: "2025-01-02T00:00:00Z", id: "bookmark-uuid-2" }
 * ];
 * const tours = await getBookmarkedTours(bookmarks);
 * console.log(tours[0].bookmarkCreatedAt); // 북마크 생성 시간
 * ```
 */
export async function getBookmarkedTours(
  bookmarks: Array<{
    content_id: string;
    created_at: string;
    id?: string;
  }>,
): Promise<BookmarkedTourItem[]> {
  // 빈 배열인 경우 즉시 반환
  if (bookmarks.length === 0) {
    return [];
  }

  // 북마크 정보를 Map으로 변환하여 빠른 조회 지원
  const bookmarkMap = new Map<string, { created_at: string; id?: string }>();
  bookmarks.forEach((bookmark) => {
    bookmarkMap.set(bookmark.content_id, {
      created_at: bookmark.created_at,
      id: bookmark.id,
    });
  });

  // 모든 관광지 정보를 병렬로 조회
  const results = await Promise.allSettled(
    bookmarks.map((bookmark) =>
      getDetailCommon({ contentId: bookmark.content_id }).catch((error) => {
        // 에러를 결과로 변환하여 Promise.allSettled가 처리할 수 있도록 함
        return Promise.reject({ contentId: bookmark.content_id, error });
      }),
    ),
  );

  // 성공한 결과만 필터링하여 BookmarkedTourItem 형식으로 변환
  const tours: BookmarkedTourItem[] = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      const detail = result.value;
      const bookmark = bookmarks[index];
      const bookmarkInfo = bookmarkMap.get(detail.contentid);

      // TourDetail을 BookmarkedTourItem 형식으로 변환
      // detailCommon2 응답에는 areacode와 modifiedtime이 없을 수 있으므로
      // 기본값을 설정하거나 빈 문자열로 처리
      const tourItem: BookmarkedTourItem = {
        contentid: detail.contentid,
        contenttypeid: detail.contenttypeid,
        title: detail.title,
        addr1: detail.addr1,
        addr2: detail.addr2,
        areacode: "", // detailCommon2에서는 areacode가 없을 수 있음 (주소에서 추출 가능하지만 복잡하므로 빈 문자열)
        mapx: detail.mapx,
        mapy: detail.mapy,
        firstimage: detail.firstimage,
        firstimage2: detail.firstimage2,
        tel: detail.tel,
        modifiedtime: new Date().toISOString(), // detailCommon2에서는 modifiedtime이 없을 수 있음
        // 북마크 메타데이터 추가
        bookmarkCreatedAt: bookmarkInfo?.created_at || bookmark.created_at,
        bookmarkId: bookmarkInfo?.id || bookmark.id,
      };

      tours.push(tourItem);
    } else {
      // 실패한 경우 에러 로깅
      const bookmark = bookmarks[index];
      const error = result.reason?.error || result.reason || "알 수 없는 에러";

      console.error(
        `북마크 관광지 정보 조회 실패 (contentId: ${bookmark.content_id}):`,
        error,
      );
    }
  });

  // 원본 북마크 순서 유지 (최신순 정렬을 위해)
  // 북마크 배열의 순서대로 정렬 (이미 getUserBookmarks에서 created_at DESC로 정렬됨)
  return tours.sort((a, b) => {
    const indexA = bookmarks.findIndex((bm) => bm.content_id === a.contentid);
    const indexB = bookmarks.findIndex((bm) => bm.content_id === b.contentid);
    return indexA - indexB;
  });
}
