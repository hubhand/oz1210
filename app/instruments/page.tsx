import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

/**
 * Supabase 공식 Next.js 가이드 예시 페이지
 *
 * 이 페이지는 Supabase 공식 문서의 예시를 기반으로 작성되었습니다.
 * Clerk 통합이 적용되어 있어 인증된 사용자만 데이터에 접근할 수 있습니다.
 *
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select();

  if (error) {
    console.error("Error fetching instruments:", error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">에러 발생</h3>
        <p className="text-sm text-red-700">{error.message}</p>
        <p className="text-xs text-red-600 mt-2">
          💡 <strong>해결 방법:</strong>
          <br />
          1. Supabase Dashboard에서 <code>instruments</code> 테이블이
          생성되었는지 확인
          <br />
          2. RLS 정책이 올바르게 설정되었는지 확인
          <br />
          3. 환경 변수가 올바르게 설정되었는지 확인
        </p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          데이터가 없습니다. Supabase Dashboard에서 <code>instruments</code>{" "}
          테이블에 데이터를 추가해주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">악기 목록</h2>
      <ul className="space-y-2">
        {instruments.map((instrument: any) => (
          <li
            key={instrument.id}
            className="p-3 bg-white border rounded-lg hover:bg-gray-50"
          >
            <span className="font-medium">{instrument.name}</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          💡 데이터 추가 방법
        </h3>
        <p className="text-sm text-blue-700 mb-2">
          Supabase Dashboard의 SQL Editor에서 다음 쿼리를 실행하세요:
        </p>
        <pre className="text-xs bg-white p-3 rounded border overflow-x-auto">
          {`-- instruments 테이블 생성
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

-- RLS 정책 설정 (공개 읽기 허용)
ALTER TABLE instruments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public can read instruments"
ON public.instruments
FOR SELECT
TO anon
USING (true);`}
        </pre>
      </div>
    </div>
  );
}

export default function Instruments() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Supabase 연결 테스트</h1>
        <p className="text-gray-600">
          Supabase 공식 Next.js 가이드 예시를 기반으로 작성된 페이지입니다.
        </p>
      </div>

      <Suspense fallback={<div className="text-center py-8">로딩 중...</div>}>
        <InstrumentsData />
      </Suspense>
    </div>
  );
}
