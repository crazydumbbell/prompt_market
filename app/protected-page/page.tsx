import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Heading, Text, Card } from '@/app/components/ui';

// 서버 컴포넌트에서 인증 확인 예제
export default async function ProtectedPage() {
  // 방법 1: auth() - userId만 필요한 경우
  const { userId } = await auth();

  if (!userId) {
    redirect('/'); // 로그인 페이지로 리다이렉트
  }

  // 방법 2: currentUser() - 전체 사용자 정보가 필요한 경우
  const user = await currentUser();

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-16 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Heading level="h1">보호된 페이지</Heading>

        <Card padding="lg">
          <div className="space-y-4">
            <Text size="large" weight="bold">
              인증된 사용자만 이 페이지를 볼 수 있습니다.
            </Text>

            <div className="space-y-2">
              <Text color="secondary">User ID: {userId}</Text>
              {user && (
                <>
                  <Text color="secondary">
                    이메일: {user.emailAddresses[0]?.emailAddress}
                  </Text>
                  <Text color="secondary">
                    이름: {user.firstName} {user.lastName}
                  </Text>
                </>
              )}
            </div>
          </div>
        </Card>

        <Card padding="md">
          <Heading level="h3">Clerk 인증 사용법</Heading>
          <div className="mt-4 space-y-2">
            <Text color="secondary">
              • 서버 컴포넌트: auth(), currentUser() 사용
            </Text>
            <Text color="secondary">
              • 클라이언트 컴포넌트: useUser(), useAuth() 훅 사용
            </Text>
            <Text color="secondary">
              • API 라우트: auth() 사용하여 보호
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
}

