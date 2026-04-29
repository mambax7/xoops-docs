---
title: "첫 페이지 만들기"
description: "형식 지정, 미디어 삽입 및 게시 옵션을 포함하여 XOOPS에서 콘텐츠를 만들고 게시하는 방법에 대한 단계별 가이드"
---

# XOOPS에서 첫 페이지 만들기

XOOPS에서 첫 번째 콘텐츠를 생성, 형식화 및 게시하는 방법을 알아보세요.

## XOOPS 콘텐츠 이해하기

### 페이지/게시물이란 무엇입니까?

XOOPS에서는 콘텐츠가 모듈을 통해 관리됩니다. 가장 일반적인 콘텐츠 유형은 다음과 같습니다.

| 유형 | 설명 | 사용 사례 |
|---|---|---|
| **페이지** | 정적 콘텐츠 | 회사 소개, 연락처, 서비스 |
| **게시물/기사** | 타임스탬프가 표시된 콘텐츠 | 뉴스, 블로그 게시물 |
| **카테고리** | 콘텐츠 구성 | 그룹 관련 콘텐츠 |
| **댓글** | 사용자 피드백 | 방문자 상호 작용 허용 |

이 가이드에서는 XOOPS의 기본 콘텐츠 모듈을 사용하여 기본 페이지/기사를 만드는 방법을 다룹니다.

## 콘텐츠 편집기에 액세스하기

### 관리자 패널에서

1. 관리자 패널에 로그인하세요: `http://your-domain.com/xoops/admin/`
2. **콘텐츠 > 페이지**(또는 콘텐츠 모듈)로 이동합니다.
3. '새 페이지 추가' 또는 '새 게시물'을 클릭하세요.

### 프런트엔드(활성화된 경우)

XOOPS가 프런트엔드 콘텐츠 생성을 허용하도록 구성된 경우:

1. 등록된 사용자로 로그인
2. 프로필로 이동
3. "콘텐츠 제출" 옵션을 찾으세요
4. 아래와 같은 단계를 따르세요.

## 콘텐츠 편집기 인터페이스

콘텐츠 편집기에는 다음이 포함됩니다.

```
┌─────────────────────────────────────┐
│ Content Editor                      │
├─────────────────────────────────────┤
│                                     │
│ Title: [________________]           │
│                                     │
│ Category: [Dropdown]                │
│                                     │
│ [B I U] [Link] [Image] [Video]    │
│ ┌─────────────────────────────────┐ │
│ │ Enter your content here...      │ │
│ │                                 │ │
│ │ You can use HTML tags here      │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description (Meta): [____________]  │
│                                     │
│ [Publish] [Save Draft] [Preview]   │
│                                     │
└─────────────────────────────────────┘
```

## 단계별 가이드: 첫 페이지 만들기

### 1단계: 콘텐츠 편집기에 액세스

1. 관리자 패널에서 **콘텐츠 > 페이지**를 클릭하세요.
2. **"새 페이지 추가"** 또는 **"만들기"**를 클릭하세요.
3. 콘텐츠 편집기가 표시됩니다.

### 2단계: 페이지 제목 입력

'제목' 필드에 페이지 이름을 입력하세요.

```
Title: Welcome to Our Website
```

제목 모범 사례:
- 명확하고 설명적임
- 가능하다면 키워드를 포함시키세요.
- 50~60자가 이상적입니다.
- 모두 대문자를 사용하지 마세요(읽기 어렵습니다).
- 구체적으로 작성하세요('페이지 1' 아님).

### 3단계: 카테고리 선택

이 콘텐츠를 정리할 위치를 선택하세요.

```
Category: [Dropdown ▼]
```

옵션에는 다음이 포함될 수 있습니다.
- 일반
- 뉴스
- 블로그
- 공지사항
- 서비스

카테고리가 존재하지 않는 경우 관리자에게 카테고리 생성을 요청하세요.

### 4단계: 콘텐츠 작성

컨텐츠 편집기 영역을 클릭하고 텍스트를 입력하십시오.

#### 기본 텍스트 서식

편집기 도구 모음을 사용하십시오.

| 버튼 | 액션 | 결과 |
|---|---|---|
| **ㄴ** | 굵은 글씨 | **굵은 텍스트** |
| *나* | 이탤릭체 | *기울임꼴 텍스트* |
| <u>유</u> | 밑줄 | <u>밑줄 그어진 텍스트</u> |

#### HTML 사용

XOOPS는 안전한 HTML 태그를 허용합니다. 일반적인 예:

```html
<!-- Paragraphs -->
<p>This is a paragraph.</p>

<!-- Headings -->
<h1>Main Heading</h1>
<h2>Subheading</h2>

<!-- Lists -->
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<!-- Bold and Italic -->
<strong>Bold text</strong>
<em>Italic text</em>

<!-- Links -->
<a href="https://example.com">Link text</a>

<!-- Line breaks -->
<br>

<!-- Horizontal rule -->
<hr>
```

#### 안전한 HTML 예

**권장 태그:**
- 단락: `<p>`, `<br>`
- 제목: `<h1>` ~ `<h6>`
- 텍스트: `<strong>`, `<em>`, `<u>`
- 목록: `<ul>`, `<ol>`, `<li>`
- 링크 : `<a href="">`
- 인용 부호: `<blockquote>`
- 테이블: `<table>`, `<tr>`, `<td>`

**다음 태그를 피하세요**(보안을 위해 비활성화될 수 있음):
- 스크립트: `<script>`
- 스타일: `<style>`
- Iframe: `<iframe>`(구성되지 않은 경우)
- 양식: `<form>`, `<input>`

### 5단계: 이미지 추가

#### 옵션 1: 이미지 URL 삽입

편집기 사용:

1. **이미지 삽입** 버튼(이미지 아이콘)을 클릭하세요.
2. 이미지 URL 입력: `https://example.com/image.jpg`
3. 대체 텍스트를 입력하십시오: "이미지 설명"
4. '삽입'을 클릭하세요.

해당 HTML:

```html
<img src="https://example.com/image.jpg" alt="Description">
```

#### 옵션 2: 이미지 업로드

1. 먼저 XOOPS에 이미지를 업로드하세요.
   - **콘텐츠 > 미디어 관리자**로 이동합니다.
   - 이미지 업로드
   - 이미지 URL을 복사하세요.

2. 컨텐츠 편집기에서 URL을 사용하여 삽입(위 단계)

#### 이미지 모범 사례

- 적절한 파일 크기 사용(이미지 최적화)
- 설명이 포함된 파일 이름을 사용하세요.
- 항상 대체 텍스트 포함(접근성)
- 지원되는 형식: JPG, PNG, GIF, WebP
- 권장 너비: 콘텐츠의 경우 600~800픽셀

### 6단계: 미디어 삽입

#### YouTube에서 동영상 삽입

```html
<iframe width="560" height="315"
  src="https://www.youtube.com/embed/VIDEO_ID"
  frameborder="0" allowfullscreen>
</iframe>
```

`VIDEO_ID`을 YouTube 동영상 ID로 바꿉니다.

**YouTube 동영상 ID를 찾으려면:**
1. YouTube에서 동영상을 엽니다.
2. URL은 `https://www.youtube.com/watch?v=VIDEO_ID`입니다.
3. ID(`v=` 뒤의 문자)를 복사하세요.

#### Vimeo의 동영상 삽입

```html
<iframe src="https://player.vimeo.com/video/VIDEO_ID"
  width="640" height="360" frameborder="0"
  allow="autoplay; fullscreen" allowfullscreen>
</iframe>
```

### 7단계: 메타 설명 추가

'설명' 필드에 간단한 요약을 추가합니다.

```
Description: Learn how to get started with our website.
This page provides an overview of our services and how we can help you.
```

**메타 설명 모범 사례:**
- 150~160자
- 주요 키워드 포함
- 내용을 정확하게 요약해야 합니다.
- 검색 엔진 결과에 사용됩니다.
- 설득력 있게 만드세요(사용자에게 표시됨)

### 8단계: 게시 옵션 구성

#### 게시 상태

출판 상태 선택:

```
Status: ☑ Published
```

옵션:
- **게시됨:** 공개됨
- **초안:** 관리자에게만 표시됩니다.
- **검토 보류 중:** 승인 대기 중
- **보관됨:** 숨겨졌지만 보관됨

#### 가시성

이 콘텐츠를 볼 수 있는 사람을 설정하세요.

```
Visibility: ☐ Public
           ☐ Registered Users Only
           ☐ Private (Admin Only)
```

#### 출판일

콘텐츠가 표시되는 시기를 설정합니다.

```
Publish Date: [Date Picker] [Time]
```

즉시 게시하려면 '현재'로 둡니다.

#### 댓글 허용

방문자 댓글 활성화 또는 비활성화:

```
Allow Comments: ☑ Yes
```

활성화하면 방문자가 피드백을 추가할 수 있습니다.

### 9단계: 콘텐츠 저장

다양한 저장 옵션:

```
[Publish Now]  [Save as Draft]  [Schedule]  [Preview]
```

- **지금 게시:** 즉시 공개
- **초안으로 저장:** 지금은 비공개로 유지하세요.
- **일정:** 미래 날짜/시간에 게시
- **미리보기:** 저장하기 전에 어떻게 보이는지 확인하세요.

원하는 항목을 클릭하세요.

```
Click [Publish Now]
```

### 10단계: 페이지 확인

게시 후 콘텐츠를 확인하세요.

1. 홈페이지로 이동합니다.
2. 콘텐츠 영역으로 이동
3. 새로 생성된 페이지를 찾으세요.
4. 보려면 클릭하세요.
5. 확인:
   - [ ] 콘텐츠가 올바르게 표시됩니다.
   - [ ] 이미지가 나타남
   - [ ] 형식이 좋아 보입니다.
   - [ ] 링크 작동
   - [ ] 제목 및 설명이 정확함

## 예: 전체 페이지

### 제목
```
Getting Started with XOOPS
```

### 내용
```html
<h2>Welcome to XOOPS</h2>

<p>XOOPS is a powerful and flexible open-source
content management system. It allows you to build
dynamic websites with minimal technical knowledge.</p>

<h3>Key Features</h3>

<ul>
  <li>Easy content management</li>
  <li>User registration and management</li>
  <li>Module system for extensibility</li>
  <li>Flexible theming system</li>
  <li>Built-in security features</li>
</ul>

<h3>Getting Started</h3>

<p>Here are the first steps to get your XOOPS site
running:</p>

<ol>
  <li>Configure basic settings</li>
  <li>Create your first page</li>
  <li>Set up user accounts</li>
  <li>Install additional modules</li>
  <li>Customize appearance</li>
</ol>

<img src="https://example.com/xoops-logo.jpg"
  alt="XOOPS Logo">

<p>For more information, visit
<a href="https://xoops.org/">xoops.org</a></p>
```

### 메타 설명
```
Get started with XOOPS CMS. Learn about features
and the first steps to launch your dynamic website.
```

## 고급 콘텐츠 기능

### WYSIWYG 편집기 사용

서식 있는 텍스트 편집기가 설치된 경우:

```
[B] [I] [U] [Link] [Image] [Code] [Quote]
```

HTML 없이 텍스트 서식을 지정하려면 버튼을 클릭하세요.

### 코드 블록 삽입

표시 코드 예:

```html
<pre><code>
// PHP Example
$variable = "Hello World";
echo $variable;
</code></pre>
```

### 테이블 생성

데이터를 테이블로 구성합니다.

```html
<table border="1" cellpadding="5">
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>Flexible</td>
    <td>Easy to customize</td>
  </tr>
  <tr>
    <td>Powerful</td>
    <td>Full-featured CMS</td>
  </tr>
</table>
```

### 인라인 인용문

중요한 텍스트 강조 표시:

```html
<blockquote>
"XOOPS is a powerful content management system
that empowers you to build dynamic websites."
</blockquote>
```

## 콘텐츠에 대한 SEO 모범 사례

검색 엔진에 맞게 콘텐츠를 최적화하세요.

### 제목
- 주요 키워드 포함
- 50~60자
- 페이지별로 고유함

### 메타 설명
- 자연스럽게 키워드 포함
- 150~160자
- 설득력 있고 정확함

### 내용
- 키워드를 많이 쓰지 말고 자연스럽게 작성하세요.
- 제목(h2, h3)을 적절하게 사용하세요.
- 다른 페이지에 대한 내부 링크 포함
- 모든 이미지에 대체 텍스트를 사용하세요.
- 기사의 경우 300단어 이상을 목표로 하세요.

### URL 구조
- URL을 짧고 설명적으로 유지하세요.
- 단어를 구분하려면 하이픈을 사용하세요.
- 특수문자는 피하세요
- 예: `/about-our-company`

## 콘텐츠 관리

### 기존 페이지 편집

1. **콘텐츠 > 페이지**로 이동합니다.
2. 목록에서 귀하의 페이지를 찾으세요
3. **수정** 또는 페이지 제목을 클릭합니다.
4. 변경하기
5. **업데이트**를 클릭하세요.

### 페이지 삭제

1. **콘텐츠 > 페이지**로 이동합니다.
2. 귀하의 페이지를 찾으세요
3. **삭제**를 클릭하세요.
4. 삭제 확인

### 출판 상태 변경

1. **콘텐츠 > 페이지**로 이동합니다.
2. 페이지를 찾아 **수정**을 클릭합니다.
3. 드롭다운에서 상태 변경
4. **업데이트**를 클릭하세요.

## 콘텐츠 제작 문제 해결

### 콘텐츠가 표시되지 않음

**증상:** 게시된 페이지가 웹사이트에 표시되지 않습니다.

**해결책:**
1. 출판 상태를 확인하세요: "게시됨"이어야 합니다.
2. 게시 날짜 확인: 현재 또는 과거여야 합니다.
3. 공개 여부 확인: '공개'여야 합니다.
4. 캐시 지우기: 관리 > 도구 > 캐시 지우기
5. 권한 확인: 사용자 그룹에 접근 권한이 있어야 합니다.

### 포맷이 작동하지 않음

**증상:** HTML 태그 또는 서식이 텍스트로 나타납니다.

**해결책:**
1. 모듈 설정에서 HTML이 활성화되어 있는지 확인
2. 적절한 HTML 구문을 사용하세요
3. 모든 태그를 닫습니다: `<p>Text</p>`
4. 허용된 태그만 사용하세요
5. HTML 엔터티를 사용하세요: `<`의 경우 `&lt;`, `&`의 경우 `&amp;`

### 이미지가 표시되지 않음

**증상:** 이미지에 깨진 아이콘이 표시됩니다.

**해결책:**
1. 이미지 URL이 올바른지 확인하세요.
2. 이미지 파일이 있는지 확인하세요.
3. 이미지에 대한 적절한 권한 확인
4. 대신 XOOPS에 이미지를 업로드해 보세요.
5. 외부 차단 확인(CORS가 필요할 수 있음)

### 문자 인코딩 문제

**증상:** 특수 문자가 횡설수설로 나타납니다.

**해결책:**
1. 파일을 UTF-8 인코딩으로 저장
2. 페이지 문자 집합이 UTF-8인지 확인하세요.
3. HTML 헤드에 추가: `<meta charset="UTF-8">`
4. Word에서 복사하여 붙여넣지 마세요(일반 텍스트 사용).

## 콘텐츠 작업 흐름 모범 사례

### 권장 프로세스

1. **편집기에서 먼저 작성:** 관리 콘텐츠 편집기 사용
2. **게시 전 미리보기:** 미리보기 버튼을 클릭하세요.
3. **메타데이터 추가:** 전체 제목, 설명, 태그
4. **초안으로 먼저 저장:** 작업 손실을 방지하려면 초안으로 저장하세요.
5. **최종 검토:** 출판 전 다시 읽어보세요.
6. **게시:** 준비가 되면 게시를 클릭하세요.
7. **확인:** 라이브 사이트에서 확인하세요.
8. **필요한 경우 편집:** 신속하게 수정합니다.

### 버전 관리

항상 백업을 유지하십시오:

1. **주요 변경 전:** 새 버전으로 저장 또는 백업
2. **오래된 콘텐츠 보관:** 게시되지 않은 버전 유지
3. **초안 날짜:** 명확한 이름을 사용하세요: "Page-Draft-2025-01-28"

## 여러 페이지 게시

콘텐츠 전략 만들기:

```
Homepage
├── About Us
├── Services
│   ├── Service 1
│   ├── Service 2
│   └── Service 3
├── Blog
│   ├── Article 1
│   ├── Article 2
│   └── Article 3
├── Contact
└── FAQ
```

이 구조를 따르는 페이지를 만듭니다.

## 다음 단계

첫 번째 페이지를 만든 후:

1. 사용자 계정 설정
2. 추가 모듈 설치
3. 관리 기능 살펴보기
4. 설정 구성
5. 성능 설정으로 최적화

---

**태그:** #콘텐츠 제작 #페이지 #게시 #편집자

**관련 기사:**
- 관리자 패널 개요
- 관리-사용자
- 모듈 설치
-../구성/기본-구성
