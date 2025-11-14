'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Heading, Text, Alert } from '../../components/ui';
import { getCart, clearCart } from '@/lib/cart';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirming, setConfirming] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    confirmPayment();
  }, []);

  const confirmPayment = async () => {
    const paymentKey = searchParams.get('paymentKey');
    const orderId = searchParams.get('orderId');
    const amount = searchParams.get('amount');

    if (!paymentKey || !orderId || !amount) {
      setError('결제 정보가 올바르지 않습니다.');
      setConfirming(false);
      return;
    }

    try {
      console.log('🔵 결제 승인 요청 시작:', { paymentKey, orderId, amount });
      
      // 1. 토스페이먼츠 결제 승인
      const response = await fetch('/api/payment/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      });

      console.log('🔵 API 응답 상태:', response.status);
      const data = await response.json();
      console.log('🔵 API 응답 데이터:', data);

      if (!response.ok) {
        console.error('🔴 결제 승인 실패:', data);
        throw new Error(data.error || data.details?.message || '결제 승인에 실패했습니다.');
      }

      // 2. localStorage에서 장바구니 가져오기
      const cart = getCart();
      console.log('🔵 장바구니 아이템:', cart);

      if (cart.length > 0) {
        // 3. Supabase에 구매 내역 저장
        const purchaseResponse = await fetch('/api/payment/save-purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            promptIds: cart.map(item => item.promptId),
            orderId: orderId,
            totalAmount: Number(amount),
          }),
        });

        if (!purchaseResponse.ok) {
          console.error('🔴 구매 내역 저장 실패');
          // 결제는 성공했으므로 계속 진행
        } else {
          console.log('🟢 구매 내역 저장 성공');
        }
      }

      // 4. 장바구니 클리어
      clearCart();
      console.log('🟢 장바구니 클리어 완료');

      setConfirming(false);
    } catch (err: any) {
      console.error('Payment confirmation error:', err);
      setError(err.message || '결제 승인 중 오류가 발생했습니다.');
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12">
        <Card padding="lg" className="max-w-md mx-auto text-center">
          <div className="w-16 h-16 border-4 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <Heading level="h2" className="mb-4">결제 승인 중...</Heading>
          <Text color="tertiary">잠시만 기다려주세요.</Text>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4">
          <Card padding="lg" className="text-center">
            <div className="w-24 h-24 bg-[var(--color-status-red)] mx-auto mb-6 flex items-center justify-center border-2 border-[var(--color-border-primary)]">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <Heading level="h2" className="mb-4">결제 승인 실패</Heading>
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
            <div className="flex flex-col gap-3">
              <Button variant="primary" size="lg" onClick={() => router.push('/cart')}>
                장바구니로 돌아가기
              </Button>
              <Button variant="ghost" size="md" onClick={() => router.push('/')}>
                홈으로 이동
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card padding="lg" className="text-center">
          {/* 성공 아이콘 */}
          <div className="w-24 h-24 bg-[var(--color-status-green)] mx-auto mb-6 flex items-center justify-center border-2 border-[var(--color-border-primary)]">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <Heading level="h1" className="mb-4">결제가 완료되었습니다!</Heading>
          
          <Text color="secondary" className="mb-8">
            주문하신 프롬프트를 이제 사용하실 수 있습니다.
          </Text>

          <Alert variant="success" className="mb-6">
            구매하신 프롬프트는 마이페이지에서 확인하실 수 있습니다.
          </Alert>

          <div className="flex flex-col gap-3">
            <Link href="/my-page" className="block">
              <Button variant="primary" size="lg" fullWidth>
                구매 내역 확인하기
              </Button>
            </Link>
            <Link href="/" className="block">
              <Button variant="secondary" size="md" fullWidth>
                쇼핑 계속하기
              </Button>
            </Link>
          </div>

          {/* 주문 정보 */}
          <div className="mt-8 pt-8 border-t-2 border-[var(--color-border-tertiary)] text-left">
            <Heading level="h3" className="mb-4">주문 정보</Heading>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Text color="tertiary" size="small">주문번호</Text>
                <Text size="small" weight="semibold">
                  {searchParams.get('orderId')}
                </Text>
              </div>
              <div className="flex justify-between">
                <Text color="tertiary" size="small">결제금액</Text>
                <Text size="small" weight="semibold">
                  {Number(searchParams.get('amount') || 0).toLocaleString('ko-KR')}원
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text size="large">로딩 중...</Text>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
