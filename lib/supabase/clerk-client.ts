import { createClient } from '@supabase/supabase-js';

/**
 * Clerk 세션 토큰을 Supabase에 주입하는 클라이언트 생성 (클라이언트 컴포넌트용)
 * 
 * 공식 Clerk 문서 권장 패턴:
 * https://clerk.com/docs/guides/development/integrations/databases/supabase
 * 
 * @param getToken - Clerk session의 getToken() 함수
 * @returns Clerk 토큰이 주입된 Supabase 클라이언트
 * 
 * @example
 * ```tsx
 * 'use client'
 * import { useSession } from '@clerk/nextjs'
 * import { createClerkSupabaseClient } from '@/lib/supabase/clerk-client'
 * 
 * export default function MyComponent() {
 *   const { session } = useSession()
 *   const client = createClerkSupabaseClient(session?.getToken)
 *   
 *   // Clerk 인증된 사용자만 접근 가능한 쿼리
 *   const { data } = await client.from('tasks').select()
 * }
 * ```
 */
export function createClerkSupabaseClient(
  getToken: (() => Promise<string | null>) | undefined
) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        // Clerk 토큰을 Authorization 헤더에 주입
        fetch: async (url, options = {}) => {
          const token = getToken ? await getToken() : null;
          
          return fetch(url, {
            ...options,
            headers: {
              ...options.headers,
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
          });
        },
      },
    }
  );
}

