/**
 * @file lib/types/tour.ts
 * @description 한국관광공사 API 관련 TypeScript 타입 정의
 *
 * 이 파일은 한국관광공사 공공 API(KorService2)의 요청/응답 타입을 정의합니다.
 * PRD 문서의 데이터 구조를 기반으로 작성되었습니다.
 *
 * @see {@link /docs/PRD.md} - 프로젝트 요구사항 문서
 */

/**
 * 관광지 목록 항목 (areaBasedList2, searchKeyword2 응답)
 */
export interface TourItem {
  /** 주소 */
  addr1: string;
  /** 상세주소 */
  addr2?: string;
  /** 지역코드 */
  areacode: string;
  /** 콘텐츠ID (관광지 고유 식별자) */
  contentid: string;
  /** 콘텐츠타입ID (12: 관광지, 14: 문화시설 등) */
  contenttypeid: string;
  /** 관광지명 */
  title: string;
  /** 경도 (KATEC 좌표계, 정수형) */
  mapx: string;
  /** 위도 (KATEC 좌표계, 정수형) */
  mapy: string;
  /** 대표이미지1 */
  firstimage?: string;
  /** 대표이미지2 */
  firstimage2?: string;
  /** 전화번호 */
  tel?: string;
  /** 대분류 */
  cat1?: string;
  /** 중분류 */
  cat2?: string;
  /** 소분류 */
  cat3?: string;
  /** 수정일 */
  modifiedtime: string;
  /** 반려동물 동반 정보 (선택적, 필터링 시 조회) */
  petInfo?: PetTourInfo;
}

/**
 * 관광지 상세 정보 (detailCommon2 응답)
 */
export interface TourDetail {
  /** 콘텐츠ID */
  contentid: string;
  /** 콘텐츠타입ID */
  contenttypeid: string;
  /** 관광지명 */
  title: string;
  /** 주소 */
  addr1: string;
  /** 상세주소 */
  addr2?: string;
  /** 우편번호 */
  zipcode?: string;
  /** 전화번호 */
  tel?: string;
  /** 홈페이지 */
  homepage?: string;
  /** 개요 (긴 설명) */
  overview?: string;
  /** 대표이미지1 */
  firstimage?: string;
  /** 대표이미지2 */
  firstimage2?: string;
  /** 경도 (KATEC 좌표계) */
  mapx: string;
  /** 위도 (KATEC 좌표계) */
  mapy: string;
  /** 대분류 */
  cat1?: string;
  /** 중분류 */
  cat2?: string;
  /** 소분류 */
  cat3?: string;
}

/**
 * 관광지 소개 정보 (detailIntro2 응답)
 * 타입별로 필드가 다를 수 있음
 */
export interface TourIntro {
  /** 콘텐츠ID */
  contentid: string;
  /** 콘텐츠타입ID */
  contenttypeid: string;
  /** 이용시간 */
  usetime?: string;
  /** 휴무일 */
  restdate?: string;
  /** 문의처 */
  infocenter?: string;
  /** 주차 가능 여부 */
  parking?: string;
  /** 반려동물 동반 가능 여부 */
  chkpet?: string;
  /** 수용인원 */
  accomcount?: string;
  /** 체험 프로그램 */
  expguide?: string;
  /** 유모차 대여 여부 */
  chkbabycarriage?: string;
  /** 기타 정보 (타입별로 추가 필드 가능) */
  [key: string]: string | undefined;
}

/**
 * 관광지 이미지 정보 (detailImage2 응답)
 */
export interface TourImage {
  /** 콘텐츠ID */
  contentid: string;
  /** 이미지명 */
  imagename?: string;
  /** 원본 이미지 URL */
  originimgurl?: string;
  /** 썸네일 이미지 URL */
  smallimageurl?: string;
  /** 이미지 설명 */
  cpyrhtDivCd?: string;
  /** 저작권 정보 */
  serialnum?: string;
}

/**
 * 반려동물 동반 여행 정보 (detailPetTour2 응답)
 */
export interface PetTourInfo {
  /** 콘텐츠ID */
  contentid: string;
  /** 콘텐츠타입ID */
  contenttypeid: string;
  /** 애완동물 동반 여부 */
  chkpetleash?: string;
  /** 애완동물 크기 제한 */
  chkpetsize?: string;
  /** 입장 가능 장소 (실내/실외) */
  chkpetplace?: string;
  /** 추가 요금 */
  chkpetfee?: string;
  /** 기타 반려동물 정보 */
  petinfo?: string;
  /** 주차장 정보 */
  parking?: string;
}

/**
 * 지역 코드 정보 (areaCode2 응답)
 */
export interface AreaCode {
  /** 지역코드 */
  code: string;
  /** 지역명 */
  name: string;
  /** 상위 지역코드 (시/도) */
  rnum?: string;
}

/**
 * API 응답 래퍼 타입
 */
export interface ApiResponse<T> {
  /** 응답 본문 */
  response: {
    /** 응답 헤더 */
    header: {
      /** 결과 코드 */
      resultCode: string;
      /** 결과 메시지 */
      resultMsg: string;
    };
    /** 응답 본문 */
    body: {
      /** 데이터 항목들 */
      items?: {
        /** 단일 항목 또는 배열 */
        item?: T | T[];
      };
      /** 전체 개수 */
      numOfRows?: number;
      /** 페이지 번호 */
      pageNo?: number;
      /** 전체 결과 수 */
      totalCount?: number;
    };
  };
}

/**
 * API 에러 정보
 */
export interface ApiError {
  /** 에러 메시지 */
  message: string;
  /** HTTP 상태 코드 */
  statusCode?: number;
  /** API 에러 코드 */
  errorCode?: string;
  /** 원본 에러 */
  originalError?: unknown;
}

// ============================================
// API 파라미터 타입 정의
// ============================================

/**
 * 지역코드 조회 파라미터 (areaCode2)
 */
export interface AreaCodeParams {
  /** 지역코드 (선택) */
  areaCode?: string;
  /** 시/도 코드 (선택) */
  sigunguCode?: string;
}

/**
 * 지역 기반 목록 조회 파라미터 (areaBasedList2)
 */
export interface AreaBasedListParams {
  /** 지역코드 (필수) */
  areaCode: string;
  /** 콘텐츠타입ID (선택) */
  contentTypeId?: string;
  /** 시/군/구 코드 (선택) */
  sigunguCode?: string;
  /** 한 페이지 결과 수 (기본값: 10) */
  numOfRows?: number;
  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;
  /** 정렬 옵션 (modifiedtime: 최신순, title: 이름순) */
  arrange?: "A" | "B" | "C" | "D" | "E" | "O" | "Q" | "R" | "S";
}

/**
 * 키워드 검색 파라미터 (searchKeyword2)
 */
export interface SearchKeywordParams {
  /** 검색 키워드 (필수) */
  keyword: string;
  /** 지역코드 (선택) */
  areaCode?: string;
  /** 콘텐츠타입ID (선택) */
  contentTypeId?: string;
  /** 시/군/구 코드 (선택) */
  sigunguCode?: string;
  /** 한 페이지 결과 수 (기본값: 10) */
  numOfRows?: number;
  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;
  /** 정렬 옵션 */
  arrange?: "A" | "B" | "C" | "D" | "E" | "O" | "Q" | "R" | "S";
}

/**
 * 공통 정보 조회 파라미터 (detailCommon2)
 */
export interface DetailCommonParams {
  /** 콘텐츠ID (필수) */
  contentId: string;
  /** 기본 정보 조회 여부 (기본값: Y) */
  defaultYN?: "Y" | "N";
  /** 첫 이미지 조회 여부 (기본값: Y) */
  firstImageYN?: "Y" | "N";
  /** 지역 정보 조회 여부 (기본값: Y) */
  areacodeYN?: "Y" | "N";
  /** 카테고리 정보 조회 여부 (기본값: Y) */
  catcodeYN?: "Y" | "N";
  /** 지도 정보 조회 여부 (기본값: Y) */
  mapinfoYN?: "Y" | "N";
  /** 개요 정보 조회 여부 (기본값: Y) */
  overviewYN?: "Y" | "N";
}

/**
 * 소개 정보 조회 파라미터 (detailIntro2)
 */
export interface DetailIntroParams {
  /** 콘텐츠ID (필수) */
  contentId: string;
  /** 콘텐츠타입ID (필수) */
  contentTypeId: string;
}

/**
 * 이미지 조회 파라미터 (detailImage2)
 */
export interface DetailImageParams {
  /** 콘텐츠ID (필수) */
  contentId: string;
  /** 한 페이지 결과 수 (기본값: 10) */
  numOfRows?: number;
  /** 페이지 번호 (기본값: 1) */
  pageNo?: number;
  /** 이미지 타입 (기본값: all) */
  imageYN?: "Y" | "N";
}

/**
 * 반려동물 정보 조회 파라미터 (detailPetTour2)
 */
export interface DetailPetTourParams {
  /** 콘텐츠ID (필수) */
  contentId: string;
}

/**
 * 목록 조회 응답 타입
 */
export interface ListResponse<T> {
  /** 항목 배열 */
  items: T[];
  /** 전체 개수 */
  totalCount: number;
  /** 현재 페이지 번호 */
  pageNo: number;
  /** 페이지당 항목 수 */
  numOfRows: number;
}

/**
 * 반려동물 필터 파라미터
 */
export interface PetFilterParams {
  /** 반려동물 동반 가능 여부 */
  petAllowed?: boolean;
  /** 반려동물 크기 필터 */
  petSize?: "small" | "medium" | "large";
}
