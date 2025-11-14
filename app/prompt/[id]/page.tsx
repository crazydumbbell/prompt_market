import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import PromptDetail from '@/app/components/PromptDetail';

interface PromptPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Supabase에서 프롬프트 찾기
  const { data: prompt } = await supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  // 없으면 404
  if (!prompt) {
    notFound();
  }

  // Clerk 인증 확인
  const { userId } = await auth();

  let isPurchased = false;
  let isInCart = false;

  if (userId) {
    // 구매 여부 확인
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', userId)
      .eq('prompt_id', id)
      .single();

    isPurchased = !!purchase;

    // 장바구니 여부 확인
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', id)
      .single();

    isInCart = !!cart;
  }

  return (
    <PromptDetail
      prompt={prompt}
      isPurchased={isPurchased}
      isInCart={isInCart}
      isLoggedIn={!!userId}
    />
  );
}

