import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// 보호된 API 라우트 예제
export async function GET() {
  const { userId } = await auth();

  // 인증되지 않은 경우
  if (!userId) {
    return NextResponse.json(
      { error: '인증이 필요합니다.' },
      { status: 401 }
    );
  }

  // 인증된 사용자만 접근 가능한 데이터
  return NextResponse.json({
    message: '보호된 데이터입니다.',
    userId,
  });
}

