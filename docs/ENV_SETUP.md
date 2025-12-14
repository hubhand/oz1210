# 환경변수 설정 가이드

이 문서는 My Trip 프로젝트의 환경변수 설정 방법을 안내합니다.

## 목차

1. [환경변수 개요](#환경변수-개요)
2. [환경변수 분류](#환경변수-분류)
3. [로컬 개발 환경 설정](#로컬-개발-환경-설정)
4. [Vercel 배포 시 설정](#vercel-배포-시-설정)
5. [각 환경변수별 상세 가이드](#각-환경변수별-상세-가이드)
6. [문제 해결](#문제-해결)

---

## 환경변수 개요

### 클라이언트 vs 서버 환경변수

Next.js에서는 환경변수를 두 가지 방식으로 사용할 수 있습니다:

- **`NEXT_PUBLIC_` 접두사**: 클라이언트 번들에 포함되어 브라우저에서 접근 가능

  - 예: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_TOUR_API_KEY`
  - ⚠️ 주의: 이 값들은 클라이언트 코드에 노출되므로 공개해도 안전한 값만 사용하세요!

- **서버 전용**: `NEXT_PUBLIC_` 접두사가 없는 환경변수는 서버에서만 접근 가능
  - 예: `CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
  - ✅ 보안: 이 값들은 클라이언트에 노출되지 않으므로 시크릿 키에 사용 가능

### 보안 고려사항

1. **절대 클라이언트에 노출하면 안 되는 환경변수**:

   - `CLERK_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TOUR_API_KEY` (서버 전용 fallback)

2. **클라이언트에 노출 가능한 환경변수**:

   - `NEXT_PUBLIC_` 접두사가 있는 모든 환경변수
   - 공개 API 키, 공개 URL 등

3. **Git 커밋 금지**:
   - `.env` 파일은 절대 Git에 커밋하지 마세요!
   - `.env.example` 파일만 커밋하세요 (실제 값 없이 템플릿만 포함)

---

## 환경변수 분류

### 필수 환경변수 (없으면 앱이 동작하지 않음)

#### 한국관광공사 API

- `NEXT_PUBLIC_TOUR_API_KEY` 또는 `TOUR_API_KEY` (둘 중 하나 필수)

#### 네이버 지도

- `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`

#### Clerk 인증

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

#### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### 선택 환경변수 (기본값이 있거나 선택적 기능)

#### Clerk 리다이렉트 URL

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (기본값: `/`)

#### Supabase Storage

- `NEXT_PUBLIC_STORAGE_BUCKET` (기본값: `uploads`)

#### 사이트 설정

- `NEXT_PUBLIC_SITE_URL` (기본값: `https://my-trip.vercel.app`)

#### 개발/빌드 도구

- `ANALYZE` (번들 분석용, 선택)

---

## 로컬 개발 환경 설정

### 1. .env.example 파일 복사

프로젝트 루트에서 다음 명령어를 실행하세요:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

### 2. .env 파일 편집

생성된 `.env` 파일을 열고 각 환경변수에 실제 값을 입력하세요.

### 3. 환경변수 발급 및 설정

각 환경변수의 발급 방법은 [각 환경변수별 상세 가이드](#각-환경변수별-상세-가이드) 섹션을 참고하세요.

### 4. 개발 서버 재시작

환경변수를 변경한 후에는 개발 서버를 재시작해야 합니다:

```bash
# 개발 서버 중지 (Ctrl+C)
# 개발 서버 재시작
pnpm dev
```

---

## Vercel 배포 시 설정

### ⚠️ 보안 주의사항

**Vercel Dashboard에서 환경변수를 설정할 때 반드시 확인하세요:**

1. **시크릿 키는 Production 환경에만 설정**

   - `CLERK_SECRET_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - Preview 환경에는 테스트용 값만 설정하거나 설정하지 않기

2. **환경변수 값 확인**

   - 복사/붙여넣기 시 공백, 줄바꿈이 포함되지 않았는지 확인
   - 오타가 없는지 확인

3. **환경변수 노출 방지**

   - Vercel Dashboard에서 환경변수는 마스킹되어 표시됩니다
   - 시크릿 키는 절대 GitHub, Slack 등에 공유하지 마세요

4. **재배포 필요**
   - 환경변수를 추가/수정한 후에는 반드시 재배포해야 합니다
   - Settings → Environment Variables에서 저장 후 Deployments → Redeploy

### 방법 1: Vercel Dashboard 사용 (권장)

1. **Vercel Dashboard 접속**

   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Settings → Environment Variables 이동**

3. **환경변수 추가**

   - 각 환경변수를 하나씩 추가
   - 환경 선택: Production, Preview, Development
   - 값 입력 후 Save

4. **재배포**
   - 환경변수 변경 후 자동으로 재배포되거나
   - 수동으로 재배포: Deployments → Redeploy

### 방법 2: Vercel CLI 사용

```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# Vercel 로그인
vercel login

# 환경변수 추가
vercel env add NEXT_PUBLIC_TOUR_API_KEY production
vercel env add CLERK_SECRET_KEY production
# ... (나머지 환경변수도 동일하게 추가)

# 재배포
vercel --prod
```

### 환경별 설정

Vercel에서는 환경별로 다른 환경변수를 설정할 수 있습니다:

- **Production**: 프로덕션 환경 (메인 도메인)
- **Preview**: Pull Request, 브랜치 배포
- **Development**: 로컬 개발 환경 (거의 사용하지 않음)

**권장 설정**:

- Production: 모든 필수 환경변수 설정
- Preview: Production과 동일하게 설정 (또는 테스트용 값)
- Development: 로컬 `.env` 파일 사용

### 환경변수 암호화 및 보안

- Vercel은 모든 환경변수를 암호화하여 저장합니다
- 환경변수는 빌드 타임에만 접근 가능하며, 런타임에는 안전하게 관리됩니다
- `NEXT_PUBLIC_` 접두사가 있는 환경변수만 클라이언트 번들에 포함됩니다

---

## 각 환경변수별 상세 가이드

### 한국관광공사 API

#### NEXT_PUBLIC_TOUR_API_KEY

- **용도**: 한국관광공사 공공 API 인증 키
- **발급 방법**:
  1. https://www.data.go.kr/data/15101578/openapi.do 접속
  2. "활용신청" 클릭
  3. API 키 발급받기
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 API 키 (클라이언트 노출 가능)
- **테스트 방법**: 홈페이지에서 관광지 목록이 표시되는지 확인

#### TOUR_API_KEY (선택)

- **용도**: 서버 전용 fallback (NEXT_PUBLIC_TOUR_API_KEY가 없을 때 사용)
- **발급 방법**: NEXT_PUBLIC_TOUR_API_KEY와 동일
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 서버 전용 (클라이언트 노출 금지)
- **참고**: 일반적으로 NEXT_PUBLIC_TOUR_API_KEY만 사용해도 충분합니다

### 네이버 지도 API

#### NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

- **용도**: 네이버 지도 API 인증 (Naver Cloud Platform)
- **발급 방법**:
  1. https://www.ncloud.com/ 접속 및 회원가입
  2. Console → Services → AI·NAVER API → AI·NAVER API 선택
  3. Application 등록 → Client ID 발급
  4. Web Dynamic Map 서비스 활성화
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 Client ID (클라이언트 노출 가능)
- **제한사항**: 월 10,000,000건 무료 (신용카드 등록 필수)
- **테스트 방법**: 홈페이지에서 지도가 표시되는지 확인

### Clerk 인증

#### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

- **용도**: Clerk 인증 (클라이언트용 공개 키)
- **발급 방법**:
  1. https://dashboard.clerk.com/ 접속
  2. 프로젝트 선택 → API Keys
  3. Publishable key 복사
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 키 (클라이언트 노출 가능)
- **테스트 방법**: 로그인/회원가입 기능이 동작하는지 확인

#### CLERK_SECRET_KEY

- **용도**: Clerk 인증 (서버용 시크릿 키)
- **발급 방법**:
  1. https://dashboard.clerk.com/ 접속
  2. 프로젝트 선택 → API Keys
  3. Secret key 복사
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: ⚠️ 시크릿 키 (절대 클라이언트 노출 금지!)
- **테스트 방법**: 서버 사이드 인증 기능이 동작하는지 확인

#### Clerk 리다이렉트 URL (선택)

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: 로그인 페이지 URL (기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: 로그인 후 리다이렉트 URL (기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: 회원가입 후 리다이렉트 URL (기본값: `/`)

**참고**: 기본값을 사용하는 경우 이 환경변수들을 설정하지 않아도 됩니다.

### Supabase

#### NEXT_PUBLIC_SUPABASE_URL

- **용도**: Supabase 프로젝트 URL
- **발급 방법**:
  1. https://supabase.com/dashboard 접속
  2. 프로젝트 선택 → Settings → API
  3. Project URL 복사
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 URL (클라이언트 노출 가능)
- **테스트 방법**: Supabase 클라이언트 연결이 성공하는지 확인

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

- **용도**: Supabase 클라이언트 인증 (공개 키)
- **발급 방법**:
  1. https://supabase.com/dashboard 접속
  2. 프로젝트 선택 → Settings → API
  3. anon public key 복사
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 키 (클라이언트 노출 가능, RLS 정책으로 보호)
- **테스트 방법**: Supabase 클라이언트 연결이 성공하는지 확인

#### SUPABASE_SERVICE_ROLE_KEY

- **용도**: Supabase 관리자 권한 (RLS 우회)
- **발급 방법**:
  1. https://supabase.com/dashboard 접속
  2. 프로젝트 선택 → Settings → API
  3. service_role secret key 복사
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: ⚠️ 시크릿 키 (절대 클라이언트 노출 금지!)
- **주의사항**: 이 키는 모든 RLS를 우회하므로 서버 사이드에서만 사용하세요!
- **테스트 방법**: 서버 사이드 Supabase 작업이 성공하는지 확인

#### NEXT_PUBLIC_STORAGE_BUCKET

- **용도**: Supabase Storage 버킷 이름
- **기본값**: `uploads`
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 설정 (클라이언트 노출 가능)
- **참고**: 기본값을 사용하는 경우 이 환경변수를 설정하지 않아도 됩니다.

### 사이트 설정

#### NEXT_PUBLIC_SITE_URL

- **용도**: 프로덕션 사이트 URL (SEO 최적화용)
- **기본값**: `https://my-trip.vercel.app`
- **설정 위치**: `.env` 파일 또는 Vercel Dashboard
- **보안 수준**: 공개 URL (클라이언트 노출 가능)
- **사용 위치**: Open Graph, Twitter Card, sitemap, robots.txt
- **참고**: 기본값을 사용하는 경우 이 환경변수를 설정하지 않아도 됩니다.

### 개발/빌드 도구

#### ANALYZE

- **용도**: 번들 분석 활성화
- **설정 방법**: `ANALYZE=true pnpm build` 또는 `pnpm build:analyze`
- **설정 위치**: 빌드 시 환경변수로 전달 (`.env` 파일에 영구 설정 불필요)
- **보안 수준**: 개발 도구 (프로덕션에서 사용하지 않음)
- **참고**: 번들 분석 리포트는 `.next/analyze/` 폴더에 생성됩니다.

---

## 문제 해결

### 환경변수 누락 시 에러 메시지

#### 한국관광공사 API 키 누락

```
TourApiError: API 키가 설정되지 않았습니다. NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY 환경변수를 설정해주세요.
```

**해결 방법**: `.env` 파일에 `NEXT_PUBLIC_TOUR_API_KEY` 또는 `TOUR_API_KEY` 추가

#### 네이버 지도 Client ID 누락

```
Error: 네이버 지도 API 키가 설정되지 않았습니다. NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수를 설정해주세요.
```

**해결 방법**: `.env` 파일에 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 추가

#### Supabase 환경변수 누락

```
Error: Supabase URL or Service Role Key is missing. Please check your environment variables.
```

**해결 방법**: `.env` 파일에 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` 추가

### 일반적인 문제 및 해결 방법

#### 1. 환경변수가 적용되지 않음

**증상**: 환경변수를 설정했는데도 앱이 이전 값을 사용함

**해결 방법**:

1. 개발 서버 재시작 (`pnpm dev` 중지 후 다시 시작)
2. `.env` 파일이 프로젝트 루트에 있는지 확인
3. 환경변수 이름이 정확한지 확인 (대소문자, 언더스코어)
4. `.env` 파일에 공백이나 특수문자가 없는지 확인

#### 2. Vercel 배포 후 환경변수가 적용되지 않음

**증상**: 로컬에서는 동작하는데 Vercel 배포 후 동작하지 않음

**해결 방법**:

1. Vercel Dashboard → Settings → Environment Variables에서 환경변수 확인
2. 환경변수가 올바른 환경(Production, Preview)에 설정되었는지 확인
3. 환경변수 변경 후 재배포 (Deployments → Redeploy)
4. 빌드 로그에서 환경변수 관련 에러 확인

#### 3. 클라이언트에서 환경변수를 읽을 수 없음

**증상**: `process.env.NEXT_PUBLIC_XXX`가 `undefined`로 표시됨

**해결 방법**:

1. 환경변수 이름이 `NEXT_PUBLIC_` 접두사로 시작하는지 확인
2. 개발 서버 재시작
3. 빌드 타임에만 접근 가능한지 확인 (런타임이 아닌 빌드 타임에 값이 결정됨)

#### 4. 서버 전용 환경변수가 클라이언트에 노출됨

**증상**: `CLERK_SECRET_KEY` 같은 시크릿 키가 클라이언트 번들에 포함됨

**해결 방법**:

1. 환경변수 이름에서 `NEXT_PUBLIC_` 접두사 제거
2. 서버 사이드 코드에서만 사용하는지 확인
3. 클라이언트 컴포넌트(`'use client'`)에서 사용하지 않는지 확인

### 디버깅 팁

#### 환경변수 확인 방법

**로컬 개발 환경**:

```bash
# .env 파일 내용 확인 (Windows)
type .env

# .env 파일 내용 확인 (macOS/Linux)
cat .env
```

**Vercel 배포 환경**:

1. Vercel Dashboard → Settings → Environment Variables
2. 각 환경변수의 값 확인 (마스킹되어 있지만 존재 여부 확인 가능)

#### 환경변수 로깅 (개발 환경만)

**주의**: 프로덕션에서는 환경변수를 로깅하지 마세요!

```typescript
// 개발 환경에서만 로깅
if (process.env.NODE_ENV === "development") {
  console.log("Environment variables:", {
    hasTourApiKey: !!process.env.NEXT_PUBLIC_TOUR_API_KEY,
    hasNaverMapKey: !!process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID,
    // 실제 값은 로깅하지 않음 (보안)
  });
}
```

---

## 추가 리소스

- [Next.js 환경변수 문서](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Vercel 환경변수 설정 가이드](https://vercel.com/docs/concepts/projects/environment-variables)
- [Clerk 환경변수 설정](https://clerk.com/docs/quickstarts/nextjs)
- [Supabase 환경변수 설정](https://supabase.com/docs/guides/getting-started/local-development#environment-variables)

---

**마지막 업데이트**: 2025-01-XX
