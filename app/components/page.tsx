'use client';

import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Badge,
  Avatar,
  Alert,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  Modal,
  Heading,
  Text,
} from './ui';
import type { SelectOption } from './ui';

export default function ComponentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectValue, setSelectValue] = useState('');
  const [loading, setLoading] = useState(false);

  const selectOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
    { value: 'option4', label: 'Option 4 (Disabled)', disabled: true },
  ];

  const handleLoadingClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-primary)] p-8 relative overflow-hidden">
      {/* Bauhaus Geometric Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-[var(--color-bauhaus-red)] opacity-80 rounded-full" />
        <div className="absolute top-40 left-10 w-24 h-24 bg-[var(--color-bauhaus-yellow)] opacity-70" />
        <div className="absolute bottom-32 right-40 w-40 h-40 bg-[var(--color-bauhaus-blue)] opacity-60 rotate-45" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border-8 border-[var(--color-bauhaus-black)] opacity-40 rounded-full" />
        <div className="absolute bottom-20 left-20 w-28 h-28 border-8 border-[var(--color-bauhaus-red)] opacity-30" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-6 py-12">
          <div className="inline-block">
            <Heading level="h1" className="relative">
              BAUHAUS
              <span className="absolute -top-4 -right-8 w-16 h-16 bg-[var(--color-bauhaus-red)] opacity-80 rounded-full" />
            </Heading>
            <Heading level="h2" className="mt-2">Design System</Heading>
          </div>
          <Text size="large" weight="medium">
            기하학적 형태와 기능성의 만남
          </Text>
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 bg-[var(--color-bauhaus-red)]" />
            <div className="w-12 h-12 bg-[var(--color-bauhaus-blue)]" />
            <div className="w-12 h-12 bg-[var(--color-bauhaus-yellow)]" />
          </div>
        </div>

        {/* Typography Section */}
        <Section title="Typography" description="텍스트 스타일 시스템">
          <Card>
            <div className="space-y-6">
              <div className="space-y-2">
                <Heading level="h1">Heading 1</Heading>
                <Heading level="h2">Heading 2</Heading>
                <Heading level="h3">Heading 3</Heading>
                <Heading level="h4">Heading 4</Heading>
                <Heading level="h5">Heading 5</Heading>
                <Heading level="h6">Heading 6</Heading>
              </div>
              <div className="space-y-2">
                <Text size="large">Large text - 큰 본문 텍스트</Text>
                <Text size="regular">Regular text - 기본 본문 텍스트</Text>
                <Text size="small">Small text - 작은 텍스트</Text>
                <Text size="mini">Mini text - 미니 텍스트</Text>
                <Text size="micro">Micro text - 마이크로 텍스트</Text>
              </div>
              <div className="space-y-2">
                <Text color="primary">Primary color</Text>
                <Text color="secondary">Secondary color</Text>
                <Text color="tertiary">Tertiary color</Text>
                <Text color="quaternary">Quaternary color</Text>
              </div>
            </div>
          </Card>
        </Section>

        {/* Buttons Section */}
        <Section title="Buttons" description="다양한 버튼 스타일과 상태">
          <Card>
            <div className="space-y-6">
              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Variants
                </Text>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary">Primary</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="danger">Danger</Button>
                  <Button variant="success">Success</Button>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Sizes
                </Text>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm">Small</Button>
                  <Button size="md">Medium</Button>
                  <Button size="lg">Large</Button>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  With Icons
                </Text>
                <div className="flex flex-wrap gap-3">
                  <Button
                    leftIcon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    }
                  >
                    Add Item
                  </Button>
                  <Button
                    variant="secondary"
                    rightIcon={
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    }
                  >
                    Continue
                  </Button>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  States
                </Text>
                <div className="flex flex-wrap gap-3">
                  <Button loading={loading} onClick={handleLoadingClick}>
                    {loading ? 'Loading...' : 'Click to Load'}
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Full Width
                </Text>
                <Button fullWidth>Full Width Button</Button>
              </div>
            </div>
          </Card>
        </Section>

        {/* Inputs Section */}
        <Section title="Inputs" description="입력 필드와 폼 요소">
          <Card>
            <div className="space-y-6">
              <Input
                label="기본 입력"
                placeholder="텍스트를 입력하세요"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                fullWidth
              />
              <Input
                label="도움말이 있는 입력"
                placeholder="example@email.com"
                helperText="이메일 형식으로 입력해주세요"
                fullWidth
              />
              <Input label="에러가 있는 입력" placeholder="입력..." error="이 필드는 필수입니다" fullWidth />
              <Input
                label="아이콘이 있는 입력"
                placeholder="검색..."
                leftIcon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                fullWidth
              />
              <Input
                label="비활성화된 입력"
                placeholder="비활성화됨"
                disabled
                value="수정할 수 없습니다"
                fullWidth
              />
            </div>
          </Card>
        </Section>

        {/* Select Section */}
        <Section title="Select" description="드롭다운 선택 메뉴">
          <Card>
            <div className="space-y-6">
              <Select
                label="기본 선택"
                options={selectOptions}
                value={selectValue}
                onChange={setSelectValue}
                fullWidth
              />
              <Select label="에러가 있는 선택" options={selectOptions} error="옵션을 선택해주세요" fullWidth />
              <Select label="비활성화된 선택" options={selectOptions} disabled fullWidth />
            </div>
          </Card>
        </Section>

        {/* Badges Section */}
        <Section title="Badges" description="상태와 레이블 표시">
          <Card>
            <div className="space-y-6">
              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Variants
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Sizes
                </Text>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge size="sm">Small</Badge>
                  <Badge size="md">Medium</Badge>
                  <Badge size="lg">Large</Badge>
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  With Dot
                </Text>
                <div className="flex flex-wrap gap-2">
                  <Badge dot>Default</Badge>
                  <Badge variant="success" dot>
                    Active
                  </Badge>
                  <Badge variant="warning" dot>
                    Pending
                  </Badge>
                  <Badge variant="error" dot>
                    Failed
                  </Badge>
                  <Badge variant="info" dot>
                    Info
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* Avatars Section */}
        <Section title="Avatars" description="사용자 프로필 이미지">
          <Card>
            <div className="space-y-6">
              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  Sizes
                </Text>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name="김철수" size="sm" />
                  <Avatar name="이영희" size="md" />
                  <Avatar name="박민준" size="lg" />
                  <Avatar name="최서연" size="xl" />
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  With Status
                </Text>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name="김철수" status="online" />
                  <Avatar name="이영희" status="offline" />
                  <Avatar name="박민준" status="busy" />
                  <Avatar name="최서연" status="away" />
                </div>
              </div>

              <div>
                <Text size="small" color="tertiary" className="mb-3">
                  With Image (시뮬레이션)
                </Text>
                <div className="flex flex-wrap items-center gap-4">
                  <Avatar name="테스트" />
                  <Avatar name="사용자" size="lg" status="online" />
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* Alerts Section */}
        <Section title="Alerts" description="알림 및 메시지">
          <div className="space-y-4">
            <Alert variant="info" title="정보">
              이것은 정보 메시지입니다. 사용자에게 유용한 정보를 전달합니다.
            </Alert>
            <Alert variant="success" title="성공">
              작업이 성공적으로 완료되었습니다!
            </Alert>
            <Alert variant="warning" title="경고">
              주의가 필요한 상황입니다. 확인해주세요.
            </Alert>
            <Alert variant="error" title="오류">
              오류가 발생했습니다. 다시 시도해주세요.
            </Alert>
            <Alert variant="info" onClose={() => console.log('Closed')}>
              닫기 버튼이 있는 알림입니다.
            </Alert>
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards" description="컨텐츠 컨테이너">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card padding="md">
              <Heading level="h4">기본 카드</Heading>
              <Text size="small" color="secondary" className="mt-2">
                기본 패딩이 적용된 카드입니다.
              </Text>
            </Card>
            <Card padding="md" hover>
              <Heading level="h4">호버 카드</Heading>
              <Text size="small" color="secondary" className="mt-2">
                마우스를 올리면 효과가 나타납니다.
              </Text>
            </Card>
            <Card padding="md" onClick={() => alert('클릭!')}>
              <Heading level="h4">클릭 가능 카드</Heading>
              <Text size="small" color="secondary" className="mt-2">
                클릭하면 동작합니다.
              </Text>
            </Card>
          </div>
        </Section>

        {/* Tabs Section */}
        <Section title="Tabs" description="탭 네비게이션">
          <Card>
            <Tabs defaultValue="tab1">
              <TabsList>
                <TabsTrigger value="tab1">탭 1</TabsTrigger>
                <TabsTrigger value="tab2">탭 2</TabsTrigger>
                <TabsTrigger value="tab3">탭 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1" className="mt-6">
                <Text>첫 번째 탭의 내용입니다.</Text>
              </TabsContent>
              <TabsContent value="tab2" className="mt-6">
                <Text>두 번째 탭의 내용입니다.</Text>
              </TabsContent>
              <TabsContent value="tab3" className="mt-6">
                <Text>세 번째 탭의 내용입니다.</Text>
              </TabsContent>
            </Tabs>
          </Card>
        </Section>

        {/* Modal Section */}
        <Section title="Modal" description="모달 다이얼로그">
          <Card>
            <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="모달 제목"
              footer={
                <>
                  <Button variant="secondary" onClick={() => setModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={() => setModalOpen(false)}>확인</Button>
                </>
              }
            >
              <Text>이것은 모달의 내용입니다. 여기에 원하는 컨텐츠를 넣을 수 있습니다.</Text>
              <Text color="secondary" className="mt-4">
                ESC 키를 누르거나 외부를 클릭하면 모달이 닫힙니다.
              </Text>
            </Modal>
          </Card>
        </Section>

        {/* Colors Section */}
        <Section title="Colors" description="바우하우스 컬러 팔레트">
          <Card>
            <div className="space-y-8">
              <ColorPalette
                title="Bauhaus Primary"
                colors={[
                  { name: 'Red', value: 'var(--color-bauhaus-red)' },
                  { name: 'Blue', value: 'var(--color-bauhaus-blue)' },
                  { name: 'Yellow', value: 'var(--color-bauhaus-yellow)' },
                  { name: 'Black', value: 'var(--color-bauhaus-black)' },
                ]}
              />
              <ColorPalette
                title="Status Colors"
                colors={[
                  { name: 'Success', value: 'var(--color-status-green)' },
                  { name: 'Warning', value: 'var(--color-status-orange)' },
                  { name: 'Error', value: 'var(--color-status-red)' },
                  { name: 'Info', value: 'var(--color-status-blue)' },
                ]}
              />
              <ColorPalette
                title="Neutral Colors"
                colors={[
                  { name: 'Primary BG', value: 'var(--color-bg-primary)' },
                  { name: 'Secondary BG', value: 'var(--color-bg-secondary)' },
                  { name: 'Gray', value: 'var(--color-bauhaus-gray)' },
                  { name: 'White', value: 'var(--color-bauhaus-white)' },
                ]}
              />
            </div>
          </Card>
        </Section>
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-6 relative">
      <div className="flex items-start gap-4">
        <div className="w-2 h-12 bg-[var(--color-accent)]" />
        <div>
          <Heading level="h2">{title}</Heading>
          <Text color="tertiary" weight="medium" className="mt-2">
            {description}
          </Text>
        </div>
      </div>
      {children}
    </section>
  );
}

interface ColorPaletteProps {
  title: string;
  colors: { name: string; value: string }[];
}

function ColorPalette({ title, colors }: ColorPaletteProps) {
  return (
    <div>
      <Text size="small" weight="bold" className="mb-4 uppercase tracking-wider">
        {title}
      </Text>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="space-y-2">
            <div
              className="h-20 border-4 border-[var(--color-bauhaus-black)] relative overflow-hidden group cursor-pointer"
              style={{ backgroundColor: color.value }}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                <Text size="mini" className="text-white font-bold">
                  {color.value}
                </Text>
              </div>
            </div>
            <Text size="mini" weight="bold" className="uppercase tracking-wide">
              {color.name}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
}

