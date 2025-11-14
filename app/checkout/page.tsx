'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { Card, Button, Heading, Text } from '../components/ui';
import { Prompt } from '@/types/database.types';
import { getCart } from '@/lib/cart';

interface CartItem {
  promptId: string;
  prompt: Prompt | null;
}

export default function CheckoutPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const supabase = createClient();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.push('/');
      return;
    }

    loadCartItems();
  }, [isLoaded, user]);

  const loadCartItems = async () => {
    try {
      // localStorage에서 장바구니 가져오기
      const cart = getCart();
      
      if (cart.length === 0) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      // Supabase에서 프롬프트 정보 가져오기
      const promptIds = cart.map(item => item.promptId);
      const { data: prompts, error } = await supabase
        .from('prompts')
        .select('*')
        .in('id', promptIds);

      if (error) {
        console.error('Error fetching prompts:', error);
        setCartItems([]);
      } else {
        const items = cart.map(cartItem => ({
          promptId: cartItem.promptId,
          prompt: prompts?.find(p => p.id === cartItem.promptId) || null,
        }));
        setCartItems(items.filter(item => item.prompt !== null));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + (item.prompt?.price || 0), 0);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    setPaying(true);
    try {
      // 결제 정보 생성
      const orderId = `ORDER_${Date.now()}`;
      const orderName = cartItems.length === 1 
        ? cartItems[0].prompt?.title || '프롬프트' 
        : `${cartItems[0].prompt?.title} 외 ${cartItems.length - 1}건`;
      const totalAmount = getTotalPrice();

      // Toss Payments 초기화
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!;
      const customerKey = user?.id || 'GUEST';
      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey });

      // 결제창 호출
      await payment.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: totalAmount,
        },
        orderId: orderId,
        orderName: orderName,
        customerName: user?.fullName || user?.firstName || '고객',
        customerEmail: user?.emailAddresses[0]?.emailAddress,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('결제 진행 중 오류가 발생했습니다.');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text size="large">로딩 중...</Text>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Card padding="lg" className="max-w-md mx-auto text-center">
          <Heading level="h2" className="mb-4">장바구니가 비어있습니다</Heading>
          <Text color="tertiary" className="mb-6">결제할 상품이 없습니다.</Text>
          <Button onClick={() => router.push('/')}>홈으로 이동</Button>
        </Card>
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

        <div className="space-y-6">
          {/* 주문 상품 */}
          <Card padding="lg">
            <Heading level="h2" className="mb-4">주문 상품</Heading>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.promptId} className="flex justify-between items-center py-3 border-b border-[var(--color-border-tertiary)] last:border-0">
                  <div className="flex-1">
                    <Text weight="semibold">{item.prompt?.title}</Text>
                    <Text size="small" color="tertiary">{item.prompt?.category}</Text>
                  </div>
                  <Text weight="bold">{formatPrice(item.prompt?.price || 0)}원</Text>
                </div>
              ))}
            </div>
          </Card>

          {/* 결제 금액 */}
          <Card padding="lg">
            <Heading level="h2" className="mb-4">결제 금액</Heading>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Text color="tertiary">상품 금액</Text>
                <Text weight="semibold">{formatPrice(getTotalPrice())}원</Text>
              </div>
              <div className="flex justify-between items-center pt-4 border-t-2 border-[var(--color-border-primary)]">
                <Heading level="h3">최종 결제 금액</Heading>
                <Heading level="h2" className="text-[var(--color-accent)]">
                  {formatPrice(getTotalPrice())}원
                </Heading>
              </div>
            </div>
          </Card>

          {/* 결제 수단 */}
          <Card padding="lg">
            <Heading level="h2" className="mb-4">결제 수단</Heading>
            <Text color="secondary">토스페이먼츠 - 카드 결제</Text>
          </Card>

          {/* 결제 버튼 */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              onClick={() => router.push('/cart')}
              disabled={paying}
            >
              이전으로
            </Button>
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handlePayment}
              disabled={paying}
              loading={paying}
            >
              {paying ? '결제 진행 중...' : `${formatPrice(getTotalPrice())}원 결제하기`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
