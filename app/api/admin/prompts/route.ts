import { auth } from '@clerk/nextjs/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/prompts
 * 모든 프롬프트 조회 (관리자 전용)
 */
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: admin 권한 체크 (Clerk metadata 사용)
    // const user = await clerkClient.users.getUser(userId);
    // if (user.publicMetadata.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const supabase = createAdminClient();

    const { data: prompts, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ prompts });
  } catch (error) {
    console.error('Error in GET /api/admin/prompts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/prompts
 * 새 프롬프트 생성 (관리자 전용)
 */
export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: admin 권한 체크
    // const user = await clerkClient.users.getUser(userId);
    // if (user.publicMetadata.role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await request.json();
    const { title, description, price, prompt_text, category, thumbnail_url, image_urls } = body;

    // 필수 필드 검증
    if (!title || !description || price === undefined || !prompt_text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .insert({
        title,
        description,
        price,
        prompt_text,
        category: category || 'general',
        thumbnail_url: thumbnail_url || null,
        image_urls: image_urls || [],
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prompt:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ prompt }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/admin/prompts:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

