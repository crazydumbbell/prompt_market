# Linear Design System

Playwright MCP를 사용하여 [Linear.app](https://linear.app/)에서 추출한 완전한 디자인 시스템입니다.

## 📦 파일 구성

```
linear-design-system/
├── README.md                          # 이 파일
├── LINEAR_THEME_GUIDE.md             # 상세 사용 가이드
├── linear-theme.json                 # 전체 테마 데이터 (JSON)
├── linear-theme.css                  # CSS 변수 파일
└── tailwind-linear-theme.config.js   # Tailwind CSS 설정
```

## 🚀 빠른 시작

### 1️⃣ Tailwind CSS 프로젝트

```javascript
// tailwind.config.js 파일의 theme.extend에 병합
const linearTheme = require('./linear-design-system/tailwind-linear-theme.config.js');
```

사용 예시:
```jsx
<button className="bg-accent-primary hover:bg-accent-hover text-brand-text">
  버튼
</button>
```

### 2️⃣ CSS 변수 사용

```css
/* globals.css */
@import './linear-design-system/linear-theme.css';
```

사용 예시:
```css
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

### 3️⃣ JSON 데이터 직접 사용

```javascript
import theme from './linear-design-system/linear-theme.json';

const primaryColor = theme.colorPalette.accent.primary;
```

## 🎨 주요 특징

- ✅ **60개 이상의 색상** - 세밀하게 분류된 색상 팔레트
- ✅ **15단계 타이포그래피** - 헤딩부터 본문까지 완벽한 스케일
- ✅ **18개 Easing 함수** - 부드러운 애니메이션
- ✅ **다크 모드 우선** - Linear의 시그니처 다크 테마
- ✅ **Inter Variable 폰트** - 최신 가변 폰트 사용

## 📖 상세 문서

더 자세한 사용법과 예제는 [`LINEAR_THEME_GUIDE.md`](./LINEAR_THEME_GUIDE.md)를 참고하세요.

## 🎨 색상 미리보기

### 브랜드 컬러
- **Primary**: `#5e6ad2` 🟦
- **Accent**: `#7170ff` 🟪

### 배경색
- **Primary**: `#08090a` ⬛
- **Secondary**: `#1c1c1f` ⬛

### 상태 컬러
- **Success**: `#4cb782` 🟢
- **Error**: `#eb5757` 🔴
- **Warning**: `#fc7840` 🟠
- **Info**: `#4ea7fc` 🔵

## 📄 라이선스

이 디자인 시스템은 Linear.app에서 추출되었으며, 학습 및 참고 목적으로 사용하세요.

---

**추출 방법**: Playwright MCP  
**추출 날짜**: 2025-11-14  
**출처**: https://linear.app/

