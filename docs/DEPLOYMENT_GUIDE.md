# Vercel 배포 가이드

이 문서는 My Trip 프로젝트를 Vercel에 배포하는 전체 과정을 안내합니다.

## 목차

1. [사전 준비](#사전-준비)
2. [Vercel 프로젝트 생성](#vercel-프로젝트-생성)
3. [환경변수 설정](#환경변수-설정)
4. [첫 배포](#첫-배포)
5. [도메인 설정 (선택사항)](#도메인-설정-선택사항)
6. [문제 해결](#문제-해결)

---

## 사전 준비

### 1. GitHub 저장소 준비

Vercel은 GitHub 저장소와 연동하여 자동 배포를 제공합니다.

**필수 사항**:
- [ ] 프로젝트가 GitHub 저장소에 푸시되어 있는가?
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는가?
- [ ] 모든 변경사항이 커밋되어 있는가?

### 2. 환경변수 준비

배포 전에 모든 환경변수 값을 준비하세요.

**필수 환경변수**:
- 한국관광공사 API 키
- 네이버 지도 Client ID
- Clerk Publishable Key 및 Secret Key
- Supabase URL, Anon Key, Service Role Key

**상세 가이드**: [환경변수 설정 가이드](./ENV_SETUP.md)

### 3. 빌드 테스트

로컬에서 빌드가 성공하는지 확인하세요.

```bash
# 빌드 테스트 스크립트 실행 (Windows)
powershell -ExecutionPolicy Bypass -File scripts/test-build.ps1

# 또는 직접 빌드
pnpm build
```

**참고**: 빌드가 실패하면 배포 전에 수정해야 합니다.

---

## Vercel 프로젝트 생성

### 1. Vercel 계정 생성

1. https://vercel.com 접속
2. **Sign Up** 클릭
3. GitHub 계정으로 로그인 (권장)

### 2. 새 프로젝트 생성

1. Vercel Dashboard → **Add New...** → **Project** 클릭
2. GitHub 저장소 선택
3. **Import** 버튼 클릭

### 3. 프로젝트 설정

Vercel은 Next.js 프로젝트를 자동으로 감지합니다.

**자동 감지된 설정**:
- **Framework Preset**: Next.js
- **Root Directory**: `.` (프로젝트 루트)
- **Build Command**: `pnpm build` (또는 기본값)
- **Output Directory**: `.next` (Next.js 기본값)
- **Install Command**: `pnpm install`

**확인 사항**:
- [ ] Framework Preset이 Next.js로 설정되어 있는가?
- [ ] Build Command가 `pnpm build`인가?
- [ ] Install Command가 `pnpm install`인가?

**참고**: `package.json`에 `engines` 필드가 있으면 Node.js 버전이 자동으로 설정됩니다.

### 4. 환경변수 설정 (다음 단계에서 상세 설명)

환경변수는 프로젝트 생성 후에도 설정할 수 있습니다.

---

## 환경변수 설정

### 1. Environment Variables 페이지 이동

1. 프로젝트 선택 → **Settings** 메뉴 클릭
2. 왼쪽 사이드바에서 **Environment Variables** 클릭

### 2. 필수 환경변수 추가

[배포 체크리스트](./DEPLOYMENT_CHECKLIST.md)를 참고하여 모든 필수 환경변수를 추가하세요.

**추가 순서**:

1. **한국관광공사 API**
   - Key: `NEXT_PUBLIC_TOUR_API_KEY`
   - Value: 발급받은 API 키
   - Environment: ✅ Production, ✅ Preview

2. **네이버 지도 API**
   - Key: `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`
   - Value: 발급받은 Client ID
   - Environment: ✅ Production, ✅ Preview

3. **Clerk 인증**
   - Key: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Value: Clerk Dashboard에서 복사한 Publishable key
   - Environment: ✅ Production, ✅ Preview
   - Key: `CLERK_SECRET_KEY`
   - Value: Clerk Dashboard에서 복사한 Secret key
   - Environment: ✅ Production, ✅ Preview

4. **Supabase**
   - Key: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Supabase Dashboard에서 복사한 Project URL
   - Environment: ✅ Production, ✅ Preview
   - Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Supabase Dashboard에서 복사한 anon public key
   - Environment: ✅ Production, ✅ Preview
   - Key: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Supabase Dashboard에서 복사한 service_role secret key
   - Environment: ✅ Production, ✅ Preview
   - Key: `NEXT_PUBLIC_STORAGE_BUCKET` (선택)
   - Value: `uploads` (기본값)
   - Environment: ✅ Production, ✅ Preview

5. **사이트 설정** (선택)
   - Key: `NEXT_PUBLIC_SITE_URL`
   - Value: `https://your-project.vercel.app` (또는 커스텀 도메인)
   - Environment: ✅ Production

### 3. 환경변수 확인

추가한 모든 환경변수가 목록에 표시되는지 확인하세요.

**체크리스트**:
- [ ] 모든 필수 환경변수가 추가되었는가?
- [ ] Production 환경에 설정되었는가?
- [ ] Preview 환경에 설정되었는가?
- [ ] 환경변수 값에 오타가 없는가?

---

## 첫 배포

### 방법 1: 자동 배포 (권장)

환경변수를 설정한 후:

1. **Deployments** 메뉴로 이동
2. 최신 배포를 선택
3. **Redeploy** 버튼 클릭
4. 또는 새로운 커밋을 GitHub에 푸시하면 자동으로 배포됩니다

### 방법 2: 수동 배포

Vercel CLI를 사용하여 수동으로 배포할 수 있습니다:

```bash
# Vercel CLI 설치 (처음 한 번만)
npm i -g vercel

# Vercel 로그인
vercel login

# 프로덕션 배포
vercel --prod
```

### 배포 로그 확인

1. **Deployments** 메뉴 → 최신 배포 선택
2. **Build Logs** 탭에서 빌드 과정 확인
3. **Function Logs** 탭에서 런타임 에러 확인

**확인 사항**:
- [ ] 빌드가 성공했는가?
- [ ] 환경변수 관련 에러가 없는가?
- [ ] 타입 에러가 없는가?
- [ ] 빌드 경고가 없는가?

### 배포 상태 확인

배포가 완료되면:

1. **Deployments** 메뉴에서 배포 상태 확인
2. ✅ **Ready** 상태가 되면 배포 완료
3. 배포된 URL로 접속하여 사이트 확인

---

## 도메인 설정 (선택사항)

### 커스텀 도메인 연결

1. **Settings** → **Domains** 메뉴로 이동
2. **Add Domain** 버튼 클릭
3. 도메인 입력 (예: `my-trip.com`)
4. DNS 설정 안내에 따라 DNS 레코드 추가
5. DNS 확인 완료 대기 (보통 몇 분 ~ 몇 시간)

### DNS 설정

Vercel이 제공하는 DNS 설정 안내를 따르세요:

- **A Record**: Vercel IP 주소
- **CNAME Record**: Vercel 도메인

**참고**: DNS 설정은 도메인 제공업체(DNS 서비스)에서 수행합니다.

---

## 문제 해결

### 빌드 실패

**증상**: 배포 로그에서 빌드 에러 발생

**해결 방법**:
1. 빌드 로그에서 에러 메시지 확인
2. 로컬에서 `pnpm build` 실행하여 동일한 에러 재현
3. 에러 수정 후 커밋 및 푸시
4. 자동 재배포 대기

### 환경변수 누락

**증상**: 런타임에서 환경변수 관련 에러 발생

**해결 방법**:
1. Vercel Dashboard → Settings → Environment Variables 확인
2. 누락된 환경변수 추가
3. 재배포 (Redeploy)

### 페이지가 정적으로 렌더링되지 않음

**증상**: 빌드 로그에서 "Dynamic server usage" 경고

**원인**: `headers()`, `cookies()` 등 동적 API 사용

**해결 방법**:
- 이는 정상적인 동작입니다 (인증이 필요한 페이지)
- `export const dynamic = 'force-dynamic'`을 추가하여 명시적으로 동적 렌더링 지정 가능

### 모듈을 찾을 수 없음

**증상**: `Cannot find module` 에러

**해결 방법**:
1. `.next` 폴더 삭제 후 재빌드
2. `node_modules` 삭제 후 `pnpm install` 재실행
3. Vercel에서 재배포

---

## 배포 후 확인

배포가 완료되면 다음을 확인하세요:

1. **기본 기능 테스트**
   - [ ] 홈페이지 로딩 확인
   - [ ] 관광지 목록 표시 확인
   - [ ] 지도 표시 확인

2. **인증 기능 테스트**
   - [ ] 로그인 기능 동작 확인
   - [ ] 회원가입 기능 동작 확인

3. **북마크 기능 테스트**
   - [ ] 북마크 추가/제거 확인
   - [ ] 북마크 목록 페이지 확인

**상세 테스트 체크리스트**: [배포 후 테스트 체크리스트](./DEPLOYMENT_TEST_CHECKLIST.md)

---

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [환경변수 설정 가이드](./ENV_SETUP.md)
- [배포 체크리스트](./DEPLOYMENT_CHECKLIST.md)

---

**마지막 업데이트**: 2025-01-XX

