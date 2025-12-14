# My Trip - 개발 TODO 리스트

> PRD, Flowchart, Design 문서 기반 작업 항목 정리

## Phase 1: 기본 구조 & 공통 설정

- [x] API 클라이언트 구현
  - [x] `lib/api/tour-api.ts` 생성
    - [x] `getAreaCode()` - 지역코드 조회 (`areaCode2`)
    - [x] `getAreaBasedList()` - 지역 기반 목록 (`areaBasedList2`)
    - [x] `searchKeyword()` - 키워드 검색 (`searchKeyword2`)
    - [x] `getDetailCommon()` - 공통 정보 (`detailCommon2`)
    - [x] `getDetailIntro()` - 소개 정보 (`detailIntro2`)
    - [x] `getDetailImage()` - 이미지 목록 (`detailImage2`)
    - [x] `getDetailPetTour()` - 반려동물 정보 (`detailPetTour2`)
    - [x] 공통 파라미터 처리 (serviceKey, MobileOS, MobileApp, \_type)
    - [x] 에러 처리 및 재시도 로직
- [x] 타입 정의
  - [x] `lib/types/tour.ts` 생성
    - [x] `TourItem` 인터페이스 (목록)
    - [x] `TourDetail` 인터페이스 (상세)
    - [x] `TourIntro` 인터페이스 (운영정보)
    - [x] `TourImage` 인터페이스 (이미지)
    - [x] `PetTourInfo` 인터페이스 (반려동물)

---

**구현 완료 세부사항 (2025-01-XX):**

- [x] `TourApiError` 커스텀 에러 클래스 구현
- [x] `retryWithBackoff()` 재시도 로직 구현 (최대 3회, 지수 백오프)
- [x] `buildApiUrl()` URL 빌더 함수 구현
- [x] `createCommonParams()` 공통 파라미터 생성 함수 구현
- [x] `fetchApi<T>()` 제네릭 API 호출 및 응답 파싱 함수 구현
- [x] 환경변수 처리 (`NEXT_PUBLIC_TOUR_API_KEY` 우선, 없으면 `TOUR_API_KEY`)
- [x] 타임아웃 처리 (기본 10초)
- [x] API 응답 구조 정규화 (단일 객체/배열 처리)
- [x] 모든 함수에 JSDoc 주석 추가
- [x] 파일 헤더 주석 작성
- [x] 타입 안정성 보장 (모든 함수에 명시적 타입 정의)
- [x] `ListResponse<T>` 타입 추가 (목록 조회 응답용)
- [x] `ApiResponse<T>` 타입 추가 (API 응답 래퍼)
- [x] `AreaCode` 타입 추가 (지역코드 정보)
- [x] 모든 API 파라미터 타입 정의 (`AreaCodeParams`, `AreaBasedListParams` 등)

---

**구현 완료 세부사항 (2025-01-XX):**

- [x] `lib/types/stats.ts` 생성
  - [x] `RegionStats` 인터페이스 (지역별 통계: code, name, count)
  - [x] `TypeStats` 인터페이스 (타입별 통계: contentTypeId, typeName, count, percentage)
  - [x] `StatsSummary` 인터페이스 (통계 요약: totalCount, topRegions, topTypes, lastUpdated)
  - [x] `StatsData` 인터페이스 (통계 데이터 응답 타입)
  - [x] `CONTENT_TYPE_MAP` 상수 객체 (콘텐츠 타입 ID와 이름 매핑)
  - [x] `getContentTypeName()` 유틸리티 함수
- [x] `app/layout.tsx` 메타데이터 업데이트
  - [x] My Trip 프로젝트에 맞는 title, description 설정
  - [x] Open Graph 태그 추가 (type, locale, url, siteName, images)
  - [x] Twitter Card 태그 추가 (summary_large_image)
  - [x] SEO 최적화 (keywords, robots, verification)
  - [x] `Toaster` 컴포넌트 추가 (토스트 알림 지원)
- [x] `components/Navbar.tsx` 업데이트
  - [x] 로고를 "My Trip"으로 변경
  - [x] 검색창 UI 추가 (Phase 2에서 기능 구현 예정, 현재 disabled)
  - [x] 네비게이션 링크 추가 (홈, 통계, 북마크)
  - [x] 반응형 디자인 (모바일에서 검색창 숨김)
  - [x] sticky 헤더 적용
  - [x] Clerk 인증 버튼 유지
- [x] `components/ui/loading.tsx` 생성
  - [x] 로딩 스피너 컴포넌트 (크기 변형: sm, md, lg)
  - [x] `LoadingOverlay` 컴포넌트 (전체 화면 로딩)
  - [x] Tailwind CSS 애니메이션 사용
  - [x] 접근성 지원 (aria-label, role, sr-only)
- [x] `components/ui/skeleton.tsx` 생성
  - [x] shadcn/ui skeleton 컴포넌트 설치 (`pnpm dlx shadcn@latest add skeleton`)
  - [x] 기본 스켈레톤 UI 컴포넌트 사용 가능
- [x] `components/ui/error.tsx` 생성
  - [x] `ErrorDisplay` 컴포넌트 (에러 메시지 표시, 재시도 버튼)
  - [x] `InlineError` 컴포넌트 (인라인 에러 메시지)
  - [x] 에러 타입별 메시지 매핑 (TourApiError, NetworkError, TimeoutError 등)
  - [x] 커스텀 에러 메시지 지원
  - [x] 접근성 지원 (role="alert", aria-live)
- [x] `components/ui/toast.tsx` 생성
  - [x] shadcn/ui sonner 설치 (`pnpm dlx shadcn@latest add sonner`)
  - [x] `toast` 유틸리티 함수 래퍼 (success, error, info, warning, message, promise, dismiss)
  - [x] `Toaster` 컴포넌트 (app/layout.tsx에 추가됨)
  - [x] 타입 안전성 보장

---

- [x] `lib/types/stats.ts` 생성
  - [x] `RegionStats` 인터페이스
  - [x] `TypeStats` 인터페이스
  - [x] `StatsSummary` 인터페이스
- [x] 레이아웃 구조
  - [x] `app/layout.tsx` 업데이트
    - [x] 메타데이터 설정
    - [x] 헤더/푸터 구조 확인
  - [x] `components/Navbar.tsx` 업데이트
    - [x] 로고, 검색창, 로그인 버튼
    - [x] 네비게이션 링크 (홈, 통계, 북마크)
- [x] 공통 컴포넌트
  - [x] `components/ui/loading.tsx` - 로딩 스피너
  - [x] `components/ui/skeleton.tsx` - 스켈레톤 UI
  - [x] `components/ui/error.tsx` - 에러 메시지
  - [x] `components/ui/toast.tsx` - 토스트 알림 (shadcn/ui)

## Phase 2: 홈페이지 (`/`) - 관광지 목록

- [x] 페이지 기본 구조
  - [x] `app/page.tsx` 생성
    - [x] 기본 레이아웃 (헤더, 메인, 푸터)
    - [x] 반응형 컨테이너 설정

---

**추가 개발 사항 (2025-01-XX):**

- [x] `app/page.tsx`를 My Trip 홈페이지 기본 구조로 변경
  - [x] 기존 SaaS 템플릿 내용 제거
  - [x] 관광지 목록을 위한 기본 레이아웃 구조 생성
  - [x] Server Component로 구현 (Next.js 15 App Router)
  - [x] 최대 너비 컨테이너 설정 (`max-w-7xl`)
  - [x] 반응형 패딩 설정 (모바일: `px-4`, 데스크톱: `px-6`)
  - [x] 최소 높이 설정 (`min-h-[calc(100vh-80px)]`) - Navbar 높이 고려
  - [x] 향후 컴포넌트 추가를 위한 섹션 구조 준비
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/Footer.tsx` 생성
  - [x] 푸터 컴포넌트 생성 (DESIGN.md 참고)
  - [x] 저작권 정보 표시 ("My Trip © {currentYear}")
  - [x] About, Contact 링크 추가 (향후 구현 예정, 현재는 placeholder)
  - [x] "한국관광공사 API 제공" 표시
  - [x] 반응형 레이아웃 (모바일: 세로 정렬, 데스크톱: 가로 정렬)
  - [x] 다크 모드 지원
  - [x] 접근성 지원 (aria-label)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `app/layout.tsx`에 Footer 컴포넌트 추가
  - [x] Footer 컴포넌트 import
  - [x] `{children}` 다음에 Footer 추가
  - [x] 레이아웃 구조: Navbar → children → Footer
- [x] 관광지 목록 기능 (MVP 2.1)
  - [x] `components/tour-card.tsx` 생성
    - [x] 썸네일 이미지 (기본 이미지 fallback)
    - [x] 관광지명
    - [x] 주소 표시
    - [x] 관광 타입 뱃지
    - [x] 간단한 개요 (1-2줄)
    - [x] 호버 효과 (scale, shadow)
    - [x] 클릭 시 상세페이지 이동
  - [x] `components/tour-list.tsx` 생성
    - [x] 그리드 레이아웃 (반응형)
    - [x] 카드 목록 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 빈 상태 처리
  - [x] API 연동
    - [x] `getAreaBasedList()` 호출
    - [x] 데이터 파싱 및 표시
    - [x] 에러 처리

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-card.tsx` 생성
  - [x] Client Component로 구현 (클릭 이벤트 처리)
  - [x] Next.js `Image` 컴포넌트 사용 (이미지 최적화)
  - [x] 썸네일 이미지 표시 (`firstimage` 또는 `firstimage2` 사용)
  - [x] 이미지 없을 때 기본 이미지 fallback (ImageIcon 아이콘 사용)
  - [x] 이미지 로딩 실패 시 기본 이미지로 대체 처리
  - [x] 관광지명 표시 (`title` 필드, 대제목 스타일)
  - [x] 주소 표시 (`addr1`, `addr2` 필드, MapPin 아이콘)
  - [x] 관광 타입 뱃지 (`getContentTypeName()` 함수 사용)
  - [x] 타입별 뱃지 색상 구분 (8가지 타입별 색상)
  - [x] 호버 효과 (scale 변환, shadow 증가, 부드러운 전환)
  - [x] 클릭 이벤트 (`/places/[contentId]`로 이동, Next.js Link 사용)
  - [x] 반응형 디자인 (모바일/태블릿/데스크톱)
  - [x] 접근성 지원 (aria-label)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/tour-list.tsx` 생성
  - [x] Client Component로 구현
  - [x] Props 타입 정의 (`TourListProps`)
  - [x] 그리드 레이아웃 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
  - [x] 로딩 상태 처리 (`TourCardSkeleton` 컴포넌트, 6개 스켈레톤 표시)
  - [x] 빈 상태 처리 (`EmptyState` 컴포넌트, Inbox 아이콘 사용)
  - [x] 에러 상태 처리 (`ErrorDisplay` 컴포넌트, 재시도 버튼)
  - [x] 반응형 디자인
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `app/page.tsx`에 API 연동
  - [x] Server Component로 구현 (초기 데이터 로딩)
  - [x] `getAreaBasedList()` API 호출
  - [x] 기본 파라미터 설정 (areaCode: "1" (서울), numOfRows: 12, pageNo: 1)
  - [x] try-catch로 에러 처리
  - [x] `TourApiError` 처리
  - [x] 데이터를 `TourList` 컴포넌트에 전달
  - [x] 에러 상태를 `TourList`에 전달
  - [x] 파일 헤더 주석 업데이트
- [x] `next.config.ts` 이미지 도메인 설정
  - [x] 한국관광공사 API 이미지 도메인 추가 (`tong.visitkorea.or.kr`, `api.visitkorea.or.kr`)
- [x] 필터 기능
  - [x] `components/tour-filters.tsx` 생성
    - [x] 지역 필터 (시/도 선택)
      - [x] `getAreaCode()` API로 지역 목록 로드
      - [x] 드롭다운 또는 버튼 그룹
      - [x] "전체" 옵션
    - [x] 관광 타입 필터
      - [x] 관광지(12), 문화시설(14), 축제/행사(15), 여행코스(25), 레포츠(28), 숙박(32), 쇼핑(38), 음식점(39)
      - [x] 다중 선택 가능
      - [x] "전체" 옵션
    - [x] 반려동물 동반 가능 필터 (MVP 2.5)
      - [x] 토글 버튼
      - [x] 크기별 필터 (소형, 중형, 대형)
    - [x] 정렬 옵션
      - [x] 최신순 (modifiedtime)
      - [x] 이름순 (가나다)
    - [x] 필터 상태 관리 (URL 쿼리 파라미터 또는 상태)
  - [x] 필터 적용 로직
    - [x] 필터 변경 시 API 재호출
    - [x] 필터 조합 처리

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-filters.tsx` 생성
  - [x] Client Component로 구현 (필터 상태 관리 및 URL 업데이트)
  - [x] 지역 필터 구현 (버튼 그룹, "전체" 옵션 포함)
  - [x] 관광 타입 필터 구현 (버튼 그룹, 단일 선택, "전체" 옵션 포함)
  - [x] 정렬 옵션 구현 (버튼 그룹, "최신순", "이름순")
  - [x] URL 쿼리 파라미터 관리 (`useRouter`, `useSearchParams` 사용)
  - [x] 필터 변경 시 URL 업데이트 (`router.push()`)
  - [x] 정렬 옵션 API 매핑 ("A": 이름순, "B": 최신순)
  - [x] 반응형 디자인 (모바일: 세로 배치, 데스크톱: 가로 배치)
  - [x] 필터 UI (카드 형태, 아이콘 포함)
  - [x] 선택된 필터 시각적 구분 (variant="default" vs "outline")
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)

---

**추가 개발 사항 (반려동물 필터, 2025-01-XX):**

- [x] 반려동물 동반 가능 필터 구현

  - [x] 타입 정의 확장 (`lib/types/tour.ts`)
    - [x] `TourItem`에 `petInfo?: PetTourInfo` 필드 추가
    - [x] `PetFilterParams` 인터페이스 생성
  - [x] 반려동물 정보 조회 유틸리티 생성 (`lib/utils/pet-filter.ts`)
    - [x] `fetchPetInfoForTours()` 함수 (병렬 조회)
    - [x] `filterToursByPetInfo()` 함수 (필터링)
    - [x] `getPetSizeLabel()` 함수 (크기 라벨)
  - [x] 필터 컴포넌트 확장 (`components/tour-filters.tsx`)
    - [x] 반려동물 동반 가능 토글 버튼 추가
    - [x] 반려동물 크기별 필터 추가 (소형, 중형, 대형)
    - [x] URL 쿼리 파라미터에 반려동물 필터 추가 (`petAllowed`, `petSize`)
    - [x] 필터 활성화 시 크기별 필터 표시
  - [x] 홈페이지 필터링 로직 추가 (`app/page.tsx`)
    - [x] 반려동물 필터 파라미터 파싱 (`petAllowed`, `petSize`)
    - [x] 필터 활성화 시 반려동물 정보 병렬 조회
    - [x] 필터 조건에 맞는 관광지만 필터링
  - [x] 관광지 카드에 반려동물 뱃지 표시 (`components/tour-card.tsx`)
    - [x] 반려동물 정보가 있고 `chkpetleash === "Y"`인 경우 뱃지 표시
    - [x] 크기별 라벨 표시 (소형견 OK, 중형견 OK, 대형견 OK)

- [x] `app/page.tsx`에 지역 목록 로드 추가
  - [x] `getAreaCode()` API 호출 (Server Component)
  - [x] 에러 처리 (지역 목록 로딩 실패 시 빈 배열)
  - [x] 지역 목록을 `TourFilters` 컴포넌트에 props로 전달
- [x] `app/page.tsx`에 URL 쿼리 파라미터 처리 추가
  - [x] Next.js 15의 `searchParams` 사용 (async Promise)
  - [x] 쿼리 파라미터 파싱 (`areaCode`, `contentTypeId`, `arrange`, `pageNo`)
  - [x] 기본값 처리 (`areaCode` 기본값: "1" (서울))
  - [x] `buildApiParams()` 함수로 API 파라미터 변환
  - [x] 필터 파라미터를 `getAreaBasedList()`에 전달
  - [x] Suspense로 감싸서 searchParams 처리
  - [x] 로딩 스켈레톤 추가 (`AreaListSkeleton`)
- [x] `app/page.tsx`에 TourFilters 컴포넌트 통합
  - [x] 필터 컴포넌트를 목록 위에 배치
  - [x] Suspense로 감싸서 비동기 처리
  - [x] 필터와 목록 사이 간격 조정 (`space-y-6`)
  - [x] 파일 헤더 주석 업데이트
- [x] 검색 기능 (MVP 2.3)
  - [x] `components/tour-search.tsx` 생성
    - [x] 검색창 UI (헤더 또는 메인 영역)
    - [x] 검색 아이콘
    - [x] 엔터 또는 버튼 클릭으로 검색
    - [x] 검색 중 로딩 스피너
  - [x] 검색 API 연동
    - [x] `searchKeyword()` 호출
    - [x] 검색 결과 표시
    - [x] 검색 결과 개수 표시
    - [x] 결과 없음 메시지
  - [x] 검색 + 필터 조합
    - [x] 키워드 + 지역 필터
    - [x] 키워드 + 타입 필터
    - [x] 모든 필터 동시 적용

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-search.tsx` 생성
  - [x] Client Component로 구현 (검색 상태 관리 및 URL 업데이트)
  - [x] 검색창 UI (Input 컴포넌트, Search 아이콘)
  - [x] 검색 버튼 (검색 아이콘, 로딩 스피너)
  - [x] 검색어 삭제 버튼 (X 버튼, 검색어가 있을 때만 표시)
  - [x] 엔터 키 입력 시 검색 실행
  - [x] 검색 버튼 클릭 시 검색 실행
  - [x] URL 쿼리 파라미터 관리 (`useRouter`, `useSearchParams` 사용)
  - [x] 검색 시 URL에 `keyword` 파라미터 추가
  - [x] 검색어 삭제 시 URL에서 `keyword` 파라미터 제거
  - [x] 검색어 초기화 기능
  - [x] URL에서 초기 검색어 읽기 (`useEffect` 사용)
  - [x] 반응형 디자인 (compact 모드 지원)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/Navbar.tsx`에 TourSearch 컴포넌트 통합
  - [x] 기존 disabled Input을 `TourSearch` 컴포넌트로 교체
  - [x] Suspense로 감싸서 비동기 처리
  - [x] 로딩 스켈레톤 추가
  - [x] Navbar 레이아웃 유지
  - [x] 파일 헤더 주석 업데이트
- [x] `app/page.tsx`에 검색 API 연동
  - [x] `searchParams`에 `keyword` 추가
  - [x] 검색 로직 분기 (keyword 있으면 `searchKeyword()`, 없으면 `getAreaBasedList()`)
  - [x] `buildSearchParams()` 함수 생성 (검색 API 파라미터 변환)
  - [x] `buildAreaBasedListParams()` 함수로 이름 변경 (기존 함수 리팩토링)
  - [x] 검색 API 호출 시 필터 파라미터 포함 (`areaCode`, `contentTypeId`, `arrange`)
  - [x] 에러 처리 (`TourApiError` 처리)
  - [x] 파일 헤더 주석 업데이트
- [x] 검색 결과 개수 표시
  - [x] 검색 키워드와 결과 개수 표시 (필터 아래, 목록 위)
  - [x] 검색어가 없으면 표시하지 않음
  - [x] 검색어를 따옴표로 감싸서 표시
- [x] 검색 결과 없음 메시지 개선
  - [x] `TourList` 컴포넌트에 `searchKeyword` prop 추가
  - [x] `EmptyState` 컴포넌트에 검색 키워드 전달
  - [x] 검색 결과 없음 시 검색어 포함 메시지 표시
  - [x] 일반 빈 상태와 검색 결과 없음 상태 구분
- [x] 검색 + 필터 조합 기능
  - [x] 필터 변경 시 검색 키워드 유지 (`TourFilters` 컴포넌트)
  - [x] 검색 실행 시 필터 파라미터 유지 (`TourSearch` 컴포넌트)
  - [x] 검색 API 호출 시 필터 파라미터 포함
  - [x] URL 쿼리 파라미터로 검색 + 필터 상태 동시 관리
- [x] 네이버 지도 연동 (MVP 2.2)
  - [x] `components/naver-map.tsx` 생성
    - [x] Naver Maps API v3 초기화
    - [x] 지도 컨테이너 설정
    - [x] 초기 중심 좌표 설정
    - [x] 줌 레벨 설정

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/naver-map.tsx` 생성
  - [x] Client Component로 구현 (브라우저에서만 실행)
  - [x] Naver Maps API v3 스크립트 동적 로드 (`useEffect` 사용)
  - [x] 환경변수 확인 (`NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`)
  - [x] 스크립트 중복 로드 방지 (이미 로드된 경우 스킵)
  - [x] 스크립트 로드 완료 후 지도 초기화
  - [x] 지도 컨테이너 DOM 참조 (`useRef` 사용)
  - [x] `naver.maps.Map` 인스턴스 생성
  - [x] 초기 중심 좌표 설정 (관광지 목록 기반 자동 계산 또는 서울 기본값)
  - [x] 초기 줌 레벨 설정 (기본값: 10, 관광지 개수에 따라 자동 조정)
  - [x] 지도 타입 설정 (기본 지도: `naver.maps.MapTypeId.NORMAL`)
  - [x] 좌표 변환 함수 생성 (`convertKATECToWGS84`: mapx/mapy / 10000000)
  - [x] 좌표 유효성 검증 (NaN 체크, 한국 영역 범위 체크)
  - [x] 관광지 목록 중심 좌표 계산 함수 (`calculateCenter`)
  - [x] 마커 표시 기능 (`useEffect`로 관광지 목록 변경 시 업데이트)
  - [x] 기존 마커 제거 후 새 마커 생성
  - [x] 각 관광지에 대해 마커 생성 (`naver.maps.Marker`)
  - [x] 마커 클릭 이벤트 리스너 등록
  - [x] 인포윈도우 생성 (`naver.maps.InfoWindow`)
  - [x] 인포윈도우 내용 (관광지명, 주소, 상세보기 버튼)
  - [x] 인포윈도우 HTML 구조 (인라인 스타일 적용)
  - [x] 지도 컨트롤 추가 (`naver.maps.ZoomControl`, `naver.maps.MapTypeControl`)
  - [x] 컨트롤 위치 설정 (우측 상단: `naver.maps.Position.TOPRIGHT`)
  - [x] 반응형 레이아웃 (기본 높이: 600px, 모바일: 400px)
  - [x] 로딩 상태 표시 (스켈레톤 UI)
  - [x] 에러 상태 처리 (API 키 없음, 스크립트 로드 실패, 지도 초기화 실패)
  - [x] 에러 메시지 표시 및 재시도 버튼
  - [x] Naver Maps API 타입 정의 (`declare global` 사용)
  - [x] Props 인터페이스 정의 (`NaverMapProps`)
  - [x] 향후 리스트 연동을 위한 인터페이스 (`onMarkerClick`, `selectedTourId`)
  - [x] 선택된 관광지로 지도 이동 기능 (향후 확장용)
  - [x] 마커 및 인포윈도우 배열 관리 (`useRef` 사용)
  - [x] cleanup 처리 (마커 및 인포윈도우 제거)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
  - [x] 주요 함수 JSDoc 주석 추가

---

**에러 사항 해결 (2025-01-XX):**

- [x] ChunkLoadError 해결
  - [x] `next.config.ts`에 Webpack 설정 추가
    - [x] 청크 분할 최적화 (Clerk 패키지 별도 청크 분리)
    - [x] 개발 환경 타임아웃 증가 (watchOptions 설정)
    - [x] 개발 서버 설정 개선 (onDemandEntries 설정)
  - [x] `package.json`에 캐시 정리 스크립트 추가
    - [x] `clean` 스크립트 추가 (`.next` 폴더 삭제)
    - [x] `dev:clean` 스크립트 추가 (캐시 정리 후 개발 서버 시작)
    - [x] `rimraf` 패키지 추가 (Windows 호환)
  - [x] `app/error.tsx` 생성
    - [x] ChunkLoadError 감지 및 자동 재시도
    - [x] 사용자 친화적 에러 메시지 표시
    - [x] 수동 재시도 버튼 제공

---

**에러 사항 해결 (Runtime TypeError, 2025-01-XX):**

- [x] 모듈 해상도 에러 해결
  - [x] `app/error.tsx` 개선
    - [x] 모듈 해상도 에러 감지 추가 ("Cannot read properties of undefined", "reading 'call'")
    - [x] 모듈 해상도 에러 자동 새로고침 (5초 후)
    - [x] 사용자 친화적 해결 방법 안내 추가
    - [x] 개발 환경 상세 에러 로깅 추가 (에러 메시지, 이름, 스택, digest)
    - [x] 새로고침 버튼 추가
  - [x] `app/global-error.tsx` 생성
    - [x] 루트 레벨 에러 바운더리 생성
    - [x] 레이아웃 레벨 에러 처리
    - [x] 모듈 해상도 에러 감지 및 자동 새로고침
    - [x] 개발 환경 상세 에러 로깅 추가
    - [x] 기본 HTML 구조 유지 (html, body 태그 포함)
  - [x] `next.config.ts` 개발 환경 개선
    - [x] 모듈 해상도 안정성 향상 (symlinks: false)
    - [x] 개발 환경 모듈 로딩 최적화 (removeAvailableModules: false, removeEmptyChunks: false)
  - [x] `package.json` 개발 스크립트 개선
    - [x] `clean:all` 스크립트 추가 (`.next` 및 `node_modules/.cache` 삭제)
  - [x] 마커 표시
    - [x] 관광지 목록을 마커로 표시
    - [x] 좌표 변환 (KATEC → WGS84: mapx/mapy / 10000000)
    - [x] 마커 클릭 시 인포윈도우
      - [x] 관광지명
      - [x] 간단한 설명
      - [x] "상세보기" 버튼
    - [ ] 관광 타입별 마커 색상 구분 (선택 사항)

---

**추가 개발 사항 (마커 표시, 2025-01-XX):**

- [x] 홈페이지에 지도 컴포넌트 통합
  - [x] `app/page.tsx`에 `NaverMap` 컴포넌트 import 및 추가
  - [x] 관광지 목록(`tours`)을 지도 컴포넌트에 전달
  - [x] 관광지가 있고 에러가 없을 때만 지도 표시
  - [x] 파일 헤더 주석 업데이트 (Phase 2.5 완료 표시)
- [x] 마커 표시 기능 검증 및 개선

  - [x] 인포윈도우 HTML 구조 개선 (XSS 방지, 텍스트 이스케이프)
  - [x] 인포윈도우 스타일 개선 (폰트, 색상, 버튼 호버 효과)
  - [x] 반응형 지도 높이 설정 (모바일: 400px, 데스크톱: 600px)
  - [x] Tailwind CSS 클래스로 반응형 높이 추가 (`h-[400px] md:h-[600px]`)

---

**추가 개발 사항 (지도-리스트 연동, 2025-01-XX):**

- [x] 선택 상태 관리 컴포넌트 생성 (`components/tour-map-container.tsx`)
  - [x] Client Component로 선택된 관광지 ID 상태 관리
  - [x] `useState`로 `selectedTourId` 상태 관리
  - [x] 관광지 목록 변경 시 선택 상태 초기화 (`useEffect`)
  - [x] 리스트 항목 클릭 핸들러 (`handleCardClick`)
  - [x] 마커 클릭 핸들러 (`handleMarkerClick`)
  - [x] `TourList`와 `NaverMap` 컴포넌트 통합 렌더링
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] TourList 컴포넌트 확장 (`components/tour-list.tsx`)
  - [x] `TourListProps`에 `selectedTourId?: string` 추가
  - [x] `TourListProps`에 `onCardClick?: (tourId: string) => void` 추가
  - [x] `TourCard`에 `isSelected`와 `onClick` props 전달
- [x] TourCard 컴포넌트 확장 (`components/tour-card.tsx`)
  - [x] `TourCardProps`에 `isSelected?: boolean` 추가
  - [x] `TourCardProps`에 `onClick?: () => void` 추가
  - [x] 선택 상태일 때 카드에 하이라이트 스타일 적용 (`ring-2 ring-primary border-primary shadow-lg scale-[1.02]`)
  - [x] `Link` 클릭 시 `onClick` 핸들러 호출
- [x] NaverMap 컴포넌트 검증 (`components/naver-map.tsx`)
  - [x] 기존 `selectedTourId` 로직 검증 (399-421줄)
  - [x] 기존 `onMarkerClick` 콜백 로직 검증 (373-375줄)
  - [x] 선택된 관광지로 지도 이동 및 인포윈도우 열기 기능 확인
- [x] app/page.tsx 수정

  - [x] `TourMapContainer` 컴포넌트 import 추가
  - [x] `TourList`와 `NaverMap`을 `TourMapContainer`로 교체
  - [x] Server Component 구조 유지 (데이터 로딩은 서버에서)

  - [x] 지도-리스트 연동
    - [x] 리스트 항목 클릭 → 지도 이동 및 마커 강조
    - [ ] 리스트 항목 호버 → 마커 강조 (선택 사항)
    - [x] 마커 클릭 → 리스트 항목 강조

---

**추가 개발 사항 (지도 컨트롤, 2025-01-XX):**

- [x] 지도 컨트롤 연결 수정 (`components/naver-map.tsx`)
  - [x] `ZoomControl` 생성 후 `map.controls.add()`로 지도에 추가
  - [x] `MapTypeControl` 생성 후 `map.controls.add()`로 지도에 추가
  - [x] 컨트롤 위치 설정 (우측 상단: `naver.maps.Position.TOPRIGHT`)
- [x] 타입 정의 업데이트 (`components/naver-map.tsx`)
  - [x] `declare global`에 `Map` 타입에 `controls` 속성 추가
  - [x] `controls.add()` 메서드 타입 정의
- [x] 현재 위치 버튼 구현 (`components/naver-map.tsx`)
  - [x] `navigator.geolocation.getCurrentPosition()` 사용
  - [x] 현재 위치 가져오기 성공 시 지도 중심 이동 및 줌 레벨 15로 설정
  - [x] 위치 권한 거부 시 에러 메시지 표시
  - [x] 브라우저 위치 서비스 미지원 시 에러 메시지 표시
  - [x] 로딩 상태 관리 (`isGettingLocation` state)
  - [x] 버튼 UI 구현 (지도 우측 하단에 절대 위치 배치)
  - [x] 로딩 중 스피너 아이콘 표시 (`Loader2`)
  - [x] 일반 상태 아이콘 표시 (`MapPin`)
  - [x] 접근성 지원 (aria-label, title 속성)
  - [x] 포커스 스타일 추가 (focus:ring)
- [x] 아이콘 추가 (`components/naver-map.tsx`)
  - [x] `lucide-react`에서 `MapPin`, `Loader2` 아이콘 import
- [x] 반응형 디자인 확인

  - [x] 버튼 크기 및 위치 확인 (모바일/데스크톱)
  - [x] 터치 이벤트 대응 (적절한 버튼 크기)

  - [x] 지도 컨트롤
    - [x] 줌 인/아웃 버튼
    - [x] 지도 유형 선택 (일반/스카이뷰/하이브리드)
    - [x] 현재 위치 버튼
    - [x] 현재 위치 버튼
  - [x] 반응형 레이아웃
    - [x] 데스크톱: 리스트(좌측 50%) + 지도(우측 50%) 분할
    - [x] 모바일: 탭 형태로 리스트/지도 전환

---

**추가 개발 사항 (반응형 레이아웃, 2025-01-XX):**

- [x] shadcn/ui Tabs 컴포넌트 설치
  - [x] `pnpm dlx shadcn@latest add tabs` 실행
  - [x] `components/ui/tabs.tsx` 생성 확인
- [x] TourMapContainer 컴포넌트 반응형 레이아웃 구현
  - [x] 모바일: Tabs 컴포넌트로 리스트/지도 전환 (탭 UI)
  - [x] 데스크톱: flex 레이아웃으로 좌우 분할 (50%씩)
  - [x] 데스크톱 높이 설정 (`md:h-[calc(100vh-280px)] md:min-h-[600px]`)
  - [x] 좌측 리스트 영역 스크롤 가능 (`overflow-y-auto`)
  - [x] 우측 지도 영역 고정 높이 (`height="100%"`)
  - [x] 아이콘 추가 (List, MapPin)
- [x] TourList 컴포넌트 높이 및 스크롤 처리 개선
  - [x] 데스크톱 분할 레이아웃에서 단일 컬럼으로 표시 (`grid-cols-1`)
  - [x] 모바일에서는 기존 그리드 레이아웃 유지
  - [x] className prop으로 레이아웃 제어 가능하도록 개선
- [x] NaverMap 컴포넌트 높이 처리 개선

  - [x] `height` prop 기본값 설정 (`"600px"`)
  - [x] `height="100%"`일 때 부모 컨테이너 높이에 맞춤 처리
  - [x] `isFullHeight` 플래그로 조건부 스타일링
  - [x] 로딩 상태에서도 높이 처리 일관성 유지

- [x] 페이지네이션
  - [x] 무한 스크롤 구현
    - [x] Intersection Observer 사용
    - [x] 하단 로딩 인디케이터
    - [x] 페이지당 10-20개 항목
  - [ ] 또는 페이지 번호 선택 방식

---

**추가 개발 사항 (무한 스크롤 구현, 2025-01-XX):**

- [x] API 응답 구조 개선 (`lib/api/tour-api.ts`)
  - [x] `getAreaBasedList` 함수에서 `totalCount` 추출 개선
  - [x] `searchKeyword` 함수에서 `totalCount` 추출 개선
  - [x] API 응답의 `body.totalCount` 직접 추출
  - [x] 타입 안전성 보장 (타입 단언 사용)
- [x] 무한 스크롤 훅 생성 (`hooks/use-infinite-scroll.ts`)
  - [x] Intersection Observer API 사용
  - [x] 페이지 번호 자동 증가
  - [x] 로딩 상태 관리 (`isLoading`, `hasMore`)
  - [x] 에러 처리
  - [x] 필터/검색 파라미터 변경 시 자동 초기화
  - [x] `sentinelRef` 함수 제공 (Intersection Observer용)
- [x] API 라우트 생성 (`app/api/tours/route.ts`)
  - [x] GET `/api/tours` 엔드포인트 생성
  - [x] 필터/검색 파라미터 처리
  - [x] `getAreaBasedList` 또는 `searchKeyword` 호출
  - [x] 반려동물 필터 처리
  - [x] 에러 처리 및 HTTP 상태 코드 반환
- [x] 하단 로딩 인디케이터 컴포넌트 생성 (`components/ui/loading-more.tsx`)
  - [x] 로딩 스피너 표시 (Loader2 아이콘)
  - [x] "더 불러오는 중..." 텍스트
  - [x] "모든 관광지를 불러왔습니다" 메시지 (hasMore === false)
  - [x] Sentinel 요소 역할 (Intersection Observer용)
  - [x] 접근성 지원 (aria-label)
- [x] TourList 컴포넌트에 무한 스크롤 통합 (`components/tour-list.tsx`)
  - [x] `useInfiniteScroll` 훅 사용
  - [x] Props 확장 (`initialTours`, `initialTotalCount`, `infiniteScrollParams`)
  - [x] 하단 로딩 인디케이터 표시
  - [x] 무한 스크롤로 로드된 데이터를 부모 컴포넌트에 전달 (`onToursUpdate`)
  - [x] 기존 기능 유지 (에러 처리, 빈 상태, 선택 상태)
- [x] app/page.tsx 수정
  - [x] `totalCount` 추출 및 전달
  - [x] `TourMapContainer`에 `initialTours`, `initialTotalCount` 전달
  - [x] `infiniteScrollParams` 생성 및 전달
  - [x] 반려동물 필터 파라미터 포함
- [x] TourMapContainer 컴포넌트 수정 (`components/tour-map-container.tsx`)
  - [x] Props 확장 (`initialTours`, `initialTotalCount`, `infiniteScrollParams`)
  - [x] 무한 스크롤로 로드된 데이터 상태 관리 (`displayTours`)
  - [x] `onToursUpdate` 콜백으로 지도 데이터 업데이트
  - [x] 모바일/데스크톱 레이아웃 모두 지원
- [x] 최종 통합 및 스타일링
  - [x] 모든 기능 통합 테스트
  - [x] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
  - [x] 로딩 상태 개선
  - [x] 에러 처리 개선

---

**추가 개발 사항 (최종 통합 및 스타일링, 2025-01-XX):**

- [x] 에러 처리 개선
  - [x] `app/api/tours/route.ts` 에러 응답 형식 통일 (`success`, `error`, `errorType` 필드 추가)
  - [x] 네트워크 에러와 API 에러 구분 처리 (`NetworkError` 타입 구분)
  - [x] `TourList` 컴포넌트에서 초기 에러와 무한 스크롤 에러 구분 처리
  - [x] 무한 스크롤 에러 시 부분 에러 표시 (전체 목록 대체하지 않음)
  - [x] 무한 스크롤 에러 재시도 버튼 추가 (`loadMore` 함수 활용)
- [x] 로딩 상태 개선
  - [x] `LoadingMore` 컴포넌트 접근성 개선 (role="status", aria-live="polite")
  - [x] 로딩 상태 스크린 리더 지원 개선
  - [x] "모든 관광지를 불러왔습니다" 메시지 접근성 개선
- [x] 반응형 디자인 개선
  - [x] 데스크톱 좌측 리스트 스크롤 영역 스타일 개선 (scrollbar-thin 클래스 추가)
  - [x] 우측 지도 영역 최소 너비 설정 (`min-w-0`)으로 오버플로우 방지
- [x] 접근성 개선
  - [x] `TourList` 컴포넌트에 `role="list"`, `aria-label="관광지 목록"` 추가
  - [x] 각 관광지 카드를 `role="listitem"`으로 감싸기
  - [x] 로딩 상태에 `role="status"`, `aria-live="polite"` 추가
  - [x] 빈 상태에 `role="status"`, `aria-live="polite"` 추가
  - [x] 무한 스크롤 에러 재시도 버튼에 `aria-label` 추가
- [x] 성능 최적화
  - [x] `TourCard` 컴포넌트에 `React.memo` 적용 (불필요한 리렌더링 방지)
  - [x] `TourMapContainer` 컴포넌트에 `useCallback` 적용 (핸들러 함수 최적화)
  - [x] `TourMapContainer` 컴포넌트에 `useMemo` 적용 (초기 목록 메모이제이션)
  - [x] 이미지 lazy loading 확인 및 적용 (`loading="lazy"` 속성 추가)
- [x] 코드 정리 및 문서화
  - [x] `app/page.tsx` 헤더 주석에 무한 스크롤 정보 추가
  - [x] `components/tour-list.tsx` 헤더 주석 업데이트 (에러 처리, 접근성 정보 추가)
  - [x] `components/tour-map-container.tsx` 헤더 주석 업데이트 (성능 최적화 정보 추가)
  - [x] `TourListProps` 인터페이스에 `onToursUpdate` prop 문서화

## Phase 3: 상세페이지 (`/places/[contentId]`)

- [x] 페이지 기본 구조
  - [x] `app/places/[contentId]/page.tsx` 생성
    - [x] 동적 라우팅 설정
    - [x] 뒤로가기 버튼 (헤더)
    - [x] 기본 레이아웃 구조
    - [x] 라우팅 테스트

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/back-button.tsx` 생성
  - [x] Client Component로 구현 (useRouter 훅 사용)
  - [x] ArrowLeft 아이콘 사용 (lucide-react)
  - [x] shadcn/ui Button 컴포넌트 사용
  - [x] 브라우저 뒤로가기 기능 (router.back())
  - [x] 홈으로 이동 옵션 (toHome prop)
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트)
  - [x] 접근성 지원 (aria-label, sr-only)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `app/places/[contentId]/page.tsx` 생성
  - [x] Next.js 15 동적 라우팅 패턴 사용 (params Promise 처리)
  - [x] Server Component로 구현 (향후 API 호출 준비)
  - [x] 기본 레이아웃 구조 (max-w-7xl 컨테이너, 반응형 패딩)
  - [x] 뒤로가기 버튼 통합
  - [x] 임시 콘텐츠 추가 (contentId 표시, 향후 섹션 목록)
  - [x] 향후 섹션 추가를 위한 주석 공간 준비
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 현재 단계 및 향후 기능 명시)
  - [x] `app/page.tsx`와 일관된 레이아웃 스타일 적용
- [x] 기본 정보 섹션 (MVP 2.4.1)
  - [x] `components/tour-detail/detail-info.tsx` 생성
    - [x] `getDetailCommon()` API 연동
    - [x] 관광지명 (대제목)
    - [x] 대표 이미지 (크게 표시)
    - [x] 주소 표시 및 복사 기능
      - [x] 클립보드 API 사용
      - [x] 복사 완료 토스트
    - [x] 전화번호 (클릭 시 전화 연결)
    - [x] 홈페이지 (링크)
    - [x] 개요 (긴 설명문)
    - [x] 관광 타입 및 카테고리 뱃지
    - [x] 정보 없는 항목 숨김 처리

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/copy-address-button.tsx` 생성
  - [x] Client Component로 구현 (클립보드 API 사용)
  - [x] Copy/Check 아이콘 사용 (lucide-react)
  - [x] 복사 상태 관리 (useState)
  - [x] HTTPS 환경 확인
  - [x] 복사 완료 토스트 메시지
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트)
  - [x] 접근성 지원 (aria-label, title)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/tour-detail/detail-info.tsx` 생성
  - [x] Server Component로 구현 (getDetailCommon() API 호출)
  - [x] 관광지명 표시 (h1 태그, 반응형 폰트 크기)
  - [x] 대표 이미지 표시 (Next.js Image 컴포넌트, fallback 처리)
  - [x] 주소 표시 및 복사 기능 (CopyAddressButton 컴포넌트 통합)
  - [x] 전화번호 링크 (tel: 프로토콜)
  - [x] 홈페이지 링크 (URL 유효성 검증 및 정규화, 보안 속성 추가)
  - [x] 개요 표시 (여러 줄 텍스트, 줄 간격 조정)
  - [x] 관광 타입 및 카테고리 뱃지 (getContentTypeName() 사용, tour-card.tsx와 동일한 스타일)
  - [x] 조건부 렌더링 (정보 없는 항목 숨김 처리)
  - [x] 에러 처리 (ErrorDisplay 컴포넌트 사용)
  - [x] 레이아웃 및 스타일링 (카드 형태, 반응형 디자인, 다크 모드 지원)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 주요 기능, Props 설명, 사용 예시)
- [x] `app/places/[contentId]/page.tsx` 업데이트
  - [x] DetailInfo 컴포넌트 import 및 추가
  - [x] Suspense로 감싸서 로딩 상태 처리
  - [x] DetailInfoSkeleton 컴포넌트 생성 (로딩 스켈레톤)
  - [x] 임시 콘텐츠 제거
  - [x] 파일 헤더 주석 업데이트 (Phase 3.2 완료 표시)
- [x] 운영 정보 섹션 (MVP 2.4.2)
  - [x] `components/tour-detail/detail-intro.tsx` 생성
    - [x] `getDetailIntro()` API 연동
    - [x] 운영시간/개장시간
    - [x] 휴무일
    - [x] 이용요금
    - [x] 주차 가능 여부
    - [x] 수용인원
    - [x] 체험 프로그램
    - [x] 유모차/반려동물 동반 가능 여부
    - [x] 정보 없는 항목 숨김 처리

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/detail-intro.tsx` 생성
  - [x] Server Component로 구현 (기존 `detail-info.tsx`와 동일한 패턴)
  - [x] Props 인터페이스 정의 (`DetailIntroProps`: `contentId`, `contentTypeId?`)
  - [x] `getDetailIntro()` API 호출
  - [x] `contentTypeId`가 없으면 `getDetailCommon()`을 먼저 호출하여 `contentTypeId` 획득
  - [x] 에러 처리 (`TourApiError` 처리, `ErrorDisplay` 컴포넌트 사용)
  - [x] 운영시간/개장시간 표시 (`usetime` 필드, Clock 아이콘)
  - [x] 휴무일 표시 (`restdate` 필드, CalendarX 아이콘)
  - [x] 이용요금 표시 (타입별 필드: `usefee`, `usefeeleports`, `usefeeaccom`, DollarSign 아이콘)
  - [x] 주차 가능 여부 표시 (`parking` 필드, Car 아이콘)
  - [x] 수용인원 표시 (`accomcount` 필드, Users 아이콘)
  - [x] 체험 프로그램 표시 (`expguide` 필드, BookOpen 아이콘)
  - [x] 유모차 대여 여부 표시 (`chkbabycarriage` 필드, Baby 아이콘)
  - [x] 반려동물 동반 가능 여부 표시 (`chkpet` 필드, Heart 아이콘)
  - [x] 문의처 표시 (`infocenter` 필드, Info 아이콘, 구분선으로 분리)
  - [x] 정보 없는 항목 숨김 처리 (조건부 렌더링, 모든 정보가 없으면 섹션 자체 숨김)
  - [x] 아이콘 사용 (lucide-react: Clock, CalendarX, DollarSign, Car, Users, BookOpen, Baby, Heart, Info)
  - [x] 레이아웃 및 스타일링 (`detail-info.tsx`와 동일한 카드 형태, 아이콘 + 라벨 + 내용 구조)
  - [x] 반응형 디자인 (모바일/데스크톱)
  - [x] 다크 모드 지원
  - [x] 접근성 지원 (aria-label, role="list", role="listitem", aria-labelledby)
  - [x] 긴 텍스트 처리 (`whitespace-pre-line`, `break-words`)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] 로딩 스켈레톤 생성 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailIntroSkeleton` 컴포넌트 생성
  - [x] 운영 정보 항목에 맞는 스켈레톤 UI (섹션 제목, 4개 정보 항목)
- [x] 페이지 통합 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailIntro` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] `DetailInfo` 섹션 다음에 배치
  - [x] 파일 헤더 주석 업데이트 (Phase 3.3 완료 표시)
- [x] 이미지 갤러리 (MVP 2.4.3)
  - [x] `components/tour-detail/detail-gallery.tsx` 생성
    - [x] `getDetailImage()` API 연동
    - [x] 대표 이미지 + 서브 이미지들
    - [x] 이미지 슬라이드 기능 (Swiper 또는 캐러셀)
    - [x] 이미지 클릭 시 전체화면 모달
    - [x] 이미지 없으면 기본 이미지
    - [x] Next.js Image 컴포넌트 사용 (최적화)

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/detail-gallery.tsx` 생성
  - [x] Server Component로 구현 (기존 패턴과 동일)
  - [x] Props 인터페이스 정의 (`DetailGalleryProps`: `contentId`)
  - [x] `getDetailImage()` API 호출 (`numOfRows: 20`)
  - [x] 에러 처리 (`TourApiError` 처리, `ErrorDisplay` 컴포넌트 사용)
  - [x] 이미지 데이터 처리 (`originimgurl` 우선, `smallimageurl` fallback)
  - [x] 이미지 배열이 비어있으면 섹션 숨김 처리
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/tour-detail/image-gallery-client.tsx` 생성
  - [x] Client Component로 구현 (이미지 클릭 이벤트 처리)
  - [x] 대표 이미지 표시 (큰 크기, 첫 번째 이미지)
  - [x] 서브 이미지 그리드 표시 (나머지 이미지들, 2-3열 그리드)
  - [x] 이미지 클릭 시 모달 열기 기능
  - [x] 이미지 에러 처리 (`onError` 핸들러, fallback 이미지)
  - [x] 호버 효과 (이미지 확대, 오버레이)
  - [x] 반응형 디자인 (모바일: 2열, 데스크톱: 3열)
  - [x] Next.js Image 컴포넌트 사용 (`priority` 첫 번째만, `lazy` 나머지)
- [x] `components/tour-detail/image-modal.tsx` 생성
  - [x] Client Component로 구현 (상태 관리 필요)
  - [x] shadcn/ui Dialog 컴포넌트 사용 (전체화면 모달)
  - [x] 이미지 클릭 시 전체화면 모달 열기
  - [x] 모달 내 이미지 슬라이드 (좌우 화살표 버튼)
  - [x] 이미지 번호 표시 (예: "1 / 10")
  - [x] 이미지 설명 표시 (있는 경우)
  - [x] 닫기 버튼 (X 아이콘)
  - [x] ESC 키로 닫기
  - [x] 배경 클릭으로 닫기
  - [x] 키보드 네비게이션 (ArrowLeft, ArrowRight)
  - [x] 접근성 지원 (aria-label, 키보드 네비게이션)
  - [x] 다크 배경 (검은색 반투명 배경)
- [x] 로딩 스켈레톤 생성 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailGallerySkeleton` 컴포넌트 생성
  - [x] 이미지 갤러리 형태의 스켈레톤 UI (대표 이미지 + 서브 이미지 그리드)
- [x] 페이지 통합 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailGallery` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] `DetailIntro` 섹션 다음에 배치
  - [x] 파일 헤더 주석 업데이트 (Phase 3.4 완료 표시)
- [x] 스타일링 및 최적화
  - [x] Next.js Image 컴포넌트 사용 (`priority`, `lazy`, `sizes` 속성)
  - [x] 반응형 디자인 (모바일/데스크톱)
  - [x] 이미지 에러 처리 (fallback 이미지, ImageIcon)
  - [x] 접근성 지원 (alt 텍스트, aria-label)
  - [x] 호버 효과 (이미지 확대, 커서 포인터)
- [x] 지도 섹션 (MVP 2.4.4)
  - [x] `components/tour-detail/detail-map.tsx` 생성
    - [x] 해당 관광지 위치 표시
    - [x] 마커 1개 표시
    - [x] "길찾기" 버튼
      - [x] 네이버 지도 앱/웹 연동
      - [x] URL: `https://map.naver.com/v5/directions/{좌표}`
    - [x] 좌표 정보 표시 (선택 사항)

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/detail-map.tsx` 생성
  - [x] Server Component로 구현 (기존 패턴과 동일)
  - [x] Props 인터페이스 정의 (`DetailMapProps`: `contentId`)
  - [x] `getDetailCommon()` API 호출하여 좌표 정보 획득 (`mapx`, `mapy`)
  - [x] 에러 처리 (`TourApiError` 처리, `ErrorDisplay` 컴포넌트 사용)
  - [x] 좌표 정보가 없으면 섹션 숨김 처리
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/tour-detail/detail-map-client.tsx` 생성
  - [x] Client Component로 구현 (Naver Maps API 사용)
  - [x] 좌표 변환 함수 구현 (`parseCoordinates`: KATEC → WGS84)
  - [x] Naver Maps API 스크립트 동적 로드 (기존 로직 재사용)
  - [x] 지도 초기화 (관광지 좌표 중심, 줌 레벨 15)
  - [x] 마커 1개 표시 (해당 관광지 위치)
  - [x] 마커 클릭 시 인포윈도우 (관광지명, 주소)
  - [x] 초기 인포윈도우 자동 열기
  - [x] 지도 컨트롤 추가 (줌 인/아웃, 지도 유형 선택)
  - [x] 반응형 디자인 (모바일: 400px, 데스크톱: 500px)
  - [x] 에러 처리 (API 스크립트 로드 실패, 지도 초기화 실패, 좌표 파싱 실패)
  - [x] 로딩 상태 관리 (스켈레톤 UI)
  - [x] cleanup 처리 (마커 및 인포윈도우 제거)
- [x] `components/tour-detail/directions-button.tsx` 생성
  - [x] Client Component로 구현
  - [x] 네이버 지도 길찾기 URL 생성 (`https://map.naver.com/v5/directions/-/{lng},{lat}`)
  - [x] 외부 링크로 열기 (`target="_blank"`, `rel="noopener noreferrer"`)
  - [x] Navigation 아이콘 사용 (lucide-react)
  - [x] 반응형 디자인 (모바일: 전체 너비, 데스크톱: 자동 너비)
  - [x] 접근성 지원 (aria-label)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] 로딩 스켈레톤 생성 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailMapSkeleton` 컴포넌트 생성
  - [x] 지도 형태의 스켈레톤 UI (섹션 제목, 지도 영역, 버튼 영역)
- [x] 페이지 통합 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailMap` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] `DetailGallery` 섹션 다음에 배치
  - [x] 파일 헤더 주석 업데이트 (Phase 3.5 완료 표시)
- [x] 스타일링 및 UX 개선
  - [x] 지도 컨테이너 스타일링 (카드 형태, 반응형 높이)
  - [x] 길찾기 버튼 위치 (지도 아래, 왼쪽 정렬)
  - [x] 접근성 지원 (aria-label, role="application")
  - [x] 에러 상태 처리 (ErrorDisplay 컴포넌트)
- [x] 공유 기능 (MVP 2.4.5)
  - [x] `components/tour-detail/share-button.tsx` 생성
    - [x] URL 복사 기능
      - [x] `navigator.clipboard.writeText()` 사용
      - [x] HTTPS 환경 확인
    - [x] 복사 완료 토스트 메시지
    - [x] 공유 아이콘 버튼 (Share2 아이콘)
  - [x] Open Graph 메타태그
    - [x] `app/places/[contentId]/page.tsx`에 Metadata 생성
    - [x] `og:title` - 관광지명
    - [x] `og:description` - 관광지 설명 (100자 이내)
    - [x] `og:image` - 대표 이미지 (1200x630 권장)
    - [x] `og:url` - 상세페이지 URL
    - [x] `og:type` - "website"

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/share-button.tsx` 생성
  - [x] Client Component로 구현 (클립보드 API 사용)
  - [x] `copy-address-button.tsx` 패턴 참고하여 일관된 UX 제공
  - [x] Props 인터페이스 정의 (`ShareButtonProps`: `url?`, `className?`, `size?`, `variant?`)
  - [x] 현재 페이지 URL 자동 감지 (`useEffect`로 `window.location.href` 가져오기)
  - [x] URL 복사 기능 (`navigator.clipboard.writeText()`)
  - [x] HTTPS 환경 확인 (클립보드 API 사용 가능 여부)
  - [x] 복사 상태 관리 (`useState`로 `copied` 상태)
  - [x] 복사 완료 토스트 메시지 (`toast.success()`)
  - [x] 에러 처리 (`toast.error()`)
  - [x] 2초 후 복사 상태 자동 초기화
  - [x] Share2 아이콘 사용 (lucide-react)
  - [x] 복사 완료 시 Check 아이콘으로 변경
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트)
  - [x] 접근성 지원 (aria-label, title, sr-only)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] 상세페이지에 공유 버튼 추가 (`app/places/[contentId]/page.tsx`)
  - [x] `ShareButton` 컴포넌트 import
  - [x] 뒤로가기 버튼 옆에 공유 버튼 배치 (flex 레이아웃, `gap-2`)
  - [x] 파일 헤더 주석 업데이트 (Phase 3.6 완료 표시)
- [x] Open Graph 메타태그 동적 생성 (`app/places/[contentId]/page.tsx`)
  - [x] Next.js 15의 `generateMetadata` 함수 추가
  - [x] `params`에서 `contentId` 추출 (Promise 처리)
  - [x] `getDetailCommon()` API 호출하여 관광지 정보 가져오기
  - [x] 에러 처리 (API 호출 실패 시 기본 메타데이터 반환)
  - [x] 절대 URL 생성 (`headers()` 사용, `NEXT_PUBLIC_SITE_URL` 환경변수 지원)
  - [x] `og:title` 설정 (관광지명)
  - [x] `og:description` 설정 (관광지 설명, HTML 태그 제거, 100자 이내)
  - [x] `og:image` 설정 (대표 이미지 우선, 없으면 기본 이미지)
  - [x] `og:url` 설정 (상세페이지 절대 URL)
  - [x] `og:type` 설정 ("website")
  - [x] `og:siteName` 설정 ("My Trip")
  - [x] `og:locale` 설정 ("ko_KR")
  - [x] Twitter Card 메타태그 설정 (`summary_large_image`)
  - [x] 기본 메타데이터 설정 (`title`, `description`)
- [x] 메타데이터 유틸리티 함수 생성 (`lib/utils/metadata.ts`)
  - [x] `stripHtmlTags()` 함수 (HTML 태그 제거)
  - [x] `truncateText()` 함수 (텍스트 길이 제한)
  - [x] `cleanText()` 함수 (줄바꿈 및 연속 공백 제거)
  - [x] `prepareDescription()` 함수 (HTML 태그 제거 + 텍스트 정리 + 길이 제한)
- [x] 북마크 기능 (MVP 2.4.5)
  - [x] `components/bookmarks/bookmark-button.tsx` 생성
    - [x] 별 아이콘 (채워짐/비어있음)
    - [x] 북마크 상태 확인 (Supabase 조회)
    - [x] 북마크 추가/제거 기능
    - [x] 인증된 사용자 확인 (Clerk)
    - [x] 로그인하지 않은 경우: 로그인 유도 (SignInButton)
  - [x] Supabase 연동
    - [x] `lib/api/supabase-api.ts` 생성
      - [x] `getUserFromClerkId()` - Clerk ID로 user_id 조회
      - [x] `getBookmark()` - 북마크 조회
      - [x] `addBookmark()` - 북마크 추가
      - [x] `removeBookmark()` - 북마크 제거
      - [x] `getUserBookmarks()` - 사용자 북마크 목록
    - [x] `bookmarks` 테이블 사용 (db.sql 참고)
      - [x] `user_id` (users 테이블 참조)
      - [x] `content_id` (한국관광공사 API contentid)
      - [x] UNIQUE 제약 (user_id, content_id)
  - [x] 상세페이지에 북마크 버튼 추가

---

**추가 개발 사항 (2025-01-XX):**

- [x] `lib/api/supabase-api.ts` 생성
  - [x] Supabase 데이터베이스 쿼리 함수들 제공
  - [x] 타입 정의 (`SupabaseUser`, `SupabaseBookmark`)
  - [x] `getUserFromClerkId()` 함수 (Clerk ID로 Supabase user_id 조회)
  - [x] `getBookmark()` 함수 (특정 관광지 북마크 조회)
  - [x] `addBookmark()` 함수 (북마크 추가, UNIQUE 제약 처리)
  - [x] `removeBookmark()` 함수 (북마크 제거)
  - [x] `getUserBookmarks()` 함수 (사용자의 모든 북마크 목록 조회, created_at 내림차순)
  - [x] 에러 처리 (PGRST116, 23505 등 Supabase 에러 코드 처리)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] `components/bookmarks/bookmark-button.tsx` 생성
  - [x] Client Component로 구현 (Clerk 인증 및 Supabase 클라이언트 사용)
  - [x] `share-button.tsx` 패턴 참고하여 일관된 UX 제공
  - [x] Props 인터페이스 정의 (`BookmarkButtonProps`: `contentId`, `className?`, `size?`, `variant?`)
  - [x] Clerk 인증 상태 확인 (`useAuth()`, `useUser()`)
  - [x] 북마크 상태 확인 (`useState`로 `isBookmarked` 상태)
  - [x] 북마크 상태 초기 조회 (`useEffect`로 마운트 시 조회)
  - [x] 로딩 상태 관리 (`isLoading`, `isChecking` 상태)
  - [x] 북마크 추가/제거 토글 기능
  - [x] Supabase 클라이언트 사용 (`useClerkSupabaseClient()`)
  - [x] Clerk ID로 Supabase user_id 조회 (`getUserFromClerkId()`)
  - [x] 북마크 추가/제거 시 토스트 메시지 표시 (`toast.success()`, `toast.error()`)
  - [x] 로그인하지 않은 경우: SignInButton 표시 (모달 모드)
  - [x] Star 아이콘 사용 (lucide-react)
  - [x] 북마크된 경우: 채워진 별 (`fill-yellow-400 text-yellow-400`)
  - [x] 북마크되지 않은 경우: 빈 별
  - [x] 로딩 중: Loader2 스피너 아이콘 표시
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트)
  - [x] 접근성 지원 (aria-label, title, sr-only)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] 상세페이지에 북마크 버튼 추가 (`app/places/[contentId]/page.tsx`)
  - [x] `BookmarkButton` 컴포넌트 import
  - [x] 공유 버튼 옆에 북마크 버튼 배치 (flex 레이아웃, `gap-2`)
  - [x] `contentId` prop 전달
  - [x] 파일 헤더 주석 업데이트 (Phase 3.7 완료 표시)
- [x] 반려동물 정보 섹션 (MVP 2.5)
  - [x] `components/tour-detail/detail-pet-tour.tsx` 생성
    - [x] `getDetailPetTour()` API 연동
    - [x] 반려동물 동반 가능 여부 표시
    - [x] 반려동물 크기 제한 정보
    - [x] 반려동물 입장 가능 장소 (실내/실외)
    - [x] 반려동물 동반 추가 요금
    - [x] 반려동물 전용 시설 정보
    - [x] 아이콘 및 뱃지 디자인 (🐾)
    - [x] 주의사항 강조 표시

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/tour-detail/detail-pet-tour.tsx` 생성
  - [x] Server Component로 구현 (기존 `detail-intro.tsx`와 동일한 패턴)
  - [x] Props 인터페이스 정의 (`DetailPetTourProps`: `contentId`)
  - [x] `getDetailPetTour()` API 호출
  - [x] 에러 처리 (`TourApiError` 처리, `ErrorDisplay` 컴포넌트 사용)
  - [x] 반려동물 동반 가능 여부 표시 (`chkpetleash` 필드, PawPrint 아이콘, 강조 표시)
  - [x] 반려동물 크기 제한 정보 표시 (`chkpetsize` 필드, Ruler 아이콘, `getPetSizeLabel()` 유틸리티 사용)
  - [x] 입장 가능 장소 표시 (`chkpetplace` 필드, Home 아이콘)
  - [x] 추가 요금 표시 (`chkpetfee` 필드, DollarSign 아이콘)
  - [x] 주차장 정보 표시 (`parking` 필드, Car 아이콘)
  - [x] 기타 반려동물 정보 표시 (`petinfo` 필드, Info 아이콘)
  - [x] 주의사항 강조 표시 (petinfo에 주의사항 키워드 포함 시 AlertTriangle 아이콘, 경고 색상 배지)
  - [x] 정보 없는 항목 숨김 처리 (조건부 렌더링, 모든 정보가 없으면 섹션 자체 숨김)
  - [x] 아이콘 사용 (lucide-react: PawPrint, Ruler, Home, DollarSign, Info, Car, AlertTriangle)
  - [x] 레이아웃 및 스타일링 (`detail-intro.tsx`와 동일한 카드 형태, 아이콘 + 라벨 + 내용 구조)
  - [x] 반응형 디자인 (모바일/데스크톱)
  - [x] 다크 모드 지원
  - [x] 접근성 지원 (aria-label, role="list", role="listitem", aria-labelledby)
  - [x] 긴 텍스트 처리 (`whitespace-pre-line`, `break-words`)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
- [x] 로딩 스켈레톤 생성 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailPetTourSkeleton` 컴포넌트 생성
  - [x] 반려동물 정보 항목에 맞는 스켈레톤 UI (섹션 제목, 5개 정보 항목)
- [x] 페이지 통합 (`app/places/[contentId]/page.tsx`)
  - [x] `DetailPetTour` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] `DetailIntro` 섹션 다음에 배치
  - [x] 파일 헤더 주석 업데이트 (Phase 3.8 완료 표시)
- [ ] 추천 관광지 섹션 (선택 사항)
  - [ ] 같은 지역 또는 타입의 다른 관광지 추천
  - [ ] 카드 형태로 표시
- [x] 최종 통합 및 스타일링
  - [x] 모든 섹션 통합
  - [x] 반응형 디자인 확인
  - [x] 모바일 최적화
  - [x] 접근성 확인 (ARIA 라벨, 키보드 네비게이션)

---

**추가 개발 사항 (2025-01-XX):**

- [x] 모든 섹션 통합 확인 및 정리 (`app/places/[contentId]/page.tsx`)
  - [x] 섹션 순서 확인 (기본 정보 → 운영 정보 → 반려동물 정보 → 이미지 갤러리 → 지도)
  - [x] 불필요한 TODO 주석 제거
  - [x] 섹션 간 간격 확인 (`space-y-8` 클래스)
  - [x] 로딩 스켈레톤 일관성 확인
- [x] 반응형 디자인 최종 점검
  - [x] 모바일 화면 (320px ~ 768px) 확인 및 개선
  - [x] 태블릿 화면 (768px ~ 1024px) 확인
  - [x] 데스크톱 화면 (1024px 이상) 확인
  - [x] 패딩 및 마진 값 최적화 (`p-4 md:p-6`, `py-8 md:py-12`)
- [x] 모바일 최적화 확인 및 개선
  - [x] 터치 타겟 크기 확인 (최소 44x44px, 버튼 `size="sm"` 사용)
  - [x] 이미지 최적화 확인 (`sizes` 속성 적절히 설정)
  - [x] 폰트 크기 확인 (`text-sm`, `text-base` 등)
  - [x] 간격 최적화 확인
- [x] 접근성 최종 점검 및 개선
  - [x] 모든 섹션에 `aria-labelledby` 속성 추가 (`detail-info.tsx` 포함)
  - [x] 시맨틱 HTML 확인 (`<section>`, `<h1>`, `<h2>` 등)
  - [x] 키보드 네비게이션 확인 (Button 컴포넌트의 기본 포커스 스타일 활용)
  - [x] ARIA 라벨 확인 (모든 인터랙티브 요소에 `aria-label` 추가)
  - [x] 스크린 리더 지원 확인 (`sr-only`, `aria-hidden` 등)
- [x] 스타일 일관성 확인
  - [x] 카드 스타일 통일 (`rounded-lg border bg-card p-4 md:p-6`)
  - [x] 패딩 일관성 확인 (모든 섹션 동일한 패딩 사용)
  - [x] 제목 스타일 통일 (`text-xl md:text-2xl font-bold`, detail-info는 `h1`로 `text-2xl md:text-3xl`)
  - [x] 아이콘 스타일 통일 (`h-5 w-5 mt-0.5 text-muted-foreground`)
  - [x] 간격 일관성 확인 (`space-y-4`, detail-info는 `space-y-6`)
- [x] 코드 정리
  - [x] 불필요한 주석 제거 (TODO 주석)
  - [x] 파일 헤더 주석 업데이트 (Phase 3.9 완료 표시)

## Phase 4: 통계 대시보드 페이지 (`/stats`)

- [x] 페이지 기본 구조
  - [x] `app/stats/page.tsx` 생성
    - [x] 기본 레이아웃 구조
    - [x] 반응형 레이아웃 설정 (모바일 우선)
    - [x] Server Component로 구현

---

**추가 개발 사항 (2025-01-XX):**

- [x] `app/stats/page.tsx` 생성
  - [x] Server Component로 구현 (기존 페이지 패턴과 동일)
  - [x] 기본 레이아웃 구조 (`max-w-7xl`, 반응형 패딩)
  - [x] 페이지 제목 추가 ("통계 대시보드", `h1` 태그)
  - [x] 향후 섹션을 위한 구조 준비 (통계 요약, 지역별 차트, 타입별 차트 섹션)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 현재 단계 및 향후 기능 명시)
  - [x] 접근성 지원 (시맨틱 HTML, `aria-labelledby`, `sr-only` 클래스)
  - [x] 반응형 디자인 확인 (모바일/태블릿/데스크톱)
- [x] 통계 데이터 수집
  - [x] `lib/api/stats-api.ts` 생성
    - [x] `getRegionStats()` - 지역별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 지역별 totalCount 조회
      - [x] 지역 코드별로 API 호출
    - [x] `getTypeStats()` - 타입별 관광지 개수 집계
      - [x] `areaBasedList2` API로 각 타입별 totalCount 조회
      - [x] contentTypeId별로 API 호출
    - [x] `getStatsSummary()` - 전체 통계 요약
      - [x] 전체 관광지 수
      - [x] Top 3 지역
      - [x] Top 3 타입
      - [x] 마지막 업데이트 시간
    - [x] 병렬 API 호출로 성능 최적화
    - [x] 에러 처리 및 재시도 로직
    - [x] 데이터 캐싱 (revalidate: 3600)

---

**추가 개발 사항 (2025-01-XX):**

- [x] `lib/api/stats-api.ts` 생성
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 주요 기능, 의존성 정보)
  - [x] `getRegionStats()` 함수 구현
    - [x] `getAreaCode()`로 전체 지역 목록 조회
    - [x] 각 지역별로 `getAreaBasedList()` 병렬 호출 (`Promise.allSettled()`)
    - [x] `totalCount`만 추출하여 `RegionStats[]` 반환
    - [x] count 기준 내림차순 정렬
    - [x] 부분 실패 허용 (개별 지역 조회 실패 시 해당 지역 제외)
    - [x] 에러 로깅 (`console.error`)
  - [x] `getTypeStats()` 함수 구현
    - [x] `CONTENT_TYPE_IDS` 배열 사용
    - [x] 각 타입별로 `getAreaBasedList()` 병렬 호출 (`Promise.allSettled()`)
    - [x] `totalCount`만 추출
    - [x] 전체 합계로 비율(`percentage`) 계산 (소수점 첫째 자리까지)
    - [x] count 기준 내림차순 정렬
    - [x] 부분 실패 허용 (개별 타입 조회 실패 시 해당 타입 제외)
    - [x] 에러 로깅 (`console.error`)
  - [x] `getStatsSummary()` 함수 구현
    - [x] `getRegionStats()`와 `getTypeStats()` 병렬 호출 (`Promise.all()`)
    - [x] 전체 관광지 수 계산 (지역별 합계)
    - [x] Top 3 지역 추출 (이미 정렬된 배열에서 slice(0, 3))
    - [x] Top 3 타입 추출 (이미 정렬된 배열에서 slice(0, 3))
    - [x] 마지막 업데이트 시간 설정 (`new Date().toISOString()`)
    - [x] 전체 실패 시 기본값 반환
  - [x] `getStatsData()` 통합 함수 구현 (선택 사항)
    - [x] `getRegionStats()`, `getTypeStats()`, `getStatsSummary()` 병렬 호출
    - [x] `StatsData` 타입으로 반환
  - [x] 데이터 캐싱 설정
    - [x] `export const revalidate = 3600` (1시간 캐싱)
  - [x] 타입 안전성
    - [x] 모든 함수에 명시적 타입 정의 (`Promise<RegionStats[]>`, `Promise<TypeStats[]>`, `Promise<StatsSummary>`, `Promise<StatsData>`)
    - [x] `lib/types/stats.ts`의 타입 활용
- [x] 통계 요약 카드
  - [x] `components/stats/stats-summary.tsx` 생성
    - [x] 전체 관광지 수 표시
    - [x] Top 3 지역 표시 (카드 형태)
    - [x] Top 3 타입 표시 (카드 형태)
    - [x] 마지막 업데이트 시간 표시
    - [x] 로딩 상태 (Skeleton UI)
    - [x] 카드 레이아웃 디자인

---

**추가 개발 사항 (2025-01-XX):**

- [x] `components/stats/stats-summary.tsx` 생성
  - [x] Server Component로 구현 (기존 `detail-info.tsx`, `detail-intro.tsx` 패턴 참고)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 주요 기능, 의존성 정보)
  - [x] 전체 관광지 수 카드 구현
    - [x] 큰 숫자 표시 (`text-3xl md:text-4xl font-bold`)
    - [x] 숫자 포맷팅 (`formatNumber()` 함수, 천 단위 구분 기호)
    - [x] BarChart3 아이콘 사용
    - [x] 카드 스타일 (`rounded-lg border bg-card p-4 md:p-6`)
  - [x] Top 3 지역 카드 구현
    - [x] 순위별 아이콘 (Trophy, Medal, Award)
    - [x] 순위별 색상 구분 (1위: 노란색, 2위: 회색, 3위: 주황색)
    - [x] 지역명과 개수 표시
    - [x] MapPin 아이콘 사용
    - [x] 리스트 형태로 표시 (`<ul>`, `<li>`)
  - [x] Top 3 타입 카드 구현
    - [x] 순위별 아이콘 및 색상 구분
    - [x] 타입명과 개수 표시
    - [x] Tag 아이콘 사용
    - [x] 리스트 형태로 표시
  - [x] 마지막 업데이트 시간 표시
    - [x] Clock 아이콘 사용
    - [x] 날짜 포맷팅 (`formatLastUpdated()` 함수, ISO 8601 → 사용자 친화적 형식)
    - [x] 작은 텍스트, muted 색상
  - [x] StatsSummarySkeleton 컴포넌트 생성
    - [x] 3개 카드의 스켈레톤 UI
    - [x] 각 카드 내부 스켈레톤 요소들
  - [x] 에러 처리
    - [x] ErrorDisplay 컴포넌트 사용
    - [x] TourApiError 처리
  - [x] 그리드 레이아웃 구현
    - [x] 반응형 디자인 (모바일: 1열, 태블릿: 2열, 데스크톱: 3열)
    - [x] 카드 간 간격 (`gap-4 md:gap-6`)
  - [x] 접근성 지원
    - [x] 시맨틱 HTML (`<section>`, `<h2>`, `<ul>`, `<li>`)
    - [x] ARIA 라벨 (`aria-labelledby`, `role="list"`, `role="listitem"`)
    - [x] 순위 정보를 텍스트로 명확히 표시
  - [x] 유틸리티 함수 구현
    - [x] `formatNumber()`: 숫자 포맷팅 (천 단위 구분 기호)
    - [x] `formatLastUpdated()`: 날짜 포맷팅 (ISO 8601 → 사용자 친화적 형식)
    - [x] `getRankIcon()`: 순위에 따른 아이콘 반환
    - [x] `getRankColor()`: 순위에 따른 색상 클래스 반환
- [x] 통계 페이지에 컴포넌트 통합 (`app/stats/page.tsx`)
  - [x] `StatsSummary` 컴포넌트 import
  - [x] `StatsSummarySkeleton` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] 파일 헤더 주석 업데이트 (Phase 4.3 완료 표시)
- [x] 지역별 분포 차트 (Bar Chart)
  - [x] `components/stats/region-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Bar)
    - [x] recharts 기반 Bar Chart 구현
    - [x] X축: 지역명 (서울, 부산, 제주 등)
    - [x] Y축: 관광지 개수
    - [x] 상위 10개 지역 표시 (또는 전체)
    - [x] 바 클릭 시 해당 지역 목록 페이지로 이동
    - [x] 호버 시 정확한 개수 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨, 키보드 네비게이션)

---

**추가 개발 사항 (2025-01-XX):**

- [x] shadcn/ui Chart 컴포넌트 설치
  - [x] `pnpm dlx shadcn@latest add chart` 실행
  - [x] `components/ui/chart.tsx` 파일 생성 확인
  - [x] recharts 의존성 자동 추가 확인
- [x] `components/stats/region-chart.tsx` 생성
  - [x] Server Component로 구현 (기존 `stats-summary.tsx` 패턴 참고)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식, 주요 기능, 의존성 정보)
  - [x] `getRegionStats()` 함수 호출
  - [x] 에러 처리 (`TourApiError` 처리, `ErrorDisplay` 컴포넌트 사용)
  - [x] 데이터 없음 처리 (빈 상태 메시지)
  - [x] `RegionChartSkeleton` 컴포넌트 생성 (로딩 상태용 스켈레톤 UI)
- [x] `components/stats/region-chart-client.tsx` 생성
  - [x] Client Component로 구현 (recharts 사용, 바 클릭 이벤트 처리)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
  - [x] recharts Bar Chart 구현
    - [x] `BarChart`, `Bar`, `XAxis`, `YAxis`, `CartesianGrid` 컴포넌트 사용
    - [x] `ChartContainer`, `ChartTooltip`, `ChartTooltipContent` 사용 (shadcn/ui)
    - [x] 상위 10개 지역만 표시 (`.slice(0, 10)`)
    - [x] 차트 데이터 변환 (`RegionStats[]` → 차트 데이터 형식)
  - [x] 바 클릭 이벤트 처리
    - [x] `handleBarClick` 함수 구현
    - [x] `Cell` 컴포넌트를 사용하여 개별 바에 onClick 이벤트 추가
    - [x] `useRouter`를 사용하여 해당 지역 목록 페이지로 이동 (`/?areaCode={code}`)
    - [x] 클릭 가능한 바 스타일 적용 (`cursor-pointer`, `hover:opacity-80`)
  - [x] 호버 시 Tooltip 표시
    - [x] `ChartTooltip` 컴포넌트 사용
    - [x] 지역명, 관광지 개수, 클릭 안내 메시지 표시
    - [x] 숫자 포맷팅 (`formatNumber()` 함수)
  - [x] 반응형 디자인
    - [x] 차트 높이 (모바일: 300px, 데스크톱: 400px)
    - [x] X축 레이블 회전 (-45도, 모바일에서 겹침 방지)
    - [x] 반응형 너비 (전체 너비)
  - [x] 접근성 지원
    - [x] `role="img"` (차트 영역)
    - [x] `aria-label` (차트 설명)
    - [x] 시맨틱 HTML 구조
  - [x] 다크/라이트 모드 지원
    - [x] Tailwind CSS 테마 변수 사용 (`hsl(var(--chart-1))`)
    - [x] `stroke-muted`, `text-muted-foreground` 클래스 사용
- [x] 통계 페이지에 컴포넌트 통합 (`app/stats/page.tsx`)
  - [x] `RegionChart` 컴포넌트 import
  - [x] `RegionChartSkeleton` 컴포넌트 import
  - [x] `Suspense`로 감싸서 로딩 상태 처리
  - [x] 기존 placeholder 섹션을 실제 컴포넌트로 교체
  - [x] 파일 헤더 주석 업데이트 (Phase 4.4 완료 표시)
- [x] 타입별 분포 차트 (Donut Chart)
  - [x] `components/stats/type-chart.tsx` 생성
    - [x] shadcn/ui Chart 컴포넌트 설치 (Pie/Donut)
    - [x] recharts 기반 Donut Chart 구현
    - [x] 타입별 비율 (백분율)
    - [x] 타입별 개수 표시
    - [x] 섹션 클릭 시 해당 타입 목록 페이지로 이동
    - [x] 호버 시 타입명, 개수, 비율 표시
    - [x] 다크/라이트 모드 지원
    - [x] 반응형 디자인
    - [x] 로딩 상태
    - [x] 접근성 (ARIA 라벨)
    - [x] `components/stats/type-chart-client.tsx` 생성 (Client Component)
    - [x] Server/Client Component 분리 구조
    - [x] ChartConfig를 사용한 타입별 색상 설정
    - [x] ChartLegendContent를 사용한 범례 표시
    - [x] 반응형 크기 조정 (innerRadius/outerRadius를 퍼센트로 설정)
    - [x] 범례 스타일 개선 (flex-wrap, gap 조정)
    ***
    - **추가 개발 사항**
    - [x] `components/stats/type-chart-client.tsx` 생성 (Client Component)
    - [x] Server/Client Component 분리 구조 구현
    - [x] ChartConfig를 사용한 타입별 색상 설정 (contentTypeId를 키로 사용)
    - [x] ChartLegendContent를 사용한 범례 표시 (nameKey="contentTypeId")
    - [x] 반응형 크기 조정 (innerRadius="40%", outerRadius="80%"로 퍼센트 설정)
    - [x] 범례 스타일 개선 (flex-wrap, gap 조정)
    - [x] `app/stats/page.tsx`에 TypeChart 컴포넌트 통합
    - [x] Suspense로 감싸서 로딩 상태 처리
    - [x] 파일 헤더 주석 업데이트 (Phase 4.5 완료 표시)
- [x] 페이지 통합
  - [x] `app/stats/page.tsx`에 모든 컴포넌트 통합
    - [x] 통계 요약 카드 (상단)
    - [x] 지역별 분포 차트 (중단)
    - [x] 타입별 분포 차트 (하단)
  - [x] 에러 처리 (에러 메시지 + 재시도 버튼)
    - [x] `components/stats/error-with-retry.tsx` 생성 (Client Component 래퍼)
    - [x] `StatsSummary` 컴포넌트에 재시도 기능 추가
    - [x] `RegionChart` 컴포넌트에 재시도 기능 추가
    - [x] `TypeChart` 컴포넌트에 재시도 기능 추가
  - [x] 네비게이션에 통계 페이지 링크 추가
  - [x] 최종 페이지 확인
    - [x] 페이지 구조 및 레이아웃 확인 (섹션 순서, 레이아웃 구조, 페이지 제목)
    - [x] 컴포넌트 통합 상태 확인 (Suspense, 스켈레톤 연결, 간격 일관성)
    - [x] 코드 품질 확인 (파일 헤더 주석 업데이트, 불필요한 코드 제거, 타입 안전성)
    - [x] 파일 헤더 주석 업데이트 (Phase 4.6 완료 표시)

## Phase 5: 북마크 페이지 (`/bookmarks`) - 선택 사항

- [x] Supabase 설정 확인
  - [x] `bookmarks` 테이블 확인 (db.sql 참고)
    - [x] `users` 테이블과의 관계 확인
    - [x] 인덱스 확인 (user_id, content_id, created_at)
    - [x] RLS 비활성화 확인 (개발 환경)

---

**추가 개발 사항 (2025-01-XX):**

- [x] 코드 레벨 검증 완료
  - [x] `supabase/migrations/db.sql` 마이그레이션 파일 검증
    - [x] `users` 테이블 구조 확인 (id, clerk_id, name, created_at)
    - [x] `bookmarks` 테이블 구조 확인 (id, user_id, content_id, created_at)
    - [x] 외래 키 관계 확인 (`bookmarks.user_id` → `users.id` ON DELETE CASCADE)
    - [x] UNIQUE 제약 확인 (`unique_user_bookmark`, `users.clerk_id`)
    - [x] 인덱스 확인 (`idx_bookmarks_user_id`, `idx_bookmarks_content_id`, `idx_bookmarks_created_at`)
    - [x] RLS 비활성화 확인 (개발 환경)
    - [x] 권한 부여 확인 (anon, authenticated, service_role)
  - [x] 타입 정의 검증 (`lib/api/supabase-api.ts`)
    - [x] `SupabaseUser` 인터페이스가 `users` 테이블 구조와 일치하는지 확인
    - [x] `SupabaseBookmark` 인터페이스가 `bookmarks` 테이블 구조와 일치하는지 확인
  - [x] API 함수 검증 (`lib/api/supabase-api.ts`)
    - [x] `getUserFromClerkId()`: 올바른 컬럼 사용 확인
    - [x] `getBookmark()`: 올바른 조건 사용 확인
    - [x] `addBookmark()`: INSERT 쿼리 확인
    - [x] `removeBookmark()`: DELETE 쿼리 확인
    - [x] `getUserBookmarks()`: ORDER BY 확인
  - [x] 환경변수 확인
    - [x] `NEXT_PUBLIC_SUPABASE_URL` 문서화 확인
    - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` 문서화 확인
    - [x] `SUPABASE_SERVICE_ROLE_KEY` 문서화 확인
  - [x] 검증 결과 문서화 (`docs/SUPABASE_VERIFICATION.md`)
    - [x] 테이블 구조 검증 결과 문서화
    - [x] 인덱스 검증 결과 문서화
    - [x] 외래 키 관계 검증 결과 문서화
    - [x] RLS 상태 검증 결과 문서화
    - [x] 수동 확인 필요 항목 명시
- [x] 북마크 목록 페이지
  - [x] `app/bookmarks/page.tsx` 생성
    - [x] 인증된 사용자만 접근 가능
    - [x] 로그인하지 않은 경우 로그인 유도
  - [x] `components/bookmarks/bookmark-list.tsx` 생성
    - [x] 사용자 북마크 목록 조회 (`getUserBookmarks()`)
    - [x] 카드 레이아웃 (홈페이지와 동일한 tour-card 사용)
    - [x] 빈 상태 처리 (북마크 없을 때)
    - [x] 로딩 상태 (Skeleton UI)

---

**추가 개발 사항 (2025-01-XX):**

- [x] 북마크 관광지 정보 조회 API 함수 생성
  - [x] `lib/api/bookmark-api.ts` 생성
    - [x] `getBookmarkedTours()` 함수 구현
    - [x] 여러 관광지 정보 병렬 조회 (`Promise.allSettled()`)
    - [x] 부분 실패 허용 (일부 실패해도 나머지 성공한 데이터 반환)
    - [x] TourDetail을 TourItem 형식으로 변환
    - [x] 에러 로깅 (실패한 contentId 기록)
- [x] 북마크 목록 페이지 생성 (`app/bookmarks/page.tsx`)
  - [x] Server Component로 구현 (Next.js 15 App Router)
  - [x] Clerk 인증 확인 (`auth()` 함수)
  - [x] 로그인하지 않은 경우 `/sign-in?redirect=/bookmarks`로 리다이렉트
  - [x] Supabase 클라이언트 생성 (`createClient()`)
  - [x] Clerk ID로 Supabase user_id 조회 (`getUserFromClerkId()`)
  - [x] 북마크 목록 조회 (`getUserBookmarks()`)
  - [x] 북마크한 관광지 상세 정보 조회 (`getBookmarkedTours()`)
  - [x] 기본 레이아웃 구조 (`app/stats/page.tsx` 패턴 참고)
  - [x] 페이지 제목 ("내 북마크")
  - [x] Suspense로 로딩 상태 처리
  - [x] 에러 처리 (`ErrorDisplay` 컴포넌트)
  - [x] 메타데이터 설정
- [x] 북마크 목록 컴포넌트 생성 (`components/bookmarks/bookmark-list.tsx`)
  - [x] Server Component로 구현
  - [x] Props 인터페이스 정의 (`BookmarkListProps`)
  - [x] `TourCard` 컴포넌트 재사용
  - [x] 정렬 기능 구현 (최신순, 이름순, 지역별)
  - [x] 빈 상태 처리 (`EmptyState` 컴포넌트)
  - [x] 카드 레이아웃 (그리드: 모바일 1열, 태블릿 2열, 데스크톱 3열)
  - [x] 로딩 스켈레톤 (`BookmarkListSkeleton` 컴포넌트)
  - [x] 접근성 지원 (role, aria-label)
- [x] 정렬 UI 컴포넌트 생성 (`components/bookmarks/bookmark-sort.tsx`)
  - [x] Client Component로 구현
  - [x] 정렬 옵션 선택 UI (버튼 그룹)
  - [x] URL 쿼리 파라미터로 정렬 상태 관리 (`useRouter`, `useSearchParams`)
  - [x] 정렬 옵션 (최신순, 이름순, 지역별)
  - [x] 선택된 옵션 시각적 구분 (variant="default" vs "outline")
  - [x] 아이콘 사용 (Calendar, FileText, MapPin)
  - [x] 반응형 디자인 (모바일: 아이콘만, 데스크톱: 아이콘 + 텍스트)
  - [x] 접근성 지원 (aria-label, aria-pressed)
- [x] 북마크 목록 페이지에 정렬 기능 통합
  - [x] `app/bookmarks/page.tsx`에 `searchParams` 추가
  - [x] 정렬 옵션 파싱 및 `BookmarkListContent`에 전달
  - [x] `BookmarkSort` 컴포넌트 통합 (페이지 제목 옆에 배치)
  - [x] `BookmarkList` 컴포넌트에 `sortBy` prop 전달
- [x] 북마크 관리 기능
  - [x] 정렬 옵션
    - [x] 최신순 (created_at DESC)
    - [x] 이름순 (가나다순)
    - [x] 지역별

---

**추가 개발 사항 (2025-01-XX):**

- [x] 북마크 정보와 관광지 정보 통합 타입 정의
  - [x] `BookmarkedTourItem` 인터페이스 생성 (`lib/api/bookmark-api.ts`)
    - [x] `TourItem`을 확장하여 `bookmarkCreatedAt` 필드 추가
    - [x] `bookmarkId` 필드 추가 (향후 삭제 기능용)
- [x] 북마크 관광지 정보 조회 함수 개선
  - [x] `getBookmarkedTours()` 함수 시그니처 변경
    - [x] 북마크 배열 전체를 받도록 변경 (content_id 배열이 아닌)
    - [x] 반환 타입을 `BookmarkedTourItem[]`로 변경
    - [x] 북마크 메타데이터(`created_at`, `id`)를 결과에 포함
    - [x] 원본 북마크 순서 유지 (최신순 정렬을 위해)
    - [x] `Map`을 사용하여 북마크 정보 매핑 최적화
- [x] 북마크 목록 페이지 수정
  - [x] `app/bookmarks/page.tsx`에서 북마크 배열 전체 전달
    - [x] `getBookmarkedTours(bookmarks)` 호출로 변경
    - [x] 반환된 `BookmarkedTourItem[]`을 `BookmarkList`에 전달
- [x] 북마크 목록 컴포넌트 정렬 함수 개선
  - [x] `BookmarkListProps`의 `tours` 타입을 `BookmarkedTourItem[]`로 변경
  - [x] `sortTours` 함수 개선
    - [x] 최신순: `bookmarkCreatedAt` 기준 내림차순 정렬 구현
    - [x] 이름순: 기존과 동일 (`title` 기준 가나다순)
    - [x] 지역별: `areacode` 기준 정렬 (빈 문자열인 경우 맨 뒤로 배치)
- [x] 타입 안전성 확인
  - [x] 모든 파일에서 타입 오류 없음 확인
  - [x] `TourCard` 컴포넌트와의 호환성 확인 (`BookmarkedTourItem`은 `TourItem`을 확장하므로 호환됨)
- [x] 일괄 삭제 기능
  - [x] 체크박스 선택
  - [x] 선택 항목 삭제
  - [x] 확인 다이얼로그

---

**추가 개발 사항 (2025-01-XX):**

- [x] 일괄 삭제 API 함수 추가 (`lib/api/supabase-api.ts`)
  - [x] `removeBookmarks()` 함수 구현 (여러 북마크 ID 배열로 배치 삭제)
  - [x] `IN` 연산자 사용하여 배치 삭제 최적화
  - [x] user_id 확인으로 보안 강화 (본인 북마크만 삭제 가능)
  - [x] 삭제된 항목 수 반환
- [x] Server Action 생성 (`actions/delete-bookmarks.ts`)
  - [x] `deleteBookmarks` Server Action 구현
  - [x] Clerk 인증 확인
  - [x] Supabase 클라이언트 생성 및 user_id 조회
  - [x] 에러 처리 및 사용자 친화적 메시지
- [x] shadcn/ui Checkbox 컴포넌트 설치
  - [x] `pnpm dlx shadcn@latest add checkbox` 실행
  - [x] `components/ui/checkbox.tsx` 생성 확인
- [x] 북마크 목록 컴포넌트 확장 (`components/bookmarks/bookmark-list.tsx`)
  - [x] Client Component로 변경 (`'use client'`)
  - [x] 체크박스 선택 상태 관리 (`useState`로 선택된 북마크 ID 배열 관리)
  - [x] 전체 선택/해제 기능 구현
  - [x] 목록 상단 헤더 추가 (전체 선택 체크박스, 선택된 항목 수 표시, 일괄 삭제 버튼)
  - [x] 각 카드에 체크박스 추가 (카드 좌측 상단에 절대 위치로 배치)
  - [x] 선택된 카드 하이라이트 (ring, border, shadow, scale 효과)
  - [x] 확인 다이얼로그 구현 (shadcn/ui Dialog 사용)
  - [x] 삭제 진행 중 로딩 상태 표시
  - [x] 삭제 완료 후 토스트 메시지 및 페이지 새로고침 (`router.refresh()`)
  - [x] bookmarkId가 없는 경우 체크박스 표시 안 함 (타입 안전성)
  - [x] 접근성 지원 (aria-label, role 속성)
  - [x] 반응형 디자인 확인
- [x] 개별 삭제 기능
  - [x] 각 카드에 삭제 버튼

---

**추가 개발 사항 (2025-01-XX):**

- [x] 개별 삭제 기능 구현
  - [x] 북마크 목록 컴포넌트에 개별 삭제 핸들러 추가 (`handleDeleteSingle`, `handleConfirmSingleDelete`)
  - [x] `deleteBookmarks()` Server Action 재사용 (단일 bookmarkId 배열로 호출)
  - [x] 각 카드에 개별 삭제 버튼 UI 추가 (우측 상단, Trash2 아이콘)
  - [x] 삭제 버튼 위치: 카드 우측 상단 (체크박스는 좌측 상단)
  - [x] 삭제 버튼 표시: 모바일은 항상 표시, 데스크톱은 호버 시 표시
  - [x] 개별 삭제 확인 다이얼로그 추가 (관광지명 표시)
  - [x] 로딩 상태 관리 (`useTransition` 사용, 삭제 중 스피너 표시)
  - [x] 에러 처리 (토스트 메시지로 성공/실패 알림)
  - [x] 삭제 후 페이지 새로고침 (`router.refresh()`)
  - [x] 접근성 지원 (aria-label, title 속성, 키보드 포커스 스타일)
  - [x] 반응형 디자인 (모바일: 터치 타겟 크기 44x44px, 데스크톱: 32x32px)
  - [x] 파일 헤더 주석 업데이트 (개별 삭제 기능 추가)
- [x] 페이지 통합 및 스타일링
  - [x] 반응형 디자인 확인
  - [x] 최종 페이지 확인

---

**추가 개발 사항 (2025-01-XX):**

- [x] 페이지 통합 및 스타일링 완료
  - [x] 레이아웃 일관성 확인 및 개선
    - [x] 다른 페이지들(홈페이지, 통계 페이지, 상세페이지)과 레이아웃 패턴 일치 확인
    - [x] 컨테이너 너비, 패딩, 간격 일관성 확인 (`min-h-[calc(100vh-80px)]`, `px-4 md:px-6`, `py-8 md:py-12`, `max-w-7xl`)
    - [x] 페이지 제목 스타일 일관성 확인 (`text-2xl md:text-3xl font-bold`)
  - [x] 반응형 디자인 최종 점검
    - [x] 모바일(320px~768px): 카드 그리드 1열, 정렬 버튼 아이콘만, 삭제 버튼 항상 표시, 터치 타겟 최소 44x44px
    - [x] 태블릿(768px~1024px): 카드 그리드 2열, 정렬 버튼 아이콘+텍스트, 삭제 버튼 호버 시 표시
    - [x] 데스크톱(1024px+): 카드 그리드 3열, 모든 기능 표시
    - [x] 선택 헤더 반응형 개선 (모바일: 세로 배치, 데스크톱: 가로 배치)
    - [x] 정렬 버튼 반응형 개선 (`flex-wrap` 추가, 모바일 터치 타겟 크기 확보)
  - [x] 스타일 일관성 확인
    - [x] 타이포그래피 일관성 확인 (페이지 제목, 본문, 작은 텍스트)
    - [x] 간격 시스템 일관성 확인 (섹션 간격, 카드 간격, 내부 패딩)
    - [x] 색상 시스템 확인 (Tailwind CSS 테마 변수 사용, 다크 모드 지원)
    - [x] 버튼 스타일 일관성 확인 (정렬 버튼, 삭제 버튼)
    - [x] 빈 상태 메시지 반응형 개선 (제목 크기, 텍스트 크기)
  - [x] 접근성 최종 점검
    - [x] ARIA 속성 추가 (`role="toolbar"`, `aria-describedby`, `aria-label` 개선)
    - [x] 키보드 네비게이션 확인 (포커스 스타일, Tab 순서)
    - [x] 스크린 리더 지원 개선 (`aria-live="polite"`, `aria-hidden="true"` 적절히 사용)
    - [x] 터치 타겟 크기 확인 (모바일 최소 44x44px)
    - [x] 체크박스 크기 반응형 조정 (모바일: 20x20px, 데스크톱: 16x16px)
  - [x] 사용자 경험 개선
    - [x] 로딩 상태 확인 (Suspense, 스켈레톤 UI)
    - [x] 에러 처리 확인 (ErrorDisplay 컴포넌트)
    - [x] 빈 상태 메시지 개선 (명확한 메시지 및 액션 버튼)
    - [x] 피드백 메시지 확인 (토스트 메시지, 삭제 완료 후 자동 새로고침)
  - [x] 최종 페이지 확인
    - [x] 파일 헤더 주석 업데이트 (반응형 디자인, 접근성 정보 추가)
    - [x] 코드 정리 및 타입 안전성 확인
    - [x] 린터 에러 확인 (에러 없음)

## Phase 6: 최적화 & 배포

- [x] 이미지 최적화
  - [x] `next.config.ts` 외부 도메인 설정
    - [x] 한국관광공사 이미지 도메인 추가
    - [x] 네이버 지도 이미지 도메인 확인 (불필요 - JavaScript API 사용)

---

**추가 개발 사항 (2025-01-XX):**

- [x] 이미지 최적화 외부 도메인 설정 완료
  - [x] 현재 설정 검증 및 이미지 URL 패턴 분석
    - [x] `next.config.ts`의 현재 `remotePatterns` 설정 확인
    - [x] 코드베이스에서 사용하는 모든 이미지 URL 패턴 분석
    - [x] 한국관광공사 이미지 도메인 확인 (`tong.visitkorea.or.kr`, `api.visitkorea.or.kr`)
    - [x] Clerk 이미지 도메인 확인 (`img.clerk.com`)
    - [x] 네이버 지도 이미지 도메인 확인 (JavaScript API 사용으로 불필요)
  - [x] `remotePatterns` 설정 개선
    - [x] 프로토콜(`protocol: 'https'`) 명시적 지정 (보안 강화)
    - [x] 각 도메인의 용도 주석 추가
    - [x] 한국관광공사 이미지 도메인 주석 (`firstimage`, `firstimage2`, `originimgurl`, `smallimageurl` 필드 사용)
    - [x] Clerk 프로필 이미지 도메인 주석 추가
  - [x] 이미지 URL 패턴 검증
    - [x] 실제 API 응답에서 반환되는 이미지 URL 형식 확인
    - [x] 모든 이미지 URL이 설정된 도메인과 일치하는지 검증
    - [x] 예외 케이스 확인 (다른 서브도메인, 다른 프로토콜 없음 확인)
  - [x] 네이버 지도 이미지 도메인 확인 (불필요 확인)
    - [x] 네이버 지도는 JavaScript API를 사용하므로 Next.js Image 컴포넌트를 사용하지 않음 확인
    - [x] `components/naver-map.tsx`에서 Next.js Image 컴포넌트 미사용 확인
    - [x] `components/tour-detail/detail-map-client.tsx`에서 Next.js Image 컴포넌트 미사용 확인
    - [x] TODO.md에 "불필요" 표시 추가
  - [x] 문서화 및 검증
    - [x] `next.config.ts`에 각 도메인의 용도 주석 추가
    - [x] 변경 사항을 TODO.md에 기록
    - [x] 린터 에러 확인 (에러 없음)
  - [x] Next.js Image 컴포넌트 사용 확인
    - [x] priority 속성 (above-the-fold)
    - [x] lazy loading (below-the-fold)
    - [x] responsive sizes 설정

---

**추가 개발 사항 (2025-01-XX):**

- [x] Next.js Image 컴포넌트 사용 확인 및 최적화 완료
  - [x] 모든 Image 컴포넌트 사용 현황 조사 및 정리
    - [x] `components/tour-card.tsx` 확인 (관광지 목록 카드)
    - [x] `components/tour-detail/detail-info.tsx` 확인 (상세페이지 기본 정보)
    - [x] `components/tour-detail/image-gallery-client.tsx` 확인 (이미지 갤러리)
    - [x] `components/tour-detail/image-modal.tsx` 확인 (이미지 모달)
  - [x] priority 속성 확인 및 개선 (above-the-fold)
    - [x] 상세페이지 대표 이미지 (`detail-info.tsx`): `priority` 사용 확인 ✅
    - [x] 이미지 갤러리 대표 이미지 (`image-gallery-client.tsx`): `priority` 사용 확인 ✅
    - [x] 관광지 목록 카드 (`tour-card.tsx`): `priority` 없음 확인 (목록이므로 lazy 적절) ✅
    - [x] 이미지 모달 (`image-modal.tsx`): `priority` 제거 (모달은 사용자 액션 후 표시되므로 불필요)
  - [x] lazy loading 확인 및 개선 (below-the-fold)
    - [x] 관광지 목록 카드 (`tour-card.tsx`): `loading="lazy"` 설정 확인 ✅
    - [x] 이미지 갤러리 서브 이미지 (`image-gallery-client.tsx`): `loading="lazy"` 설정 확인 ✅
    - [x] 이미지 모달 (`image-modal.tsx`): 기본 lazy loading 적용 (priority 제거로 자동 적용)
  - [x] responsive sizes 설정 검증 및 개선
    - [x] `tour-card.tsx`: `"(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"` 설정 확인 ✅
    - [x] `detail-info.tsx`: `"(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"` 설정 확인 ✅
    - [x] `image-gallery-client.tsx` 대표 이미지: `"(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"` 설정 확인 ✅
    - [x] `image-gallery-client.tsx` 서브 이미지: `"(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"` 설정 확인 ✅
    - [x] `image-modal.tsx`: `width`와 `height` 사용으로 sizes 불필요 확인 ✅
  - [x] unoptimized 속성 검토 및 개선
    - [x] `image-modal.tsx`의 `unoptimized` 속성 제거 (`next.config.ts`에 remotePatterns 설정되어 있으므로 불필요)
    - [x] Next.js Image 최적화가 정상 작동하도록 개선
  - [x] 이미지 에러 처리 확인
    - [x] `tour-card.tsx`: `onError` 핸들러 사용 확인 ✅
    - [x] `image-gallery-client.tsx`: `onError` 핸들러 사용 확인 ✅
    - [x] `detail-info.tsx`: fallback UI 제공 확인 ✅
  - [x] 최종 검증 및 문서화
    - [x] 모든 Image 컴포넌트 사용 현황 정리
    - [x] 개선 사항 적용 완료
    - [x] 린터 에러 확인 (에러 없음)
    - [x] TODO.md 업데이트
- [x] 전역 에러 핸들링
  - [x] `app/error.tsx` 생성
  - [x] `app/global-error.tsx` 생성
  - [x] API 에러 처리 개선

---

**추가 개발 사항 (2025-01-XX):**

- [x] 전역 에러 핸들링 완료
  - [x] app/error.tsx 검증 및 개선
    - [x] 접근성 속성 추가 (role="alert", aria-live="assertive", aria-label)
    - [x] 버튼에 aria-label 추가
    - [x] 에러 복구 옵션 그룹에 role="group" 추가
    - [x] 해결 방법 안내 영역에 aria-live="polite" 추가
  - [x] app/global-error.tsx 스타일 개선
    - [x] 인라인 스타일을 Tailwind CSS로 변경
    - [x] app/error.tsx와 스타일 일관성 확보
    - [x] Button 컴포넌트 사용 (shadcn/ui)
    - [x] 접근성 속성 추가 (role="alert", aria-live, aria-label)
    - [x] 파일 헤더 주석 추가 (JSDoc 형식)
    - [x] 개발 환경 에러 스택 표시 스타일 개선 (Tailwind CSS)
  - [x] API 에러 처리 개선
    - [x] app/api/sync-user/route.ts 에러 응답 형식 통일
      - [x] success, error, errorType, statusCode 필드 통일
      - [x] 에러 타입 구분 (AuthenticationError, DatabaseError, NetworkError, UnknownError)
      - [x] 사용자 친화적 에러 메시지 제공
    - [x] app/api/tours/route.ts 에러 로깅 개선
      - [x] 개발/프로덕션 환경 구분 로깅
      - [x] 프로덕션 환경에서 사용자 친화적 메시지 제공
  - [x] 에러 로깅 전략 개선
    - [x] 개발 환경: 상세한 에러 정보 로깅 (console.error)
    - [x] 프로덕션 환경: 사용자 친화적 메시지만 표시, 에러는 서버 로그에만 기록
    - [x] 에러 타입별 맞춤 메시지 제공
  - [x] 사용자 친화적 에러 메시지 개선
    - [x] 네트워크 에러: "네트워크 연결을 확인해주세요."
    - [x] 타임아웃 에러: "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요."
    - [x] 인증 에러: "인증이 필요합니다. 로그인 후 다시 시도해주세요."
    - [x] 데이터베이스 에러: "사용자 정보를 저장하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
    - [x] 일반 에러: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
  - [x] 최종 검증 및 문서화
    - [x] 모든 에러 핸들링 로직 검증
    - [x] 린터 에러 확인 (에러 없음)
    - [x] TODO.md 업데이트
- [x] 404 페이지
  - [x] `app/not-found.tsx` 생성
    - [x] 사용자 친화적인 메시지
    - [x] 홈으로 돌아가기 버튼

---

**추가 개발 사항 (2025-01-XX):**

- [x] 404 페이지 구현 완료
  - [x] app/not-found.tsx 생성
    - [x] Server Component로 구현 (Next.js 15 App Router)
    - [x] 메타데이터 설정 (title, description, robots)
    - [x] SEO 최적화 (noindex, nofollow)
  - [x] 사용자 친화적인 메시지
    - [x] 큰 숫자 "404" 표시
    - [x] FileQuestion 아이콘 사용 (lucide-react)
    - [x] 명확한 제목 및 설명 메시지
    - [x] 한국어 메시지 작성
  - [x] 홈으로 돌아가기 버튼
    - [x] shadcn/ui Button 컴포넌트 사용
    - [x] Next.js Link를 사용하여 홈으로 이동
    - [x] Home 아이콘 사용
    - [x] 반응형 디자인 (모바일: 전체 너비, 데스크톱: 자동 너비)
  - [x] 스타일 일관성 확보
    - [x] app/error.tsx와 스타일 일관성 유지
    - [x] Tailwind CSS 사용
    - [x] 중앙 정렬 레이아웃
    - [x] 반응형 디자인 (모바일 우선)
    - [x] 최소 높이: `min-h-[calc(100vh-80px)]` (Navbar 높이 고려)
    - [x] 최대 너비: `max-w-md`
    - [x] 간격: `space-y-6`
  - [x] 접근성 개선
    - [x] 시맨틱 HTML 사용 (`<main>`, `<h1>`, `<h2>`, `<p>`)
    - [x] ARIA 속성 추가 (`role="status"`, `aria-live="polite"`, `aria-label`)
    - [x] 버튼 및 링크에 `aria-label` 추가
    - [x] 아이콘에 `aria-hidden="true"` 추가
    - [x] 버튼 그룹에 `role="group"` 추가
  - [x] 추가 기능
    - [x] 다른 페이지 링크 추가 (통계, 북마크)
    - [x] 구분선으로 섹션 분리
    - [x] 반응형 버튼 레이아웃 (모바일: 세로, 데스크톱: 가로)
  - [x] 파일 헤더 주석 작성 (JSDoc 형식)
  - [x] 최종 검증
    - [x] 린터 에러 확인 (에러 없음)
    - [x] TODO.md 업데이트
- [x] SEO 최적화
  - [x] 메타태그 설정 (`app/layout.tsx`)
    - [x] 기본 title, description
    - [x] Open Graph 태그
    - [x] Twitter Card 태그
  - [x] `app/sitemap.ts` 생성
    - [x] 동적 sitemap 생성 (관광지 상세페이지 포함)
  - [x] `app/robots.ts` 생성

---

**추가 개발 사항 (2025-01-XX):**

- [x] SEO 최적화 구현 완료
  - [x] app/layout.tsx 메타데이터 설정 개선
    - [x] 주석 처리된 메타데이터를 실제 구현으로 변경
    - [x] 기본 title, description 설정
    - [x] metadataBase 설정 (NEXT_PUBLIC_SITE_URL 환경변수 사용)
    - [x] title template 설정 ("%s | My Trip")
    - [x] keywords 설정 (한국 관광, 여행, 관광지 등)
    - [x] authors, creator, publisher 설정
    - [x] robots 설정 (index, follow, googleBot 설정)
    - [x] Open Graph 태그 설정 (type, locale, url, siteName, title, description, images)
    - [x] Twitter Card 태그 설정 (card, title, description, images)
    - [x] alternates.canonical 설정
    - [x] verification 설정 (Google Search Console용, 주석 처리)
    - [x] getSiteUrl() 유틸리티 함수 생성 (환경변수 또는 기본값 사용)
  - [x] app/page.tsx 메타데이터 추가
    - [x] 기본 메타데이터 설정 (title, description)
    - [x] Open Graph 태그 추가
    - [x] Twitter Card 태그 추가
    - [x] getSiteUrl() 유틸리티 함수 사용
  - [x] app/stats/page.tsx 메타데이터 추가
    - [x] 기본 메타데이터 설정 (title, description)
    - [x] Open Graph 태그 추가 (url 포함)
    - [x] Twitter Card 태그 추가
    - [x] getSiteUrl() 유틸리티 함수 사용
  - [x] app/sitemap.ts 생성
    - [x] Next.js 15 App Router의 sitemap.ts 파일 생성
    - [x] MetadataRoute.Sitemap 타입 사용
    - [x] 정적 페이지 URL 포함 (/, /stats, /bookmarks)
    - [x] lastModified, changeFrequency, priority 설정
    - [x] getSiteUrl() 유틸리티 함수 사용
    - [x] 동적 페이지(관광지 상세페이지)는 성능 고려하여 제외 (향후 확장 가능)
    - [x] 파일 헤더 주석 작성 (JSDoc 형식)
  - [x] app/robots.ts 생성
    - [x] Next.js 15 App Router의 robots.ts 파일 생성
    - [x] MetadataRoute.Robots 타입 사용
    - [x] 검색 엔진 크롤링 규칙 설정
    - [x] User-agent: \* 설정
    - [x] Allow: / 설정 (모든 페이지 허용)
    - [x] Disallow 설정 (/api/, /\_next/, /sign-in, /sign-up 제외)
    - [x] sitemap URL 포함
    - [x] getSiteUrl() 유틸리티 함수 사용
    - [x] 파일 헤더 주석 작성 (JSDoc 형식)
  - [x] 환경변수 설정 확인
    - [x] NEXT_PUBLIC_SITE_URL 환경변수 사용 확인
    - [x] 기본값 설정 (https://my-trip.vercel.app)
    - [x] 모든 SEO 관련 파일에서 일관된 getSiteUrl() 함수 사용
  - [x] 메타데이터 일관성 확보
    - [x] 모든 페이지의 메타데이터 형식 통일 (title template: "%s | My Trip")
    - [x] description 길이 확인 (100-160자)
    - [x] Open Graph 이미지 크기 확인 (1200x630 권장)
    - [x] Twitter Card 타입 확인 (summary_large_image)
  - [x] 최종 검증 및 문서화
    - [x] 모든 메타데이터 설정 검증
    - [x] sitemap.ts 및 robots.ts 파일 생성 확인
    - [x] 린터 에러 확인 (에러 없음)
    - [x] TODO.md 업데이트
- [x] 성능 최적화
  - [x] Lighthouse 점수 측정 (목표: > 80)
  - [x] 코드 분할 확인
  - [x] 불필요한 번들 제거
  - [x] API 응답 캐싱 전략 확인

---

**추가 개발 사항 (2025-01-XX):**

- [x] 성능 최적화 구현 완료

  - [x] 코드 분할 개선
    - [x] NaverMap 컴포넌트 동적 import 적용 (`next/dynamic`)
    - [x] SSR 비활성화 (`ssr: false`) - 브라우저에서만 실행
    - [x] 로딩 스켈레톤 추가
    - [x] `components/tour-map-container.tsx` 수정
  - [x] API 응답 캐싱 전략 적용
    - [x] `app/page.tsx`에 `revalidate = 1800` 추가 (30분)
    - [x] `app/places/[contentId]/page.tsx`에 `revalidate = 3600` 추가 (1시간)
    - [x] ISR (Incremental Static Regeneration) 적용
  - [x] React 컴포넌트 성능 최적화
    - [x] `components/tour-filters.tsx` 최적화
      - [x] `updateFilters` 함수에 `useCallback` 적용
      - [x] `handleAreaChange`, `handleContentTypeChange`, `handleArrangeChange`, `handlePetAllowedToggle`, `handlePetSizeChange` 핸들러에 `useCallback` 적용
    - [x] `components/bookmarks/bookmark-list.tsx` 최적화
      - [x] `sortedTours`에 `useMemo` 적용
      - [x] `allSelected`, `someSelected`에 `useMemo` 적용
      - [x] `handleSelectAll`, `handleToggleSelect`, `handleDelete`, `handleDeleteSingle`, `handleConfirmSingleDelete` 핸들러에 `useCallback` 적용
  - [x] 번들 분석 도구 설정
    - [x] `@next/bundle-analyzer` 설치
    - [x] `next.config.ts`에 bundle analyzer 설정 추가
    - [x] `package.json`에 `build:analyze` 스크립트 추가
    - [x] 환경변수 `ANALYZE=true`로 번들 분석 활성화
  - [x] 최종 검증 및 문서화
    - [x] 모든 파일 린터 에러 확인 (에러 없음)
    - [x] TODO.md 업데이트

- [x] 환경변수 보안 검증
  - [x] 모든 필수 환경변수 확인
  - [x] `.env.example` 업데이트
  - [x] 프로덕션 환경변수 설정 가이드 작성

---

**추가 개발 사항 (2025-01-XX):**

- [x] 환경변수 보안 검증 구현 완료
  - [x] 모든 필수 환경변수 확인 및 목록 정리
    - [x] 코드베이스 전체에서 `process.env` 사용 패턴 검색
    - [x] 각 환경변수의 사용 위치 및 용도 문서화
    - [x] 필수/선택 환경변수 구분
    - [x] 클라이언트/서버 전용 환경변수 구분
    - [x] 확인된 환경변수:
      - 필수: NEXT_PUBLIC_TOUR_API_KEY (또는 TOUR_API_KEY), NEXT_PUBLIC_NAVER_MAP_CLIENT_ID, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
      - 선택: NEXT_PUBLIC_STORAGE_BUCKET (기본값: "uploads"), NEXT_PUBLIC_SITE_URL (기본값: "https://my-trip.vercel.app"), Clerk 리다이렉트 URL들, ANALYZE (번들 분석용)
  - [x] `.env.example` 파일 생성
    - [x] 프로젝트 루트에 `.env.example` 파일 생성
    - [x] 모든 환경변수를 카테고리별로 그룹화 (한국관광공사 API, 네이버 지도 API, Clerk 인증, Supabase, 사이트 설정, 개발/빌드 도구)
    - [x] 각 환경변수에 대한 설명 주석 추가 (용도, 발급 위치, 보안 수준)
    - [x] 기본값이 있는 경우 명시
    - [x] 보안 주의사항 추가 (서버 전용 변수, 클라이언트 노출 주의)
  - [x] 프로덕션 환경변수 설정 가이드 작성
    - [x] `docs/ENV_SETUP.md` 파일 생성
    - [x] 환경변수 개요 (클라이언트 vs 서버 환경변수, 보안 고려사항)
    - [x] 환경변수 분류 (필수/선택, 클라이언트/서버 전용)
    - [x] 로컬 개발 환경 설정 가이드
    - [x] Vercel 배포 시 설정 방법 (Dashboard, CLI)
    - [x] 각 환경변수별 상세 가이드 (발급 방법, 설정 위치, 보안 주의사항, 테스트 방법)
    - [x] 문제 해결 가이드 (환경변수 누락 시 에러 메시지, 일반적인 문제 및 해결 방법, 디버깅 팁)
  - [x] 기존 문서 업데이트
    - [x] `README.md`의 환경변수 섹션 업데이트
      - [x] `.env.example` 파일 참조 추가
      - [x] 환경변수 설정 순서 명확화
      - [x] 필수/선택 환경변수 구분
      - [x] 보안 주의사항 강조
      - [x] `docs/ENV_SETUP.md` 링크 추가
    - [x] `AGENTS.md`의 환경변수 섹션 업데이트
      - [x] `.env.example` 파일 참조 추가
      - [x] 필수/선택 환경변수 목록 정리
      - [x] 보안 주의사항 강조
      - [x] `docs/ENV_SETUP.md` 링크 추가
  - [x] 최종 검증 및 문서화
    - [x] 모든 환경변수 검증 완료 확인
    - [x] `.env.example` 파일 검증 (모든 필수 환경변수 포함 확인)
    - [x] 프로덕션 가이드 검증 (각 환경변수 설명 명확성 확인)
    - [x] 문서 간 일관성 확인
    - [x] `docs/TODO.md` 업데이트
- [x] 배포 준비
  - [x] Vercel 배포 설정
    - [x] 빌드 테스트 스크립트 생성 (`scripts/test-build.ps1`, `scripts/test-build.sh`)
    - [x] 로컬 빌드 테스트 실행 및 에러 수정
    - [x] 빌드 에러 수정 (React Hooks 규칙, TypeScript 타입 에러, 사용하지 않는 import 제거)
  - [x] 환경변수 설정 (Vercel 대시보드)
    - [x] 배포 체크리스트 문서 생성 (`docs/DEPLOYMENT_CHECKLIST.md`)
    - [x] 배포 가이드 문서 생성 (`docs/DEPLOYMENT_GUIDE.md`)
    - [x] 배포 후 테스트 체크리스트 문서 생성 (`docs/DEPLOYMENT_TEST_CHECKLIST.md`)
    - [x] `docs/ENV_SETUP.md` 보완 (Vercel Dashboard 설정 방법 명확화, 보안 주의사항 강조)
  - [x] 빌드 테스트 (`pnpm build`)
    - [x] 로컬 빌드 테스트 성공 확인
    - [x] 빌드 최적화 확인 (이미지 최적화, 번들 크기, 코드 분할)
  - [ ] 프로덕션 배포 및 테스트 (수동 작업 필요)
    - [ ] Vercel 프로젝트 생성 (수동)
    - [ ] 환경변수 설정 (Vercel Dashboard, 수동)
    - [ ] 첫 배포 실행 (수동)
    - [ ] 배포 후 테스트 실행 (수동)

---

**추가 개발 사항 (2025-01-XX):**

- [x] 배포 준비 구현 완료
  - [x] 빌드 테스트 스크립트 생성
    - [x] Windows용 PowerShell 스크립트 (`scripts/test-build.ps1`)
    - [x] Unix/Linux/macOS용 Bash 스크립트 (`scripts/test-build.sh`)
    - [x] 빌드 전 `.next` 폴더 삭제
    - [x] 의존성 설치 (`pnpm install`)
    - [x] 프로덕션 빌드 실행 (`pnpm build`)
    - [x] 빌드 결과 요약 (폴더 크기, 페이지 수 등)
  - [x] 빌드 에러 수정
    - [x] React Hooks 규칙 위반 수정 (`components/bookmarks/bookmark-list.tsx`)
      - [x] hooks 호출을 early return 전으로 이동
      - [x] 사용하지 않는 변수 제거 (`someSelected`)
    - [x] TypeScript 타입 에러 수정
      - [x] `app/global-error.tsx`: `err` 객체를 `useMemo`로 메모이제이션
      - [x] `components/stats/type-chart-client.tsx`: `activeShape` 타입 에러 수정
      - [x] `components/tour-detail/detail-gallery.tsx`: `subImageYN` 제거
      - [x] `lib/types/tour.ts`: `TourDetail` 타입에 `cat1`, `cat2`, `cat3` 추가
      - [x] `components/tour-detail/detail-map-client.tsx`: 중복 타입 정의 제거
      - [x] `components/ui/toast.tsx`: `promise` 함수 인자 수정
      - [x] `lib/api/stats-api.ts`: `getAreaBasedList`에 `areaCode` 추가
    - [x] 사용하지 않는 import 제거
      - [x] `components/naver-map.tsx`: `Link` 제거
      - [x] `components/tour-detail/detail-info.tsx`: `Link` 제거
      - [x] `components/tour-detail/detail-map-client.tsx`: `MapPin`, `Loader2` 제거
      - [x] `components/stats/type-chart-client.tsx`: `Tag`, `Tooltip`, `Legend` 제거
      - [x] `components/tour-detail/image-gallery-client.tsx`: `ChevronLeft`, `ChevronRight`, `Button`, `cn` 제거
      - [x] `components/tour-detail/image-modal.tsx`: `cn` 제거
      - [x] `components/tour-filters.tsx`: `useMemo` 제거
      - [x] `lib/api/tour-api.ts`: `parseError` 변수 제거
  - [x] 배포 문서 생성
    - [x] 배포 체크리스트 문서 (`docs/DEPLOYMENT_CHECKLIST.md`)
      - [x] 필수 환경변수 목록 (카테고리별)
      - [x] Vercel Dashboard 설정 방법
      - [x] 환경별 설정 (Production, Preview, Development)
      - [x] 환경변수 검증 방법
    - [x] 배포 가이드 문서 (`docs/DEPLOYMENT_GUIDE.md`)
      - [x] Vercel 프로젝트 생성 방법
      - [x] 환경변수 설정 방법
      - [x] 첫 배포 방법
      - [x] 도메인 설정 (선택사항)
      - [x] 문제 해결 가이드
    - [x] 배포 후 테스트 체크리스트 문서 (`docs/DEPLOYMENT_TEST_CHECKLIST.md`)
      - [x] 기본 기능 테스트 항목
      - [x] 상세페이지 테스트 항목
      - [x] 인증 기능 테스트 항목
      - [x] 북마크 기능 테스트 항목
      - [x] 통계 페이지 테스트 항목
      - [x] SEO 및 메타데이터 확인 항목
      - [x] 성능 확인 항목
      - [x] 에러 처리 확인 항목
  - [x] 문서 업데이트
    - [x] `README.md`에 배포 섹션 추가
      - [x] Vercel 배포 링크
      - [x] 배포 관련 문서 링크
      - [x] 빌드 테스트 명령어
    - [x] `docs/ENV_SETUP.md` 보완
      - [x] Vercel Dashboard 설정 방법 명확화
      - [x] 보안 주의사항 강조
      - [x] 환경변수 추가 단계별 가이드
      - [x] 재배포 필요성 강조
  - [x] 개발 환경 에러 처리 개선
    - [x] `components/providers/error-handler.tsx` 생성
      - [x] Service Worker 에러 무시 (Chrome 확장 프로그램 때문)
      - [x] 개발 환경에서만 활성화 (`NODE_ENV === "development"`)
      - [x] `chrome-extension` 관련 Cache API 에러 무시
      - [x] Promise rejection 에러 무시
      - [x] `components/providers/client-layout.tsx`에 통합

## 추가 작업 (선택 사항)

- [ ] 다크 모드 지원
  - [ ] 테마 전환 기능
  - [ ] 모든 컴포넌트 다크 모드 스타일 적용
- [ ] PWA 지원
  - [ ] `app/manifest.ts` 생성
  - [ ] Service Worker 설정
  - [ ] 오프라인 지원
- [ ] 접근성 개선
  - [ ] ARIA 라벨 추가
  - [ ] 키보드 네비게이션 개선
  - [ ] 색상 대비 확인 (WCAG AA)
- [ ] 성능 모니터링
  - [ ] Web Vitals 측정
  - [ ] 에러 로깅 (Sentry 등)
- [ ] 사용자 피드백
  - [ ] 피드백 수집 기능
  - [ ] 버그 리포트 기능
