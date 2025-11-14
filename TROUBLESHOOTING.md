# 🔧 결제 오류 해결 가이드

## ❌ "Payment confirmation failed" 에러

결제 승인 실패 시 다음 단계를 순서대로 진행하세요.

---

## 1️⃣ 환경 변수 확인 (가장 중요!)

### 자동 체크

터미널에서 실행:
```bash
pnpm check-env
```

### 수동 체크

`.env.local` 파일을 열어 다음 항목이 모두 있는지 확인:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...

# Toss Payments (⚠️ 이 두 개가 가장 중요!)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...
TOSS_SECRET_KEY=test_sk_...
```

### ❌ 없다면?

1. [Toss Payments 개발자센터](https://developers.tosspayments.com/) 접속
2. 로그인 후 **내 개발 정보** 메뉴
3. **테스트 키** 복사:
   - 클라이언트 키 → `NEXT_PUBLIC_TOSS_CLIENT_KEY`
   - 시크릿 키 → `TOSS_SECRET_KEY`
4. `.env.local` 파일에 추가
5. **개발 서버 재시작** (Ctrl+C 후 `pnpm dev`)

---

## 2️⃣ 브라우저 콘솔 확인

1. **F12** 또는 **우클릭 > 검사** 열기
2. **Console** 탭 확인
3. 다음과 같은 로그 찾기:

### ✅ 정상인 경우
```
🔵 결제 승인 요청 시작: {paymentKey: "...", orderId: "...", amount: 10000}
🔵 API 응답 상태: 200
🔵 API 응답 데이터: {success: true, ...}
```

### ❌ 에러인 경우
```
🔴 결제 승인 실패: {error: "...", details: {...}}
```

**에러 메시지를 복사**하여 아래 "일반적인 에러" 섹션 참조

---

## 3️⃣ 서버 콘솔 확인

`pnpm dev`를 실행한 터미널에서:

### ✅ 정상인 경우
```
🟢 [API] 결제 승인 요청 받음
🟢 [API] 사용자 ID: user_xxx
🟢 [API] 요청 데이터: {...}
🟢 [API] Secret Key 존재: true
🟢 [API] Toss Payments API 호출 시작
🟢 [API] Toss API 응답 상태: 200
🟢 [API] Toss 결제 승인 성공!
```

### ❌ 에러인 경우

#### "Secret Key 존재: false"
→ `.env.local`에 `TOSS_SECRET_KEY` 추가 필요

#### "인증 실패: userId 없음"
→ 로그인 상태 확인 (Clerk 세션 만료)

#### "Toss API 응답 상태: 401"
→ 시크릿 키가 잘못됨 (다시 복사하여 붙여넣기)

#### "Toss API 응답 상태: 400"
→ 요청 데이터 형식 오류 (금액, orderId 등)

---

## 일반적인 에러 및 해결책

### 1. "TOSS_SECRET_KEY not set"

**원인**: 환경 변수 미설정

**해결**:
```bash
# 1. .env.local 파일에 추가
TOSS_SECRET_KEY=test_sk_your_key_here

# 2. 서버 재시작
Ctrl+C
pnpm dev
```

### 2. "Unauthorized" (401)

**원인 A**: Toss Payments 시크릿 키가 잘못됨

**해결**:
1. 개발자센터에서 키 다시 복사
2. `.env.local` 업데이트
3. 서버 재시작

**원인 B**: 로그인 안됨

**해결**:
1. 브라우저에서 로그인 확인
2. 로그아웃 후 다시 로그인

### 3. "Payment confirmation failed"

**원인**: Toss Payments API 호출 실패

**체크리스트**:
- [ ] `.env.local`에 `TOSS_SECRET_KEY` 있음
- [ ] 키가 `test_sk_`로 시작함 (테스트 키)
- [ ] 인터넷 연결 정상
- [ ] 서버 재시작 완료

### 4. 결제창은 뜨는데 승인 실패

**원인**: 테스트 결제 데이터 입력 오류

**해결**: 다음 정보로 다시 시도
```
카드번호: 1111-2222-3333-4444
유효기간: 12/25
CVC: 123
비밀번호: 00
```

### 5. "Server configuration error"

**원인**: 서버 환경 변수 로드 실패

**해결**:
```bash
# 1. .env.local 파일명 확인 (.env가 아님!)
# 2. 파일 위치 확인 (프로젝트 루트)
# 3. 서버 완전히 재시작
Ctrl+C
pnpm dev
```

---

## 4️⃣ 단계별 디버깅

### Step 1: 환경 변수 확인
```bash
pnpm check-env
```
✅ 모두 설정됨 → Step 2로
❌ 누락 있음 → 설정 후 서버 재시작

### Step 2: 로그인 확인
1. 우측 상단 프로필 아이콘 확인
2. 없으면 로그인

### Step 3: 테스트 결제
1. 프롬프트 장바구니 담기
2. 결제 페이지 이동
3. '결제하기' 클릭
4. 결제창에서 테스트 카드 입력
5. 브라우저 콘솔 & 서버 터미널 확인

### Step 4: 로그 분석
- 🔵 파란 로그: 진행 상황
- 🟢 초록 로그: 서버 로그
- 🔴 빨간 로그: 에러 발생

에러 메시지를 확인하여 위 "일반적인 에러" 섹션 참조

---

## 5️⃣ 여전히 안 되나요?

### 환경 초기화

```bash
# 1. 개발 서버 종료
Ctrl+C

# 2. node_modules 삭제 후 재설치
rm -rf node_modules
rm -rf .next
pnpm install

# 3. 환경 변수 재확인
pnpm check-env

# 4. 서버 재시작
pnpm dev
```

### 로그 수집

다음 정보를 수집하여 문의:

1. **브라우저 콘솔 로그** (F12 > Console)
   - 🔵 파란 로그들 복사
   - 🔴 빨간 에러 복사

2. **서버 터미널 로그**
   - 🟢 초록 로그들 복사
   - 🔴 빨간 에러 복사

3. **환경 변수 체크 결과**
   ```bash
   pnpm check-env
   ```
   (키 값 제외하고 ✅/❌만)

---

## ✅ 정상 작동 확인

성공 시 다음이 보여야 합니다:

1. ✅ 결제창 팝업
2. ✅ 테스트 카드 입력
3. ✅ "결제 승인 중..." 화면
4. ✅ "결제가 완료되었습니다!" 화면
5. ✅ localStorage의 dummyCart 클리어
6. ✅ (실제 데이터의 경우) Supabase purchases 테이블에 기록

---

## 📞 추가 도움

- [Toss Payments 공식 문서](https://docs.tosspayments.com/)
- [테스트 가이드](https://docs.tosspayments.com/guides/test)
- `docs/PAYMENT_GUIDE.md` 참조

---

**업데이트**: 2025-11-14

