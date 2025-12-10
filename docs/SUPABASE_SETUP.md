# Supabase 연결 가이드

이 문서는 Supabase 공식 Next.js 가이드를 기반으로 프로젝트에 Supabase를 연결하는 방법을 설명합니다.

## 📋 목차

1. [Supabase 프로젝트 생성](#supabase-프로젝트-생성)
2. [환경 변수 설정](#환경-변수-설정)
3. [데이터베이스 테이블 생성](#데이터베이스-테이블-생성)
4. [코드에서 Supabase 사용](#코드에서-supabase-사용)
5. [테스트](#테스트)

## Supabase 프로젝트 생성

### 방법 1: Supabase Dashboard 사용 (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard)에 접속하여 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - **Name**: 원하는 프로젝트 이름
   - **Database Password**: 안전한 비밀번호 생성
   - **Region**: `Northeast Asia (Seoul)` 선택 (한국 서비스용)
   - **Pricing Plan**: Free 또는 Pro 선택
4. **"Create new project"** 클릭하고 프로젝트가 준비될 때까지 대기 (~2분)

### 방법 2: Management API 사용

```bash
# Access Token 생성: https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"

# Organization ID 확인
curl -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  https://api.supabase.com/v1/organizations

# 프로젝트 생성 (org-id를 실제 Organization ID로 교체)
curl -X POST https://api.supabase.com/v1/projects \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "organization_id": "<org-id>",
    "name": "My Project",
    "region": "ap-northeast-2",
    "db_pass": "<your-secure-password>"
  }'
```

## 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 환경 변수 가져오기

1. Supabase Dashboard → **Settings** → **API**
2. 다음 값들을 복사:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** 키 → `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ **주의**: `SUPABASE_SERVICE_ROLE_KEY`는 모든 RLS를 우회하는 관리자 권한이므로 절대 공개하지 마세요!

## 데이터베이스 테이블 생성

### 방법 1: Table Editor 사용

1. Supabase Dashboard → **Table Editor**
2. **"New table"** 클릭
3. 테이블 이름과 컬럼 추가
4. **"Save"** 클릭

### 방법 2: SQL Editor 사용 (권장)

1. Supabase Dashboard → **SQL Editor**
2. **"New query"** 클릭
3. 다음 SQL을 실행하여 예시 테이블 생성:

```sql
-- instruments 테이블 생성
CREATE TABLE IF NOT EXISTS instruments (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL
);

-- 샘플 데이터 삽입
INSERT INTO instruments (name)
VALUES
  ('violin'),
  ('viola'),
  ('cello');

-- RLS 활성화
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (개발용)
CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);
```

## 코드에서 Supabase 사용

### Server Component에서 사용

Supabase 공식 패턴을 따릅니다:

```tsx
import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function MyData() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("instruments").select();

  if (error) {
    console.error("Error:", error);
    return <div>에러 발생: {error.message}</div>;
  }

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}

export default function MyPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <MyData />
    </Suspense>
  );
}
```

### Client Component에서 사용

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { useEffect, useState } from "react";

export default function MyComponent() {
  const supabase = useClerkSupabaseClient();
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase.from("instruments").select("*");

      if (error) {
        console.error("Error:", error);
        return;
      }

      setData(data || []);
    }

    fetchData();
  }, [supabase]);

  return (
    <div>
      {data.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Server Action에서 사용

```ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function createInstrument(name: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("instruments")
    .insert({ name })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create instrument: ${error.message}`);
  }

  return data;
}
```

## 테스트

### 1. 예시 페이지 테스트

프로젝트에 `/instruments` 페이지가 포함되어 있습니다:

1. 개발 서버 실행: `pnpm dev`
2. 브라우저에서 `http://localhost:3000/instruments` 접속
3. 다음을 확인:
   - ✅ Supabase 연결 성공
   - ✅ 데이터 조회 성공
   - ✅ 에러 처리 동작

### 2. 수동 테스트

#### Server Component 테스트

```tsx
// app/test/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function TestPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.from("instruments").select("*");

  return (
    <div>
      <h1>Test Page</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </div>
  );
}
```

#### Client Component 테스트

```tsx
"use client";

import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";

export default function TestPage() {
  const supabase = useClerkSupabaseClient();

  const testQuery = async () => {
    const { data, error } = await supabase.from("instruments").select("*");

    console.log("Data:", data);
    console.log("Error:", error);
  };

  return <button onClick={testQuery}>테스트</button>;
}
```

## 문제 해결

### 문제 1: "Invalid API key" 에러

**해결 방법**:

1. `.env` 파일의 환경 변수가 올바른지 확인
2. `NEXT_PUBLIC_` 접두사가 있는지 확인 (클라이언트에서 사용하는 경우)
3. 개발 서버를 재시작: `pnpm dev`

### 문제 2: "relation does not exist" 에러

**해결 방법**:

1. Supabase Dashboard에서 테이블이 생성되었는지 확인
2. 테이블 이름이 정확한지 확인 (대소문자 구분)
3. SQL Editor에서 테이블 목록 확인:
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public';
   ```

### 문제 3: RLS 정책으로 인한 접근 거부

**해결 방법**:

1. 개발 중: RLS 비활성화 (현재 설정)
   ```sql
   ALTER TABLE instruments DISABLE ROW LEVEL SECURITY;
   ```
2. 프로덕션: 적절한 RLS 정책 설정
   ```sql
   CREATE POLICY "public can read instruments"
   ON public.instruments
   FOR SELECT
   TO anon
   USING (true);
   ```

### 문제 4: Clerk 토큰이 전달되지 않음

**해결 방법**:

1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. Supabase Dashboard에서 Clerk Provider가 설정되어 있는지 확인
3. [Clerk + Supabase 통합 가이드](./CLERK_SUPABASE_INTEGRATION.md) 참고

## 추가 리소스

- [Supabase 공식 Next.js 가이드](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase JavaScript 클라이언트 문서](https://supabase.com/docs/reference/javascript/introduction)
- [Clerk + Supabase 통합 가이드](./CLERK_SUPABASE_INTEGRATION.md)
- [프로젝트 README.md](../README.md)

## 요약

✅ **설정 완료 체크리스트**:

- [ ] Supabase 프로젝트 생성 완료
- [ ] 환경 변수 설정 완료
- [ ] 테이블 생성 및 샘플 데이터 삽입 완료
- [ ] `/instruments` 페이지에서 테스트 성공
- [ ] (선택) RLS 정책 설정

이제 Supabase가 프로젝트에 완전히 연결되었습니다! 🎉
