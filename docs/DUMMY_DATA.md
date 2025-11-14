# 🎨 더미 데이터 가이드

## 📌 개요

이 프로젝트는 **로컬 더미 데이터 시스템**을 사용하여 Supabase 설정 없이도 즉시 개발을 시작할 수 있습니다.

## ✨ 더미 데이터 특징

### 자동 포함
- **위치**: `lib/dummyData.ts`
- **개수**: 12개의 고품질 프롬프트
- **카테고리**: design, writing, marketing, social-media
- **이미지**: Unsplash API를 통한 실제 이미지

### 구분 방법
더미 데이터는 다음과 같이 구분됩니다:

1. **ID 패턴**: `dummy-1`, `dummy-2`, ... (모두 `dummy-`로 시작)
2. **UI 표시**: 
   - 🏷️ "DEMO" 배지 (주황색)
   - 💡 "데모 프롬프트" 안내 메시지
3. **기능 제한**:
   - ✅ 상세 페이지 조회 가능
   - ✅ 프롬프트 내용 확인 가능
   - ❌ 장바구니 담기 불가
   - ❌ 구매 불가

## 🔄 데이터 흐름

```
메인 페이지 로드
    ↓
Supabase에서 프롬프트 조회 시도
    ↓
    ├─ 성공 → Supabase 데이터 + 더미 데이터 병합
    └─ 실패 → 더미 데이터만 표시 (12개)
    ↓
화면에 표시
```

## 📊 콘솔 출력 예시

### Supabase 미설정 시
```
⚠️ Supabase 프롬프트 조회 실패 (더미 데이터로 대체): {
  message: "테이블이 존재하지 않거나 접근 권한이 없습니다.",
  hint: "SETUP.md를 참고하여 Supabase 테이블을 생성해주세요."
}

📦 프롬프트 데이터 로드 완료:
  ✅ 전체: 12 개
  📊 Supabase: 0 개
  🎨 더미 데이터: 12 개
```

### Supabase 설정 완료 시
```
📦 프롬프트 데이터 로드 완료:
  ✅ 전체: 15 개
  📊 Supabase: 3 개
  🎨 더미 데이터: 12 개
```

## 🛠️ 더미 데이터 수정

### 1. 기존 데이터 수정

`lib/dummyData.ts` 파일을 열어 직접 수정:

```typescript
export const DUMMY_PROMPTS: Prompt[] = [
  {
    id: "dummy-1",
    title: "수정된 제목",
    description: "수정된 설명",
    price: 10000,
    // ... 나머지 필드
  },
  // ...
];
```

### 2. 새로운 더미 데이터 추가

배열에 새로운 객체 추가:

```typescript
export const DUMMY_PROMPTS: Prompt[] = [
  // ... 기존 데이터
  {
    id: "dummy-13", // 고유한 ID (dummy-로 시작)
    created_at: new Date().toISOString(),
    title: "새 프롬프트",
    description: "설명",
    price: 5000,
    prompt_text: "프롬프트 내용",
    category: "design",
    thumbnail_url: "https://images.unsplash.com/...",
    image_urls: ["https://images.unsplash.com/..."],
    is_active: true,
  },
];
```

### 3. 더미 데이터 비활성화

모든 더미 데이터를 숨기려면:

```typescript
// lib/dummyData.ts
export const DUMMY_PROMPTS: Prompt[] = []; // 빈 배열로 변경
```

## 🎯 실제 데이터 추가

### Supabase Table Editor 사용

1. [Supabase 대시보드](https://supabase.com/dashboard) 접속
2. **Table Editor** → `prompts` 테이블 선택
3. **Insert row** 클릭
4. 데이터 입력 후 **Save**

### SQL 사용

```sql
INSERT INTO public.prompts (
  title, 
  description, 
  price, 
  prompt_text, 
  category, 
  thumbnail_url, 
  is_active
) VALUES (
  '실제 프롬프트 제목',
  '상세 설명',
  8000,
  '프롬프트 내용...',
  'writing',
  'https://example.com/image.jpg',
  true
);
```

## ❓ FAQ

### Q1: 더미 데이터를 삭제해도 되나요?
**A**: 네, 언제든지 삭제 가능합니다. `lib/dummyData.ts`에서 `DUMMY_PROMPTS` 배열을 비우면 됩니다.

### Q2: 더미 데이터 ID를 변경해도 되나요?
**A**: 가능하지만 `dummy-` 접두사는 유지해야 합니다. 이 패턴으로 더미 데이터를 식별합니다.

### Q3: 더미 데이터와 실제 데이터를 구분하는 방법은?
**A**: 
- **코드**: `prompt.id.startsWith('dummy-')` 체크
- **UI**: "DEMO" 배지 표시
- **콘솔**: 데이터 출처별 개수 출력

### Q4: 더미 데이터도 구매 가능하게 만들 수 있나요?
**A**: 권장하지 않습니다. 더미 데이터는 데모/개발 목적이므로 실제 거래는 Supabase 데이터만 사용해야 합니다.

### Q5: Supabase 오류가 발생해도 페이지가 정상 작동하나요?
**A**: 네! 더미 데이터 시스템 덕분에 Supabase 연결이 실패해도 12개의 프롬프트가 표시됩니다.

## 🎨 더미 데이터 목록

현재 포함된 더미 프롬프트:

1. **전문 로고 디자인 프롬프트** (design, 5,000원)
2. **SEO 블로그 글 작성 마스터** (writing, 3,000원)
3. **쇼핑몰 상품 설명 생성기** (marketing, 4,000원)
4. **인스타그램 릴스 대본 작성** (social-media, 3,500원)
5. **판타지 캐릭터 일러스트** (design, 6,000원)
6. **이메일 마케팅 템플릿** (marketing, 4,500원)
7. **유튜브 썸네일 디자인** (design, 3,000원)
8. **기술 블로그 튜토리얼 작성** (writing, 5,500원)
9. **제품 런칭 페이지 카피** (marketing, 7,000원)
10. **건축 인테리어 시각화** (design, 8,000원)
11. **링크드인 프로필 최적화** (writing, 4,000원)
12. **AI 아트 배경화면 생성** (design, 2,500원)

## 📚 관련 문서

- [SETUP.md](../SETUP.md) - 전체 설정 가이드
- [PRD.md](./PRD.md) - 프로젝트 요구사항
- [lib/dummyData.ts](../lib/dummyData.ts) - 더미 데이터 소스 코드

---

**마지막 업데이트**: 2025-11-14

