'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Purchase } from '@/types/database.types';
import { Card, Button, Text, Heading, Badge, Modal } from './ui';

interface MyPageContentProps {
  purchases: Purchase[];
}

export default function MyPageContent({ purchases }: MyPageContentProps) {
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAddingTestData, setIsAddingTestData] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleViewPrompt = (purchase: Purchase) => {
    setSelectedPurchase(purchase);
    setIsModalOpen(true);
    setCopied(false);
  };

  const copyPromptText = () => {
    if (selectedPurchase?.prompts?.prompt_text) {
      navigator.clipboard.writeText(selectedPurchase.prompts.prompt_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const addTestPurchaseData = async () => {
    setIsAddingTestData(true);
    try {
      const response = await fetch('/api/test/add-purchase', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || '테스트 구매 데이터가 추가되었습니다.');
        window.location.reload();
      } else {
        alert(data.error || '데이터 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error adding test data:', error);
      alert('데이터 추가 중 오류가 발생했습니다.');
    } finally {
      setIsAddingTestData(false);
    }
  };

  if (purchases.length === 0) {
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <Heading level="h2">구매 내역이 없습니다</Heading>
          <Text color="tertiary" className="mt-4 mb-8">
            마음에 드는 프롬프트를 구매해보세요
          </Text>
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button variant="primary" size="lg" fullWidth>
                프롬프트 둘러보기
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={addTestPurchaseData}
              loading={isAddingTestData}
              fullWidth
            >
              테스트 구매 데이터 추가
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-2 h-12 bg-[var(--color-accent)]" />
                <Heading level="h1">구매 내역</Heading>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="info" size="lg">
                  총 {purchases.length}개
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={addTestPurchaseData}
                  loading={isAddingTestData}
                >
                  테스트 데이터 추가
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {purchases.map((purchase) => (
              <Card key={purchase.id} padding="md" hover>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* 상품 이미지 */}
                  <div className="relative w-full sm:w-40 h-40 flex-shrink-0 bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)]">
                    {purchase.prompts?.thumbnail_url ? (
                      <Image
                        src={purchase.prompts.thumbnail_url}
                        alt={purchase.prompts.title || '프롬프트'}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-[var(--color-bauhaus-red)]" />
                          <div className="w-8 h-8 bg-[var(--color-bauhaus-blue)]" />
                          <div className="w-8 h-8 bg-[var(--color-bauhaus-yellow)]" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge variant="success">구매완료</Badge>
                    </div>
                  </div>

                  {/* 상품 정보 */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="default">{purchase.prompts?.category}</Badge>
                        <Text size="small" color="tertiary">
                          {formatDate(purchase.created_at)}
                        </Text>
                      </div>
                      <Heading level="h3" className="line-clamp-1">
                        {purchase.prompts?.title}
                      </Heading>
                      <Text color="tertiary" size="small" className="line-clamp-2">
                        {purchase.prompts?.description}
                      </Text>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t-2 border-[var(--color-border-tertiary)]">
                      <div className="space-y-1">
                        <Text size="small" color="tertiary">
                          주문번호: {purchase.payment_order_id}
                        </Text>
                        <div className="flex items-baseline gap-1">
                          <Text size="large" weight="bold">
                            {formatPrice(purchase.payment_amount || purchase.prompts?.price || 0)}
                          </Text>
                          <Text size="small" color="tertiary">
                            원
                          </Text>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/prompt/${purchase.prompts?.id}`}>
                          <Button variant="ghost" size="sm">
                            상세보기
                          </Button>
                        </Link>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleViewPrompt(purchase)}
                        >
                          프롬프트 보기
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* 프롬프트 상세 모달 */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedPurchase?.prompts?.title || '프롬프트'}
        size="lg"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Text weight="semibold">프롬프트 내용</Text>
            <div className="relative">
              <pre className="bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-primary)] p-6 overflow-x-auto whitespace-pre-wrap break-words max-h-96">
                <code className="text-sm">{selectedPurchase?.prompts?.prompt_text}</code>
              </pre>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant={copied ? 'success' : 'primary'}
              size="md"
              onClick={copyPromptText}
              fullWidth
            >
              {copied ? '복사됨!' : '복사하기'}
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={() => setIsModalOpen(false)}
              fullWidth
            >
              닫기
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

