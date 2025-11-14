import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/cart
 * 장바구니에 프롬프트 추가
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json(
        { error: 'Missing promptId' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // 이미 구매했는지 확인
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('buyer_id', userId)
      .eq('prompt_id', promptId)
      .single();

    if (purchase) {
      return NextResponse.json(
        { error: 'Already purchased', message: '이미 구매한 상품입니다.' },
        { status: 400 }
      );
    }

    // 장바구니에 이미 있는지 확인
    const { data: existingCart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .eq('prompt_id', promptId)
      .single();

    if (existingCart) {
      return NextResponse.json(
        { error: 'Already in cart', message: '이미 장바구니에 담긴 상품입니다.' },
        { status: 400 }
      );
    }

    // 장바구니에 추가
    const { error } = await supabase
      .from('carts')
      .insert({ user_id: userId, prompt_id: promptId });

    if (error) {
      console.error('Error adding to cart:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '장바구니에 상품을 담았습니다.',
    });
  } catch (error) {
    console.error('Error in POST /api/cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cart
 * 장바구니 목록 조회
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: carts, error } = await supabase
      .from('carts')
      .select(`
        id,
        created_at,
        prompt_id,
        prompts (
          id,
          title,
          description,
          price,
          category,
          thumbnail_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cart:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ carts: carts || [] });
  } catch (error) {
    console.error('Error in GET /api/cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * 장바구니에서 제거
 */
export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { promptId } = await request.json();

    if (!promptId) {
      return NextResponse.json(
        { error: 'Missing promptId' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from('carts')
      .delete()
      .eq('user_id', userId)
      .eq('prompt_id', promptId);

    if (error) {
      console.error('Error removing from cart:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '장바구니에서 제거되었습니다.',
    });
  } catch (error) {
    console.error('Error in DELETE /api/cart:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

