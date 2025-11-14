-- ============================================
-- Prompts 테이블 생성 및 RLS 설정
-- ============================================

-- 1. UUID extension 활성화 (이미 있을 수 있음)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Prompts 테이블 생성
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    prompt_text TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true
);

-- 3. RLS 활성화
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- 4. RLS 정책 설정

-- 4-1. 읽기 정책: 모든 사용자가 활성화된 프롬프트를 볼 수 있음
CREATE POLICY "prompts_select_policy"
    ON public.prompts
    FOR SELECT
    USING (is_active = true);

-- 4-2. 삽입 정책: admin만 가능 (Clerk metadata 사용)
CREATE POLICY "prompts_insert_policy"
    ON public.prompts
    FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 4-3. 업데이트 정책: admin만 가능
CREATE POLICY "prompts_update_policy"
    ON public.prompts
    FOR UPDATE
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 4-4. 삭제 정책: admin만 가능
CREATE POLICY "prompts_delete_policy"
    ON public.prompts
    FOR DELETE
    USING (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 5. 인덱스 생성 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);
CREATE INDEX IF NOT EXISTS idx_prompts_is_active ON public.prompts(is_active);
CREATE INDEX IF NOT EXISTS idx_prompts_created_at ON public.prompts(created_at DESC);

-- 6. 확인용 쿼리
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE tablename = 'prompts';

-- RLS 정책 확인
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'prompts';

