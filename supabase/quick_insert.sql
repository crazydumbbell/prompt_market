-- ============================================
-- 빠른 테스트용 프롬프트 데이터 (5개)
-- ============================================
-- 이 파일은 빠른 테스트를 위한 최소한의 데이터만 포함합니다.
-- 전체 더미 데이터는 dummy_data.sql을 사용하세요.

-- 기존 데이터 확인
SELECT COUNT(*) as current_count FROM public.prompts;

-- 간단한 프롬프트 5개 삽입
INSERT INTO public.prompts (title, description, price, prompt_text, category, thumbnail_url, is_active) VALUES

('프로페셔널 로고 디자인 프롬프트', 
'Midjourney를 활용한 현대적이고 미니멀한 로고 디자인 프롬프트입니다.', 
8900, 
'professional minimalist logo design for [BRAND NAME], modern vector style, clean lines --ar 1:1 --v 6', 
'design', 
'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
true),

('SEO 최적화 블로그 글 작성 프롬프트', 
'검색엔진 최적화가 반영된 전문적인 블로그 글 작성 프롬프트입니다.', 
9900, 
'당신은 10년 경력의 SEO 전문 콘텐츠 작가입니다. [주제]에 대한 블로그 글을 작성해주세요. 목표 키워드: [키워드], 글 길이: 2000-2500단어', 
'writing', 
'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
true),

('이메일 마케팅 카피 프롬프트', 
'높은 오픈율과 클릭률을 자랑하는 이메일 마케팅 카피 작성 프롬프트입니다.', 
7900, 
'당신은 전환율 30% 이상을 달성하는 이메일 마케터입니다. [제품/서비스]를 홍보하는 이메일을 작성해주세요.', 
'marketing', 
'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop',
true),

('웹 개발 코드 리뷰 프롬프트', 
'전문 시니어 개발자의 관점에서 코드를 리뷰하고 개선 방안을 제시하는 프롬프트입니다.', 
8900, 
'당신은 10년 경력의 시니어 풀스택 개발자입니다. 다음 코드를 리뷰해주세요. [코드 붙여넣기]', 
'development', 
'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
true),

('온라인 강의 커리큘럼 기획 프롬프트', 
'완성도 높은 온라인 강의 커리큘럼을 기획하는 프롬프트입니다.', 
14900, 
'당신은 교육 설계 전문가입니다. [주제]에 대한 12주 온라인 강의 커리큘럼을 설계해주세요.', 
'education', 
'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
true)

ON CONFLICT DO NOTHING;

-- 삽입 결과 확인
SELECT 
    COUNT(*) as total_prompts,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_prompts
FROM public.prompts;

-- 카테고리별 개수
SELECT 
    category,
    COUNT(*) as count
FROM public.prompts
WHERE is_active = true
GROUP BY category
ORDER BY count DESC;

-- 최근 추가된 프롬프트 확인 (상위 5개)
SELECT 
    id,
    title,
    category,
    price,
    is_active,
    created_at
FROM public.prompts
ORDER BY created_at DESC
LIMIT 5;

