'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Heading, Text, Alert } from '../../components/ui';

function FailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorMessage = () => {
    if (errorMessage) return errorMessage;
    
    switch (errorCode) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제가 중단되었습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 승인을 거부했습니다.';
      default:
        return '결제 중 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center py-12">
      <div className="max-w-md mx-auto px-4">
        <Card padding="lg" className="text-center">
          {/* 실패 아이콘 */}
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

          <Heading level="h1" className="mb-4">결제에 실패했습니다</Heading>
          
          <Alert variant="error" className="mb-6">
            {getErrorMessage()}
          </Alert>

          <Text color="tertiary" className="mb-8">
            결제 중 문제가 발생했습니다. 다시 시도해주세요.
          </Text>

          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => router.push('/cart')}>
              장바구니로 돌아가기
            </Button>
            <Link href="/" className="block">
              <Button variant="ghost" size="md" fullWidth>
                홈으로 이동
              </Button>
            </Link>
          </div>

          {/* 에러 정보 */}
          {errorCode && (
            <div className="mt-8 pt-8 border-t-2 border-[var(--color-border-tertiary)] text-left">
              <Heading level="h4" className="mb-4">에러 정보</Heading>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text color="tertiary" size="small">에러 코드</Text>
                  <Text size="small" weight="semibold">{errorCode}</Text>
                </div>
              </div>
            </div>
          )}

          {/* 고객 지원 */}
          <div className="mt-6 p-4 bg-[var(--color-bg-tertiary)] border border-[var(--color-border-tertiary)]">
            <Text size="small" color="secondary">
              문제가 지속되면 고객 지원팀에 문의해주세요.
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text size="large">로딩 중...</Text>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
