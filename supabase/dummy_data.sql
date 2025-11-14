-- ============================================
-- Prompt Market 더미 데이터
-- ============================================

-- 기존 데이터 삭제 (옵션)
-- DELETE FROM public.prompts;

-- 프롬프트 더미 데이터 삽입
INSERT INTO public.prompts (title, description, price, prompt_text, category, thumbnail_url, image_urls) VALUES

-- ============================================
-- 🎨 AI 이미지 생성 (Midjourney, Stable Diffusion)
-- ============================================

('프로페셔널 로고 디자인 프롬프트', 
'Midjourney를 활용한 현대적이고 미니멀한 로고 디자인 프롬프트입니다. 다양한 산업에 적용 가능하며, 벡터 스타일의 깔끔한 결과물을 얻을 수 있습니다. 스타트업부터 대기업까지 활용 가능한 범용 로고 제작에 최적화되어 있습니다.', 
8900, 
'professional minimalist logo design for [BRAND NAME], modern vector style, clean lines, geometric shapes, bold colors, corporate identity, white background, high contrast, sharp details, [INDUSTRY: tech/food/fashion/etc], memorable symbol, scalable design --ar 1:1 --v 6 --style raw --s 50', 
'design', 
'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop']),

('인물 초상화 생성 프롬프트', 
'사실적이고 디테일한 인물 초상화를 만드는 프롬프트입니다. 영화 포스터, 프로필 사진, 캐릭터 디자인에 최적화되어 있습니다. 조명, 감정, 분위기를 자유롭게 조절할 수 있어 다양한 용도로 활용 가능합니다.', 
12900, 
'cinematic portrait photography of [SUBJECT: person description], [EMOTION: serious/happy/melancholic], dramatic lighting, shallow depth of field, professional photography, 85mm lens, bokeh background, [COLOR TONE: warm/cool/neutral], high detail, photorealistic, natural skin texture, editorial style, professional studio lighting --ar 2:3 --v 6 --style raw', 
'design', 
'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop']),

('판타지 배경 일러스트 프롬프트', 
'게임, 소설, 웹툰에 사용할 수 있는 환상적인 배경 일러스트 제작 프롬프트입니다. 다양한 환경과 분위기 연출이 가능하며, 컨셉 아트 수준의 퀄리티를 보장합니다. 상업적 프로젝트에 즉시 활용 가능합니다.', 
15900, 
'epic fantasy landscape, [ENVIRONMENT: mystical forest/floating islands/ancient castle/volcanic wasteland], magical atmosphere, volumetric lighting, god rays, [TIME: dawn/dusk/night], vibrant colors, digital art, concept art style, highly detailed environment, cinematic composition, matte painting style, 4k quality --ar 16:9 --v 6', 
'design', 
'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=600&fit=crop']),

('3D 제품 렌더링 프롬프트',
'전자제품, 가구, 패키지 등 모든 제품의 포토리얼리스틱 3D 렌더링을 생성하는 프롬프트입니다. 전자상거래, 제품 카탈로그, 마케팅 자료에 완벽한 고품질 이미지를 제작할 수 있습니다.',
18900,
'professional 3D product render of [PRODUCT], photorealistic, studio lighting setup, soft shadows, reflection on surface, clean white/gradient background, octane render, 8k resolution, commercial photography style, detailed texture, perfect lighting, product showcase --ar 4:5 --v 6 --style raw',
'design',
'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop']),

('일러스트 캐릭터 디자인 프롬프트',
'개성 넘치는 캐릭터를 디자인하는 프롬프트입니다. 만화, 게임, 브랜드 마스코트 제작에 활용할 수 있으며, 다양한 스타일(귀여운, 사실적, 추상적)을 지원합니다.',
13900,
'character design illustration, [CHARACTER TYPE: cute/cool/mysterious], full body, [STYLE: anime/cartoon/realistic], white background, character sheet, multiple poses, turnaround view, vibrant colors, professional illustration, detailed costume design, expressive face, [AGE/GENDER] --ar 16:9 --v 6 --niji 5',
'design',
'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1618004912476-29818d81ae2e?w=800&h=600&fit=crop', 'https://images.unsplash.com/photo-1613364278144-dd28b2618637?w=800&h=600&fit=crop']),

('소셜미디어 썸네일 프롬프트',
'유튜브, 인스타그램, 블로그에 사용할 수 있는 눈에 띄는 썸네일 이미지를 생성합니다. 클릭률을 높이는 디자인 원칙이 적용되어 있으며, 텍스트 삽입 공간을 고려한 레이아웃입니다.',
6900,
'youtube thumbnail design, [TOPIC], eye-catching, bold composition, vibrant colors, high contrast, negative space for text overlay, professional graphic design, modern style, attention-grabbing, click-worthy design --ar 16:9 --v 6 --style raw',
'design',
'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&h=600&fit=crop']),

-- ============================================
-- ✍️ 콘텐츠 작성 (ChatGPT, Claude)
-- ============================================

('SEO 최적화 블로그 글 작성 프롬프트', 
'검색엔진 최적화가 반영된 전문적인 블로그 글 작성 프롬프트입니다. 키워드 배치와 구조화된 콘텐츠로 높은 검색 순위를 달성하세요. 실제 SEO 전문가의 노하우가 담겨있습니다.', 
9900, 
'당신은 10년 경력의 SEO 전문 콘텐츠 작가입니다. [주제]에 대한 블로그 글을 작성해주세요.

요구사항:
- 목표 키워드: [키워드]
- 글 길이: 2000-2500단어
- 구조: 서론(문제 제기) → 본론(해결책 3-5가지) → 결론(요약 및 CTA)
- H2, H3 소제목 활용으로 가독성 향상
- 각 문단은 3-4줄로 구성
- 실용적인 예시와 통계 데이터 포함
- 자연스러운 키워드 배치 (키워드 밀도 1-2%)
- 메타 디스크립션 제안 포함
- 내부 링크 제안 3개
- FAQ 섹션 포함 (3-5개 질문)', 
'writing', 
'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop']),

('유튜브 대본 작성 프롬프트', 
'시청자의 관심을 끄는 매력적인 유튜브 영상 대본을 작성하는 프롬프트입니다. 후킹부터 CTA까지 완벽한 구조를 제공합니다. 100만 구독자 채널의 대본 작가 노하우가 담겨있습니다.', 
11900, 
'당신은 100만 구독자를 가진 유튜버의 대본 작가입니다. [주제]에 대한 10분 분량의 유튜브 영상 대본을 작성해주세요.

구조:
1. 후킹 (0-15초): 시청자의 관심을 즉각 끄는 질문이나 놀라운 사실
2. 인트로 (15-30초): 영상 주제 소개 및 시청 이유
3. 본론 (8분): 핵심 내용을 3-4가지 파트로 나누어 설명
   - 각 파트마다 소제목 제시
   - 구체적인 예시나 실험 포함
   - 시각 자료 설명 [B-roll], [자막 강조] 표시
4. 아웃트로 (1분): 요약, 좋아요/구독 요청, 다음 영상 티저

스타일:
- 대화체로 친근하게 작성
- 적절한 유머 포함 (과하지 않게)
- 시청자 참여 유도 질문 2-3개
- 댓글 유도 질문
- 타임스탬프 포함', 
'writing', 
'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop']),

('뉴스레터 콘텐츠 기획 프롬프트',
'구독자가 기다리는 뉴스레터를 만드는 프롬프트입니다. 높은 오픈율과 클릭률을 보장하는 구조와 카피라이팅 기법이 포함되어 있습니다.',
8900,
'당신은 월 1만 구독자를 보유한 인기 뉴스레터 운영자입니다. [주제/산업]에 대한 주간 뉴스레터를 작성해주세요.

구성:
1. 제목 라인 (3가지 A/B 테스트 버전)
   - 호기심 유발형
   - 가치 제안형
   - 질문형

2. 인사말
   - 개인화된 멘트
   - 이번 주 하이라이트 소개

3. 메인 콘텐츠 (3-4개 섹션)
   - 트렌드 분석
   - 실용 팁
   - 업계 뉴스
   - 추천 리소스

4. CTA (Call-to-Action)
   - 소셜 미디어 팔로우
   - 제품/서비스 소개
   - 피드백 요청

5. PS
   - 다음 주 예고
   - 추가 혜택 정보',
'writing',
'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&h=600&fit=crop']),

('책 리뷰 및 요약 작성 프롬프트',
'독자의 관심을 끄는 매력적인 책 리뷰와 핵심 내용 요약을 작성합니다. 블로그, 유튜브, 소셜미디어에 활용할 수 있는 다양한 형식을 제공합니다.',
5900,
'당신은 베스트셀러 작가이자 도서 평론가입니다. [책 제목]에 대한 리뷰와 요약을 작성해주세요.

형식:
1. 한 줄 평 (SNS용)

2. 책 정보
   - 저자, 출판사, 출간일
   - 장르 및 대상 독자

3. 핵심 메시지 (3가지)

4. 인상 깊은 구절 (3개)
   - 각 구절에 대한 해석

5. 장점 및 단점
   - 이 책의 강점 3가지
   - 아쉬운 점 1-2가지

6. 추천 대상
   - 어떤 사람에게 적합한지

7. 별점 평가 (5점 만점)
   - 항목별 평가 (내용, 문체, 구성, 가독성)',
'writing',
'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&h=600&fit=crop']),

-- ============================================
-- 📱 마케팅 & 비즈니스
-- ============================================

('이메일 마케팅 카피 프롬프트', 
'높은 오픈율과 클릭률을 자랑하는 이메일 마케팅 카피 작성 프롬프트입니다. A/B 테스트 버전도 함께 제공됩니다. 실제 전환율 30% 이상을 달성한 검증된 템플릿입니다.', 
7900, 
'당신은 전환율 30% 이상을 달성하는 이메일 마케터입니다. [제품/서비스]를 홍보하는 이메일을 작성해주세요.

제목 라인: 3가지 버전 제시
1. 호기심 유발형
2. 긴급성 강조형
3. 혜택 강조형

본문 구조:
- 인사 및 개인화된 멘트
- 고객의 페인 포인트 언급
- 솔루션 제시 (제품/서비스 소개)
- 혜택과 특징 3가지 (불릿 포인트)
- 사회적 증거 (고객 후기 또는 통계)
- 명확한 CTA 버튼 문구
- 긴급성 요소 (제한된 기간/수량)
- PS: 추가 인센티브나 리마인더

추가: A/B 테스트용 버전 1개 더 제공
- 다른 각도의 접근
- 대안 제목 라인', 
'marketing', 
'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&h=600&fit=crop']),

('상품 상세페이지 설명 작성 프롬프트', 
'온라인 쇼핑몰의 전환율을 높이는 매력적인 상품 설명을 작성하는 프롬프트입니다. 구매 욕구를 자극하는 카피라이팅 기법이 적용되어 있습니다. 이커머스 전문가의 노하우가 담겨있습니다.', 
6900, 
'당신은 전환율 최적화 전문가입니다. [상품명]의 상세페이지 설명을 작성해주세요.

구성:
1. 캐치프레이즈 (1줄): 핵심 가치 제안

2. 문제 인식 (2-3줄): 고객이 겪는 불편함

3. 솔루션 제시 (3-4줄): 이 상품이 해결하는 방법

4. 주요 특징 (5가지)
   - 각각 제목과 설명 2줄
   - 혜택 중심으로 작성

5. 스펙/사양
   - 깔끔한 표 형식
   - 중요한 스펙 강조

6. 사용 시나리오 (3가지)
   - 상황별 활용법
   - 구체적인 예시

7. 구매 이유 (3가지)
   - 경쟁 제품과의 차별점
   - 고객 후기 인용

8. FAQ (5개)

9. 마무리 CTA
   - 구매 결정을 돕는 한 줄 메시지

톤앤매너: 친근하고 신뢰감 있게, 과장 없이 사실 기반', 
'marketing', 
'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop']),

('소셜미디어 콘텐츠 캘린더 프롬프트', 
'한 달치 소셜미디어 콘텐츠를 한 번에 기획하는 프롬프트입니다. 인스타그램, 페이스북, 트위터, 링크드인에 최적화되어 있습니다. SNS 마케팅 전문가의 전략이 담겨있습니다.', 
13900, 
'당신은 소셜미디어 마케팅 전문가입니다. [브랜드/비즈니스]를 위한 한 달(30일) 콘텐츠 캘린더를 작성해주세요.

각 게시물 포함 사항:
- 날짜 및 최적 게시 시간
- 플랫폼 (Instagram/Facebook/Twitter/LinkedIn)
- 게시물 타입 (이미지/영상/카루셀/스토리/릴스)
- 캡션 (플랫폼별 최적 길이)
- 해시태그 10-15개 (인기도 믹스)
- 시각 자료 설명/컨셉
- 목표 (인지도/참여/전환)

주간 테마:
- 1주차: 브랜드 스토리텔링 & 가치 전달
- 2주차: 제품/서비스 소개 & 교육
- 3주차: 고객 참여 및 UGC (User Generated Content)
- 4주차: 프로모션 & 전환 유도

콘텐츠 믹스: 
- 교육 콘텐츠 30%
- 엔터테인먼트 40%
- 홍보/판매 30%

추가:
- 인플루언서 협업 제안 2건
- 이벤트/경품 아이디어 1건', 
'marketing', 
'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop']),

('브랜드 네이밍 및 슬로건 생성 프롬프트',
'기억에 남는 브랜드 이름과 강력한 슬로건을 만드는 프롬프트입니다. 언어학과 마케팅 심리학을 기반으로 한 검증된 방법론을 사용합니다.',
9900,
'당신은 세계적인 브랜딩 전문가입니다. [비즈니스 설명]을 위한 브랜드 네이밍과 슬로건을 제안해주세요.

1. 브랜드 이름 (10개)
   - 짧고 기억하기 쉬운 이름
   - 발음하기 쉬운 이름
   - 의미가 담긴 이름
   - 창조적/조어 이름
   - 각 이름의 의미와 어원 설명

2. 슬로건/태그라인 (5개)
   - 10단어 이내
   - 브랜드 가치 반영
   - 감성적 연결
   - 기억하기 쉬운 리듬

3. 도메인 가용성 체크
   - .com 가능 여부
   - 대체 도메인 제안

4. 소셜미디어 핸들
   - Instagram, Twitter 아이디 제안

5. 로고 컨셉
   - 시각적 방향성 제안
   - 색상 팔레트 추천',
'marketing',
'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop']),

('광고 카피라이팅 프롬프트',
'전환율을 극대화하는 광고 카피를 작성하는 프롬프트입니다. Google Ads, Facebook Ads, 네이버 광고에 최적화된 문구를 생성합니다.',
7900,
'당신은 AAAA 광고상을 수상한 카피라이터입니다. [제품/서비스]를 위한 광고 카피를 작성해주세요.

1. Google 검색 광고
   - 헤드라인 (3개, 각 30자 이내)
   - 설명 (2개, 각 90자 이내)
   - 표시 URL 경로

2. Facebook/Instagram 광고
   - 메인 텍스트 (125자)
   - 헤드라인 (40자)
   - 설명 (30자)
   - CTA 버튼 문구

3. 네이버 파워링크
   - 제목 (15자)
   - 설명 (45자)

4. 유튜브 동영상 광고
   - 5초 스킵 불가 버전
   - 15초 범퍼 광고 스크립트

5. 배너 광고 문구
   - 짧고 강렬한 헤드라인
   - 서브카피

각 카피에 대한 심리학적 근거 설명 포함',
'marketing',
'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=800&h=600&fit=crop']),

-- ============================================
-- 💻 개발 & 기술
-- ============================================

('웹 개발 코드 리뷰 프롬프트', 
'전문 시니어 개발자의 관점에서 코드를 리뷰하고 개선 방안을 제시하는 프롬프트입니다. 보안, 성능, 유지보수성을 모두 체크합니다. 실제 코드 리뷰 가이드라인을 따릅니다.', 
8900, 
'당신은 10년 경력의 시니어 풀스택 개발자입니다. 다음 코드를 리뷰해주세요.

[코드 붙여넣기]

리뷰 항목:

1. 코드 품질
   - 가독성 및 네이밍 컨벤션
   - 코드 구조 및 모듈화
   - DRY 원칙 준수 여부
   - SOLID 원칙 적용

2. 성능
   - 시간 복잡도 분석 (Big O)
   - 공간 복잡도
   - 메모리 사용 최적화
   - 병목 지점 파악
   - 캐싱 전략

3. 보안
   - 보안 취약점 검사 (OWASP Top 10)
   - 입력값 검증 및 새니타이제이션
   - 인증/인가 처리
   - SQL Injection, XSS 방어
   - 민감 정보 노출 체크

4. 모범 사례
   - 디자인 패턴 적용
   - 에러 핸들링 전략
   - 로깅 및 모니터링
   - 테스트 가능성
   - 문서화

5. 개선 제안
   - 구체적인 리팩토링 방안
   - 대안 코드 예시 제공
   - 우선순위별 개선 사항 (High/Medium/Low)

6. 칭찬할 점
   - 잘 작성된 부분 강조', 
'development', 
'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop']),

('API 문서 자동 생성 프롬프트', 
'개발자 친화적인 API 문서를 자동으로 생성하는 프롬프트입니다. Swagger/OpenAPI 형식으로 제공되며, 실제 사용 가능한 수준의 완성도를 보장합니다.', 
10900, 
'당신은 API 문서 작성 전문가입니다. [API 엔드포인트]에 대한 상세 문서를 작성해주세요.

문서 구조:

1. 개요
   - API 이름 및 설명 (한 문장)
   - 사용 사례 및 목적
   - 버전 정보
   - Base URL

2. 인증
   - 인증 방식 (Bearer Token/API Key/OAuth 2.0)
   - 필요한 권한 및 스코프
   - 헤더 예시
   - 에러 코드 (401, 403)

3. 엔드포인트 정보
   - HTTP 메서드 (GET/POST/PUT/DELETE)
   - URL 경로
   - 경로 파라미터 (Path Parameters)
   - 쿼리 파라미터 (Query Parameters)
     * 필수/선택 여부
     * 타입 및 형식
     * 기본값
     * 설명
   - 요청 바디 (Request Body)
     * JSON 스키마
     * 예시 데이터
     * 필드 설명

4. 응답
   - 성공 응답 (200, 201, 204)
     * 응답 스키마
     * JSON 예시
   - 에러 응답 (400, 401, 404, 500)
     * 에러 코드별 설명
     * 에러 응답 형식
     * 해결 방법

5. 코드 예시
   - cURL
   - JavaScript (fetch/axios)
   - Python (requests)
   - Java (OkHttp)
   - 각 언어별 에러 처리 포함

6. Rate Limiting
   - 요청 제한 정책
   - 제한 초과 시 응답

7. 주의사항 및 제한사항
   - 페이지네이션 (해당 시)
   - 데이터 크기 제한
   - 타임아웃 정책', 
'development', 
'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop']),

('버그 분석 및 해결 프롬프트',
'복잡한 버그를 체계적으로 분석하고 해결 방법을 제시하는 프롬프트입니다. 디버깅 과정을 단계별로 안내합니다.',
7900,
'당신은 디버깅 전문가입니다. 다음 버그를 분석하고 해결 방법을 제시해주세요.

[버그 설명 또는 에러 메시지]

분석 프로세스:

1. 버그 재현
   - 재현 단계 정리
   - 발생 조건 파악
   - 영향 범위 분석

2. 원인 분석
   - 가능한 원인 3가지
   - 각 원인의 개연성 평가
   - 로그 분석 방법 제시

3. 해결 방법
   - 근본 원인 해결 방안
   - 임시 해결 방안 (Workaround)
   - 각 방법의 장단점

4. 수정 코드 예시
   - Before/After 코드
   - 변경 사항 설명
   - 테스트 케이스

5. 예방 대책
   - 유사 버그 방지 방법
   - 테스트 강화 방안
   - 코드 리뷰 포인트

6. 문서화
   - 버그 리포트 작성
   - 지식 베이스 등록 내용',
'development',
'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop']),

('데이터베이스 쿼리 최적화 프롬프트',
'느린 SQL 쿼리를 분석하고 최적화하는 프롬프트입니다. 인덱스 전략, 쿼리 리팩토링, 실행 계획 분석을 포함합니다.',
11900,
'당신은 데이터베이스 성능 튜닝 전문가입니다. 다음 쿼리를 최적화해주세요.

[SQL 쿼리]

최적화 분석:

1. 현재 쿼리 분석
   - 실행 계획 (EXPLAIN) 분석
   - 병목 지점 파악
   - 예상 성능 문제

2. 인덱스 전략
   - 필요한 인덱스 제안
   - 인덱스 생성 쿼리
   - 복합 인덱스 vs 단일 인덱스
   - 커버링 인덱스 활용

3. 쿼리 리팩토링
   - 최적화된 쿼리 제시
   - 서브쿼리 → JOIN 변환
   - N+1 문제 해결
   - 불필요한 조인 제거

4. 테이블 구조 개선
   - 정규화/비정규화 제안
   - 파티셔닝 전략
   - 데이터 타입 최적화

5. 성능 비교
   - Before/After 예상 성능
   - 테스트 시나리오 제안

6. 모니터링 포인트
   - 주시해야 할 메트릭
   - 슬로우 쿼리 로그 설정',
'development',
'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=600&fit=crop']),

-- ============================================
-- 📚 교육 & 학습
-- ============================================

('온라인 강의 커리큘럼 기획 프롬프트', 
'완성도 높은 온라인 강의 커리큘럼을 기획하는 프롬프트입니다. 학습 목표부터 평가 방법까지 체계적으로 설계합니다. 교육학 이론이 반영된 검증된 구조입니다.', 
14900, 
'당신은 교육 설계 전문가이자 인기 강사입니다. [주제]에 대한 12주 온라인 강의 커리큘럼을 설계해주세요.

강의 개요:
- 대상: [초급/중급/고급]
- 수강 기간: 12주 (주 3시간)
- 학습 목표: 학습 후 달성할 수 있는 구체적 결과 3가지
- 선수 지식: 필요한 사전 지식 및 준비물

주차별 구성:
각 주차마다 다음 항목 포함:

1. 주제 및 학습 목표 (SMART 원칙)
2. 핵심 개념 (3-5가지)
3. 강의 내용 세부 구성
   - 이론 설명 (20분)
   - 실습 예제 (20분)
   - 실전 프로젝트 (10분)
4. 실습 과제
   - 과제 설명
   - 제출 가이드
   - 평가 기준
5. 퀴즈 문제 (5문제)
   - 객관식 3개
   - 서술형 2개
6. 추가 학습 자료
   - 추천 도서/영상
   - 참고 링크

특별 프로젝트:
- 중간 프로젝트 (6주차)
  * 프로젝트 주제 및 요구사항
  * 평가 기준 (루브릭)
  * 제출 형식
  
- 최종 프로젝트 (12주차)
  * 포트폴리오 수준의 프로젝트
  * 상세 요구사항
  * 발표 가이드
  * 평가 루브릭

학습 지원:
- 주간 Q&A 세션 토픽
- 스터디 그룹 활동 제안
- 멘토링 포인트', 
'education', 
'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop']),

('학습 요약 노트 생성 프롬프트', 
'복잡한 내용을 이해하기 쉽게 요약하고 핵심을 정리하는 프롬프트입니다. 시험 대비나 복습에 최적화되어 있습니다. 기억 과학에 기반한 학습 기법을 적용합니다.', 
5900, 
'당신은 학습 효율을 높이는 교육 전문가입니다. [학습 자료/텍스트]를 요약해주세요.

요약 형식:

1. 한 줄 요약 (TL;DR)
   - 핵심을 한 문장으로

2. 핵심 개념 (3-5가지)
   - 각 개념을 명확하고 간단하게 설명
   - 실생활 예시 포함
   - 중요도 표시 ⭐⭐⭐

3. 마인드맵 구조
   - 중심 주제
   - 주요 가지 (2-4개)
   - 세부 내용
   - 연결 관계 표시

4. 암기 팁
   - 니모닉(기억술) 제시
   - 연상 기법
   - 핵심 키워드 강조
   - 두문자어 활용

5. 확인 문제 (5개)
   - 객관식 3개
   - 서술형 2개
   - 정답 및 해설
   - 난이도 표시

6. 관련 개념 연결
   - 이전에 배운 내용과의 연관성
   - 다음 학습 주제 제안
   - 추가 학습 자료

7. 복습 스케줄
   - 간격 반복 학습 일정
   - 24시간 후
   - 1주일 후
   - 1개월 후', 
'education', 
'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&h=600&fit=crop']),

('영어 학습 대화 연습 프롬프트',
'실전 영어 회화 연습을 위한 프롬프트입니다. 다양한 상황별 대화를 연습하고 즉각적인 피드백을 받을 수 있습니다.',
8900,
'당신은 10년 경력의 영어 회화 강사입니다. [상황/주제]에 대한 영어 회화 연습을 도와주세요.

연습 구조:

1. 상황 설정
   - 구체적인 시나리오
   - 사용할 주요 표현
   - 문화적 배경 설명

2. 대화 시작
   - 자연스러운 대화 시작
   - 학습자 레벨에 맞는 난이도
   - 실수를 유도하는 질문

3. 실시간 피드백
   - 문법 오류 지적
   - 더 자연스러운 표현 제안
   - 발음 주의 사항

4. 유용한 표현 (10개)
   - 상황별 핵심 표현
   - 사용 예시 문장
   - 비슷한 의미의 다른 표현

5. 문화 팁
   - 원어민이 실제 사용하는 표현
   - 피해야 할 표현
   - 상황별 에티켓

6. 복습 문제
   - 학습한 표현을 활용한 문장 만들기
   - 역할극 시나리오',
'education',
'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop']),

-- ============================================
-- 💼 비즈니스 & 전략
-- ============================================

('사업 계획서 작성 프롬프트',
'투자 유치 및 사업 계획 수립을 위한 전문적인 사업 계획서를 작성하는 프롬프트입니다. VC와 엑셀러레이터에서 요구하는 형식을 충족합니다.',
16900,
'당신은 성공한 연쇄 창업가이자 비즈니스 컨설턴트입니다. [비즈니스 아이디어]에 대한 사업 계획서를 작성해주세요.

사업 계획서 구조:

1. Executive Summary (1페이지)
   - 비즈니스 개요
   - 핵심 가치 제안
   - 시장 기회
   - 경쟁 우위
   - 재무 하이라이트
   - 자금 조달 요구사항

2. 회사 소개
   - 비전 및 미션
   - 핵심 가치
   - 회사 연혁
   - 조직 구조
   - 팀 소개

3. 제품/서비스
   - 상세 설명
   - 고객 문제 및 솔루션
   - 주요 기능 및 혜택
   - 차별화 요소
   - 로드맵

4. 시장 분석
   - 시장 규모 (TAM, SAM, SOM)
   - 시장 트렌드
   - 타겟 고객 페르소나
   - 고객 니즈

5. 경쟁 분석
   - 직접/간접 경쟁자
   - 경쟁 우위 (SWOT)
   - 진입 장벽

6. 마케팅 전략
   - Go-to-Market 전략
   - 고객 획득 채널
   - 가격 전략
   - 판매 전략

7. 운영 계획
   - 비즈니스 모델
   - 핵심 자원
   - 파트너십
   - 리스크 관리

8. 재무 계획 (3-5년)
   - 손익 계산서
   - 현금 흐름표
   - 손익분기점
   - 핵심 재무 지표
   - 자금 조달 계획

9. 마일스톤
   - 분기별 목표
   - KPI 설정',
'business',
'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop']),

('경쟁사 분석 리포트 프롬프트',
'체계적인 경쟁사 분석을 수행하고 전략적 인사이트를 도출하는 프롬프트입니다. 시장 포지셔닝과 전략 수립에 활용할 수 있습니다.',
12900,
'당신은 전략 컨설턴트입니다. [경쟁사 이름]에 대한 상세 분석 리포트를 작성해주세요.

분석 프레임워크:

1. 기업 개요
   - 회사 정보
   - 사업 영역
   - 주요 제품/서비스
   - 재무 현황

2. 비즈니스 모델 분석
   - 수익 구조
   - 고객 세그먼트
   - 가치 제안
   - 핵심 파트너십

3. 제품/서비스 분석
   - 주요 특징
   - 가격 정책
   - 기술 스택
   - 사용자 경험

4. 시장 포지셔닝
   - 타겟 시장
   - 브랜드 아이덴티티
   - 차별화 전략
   - 시장 점유율

5. 마케팅 전략
   - 채널 전략
   - 콘텐츠 마케팅
   - SNS 활동
   - 광고 캠페인

6. SWOT 분석
   - Strengths (강점)
   - Weaknesses (약점)
   - Opportunities (기회)
   - Threats (위협)

7. 고객 리뷰 분석
   - 주요 칭찬 포인트
   - 불만 사항
   - 개선 기회

8. 전략적 시사점
   - 벤치마킹 포인트
   - 차별화 기회
   - 실행 가능한 액션 아이템',
'business',
'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop']),

('면접 질문 및 모범 답변 프롬프트',
'각 직무별 면접 질문과 모범 답변을 준비하는 프롬프트입니다. STAR 기법을 활용한 구조화된 답변을 제공합니다.',
6900,
'당신은 HR 전문가이자 커리어 코치입니다. [직무/직급]을 위한 면접 준비를 도와주세요.

면접 준비 가이드:

1. 예상 질문 (20개)
   - 인성 질문 (5개)
   - 경험 질문 (10개)
   - 상황 질문 (5개)

2. 각 질문별 모범 답변
   - STAR 기법 적용
     * Situation (상황)
     * Task (과제)
     * Action (행동)
     * Result (결과)
   - 2-3분 답변 분량
   - 강조할 키워드

3. 역량별 준비
   - 리더십
   - 커뮤니케이션
   - 문제 해결
   - 협업
   - 전문성

4. 회사 맞춤 답변
   - 회사 가치관 반영
   - 직무 연관성 강조
   - 구체적인 사례

5. 예상 질문 대응
   - 어려운 질문 처리법
   - 약점을 강점으로
   - 경력 공백 설명

6. 역질문 리스트 (10개)
   - 업무 관련
   - 회사 문화
   - 성장 기회
   - 팀 구성

7. 면접 후 팔로우업
   - 감사 이메일 템플릿
   - 추가 자료 제출',
'business',
'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
ARRAY['https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop']);

-- 활성 상태로 설정
UPDATE public.prompts SET is_active = true WHERE is_active IS NULL;

-- 확인용 쿼리
SELECT 
    category,
    COUNT(*) as count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM public.prompts
GROUP BY category
ORDER BY category;
