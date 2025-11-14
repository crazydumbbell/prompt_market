-- ============================================
-- Clerk + Supabase 통합 마이그레이션
-- Native Third-Party Auth Provider 방식 (2025 권장)
-- ============================================
-- 참고: https://clerk.com/docs/guides/development/integrations/databases/supabase

-- 1. 기존 테이블에 user_id 컬럼 추가 (auth.jwt()->>'sub'를 기본값으로)
-- ============================================

-- profiles 테이블
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT (auth.jwt()->>'sub');

COMMENT ON COLUMN profiles.user_id IS 'Clerk user ID from JWT token (auth.jwt()->>"sub")';

-- 인덱스 생성 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- carts 테이블 (이미 user_id가 있지만 기본값 설정)
ALTER TABLE carts 
ALTER COLUMN user_id SET DEFAULT (auth.jwt()->>'sub');

-- purchases 테이블
ALTER TABLE purchases 
ALTER COLUMN buyer_id SET DEFAULT (auth.jwt()->>'sub');


-- 2. RLS (Row Level Security) 활성화
-- ============================================

-- profiles 테이블 RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- carts 테이블 RLS 활성화
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;

-- purchases 테이블 RLS 활성화
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;


-- 3. RLS 정책 생성 (Clerk user ID 기반)
-- ============================================

-- profiles 정책
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt()->>'sub') = user_id);


-- carts 정책
DROP POLICY IF EXISTS "Users can view their own cart" ON carts;
CREATE POLICY "Users can view their own cart"
ON carts
FOR SELECT
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "Users can insert into their own cart" ON carts;
CREATE POLICY "Users can insert into their own cart"
ON carts
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt()->>'sub') = user_id);

DROP POLICY IF EXISTS "Users can delete from their own cart" ON carts;
CREATE POLICY "Users can delete from their own cart"
ON carts
FOR DELETE
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);


-- purchases 정책
DROP POLICY IF EXISTS "Users can view their own purchases" ON purchases;
CREATE POLICY "Users can view their own purchases"
ON purchases
FOR SELECT
TO authenticated
USING ((auth.jwt()->>'sub') = buyer_id);

DROP POLICY IF EXISTS "Users can insert their own purchases" ON purchases;
CREATE POLICY "Users can insert their own purchases"
ON purchases
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt()->>'sub') = buyer_id);


-- 4. prompts 테이블 (공개 읽기 허용)
-- ============================================

ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view prompts" ON prompts;
CREATE POLICY "Anyone can view prompts"
ON prompts
FOR SELECT
TO authenticated, anon
USING (true);

-- 프롬프트 작성자만 수정 가능
DROP POLICY IF EXISTS "Users can update their own prompts" ON prompts;
CREATE POLICY "Users can update their own prompts"
ON prompts
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'sub') = seller_id);


-- 5. 확인 쿼리
-- ============================================

-- RLS가 활성화된 테이블 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'carts', 'purchases', 'prompts');

-- RLS 정책 확인
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

