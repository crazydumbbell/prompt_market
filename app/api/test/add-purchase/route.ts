import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/test/add-purchase
 * 현재 로그인한 사용자에게 테스트 구매 데이터를 추가합니다.
 * 개발/테스트 용도로만 사용하세요.
 */
export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    // 랜덤으로 3개의 프롬프트를 선택
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select('*')
      .eq('is_active', true)
      .limit(3);

    if (promptsError || !prompts || prompts.length === 0) {
      console.error('Error fetching prompts:', promptsError);
      return NextResponse.json(
        { error: 'No prompts available' },
        { status: 404 }
      );
    }

    // 이미 구매한 프롬프트는 제외
    const { data: existingPurchases } = await supabase
      .from('purchases')
      .select('prompt_id')
      .eq('buyer_id', userId);

    const existingPromptIds = existingPurchases?.map(p => p.prompt_id) || [];
    const availablePrompts = prompts.filter(
      p => !existingPromptIds.includes(p.id)
    );

    if (availablePrompts.length === 0) {
      return NextResponse.json(
        { message: 'All prompts already purchased' },
        { status: 200 }
      );
    }

    // 구매 데이터 생성
    const purchases = availablePrompts.map(prompt => ({
      buyer_id: userId,
      prompt_id: prompt.id,
      payment_order_id: `TEST_ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      payment_amount: prompt.price,
      payment_status: 'completed',
    }));

    const { data: insertedPurchases, error: insertError } = await supabase
      .from('purchases')
      .insert(purchases)
      .select(`
        *,
        prompts (
          id,
          title,
          description,
          price,
          category,
          thumbnail_url
        )
      `);

    if (insertError) {
      console.error('Error inserting purchases:', insertError);
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${insertedPurchases?.length || 0}개의 테스트 구매 데이터가 추가되었습니다.`,
      purchases: insertedPurchases,
    });
  } catch (error) {
    console.error('Error in POST /api/test/add-purchase:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

