'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Prompt } from '@/types/database.types';
import { Card, Button, Text, Heading } from './ui';
import { getCart, removeFromCart as removeFromCartLocal } from '@/lib/cart';
import { createClient } from '@/lib/supabase/client';

interface CartItem {
  promptId: string;
  prompt: Prompt | null;
}

export default function CartContent() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // 장바구니 로드
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
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

  const handleRemoveFromCart = (promptId: string) => {
    setRemovingId(promptId);
    try {
      const success = removeFromCartLocal(promptId);
      
      if (success) {
        setCartItems(cartItems.filter((item) => item.promptId !== promptId));
      } else {
        alert('장바구니에서 삭제하는데 실패했습니다.');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('장바구니에서 삭제하는데 실패했습니다.');
    } finally {
      setRemovingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      return sum + (item.prompt?.price || 0);
    }, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }

    setCheckoutLoading(true);
    try {
      // 토스페이먼츠 결제 페이지로 이동
      router.push('/checkout');
    } catch (error) {
      console.error('Error initiating checkout:', error);
      alert('결제 진행에 실패했습니다.');
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text>로딩 중...</Text>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-32 h-32 bg-[var(--color-bg-tertiary)] mx-auto mb-8 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-[var(--color-text-tertiary)]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <Heading level="h2">장바구니가 비어있습니다</Heading>
          <Text color="tertiary" className="mt-4 mb-8">
            마음에 드는 프롬프트를 담아보세요
          </Text>
          <Link href="/">
            <Button variant="primary" size="lg">
              프롬프트 둘러보기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-[var(--color-accent)]" />
            <Heading level="h1">장바구니</Heading>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 장바구니 아이템 목록 */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.promptId} padding="md" hover>
                <div className="flex gap-4">
                  {/* 상품 이미지 */}
                  <div className="relative w-32 h-32 flex-shrink-0 bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)]">
                    {item.prompt?.thumbnail_url ? (
                      <Image
                        src={item.prompt.thumbnail_url}
                        alt={item.prompt.title || '프롬프트'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex gap-1">
                          <div className="w-6 h-6 bg-[var(--color-bauhaus-red)]" />
                          <div className="w-6 h-6 bg-[var(--color-bauhaus-blue)]" />
                          <div className="w-6 h-6 bg-[var(--color-bauhaus-yellow)]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="space-y-2">
                      <Link
                        href={`/prompt/${item.promptId}`}
                        className="hover:text-[var(--color-accent)] transition-colors"
                      >
                        <Heading level="h3" className="line-clamp-1">
                          {item.prompt?.title}
                        </Heading>
                      </Link>
                      <Text color="tertiary" size="small" className="line-clamp-2">
                        {item.prompt?.description}
                      </Text>
                      <div className="flex items-baseline gap-1">
                        <Text size="large" weight="bold">
                          {formatPrice(item.prompt?.price || 0)}
                        </Text>
                        <Text size="small" color="tertiary">
                          원
                        </Text>
                      </div>
                    </div>
                  </div>

                  {/* 삭제 버튼 */}
                  <div className="flex-shrink-0">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.promptId)}
                      loading={removingId === item.promptId}
                      disabled={removingId === item.promptId}
                    >
                      삭제
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* 우측: 결제 정보 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card padding="lg">
                <div className="space-y-6">
                  <Heading level="h2">결제 정보</Heading>

                  <div className="space-y-3 py-6 border-y-2 border-[var(--color-border-primary)]">
                    <div className="flex justify-between">
                      <Text color="tertiary">상품 개수</Text>
                      <Text weight="semibold">{cartItems.length}개</Text>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <Text color="tertiary">총 주문금액</Text>
                      <div className="flex items-baseline gap-1">
                        <Heading level="h3">{formatPrice(getTotalPrice())}</Heading>
                        <Text color="tertiary">원</Text>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                    loading={checkoutLoading}
                  >
                    결제하기
                  </Button>

                  <Link href="/">
                    <Button variant="ghost" size="md" fullWidth>
                      쇼핑 계속하기
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

