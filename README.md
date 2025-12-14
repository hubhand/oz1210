<div align="center">
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next.JS_15-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=black" alt="next.js" />
    <img src="https://img.shields.io/badge/-React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="react" />
    <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="typescript" />
    <img src="https://img.shields.io/badge/-Tailwind_v4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="tailwind" />
    <img src="https://img.shields.io/badge/-Clerk-6C47FF?style=for-the-badge&logoColor=white&logo=clerk" alt="clerk" />
    <img src="https://img.shields.io/badge/-Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="supabase" />
  </div>

  <h1 align="center">SaaS 템플릿</h1>
  <h3 align="center">Next.js 15 + Clerk + Supabase</h3>

  <p align="center">
    프로덕션 레디 SaaS 애플리케이션을 위한 풀스택 보일러플레이트
  </p>
</div>

## 📋 목차

1. [소개](#소개)
2. [기술 스택](#기술-스택)
3. [주요 기능](#주요-기능)
4. [시작하기](#시작하기)
5. [추가 설정 및 팁](#추가-설정-및-팁)
6. [프로젝트 구조](#프로젝트-구조)

## 소개

Next.js 15, Clerk, Supabase를 활용한 모던 SaaS 애플리케이션 템플릿입니다.

**핵심 특징:**

- ✨ Next.js 15 + React 19 최신 기능 활용
- 🔐 Clerk와 Supabase 네이티브 통합 (2025년 권장 방식)
- 🎨 Tailwind CSS v4 + shadcn/ui
- 📱 완전한 반응형 디자인
- 🌐 한국어 지원 (Clerk 한국어 로컬라이제이션)

## 기술 스택

### 프레임워크 & 라이브러리

- **[Next.js 15](https://nextjs.org/)** - React 프레임워크 (App Router, Server Components)
- **[React 19](https://react.dev/)** - UI 라이브러리
- **[TypeScript](https://www.typescriptlang.org/)** - 타입 안정성

### 인증 & 데이터베이스

- **[Clerk](https://clerk.com/)** - 사용자 인증 및 관리
  - Google, 이메일 등 다양한 로그인 방식 지원
  - 한국어 UI 지원
  - Supabase와 네이티브 통합
- **[Supabase](https://supabase.com/)** - PostgreSQL 데이터베이스
  - 실시간 데이터 동기화
  - Row Level Security (RLS)
  - 파일 스토리지

### UI & 스타일링

- **[Tailwind CSS v4](https://tailwindcss.com/)** - 유틸리티 우선 CSS 프레임워크
- **[shadcn/ui](https://ui.shadcn.com/)** - 재사용 가능한 컴포넌트 라이브러리
- **[Radix UI](https://www.radix-ui.com/)** - 접근성 높은 헤드리스 컴포넌트
- **[lucide-react](https://lucide.dev/)** - 아이콘 라이브러리

### 폼 & 검증

- **[React Hook Form](https://react-hook-form.com/)** - 폼 상태 관리
- **[Zod](https://zod.dev/)** - 스키마 검증

## 주요 기능

### 🔐 인증 시스템

- Clerk를 통한 안전한 사용자 인증
- 소셜 로그인 지원 (Google 등)
- Clerk 사용자 자동으로 Supabase DB에 동기화
- 한국어 UI 지원

### 🗄️ 데이터베이스 통합

- Clerk 토큰 기반 Supabase 인증 (JWT 템플릿 불필요)
- 환경별 Supabase 클라이언트 분리:
  - Client Component용 (`useClerkSupabaseClient`)
  - Server Component용 (`createClerkSupabaseClient`)
  - 관리자 권한용 (`createServiceRoleClient`)
- SQL 마이그레이션 시스템

### 🎨 UI/UX

- shadcn/ui 기반 모던 컴포넌트
- 완전한 반응형 디자인
- 다크/라이트 모드 지원 가능
- 접근성 준수 (WCAG)

### 🏗️ 아키텍처

- Server Actions 우선 사용
- 타입 안전성 보장
- 모듈화된 코드 구조
- Next.js 15 최신 패턴 적용

## 시작하기

### 필수 요구사항

시스템에 다음이 설치되어 있어야 합니다:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en) (v18 이상)
- [pnpm](https://pnpm.io/) (권장 패키지 매니저)

```bash
# pnpm 설치
npm install -g pnpm
```

### 프로젝트 초기화

다음 단계를 순서대로 진행하세요:

#### 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. Organization 선택 (없으면 새로 생성)
4. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성 (기억할 필요 없음, Supabase가 관리)
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
5. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

#### 2. Clerk 프로젝트 생성

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 접속하여 로그인
2. **"Create application"** 클릭
3. 애플리케이션 정보 입력:
   - **Application name**: 원하는 이름 (예: `SaaS Template`)
   - **Sign-in options**: Email, Google 등 원하는 인증 방식 선택
4. **"Create application"** 클릭
5. Quick Start 화면에서 **"Continue in Dashboard"** 클릭

#### 3. Clerk + Supabase 통합

> **중요**: 2025년 4월부터 Clerk의 **네이티브 Supabase 통합**을 사용합니다. JWT Template은 더 이상 필요하지 않습니다.

**3-1. Clerk에서 Supabase 통합 활성화**

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. **Integrations** → **Supabase** 메뉴로 이동
3. **"Activate Supabase integration"** 클릭
4. **Clerk domain** 복사 (예: `https://your-app-12.clerk.accounts.dev`)
   - 이 값은 다음 단계에서 사용합니다

**3-2. Supabase에서 Clerk를 Third-Party Auth Provider로 설정**

1. [Supabase Dashboard](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택 → **Settings** → **Authentication**
3. **Providers** 탭으로 이동
4. 페이지 하단의 **"Third-Party Auth"** 섹션 찾기
5. **"Add Provider"** 또는 **"Enable Custom Access Token"** 클릭
6. 다음 정보 입력:

   - **Provider Name**: `Clerk` (또는 원하는 이름)
   - **JWT Issuer (Issuer URL)**:

     ```
     https://your-app-12.clerk.accounts.dev
     ```

     (3-1에서 복사한 Clerk domain 사용)

   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일한 domain 사용, `.well-known/jwks.json` 추가)

7. **"Save"** 또는 **"Add Provider"** 클릭

**3-3. 통합 확인**

- [상세 통합 가이드](./docs/CLERK_SUPABASE_INTEGRATION.md) 참고
- [Clerk 공식 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase) 참고

#### 4. Supabase Storage 생성 및 설정

1. Supabase Dashboard → **Storage** 메뉴
2. **"New bucket"** 클릭
3. 버킷 정보 입력:
   - **Name**: `uploads` (`.env.example`과 동일하게)
   - **Public bucket**: 필요에 따라 선택
     - Public: 누구나 URL로 파일 접근 가능
     - Private: 인증된 사용자만 접근 (RLS 정책 필요)
4. **"Create bucket"** 클릭

#### 5. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor** 메뉴
2. **"New query"** 클릭
3. `supabase/migrations/schema.sql` 파일 내용을 복사하여 붙여넣기
4. **"Run"** 클릭하여 실행
5. 성공 메시지 확인 (`Success. No rows returned`)

**생성되는 테이블:**

- `users`: Clerk 사용자와 동기화되는 사용자 정보 테이블

#### 6. 환경 변수 설정

**6-1. 저장소 클론 및 의존성 설치**

```bash
git clone <your-repository-url>
cd saas-template
pnpm install
```

**6-2. .env 파일 생성**

프로젝트 루트에 `.env` 파일을 생성하고 환경 변수를 설정하세요:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS/Linux
cp .env.example .env
```

**6-3. 환경 변수 설정**

`.env` 파일을 열고 각 환경 변수에 실제 값을 입력하세요. 각 환경 변수의 발급 방법은 [환경변수 설정 가이드](docs/ENV_SETUP.md)를 참고하세요.

**필수 환경 변수**:

1. **한국관광공사 API**

   - `NEXT_PUBLIC_TOUR_API_KEY`: 공공데이터포털(data.go.kr)에서 발급
   - 발급 방법: https://www.data.go.kr/data/15101578/openapi.do

2. **네이버 지도 API**

   - `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID`: 네이버 클라우드 플랫폼(NCP)에서 발급
   - 발급 방법: https://www.ncloud.com/ (Web Dynamic Map 서비스 활성화 필요)

3. **Supabase**

   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase Dashboard → Settings → API
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase Dashboard → Settings → API
   - `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → Settings → API
   - `NEXT_PUBLIC_STORAGE_BUCKET`: 기본값 `uploads` 사용 가능

4. **Clerk 인증**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk Dashboard → API Keys
   - `CLERK_SECRET_KEY`: Clerk Dashboard → API Keys

**선택 환경 변수** (기본값 사용 가능):

- `NEXT_PUBLIC_SITE_URL`: 프로덕션 사이트 URL (기본값: `https://my-trip.vercel.app`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: 로그인 페이지 URL (기본값: `/sign-in`)
- `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`: 로그인 후 리다이렉트 URL (기본값: `/`)
- `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`: 회원가입 후 리다이렉트 URL (기본값: `/`)

> 💡 **참고**:
>
> - 모든 환경 변수 목록과 상세 가이드는 프로젝트 루트의 `.env.example` 파일을 참고하세요.
> - 프로덕션 배포 시 환경 변수 설정 방법은 [환경변수 설정 가이드](docs/ENV_SETUP.md)를 참고하세요.
> - ⚠️ **보안 주의**: `.env` 파일은 절대 Git에 커밋하지 마세요! `.env.example` 파일만 커밋하세요.

#### 7. Cursor MCP 설정 (선택사항)

> Cursor AI를 사용하는 경우, Supabase MCP 서버를 설정하면 AI가 데이터베이스를 직접 조회하고 관리할 수 있습니다.

**7-1. Supabase Access Token 생성**

1. Supabase Dashboard → 우측 상단 프로필 아이콘 클릭
2. **Account Settings** → **Access Tokens**
3. **"Generate new token"** 클릭
4. Token name 입력 (예: `cursor-mcp`)
5. 생성된 토큰 복사 (다시 볼 수 없으므로 안전한 곳에 보관)

**7-2. .cursor/mcp.json 설정**

`.cursor/mcp.json` 파일을 열고 `your_supabase_access_token` 부분을 실제 토큰으로 교체:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ]
    }
  }
}
```

**7-3. Cursor 재시작**

Cursor를 완전히 종료하고 다시 실행하여 MCP 서버 설정을 적용합니다.

#### 8. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인합니다.

**테스트 페이지:**

- `/instruments`: Supabase 연결 테스트 (공식 가이드 예시)
- `/auth-test`: Clerk + Supabase 인증 통합 테스트
- `/storage-test`: Supabase Storage 업로드 테스트

### 개발 명령어

```bash
# 개발 서버 실행 (Turbopack)
pnpm dev

# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start

# 린팅
pnpm lint
```

## 배포

### Vercel 배포

이 프로젝트는 Vercel에 배포할 수 있습니다.

**배포 상태**: [![Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/my-trip)

#### 빠른 시작

1. **Vercel 프로젝트 생성**

   - [배포 가이드](./docs/DEPLOYMENT_GUIDE.md) 참고

2. **환경변수 설정**

   - [배포 체크리스트](./docs/DEPLOYMENT_CHECKLIST.md) 참고
   - Vercel Dashboard → Settings → Environment Variables

3. **배포 확인**
   - [배포 후 테스트 체크리스트](./docs/DEPLOYMENT_TEST_CHECKLIST.md) 참고

#### 배포 관련 문서

- [배포 가이드](./docs/DEPLOYMENT_GUIDE.md) - Vercel 프로젝트 생성, 환경변수 설정, 첫 배포 방법
- [배포 체크리스트](./docs/DEPLOYMENT_CHECKLIST.md) - 필수 환경변수 목록 및 Vercel Dashboard 설정 방법
- [배포 후 테스트 체크리스트](./docs/DEPLOYMENT_TEST_CHECKLIST.md) - 기능 테스트, 성능 확인, 에러 처리 확인 항목
- [환경변수 설정 가이드](./docs/ENV_SETUP.md) - 환경변수 발급 방법

#### 빌드 테스트

배포 전에 로컬에서 빌드 테스트를 실행하세요:

```bash
# Windows
powershell -ExecutionPolicy Bypass -File scripts/test-build.ps1

# Unix/Linux/macOS
bash scripts/test-build.sh

# 또는 직접 빌드
pnpm build
```

## 추가 설정 및 팁

### Clerk 한국어 설정

프로젝트에 이미 Clerk 한국어 로컬라이제이션이 적용되어 있습니다. `app/layout.tsx`의 `ClerkProvider`에서 `koKR` locale이 설정되어 있습니다.

### Supabase RLS (Row Level Security) 정책

> **현재 상태**: 프로젝트는 **개발 단계**이므로 RLS가 비활성화되어 있습니다. 빠른 개발을 위한 설정입니다.

**프로덕션 배포 전**에는 반드시 RLS를 활성화하고 적절한 정책을 설정해야 합니다.

#### RLS 정책 예시

```sql
-- RLS 활성화 (프로덕션에서만)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 데이터만 조회
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.jwt()->>'sub' = clerk_id
);

-- INSERT 정책: 사용자는 자신의 데이터만 생성
CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt()->>'sub' = clerk_id
);
```

> 💡 **더 많은 예시**: `supabase/migrations/20250101000000_rls_policies_example.sql` 파일을 참고하세요.

### 추가 로그인 방식 설정

Clerk에서 추가 로그인 방식을 활성화하려면:

1. Clerk Dashboard → **User & Authentication** → **Social Connections**
2. 원하는 제공자 선택 (Google, GitHub, Discord 등)
3. OAuth 자격 증명 입력 (제공자 개발자 콘솔에서 생성)
4. **Enable** 클릭

## 프로젝트 구조

```
saas-template/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── sync-user/    # Clerk → Supabase 사용자 동기화
│   ├── auth-test/        # 인증 테스트 페이지
│   ├── storage-test/     # 스토리지 테스트 페이지
│   ├── layout.tsx        # Root Layout (Clerk Provider)
│   ├── page.tsx          # 홈페이지
│   └── globals.css       # 전역 스타일 (Tailwind v4 설정)
│
├── components/            # React 컴포넌트
│   ├── ui/               # shadcn/ui 컴포넌트 (자동 생성)
│   ├── providers/        # Context Providers
│   │   └── sync-user-provider.tsx
│   └── Navbar.tsx        # 네비게이션 바
│
├── lib/                   # 유틸리티 및 설정
│   ├── supabase/         # Supabase 클라이언트들
│   │   ├── clerk-client.ts    # Client Component용
│   │   ├── server.ts          # Server Component용
│   │   ├── service-role.ts    # 관리자용
│   │   └── client.ts          # 공개 데이터용
│   └── utils.ts          # 공통 유틸리티 (cn 함수 등)
│
├── hooks/                 # Custom React Hooks
│   └── use-sync-user.ts  # 사용자 동기화 훅
│
├── supabase/             # Supabase 관련 파일
│   ├── migrations/       # 데이터베이스 마이그레이션
│   │   └── schema.sql   # 초기 스키마
│   └── config.toml       # Supabase 프로젝트 설정
│
├── .cursor/              # Cursor AI 규칙
│   └── rules/           # 개발 컨벤션 및 가이드
│
├── middleware.ts         # Next.js 미들웨어 (Clerk)
├── .env.example         # 환경 변수 예시
└── CLAUDE.md            # AI 에이전트용 프로젝트 가이드
```

### 주요 파일 설명

- **`middleware.ts`**: Clerk 인증 미들웨어 설정
- **`app/layout.tsx`**: ClerkProvider와 SyncUserProvider 설정
- **`lib/supabase/`**: 환경별 Supabase 클라이언트 (매우 중요!)
- **`hooks/use-sync-user.ts`**: Clerk 사용자를 Supabase에 자동 동기화
- **`components/providers/sync-user-provider.tsx`**: 앱 전역에서 사용자 동기화 실행
- **`CLAUDE.md`**: Claude Code를 위한 프로젝트 가이드

## 추가 리소스

### 공식 문서

- [Next.js 15 문서](https://nextjs.org/docs)
- [Clerk 문서](https://clerk.com/docs)
- [Supabase 문서](https://supabase.com/docs)
- [shadcn/ui 문서](https://ui.shadcn.com/)
- [Tailwind CSS v4 문서](https://tailwindcss.com/docs)

### 프로젝트 문서

- [Supabase 연결 가이드](./docs/SUPABASE_SETUP.md) - Supabase 프로젝트 생성 및 연결 방법
- [Clerk + Supabase 통합 가이드](./docs/CLERK_SUPABASE_INTEGRATION.md) - 상세한 통합 설정 및 문제 해결
- [Clerk 한국어 로컬라이제이션 가이드](./docs/CLERK_LOCALIZATION.md) - Clerk 컴포넌트 한국어 설정 및 커스터마이징
- [프로젝트 TODO](./docs/TODO.md) - 개발 진행 상황
- [프로젝트 구조](./docs/DIR.md) - 디렉토리 구조 설명
