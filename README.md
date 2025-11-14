# Bauhaus Design System

> "Form Follows Function" - 바우하우스 디자인 철학을 따르는 모던 컴포넌트 라이브러리

## 🎨 프로젝트 소개

이 프로젝트는 **바우하우스(Bauhaus)** 디자인 철학을 기반으로 한 재사용 가능한 UI 컴포넌트 라이브러리입니다.

### 바우하우스 핵심 원칙
- 🔴 **강렬한 원색**: 빨강, 파랑, 노랑, 검정
- 📐 **기하학적 형태**: 원, 사각형, 삼각형
- 🎯 **기능성 우선**: 형태는 기능을 따른다
- ✏️ **명확한 타이포그래피**: 대문자, 두꺼운 폰트
- 📏 **직선적 디자인**: 직각, 명확한 구조

## 🚀 시작하기

### 설치
```bash
pnpm install
```

### 개발 서버 실행
```bash
pnpm dev
```

### 페이지 확인
- **홈페이지**: http://localhost:3000
- **컴포넌트 데모**: http://localhost:3000/components

## 📦 컴포넌트 (10개)

### UI 컴포넌트
| 컴포넌트 | 용도 | 주요 Props |
|---------|------|-----------|
| **Button** | 모든 액션 버튼 | variant, size, loading |
| **Card** | 컨텐츠 컨테이너 | padding, hover |
| **Input** | 텍스트 입력 | label, error, leftIcon |
| **Badge** | 상태/레이블 표시 | variant, dot |
| **Avatar** | 프로필 이미지 | name, status, size |
| **Alert** | 알림 메시지 | variant, title, onClose |
| **Modal** | 다이얼로그 | isOpen, title, footer |
| **Tabs** | 탭 네비게이션 | defaultValue, onChange |
| **Select** | 드롭다운 메뉴 | options, value |
| **Typography** | 텍스트 (Heading, Text) | level, size, color |

## 🎨 디자인 토큰

### 색상 팔레트
```css
/* 바우하우스 원색 */
--color-bauhaus-red: #E63946
--color-bauhaus-blue: #1D3557
--color-bauhaus-yellow: #F1C40F
--color-bauhaus-black: #000000

/* 상태 색상 */
--color-status-green: #06D6A0   /* 성공 */
--color-status-red: #E63946      /* 오류 */
--color-status-orange: #F77F00   /* 경고 */
--color-status-blue: #1D3557     /* 정보 */
```

### 타이포그래피
- **Font Family**: Helvetica Neue, Arial
- **Font Weights**: 400 (normal), 700 (bold), 900 (black)
- **Heading Scale**: 9단계 (72px ~ 17px)
- **Body Scale**: 6단계 (17px ~ 10px)

### 간격 시스템
- 4px 기반 그리드
- 권장: 4, 6, 8, 12, 16, 24

## 💻 사용 예시

### 기본 사용법
```tsx
import { Button, Card, Input, Heading, Text } from '@/app/components/ui';

export default function MyPage() {
  return (
    <div className="p-8">
      <Heading level="h1">WELCOME</Heading>
      
      <Card padding="md" hover>
        <Heading level="h3">CARD TITLE</Heading>
        <Text color="secondary">Card content goes here</Text>
        
        <Input 
          label="이메일"
          placeholder="example@email.com"
          fullWidth
        />
        
        <Button variant="primary" fullWidth>
          Submit
        </Button>
      </Card>
    </div>
  );
}
```

### 폼 예시
```tsx
const [email, setEmail] = useState('');
const [error, setError] = useState('');

<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={error}
  leftIcon={<MailIcon />}
  fullWidth
/>
```

### 모달 예시
```tsx
const [isOpen, setIsOpen] = useState(false);

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
  <Text>정말 삭제하시겠습니까?</Text>
</Modal>
```

## 📐 디자인 규칙

### ✅ DO (해야 할 것)
- 기존 컴포넌트 사용
- 대문자 사용 (헤딩, 버튼)
- 직각 디자인 유지
- 오프셋 그림자 사용
- 원색 효과적 활용
- TypeScript 타입 정의

### ❌ DON'T (하지 말 것)
- HTML 태그 직접 사용
- 인라인 스타일
- 둥근 모서리 (rounded-full)
- 부드러운 그림자
- 타입 없는 컴포넌트

## 🎯 프로젝트 구조

```
prompt_market/
├── app/
│   ├── components/          # 컴포넌트 데모 페이지
│   │   ├── ui/             # UI 컴포넌트 라이브러리
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── ...
│   │   └── page.tsx        # 데모 페이지
│   ├── globals.css         # 바우하우스 CSS 변수
│   └── page.tsx           # 홈페이지
├── linear-design-system/   # 원본 Linear 테마 (참고용)
├── .cursorrules           # Cursor AI 프로젝트 규칙
└── README.md              # 이 파일
```

## 📚 문서

### 상세 가이드
- **컴포넌트 사용법**: `app/components/README.md`
- **Cursor 규칙**: `.cursorrules`
- **디자인 시스템**: `linear-design-system/LINEAR_THEME_GUIDE.md`

### 컴포넌트 데모
실행 중인 개발 서버에서 `/components` 경로로 이동하면 모든 컴포넌트의 실제 동작을 확인할 수 있습니다.

## 🔐 인증 시스템

이 프로젝트는 **Clerk**를 사용한 완전한 인증 시스템이 통합되어 있습니다.

### 주요 기능
- 🔑 이메일/소셜 로그인
- 👤 사용자 프로필 관리
- 🛡️ 보호된 라우트
- 🔗 Supabase 데이터베이스 통합
- 🪝 Webhook 자동 프로필 생성

### 빠른 시작
1. **환경 변수 설정**: `.env.local` 파일 생성
2. **데이터베이스 마이그레이션**: Supabase에서 SQL 실행
3. **개발 서버 실행**: `pnpm dev`

자세한 내용은 다음 문서를 참고하세요:
- **빠른 시작 가이드**: `docs/CLERK_QUICKSTART.md`
- **상세 설정 가이드**: `docs/CLERK_SETUP.md`

## 🛠️ 기술 스택

- **Framework**: Next.js 16
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Package Manager**: pnpm
- **Design System**: Bauhaus
- **Authentication**: Clerk
- **Database**: Supabase

## 🎨 디자인 영감

이 프로젝트는 다음에서 영감을 받았습니다:
- **바우하우스 운동** (1919-1933): 기능주의와 형태의 순수성
- **Linear.app**: 현대적 UI/UX (초기 크롤링 기반)
- **De Stijl**: 원색과 기하학적 형태

## 🤝 기여하기

1. 새로운 컴포넌트를 추가할 때는 `.cursorrules`를 참고하세요
2. 바우하우스 디자인 원칙을 따라주세요
3. TypeScript 타입을 반드시 정의하세요
4. 컴포넌트 데모 페이지에 예시를 추가하세요

## 📝 라이선스

이 프로젝트는 학습 및 참고 목적으로 제작되었습니다.

---

**버전**: 1.0.0  
**최종 업데이트**: 2025-11-14  
**제작**: Playwright MCP + Bauhaus Design Principles
