import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CartContent from '../components/CartContent';

export default async function CartPage() {
  // Clerk 인증 확인
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  // 장바구니는 클라이언트 사이드에서 localStorage로 관리
  return <CartContent />;
}

