# Clerk 인증 통합 가이드

이 문서는 Next.js App Router에 Clerk 인증을 통합하는 방법을 설명합니다.

## ✅ 완료된 작업

1. ✅ `@clerk/nextjs` 패키지 설치 완료
2. ✅ `middleware.ts` 파일에 `clerkMiddleware()` 통합
3. ✅ `app/layout.tsx`에 `<ClerkProvider>` 추가
4. ✅ `Header.tsx` 컴포넌트에 Clerk 인증 UI 통합

## 🔑 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Clerk 환경 변수
# https://dashboard.clerk.com/last-active?path=api-keys 에서 키를 복사하세요
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY

# Clerk 리다이렉트 URL (선택사항)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

### Clerk API 키 가져오기

1. [Clerk Dashboard](https://dashboard.clerk.com/) 로그인
2. 프로젝트 선택 (또는 새 프로젝트 생성)
3. 왼쪽 사이드바에서 **API Keys** 클릭
4. **Publishable Key**와 **Secret Key** 복사
5. `.env.local` 파일에 붙여넣기

## 📦 설치된 패키지

```json
{
  "@clerk/nextjs": "^6.35.1"
}
```

## 🔧 통합된 파일

### 1. middleware.ts

```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Clerk 인증 처리 후 Supabase 세션 업데이트
  return await updateSession(request);
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

### 2. app/layout.tsx

```typescript
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 3. app/components/Header.tsx

- `useUser()` 훅으로 사용자 정보 가져오기
- `<UserButton>` 컴포넌트로 사용자 프로필 버튼 표시
- `<SignInButton>` 컴포넌트로 로그인 버튼 표시

## 🎯 사용 방법

### 클라이언트 컴포넌트 (`'use client'`)

```typescript
import { useUser, useAuth } from '@clerk/nextjs';

export default function ClientComponent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { userId } = useAuth();

  if (!isLoaded) return <div>로딩 중...</div>;

  if (!isSignedIn) return <div>로그인이 필요합니다.</div>;

  return <div>안녕하세요, {user.firstName}님!</div>;
}
```

### 서버 컴포넌트

```typescript
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function ServerComponent() {
  // 방법 1: userId만 필요한 경우
  const { userId } = await auth();
  
  if (!userId) {
    redirect('/');
  }

  // 방법 2: 전체 사용자 정보가 필요한 경우
  const user = await currentUser();

  return (
    <div>
      <p>User ID: {userId}</p>
      <p>이메일: {user?.emailAddresses[0]?.emailAddress}</p>
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
    return NextResponse.json(
      { error: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  return NextResponse.json({ message: '보호된 데이터', userId });
}
```

## 🗃️ 데이터베이스 통합 (Supabase)

Clerk와 Supabase를 함께 사용하려면 프로필 테이블에 `clerk_id` 필드를 추가해야 합니다.

### 마이그레이션 SQL

```sql
-- profiles 테이블에 clerk_id 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS clerk_id TEXT UNIQUE;

-- clerk_id에 인덱스 추가 (조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles(clerk_id);

-- 기존 id 컬럼을 clerk_id로 마이그레이션 (선택사항)
-- UPDATE profiles SET clerk_id = id WHERE clerk_id IS NULL;
```

### Webhook으로 자동 프로필 생성 (권장)

Clerk에서 사용자가 생성될 때 자동으로 Supabase에 프로필을 생성하려면 Webhook을 설정하세요:

1. Clerk Dashboard → Webhooks → Add Endpoint
2. Endpoint URL: `https://your-domain.com/api/webhooks/clerk`
3. Events: `user.created`, `user.updated`, `user.deleted`

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Admin 키 필요
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  const body = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id!,
      'svix-timestamp': svix_timestamp!,
      'svix-signature': svix_signature!,
    });
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  const { id, email_addresses, first_name, last_name, image_url } = evt.data;

  if (evt.type === 'user.created') {
    await supabaseAdmin.from('profiles').insert({
      clerk_id: id,
      email: email_addresses[0].email_address,
      nickname: `${first_name} ${last_name}`,
      avatar_url: image_url,
    });
  }

  return new Response('Webhook processed', { status: 200 });
}
```

## 🎨 Clerk UI 커스터마이징

### 모달 로그인

```typescript
import { SignInButton, SignUpButton } from '@clerk/nextjs';

<SignInButton mode="modal">
  <button>로그인</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>회원가입</button>
</SignUpButton>
```

### 전체 페이지 로그인

```typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <SignIn />
    </div>
  );
}
```

### UserButton 커스터마이징

```typescript
<UserButton
  afterSignOutUrl="/"
  appearance={{
    elements: {
      avatarBox: 'w-10 h-10 border-2 border-black',
      userButtonPopoverCard: 'shadow-xl',
    },
  }}
  userProfileMode="modal"
/>
```

## 🔒 라우트 보호

### Middleware에서 보호

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/profile(.*)',
  '/my-page(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});
```

## 📚 참고 자료

- [Clerk 공식 문서](https://clerk.com/docs)
- [Clerk + Next.js 가이드](https://clerk.com/docs/quickstarts/nextjs)
- [Clerk + Supabase 통합](https://clerk.com/docs/integrations/databases/supabase)

## ✅ 체크리스트

통합을 완료하기 전에 다음 항목을 확인하세요:

- [ ] `.env.local` 파일에 Clerk API 키 추가
- [ ] `.env.local`이 `.gitignore`에 포함되어 있는지 확인
- [ ] Clerk Dashboard에서 프로젝트 설정 확인
- [ ] 개발 서버 재시작: `pnpm dev`
- [ ] 로그인/로그아웃 테스트
- [ ] 보호된 라우트 접근 테스트
- [ ] Supabase 프로필 테이블에 `clerk_id` 추가 (선택사항)

## 🚀 다음 단계

1. **개발 서버 실행**
   ```bash
   pnpm dev
   ```

2. **로그인 테스트**
   - 헤더의 "로그인" 버튼 클릭
   - 이메일 또는 소셜 로그인 사용
   - 대시보드에서 사용자 생성 확인

3. **보호된 페이지 테스트**
   - `/protected-page` 방문
   - 인증되지 않은 상태에서 리다이렉트 확인

4. **API 보호 테스트**
   - `/api/protected` 엔드포인트 호출
   - 401 에러 확인 (인증되지 않은 경우)

## 🐛 문제 해결

### "Invalid publishable key" 오류
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- API 키가 올바르게 복사되었는지 확인
- 개발 서버를 재시작하세요

### 로그인 후에도 사용자 정보가 표시되지 않음
- 브라우저 캐시 및 쿠키 삭제
- Clerk Dashboard에서 도메인 설정 확인
- 개발 환경에서는 `localhost`가 허용되어야 함

### Supabase와 연동이 안됨
- `profiles` 테이블에 `clerk_id` 컬럼이 있는지 확인
- Webhook이 올바르게 설정되었는지 확인
- 환경 변수에 `SUPABASE_SERVICE_ROLE_KEY` 추가

---

**마지막 업데이트**: 2025-11-14
**버전**: 1.0.0

