# Supabase 설정 가이드

이 디렉토리에는 Supabase 데이터베이스 설정을 위한 SQL 파일들이 포함되어 있습니다.

## 📁 파일 구조

- `schema.sql` - 전체 데이터베이스 스키마 (profiles, prompts, carts, purchases)
- `prompts_setup.sql` - Prompts 테이블 생성 및 RLS 정책 설정
- `prompts_seed.sql` - Prompts 초기 데이터 삽입
- `schema_clerk.sql` - Clerk 인증 관련 스키마
- `add_clerk_id_migration.sql` - Clerk ID 마이그레이션

## 🚀 Prompts 테이블 설정 방법

### 1단계: 테이블 생성 및 RLS 설정

Supabase 대시보드의 SQL Editor에서 `prompts_setup.sql` 파일의 내용을 실행하세요.

```sql
-- prompts_setup.sql 내용 실행
```

이 스크립트는 다음을 수행합니다:
- ✅ `prompts` 테이블 생성
- ✅ RLS (Row Level Security) 활성화
- ✅ 읽기 정책: 모든 사용자가 활성화된 프롬프트 조회 가능
- ✅ 쓰기 정책: admin 권한을 가진 사용자만 생성/수정/삭제 가능
- ✅ 인덱스 생성 (성능 최적화)

### 2단계: 초기 데이터 삽입

`prompts_seed.sql` 파일의 내용을 실행하여 초기 프롬프트 데이터를 삽입하세요.

```sql
-- prompts_seed.sql 내용 실행
```

이 스크립트는:
- ✅ 25개의 샘플 프롬프트 데이터 삽입
- ✅ 다양한 카테고리 (design, writing, marketing, development 등)
- ✅ 실제 사용 가능한 고품질 프롬프트

## 🔐 RLS 정책 설명

### 읽기 (SELECT)
```sql
-- 모든 사용자가 활성화된 프롬프트를 볼 수 있음
CREATE POLICY "prompts_select_policy"
    ON public.prompts
    FOR SELECT
    USING (is_active = true);
```

### 쓰기 (INSERT, UPDATE, DELETE)
```sql
-- admin 권한을 가진 사용자만 가능
CREATE POLICY "prompts_insert_policy"
    ON public.prompts
    FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin'
        OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );
```

## 🛠️ Admin 권한 설정

Clerk에서 사용자에게 admin 권한을 부여하려면:

1. Clerk Dashboard → Users → 특정 사용자 선택
2. Metadata 탭 → Public metadata 편집
3. 다음 JSON 추가:
```json
{
  "role": "admin"
}
```

## 📊 데이터 확인

### 프롬프트 목록 조회
```sql
SELECT 
    id,
    title,
    price,
    category,
    is_active,
    created_at
FROM public.prompts
WHERE is_active = true
ORDER BY created_at DESC;
```

### 카테고리별 통계
```sql
SELECT 
    category,
    COUNT(*) as count,
    AVG(price) as avg_price,
    MIN(price) as min_price,
    MAX(price) as max_price
FROM public.prompts
WHERE is_active = true
GROUP BY category
ORDER BY category;
```

## 🔄 데이터 마이그레이션

기존 더미 데이터를 Supabase로 마이그레이션하려면 `prompts_seed.sql`을 사용하세요.

## 🎯 API 엔드포인트

프롬프트 관련 API는 다음 경로에 구현되어 있습니다:

- `GET /api/admin/prompts` - 모든 프롬프트 조회
- `POST /api/admin/prompts` - 새 프롬프트 생성
- `GET /api/admin/prompts/[id]` - 특정 프롬프트 조회
- `PUT /api/admin/prompts/[id]` - 프롬프트 수정
- `DELETE /api/admin/prompts/[id]` - 프롬프트 삭제 (soft delete)

## 📱 Admin 페이지

프롬프트 관리 페이지: `/admin/prompts`

기능:
- ✅ 프롬프트 목록 조회
- ✅ 새 프롬프트 추가
- ✅ 프롬프트 수정
- ✅ 프롬프트 삭제 (비활성화)

## ⚠️ 주의사항

1. **RLS 정책**: 반드시 RLS를 활성화하여 보안을 유지하세요.
2. **Admin 권한**: 프로덕션 환경에서는 admin 권한을 신중하게 부여하세요.
3. **Soft Delete**: 프롬프트 삭제는 `is_active = false`로 처리되어 데이터가 보존됩니다.
4. **구매 내역**: 프롬프트를 삭제해도 구매 내역은 유지됩니다.

## 🐛 문제 해결

### RLS 정책이 작동하지 않는 경우
```sql
-- RLS가 활성화되어 있는지 확인
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'prompts';

-- 정책 목록 확인
SELECT * FROM pg_policies WHERE tablename = 'prompts';
```

### Admin 권한이 작동하지 않는 경우
- Clerk의 Public metadata에 `role: admin`이 설정되어 있는지 확인
- JWT 토큰에 metadata가 포함되어 있는지 확인

## 📚 참고 자료

- [Supabase RLS 문서](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk Metadata 문서](https://clerk.com/docs/users/metadata)
- [Next.js 15 문서](https://nextjs.org/docs)
