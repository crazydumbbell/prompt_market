import { clerkMiddleware } from '@clerk/nextjs/server';
import { type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export default clerkMiddleware(async (auth, request: NextRequest) => {
  // Clerk 인증 처리 후 Supabase 세션 업데이트
  return await updateSession(request);
});

export const config = {
  matcher: [
    // Clerk 권장 matcher: Next.js 내부 파일과 정적 파일 제외
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // API 라우트는 항상 실행
    '/(api|trpc)(.*)',
  ],
};

