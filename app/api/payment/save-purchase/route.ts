import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/payment/save-purchase
 * 결제 완료 후 구매 내역을 Supabase에 저장
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promptIds, orderId, totalAmount } = await request.json();

    if (!promptIds || !Array.isArray(promptIds) || promptIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing promptIds' },
        { status: 400 }
      );
    }

    if (!orderId || !totalAmount) {
      return NextResponse.json(
        { error: 'Missing orderId or totalAmount' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 프롬프트 정보 가져오기
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('id, price')
      .in('id', promptIds);

    if (promptsError) {
      console.error('Error fetching prompts:', promptsError);
      return NextResponse.json(
        { error: promptsError.message },
        { status: 500 }
      );
    }

    if (!prompts || prompts.length === 0) {
      return NextResponse.json(
        { error: 'No prompts found' },
        { status: 404 }
      );
    }

    // 구매 내역 생성
    const purchases = prompts.map(prompt => ({
      buyer_id: userId,
      prompt_id: prompt.id,
      payment_order_id: orderId,
      payment_amount: prompt.price,
      payment_status: 'completed',
    }));

    // Supabase에 저장
    const { error: insertError } = await supabase
      .from('purchases')
      .insert(purchases);

    if (insertError) {
      console.error('Error saving purchases:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${purchases.length}개의 구매 내역이 저장되었습니다.`,
    });
  } catch (error) {
    console.error('Error in POST /api/payment/save-purchase:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

