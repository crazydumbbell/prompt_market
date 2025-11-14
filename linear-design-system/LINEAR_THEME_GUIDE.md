# Linear Design System 사용 가이드

Playwright MCP를 사용하여 [Linear.app](https://linear.app/)에서 추출한 완전한 디자인 시스템입니다.

## 📦 포함된 파일

1. **linear-theme.json** - 전체 테마 데이터 (JSON 형식)
2. **tailwind-linear-theme.config.js** - Tailwind CSS 설정 파일
3. **linear-theme.css** - CSS 변수 파일

## 🎨 디자인 시스템 개요

### 핵심 특징

- **다크 모드 우선**: Linear는 다크 모드를 기본 테마로 사용합니다
- **Inter Variable 폰트**: 가변 폰트를 사용한 유연한 타이포그래피
- **계층적 색상 시스템**: primary, secondary, tertiary, quaternary로 구분된 일관된 색상
- **정교한 애니메이션**: 다양한 easing 함수를 활용한 부드러운 전환 효과

## 🚀 사용 방법

### 1. Tailwind CSS 사용

프로젝트의 `tailwind.config.js` 파일을 `tailwind-linear-theme.config.js`의 내용으로 교체하거나 병합하세요.

```javascript
// tailwind.config.js
module.exports = {
  // ... 기존 설정
  theme: {
    extend: {
      // tailwind-linear-theme.config.js의 theme.extend 내용을 여기에 붙여넣기
    }
  }
}
```

#### 사용 예시

```jsx
// 배경색
<div className="bg-background-primary">

// 텍스트 색상
<h1 className="text-text-primary">제목</h1>
<p className="text-text-secondary">본문</p>

// 타이포그래피
<h1 className="text-title-5 font-semibold">큰 제목</h1>
<p className="text-regular">본문 텍스트</p>

// 액센트 색상
<button className="bg-accent-primary hover:bg-accent-hover">
  클릭하세요
</button>

// 상태 색상
<span className="text-status-green">성공</span>
<span className="text-status-red">오류</span>

// Border Radius
<div className="rounded-lg">...</div>
<button className="rounded-full">...</button>

// Shadows
<div className="shadow-medium">...</div>

// 애니메이션
<div className="transition-all duration-quick ease-out-quad">
  호버 효과
</div>
```

### 2. CSS 변수 사용

`linear-theme.css` 파일을 프로젝트에 import하세요.

```css
/* globals.css 또는 main CSS 파일에서 */
@import './linear-theme.css';
```

#### 사용 예시

```css
/* 배경과 텍스트 */
.my-component {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* 타이포그래피 */
h1 {
  font-size: var(--title-5-size);
  line-height: var(--title-5-line-height);
  letter-spacing: var(--title-5-letter-spacing);
  font-weight: var(--font-weight-semibold);
}

/* 또는 유틸리티 클래스 사용 */
<h1 class="title-5">제목</h1>

/* Border와 Shadow */
.card {
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-12);
  box-shadow: var(--shadow-medium);
}

/* 애니메이션 */
.button {
  transition: all var(--speed-quick-transition) var(--ease-out-quad);
}

.button:hover {
  background-color: var(--color-accent-hover);
}
```

### 3. JSON 데이터 직접 사용

프로젝트에서 테마 객체가 필요한 경우 JSON 파일을 import하세요.

```javascript
import linearTheme from './linear-theme.json';

// 테마 색상 접근
const primaryBg = linearTheme.colorPalette.background.primary; // "#08090a"
const accentColor = linearTheme.colorPalette.accent.primary; // "#7170ff"

// 타이포그래피
const headingSize = linearTheme.typography.headings.title5.size; // "2.5rem"
```

## 🎨 색상 팔레트

### 브랜드 컬러
- **Primary**: `#5e6ad2` (인디고 블루)
- **Text**: `#fff` (화이트)

### 배경색 (어두운 것부터 밝은 순)
- **Primary**: `#08090a` - 메인 배경
- **Secondary**: `#1c1c1f` - 카드 배경
- **Tertiary**: `#232326` - 활성화된 요소
- **Level 0-3**: 다양한 깊이의 배경

### 텍스트 컬러
- **Primary**: `#f7f8f8` - 주요 텍스트
- **Secondary**: `#d0d6e0` - 보조 텍스트
- **Tertiary**: `#8a8f98` - 3차 텍스트
- **Quaternary**: `#62666d` - 비활성화 텍스트

### 액센트 컬러
- **Primary**: `#7170ff` - 주요 액센트
- **Hover**: `#828fff` - 호버 상태
- **Indigo**: `#5e6ad2` - 브랜드 컬러와 동일

### 상태 컬러
- **Red**: `#eb5757` - 에러, 삭제
- **Orange**: `#fc7840` - 경고
- **Yellow**: `#f2c94c` - 주의
- **Green**: `#4cb782` - 성공
- **Blue**: `#4ea7fc` - 정보

## 📝 타이포그래피

### 헤딩 스케일
- **Title 9**: 72px (4.5rem) - 최대 히어로
- **Title 8**: 64px (4rem) - 히어로
- **Title 7**: 56px (3.5rem) - 대형 히어로
- **Title 6**: 48px (3rem) - 디스플레이
- **Title 5**: 40px (2.5rem) - H1
- **Title 4**: 32px (2rem) - H2
- **Title 3**: 24px (1.5rem) - H3
- **Title 2**: 21px (1.3125rem) - H4
- **Title 1**: 17px (1.0625rem) - H5

### 본문 텍스트
- **Large**: 17px (1.0625rem)
- **Regular**: 15px (0.9375rem) - 기본 크기
- **Small**: 14px (0.875rem)
- **Mini**: 13px (0.8125rem)
- **Micro**: 12px (0.75rem)
- **Tiny**: 10px (0.625rem)

### 폰트 패밀리
- **Regular**: Inter Variable (시스템 폰트 폴백 포함)
- **Monospace**: Berkeley Mono
- **Serif**: Tiempos Headline

### 폰트 굵기
- **Light**: 300
- **Normal**: 400
- **Medium**: 510
- **Semibold**: 590
- **Bold**: 680

## 🔲 Border Radius

- **Circle**: 50%
- **Rounded/Full**: 9999px
- **4px, 6px, 8px, 12px, 16px, 24px, 32px**

## 🌓 Shadows

- **None/Tiny**: 투명
- **Low**: `0px 2px 4px rgba(0,0,0,.1)`
- **Medium**: `0px 4px 24px rgba(0,0,0,.2)`
- **High**: `0px 7px 32px rgba(0,0,0,.35)`
- **Stack Low**: 다층 섀도우 효과

## 📏 Spacing

- **Header Height**: 64px
- **Page Padding Inline**: 24px
- **Page Padding Block**: 64px
- **Page Max Width**: 1024px
- **Prose Max Width**: 624px
- **Min Tap Size**: 44px (접근성)

## ⚡ 애니메이션

### Easing Functions
Linear는 다양한 easing 함수를 제공합니다:

- **Quad**: 가장 부드러운 가속/감속
- **Cubic**: 표준 가속/감속
- **Quart**: 강한 가속/감속
- **Quint**: 매우 강한 가속/감속
- **Expo**: 지수 함수적 가속/감속
- **Circ**: 원형 가속/감속

각 easing은 `in`, `out`, `in-out` 변형이 있습니다.

### 권장 사용
- **Hover 효과**: `ease-out-quad` + `quick-transition` (0.1s)
- **페이지 전환**: `ease-in-out-cubic` + `regular-transition` (0.25s)
- **모달 열기**: `ease-out-expo`
- **스크롤 애니메이션**: `ease-out-quint`

## 💡 사용 팁

### 1. 다크 모드 적용
이미 다크 모드가 기본이므로 추가 설정 불필요합니다. 라이트 모드가 필요한 경우 색상 값을 반전시켜 사용하세요.

### 2. 일관성 유지
- 텍스트는 항상 계층적 색상 사용 (primary → secondary → tertiary → quaternary)
- 배경은 depth에 따라 level 0-3 사용
- 상호작용 요소에는 accent 컬러 사용

### 3. 접근성
- 최소 터치 영역 44px 준수
- 충분한 색상 대비 유지
- 텍스트 크기는 최소 14px 이상 권장

### 4. 성능
- CSS 변수를 사용하면 런타임에서 테마 변경 가능
- Tailwind 사용 시 purge 설정으로 불필요한 CSS 제거

## 📖 예제 컴포넌트

### 버튼 컴포넌트

```tsx
// Tailwind 사용
<button className="
  px-6 py-3
  bg-accent-primary hover:bg-accent-hover
  text-brand-text font-medium
  rounded-lg
  transition-all duration-quick ease-out-quad
  shadow-low hover:shadow-medium
">
  시작하기
</button>

// CSS 사용
<button className="linear-button">시작하기</button>

<style>
.linear-button {
  padding: 12px 24px;
  background-color: var(--color-accent-primary);
  color: var(--color-brand-text);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-8);
  border: none;
  box-shadow: var(--shadow-low);
  transition: all var(--speed-quick-transition) var(--ease-out-quad);
  cursor: pointer;
}

.linear-button:hover {
  background-color: var(--color-accent-hover);
  box-shadow: var(--shadow-medium);
}
</style>
```

### 카드 컴포넌트

```tsx
// Tailwind
<div className="
  p-6
  bg-background-secondary
  border border-border-primary
  rounded-xl
  shadow-medium
  hover:shadow-high
  transition-shadow duration-regular ease-out-quad
">
  <h3 className="text-title-3 font-semibold text-text-primary mb-2">
    카드 제목
  </h3>
  <p className="text-regular text-text-secondary">
    카드 내용입니다.
  </p>
</div>

// CSS
<div className="linear-card">
  <h3 className="title-3">카드 제목</h3>
  <p className="text-regular">카드 내용입니다.</p>
</div>

<style>
.linear-card {
  padding: 24px;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border-primary);
  border-radius: var(--radius-16);
  box-shadow: var(--shadow-medium);
  transition: box-shadow var(--speed-regular-transition) var(--ease-out-quad);
}

.linear-card:hover {
  box-shadow: var(--shadow-high);
}
</style>
```

## 🔗 참고 자료

- 원본 사이트: [https://linear.app/](https://linear.app/)
- 추출 날짜: 2025-11-14
- 추출 방법: Playwright MCP를 사용한 자동 크롤링

## 📄 라이선스

이 디자인 시스템은 Linear.app의 웹사이트에서 추출되었으며, 학습 및 참고 목적으로만 사용하시기 바랍니다.
상업적 사용을 원하는 경우 Linear의 공식 가이드라인을 확인하세요.

---

**제작**: Playwright MCP를 사용한 자동 추출
**추출 날짜**: 2025-11-14

