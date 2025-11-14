# 💳 결제 시스템 가이드 (Toss Payments)

## 📋 목차
1. [결제 흐름 개요](#결제-흐름-개요)
2. [환경 설정](#환경-설정)
3. [결제 테스트 방법](#결제-테스트-방법)
4. [더미 프롬프트 결제](#더미-프롬프트-결제)
5. [트러블슈팅](#트러블슈팅)

---

## 결제 흐름 개요

```
사용자 → 장바구니 → 결제 페이지 → Toss Payments → 결제 승인 API → 성공/실패 페이지
```

### 상세 흐름

1. **장바구니에 상품 담기** (`/cart`)
   - 더미 프롬프트: localStorage에 저장
   - 실제 프롬프트: Supabase `carts` 테이블에 저장

2. **결제하기 버튼 클릭** (`/checkout`)
   - 장바구니 아이템 로드 (더미 + 실제)
   - 결제 정보 표시 (상품명, 총액)

3. **토스페이먼츠 결제창 호출**
   - `@tosspayments/payment-sdk` 사용
   - 카드 결제 선택

4. **결제 승인 요청** (`/api/payment/confirm`)
   - Toss Payments API 호출
   - Supabase `purchases` 테이블에 구매 기록 저장
   - 장바구니 클리어

5. **결제 완료**
   - 성공: `/checkout/success`
   - 실패: `/checkout/fail`

---

## 환경 설정

### 1. Toss Payments 개발자 센터 가입

1. [Toss Payments 개발자센터](https://developers.tosspayments.com/) 접속
2. 회원가입 및 로그인
3. **내 개발 정보** 메뉴로 이동

### 2. API 키 발급

#### 테스트 키 (개발/테스트 환경)
```
클라이언트 키: test_ck_...
시크릿 키: test_sk_...
```

#### 라이브 키 (실제 운영 환경)
```
클라이언트 키: live_ck_...
시크릿 키: live_sk_...
```

> ⚠️ **주의**: 실제 돈이 결제되는 라이브 키는 신중하게 관리하세요!

### 3. 환경 변수 설정

`.env.local` 파일에 추가:

```env
# Toss Payments (테스트 환경)
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_your_client_key_here
TOSS_SECRET_KEY=test_sk_your_secret_key_here
```

---

## 결제 테스트 방법

### 테스트 카드 정보

Toss Payments는 **실제 카드 번호를 입력하지 않아도** 테스트 결제가 가능합니다:

| 항목 | 입력 값 |
|------|---------|
| **카드번호** | 아무 숫자나 16자리 (예: 1111-2222-3333-4444) |
| **유효기간** | 미래 날짜 (예: 12/25) |
| **CVC** | 아무 3자리 숫자 (예: 123) |
| **비밀번호** | 아무 2자리 숫자 (예: 00) |

### 테스트 시나리오

#### 1. 정상 결제 테스트
```
1. 프롬프트 장바구니에 담기
2. '결제하기' 클릭
3. 테스트 카드 정보 입력
4. 결제 완료
5. /checkout/success 페이지 확인
6. 구매 내역(/my-page)에서 프롬프트 확인
```

#### 2. 결제 취소 테스트
```
1. 결제창에서 '취소' 클릭
2. /checkout/fail 페이지로 리다이렉트 확인
3. 장바구니에 상품이 그대로 있는지 확인
```

#### 3. 결제 실패 테스트
```
1. 잘못된 정보 입력 (또는 네트워크 끊기)
2. 에러 메시지 확인
3. /checkout/fail 페이지 확인
```

---

## 더미 프롬프트 결제

### 특징

더미 프롬프트도 **실제 결제 가능**합니다:

- ✅ 장바구니에 담기 가능
- ✅ 결제 진행 가능
- ✅ Toss Payments 테스트 결제 가능
- ⚠️ Supabase `purchases` 테이블에는 저장되지 않음
- ⚠️ localStorage에서 관리

### 더미 + 실제 혼합 결제

```
장바구니:
  - 더미 프롬프트 1 (5,000원)
  - 더미 프롬프트 2 (3,000원)
  - 실제 프롬프트 1 (10,000원)
  
총액: 18,000원 결제 가능 ✅
```

### 결제 후 처리

- **실제 프롬프트**: Supabase `purchases` 테이블에 저장
- **더미 프롬프트**: localStorage의 `dummyCart` 클리어만 수행

---

## 트러블슈팅

### 1. "환경 변수가 설정되지 않았습니다"

**증상**: 결제창이 열리지 않음

**해결**:
```bash
# .env.local 파일 확인
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_...  # ✅ NEXT_PUBLIC_ 접두사 필수!
TOSS_SECRET_KEY=test_sk_...              # ✅ 서버용 (접두사 없음)
```

개발 서버 재시작:
```bash
# Ctrl + C로 종료 후
pnpm dev
```

### 2. "결제 승인에 실패했습니다"

**증상**: `/checkout/success`에서 에러 발생

**원인**:
- Toss Payments 시크릿 키가 잘못되었거나
- API 요청 형식이 잘못되었거나
- 네트워크 문제

**해결**:
1. 브라우저 콘솔 확인
2. 서버 로그 확인 (`pnpm dev` 실행 중인 터미널)
3. `.env.local`의 `TOSS_SECRET_KEY` 확인

### 3. "장바구니가 비어있습니다"

**증상**: 결제 페이지에서 장바구니가 비어있음

**원인**:
- 로그인하지 않았거나
- 세션이 만료되었거나
- 장바구니에 상품을 담지 않았거나
- localStorage가 클리어되었음 (더미 데이터)

**해결**:
1. 로그인 확인
2. 메인 페이지에서 프롬프트 다시 담기
3. 브라우저 시크릿 모드가 아닌지 확인

### 4. "Toss Payments SDK 로드 실패"

**증상**: 결제창이 열리지 않고 콘솔에 에러

**해결**:
```bash
# 패키지 재설치
pnpm install @tosspayments/payment-sdk

# 개발 서버 재시작
pnpm dev
```

### 5. 더미 프롬프트가 구매 내역에 안 보임

**정상 동작입니다!** 

더미 프롬프트는 데모용이므로 Supabase에 저장되지 않습니다. 실제 프롬프트만 `/my-page`에서 확인 가능합니다.

---

## API 엔드포인트

### POST `/api/payment/confirm`

결제 승인을 처리하는 서버 API

**Request Body**:
```json
{
  "paymentKey": "string",
  "orderId": "string",
  "amount": number
}
```

**Response (성공)**:
```json
{
  "success": true,
  "payment": {
    // Toss Payments 응답 데이터
  }
}
```

**Response (실패)**:
```json
{
  "error": "string",
  "details": {}
}
```

---

## 보안 주의사항

### 1. 시크릿 키 보호

```env
# ❌ 클라이언트에 노출되면 안 됨!
TOSS_SECRET_KEY=test_sk_...

# ✅ 서버에서만 사용
# ✅ .gitignore에 .env.local 추가
# ✅ 절대 GitHub에 커밋하지 않기
```

### 2. 금액 검증

클라이언트가 보낸 금액을 **서버에서 반드시 재검증**:

```typescript
// ✅ app/api/payment/confirm/route.ts에서 검증
// 장바구니 아이템을 서버에서 다시 조회하여 금액 계산
```

### 3. 중복 결제 방지

```typescript
// orderId는 고유해야 함
const orderId = `ORDER_${Date.now()}`;
```

---

## 참고 자료

- [Toss Payments 공식 문서](https://docs.tosspayments.com/)
- [결제 테스트 가이드](https://docs.tosspayments.com/guides/test-card)
- [API 레퍼런스](https://docs.tosspayments.com/reference)

---

**마지막 업데이트**: 2025-11-14

