# 🚀 Clerk 인증 빠른 시작 가이드

## ✅ 이미 완료된 작업

1. ✅ `@clerk/nextjs` 패키지 설치 완료
2. ✅ `svix` 패키지 설치 완료 (Webhook용)
3. ✅ Middleware에 `clerkMiddleware()` 통합
4. ✅ Layout에 `<ClerkProvider>` 추가
5. ✅ Header 컴포넌트에 Clerk UI 통합
6. ✅ 보호된 API 라우트 예제 생성 (`/api/protected`)
7. ✅ 보호된 페이지 예제 생성 (`/protected-page`)
8. ✅ Webhook API 라우트 생성 (`/api/webhooks/clerk`)
9. ✅ Supabase 마이그레이션 파일 생성

---

## 📝 남은 작업 (3단계)

### 1단계: 환경 변수 설정 (필수)

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Clerk API Keys (필수)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

# Clerk Webhook Secret (Webhook 사용 시 필수)
CLERK_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Supabase Service Role Key (Webhook 사용 시 필수)
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY

# 기존 Supabase 환경 변수
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Clerk API 키 가져오기:
1. [Clerk Dashboard](https://dashboard.clerk.com/) 접속
2. 프로젝트 선택 또는 새로 만들기
3. **API Keys** 메뉴에서 키 복사
4. `.env.local`에 붙여넣기

#### Webhook Secret 가져오기 (선택사항):
1. Clerk Dashboard → **Webhooks** → **Add Endpoint**
2. Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
   - 개발 환경: [ngrok](https://ngrok.com/) 사용 권장
3. 이벤트 선택: `user.created`, `user.updated`, `user.deleted`
4. **Signing Secret** 복사하여 `.env.local`에 추가

#### Supabase Service Role Key 가져오기:
1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 선택
2. **Settings** → **API**
3. **service_role** 키 복사 (⚠️ 절대 클라이언트에 노출하지 마세요)

---

### 2단계: 데이터베이스 마이그레이션 (Supabase 사용 시 필수)

Supabase SQL Editor에서 다음 마이그레이션을 실행하세요:

```sql
-- profiles 테이블에 clerk_id 컬럼 추가
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- clerk_id에 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id 
ON profiles(clerk_id);
```

또는 프로젝트의 마이그레이션 파일을 사용하세요:
```bash
# supabase/add_clerk_id_migration.sql 파일 실행
```

---

### 3단계: 개발 서버 실행 및 테스트

```bash
# 개발 서버 실행
pnpm dev
```

#### 테스트 체크리스트:

1. **기본 인증 테스트**
   - [ ] 브라우저에서 `http://localhost:3000` 접속
   - [ ] 헤더의 "로그인" 버튼 클릭
   - [ ] 이메일로 회원가입/로그인 테스트
   - [ ] UserButton 클릭하여 프로필 확인

2. **보호된 페이지 테스트**
   - [ ] `/protected-page` 방문
   - [ ] 로그인하지 않았다면 홈으로 리다이렉트 확인
   - [ ] 로그인 후 사용자 정보 표시 확인

3. **API 보호 테스트**
   ```bash
   # 로그인하지 않은 상태에서 (401 에러 예상)
   curl http://localhost:3000/api/protected
   
   # 로그인 후 브라우저에서 접속하면 성공
   ```

4. **Webhook 테스트** (설정한 경우)
   - [ ] Clerk Dashboard에서 새 사용자 생성
   - [ ] Supabase `profiles` 테이블에 자동 생성 확인
   - [ ] 개발 환경에서는 ngrok 등으로 로컬 Webhook 테스트

---

## 🎯 사용 예제

### 클라이언트 컴포넌트에서 사용

```typescript
'use client';

import { useUser } from '@clerk/nextjs';
import { Button, Card, Heading, Text } from '@/app/components/ui';

export function MyComponent() {
  const { user, isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Text>로딩 중...</Text>;
  }

  if (!isSignedIn) {
    return <Text>로그인이 필요합니다.</Text>;
  }

  return (
    <Card padding="md">
      <Heading level="h3">안녕하세요, {user.firstName}님!</Heading>
      <Text color="secondary">{user.emailAddresses[0]?.emailAddress}</Text>
    </Card>
  );
}
```

### 서버 컴포넌트에서 사용

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Heading, Text } from '@/app/components/ui';

export default async function ServerPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  const user = await currentUser();

  return (
    <div>
      <Heading level="h2">서버 컴포넌트 페이지</Heading>
      <Text>User ID: {userId}</Text>
      <Text>이메일: {user?.emailAddresses[0]?.emailAddress}</Text>
    </div>
  );
}
```

### API 라우트 보호

```typescript
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: '인증 필요' }, { status: 401 });
  }

  // 보호된 데이터 반환
  return NextResponse.json({ data: '비밀 데이터', userId });
}
```

---

## 🔒 라우트 보호 패턴

### Middleware에서 특정 경로 보호

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/my-page(.*)',
  '/admin(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

### 특정 역할(Role)에 따른 보호

```typescript
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const { userId, sessionClaims } = await auth();

  // 관리자 역할 확인
  if (sessionClaims?.metadata?.role !== 'admin') {
    redirect('/');
  }

  return <div>관리자 페이지</div>;
}
```

---

## 🎨 Clerk UI 커스터마이징

### 로그인 버튼 스타일링

```typescript
import { SignInButton } from '@clerk/nextjs';
import { Button } from '@/app/components/ui';

<SignInButton mode="modal">
  <Button variant="primary" size="md">
    로그인
  </Button>
</SignInButton>
```

### UserButton 커스터마이징

```typescript
import { UserButton } from '@clerk/nextjs';

<UserButton
  afterSignOutUrl="/"
  appearance={{
    elements: {
      avatarBox: 'w-10 h-10 border-2 border-[var(--color-bauhaus-black)]',
      userButtonPopoverCard: 'shadow-[var(--shadow-medium)]',
    },
  }}
  userProfileMode="modal" // 또는 "navigation"
/>
```

---

## 📦 통합된 파일 목록

```
프로젝트/
├── middleware.ts                          # ✅ Clerk + Supabase 통합
├── app/
│   ├── layout.tsx                         # ✅ ClerkProvider 추가
│   ├── components/
│   │   └── Header.tsx                     # ✅ Clerk UI 통합
│   ├── protected-page/
│   │   └── page.tsx                       # ✅ 보호된 페이지 예제
│   └── api/
│       ├── protected/
│       │   └── route.ts                   # ✅ 보호된 API 예제
│       └── webhooks/
│           └── clerk/
│               └── route.ts               # ✅ Webhook 핸들러
├── supabase/
│   └── add_clerk_id_migration.sql         # ✅ 마이그레이션 파일
└── docs/
    ├── CLERK_SETUP.md                     # ✅ 상세 설정 가이드
    └── CLERK_QUICKSTART.md                # ✅ 이 파일
```

---

## 🐛 문제 해결

### "Invalid publishable key" 오류
- `.env.local` 파일이 **프로젝트 루트**에 있는지 확인
- 환경 변수 이름이 정확한지 확인 (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
- 개발 서버를 **재시작**하세요: `pnpm dev`

### 로그인 후 사용자 정보가 표시되지 않음
- 브라우저 캐시 및 쿠키 삭제
- Clerk Dashboard → Settings → Domains에서 `localhost` 허용 확인
- 개발 도구(F12)에서 네트워크 탭 확인

### Webhook이 작동하지 않음
- Webhook URL이 **공개 URL**인지 확인 (로컬: ngrok 사용)
- `CLERK_WEBHOOK_SECRET` 환경 변수 확인
- Clerk Dashboard에서 Webhook 이벤트 로그 확인
- API 라우트 로그 확인: `console.log` 출력

### Supabase 연동 오류
- `profiles` 테이블에 `clerk_id` 컬럼 존재 확인
- `SUPABASE_SERVICE_ROLE_KEY` 환경 변수 확인
- Supabase 테이블 권한 확인 (RLS 정책)

---

## 📚 추가 리소스

- **상세 설정 가이드**: `docs/CLERK_SETUP.md`
- **Clerk 공식 문서**: https://clerk.com/docs
- **Clerk + Next.js 가이드**: https://clerk.com/docs/quickstarts/nextjs
- **Clerk + Supabase 통합**: https://clerk.com/docs/integrations/databases/supabase

---

## 🔗 Supabase 통합 (추가 설정 필요)

Clerk와 Supabase를 함께 사용하려면 **Native Third-Party Auth Provider** 방식으로 통합해야 합니다.

### 간단한 3단계 설정:

1. **Clerk Dashboard**: Supabase 통합 활성화
   - https://dashboard.clerk.com/setup/supabase

2. **Supabase Dashboard**: Clerk를 Third-party provider로 추가
   - Authentication > Sign In / Up > Add provider > Clerk

3. **데이터베이스**: RLS 정책 적용
   - `supabase/add_clerk_id_migration.sql` 실행

**상세 가이드**: `docs/CLERK_SUPABASE_INTEGRATION.md` 참고 ⭐

---

## ✅ 체크리스트

통합 완료 전 확인하세요:

- [ ] `.env.local` 파일 생성 및 API 키 설정
- [ ] Supabase 통합 활성화 (Clerk + Supabase Dashboard)
- [ ] Supabase 마이그레이션 실행 (RLS 정책)
- [ ] 개발 서버 재시작
- [ ] 로그인/로그아웃 동작 확인
- [ ] 보호된 페이지 접근 테스트
- [ ] RLS 정책 테스트 (다중 사용자)
- [ ] (선택) Webhook 설정 및 테스트

---

**마지막 업데이트**: 2025-11-14  
**Clerk 버전**: 6.35.1  
**Next.js 버전**: 16.0.3

