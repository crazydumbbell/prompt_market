import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    console.log('🟢 [API] 결제 승인 요청 받음');
    
    // Clerk 인증 확인
    const { userId } = await auth();
    console.log('🟢 [API] 사용자 ID:', userId);
    
    if (!userId) {
      console.error('🔴 [API] 인증 실패: userId 없음');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 요청 데이터 파싱
    const { paymentKey, orderId, amount } = await request.json();
    console.log('🟢 [API] 요청 데이터:', { paymentKey, orderId, amount });

    if (!paymentKey || !orderId || !amount) {
      console.error('🔴 [API] 필수 필드 누락');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Toss Payments API로 결제 승인 요청
    const secretKey = process.env.TOSS_SECRET_KEY;
    console.log('🟢 [API] Secret Key 존재:', !!secretKey);
    
    if (!secretKey) {
      console.error('🔴 [API] TOSS_SECRET_KEY 환경 변수가 설정되지 않음');
      return NextResponse.json(
        { error: 'Server configuration error: TOSS_SECRET_KEY not set' },
        { status: 500 }
      );
    }

    console.log('🟢 [API] Toss Payments API 호출 시작');
    const tossResponse = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    console.log('🟢 [API] Toss API 응답 상태:', tossResponse.status);
    const tossData = await tossResponse.json();
    console.log('🟢 [API] Toss API 응답 데이터:', JSON.stringify(tossData, null, 2));

    if (!tossResponse.ok) {
      console.error('🔴 [API] Toss 결제 승인 실패:', {
        status: tossResponse.status,
        data: tossData
      });
      return NextResponse.json(
        { 
          error: 'Payment confirmation failed', 
          details: tossData,
          message: tossData.message || '토스페이먼츠 승인 실패'
        },
        { status: tossResponse.status }
      );
    }

    console.log('🟢 [API] Toss 결제 승인 성공!');

    // Supabase에 구매 기록 저장
    // 장바구니는 클라이언트(localStorage)에 있으므로, 
    // 결제 완료된 프롬프트 ID들을 클라이언트에서 받아야 합니다.
    // 결제 성공 페이지에서 처리하도록 변경
    
    return NextResponse.json({
      success: true,
      payment: tossData,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
