'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useUser, UserButton, SignInButton } from '@clerk/nextjs';
import { createClient } from '@/lib/supabase/client';
import { Profile } from '@/types/database.types';
import { Avatar, Badge, Button } from './ui';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const { user, isLoaded } = useUser(); // Clerk 사용자 정보
  const [profile, setProfile] = useState<Profile | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    // Clerk 사용자가 로드되었을 때만 실행
    if (!isLoaded) return;

    const updateCartCount = async () => {
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      // Supabase 장바구니 개수
      const { count: supabaseCount } = await supabase
        .from('carts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // localStorage 더미 장바구니 개수
      const dummyCart = JSON.parse(localStorage.getItem('dummyCart') || '[]');
      const dummyCount = dummyCart.length;

      setCartCount((supabaseCount || 0) + dummyCount);
    };

    const loadUserData = async () => {
      if (user?.id) {
        // Clerk ID를 사용하여 프로필 정보 가져오기
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('clerk_id', user.id) // clerk_id 필드 사용
          .single();
        setProfile(profileData);

        // 초기 장바구니 개수
        await updateCartCount();

        // 장바구니 실시간 업데이트
        const cartChannel = supabase
          .channel('cart-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'carts',
              filter: `user_id=eq.${user.id}`,
            },
            updateCartCount
          )
          .subscribe();

        // localStorage 변경 감지 (다른 탭에서의 변경)
        const handleStorageChange = (e: StorageEvent) => {
          if (e.key === 'dummyCart') {
            updateCartCount();
          }
        };
        window.addEventListener('storage', handleStorageChange);

        // 주기적으로 업데이트 (같은 탭에서의 localStorage 변경 감지)
        const interval = setInterval(updateCartCount, 1000);

        return () => {
          cartChannel.unsubscribe();
          window.removeEventListener('storage', handleStorageChange);
          clearInterval(interval);
        };
      } else {
        setProfile(null);
        setCartCount(0);
      }
    };

    loadUserData();
  }, [user, isLoaded]);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-bg-secondary)] border-b-4 border-[var(--color-border-primary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-2xl font-black uppercase tracking-tight group-hover:text-[var(--color-bauhaus-red)] transition-colors">
              Prompt Market
            </span>
          </Link>

          {/* 우측 네비게이션 */}
          <div className="flex items-center gap-4">
            {/* 테마 토글 */}
            <ThemeToggle />

            {/* 장바구니 */}
            <Link
              href="/cart"
              className="relative p-2 hover:bg-[var(--color-bg-tertiary)] transition-colors rounded-sm"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1">
                  <Badge variant="error" size="sm">
                    {cartCount}
                  </Badge>
                </div>
              )}
            </Link>

            {/* 사용자 메뉴 */}
            {isLoaded && user ? (
              <div className="flex items-center gap-3">
                {profile && (
                  <span className="font-semibold text-sm hidden sm:block">
                    {profile.nickname}
                  </span>
                )}
                {/* Clerk UserButton - 프로필, 설정, 로그아웃 기능 포함 */}
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox:
                        'w-8 h-8 border-2 border-[var(--color-bauhaus-black)]',
                    },
                  }}
                  userProfileMode="navigation"
                  userProfileUrl="/profile"
                >
                  <UserButton.MenuItems>
                    <UserButton.Link
                      label="구매 내역"
                      labelIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                      }
                      href="/my-page"
                    />
                    <UserButton.Action
                      label="프로필 관리"
                      labelIcon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      }
                      onClick={() => window.location.href = '/profile'}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            ) : (
              <SignInButton mode="modal">
                <Button variant="primary" size="sm">
                  로그인
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

