# 🔐 Clerk + Supabase 통합 가이드 (2025 최신 모범 사례)

이 문서는 **Native Third-Party Auth Provider 방식**을 사용하여 Clerk와 Supabase를 올바르게 통합하는 방법을 설명합니다.

> **⚠️ 중요**: JWT 템플릿 방식은 2025년 4월 1일부터 Deprecated 되었습니다. 반드시 Native 통합을 사용하세요.

---

## 📚 참고 자료

- [Clerk 공식 문서](https://clerk.com/docs/guides/development/integrations/databases/supabase)
- [Supabase Third-Party Auth](https://supabase.com/docs/guides/auth/third-party/clerk)
- [예제 저장소](https://github.com/clerk/clerk-supabase-nextjs)

---

## 🎯 통합 개요

### Native 통합의 장점

✅ **JWT 템플릿 대비 개선점:**
- 매 Supabase 요청마다 새 토큰을 가져올 필요 없음
- Supabase JWT secret을 Clerk와 공유할 필요 없음
- 더 안전하고 간단한 설정

### 작동 방식

1. Clerk가 사용자 인증 관리
2. Clerk 세션 토큰이 Supabase 요청에 주입됨
3. Supabase RLS 정책이 `auth.jwt()->>'sub'`로 Clerk user ID 확인
4. 사용자는 자신의 데이터만 접근 가능

---

## ⚙️ 설정 단계

### 1단계: Clerk Dashboard 설정

1. [Clerk Dashboard](https://dashboard.clerk.com/setup/supabase) 접속
2. **Supabase integration setup** 페이지로 이동
3. 설정 옵션 선택 후 **"Activate Supabase integration"** 클릭
4. 표시된 **Clerk domain** 복사 (예: `your-app.clerk.accounts.dev`)

### 2단계: Supabase Dashboard 설정

1. [Supabase Dashboard](https://supabase.com/dashboard/project/_/auth/third-party) 접속
2. **Authentication > Sign In / Up** 메뉴로 이동
3. **"Add provider"** 클릭
4. 목록에서 **"Clerk"** 선택
5. 복사한 **Clerk domain** 붙여넣기
6. 저장

### 3단계: 데이터베이스 마이그레이션

Supabase SQL Editor에서 다음 마이그레이션 실행:

```sql
-- profiles 테이블에 user_id 추가 (Clerk ID 저장)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS user_id TEXT DEFAULT (auth.jwt()->>'sub');

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 사용자는 자신의 프로필만 조회 가능
CREATE POLICY "Users can view their own profile"
ON profiles
FOR SELECT
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

-- RLS 정책: 사용자는 자신의 프로필만 수정 가능
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);
```

> 💡 **Tip**: 전체 마이그레이션 파일은 `supabase/add_clerk_id_migration.sql` 참고

### 4단계: 환경 변수 설정

`.env.local` 파일에 다음 추가:

```bash
# Clerk (이미 설정됨)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Supabase (이미 설정됨)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
```

---

## 💻 코드 구현

### 클라이언트 컴포넌트에서 사용

```tsx
'use client'

import { useSession, useUser } from '@clerk/nextjs'
import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client'
import { useEffect, useState } from 'react'

export default function MyComponent() {
  const { user } = useUser()
  const { session } = useSession()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    if (!user) return

    async function loadTasks() {
      // Clerk 토큰이 주입된 Supabase 클라이언트 생성
      const client = createClerkSupabaseClient(session?.getToken)
      
      // RLS 정책에 의해 자동으로 현재 사용자의 데이터만 조회됨
      const { data, error } = await client
        .from('tasks')
        .select('*')
      
      if (!error) setTasks(data)
    }

    loadTasks()
  }, [user, session])

  return (
    <div>
      <h2>내 작업 목록</h2>
      {tasks.map(task => (
        <div key={task.id}>{task.name}</div>
      ))}
    </div>
  )
}
```

### 서버 컴포넌트에서 사용

```tsx
import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export default async function ServerPage() {
  const { userId } = await auth()
  
  if (!userId) {
    return <div>로그인이 필요합니다</div>
  }

  // 서버에서는 일반 Supabase 클라이언트 사용
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Clerk userId로 직접 쿼리
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  return (
    <div>
      <h2>프로필</h2>
      <p>{profile?.nickname}</p>
    </div>
  )
}
```

---

## 🔒 RLS (Row Level Security) 정책

### 기본 패턴

```sql
-- 읽기: 자신의 데이터만 조회
CREATE POLICY "policy_name"
ON table_name
FOR SELECT
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

-- 쓰기: 자신의 데이터만 삽입
CREATE POLICY "policy_name"
ON table_name
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt()->>'sub') = user_id);

-- 수정: 자신의 데이터만 수정
CREATE POLICY "policy_name"
ON table_name
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);

-- 삭제: 자신의 데이터만 삭제
CREATE POLICY "policy_name"
ON table_name
FOR DELETE
TO authenticated
USING ((auth.jwt()->>'sub') = user_id);
```

### 공개 읽기 + 소유자 쓰기

```sql
-- 모든 사용자가 읽을 수 있지만, 소유자만 수정 가능
CREATE POLICY "Anyone can read"
ON prompts
FOR SELECT
TO authenticated, anon
USING (true);

CREATE POLICY "Owner can update"
ON prompts
FOR UPDATE
TO authenticated
USING ((auth.jwt()->>'sub') = seller_id);
```

---

## 🧪 테스트 방법

### 1. 기본 인증 테스트

1. 애플리케이션 실행: `pnpm dev`
2. Clerk로 로그인
3. 데이터 조회/생성 테스트

### 2. RLS 정책 테스트

```sql
-- Supabase SQL Editor에서 실행
-- 1. 현재 로그인한 사용자 ID 확인
SELECT auth.jwt()->>'sub' as current_user_id;

-- 2. 자신의 데이터만 조회되는지 확인
SELECT * FROM profiles WHERE user_id = (auth.jwt()->>'sub');

-- 3. 다른 사용자 데이터 조회 시도 (실패해야 함)
SELECT * FROM profiles WHERE user_id != (auth.jwt()->>'sub');
```

### 3. 다중 사용자 테스트

1. 사용자 A로 로그인하여 데이터 생성
2. 로그아웃
3. 사용자 B로 로그인
4. 사용자 A의 데이터가 보이지 않는지 확인

---

## 🐛 문제 해결

### "RLS policy violation" 에러

**원인**: RLS 정책이 요청을 차단함

**해결**:
1. Clerk Dashboard에서 Supabase 통합이 활성화되어 있는지 확인
2. Supabase Dashboard에서 Clerk가 Third-party provider로 추가되어 있는지 확인
3. RLS 정책이 올바르게 생성되었는지 확인

```sql
-- RLS 정책 확인
SELECT schemaname, tablename, policyname, cmd, roles 
FROM pg_policies 
WHERE schemaname = 'public';
```

### 데이터가 조회되지 않음

**원인**: 세션 토큰이 Supabase에 전달되지 않음

**해결**:
1. `createClerkSupabaseClient(session?.getToken)` 사용 확인
2. 클라이언트 컴포넌트에서 `useSession()` 훅 사용 확인
3. 브라우저 개발자 도구 Network 탭에서 Authorization 헤더 확인

### "JWT claim sub is missing" 에러

**원인**: Clerk 통합이 제대로 설정되지 않음

**해결**:
1. Clerk Dashboard에서 Supabase 통합 다시 활성화
2. Supabase에서 Clerk provider 다시 추가
3. 애플리케이션 재시작

---

## 📊 비교: JWT 템플릿 vs Native 통합

| 항목 | JWT 템플릿 (Deprecated) | Native 통합 (권장) |
|------|------------------------|-------------------|
| **설정 복잡도** | 높음 (JWT secret 공유 필요) | 낮음 (클릭 몇 번) |
| **보안** | 보통 (secret 공유) | 높음 (secret 불필요) |
| **성능** | 느림 (매번 토큰 가져오기) | 빠름 (토큰 재사용) |
| **유지보수** | 어려움 | 쉬움 |
| **지원 기간** | 2025년 4월 1일까지 | 계속 지원 |

---

## ✅ 체크리스트

통합 완료 전 확인:

- [ ] Clerk Dashboard에서 Supabase 통합 활성화
- [ ] Supabase Dashboard에서 Clerk provider 추가
- [ ] 데이터베이스 마이그레이션 실행 (RLS 설정)
- [ ] `createClerkSupabaseClient` 헬퍼 사용
- [ ] RLS 정책 테스트
- [ ] 다중 사용자 테스트
- [ ] 에러 처리 구현

---

## 🚀 추가 리소스

### 예제 코드
- `lib/supabase/clerk-client.ts` - Supabase 클라이언트 헬퍼
- `supabase/add_clerk_id_migration.sql` - RLS 마이그레이션

### 관련 문서
- `docs/CLERK_QUICKSTART.md` - Clerk 빠른 시작
- `docs/CLERK_SETUP.md` - Clerk 상세 설정

---

**마지막 업데이트**: 2025-11-14  
**Clerk 버전**: 6.35.1  
**Supabase JS 버전**: 2.81.1  
**통합 방식**: Native Third-Party Auth Provider

