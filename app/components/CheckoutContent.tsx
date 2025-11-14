'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadPaymentWidget, PaymentWidgetInstance } from '@tosspayments/payment-sdk';
import { Cart } from '@/types/database.types';
import { Card, Text, Heading, Alert } from './ui';

interface CheckoutContentProps {
  cartItems: Cart[];
  userId: string;
}

export default function CheckoutContent({ cartItems, userId }: CheckoutContentProps) {
  const [paymentWidget, setPaymentWidget] = useState<PaymentWidgetInstance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  const customerKey = userId; // 사용자 ID를 customer key로 사용

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.prompts?.price || 0);
    }, 0);
  };

  useEffect(() => {
    const initializePaymentWidget = async () => {
      if (!clientKey) {
        setError('결제 설정이 올바르지 않습니다. 관리자에게 문의하세요.');
        setLoading(false);
        return;
      }

      try {
        const widget = await loadPaymentWidget(clientKey, customerKey);
        setPaymentWidget(widget);
        setLoading(false);
      } catch (err) {
        console.error('Payment widget initialization error:', err);
        setError('결제 모듈을 불러오는데 실패했습니다.');
        setLoading(false);
      }
    };

    initializePaymentWidget();
  }, [clientKey, customerKey]);

  useEffect(() => {
    if (!paymentWidget) return;

    const totalAmount = getTotalPrice();

    // 결제 위젯 렌더링
    paymentWidget.renderPaymentMethods('#payment-widget', totalAmount, {
      value: totalAmount,
      currency: 'KRW',
      locale: 'ko_KR',
    });

    // 이용약관 렌더링
    paymentWidget.renderAgreement('#agreement');
  }, [paymentWidget]);

  const handlePayment = async () => {
    if (!paymentWidget) {
      alert('결제 모듈이 준비되지 않았습니다.');
      return;
    }

    const orderId = `ORDER_${Date.now()}_${userId.slice(0, 8)}`;
    const orderName =
      cartItems.length === 1
        ? cartItems[0].prompts?.title || '프롬프트'
        : `${cartItems[0].prompts?.title || '프롬프트'} 외 ${cartItems.length - 1}건`;

    try {
      await paymentWidget.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/success?orderId=${orderId}`,
        failUrl: `${window.location.origin}/checkout/fail`,
      });
    } catch (error) {
      console.error('Payment request error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[var(--color-bauhaus-red)] mx-auto mb-4" />
          <Text size="large" weight="semibold">
            결제 준비 중...
          </Text>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Alert variant="error" title="오류">
            {error}
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-[var(--color-accent)]" />
            <Heading level="h1">결제하기</Heading>
          </div>
        </div>

        {/* 주문 정보 */}
        <Card padding="lg" className="mb-6">
          <div className="space-y-4">
            <Heading level="h2">주문 정보</Heading>
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-[var(--color-border-tertiary)]"
                >
                  <Text>{item.prompts?.title}</Text>
                  <Text weight="semibold">{formatPrice(item.prompts?.price || 0)}원</Text>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-baseline pt-4 border-t-2 border-[var(--color-border-primary)]">
              <Heading level="h3">총 결제 금액</Heading>
              <div className="flex items-baseline gap-1">
                <Heading level="h2">{formatPrice(getTotalPrice())}</Heading>
                <Text color="tertiary">원</Text>
              </div>
            </div>
          </div>
        </Card>

        {/* 결제 위젯 */}
        <Card padding="lg" className="mb-6">
          <div id="payment-widget" />
          <div id="agreement" className="mt-6" />
        </Card>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          className="w-full px-8 py-4 bg-[var(--color-accent)] text-white border-2 border-[var(--color-border-primary)] font-bold uppercase tracking-wider hover:translate-x-[-3px] hover:translate-y-[-3px] hover:shadow-[6px_6px_0px_rgba(0,0,0,0.3)] transition-all text-center text-lg"
        >
          결제하기
        </button>
      </div>
    </div>
  );
}

