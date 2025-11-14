import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import MyPageContent from '../components/MyPageContent';

export default async function MyPage() {
  // Clerk 인증 확인
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // Admin 클라이언트 사용 (RLS 우회)
  const supabase = createAdminClient();

  console.log('🔍 [MyPage] 현재 사용자 ID:', userId);

  // 구매 내역 가져오기 (Clerk userId 사용)
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select(
      `
      id,
      created_at,
      payment_order_id,
      payment_amount,
      payment_status,
      prompts (
        id,
        title,
        description,
        price,
        prompt_text,
        thumbnail_url,
        category
      )
    `
    )
    .eq('buyer_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('🔴 [MyPage] 구매 내역 조회 실패:', error);
  } else {
    console.log('🟢 [MyPage] 구매 내역 조회 성공:', purchases?.length || 0, '개');
  }

  return <MyPageContent purchases={purchases || []} />;
}

