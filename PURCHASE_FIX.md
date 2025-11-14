# 🔧 구매 내역 문제 해결

## ✅ 수정 완료된 사항

### 1. Supabase 연동 확인
- ✅ **Supabase에 구매 데이터가 정상 저장됨** 확인
- ✅ Clerk 인증 ID 형식: `user_35SzAvWmoqFFKaZO4trMtBHwOQG`

### 2. Admin 클라이언트로 전환
다음 파일들을 Admin 클라이언트를 사용하도록 변경:
- ✅ `app/my-page/page.tsx` - 구매 내역 조회
- ✅ `app/page.tsx` - 홈페이지
- ✅ `app/api/admin/prompts/route.ts` - 관리자 페이지
- ✅ `app/api/cart/route.ts` - 장바구니 API
- ✅ `app/api/payment/confirm/route.ts` - 결제 승인
- ✅ `app/api/payment/save-purchase/route.ts` - 구매 저장
- ✅ `app/api/test/add-purchase/route.ts` - 테스트 데이터

## 🔑 필수 설정

### Supabase Service Role Key 설정

**`.env.local` 파일에 다음을 추가하세요:**

```bash
# 기존 Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# 추가 필요 ⭐
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Service Role Key 찾는 방법:

1. [Supabase Dashboard](https://supabase.com/dashboard) 접속
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **Settings** ⚙️ 클릭
4. **API** 메뉴 클릭
5. **Project API keys** 섹션에서 `service_role` 키 복사
6. `.env.local` 파일에 붙여넣기

### ⚠️ 중요!
- Service Role Key는 **절대 Git에 커밋하지 마세요**
- 이 키는 RLS를 우회하므로 **서버에서만 사용**됩니다

## 🧪 테스트 방법

### 1. 서버 재시작
```bash
# 터미널에서 Ctrl+C로 서버 중지
pnpm run dev
```

### 2. 마이페이지 확인
- `/my-page` 접속
- 터미널에서 로그 확인:
  ```
  🔍 [MyPage] 현재 사용자 ID: user_xxxxx
  🟢 [MyPage] 구매 내역 조회 성공: 1개
  ```

### 3. 구매 내역이 표시되는지 확인

## 🐛 문제 해결

### "Missing SUPABASE_SERVICE_ROLE_KEY" 에러
**원인:** Service Role Key가 설정되지 않음

**해결:**
1. `.env.local` 파일에 `SUPABASE_SERVICE_ROLE_KEY` 추가
2. 서버 재시작

### 여전히 구매 내역이 안 보이는 경우

**1단계: 브라우저 콘솔 확인**
- F12 눌러서 콘솔 열기
- 에러 메시지 확인

**2단계: 터미널 로그 확인**
```
🔍 [MyPage] 현재 사용자 ID: user_xxxxx
```
위 로그가 보이는지 확인

**3단계: Supabase에서 직접 확인**
```sql
SELECT * FROM purchases 
WHERE buyer_id = '당신의_clerk_user_id'
ORDER BY created_at DESC;
```

## 📊 현재 Supabase 데이터 상태

### 실제 사용자 구매 내역
- `user_35SzAvWmoqFFKaZO4trMtBHwOQG`
  - "블로그 글쓰기 AI 어시스턴트" (1,000원)
  - 구매 일시: 2025-11-14

### 테스트 더미 데이터
- `user_test_1`, `user_test_3` (과거 더미 데이터)

## ✨ 해결 방법 요약

1. **Service Role Key 설정** (`.env.local`)
2. **서버 재시작** (`pnpm run dev`)
3. **마이페이지 확인** (`/my-page`)
4. **터미널 로그 확인**

이제 구매 내역이 정상적으로 표시될 것입니다! 🎉

