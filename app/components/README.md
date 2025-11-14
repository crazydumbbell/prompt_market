# UI Components Library

Linear 디자인 시스템을 기반으로 한 재사용 가능한 컴포넌트 라이브러리입니다.

## 📦 포함된 컴포넌트

### 기본 컴포넌트
- **Button** - 다양한 스타일과 크기의 버튼
- **Card** - 컨텐츠 컨테이너
- **Input** - 텍스트 입력 필드
- **Select** - 드롭다운 선택 메뉴
- **Badge** - 상태 및 레이블 표시
- **Avatar** - 사용자 프로필 이미지
- **Alert** - 알림 메시지
- **Modal** - 모달 다이얼로그
- **Tabs** - 탭 네비게이션
- **Typography** - 타이포그래피 컴포넌트 (Heading, Text)

## 🚀 사용 방법

### 1. Import

```typescript
import { Button, Card, Input } from '@/app/components/ui';
```

### 2. 기본 사용 예시

#### Button
```tsx
<Button variant="primary" size="md" onClick={handleClick}>
  클릭하세요
</Button>

<Button 
  variant="secondary" 
  loading={isLoading}
  leftIcon={<Icon />}
>
  저장
</Button>
```

#### Card
```tsx
<Card padding="md" hover>
  <h3>카드 제목</h3>
  <p>카드 내용</p>
</Card>
```

#### Input
```tsx
<Input
  label="이메일"
  placeholder="example@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  fullWidth
/>
```

#### Badge
```tsx
<Badge variant="success" dot>Active</Badge>
<Badge variant="error">Failed</Badge>
```

#### Avatar
```tsx
<Avatar name="김철수" size="md" status="online" />
```

#### Alert
```tsx
<Alert variant="success" title="성공">
  작업이 완료되었습니다.
</Alert>
```

#### Modal
```tsx
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="확인"
  footer={
    <>
      <Button variant="secondary" onClick={() => setIsOpen(false)}>
        취소
      </Button>
      <Button onClick={handleConfirm}>확인</Button>
    </>
  }
>
  <p>정말 삭제하시겠습니까?</p>
</Modal>
```

#### Tabs
```tsx
<Tabs defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">탭 1</TabsTrigger>
    <TabsTrigger value="tab2">탭 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">
    내용 1
  </TabsContent>
  <TabsContent value="tab2">
    내용 2
  </TabsContent>
</Tabs>
```

#### Typography
```tsx
<Heading level="h1">제목</Heading>
<Text size="regular" color="secondary">
  본문 텍스트
</Text>
```

## 🎨 디자인 토큰

모든 컴포넌트는 Linear 디자인 시스템의 CSS 변수를 사용합니다:

```css
/* Colors */
--color-accent
--color-bg-primary
--color-text-primary
--color-status-green
--color-border-primary

/* Spacing */
--radius-md
--shadow-medium

/* Animation */
--transition-quick
--ease-out-quad
```

## 📋 컴포넌트 Props

### Button Props
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}
```

### Card Props
```typescript
interface CardProps {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}
```

### Input Props
```typescript
interface InputProps {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  // + HTML input attributes
}
```

### Badge Props
```typescript
interface BadgeProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}
```

### Avatar Props
```typescript
interface AvatarProps {
  name?: string;
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}
```

## 🎯 사용 팁

### 1. 일관성 유지
- 동일한 variant와 size를 프로젝트 전체에서 일관되게 사용하세요
- Primary 버튼은 한 화면에 하나만 사용하는 것을 권장합니다

### 2. 접근성
- 모든 Input에는 label을 제공하세요
- Button에는 명확한 텍스트를 사용하세요
- Modal 사용 시 ESC 키로 닫을 수 있습니다

### 3. 성능
- Modal은 필요할 때만 렌더링됩니다 (isOpen이 true일 때)
- 모든 컴포넌트는 불필요한 리렌더링을 방지하도록 최적화되어 있습니다

### 4. 커스터마이징
- className prop을 사용해 추가 스타일을 적용할 수 있습니다
- CSS 변수를 오버라이드하여 테마를 커스터마이징할 수 있습니다

## 📱 반응형 디자인

모든 컴포넌트는 모바일부터 데스크톱까지 반응형으로 작동합니다:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>
```

## 🔧 확장하기

새로운 컴포넌트를 추가하려면:

1. `app/components/ui/YourComponent.tsx` 생성
2. `app/components/ui/index.ts`에 export 추가
3. Linear 디자인 시스템의 CSS 변수 사용
4. TypeScript 타입 정의 포함

## 📖 데모

전체 컴포넌트 데모는 `/components` 페이지에서 확인할 수 있습니다:

```bash
pnpm dev
```

그 후 브라우저에서 `http://localhost:3000/components`로 이동하세요.

## 🎨 디자인 시스템 출처

이 컴포넌트 라이브러리는 [Linear.app](https://linear.app/)의 디자인 시스템을 기반으로 합니다.

---

**만든 날짜**: 2025-11-14  
**버전**: 1.0.0

