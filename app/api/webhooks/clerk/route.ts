import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Supabase Admin 클라이언트 (Service Role Key 사용)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  // Clerk Webhook Secret 가져오기
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error(
      'CLERK_WEBHOOK_SECRET이 환경 변수에 설정되지 않았습니다.'
    );
  }

  // Webhook 헤더 가져오기
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // 헤더가 없으면 에러
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Request body 가져오기
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Webhook 인스턴스 생성
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Webhook 서명 검증
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Webhook 서명 검증 실패:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // 이벤트 타입과 데이터 추출
  const { id } = evt.data;
  const eventType = evt.type;

  console.log(`Webhook 이벤트 수신: ${eventType}`, evt.data);

  // 이벤트 타입별 처리
  try {
    switch (eventType) {
      case 'user.created': {
        const { email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        if (!email) {
          console.error('이메일이 없습니다:', evt.data);
          return new Response('Email not found', { status: 400 });
        }

        // Supabase profiles 테이블에 사용자 생성
        const { data, error } = await supabaseAdmin.from('profiles').insert({
          clerk_id: id,
          email,
          nickname: first_name
            ? `${first_name}${last_name ? ' ' + last_name : ''}`
            : email.split('@')[0], // 이름이 없으면 이메일 앞부분 사용
          avatar_url: image_url || null,
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error('프로필 생성 실패:', error);
          return new Response(`Profile creation failed: ${error.message}`, {
            status: 500,
          });
        }

        console.log('프로필 생성 성공:', data);
        break;
      }

      case 'user.updated': {
        const { email_addresses, first_name, last_name, image_url } = evt.data;
        const email = email_addresses?.[0]?.email_address;

        // Supabase profiles 테이블 업데이트
        const { error } = await supabaseAdmin
          .from('profiles')
          .update({
            email,
            nickname: first_name
              ? `${first_name}${last_name ? ' ' + last_name : ''}`
              : undefined,
            avatar_url: image_url || undefined,
          })
          .eq('clerk_id', id);

        if (error) {
          console.error('프로필 업데이트 실패:', error);
          return new Response(`Profile update failed: ${error.message}`, {
            status: 500,
          });
        }

        console.log('프로필 업데이트 성공');
        break;
      }

      case 'user.deleted': {
        // Supabase profiles 테이블에서 사용자 삭제 (또는 비활성화)
        const { error } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('clerk_id', id);

        if (error) {
          console.error('프로필 삭제 실패:', error);
          return new Response(`Profile deletion failed: ${error.message}`, {
            status: 500,
          });
        }

        console.log('프로필 삭제 성공');
        break;
      }

      default:
        console.log(`처리되지 않은 이벤트 타입: ${eventType}`);
    }
  } catch (error) {
    console.error('Webhook 처리 중 오류:', error);
    return new Response('Internal server error', { status: 500 });
  }

  return new Response('Webhook processed successfully', { status: 200 });
}

