/**
 * @file app/api/tours/route.ts
 * @description 관광지 목록 API 라우트 (무한 스크롤용)
 *
 * 이 API 라우트는 클라이언트에서 무한 스크롤로 추가 데이터를 로드할 때 사용됩니다.
 * 필터/검색 파라미터를 받아서 한국관광공사 API를 호출하고 결과를 반환합니다.
 *
 * 주요 기능:
 * - 지역 기반 목록 조회 (getAreaBasedList)
 * - 키워드 검색 (searchKeyword)
 * - 반려동물 필터 처리
 * - 페이지네이션 지원
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getAreaBasedList,
  searchKeyword,
  TourApiError,
} from "@/lib/api/tour-api";
import {
  fetchPetInfoForTours,
  filterToursByPetInfo,
} from "@/lib/utils/pet-filter";

/**
 * GET /api/tours
 * 관광지 목록 조회 (무한 스크롤용)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const keyword = searchParams.get("keyword") || undefined;
    const areaCode = searchParams.get("areaCode") || "1"; // 기본값: 서울
    const contentTypeId = searchParams.get("contentTypeId") || undefined;
    const arrange = searchParams.get("arrange") || undefined;
    const pageNo = parseInt(searchParams.get("pageNo") || "1", 10);
    const numOfRows = parseInt(searchParams.get("numOfRows") || "12", 10);
    const petAllowed = searchParams.get("petAllowed") === "true";
    const petSize = searchParams.get("petSize") as
      | "small"
      | "medium"
      | "large"
      | undefined;

    let tours = [];
    let totalCount = 0;

    // 검색 키워드가 있으면 검색 API 호출, 없으면 지역 기반 목록 API 호출
    if (keyword && keyword.trim()) {
      const result = await searchKeyword({
        keyword: keyword.trim(),
        areaCode,
        contentTypeId,
        arrange: arrange as
          | "A"
          | "B"
          | "C"
          | "D"
          | "E"
          | "O"
          | "Q"
          | "R"
          | "S"
          | undefined,
        numOfRows,
        pageNo,
      });
      tours = result.items || [];
      totalCount = result.totalCount || 0;
    } else {
      const result = await getAreaBasedList({
        areaCode,
        contentTypeId,
        arrange: arrange as
          | "A"
          | "B"
          | "C"
          | "D"
          | "E"
          | "O"
          | "Q"
          | "R"
          | "S"
          | undefined,
        numOfRows,
        pageNo,
      });
      tours = result.items || [];
      totalCount = result.totalCount || 0;
    }

    // 반려동물 필터가 활성화된 경우 반려동물 정보 조회 및 필터링
    if (petAllowed) {
      // 반려동물 정보 병렬 조회
      tours = await fetchPetInfoForTours(tours);

      // 반려동물 필터 조건에 맞는 관광지만 필터링
      tours = filterToursByPetInfo(tours, {
        petAllowed: true,
        petSize: petSize,
      });
    }

    return NextResponse.json({
      tours,
      totalCount,
      pageNo,
      numOfRows,
      hasMore: tours.length < totalCount,
      success: true,
    });
  } catch (error) {
    // 개발 환경에서만 상세 에러 로깅
    if (process.env.NODE_ENV === "development") {
      console.error("API 라우트 에러:", error);
    }

    // 에러 응답 형식 통일
    if (error instanceof TourApiError) {
      // 프로덕션 환경에서는 사용자 친화적 메시지로 변환
      const userFriendlyMessage =
        process.env.NODE_ENV === "development"
          ? error.message
          : error.statusCode === 408
          ? "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
          : error.statusCode === 404
          ? "요청한 데이터를 찾을 수 없습니다."
          : "관광지 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

      return NextResponse.json(
        {
          success: false,
          error: userFriendlyMessage,
          statusCode: error.statusCode,
          errorCode: error.errorCode,
          tours: [],
          totalCount: 0,
        },
        { status: error.statusCode || 500 },
      );
    }

    if (error instanceof Error) {
      // 네트워크 에러와 일반 에러 구분
      const isNetworkError =
        error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("Network");

      return NextResponse.json(
        {
          success: false,
          error: isNetworkError
            ? "네트워크 연결을 확인해주세요."
            : process.env.NODE_ENV === "development"
            ? error.message
            : "관광지 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
          errorType: isNetworkError ? "NetworkError" : "UnknownError",
          tours: [],
          totalCount: 0,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error:
          process.env.NODE_ENV === "development"
            ? "알 수 없는 에러가 발생했습니다."
            : "관광지 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        errorType: "UnknownError",
        tours: [],
        totalCount: 0,
      },
      { status: 500 },
    );
  }
}
