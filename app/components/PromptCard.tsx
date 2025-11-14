'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';
import { Prompt } from '@/types/database.types';
import { Card, Button, Text, Heading, Badge } from './ui';
import { addToCart as addToCartLocal, isInCart as checkIsInCart } from '@/lib/cart';

interface PromptCardProps {
  prompt: Prompt;
}

export default function PromptCard({ prompt }: PromptCardProps) {
  const { user, isLoaded } = useUser();
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // 컴포넌트 마운트 시 장바구니 상태 확인
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsInCart(checkIsInCart(prompt.id));
    }
  }, [prompt.id]);

  const handleAddToCart = () => {
    if (!isLoaded || !user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const success = addToCartLocal(prompt.id);
      
      if (success) {
        alert('장바구니에 상품을 담았습니다.');
        setIsInCart(true);
      } else {
        alert('이미 장바구니에 담긴 상품입니다.');
        setIsInCart(true);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('장바구니 담기에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  return (
    <Card padding="none" hover className="overflow-hidden">
      {/* 이미지 */}
      <div className="relative w-full h-48 bg-[var(--color-bg-tertiary)]">
        {prompt.thumbnail_url ? (
          <Image
            src={prompt.thumbnail_url}
            alt={prompt.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex gap-2">
              <div className="w-12 h-12 bg-[var(--color-bauhaus-red)]" />
              <div className="w-12 h-12 bg-[var(--color-bauhaus-blue)]" />
              <div className="w-12 h-12 bg-[var(--color-bauhaus-yellow)]" />
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge variant="default">{prompt.category}</Badge>
        </div>
      </div>

      {/* 내용 */}
      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <Heading level="h3" className="line-clamp-1">
            {prompt.title}
          </Heading>
          <Text color="tertiary" size="small" className="line-clamp-2">
            {prompt.description}
          </Text>
        </div>

        {/* 가격 */}
        <div className="flex items-baseline gap-1">
          <Text size="large" weight="bold" color="primary">
            {formatPrice(prompt.price)}
          </Text>
          <Text size="small" color="tertiary">
            원
          </Text>
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <Link href={`/prompt/${prompt.id}`} className="flex-1">
            <Button variant="secondary" size="md" fullWidth>
              상세보기
            </Button>
          </Link>
          <Button
            variant="primary"
            size="md"
            onClick={handleAddToCart}
            disabled={isInCart || loading}
            loading={loading}
            className="flex-1"
          >
            {isInCart ? '담김' : '담기'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

