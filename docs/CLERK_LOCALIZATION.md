# Clerk 한국어 로컬라이제이션 가이드

이 문서는 Clerk 컴포넌트를 한국어로 설정하는 방법을 설명합니다.

## 📋 목차

1. [현재 설정 상태](#현재-설정-상태)
2. [기본 한국어 설정](#기본-한국어-설정)
3. [커스텀 로컬라이제이션](#커스텀-로컬라이제이션)
4. [에러 메시지 커스터마이징](#에러-메시지-커스터마이징)
5. [문제 해결](#문제-해결)

## 현재 설정 상태

프로젝트는 이미 한국어 로컬라이제이션이 설정되어 있습니다:

- ✅ `@clerk/localizations` 패키지 설치됨 (v3.26.3)
- ✅ `app/layout.tsx`에서 `koKR` import 및 적용
- ✅ `html lang="ko"` 설정됨

## 기본 한국어 설정

### 1. 패키지 설치 확인

`@clerk/localizations` 패키지가 설치되어 있는지 확인:

```bash
pnpm list @clerk/localizations
```

설치되어 있지 않다면:

```bash
pnpm add @clerk/localizations
```

### 2. 현재 설정 확인

`app/layout.tsx` 파일에서 다음과 같이 설정되어 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={koKR}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

이 설정으로 모든 Clerk 컴포넌트가 한국어로 표시됩니다:

- 로그인/회원가입 폼
- 에러 메시지
- 버튼 텍스트
- 입력 필드 레이블

## 커스텀 로컬라이제이션

기본 한국어 번역을 사용하면서 특정 텍스트만 커스터마이징할 수 있습니다.

### 예시: 로그인 페이지 제목 변경

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

const customKoKR = {
  ...koKR,
  signIn: {
    ...koKR.signIn,
    title: "환영합니다!",
    subtitle: "계정에 로그인하세요",
  },
  signUp: {
    ...koKR.signUp,
    title: "계정 만들기",
    subtitle: "새로운 계정을 생성하세요",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 커스터마이징 가능한 주요 섹션

```tsx
const customKoKR = {
  ...koKR,
  // 로그인 관련
  signIn: {
    start: {
      title: "로그인",
      subtitle: "계정에 로그인하세요",
    },
    emailCode: {
      title: "이메일 인증 코드 입력",
      subtitle: "이메일로 전송된 코드를 입력하세요",
    },
    // ... 기타 필드
  },

  // 회원가입 관련
  signUp: {
    start: {
      title: "계정 만들기",
      subtitle: "새로운 계정을 생성하세요",
    },
    // ... 기타 필드
  },

  // 사용자 프로필 관련
  userProfile: {
    // ... 프로필 관련 텍스트
  },

  // 기타 컴포넌트
  // ...
};
```

## 에러 메시지 커스터마이징

특정 에러 메시지를 커스터마이징할 수 있습니다.

### 예시: 접근 거부 에러 메시지 변경

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";

const customKoKR = {
  ...koKR,
  unstable__errors: {
    ...koKR.unstable__errors,
    not_allowed_access:
      "접근이 제한된 이메일 도메인입니다. 접근을 원하시면 관리자에게 문의해주세요.",
    form_identifier_not_found:
      "입력하신 이메일 또는 사용자명을 찾을 수 없습니다.",
    form_password_incorrect: "비밀번호가 올바르지 않습니다. 다시 시도해주세요.",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customKoKR}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 사용 가능한 에러 키 목록

전체 에러 키 목록은 [Clerk 공식 GitHub 저장소](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)의 `unstable__errors` 객체를 참고하세요.

주요 에러 키:

- `not_allowed_access`: 접근이 허용되지 않음
- `form_identifier_not_found`: 사용자를 찾을 수 없음
- `form_password_incorrect`: 비밀번호가 올바르지 않음
- `form_code_incorrect`: 인증 코드가 올바르지 않음
- `form_param_format_invalid`: 입력 형식이 올바르지 않음
- `form_param_nil`: 필수 입력 필드가 비어있음

## 문제 해결

### 문제 1: 한국어가 적용되지 않음

**증상**: Clerk 컴포넌트가 여전히 영어로 표시됨

**해결 방법**:

1. `@clerk/localizations` 패키지가 설치되어 있는지 확인
2. `koKR`이 올바르게 import되었는지 확인
3. `ClerkProvider`에 `localization={koKR}` prop이 전달되었는지 확인
4. 개발 서버를 재시작: `pnpm dev`

### 문제 2: 일부 텍스트만 영어로 표시됨

**증상**: 대부분은 한국어인데 일부만 영어

**해결 방법**:

1. 해당 텍스트가 커스터마이징 가능한지 확인
2. 커스텀 로컬라이제이션 객체에 해당 필드 추가
3. [Clerk 공식 문서](https://clerk.com/docs/guides/customizing-clerk/localization)에서 해당 필드의 경로 확인

### 문제 3: 에러 메시지가 영어로 표시됨

**증상**: 에러 메시지만 영어로 표시됨

**해결 방법**:

1. `unstable__errors` 객체에 해당 에러 키 추가
2. 에러 키 이름이 정확한지 확인 (대소문자 구분)
3. 전체 에러 키 목록 확인 후 누락된 키 추가

### 문제 4: Account Portal이 여전히 영어

**증상**: Clerk Account Portal이 영어로 표시됨

**해결 방법**:

- ⚠️ **주의**: 로컬라이제이션은 Clerk 컴포넌트에만 적용됩니다
- Account Portal은 Clerk가 호스팅하는 페이지이므로 영어로 유지됩니다
- 이는 정상 동작이며, 현재로서는 변경할 수 없습니다

## 고급 사용법

### 조건부 로컬라이제이션

사용자 언어 설정에 따라 동적으로 로컬라이제이션을 변경할 수 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";
import { koKR, enUS } from "@clerk/localizations";

export default function RootLayout({ children }) {
  // 예시: 사용자 언어 설정에 따라 변경
  const locale = "ko"; // 실제로는 사용자 설정에서 가져옴

  return (
    <ClerkProvider localization={locale === "ko" ? koKR : enUS}>
      <html lang={locale}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

### 완전 커스텀 로컬라이제이션

기본 `koKR`을 사용하지 않고 완전히 커스텀 로컬라이제이션을 만들 수도 있습니다:

```tsx
import { ClerkProvider } from "@clerk/nextjs";

const customLocalization = {
  signIn: {
    start: {
      title: "로그인",
      subtitle: "계정에 로그인하세요",
    },
    // ... 모든 필드 정의
  },
  // ... 기타 모든 섹션 정의
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider localization={customLocalization}>
      <html lang="ko">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

> 💡 **참고**: 완전 커스텀 로컬라이제이션은 유지보수가 어려우므로, 가능하면 `koKR`을 확장하는 방식을 권장합니다.

## 추가 리소스

- [Clerk 공식 로컬라이제이션 가이드](https://clerk.com/docs/guides/customizing-clerk/localization)
- [Clerk Localizations GitHub 저장소](https://github.com/clerk/javascript/tree/main/packages/localizations)
- [영어 로컬라이제이션 파일 (참고용)](https://github.com/clerk/javascript/blob/main/packages/localizations/src/en-US.ts)

## 요약

✅ **현재 상태**:

- 한국어 로컬라이제이션이 이미 설정되어 있음
- 모든 Clerk 컴포넌트가 한국어로 표시됨
- 필요시 커스터마이징 가능

✅ **다음 단계**:

- 특정 텍스트를 변경하고 싶다면 커스텀 로컬라이제이션 사용
- 에러 메시지를 커스터마이징하려면 `unstable__errors` 객체 사용
- 문제가 발생하면 위의 문제 해결 섹션 참고

이제 Clerk 컴포넌트가 완전히 한국어로 표시됩니다! 🎉
