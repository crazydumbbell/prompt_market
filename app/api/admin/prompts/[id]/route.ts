import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/admin/prompts/[id]
 * 특정 프롬프트 조회 (관리자 전용)
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = await createClient();

    const { data: prompt, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching prompt:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error in GET /api/admin/prompts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/prompts/[id]
 * 프롬프트 수정 (관리자 전용)
 */
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { title, description, price, prompt_text, category, thumbnail_url, image_urls, is_active } = body;

    const supabase = await createClient();

    // 업데이트할 필드만 포함
    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = price;
    if (prompt_text !== undefined) updateData.prompt_text = prompt_text;
    if (category !== undefined) updateData.category = category;
    if (thumbnail_url !== undefined) updateData.thumbnail_url = thumbnail_url;
    if (image_urls !== undefined) updateData.image_urls = image_urls;
    if (is_active !== undefined) updateData.is_active = is_active;

    const { data: prompt, error } = await supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating prompt:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ prompt });
  } catch (error) {
    console.error('Error in PUT /api/admin/prompts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/prompts/[id]
 * 프롬프트 삭제 (관리자 전용)
 */
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const supabase = await createClient();

    // soft delete: is_active를 false로 설정
    const { data: prompt, error } = await supabase
      .from('prompts')
      .update({ is_active: false })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error deleting prompt:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Prompt deleted successfully', prompt });
  } catch (error) {
    console.error('Error in DELETE /api/admin/prompts/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

