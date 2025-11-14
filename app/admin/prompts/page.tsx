'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Heading, Text, Button, Card, Badge, Alert, Modal, Input } from '@/app/components/ui';
import { Prompt } from '@/types/database.types';

export default function AdminPromptsPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    prompt_text: '',
    category: 'general',
    thumbnail_url: '',
    image_urls: '',
  });

  // 권한 체크 (간단한 예시 - 실제로는 Clerk metadata 사용)
  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  // 프롬프트 목록 조회
  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/prompts');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prompts');
      }

      const data = await response.json();
      setPrompts(data.prompts || []);
    } catch (err) {
      console.error('Error fetching prompts:', err);
      setError('프롬프트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchPrompts();
    }
  }, [isLoaded, user]);

  // 프롬프트 생성/수정
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const imageUrlsArray = formData.image_urls
        ? formData.image_urls.split(',').map(url => url.trim()).filter(url => url)
        : [];

      const payload = {
        ...formData,
        image_urls: imageUrlsArray,
        price: Number(formData.price),
      };

      const url = editingPrompt
        ? `/api/admin/prompts/${editingPrompt.id}`
        : '/api/admin/prompts';
      
      const method = editingPrompt ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to save prompt');
      }

      // 성공 시 모달 닫고 목록 새로고침
      setIsModalOpen(false);
      setEditingPrompt(null);
      resetForm();
      fetchPrompts();
      alert(editingPrompt ? '프롬프트가 수정되었습니다.' : '프롬프트가 생성되었습니다.');
    } catch (err) {
      console.error('Error saving prompt:', err);
      alert('프롬프트 저장에 실패했습니다.');
    }
  };

  // 프롬프트 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('정말 이 프롬프트를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/prompts/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prompt');
      }

      alert('프롬프트가 삭제되었습니다.');
      fetchPrompts();
    } catch (err) {
      console.error('Error deleting prompt:', err);
      alert('프롬프트 삭제에 실패했습니다.');
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      price: 0,
      prompt_text: '',
      category: 'general',
      thumbnail_url: '',
      image_urls: '',
    });
  };

  // 수정 모달 열기
  const openEditModal = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      description: prompt.description,
      price: prompt.price,
      prompt_text: prompt.prompt_text,
      category: prompt.category || 'general',
      thumbnail_url: prompt.thumbnail_url || '',
      image_urls: prompt.image_urls?.join(', ') || '',
    });
    setIsModalOpen(true);
  };

  // 새 프롬프트 모달 열기
  const openCreateModal = () => {
    setEditingPrompt(null);
    resetForm();
    setIsModalOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg-primary)] flex items-center justify-center">
        <Text>로딩 중...</Text>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-2 h-12 bg-[var(--color-accent)]" />
              <Heading level="h1">프롬프트 관리</Heading>
            </div>
            <Button variant="primary" onClick={openCreateModal}>
              새 프롬프트 추가
            </Button>
          </div>
          <Text color="tertiary">
            총 {prompts.length}개의 프롬프트
          </Text>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {/* 프롬프트 목록 */}
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <Card key={prompt.id} padding="md" hover>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge variant={prompt.is_active ? 'success' : 'default'}>
                      {prompt.is_active ? '활성' : '비활성'}
                    </Badge>
                    <Badge variant="info">{prompt.category}</Badge>
                    <Heading level="h3">{prompt.title}</Heading>
                  </div>
                  <Text color="secondary" className="line-clamp-2">
                    {prompt.description}
                  </Text>
                  <div className="flex items-center gap-4">
                    <Text weight="bold" color="primary">
                      {formatPrice(prompt.price)}원
                    </Text>
                    <Text size="small" color="tertiary">
                      생성일: {new Date(prompt.created_at).toLocaleDateString('ko-KR')}
                    </Text>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => openEditModal(prompt)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(prompt.id)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </Card>
          ))}

          {prompts.length === 0 && !loading && (
            <Card padding="lg">
              <div className="text-center py-12">
                <Heading level="h3" className="mb-4">
                  프롬프트가 없습니다
                </Heading>
                <Text color="tertiary" className="mb-6">
                  첫 번째 프롬프트를 추가해보세요
                </Text>
                <Button variant="primary" onClick={openCreateModal}>
                  프롬프트 추가하기
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* 프롬프트 생성/수정 모달 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPrompt(null);
            resetForm();
          }}
          title={editingPrompt ? '프롬프트 수정' : '새 프롬프트 추가'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="제목"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-semibold mb-2">설명</label>
              <textarea
                className="w-full p-3 border-2 border-[var(--color-border-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <Input
              label="가격"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
              fullWidth
            />

            <div>
              <label className="block text-sm font-semibold mb-2">프롬프트 내용</label>
              <textarea
                className="w-full p-3 border-2 border-[var(--color-border-primary)] focus:outline-none focus:border-[var(--color-accent)]"
                rows={6}
                value={formData.prompt_text}
                onChange={(e) => setFormData({ ...formData, prompt_text: e.target.value })}
                required
              />
            </div>

            <Input
              label="카테고리"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="예: design, writing, marketing"
              fullWidth
            />

            <Input
              label="썸네일 URL"
              value={formData.thumbnail_url}
              onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              fullWidth
            />

            <Input
              label="이미지 URL (쉼표로 구분)"
              value={formData.image_urls}
              onChange={(e) => setFormData({ ...formData, image_urls: e.target.value })}
              placeholder="https://example.com/1.jpg, https://example.com/2.jpg"
              fullWidth
            />

            <div className="flex gap-3 pt-4">
              <Button type="submit" variant="primary" fullWidth>
                {editingPrompt ? '수정하기' : '추가하기'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                fullWidth
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingPrompt(null);
                  resetForm();
                }}
              >
                취소
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}

