'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Prompt } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { Card, Button, Text, Heading, Badge, Alert } from './ui';

interface PromptDetailProps {
  prompt: Prompt;
  isPurchased: boolean;
  isInCart: boolean;
  isLoggedIn: boolean;
}

export default function PromptDetail({
  prompt,
  isPurchased,
  isInCart: initialIsInCart,
  isLoggedIn,
}: PromptDetailProps) {
  const { user, isLoaded } = useUser();
  const [isInCart, setIsInCart] = useState(initialIsInCart);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const addToCart = async () => {
    if (!isLoaded || !user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('carts')
        .insert({ user_id: user.id, prompt_id: prompt.id });

      if (error) {
        if (error.code === '23505') {
          alert('이미 장바구니에 담긴 상품입니다.');
          setIsInCart(true);
        } else {
          throw error;
        }
      } else {
        alert('장바구니에 상품을 담았습니다.');
        setIsInCart(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('장바구니 담기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const buyNow = async () => {
    if (!isLoaded || !user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      // 장바구니에 없으면 먼저 담기
      if (!isInCart) {
        await supabase
          .from('carts')
          .insert({ user_id: user.id, prompt_id: prompt.id });
      }

      // 장바구니 페이지로 이동
      router.push('/cart');
    } catch (error) {
      console.error('Error buying now:', error);
      alert('구매 진행에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const copyPromptText = () => {
    navigator.clipboard.writeText(prompt.prompt_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 좌측: 상품 정보 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 대표 이미지 */}
            <Card padding="none" className="overflow-hidden">
              <div className="relative w-full h-96 bg-[var(--color-bg-tertiary)]">
                {prompt.thumbnail_url ? (
                  <Image
                    src={prompt.thumbnail_url}
                    alt={prompt.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex gap-4">
                      <div className="w-20 h-20 bg-[var(--color-bauhaus-red)]" />
                      <div className="w-20 h-20 bg-[var(--color-bauhaus-blue)]" />
                      <div className="w-20 h-20 bg-[var(--color-bauhaus-yellow)]" />
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* 상세 설명 */}
            <Card padding="lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-[var(--color-accent)]" />
                  <Heading level="h2">상품 설명</Heading>
                </div>
                <Text color="secondary" className="whitespace-pre-line">
                  {prompt.description}
                </Text>
              </div>
            </Card>

            {/* 프롬프트 내용 */}
            <Card padding="lg">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-8 bg-[var(--color-bauhaus-blue)]" />
                  <Heading level="h2">프롬프트 내용</Heading>
                </div>

                {isPurchased ? (
                  <div className="space-y-4">
                    <Alert variant="success" title="구매 완료">
                      이 프롬프트를 구매하셨습니다. 아래 내용을 복사하여 사용하세요.
                    </Alert>
                    <div className="relative">
                      <pre className="bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)] p-6 overflow-x-auto whitespace-pre-wrap break-words">
                        <code className="text-sm">{prompt.prompt_text}</code>
                      </pre>
                      <Button
                        variant={copied ? 'success' : 'secondary'}
                        size="sm"
                        onClick={copyPromptText}
                        className="absolute top-4 right-4"
                      >
                        {copied ? '복사됨!' : '복사'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[var(--color-bg-tertiary)] border-2 border-dashed border-[var(--color-border-secondary)] p-12 text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-[var(--color-text-tertiary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <Heading level="h3">구매 후 확인 가능</Heading>
                    <Text color="tertiary" className="mt-2">
                      이 프롬프트의 내용은 구매 후에 확인하실 수 있습니다
                    </Text>
                  </div>
                )}
              </div>
            </Card>

            {/* 결과물 예시 이미지 */}
            {prompt.image_urls && prompt.image_urls.length > 0 && (
              <Card padding="lg">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-[var(--color-bauhaus-yellow)]" />
                    <Heading level="h2">결과물 예시</Heading>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {prompt.image_urls.map((url, index) => (
                      <div
                        key={index}
                        className="relative w-full h-48 bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)]"
                      >
                        <Image
                          src={url}
                          alt={`결과물 ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* 우측: 구매 정보 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card padding="lg">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Badge variant="info">{prompt.category}</Badge>
                    <Heading level="h2" className="break-words">
                      {prompt.title}
                    </Heading>
                  </div>

                  <div className="flex items-baseline gap-2 py-6 border-y-2 border-[var(--color-border-primary)]">
                    <Heading level="h1">{formatPrice(prompt.price)}</Heading>
                    <Text size="large" color="tertiary">
                      원
                    </Text>
                  </div>

                  {!isPurchased && (
                    <div className="space-y-3">
                      <Button
                        variant="primary"
                        size="lg"
                        fullWidth
                        onClick={buyNow}
                        disabled={loading}
                        loading={loading}
                      >
                        바로 구매하기
                      </Button>
                      <Button
                        variant="secondary"
                        size="lg"
                        fullWidth
                        onClick={addToCart}
                        disabled={isInCart || loading}
                        loading={loading}
                      >
                        {isInCart ? '장바구니에 담김' : '장바구니 담기'}
                      </Button>
                    </div>
                  )}

                  <div className="pt-6 border-t-2 border-[var(--color-border-tertiary)] space-y-3">
                    <div className="flex justify-between">
                      <Text color="tertiary">카테고리</Text>
                      <Text weight="semibold">{prompt.category}</Text>
                    </div>
                    <div className="flex justify-between">
                      <Text color="tertiary">등록일</Text>
                      <Text weight="semibold">
                        {new Date(prompt.created_at).toLocaleDateString('ko-KR')}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

