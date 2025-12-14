# 배포 체크리스트

이 문서는 My Trip 프로젝트를 Vercel에 배포하기 전에 확인해야 할 필수 환경변수 목록과 설정 방법을 제공합니다.

## 목차

1. [필수 환경변수 목록](#필수-환경변수-목록)
2. [Vercel Dashboard 설정 방법](#vercel-dashboard-설정-방법)
3. [환경별 설정](#환경별-설정)
4. [환경변수 검증](#환경변수-검증)

---

## 필수 환경변수 목록

### 1. 한국관광공사 API

#### NEXT_PUBLIC_TOUR_API_KEY (또는 TOUR_API_KEY)

- **용도**: 한국관광공사 공공 API 인증 키
- **발급 방법**: https://www.data.go.kr/data/15101578/openapi.do
- **보안 수준**: 공개 API 키 (클라이언트 노출 가능)
- **필수 여부**: 필수 (둘 중 하나)

**설정 위치**: Vercel Dashboard → Settings → Environment Variables

---

### 2. 네이버 지도 API

#### NEXT_PUBLIC_NAVER_MAP_CLIENT_ID

- **용도**: 네이버 지도 API 인증 (Naver Cloud Platform)
- **발급 방법**: https://www.ncloud.com/ (Web Dynamic Map 서비스 활성화 필요)
- **보안 수준**: 공개 Client ID (클라이언트 노출 가능)
- **필수 여부**: 필수

**설정 위치**: Vercel Dashboard → Settings → Environment Variables

---

### 3. Clerk 인증

#### NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

- **용도**: Clerk 인증 (클라이언트용 공개 키)
- **발급 방법**: https://dashboard.clerk.com/ → API Keys → Publishable key
- **보안 수준**: 공개 키 (클라이언트 노출 가능)
- **필수 여부**: 필수

#### CLERK_SECRET_KEY

- **용도**: Clerk 인증 (서버용 시크릿 키)
- **발급 방법**: https://dashboard.clerk.com/ → API Keys → Secret key
- **보안 수준**: ⚠️ 시크릿 키 (절대 클라이언트 노출 금지!)
- **필수 여부**: 필수

**설정 위치**: Vercel Dashboard → Settings → Environment Variables

---

### 4. Supabase

#### NEXT_PUBLIC_SUPABASE_URL

- **용도**: Supabase 프로젝트 URL
- **발급 방법**: https://supabase.com/dashboard → Settings → API → Project URL
- **보안 수준**: 공개 URL (클라이언트 노출 가능)
- **필수 여부**: 필수

#### NEXT_PUBLIC_SUPABASE_ANON_KEY

- **용도**: Supabase 클라이언트 인증 (공개 키)
- **발급 방법**: https://supabase.com/dashboard → Settings → API → anon public key
- **보안 수준**: 공개 키 (클라이언트 노출 가능, RLS 정책으로 보호)
- **필수 여부**: 필수

#### SUPABASE_SERVICE_ROLE_KEY

- **용도**: Supabase 관리자 권한 (RLS 우회)
- **발급 방법**: https://supabase.com/dashboard → Settings → API → service_role secret key
- **보안 수준**: ⚠️ 시크릿 키 (절대 클라이언트 노출 금지!)
- **필수 여부**: 필수

#### NEXT_PUBLIC_STORAGE_BUCKET

- **용도**: Supabase Storage 버킷 이름
- **기본값**: `uploads`
- **보안 수준**: 공개 설정 (클라이언트 노출 가능)
- **필수 여부**: 선택 (기본값 사용 가능)

**설정 위치**: Vercel Dashboard → Settings → Environment Variables

---

## 선택 환경변수

### 사이트 설정

#### NEXT_PUBLIC_SITE_URL

- **용도**: 프로덕션 사이트 URL (SEO 최적화용)
- **기본값**: `https://my-trip.vercel.app`
- **보안 수준**: 공개 URL (클라이언트 노출 가능)
- **필수 여부**: 선택 (기본값 사용 가능)

### Clerk 리다이렉트 URL (선택)

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` (기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` (기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL` (기본값: `/`)

**참고**: 기본값을 사용하는 경우 이 환경변수들을 설정하지 않아도 됩니다.

---

## Vercel Dashboard 설정 방법

### 1. Vercel Dashboard 접속

1. https://vercel.com/dashboard 접속
2. 프로젝트 선택 (또는 새 프로젝트 생성)

### 2. Environment Variables 이동

1. 프로젝트 선택 → **Settings** 메뉴 클릭
2. 왼쪽 사이드바에서 **Environment Variables** 클릭

### 3. 환경변수 추가

각 환경변수를 하나씩 추가합니다:

1. **Key** 입력란에 환경변수 이름 입력 (예: `NEXT_PUBLIC_TOUR_API_KEY`)
2. **Value** 입력란에 실제 값 입력
3. **Environment** 선택:
   - ✅ **Production**: 프로덕션 환경 (메인 도메인)
   - ✅ **Preview**: Pull Request, 브랜치 배포
   - ⚠️ **Development**: 로컬 개발 환경 (거의 사용하지 않음)
4. **Save** 버튼 클릭

### 4. 환경변수 확인

추가한 환경변수가 목록에 표시되는지 확인합니다.

**주의**: 시크릿 키는 마스킹되어 표시됩니다 (예: `clerk_***`).

### 5. 재배포

환경변수를 추가한 후:

1. **Deployments** 메뉴로 이동
2. 최신 배포를 선택
3. **Redeploy** 버튼 클릭
4. 또는 새로운 커밋을 푸시하여 자동 재배포

---

## 환경별 설정

### Production (프로덕션)

**권장 설정**: 모든 필수 환경변수를 Production 환경에 설정

**체크리스트**:
- [ ] `NEXT_PUBLIC_TOUR_API_KEY` 또는 `TOUR_API_KEY`
- [ ] `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET` (선택)
- [ ] `NEXT_PUBLIC_SITE_URL` (선택, 기본값 사용 가능)

### Preview (프리뷰)

**권장 설정**: Production과 동일하게 설정 (또는 테스트용 값)

**체크리스트**:
- [ ] Production과 동일한 환경변수 설정
- [ ] 또는 테스트용 별도 값 사용 (개발/테스트 목적)

### Development (개발)

**권장 설정**: 로컬 `.env` 파일 사용 (Vercel 설정 불필요)

**참고**: 로컬 개발 환경에서는 `.env` 파일을 사용하므로 Vercel Dashboard에서 설정할 필요가 없습니다.

---

## 환경변수 검증

### 배포 후 검증 방법

1. **배포 로그 확인**
   - Vercel Dashboard → Deployments → 최신 배포 → Build Logs
   - 환경변수 관련 에러가 없는지 확인

2. **런타임 확인**
   - 배포된 사이트 접속
   - 각 기능 테스트:
     - [ ] 홈페이지 로딩 (한국관광공사 API)
     - [ ] 지도 표시 (네이버 지도 API)
     - [ ] 로그인 기능 (Clerk)
     - [ ] 북마크 기능 (Supabase)

3. **브라우저 콘솔 확인**
   - 개발자 도구 → Console
   - 환경변수 누락 관련 에러 확인

### 일반적인 에러 메시지

#### 한국관광공사 API 키 누락

```
TourApiError: API 키가 설정되지 않았습니다. NEXT_PUBLIC_TOUR_API_KEY 또는 TOUR_API_KEY 환경변수를 설정해주세요.
```

**해결 방법**: Vercel Dashboard에서 `NEXT_PUBLIC_TOUR_API_KEY` 또는 `TOUR_API_KEY` 추가

#### 네이버 지도 Client ID 누락

```
Error: 네이버 지도 API 키가 설정되지 않았습니다. NEXT_PUBLIC_NAVER_MAP_CLIENT_ID 환경변수를 설정해주세요.
```

**해결 방법**: Vercel Dashboard에서 `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` 추가

#### Supabase 환경변수 누락

```
Error: Supabase URL or Service Role Key is missing. Please check your environment variables.
```

**해결 방법**: Vercel Dashboard에서 Supabase 관련 환경변수 추가

---

## 빠른 체크리스트

배포 전에 다음 항목을 확인하세요:

- [ ] 모든 필수 환경변수가 Vercel Dashboard에 설정되었는가?
- [ ] Production 환경에 모든 환경변수가 설정되었는가?
- [ ] Preview 환경에 필요한 환경변수가 설정되었는가?
- [ ] 환경변수 값이 올바른가? (오타, 공백 확인)
- [ ] 시크릿 키가 Production 환경에만 설정되었는가?
- [ ] 배포 후 기능 테스트를 완료했는가?

---

## 추가 리소스

- [환경변수 설정 가이드](./ENV_SETUP.md) - 상세한 환경변수 발급 방법
- [배포 가이드](./DEPLOYMENT_GUIDE.md) - Vercel 배포 전체 가이드
- [배포 후 테스트 체크리스트](./DEPLOYMENT_TEST_CHECKLIST.md) - 배포 후 기능 테스트 항목

---

**마지막 업데이트**: 2025-01-XX

