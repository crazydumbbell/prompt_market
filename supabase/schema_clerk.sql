-- ============================================
-- Prompt Market Database Schema (Clerk Edition)
-- Clerk 인증을 사용하는 버전
-- ============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Profiles Table (사용자 프로필)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL UNIQUE, -- Clerk user ID
    email TEXT,
    nickname TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- ============================================
-- 3. Prompts Table (프롬프트 상품)
-- ============================================
CREATE TABLE IF NOT EXISTS public.prompts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    seller_id TEXT, -- Clerk user ID (판매자)
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    prompt_text TEXT NOT NULL,
    image_urls TEXT[] DEFAULT '{}',
    thumbnail_url TEXT,
    category TEXT DEFAULT 'general',
    is_active BOOLEAN DEFAULT true
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_prompts_seller_id ON public.prompts(seller_id);
CREATE INDEX IF NOT EXISTS idx_prompts_category ON public.prompts(category);

-- ============================================
-- 4. Carts Table (장바구니)
-- ============================================
CREATE TABLE IF NOT EXISTS public.carts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id TEXT NOT NULL, -- Clerk user ID
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    UNIQUE(user_id, prompt_id)
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_prompt_id ON public.carts(prompt_id);

-- ============================================
-- 5. Purchases Table (구매 기록)
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    buyer_id TEXT NOT NULL, -- Clerk user ID
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    payment_order_id TEXT UNIQUE NOT NULL,
    payment_amount INTEGER NOT NULL,
    payment_status TEXT DEFAULT 'completed'
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_prompt_id ON public.purchases(prompt_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_order_id ON public.purchases(payment_order_id);

-- ============================================
-- 6. Function: Get cart total
-- ============================================
CREATE OR REPLACE FUNCTION public.get_cart_total(user_clerk_id TEXT)
RETURNS INTEGER AS $$
    SELECT COALESCE(SUM(p.price), 0)::INTEGER
    FROM public.carts c
    JOIN public.prompts p ON c.prompt_id = p.id
    WHERE c.user_id = user_clerk_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 7. Sample Data (Optional - for testing)
-- ============================================
-- 테스트용 샘플 프롬프트 (주석 해제하여 사용)

/*
INSERT INTO public.prompts (title, description, price, prompt_text, thumbnail_url, category) VALUES
('AI 로고 디자인 프롬프트', '전문적인 로고를 생성하는 Midjourney 프롬프트입니다.', 5000, 'professional logo design, minimalist, modern, vector style, clean lines, --ar 1:1 --v 6', 'https://via.placeholder.com/400', 'design'),
('블로그 글 작성 프롬프트', 'SEO 최적화된 블로그 글을 작성하는 ChatGPT 프롬프트입니다.', 3000, 'You are an expert SEO content writer. Write a comprehensive blog post about [TOPIC] with the following structure...', 'https://via.placeholder.com/400', 'writing'),
('상품 설명 생성 프롬프트', '매력적인 상품 설명을 자동 생성하는 프롬프트입니다.', 4000, 'Create a compelling product description for [PRODUCT] that highlights its key features and benefits...', 'https://via.placeholder.com/400', 'marketing'),
('소셜 미디어 콘텐츠 프롬프트', '인스타그램, 페이스북용 매력적인 게시글을 작성합니다.', 3500, 'Create engaging social media content for [PLATFORM] about [TOPIC]...', 'https://via.placeholder.com/400', 'marketing'),
('이메일 마케팅 프롬프트', '전환율 높은 마케팅 이메일을 작성하는 프롬프트입니다.', 4500, 'Write a compelling marketing email for [PRODUCT/SERVICE] that drives conversions...', 'https://via.placeholder.com/400', 'marketing');
*/

