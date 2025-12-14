/**
 * @file lib/api/tour-api.ts
 * @description 한국관광공사 공공 API(KorService2) 클라이언트
 *
 * 이 파일은 한국관광공사 공공 API를 호출하는 함수들을 제공합니다.
 * 모든 API 호출은 타입 안전하며, 에러 처리 및 재시도 로직이 포함되어 있습니다.
 *
 * 주요 기능:
 * - 지역코드 조회
 * - 지역 기반 관광지 목록 조회
 * - 키워드 검색
 * - 관광지 상세 정보 조회 (공통, 소개, 이미지, 반려동물)
 *
 * @dependencies
 * - 환경변수: NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY
 *
 * @see {@link /docs/PRD.md} - API 명세 참고
 * @see {@link /lib/types/tour.ts} - 타입 정의
 */

import type {
  TourItem,
  TourDetail,
  TourIntro,
  TourImage,
  PetTourInfo,
  AreaCode,
  ApiResponse,
  AreaCodeParams,
  AreaBasedListParams,
  SearchKeywordParams,
  DetailCommonParams,
  DetailIntroParams,
  DetailImageParams,
  DetailPetTourParams,
  ListResponse,
} from "@/lib/types/tour";

// ============================================
// 상수 정의
// ============================================

/** API Base URL */
const BASE_URL = "https://apis.data.go.kr/B551011/KorService2";

/** 기본 타임아웃 (밀리초) */
const DEFAULT_TIMEOUT = 10000;

/** 최대 재시도 횟수 */
const MAX_RETRIES = 3;

/** 재시도 지연 시간 (밀리초) */
const RETRY_DELAYS = [1000, 2000, 4000]; // 지수 백오프

// ============================================
// 에러 클래스
// ============================================

/**
 * 한국관광공사 API 에러 클래스
 */
export class TourApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public errorCode?: string,
    public originalError?: unknown,
  ) {
    super(message);
    this.name = "TourApiError";
    Object.setPrototypeOf(this, TourApiError.prototype);
  }
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 환경변수에서 API 키 가져오기
 * @returns API 키 또는 null
 */
function getApiKey(): string {
  const clientKey = process.env.NEXT_PUBLIC_TOUR_API_KEY;
  const serverKey = process.env.TOUR_API_KEY;

  if (clientKey) {
    return clientKey;
  }

  if (serverKey) {
    return serverKey;
  }

  throw new TourApiError(
    "API 키가 설정되지 않았습니다. NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY 환경변수를 설정해주세요.",
  );
}

/**
 * 공통 파라미터 생성
 * @returns 공통 파라미터 객체
 */
function createCommonParams(): Record<string, string> {
  return {
    serviceKey: getApiKey(),
    MobileOS: "ETC",
    MobileApp: "MyTrip",
    _type: "json",
  };
}

/**
 * URL 쿼리 파라미터 생성
 * @param params 파라미터 객체
 * @returns URL 쿼리 문자열
 */
function buildQueryString(
  params: Record<string, string | number | undefined>,
): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * API URL 빌드
 * @param endpoint API 엔드포인트
 * @param params 파라미터 객체
 * @returns 완전한 API URL
 */
function buildApiUrl(
  endpoint: string,
  params: Record<string, string | number | undefined>,
): string {
  const commonParams = createCommonParams();
  const allParams = { ...commonParams, ...params };
  const queryString = buildQueryString(allParams);
  return `${BASE_URL}${endpoint}?${queryString}`;
}

/**
 * 지수 백오프를 사용한 재시도 함수
 * @param fn 실행할 함수
 * @param retries 남은 재시도 횟수
 * @param delayIndex 현재 지연 시간 인덱스
 * @returns 함수 실행 결과
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delayIndex: number = 0,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    // 재시도 불가능한 에러는 즉시 throw
    if (error instanceof TourApiError) {
      // 4xx 에러는 재시도하지 않음
      if (
        error.statusCode &&
        error.statusCode >= 400 &&
        error.statusCode < 500
      ) {
        throw error;
      }
    }

    // 재시도 횟수 초과
    if (retries <= 0) {
      throw error;
    }

    // 지연 후 재시도
    const delay =
      RETRY_DELAYS[delayIndex] || RETRY_DELAYS[RETRY_DELAYS.length - 1];
    await new Promise((resolve) => setTimeout(resolve, delay));

    return retryWithBackoff(fn, retries - 1, delayIndex + 1);
  }
}

/**
 * API 호출 및 응답 파싱
 * @param url API URL
 * @returns 파싱된 응답 데이터
 */
async function fetchApi<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new TourApiError(
        `API 요청 실패: ${response.status} ${response.statusText}`,
        response.status,
      );
    }

    // 응답 텍스트를 먼저 가져와서 구조 확인
    const responseText = await response.text();
    let data: ApiResponse<T>;

    try {
      data = JSON.parse(responseText) as ApiResponse<T>;
    } catch {
      // JSON 파싱 실패 시
      throw new TourApiError(
        `API 응답 파싱 실패: ${responseText.substring(0, 200)}`,
        response.status,
      );
    }

    // data가 null이거나 undefined인 경우
    if (!data) {
      throw new TourApiError(`API 응답이 비어있습니다.`, response.status);
    }

    // API 응답 에러 체크
    const resultCode = data.response?.header?.resultCode;
    if (resultCode && resultCode !== "0000") {
      // 에러 메시지 추출 (여러 가능한 위치에서 시도)
      const errorMsg =
        data.response?.header?.resultMsg ||
        (data as any).errorMessage ||
        (data as any).message ||
        `에러 코드: ${resultCode}`;

      // 개발 환경에서 상세 로깅
      if (process.env.NODE_ENV === "development") {
        console.error("API 에러 상세 정보:", {
          url,
          statusCode: response.status,
          resultCode: resultCode,
          resultMsg: data.response?.header?.resultMsg,
          responseStructure: Object.keys(data),
          fullResponse: responseText.substring(0, 1000), // 처음 1000자만
        });
      }

      throw new TourApiError(
        `API 에러: ${errorMsg}`,
        response.status,
        resultCode,
      );
    }

    // response 구조가 없는 경우 (예상치 못한 응답 형식)
    if (!data.response) {
      // 개발 환경에서만 로깅
      if (process.env.NODE_ENV === "development") {
        console.error("예상치 못한 API 응답 구조:", {
          url,
          statusCode: response.status,
          responseKeys: Object.keys(data),
          responseSample: responseText.substring(0, 500),
        });
      }
      throw new TourApiError(
        `예상치 못한 API 응답 구조입니다.`,
        response.status,
      );
    }

    // 응답 데이터 추출
    const body = data.response?.body;
    if (!body) {
      throw new TourApiError("응답 데이터가 없습니다.");
    }

    // items.item 처리 (배열 또는 단일 객체)
    const items = body.items?.item;
    if (items === undefined || items === null) {
      // 빈 결과
      return [] as unknown as T;
    }

    // 배열로 정규화
    const normalizedItems = Array.isArray(items) ? items : [items];

    return normalizedItems as T;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof TourApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new TourApiError("API 요청 시간 초과", 408, undefined, error);
      }
      throw new TourApiError(
        `네트워크 에러: ${error.message}`,
        undefined,
        undefined,
        error,
      );
    }

    throw new TourApiError(
      "알 수 없는 에러가 발생했습니다.",
      undefined,
      undefined,
      error,
    );
  }
}

// ============================================
// API 호출 함수들
// ============================================

/**
 * 지역코드 조회
 * @param params 지역코드 조회 파라미터 (선택)
 * @returns 지역 코드 배열
 *
 * @example
 * ```ts
 * const areas = await getAreaCode();
 * const seoulAreas = await getAreaCode({ areaCode: "1" });
 * ```
 */
export async function getAreaCode(
  params?: AreaCodeParams,
): Promise<AreaCode[]> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string | undefined> = {};
    if (params?.areaCode) {
      apiParams.areaCode = params.areaCode;
    }
    if (params?.sigunguCode) {
      apiParams.sigunguCode = params.sigunguCode;
    }

    const url = buildApiUrl("/areaCode2", apiParams);
    return fetchApi<AreaCode[]>(url);
  });
}

/**
 * 지역 기반 관광지 목록 조회
 * @param params 지역 기반 목록 조회 파라미터
 * @returns 관광지 목록 및 전체 개수
 *
 * @example
 * ```ts
 * const result = await getAreaBasedList({
 *   areaCode: "1", // 서울
 *   contentTypeId: "12", // 관광지
 *   numOfRows: 10,
 *   pageNo: 1
 * });
 * console.log(result.items); // TourItem[]
 * console.log(result.totalCount); // 전체 개수
 * ```
 */
export async function getAreaBasedList(
  params: AreaBasedListParams,
): Promise<ListResponse<TourItem>> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string | number | undefined> = {
      areaCode: params.areaCode,
      contentTypeId: params.contentTypeId,
      sigunguCode: params.sigunguCode,
      numOfRows: params.numOfRows || 10,
      pageNo: params.pageNo || 1,
      arrange: params.arrange,
    };

    const url = buildApiUrl("/areaBasedList2", apiParams);

    // 전체 API 응답을 가져와서 totalCount 추출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new TourApiError(
          `API 요청 실패: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      const data: ApiResponse<TourItem[]> = await response.json();

      // API 응답 에러 체크
      if (data.response?.header?.resultCode !== "0000") {
        const errorMsg = data.response?.header?.resultMsg || "알 수 없는 에러";
        throw new TourApiError(
          `API 에러: ${errorMsg}`,
          response.status,
          data.response?.header?.resultCode,
        );
      }

      // 응답 데이터 추출
      const body = data.response?.body;
      if (!body) {
        throw new TourApiError("응답 데이터가 없습니다.");
      }

      // items.item 처리 (배열 또는 단일 객체)
      const items = body.items?.item;
      let normalizedItems: TourItem[] = [];
      if (items !== undefined && items !== null) {
        if (Array.isArray(items)) {
          // 타입 단언: API 응답에서 배열로 오는 경우
          normalizedItems = items as TourItem[];
        } else {
          // 단일 객체인 경우 배열로 변환
          normalizedItems = [items as TourItem];
        }
      }

      // totalCount 추출 (API 응답에서)
      const totalCount = body.totalCount || normalizedItems.length;

      return {
        items: normalizedItems as TourItem[],
        totalCount: totalCount,
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || 10,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  });
}

/**
 * 키워드 검색
 * @param params 키워드 검색 파라미터
 * @returns 검색 결과 목록 및 전체 개수
 *
 * @example
 * ```ts
 * const result = await searchKeyword({
 *   keyword: "경복궁",
 *   areaCode: "1",
 *   numOfRows: 20
 * });
 * ```
 */
export async function searchKeyword(
  params: SearchKeywordParams,
): Promise<ListResponse<TourItem>> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string | number | undefined> = {
      keyword: params.keyword,
      areaCode: params.areaCode,
      contentTypeId: params.contentTypeId,
      sigunguCode: params.sigunguCode,
      numOfRows: params.numOfRows || 10,
      pageNo: params.pageNo || 1,
      arrange: params.arrange,
    };

    const url = buildApiUrl("/searchKeyword2", apiParams);

    // 전체 API 응답을 가져와서 totalCount 추출
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new TourApiError(
          `API 요청 실패: ${response.status} ${response.statusText}`,
          response.status,
        );
      }

      const data: ApiResponse<TourItem[]> = await response.json();

      // API 응답 에러 체크
      if (data.response?.header?.resultCode !== "0000") {
        const errorMsg = data.response?.header?.resultMsg || "알 수 없는 에러";
        throw new TourApiError(
          `API 에러: ${errorMsg}`,
          response.status,
          data.response?.header?.resultCode,
        );
      }

      // 응답 데이터 추출
      const body = data.response?.body;
      if (!body) {
        throw new TourApiError("응답 데이터가 없습니다.");
      }

      // items.item 처리 (배열 또는 단일 객체)
      const items = body.items?.item;
      let normalizedItems: TourItem[] = [];
      if (items !== undefined && items !== null) {
        if (Array.isArray(items)) {
          // 타입 단언: API 응답에서 배열로 오는 경우
          normalizedItems = items as TourItem[];
        } else {
          // 단일 객체인 경우 배열로 변환
          normalizedItems = [items as TourItem];
        }
      }

      // totalCount 추출 (API 응답에서)
      const totalCount = body.totalCount || normalizedItems.length;

      return {
        items: normalizedItems,
        totalCount: totalCount,
        pageNo: params.pageNo || 1,
        numOfRows: params.numOfRows || 10,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  });
}

/**
 * 관광지 공통 정보 조회
 * @param params 공통 정보 조회 파라미터
 * @returns 관광지 상세 정보
 *
 * @example
 * ```ts
 * const detail = await getDetailCommon({
 *   contentId: "125266"
 * });
 * console.log(detail.title); // 관광지명
 * console.log(detail.overview); // 개요
 * ```
 */
export async function getDetailCommon(
  params: DetailCommonParams,
): Promise<TourDetail> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string | undefined> = {
      contentId: params.contentId,
      // detailCommon2 API는 contentId만 지원합니다
      // 다른 파라미터들(firstImageYN, mapinfoYN, overviewYN 등)은 지원하지 않습니다
    };

    const url = buildApiUrl("/detailCommon2", apiParams);
    const items = await fetchApi<TourDetail[]>(url);

    if (!Array.isArray(items) || items.length === 0) {
      throw new TourApiError(
        `관광지 정보를 찾을 수 없습니다. (contentId: ${params.contentId})`,
      );
    }

    return items[0];
  });
}

/**
 * 관광지 소개 정보 조회
 * @param params 소개 정보 조회 파라미터
 * @returns 관광지 소개 정보
 *
 * @example
 * ```ts
 * const intro = await getDetailIntro({
 *   contentId: "125266",
 *   contentTypeId: "12"
 * });
 * console.log(intro.usetime); // 이용시간
 * console.log(intro.restdate); // 휴무일
 * ```
 */
export async function getDetailIntro(
  params: DetailIntroParams,
): Promise<TourIntro> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string> = {
      contentId: params.contentId,
      contentTypeId: params.contentTypeId,
    };

    const url = buildApiUrl("/detailIntro2", apiParams);
    const items = await fetchApi<TourIntro[]>(url);

    if (!Array.isArray(items) || items.length === 0) {
      throw new TourApiError(
        `관광지 소개 정보를 찾을 수 없습니다. (contentId: ${params.contentId})`,
      );
    }

    return items[0];
  });
}

/**
 * 관광지 이미지 목록 조회
 * @param params 이미지 조회 파라미터
 * @returns 이미지 배열
 *
 * @example
 * ```ts
 * const images = await getDetailImage({
 *   contentId: "125266",
 *   numOfRows: 20
 * });
 * images.forEach(img => console.log(img.originimgurl));
 * ```
 */
export async function getDetailImage(
  params: DetailImageParams,
): Promise<TourImage[]> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string | number | undefined> = {
      contentId: params.contentId,
      numOfRows: params.numOfRows || 10,
      pageNo: params.pageNo || 1,
      imageYN: params.imageYN || "Y",
      // subImageYN은 API에서 지원하지 않으므로 제거
    };

    const url = buildApiUrl("/detailImage2", apiParams);
    const items = await fetchApi<TourImage[]>(url);

    return Array.isArray(items) ? items : [];
  });
}

/**
 * 반려동물 동반 정보 조회
 * @param params 반려동물 정보 조회 파라미터
 * @returns 반려동물 정보 또는 null (정보가 없는 경우)
 *
 * @example
 * ```ts
 * const petInfo = await getDetailPetTour({
 *   contentId: "125266"
 * });
 * if (petInfo) {
 *   console.log(petInfo.chkpetleash); // 반려동물 동반 가능 여부
 * }
 * ```
 */
export async function getDetailPetTour(
  params: DetailPetTourParams,
): Promise<PetTourInfo | null> {
  return retryWithBackoff(async () => {
    const apiParams: Record<string, string> = {
      contentId: params.contentId,
    };

    const url = buildApiUrl("/detailPetTour2", apiParams);
    const items = await fetchApi<PetTourInfo[]>(url);

    if (!Array.isArray(items) || items.length === 0) {
      // 반려동물 정보가 없는 경우 null 반환 (에러가 아님)
      return null;
    }

    return items[0];
  });
}
