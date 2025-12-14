/**
 * @file hooks/use-infinite-scroll.ts
 * @description 무한 스크롤 훅
 *
 * 이 훅은 Intersection Observer API를 사용하여 무한 스크롤 기능을 제공합니다.
 * 하단 sentinel 요소가 뷰포트에 들어오면 자동으로 다음 페이지 데이터를 로드합니다.
 *
 * 주요 기능:
 * - Intersection Observer로 하단 감지
 * - 페이지 번호 자동 증가
 * - 로딩 상태 관리
 * - 더 이상 데이터 없음 판단 (hasMore)
 * - 에러 처리
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TourItem } from "@/lib/types/tour";

export interface InfiniteScrollParams {
  /** 지역코드 */
  areaCode?: string;
  /** 콘텐츠타입ID */
  contentTypeId?: string;
  /** 정렬 옵션 */
  arrange?: string;
  /** 검색 키워드 */
  keyword?: string;
  /** 반려동물 동반 가능 여부 */
  petAllowed?: boolean;
  /** 반려동물 크기 */
  petSize?: "small" | "medium" | "large";
}

export interface InfiniteScrollResult {
  /** 현재 로드된 관광지 목록 */
  tours: TourItem[];
  /** 로딩 중 여부 */
  isLoading: boolean;
  /** 더 불러올 데이터가 있는지 여부 */
  hasMore: boolean;
  /** 에러 상태 */
  error: Error | null;
  /** 하단 sentinel 요소에 연결할 ref */
  sentinelRef: (node: HTMLElement | null) => void;
  /** 수동으로 다음 페이지 로드 */
  loadMore: () => void;
  /** 초기화 (필터 변경 시) */
  reset: () => void;
}

/**
 * 무한 스크롤 훅
 * @param initialTours 초기 관광지 목록
 * @param initialTotalCount 초기 전체 개수
 * @param params 필터/검색 파라미터
 * @returns 무한 스크롤 관련 상태 및 함수
 */
export function useInfiniteScroll(
  initialTours: TourItem[],
  initialTotalCount: number,
  params: InfiniteScrollParams,
): InfiniteScrollResult {
  const [tours, setTours] = useState<TourItem[]>(initialTours);
  const [pageNo, setPageNo] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialTours.length < initialTotalCount,
  );
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(initialTotalCount);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelElementRef = useRef<HTMLElement | null>(null);

  // 필터/검색 파라미터가 변경되면 초기화
  useEffect(() => {
    setTours(initialTours);
    setPageNo(1);
    setHasMore(initialTours.length < initialTotalCount);
    setTotalCount(initialTotalCount);
    setError(null);
  }, [
    initialTours,
    initialTotalCount,
    params.areaCode,
    params.contentTypeId,
    params.arrange,
    params.keyword,
    params.petAllowed,
    params.petSize,
  ]);

  /**
   * 다음 페이지 데이터 로드
   */
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    setError(null);

    try {
      const nextPage = pageNo + 1;
      const queryParams = new URLSearchParams({
        pageNo: nextPage.toString(),
        numOfRows: "12",
      });

      if (params.areaCode) {
        queryParams.append("areaCode", params.areaCode);
      }
      if (params.contentTypeId) {
        queryParams.append("contentTypeId", params.contentTypeId);
      }
      if (params.arrange) {
        queryParams.append("arrange", params.arrange);
      }
      if (params.keyword) {
        queryParams.append("keyword", params.keyword);
      }
      if (params.petAllowed) {
        queryParams.append("petAllowed", "true");
      }
      if (params.petSize) {
        queryParams.append("petSize", params.petSize);
      }

      const response = await fetch(`/api/tours?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      const data = await response.json();

      // 에러 응답 처리
      if (!data.success || data.error) {
        const errorMessage =
          data.error || "데이터를 불러오는 중 오류가 발생했습니다.";
        const error = new Error(errorMessage);
        // 네트워크 에러 타입 구분
        if (data.errorType === "NetworkError") {
          error.name = "NetworkError";
        }
        throw error;
      }

      const newTours = data.tours || [];
      const newTotalCount = data.totalCount || 0;

      setTours((prev) => {
        const updatedTours = [...prev, ...newTours];
        // 더 이상 데이터가 없으면 hasMore를 false로 설정
        setHasMore(updatedTours.length < newTotalCount && newTours.length > 0);
        return updatedTours;
      });
      setPageNo(nextPage);
      setTotalCount(newTotalCount);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("알 수 없는 에러"));
      console.error("무한 스크롤 데이터 로드 실패:", err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, pageNo, params, tours.length]);

  /**
   * Intersection Observer 설정
   */
  useEffect(() => {
    if (!sentinelElementRef.current) return;

    // 기존 observer 정리
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 새로운 observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // 미리 로드
      },
    );

    observerRef.current.observe(sentinelElementRef.current);

    // cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, isLoading, loadMore]);

  /**
   * Sentinel 요소 ref 설정
   */
  const sentinelRef = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    sentinelElementRef.current = node;

    if (node && observerRef.current) {
      observerRef.current.observe(node);
    }
  }, []);

  /**
   * 초기화 함수
   */
  const reset = useCallback(() => {
    setTours(initialTours);
    setPageNo(1);
    setHasMore(initialTours.length < initialTotalCount);
    setTotalCount(initialTotalCount);
    setError(null);
  }, [initialTours, initialTotalCount]);

  return {
    tours,
    isLoading,
    hasMore,
    error,
    sentinelRef,
    loadMore,
    reset,
  };
}
