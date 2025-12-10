-- RLS 정책 예시 (참고용)
-- 
-- ⚠️ 주의: 이 파일은 예시입니다. 실제 프로덕션 환경에서는
-- 각 테이블의 특성에 맞게 RLS 정책을 세밀하게 조정해야 합니다.
--
-- 현재 프로젝트는 개발 단계이므로 RLS가 비활성화되어 있습니다.
-- 프로덕션 배포 전에 이 정책들을 검토하고 적용하세요.

-- ============================================
-- 1. users 테이블 RLS 정책 예시
-- ============================================

-- RLS 활성화 (프로덕션에서만)
-- ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 조회 가능
-- CREATE POLICY "Users can view their own data"
-- ON public.users
-- FOR SELECT
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = clerk_id
-- );

-- 사용자는 자신의 데이터만 수정 가능
-- CREATE POLICY "Users can update their own data"
-- ON public.users
-- FOR UPDATE
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = clerk_id
-- )
-- WITH CHECK (
--   auth.jwt()->>'sub' = clerk_id
-- );

-- 사용자는 자신의 데이터만 삭제 가능
-- CREATE POLICY "Users can delete their own data"
-- ON public.users
-- FOR DELETE
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = clerk_id
-- );

-- ============================================
-- 2. 일반적인 테이블 RLS 정책 패턴
-- ============================================

-- 예시: tasks 테이블
-- CREATE TABLE IF NOT EXISTS public.tasks (
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id TEXT NOT NULL,
--   title TEXT NOT NULL,
--   description TEXT,
--   completed BOOLEAN DEFAULT false,
--   created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
--   updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
-- );

-- RLS 활성화
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- SELECT 정책: 사용자는 자신의 tasks만 조회
-- CREATE POLICY "Users can view their own tasks"
-- ON public.tasks
-- FOR SELECT
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = user_id
-- );

-- INSERT 정책: 사용자는 자신의 tasks만 생성
-- CREATE POLICY "Users can insert their own tasks"
-- ON public.tasks
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--   auth.jwt()->>'sub' = user_id
-- );

-- UPDATE 정책: 사용자는 자신의 tasks만 수정
-- CREATE POLICY "Users can update their own tasks"
-- ON public.tasks
-- FOR UPDATE
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = user_id
-- )
-- WITH CHECK (
--   auth.jwt()->>'sub' = user_id
-- );

-- DELETE 정책: 사용자는 자신의 tasks만 삭제
-- CREATE POLICY "Users can delete their own tasks"
-- ON public.tasks
-- FOR DELETE
-- TO authenticated
-- USING (
--   auth.jwt()->>'sub' = user_id
-- );

-- ============================================
-- 3. 유용한 헬퍼 함수 (선택사항)
-- ============================================

-- Clerk user ID를 반환하는 함수
-- CREATE OR REPLACE FUNCTION requesting_user_id()
-- RETURNS TEXT
-- LANGUAGE SQL
-- STABLE
-- AS $$
--   SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::TEXT;
-- $$;

-- 사용 예시:
-- CREATE POLICY "Users can view their own data"
-- ON public.tasks
-- FOR SELECT
-- TO authenticated
-- USING (
--   requesting_user_id() = user_id
-- );

-- ============================================
-- 4. RLS 정책 확인 쿼리
-- ============================================

-- 모든 테이블의 RLS 상태 확인
-- SELECT
--   schemaname,
--   tablename,
--   rowsecurity as rls_enabled
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- 특정 테이블의 RLS 정책 확인
-- SELECT
--   schemaname,
--   tablename,
--   policyname,
--   permissive,
--   roles,
--   cmd,
--   qual,
--   with_check
-- FROM pg_policies
-- WHERE schemaname = 'public'
--   AND tablename = 'users'
-- ORDER BY policyname;

