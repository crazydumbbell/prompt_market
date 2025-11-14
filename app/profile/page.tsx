import { auth, currentUser } from '@clerk/nextjs/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileContent from '../components/ProfileContent';

export default async function ProfilePage() {
  // Clerk 인증 확인
  const { userId } = await auth();

  if (!userId) {
    redirect('/');
  }

  const supabase = await createClient();
  const user = await currentUser();

  // 프로필 정보 가져오기 (Clerk ID 사용)
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  return (
    <ProfileContent
      profile={profile}
      userEmail={user?.emailAddresses[0]?.emailAddress || ''}
    />
  );
}

