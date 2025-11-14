// 환경 변수 체크 스크립트
require('dotenv').config({ path: '.env.local' });

console.log('\n🔍 환경 변수 체크\n');
console.log('='.repeat(60));

const requiredEnvVars = {
  // Clerk
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY': process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  'CLERK_SECRET_KEY': process.env.CLERK_SECRET_KEY,
  
  // Supabase
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'NEXT_PUBLIC_SUPABASE_ANON_KEY': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  
  // Toss Payments
  'NEXT_PUBLIC_TOSS_CLIENT_KEY': process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY,
  'TOSS_SECRET_KEY': process.env.TOSS_SECRET_KEY,
};

let hasError = false;

Object.entries(requiredEnvVars).forEach(([key, value]) => {
  const isSet = !!value;
  const status = isSet ? '✅' : '❌';
  const displayValue = isSet ? value.substring(0, 20) + '...' : '(설정 안됨)';
  
  console.log(`${status} ${key}: ${displayValue}`);
  
  if (!isSet) {
    hasError = true;
  }
});

console.log('='.repeat(60));

if (hasError) {
  console.log('\n❌ 일부 환경 변수가 설정되지 않았습니다.');
  console.log('\n📝 해결 방법:');
  console.log('1. 프로젝트 루트에 .env.local 파일 생성');
  console.log('2. 위의 누락된 환경 변수들을 추가');
  console.log('3. 개발 서버 재시작 (Ctrl+C 후 pnpm dev)\n');
  process.exit(1);
} else {
  console.log('\n✅ 모든 환경 변수가 올바르게 설정되었습니다!\n');
  process.exit(0);
}

