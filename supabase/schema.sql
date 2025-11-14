-- ============================================
-- Prompt Market Database Schema
-- ============================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. Profiles Table (사용자 프로필)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. Prompts Table (프롬프트 상품)
-- ============================================
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

-- Enable RLS
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

-- Prompts Policies (모든 사용자가 볼 수 있음)
CREATE POLICY "Prompts are viewable by everyone"
    ON public.prompts FOR SELECT
    USING (is_active = true);

-- ============================================
-- 4. Carts Table (장바구니)
-- ============================================
CREATE TABLE IF NOT EXISTS public.carts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

-- Carts Policies
CREATE POLICY "Users can view own cart"
    ON public.carts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into own cart"
    ON public.carts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
    ON public.carts FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- 5. Purchases Table (구매 기록)
-- ============================================
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    buyer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
    payment_order_id TEXT UNIQUE NOT NULL,
    payment_amount INTEGER NOT NULL,
    payment_status TEXT DEFAULT 'completed'
);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- Purchases Policies
CREATE POLICY "Users can view own purchases"
    ON public.purchases FOR SELECT
    USING (auth.uid() = buyer_id);

-- ============================================
-- 6. Indexes for Performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_carts_user_id ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS idx_carts_prompt_id ON public.carts(prompt_id);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer_id ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_prompt_id ON public.purchases(prompt_id);
CREATE INDEX IF NOT EXISTS idx_purchases_payment_order_id ON public.purchases(payment_order_id);

-- ============================================
-- 7. Trigger: Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nickname)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'nickname', 'User' || substr(NEW.id::text, 1, 8)));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8. Function: Get cart total
-- ============================================
CREATE OR REPLACE FUNCTION public.get_cart_total(user_uuid UUID)
RETURNS INTEGER AS $$
    SELECT COALESCE(SUM(p.price), 0)::INTEGER
    FROM public.carts c
    JOIN public.prompts p ON c.prompt_id = p.id
    WHERE c.user_id = user_uuid;
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- 9. Sample Data (Optional - for testing)
-- ============================================
-- Uncomment to insert sample prompts

/*
INSERT INTO public.prompts (title, description, price, prompt_text, thumbnail_url, category) VALUES
('AI 로고 디자인 프롬프트', '전문적인 로고를 생성하는 Midjourney 프롬프트입니다.', 5000, 'professional logo design, minimalist, modern, vector style, clean lines, --ar 1:1 --v 6', 'https://via.placeholder.com/400', 'design'),
('블로그 글 작성 프롬프트', 'SEO 최적화된 블로그 글을 작성하는 ChatGPT 프롬프트입니다.', 3000, 'You are an expert SEO content writer. Write a comprehensive blog post about [TOPIC] with the following structure...', 'https://via.placeholder.com/400', 'writing'),
('상품 설명 생성 프롬프트', '매력적인 상품 설명을 자동 생성하는 프롬프트입니다.', 4000, 'Create a compelling product description for [PRODUCT] that highlights its key features and benefits...', 'https://via.placeholder.com/400', 'marketing');
*/

