# 프롬프트 Supabase 연동 가이드

프롬프트 마켓의 프롬프트 기능이 Supabase와 완전히 연동되었습니다.

## 🎯 완료된 작업

### 1. ✅ Supabase 테이블 생성 및 RLS 설정
- **파일**: `supabase/prompts_setup.sql`
- **내용**:
  - `prompts` 테이블 생성
  - RLS (Row Level Security) 활성화
  - 읽기 정책: 모든 사용자가 활성화된 프롬프트 조회 가능
  - 쓰기 정책: admin 권한만 생성/수정/삭제 가능
  - 성능 최적화를 위한 인덱스 생성

### 2. ✅ 초기 데이터 삽입
- **파일**: `supabase/prompts_seed.sql`
- **내용**:
  - 25개의 고품질 프롬프트 데이터
  - 다양한 카테고리 (design, writing, marketing, development 등)
  - 실제 사용 가능한 프롬프트 템플릿

### 3. ✅ 프론트엔드 페이지 연동
- **메인 페이지** (`app/page.tsx`): Supabase에서 프롬프트 목록 조회
- **프롬프트 상세** (`app/prompt/[id]/page.tsx`): Supabase에서 단일 프롬프트 조회
- **구매 내역** (`app/my-page/page.tsx`): Supabase purchases 테이블과 연동

### 4. ✅ Admin CRUD API
- **GET** `/api/admin/prompts` - 모든 프롬프트 조회
- **POST** `/api/admin/prompts` - 새 프롬프트 생성
- **GET** `/api/admin/prompts/[id]` - 특정 프롬프트 조회
- **PUT** `/api/admin/prompts/[id]` - 프롬프트 수정
- **DELETE** `/api/admin/prompts/[id]` - 프롬프트 삭제 (soft delete)

### 5. ✅ Admin 관리 페이지
- **경로**: `/admin/prompts`
- **기능**:
  - 프롬프트 목록 조회 (활성/비활성 상태 표시)
  - 새 프롬프트 추가 (모달 UI)
  - 프롬프트 수정 (모달 UI)
  - 프롬프트 삭제 (soft delete)

### 6. ✅ 더미 데이터 제거
- `lib/dummyData.ts`에서 프롬프트 관련 더미 데이터 제거
- 프롬프트는 이제 100% Supabase에서 관리

## 🚀 설정 방법

### 1단계: Supabase 테이블 생성

Supabase 대시보드 → SQL Editor에서 다음 파일들을 순서대로 실행:

```bash
# 1. 테이블 생성 및 RLS 설정
supabase/prompts_setup.sql

# 2. 초기 데이터 삽입
supabase/prompts_seed.sql
```

### 2단계: Admin 권한 설정

Clerk Dashboard에서 admin 사용자 설정:

1. Clerk Dashboard → Users → 특정 사용자 선택
2. Metadata 탭 → Public metadata 편집
3. 다음 JSON 추가:

```json
{
  "role": "admin"
}
```

### 3단계: 환경 변수 확인

`.env.local` 파일에 다음 변수가 설정되어 있는지 확인:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
```

### 4단계: 서버 실행

```bash
pnpm install
pnpm dev
```

## 📊 데이터 흐름

### 사용자 관점
1. 메인 페이지 (`/`) → Supabase에서 활성화된 프롬프트 목록 조회
2. 프롬프트 클릭 → 상세 페이지 (`/prompt/[id]`)
3. 구매 후 → 구매 내역 (`/my-page`)에서 확인

### Admin 관점
1. Admin 페이지 접속 (`/admin/prompts`)
2. 프롬프트 CRUD 작업
3. 변경사항이 즉시 Supabase에 반영
4. 사용자에게 실시간으로 표시

## 🔐 보안

### RLS 정책

**읽기 (SELECT)**
```sql
-- 모든 사용자가 활성화된 프롬프트 조회 가능
USING (is_active = true)
```

**쓰기 (INSERT, UPDATE, DELETE)**
```sql
-- admin 권한을 가진 사용자만 가능
WITH CHECK (
    auth.jwt() ->> 'role' = 'admin'
    OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
)
```

### Soft Delete
- 프롬프트 삭제 시 `is_active = false`로 설정
- 데이터는 보존되며, 구매 내역도 유지됨
- 필요시 재활성화 가능

## 🎨 UI 컴포넌트

Admin 페이지는 바우하우스 디자인 시스템을 사용:

- `Card` - 프롬프트 카드
- `Button` - 액션 버튼
- `Modal` - 생성/수정 모달
- `Input` - 폼 입력
- `Badge` - 상태 표시
- `Alert` - 알림 메시지

## 📱 API 사용 예시

### 프롬프트 목록 조회
```typescript
const response = await fetch('/api/admin/prompts');
const { prompts } = await response.json();
```

### 프롬프트 생성
```typescript
const response = await fetch('/api/admin/prompts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '새 프롬프트',
    description: '설명',
    price: 5000,
    prompt_text: '프롬프트 내용',
    category: 'design',
    thumbnail_url: 'https://...',
    image_urls: ['https://...'],
  }),
});
```

### 프롬프트 수정
```typescript
const response = await fetch(`/api/admin/prompts/${id}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: '수정된 제목',
    price: 6000,
  }),
});
```

### 프롬프트 삭제
```typescript
const response = await fetch(`/api/admin/prompts/${id}`, {
  method: 'DELETE',
});
```

## 🐛 문제 해결

### 프롬프트가 표시되지 않는 경우
1. Supabase에서 `prompts_setup.sql` 실행 확인
2. `prompts_seed.sql`로 초기 데이터 삽입 확인
3. RLS 정책이 올바르게 설정되었는지 확인

### Admin 페이지 접근 불가
1. Clerk에서 사용자의 Public metadata에 `role: admin` 설정 확인
2. 환경 변수 확인
3. 로그아웃 후 재로그인

### API 오류
1. Supabase 연결 확인
2. 환경 변수 확인
3. 브라우저 콘솔에서 에러 메시지 확인

## 📚 관련 파일

### Supabase
- `supabase/prompts_setup.sql` - 테이블 생성 및 RLS
- `supabase/prompts_seed.sql` - 초기 데이터
- `supabase/README.md` - Supabase 설정 가이드

### API
- `app/api/admin/prompts/route.ts` - 목록 조회, 생성
- `app/api/admin/prompts/[id]/route.ts` - 조회, 수정, 삭제

### 페이지
- `app/page.tsx` - 메인 페이지
- `app/prompt/[id]/page.tsx` - 프롬프트 상세
- `app/my-page/page.tsx` - 구매 내역
- `app/admin/prompts/page.tsx` - Admin 관리

### 컴포넌트
- `app/components/PromptCard.tsx` - 프롬프트 카드
- `app/components/PromptDetail.tsx` - 프롬프트 상세

## ✨ 다음 단계

프롬프트 기능은 완전히 Supabase와 연동되었습니다. 다른 기능들은 여전히 더미 데이터를 사용하고 있습니다:

- ❌ 장바구니 (carts) - 더미 데이터 사용 중
- ❌ 결제 (payments) - 더미 데이터 사용 중
- ❌ 사용자 프로필 (profiles) - 더미 데이터 사용 중

필요시 이 기능들도 동일한 방식으로 Supabase와 연동할 수 있습니다.

## 🎉 완료!

프롬프트 기능이 Supabase와 완전히 연동되었습니다. 이제 Admin 페이지에서 프롬프트를 관리하고, 사용자는 실시간으로 업데이트된 프롬프트를 확인할 수 있습니다!

