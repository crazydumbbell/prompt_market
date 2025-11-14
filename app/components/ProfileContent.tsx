'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types/database.types';
import { createClient } from '@/lib/supabase/client';
import { Card, Button, Input, Text, Heading, Avatar, Alert } from './ui';

interface ProfileContentProps {
  profile: Profile | null;
  userEmail: string;
}

export default function ProfileContent({ profile: initialProfile, userEmail }: ProfileContentProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(initialProfile?.nickname || '');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleSave = async () => {
    if (!profile) return;

    if (!nickname.trim()) {
      setMessage({ type: 'error', text: '닉네임을 입력해주세요.' });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ nickname: nickname.trim(), updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, nickname: nickname.trim() });
      setIsEditing(false);
      setMessage({ type: 'success', text: '프로필이 저장되었습니다.' });
      
      // 3초 후 메시지 자동 제거
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: '프로필 저장에 실패했습니다.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNickname(profile?.nickname || '');
    setIsEditing(false);
    setMessage(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;

    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일 검증
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: '이미지 파일만 업로드할 수 있습니다.' });
      return;
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: '파일 크기는 5MB 이하여야 합니다.' });
      return;
    }

    setUploadingImage(true);
    try {
      // 기존 이미지가 있다면 삭제
      if (profile.avatar_url) {
        const oldPath = profile.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage.from('avatars').remove([`${profile.id}/${oldPath}`]);
        }
      }

      // 새 이미지 업로드
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${profile.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      // 프로필 업데이트
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: '프로필 이미지가 업데이트되었습니다.' });
      
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: '이미지 업로드에 실패했습니다.' });
    } finally {
      setUploadingImage(false);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text>프로필 정보를 불러올 수 없습니다.</Text>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-[var(--color-accent)]" />
            <Heading level="h1">프로필 관리</Heading>
          </div>
        </div>

        {message && (
          <div className="mb-6">
            <Alert
              variant={message.type === 'success' ? 'success' : 'error'}
              onClose={() => setMessage(null)}
            >
              {message.text}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 좌측: 프로필 이미지 */}
          <Card padding="lg" className="md:col-span-1">
            <div className="space-y-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Avatar
                    name={profile.nickname}
                    src={profile.avatar_url || undefined}
                    size="xl"
                  />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-sm">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <input
                  type="file"
                  id="avatar-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="hidden"
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="secondary"
                    size="md"
                    fullWidth
                    disabled={uploadingImage}
                    onClick={() => document.getElementById('avatar-upload')?.click()}
                  >
                    {uploadingImage ? '업로드 중...' : '이미지 변경'}
                  </Button>
                </label>
              </div>

              <div className="pt-6 border-t-2 border-[var(--color-border-tertiary)] space-y-2">
                <Text size="small" color="tertiary">
                  • JPG, PNG, GIF 형식
                </Text>
                <Text size="small" color="tertiary">
                  • 최대 5MB
                </Text>
              </div>
            </div>
          </Card>

          {/* 우측: 프로필 정보 */}
          <Card padding="lg" className="md:col-span-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-6 bg-[var(--color-bauhaus-blue)]" />
                  <Heading level="h2">기본 정보</Heading>
                </div>
              </div>

              {/* 이메일 (읽기 전용) */}
              <div className="space-y-2">
                <Text weight="semibold">이메일</Text>
                <div className="bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] px-4 py-3">
                  <Text color="tertiary">{userEmail}</Text>
                </div>
                <Text size="small" color="tertiary">
                  * 이메일은 변경할 수 없습니다
                </Text>
              </div>

              {/* 닉네임 */}
              <div className="space-y-2">
                <Text weight="semibold">닉네임</Text>
                {isEditing ? (
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요"
                    fullWidth
                    autoFocus
                  />
                ) : (
                  <div className="bg-[var(--color-bg-secondary)] border-2 border-[var(--color-border-primary)] px-4 py-3">
                    <Text weight="semibold">{profile.nickname}</Text>
                  </div>
                )}
              </div>

              {/* 가입일 */}
              <div className="space-y-2">
                <Text weight="semibold">가입일</Text>
                <div className="bg-[var(--color-bg-tertiary)] border-2 border-[var(--color-border-secondary)] px-4 py-3">
                  <Text color="tertiary">
                    {new Date(profile.created_at).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </div>
              </div>

              {/* 버튼 */}
              <div className="pt-6 border-t-2 border-[var(--color-border-tertiary)]">
                {isEditing ? (
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleSave}
                      disabled={loading}
                      loading={loading}
                      className="flex-1"
                    >
                      저장
                    </Button>
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1"
                    >
                      취소
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="md"
                    onClick={() => setIsEditing(true)}
                    fullWidth
                  >
                    수정하기
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

