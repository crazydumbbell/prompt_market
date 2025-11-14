# Prompt Market 설치 가이드

## 📋 목차
1. [프로젝트 소개](#프로젝트-소개)
2. [기술 스택](#기술-스택)
3. [사전 요구사항](#사전-요구사항)
4. [설치 방법](#설치-방법)
5. [환경 변수 설정](#환경-변수-설정)
6. [데이터베이스 설정](#데이터베이스-설정)
7. [실행 방법](#실행-방법)
8. [주요 기능](#주요-기능)

---

## 프로젝트 소개

**Prompt Market**은 AI 프롬프트를 사고팔 수 있는 온라인 마켓플레이스입니다.

- 관리자가 등록한 프롬프트를 사용자가 구매
- 장바구니 기능 지원
- 토스페이먼츠 결제 연동
- 프로필 관리 및 구매 내역 확인
- 바우하우스 디자인 시스템 적용

---

## 기술 스택

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payment**: 토스페이먼츠
- **Package Manager**: pnpm

---

## 사전 요구사항

다음 항목들이 설치되어 있어야 합니다:

- Node.js 20 이상
- pnpm (권장) 또는 npm
- Supabase 계정
- 토스페이먼츠 계정 (테스트/실제 운영)

---

## 설치 방법

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 프로젝트 디렉토리로 이동
cd prompt_market

# 의존성 설치
pnpm install
```

---

## 환경 변수 설정

### 1. `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 토스페이먼츠 설정
NEXT_PUBLIC_TOSS_CLIENT_KEY=your-toss-client-key
TOSS_SECRET_KEY=your-toss-secret-key
```

### 2. Supabase 설정 값 찾기

1. [Supabase 대시보드](https://supabase.com/dashboard)에 로그인
2. 프로젝트 선택
3. **Settings** → **API** 메뉴로 이동
4. 다음 값을 복사:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` 키 → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. 토스페이먼츠 설정 값 찾기

1. [토스페이먼츠 개발자센터](https://developers.tosspayments.com/)에 로그인
2. **내 개발 정보** 메뉴로 이동
3. 다음 값을 복사:
   - `클라이언트 키` → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - `시크릿 키` → `TOSS_SECRET_KEY`

> ⚠️ **주의**: 테스트 환경에서는 테스트 키를, 실제 운영 환경에서는 라이브 키를 사용하세요.

---

## 데이터베이스 설정

### 1. Supabase SQL Editor에서 스키마 실행

1. Supabase 대시보드에서 **SQL Editor** 메뉴로 이동
2. `supabase/schema.sql` 파일의 내용을 복사
3. SQL Editor에 붙여넣고 실행 (Run 버튼 클릭)

이 과정에서 다음이 생성됩니다:
- `profiles` 테이블 (사용자 프로필)
- `prompts` 테이블 (프롬프트 상품)
- `carts` 테이블 (장바구니)
- `purchases` 테이블 (구매 기록)
- Row Level Security (RLS) 정책
- 자동 프로필 생성 트리거

### 2. Storage 버킷 생성 (프로필 이미지용)

1. Supabase 대시보드에서 **Storage** 메뉴로 이동
2. **Create bucket** 클릭
3. 버킷 이름: `avatars`
4. **Public bucket** 체크
5. 생성 완료

### 3. 더미 데이터 (자동 포함)

**별도 설정 필요 없음!** 🎉

프로젝트에는 **12개의 더미 프롬프트**가 이미 포함되어 있습니다:

- **위치**: `lib/dummyData.ts`
- **자동 표시**: 메인 페이지에서 자동으로 표시됩니다
- **용도**: 개발 및 데모 목적
- **특징**:
  - "DEMO" 배지로 실제 상품과 구분됨
  - 프롬프트 내용 확인 가능 (데모용)
  - 구매/장바구니 담기 불가능
  - Supabase에 저장되지 않음 (로컬 데이터)

#### 실제 프롬프트 추가 방법

사용자가 직접 생성한 프롬프트만 Supabase에 저장됩니다:

1. Supabase 대시보드 → **Table Editor** → `prompts` 테이블 선택
2. **Insert row** 클릭
3. 필드 입력:
   - `title`: 프롬프트 제목
   - `description`: 상세 설명
   - `price`: 가격 (숫자, 예: 5000)
   - `prompt_text`: 실제 프롬프트 내용
   - `category`: 카테고리 (예: "design", "writing", "marketing")
   - `thumbnail_url`: 썸네일 이미지 URL (선택사항)
   - `is_active`: true
4. **Save** 클릭

또는 SQL로 추가:

```sql
INSERT INTO public.prompts (
  title, description, price, prompt_text, category, thumbnail_url, is_active
) VALUES (
  'AI 로고 디자인 프롬프트',
  '전문적인 로고를 생성하는 Midjourney 프롬프트입니다.',
  5000,
  'professional logo design, minimalist, modern, vector style, clean lines, --ar 1:1 --v 6',
  'design',
  'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800',
  true
);
```

---

## 실행 방법

### 개발 모드

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000` 접속

### 프로덕션 빌드

```bash
# 빌드
pnpm build

# 실행
pnpm start
```

---

## 주요 기능

### 1. 사용자 기능

- ✅ 회원가입 / 로그인 / 로그아웃
- ✅ 프로필 관리 (닉네임, 프로필 이미지)
- ✅ 프롬프트 목록 조회
- ✅ 프롬프트 상세 보기
- ✅ 장바구니에 담기
- ✅ 결제하기 (토스페이먼츠)
- ✅ 구매 내역 조회
- ✅ 구매한 프롬프트 내용 확인 및 복사

### 2. 페이지 구조

```
/                    # 메인 페이지 (프롬프트 목록)
/prompt/[id]         # 프롬프트 상세 페이지
/cart                # 장바구니
/checkout            # 결제 페이지
/checkout/success    # 결제 성공
/checkout/fail       # 결제 실패
/profile             # 프로필 관리
/my-page             # 구매 내역
/login               # 로그인/회원가입
```

### 3. 관리자 기능

관리자는 Supabase 대시보드를 통해 직접 관리합니다:

- 프롬프트 등록/수정/삭제 (`prompts` 테이블)
- 사용자 관리 (`profiles` 테이블)
- 구매 내역 확인 (`purchases` 테이블)

---

## 트러블슈팅

### 1. Supabase 연결 오류

- `.env.local` 파일의 URL과 키가 정확한지 확인
- Supabase 프로젝트가 활성화되어 있는지 확인

### 2. 결제 테스트

토스페이먼츠 테스트 카드 정보:
- 카드번호: 아무 숫자나 16자리
- 유효기간: 미래 날짜
- CVC: 3자리 숫자

### 3. 이미지 업로드 오류

- Supabase Storage의 `avatars` 버킷이 Public으로 설정되어 있는지 확인
- RLS 정책이 올바르게 설정되어 있는지 확인

---

## 바우하우스 디자인 시스템

이 프로젝트는 바우하우스 디자인 철학을 따릅니다:

- 기하학적 형태
- 원색 사용 (빨강, 파랑, 노랑)
- 직각 디자인
- 오프셋 그림자
- 기능적인 UI

자세한 내용은 `.cursor/rules/components.mdc` 파일을 참조하세요.

---

## 라이센스

MIT License

---

## 문의

문제가 발생하거나 질문이 있으시면 이슈를 등록해주세요.

