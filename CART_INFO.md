# 🛒 장바구니 시스템 안내

## 📌 변경 사항

장바구니 시스템을 **LocalStorage 기반**으로 변경했습니다!

### ✅ 장점
- ✨ **추가 설정 불필요** - Service Role Key 설정 필요 없음
- 🚀 **더 빠른 성능** - 클라이언트에서 즉시 처리
- 💾 **간단한 구조** - Supabase RLS 정책 걱정 없음
- 🔒 **안전** - 결제 완료 시에만 Supabase에 저장

## 🔄 작동 방식

### 1. 장바구니 담기
- 프롬프트를 장바구니에 담으면 **브라우저 LocalStorage에 저장**
- 페이지를 새로고침해도 장바구니가 유지됨

### 2. 장바구니 보기
- `/cart` 페이지에서 LocalStorage의 프롬프트 ID를 읽음
- Supabase에서 프롬프트 정보를 가져와 표시

### 3. 결제하기
- `/checkout` 페이지에서 LocalStorage의 장바구니 확인
- 토스페이먼츠로 결제 진행

### 4. 결제 완료
- 결제가 성공하면 **Supabase에 구매 내역 저장**
- LocalStorage 장바구니 자동 클리어
- 마이페이지에서 구매한 프롬프트 확인 가능

## 📂 관련 파일

### 장바구니 관리
- `lib/cart.ts` - 장바구니 CRUD 함수
  - `addToCart()` - 장바구니에 추가
  - `removeFromCart()` - 장바구니에서 제거
  - `getCart()` - 장바구니 조회
  - `clearCart()` - 장바구니 비우기
  - `isInCart()` - 장바구니 포함 여부 확인

### 컴포넌트
- `app/components/PromptCard.tsx` - 장바구니 담기 버튼
- `app/components/CartContent.tsx` - 장바구니 목록 표시
- `app/checkout/page.tsx` - 결제 페이지
- `app/checkout/success/page.tsx` - 결제 완료 페이지

### API
- `app/api/payment/confirm/route.ts` - 토스페이먼츠 결제 승인
- `app/api/payment/save-purchase/route.ts` - 구매 내역 저장 (결제 완료 시)

## 🎯 사용 예시

```typescript
import { addToCart, getCart, removeFromCart, clearCart } from '@/lib/cart';

// 장바구니에 추가
const success = addToCart('prompt-id-123');

// 장바구니 조회
const cart = getCart();
// [{ promptId: 'prompt-id-123', addedAt: '2025-11-14T...' }]

// 장바구니에서 제거
removeFromCart('prompt-id-123');

// 장바구니 비우기
clearCart();
```

## 🔐 보안

- 장바구니는 브라우저에 저장되므로 민감한 정보 없음
- 결제는 토스페이먼츠의 안전한 결제 프로세스를 통해 진행
- 구매 내역은 결제 완료 후 Clerk 인증을 거쳐 Supabase에 저장
- Supabase Admin 클라이언트는 서버 사이드에서만 사용

## ✨ 테스트

1. 홈페이지에서 프롬프트 "담기" 클릭
2. `/cart` 페이지에서 장바구니 확인
3. "결제하기" 클릭
4. 결제 진행 (테스트 결제 정보 사용)
5. 결제 완료 후 `/my-page`에서 구매 내역 확인

## 🐛 문제 해결

### 장바구니가 비어있다고 나오는 경우
- 브라우저 콘솔에서 확인: `localStorage.getItem('prompt_cart')`
- 없으면 다시 장바구니에 담기
- 브라우저의 LocalStorage가 비활성화되어 있는지 확인

### 결제 후에도 장바구니가 남아있는 경우
- 결제 성공 페이지가 정상적으로 로드되었는지 확인
- 브라우저 콘솔에서 에러 메시지 확인
- 수동으로 클리어: `localStorage.removeItem('prompt_cart')`

## 📝 참고

- 장바구니는 브라우저별로 독립적으로 관리됨
- 시크릿 모드나 다른 브라우저에서는 장바구니가 공유되지 않음
- 브라우저 데이터를 삭제하면 장바구니도 삭제됨

