# Clerk + Supabase 통합 가이드

이 문서는 2025년 최신 모범 사례를 기반으로 Clerk와 Supabase를 통합하는 방법을 설명합니다.

## 📋 목차

1. [개요](#개요)
2. [통합 설정 단계](#통합-설정-단계)
3. [코드 구현](#코드-구현)
4. [RLS 정책 설정](#rls-정책-설정)
5. [테스트 및 검증](#테스트-및-검증)
6. [문제 해결](#문제-해결)

## 개요

### 네이티브 통합 방식 (2025년 권장)

2025년 4월부터 Clerk는 Supabase와의 **네이티브 통합**을 제공합니다. 이 방식의 장점:

- ✅ **JWT 템플릿 불필요**: Clerk 대시보드에서 JWT 템플릿을 설정할 필요가 없습니다
- ✅ **자동 토큰 검증**: Supabase가 Clerk의 JWT를 자동으로 검증합니다
- ✅ **간단한 설정**: `accessToken` 함수만으로 통합 완료
- ✅ **보안 강화**: JWT Secret을 공유할 필요가 없습니다

### 통합 아키텍처

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Client    │ ──────> │    Clerk     │ ──────> │  Supabase   │
│  (Next.js)  │         │  (Auth)      │         │  (Database) │
└─────────────┘         └──────────────┘         └─────────────┘
     │                        │                        │
     │ 1. 로그인 요청          │                        │
     │ <──────────────────────│                        │
     │                        │                        │
     │ 2. 세션 토큰 수신       │                        │
     │ <──────────────────────│                        │
     │                        │                        │
     │ 3. Supabase 요청       │                        │
     │    (토큰 포함)          │                        │
     │ ──────────────────────────────────────────────>│
     │                        │                        │
     │                        │ 4. 토큰 검증           │
     │                        │ <──────────────────────│
     │                        │                        │
     │ 5. 데이터 반환          │                        │
     │ <───────────────────────────────────────────────│
```

## 통합 설정 단계

### 1단계: Clerk에서 Supabase 통합 활성화

1. [Clerk Dashboard](https://dashboard.clerk.com/)에 로그인
2. **Integrations** → **Supabase** 메뉴로 이동
3. **"Activate Supabase integration"** 클릭
4. **Clerk domain** 복사 (예: `https://your-app-12.clerk.accounts.dev`)
   - 이 값은 다음 단계에서 사용합니다

### 2단계: Supabase에서 Clerk를 Third-Party Auth Provider로 설정

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

     (1단계에서 복사한 Clerk domain 사용)

   - **JWKS Endpoint (JWKS URI)**:
     ```
     https://your-app-12.clerk.accounts.dev/.well-known/jwks.json
     ```
     (동일한 domain 사용, `.well-known/jwks.json` 추가)

7. **"Save"** 또는 **"Add Provider"** 클릭

### 3단계: 환경 변수 설정

`.env` 파일에 다음 변수들이 설정되어 있는지 확인:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> 💡 **참고**: `.env.example` 파일을 참고하여 필요한 모든 환경 변수를 설정하세요.

## 코드 구현

프로젝트에는 이미 최신 통합 방식이 구현되어 있습니다. 각 환경별 클라이언트 사용법:

### Client Component에서 사용

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();

  async function fetchData() {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    if (error) {
      console.error("Error:", error);
      return;
    }

    return data;
  }

  return <div>...</div>;
}
```

### Server Component에서 사용

```tsx
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase.from("users").select("*");

  if (error) {
    throw error;
  }

  return (
    <div>
      {data?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```ts
"use server";

import { createClerkSupabaseClient } from "@/lib/supabase/server";

export async function createTask(title: string) {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase
    .from("tasks")
    .insert({ title, user_id: "clerk_user_id" })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create task: ${error.message}`);
  }

  return data;
}
```

## RLS 정책 설정

### 개발 환경

현재 프로젝트는 **개발 단계**이므로 RLS가 비활성화되어 있습니다. 이는 빠른 개발을 위한 설정입니다.

```sql
-- 개발 중: RLS 비활성화
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
```

### 프로덕션 환경

프로덕션 배포 전에는 반드시 RLS를 활성화하고 적절한 정책을 설정해야 합니다.

#### 기본 RLS 정책 패턴

```sql
-- 1. RLS 활성화
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. SELECT 정책: 사용자는 자신의 데이터만 조회
CREATE POLICY "Users can view their own data"
ON public.users
FOR SELECT
TO authenticated
USING (
  auth.jwt()->>'sub' = clerk_id
);

-- 3. INSERT 정책: 사용자는 자신의 데이터만 생성
CREATE POLICY "Users can insert their own data"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt()->>'sub' = clerk_id
);

-- 4. UPDATE 정책: 사용자는 자신의 데이터만 수정
CREATE POLICY "Users can update their own data"
ON public.users
FOR UPDATE
TO authenticated
USING (
  auth.jwt()->>'sub' = clerk_id
)
WITH CHECK (
  auth.jwt()->>'sub' = clerk_id
);

-- 5. DELETE 정책: 사용자는 자신의 데이터만 삭제
CREATE POLICY "Users can delete their own data"
ON public.users
FOR DELETE
TO authenticated
USING (
  auth.jwt()->>'sub' = clerk_id
);
```

#### 유용한 헬퍼 함수

```sql
-- Clerk user ID를 반환하는 함수
CREATE OR REPLACE FUNCTION requesting_user_id()
RETURNS TEXT
LANGUAGE SQL
STABLE
AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::TEXT;
$$;

-- 사용 예시
CREATE POLICY "Users can view their own tasks"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  requesting_user_id() = user_id
);
```

> 💡 **참고**: `supabase/migrations/20250101000000_rls_policies_example.sql` 파일에 더 많은 예시가 있습니다.

## 테스트 및 검증

### 1. 통합 테스트 페이지

프로젝트에 `/auth-test` 페이지가 포함되어 있습니다:

1. 개발 서버 실행: `pnpm dev`
2. 브라우저에서 `http://localhost:3000/auth-test` 접속
3. Clerk로 로그인
4. 다음 항목들을 확인:
   - ✅ Supabase 연결 상태
   - ✅ Clerk 사용자 정보
   - ✅ Supabase users 테이블 데이터 조회/수정

### 2. 수동 테스트

#### Client Component 테스트

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useUser } from "@clerk/nextjs";

export default function TestPage() {
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  const testQuery = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("clerk_id", user.id)
      .single();

    console.log("Data:", data);
    console.log("Error:", error);
  };

  return <button onClick={testQuery}>테스트</button>;
}
```

#### Server Component 테스트

```tsx
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = createClerkSupabaseClient();

  const { data, error } = await supabase.from("users").select("*");

  return (
    <div>
      <h1>Users</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## 문제 해결

### 문제 1: "Invalid JWT" 에러

**증상**: Supabase에서 "Invalid JWT" 또는 "JWT expired" 에러 발생

**해결 방법**:

1. Supabase Dashboard에서 Clerk provider 설정 확인
   - JWT Issuer URL이 정확한지 확인
   - JWKS URI가 올바른지 확인
2. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
3. 환경 변수가 올바르게 설정되어 있는지 확인

### 문제 2: RLS 정책으로 인한 접근 거부

**증상**: "new row violates row-level security policy" 에러 발생

**해결 방법**:

1. 개발 중: RLS 비활성화 (현재 설정)
   ```sql
   ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
   ```
2. 프로덕션: RLS 정책 확인 및 수정
   - `auth.jwt()->>'sub'` 값이 올바른지 확인
   - 정책의 `USING` 및 `WITH CHECK` 조건 확인

### 문제 3: 토큰이 전달되지 않음

**증상**: Supabase 쿼리가 인증되지 않은 사용자로 처리됨

**해결 방법**:

1. `accessToken` 함수가 올바르게 구현되어 있는지 확인
2. Client Component에서는 `useClerkSupabaseClient()` 사용
3. Server Component에서는 `createClerkSupabaseClient()` 사용
4. 브라우저 개발자 도구에서 네트워크 탭 확인:
   - Supabase 요청의 `Authorization` 헤더에 토큰이 포함되어 있는지 확인

### 문제 4: "role" 클레임 누락

**증상**: Supabase에서 "role" 클레임이 없다는 에러

**해결 방법**:

1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. 통합이 활성화되면 Clerk가 자동으로 `"role": "authenticated"` 클레임을 추가합니다
3. 통합을 비활성화했다가 다시 활성화해보세요

## 추가 리소스

- [Clerk 공식 Supabase 통합 가이드](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth 문서](https://supabase.com/docs/guides/auth/third-party/overview)
- [Supabase RLS 가이드](https://supabase.com/docs/guides/auth/row-level-security)
- [프로젝트 README.md](../README.md)

## 요약

✅ **설정 완료 체크리스트**:

- [ ] Clerk Dashboard에서 Supabase 통합 활성화
- [ ] Supabase Dashboard에서 Clerk를 Third-Party Provider로 추가
- [ ] 환경 변수 설정 완료
- [ ] `/auth-test` 페이지에서 통합 테스트 성공
- [ ] (프로덕션) RLS 정책 설정 및 활성화

이제 Clerk와 Supabase가 완전히 통합되었습니다! 🎉
