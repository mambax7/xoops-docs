---
title: "테마 구조"
---

## 개요

XOOPS 테마는 사이트의 시각적 표현을 제어합니다. 테마 구조를 이해하는 것은 사용자 정의 및 새로운 테마 생성에 필수적입니다.

## 디렉토리 레이아웃

```
themes/mytheme/
├── theme.html                  # Main layout template
├── theme.ini                   # Theme configuration
├── theme_blockleft.html        # Left sidebar block template
├── theme_blockright.html       # Right sidebar block template
├── theme_blockcenter_c.html    # Center block (centered)
├── theme_blockcenter_l.html    # Center block (left-aligned)
├── theme_blockcenter_r.html    # Center block (right-aligned)
├── css/
│   ├── style.css              # Main stylesheet
│   ├── admin.css              # Admin customizations (optional)
│   └── print.css              # Print stylesheet (optional)
├── js/
│   └── theme.js               # Theme JavaScript
├── images/
│   ├── logo.png               # Site logo
│   └── icons/                 # Theme icons
├── language/
│   └── english/
│       └── main.php           # Theme translations
├── modules/                    # Module template overrides
│   └── news/
│       └── news_index.tpl
└── screenshot.png             # Theme preview image
```

## 필수 파일

### theme.html

모든 콘텐츠를 래핑하는 기본 레이아웃 템플릿:

```html
<!DOCTYPE html>
<html lang="<{$xoops_langcode}>">
<head>
    <meta charset="<{$xoops_charset}>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><{$xoops_sitename}> - <{$xoops_pagetitle}></title>
    <meta name="description" content="<{$xoops_meta_description}>">
    <meta name="keywords" content="<{$xoops_meta_keywords}>">

    {* Module-specific headers *}
    <{$xoops_module_header}>

    {* Theme stylesheets *}
    <link rel="stylesheet" href="<{$xoops_url}>/themes/<{$xoops_theme}>/css/style.css">
</head>
<body class="<{$xoops_dirname}>">
    <header class="site-header">
        <a href="<{$xoops_url}>" class="logo">
            <img src="<{$xoops_url}>/themes/<{$xoops_theme}>/images/logo.png"
                 alt="<{$xoops_sitename}>">
        </a>
        <nav class="main-nav">
            <{$xoops_mainmenu}>
        </nav>
    </header>

    <div class="page-container">
        {* Left sidebar *}
        <{if $xoops_showlblock == 1}>
        <aside class="sidebar-left">
            <{foreach item=block from=$xoops_lblocks}>
                <{include file="theme:theme_blockleft.html"}>
            <{/foreach}>
        </aside>
        <{/if}>

        {* Main content *}
        <main class="content">
            <{$xoops_contents}>
        </main>

        {* Right sidebar *}
        <{if $xoops_showrblock == 1}>
        <aside class="sidebar-right">
            <{foreach item=block from=$xoops_rblocks}>
                <{include file="theme:theme_blockright.html"}>
            <{/foreach}>
        </aside>
        <{/if}>
    </div>

    <footer class="site-footer">
        <{$xoops_footer}>
    </footer>

    {* Module-specific footers *}
    <{$xoops_module_footer}>
</body>
</html>
```

### theme.ini

테마 구성 파일:

```ini
[Theme]
name = "My Theme"
version = "1.0.0"
author = "Your Name"
license = "GPL-2.0"
description = "A modern responsive theme"

[Screenshots]
screenshot = "screenshot.png"

[Options]
responsive = true
bootstrap = false

[Settings]
primary_color = "#3498db"
secondary_color = "#2c3e50"
```

### 블록 템플릿

```html
{* theme_blockleft.html *}
<section class="block block-left" id="block-<{$block.id}>">
    <{if $block.title}>
        <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</section>
```

## 템플릿 변수

### 전역 변수

| 변수 | 설명 |
|----------|-------------|
| `$xoops_sitename` | 사이트 이름 |
| `$xoops_url` | 사이트 URL |
| `$xoops_theme` | 현재 테마 이름 |
| `$xoops_langcode` | 언어 코드 |
| `$xoops_charset` | 문자 인코딩 |
| `$xoops_pagetitle` | 페이지 제목 |
| `$xoops_dirname` | 현재 모듈 이름 |

### 사용자 변수

| 변수 | 설명 |
|----------|-------------|
| `$xoops_isuser` | 로그인됨 |
| `$xoops_isadmin` | 관리자임 |
| `$xoops_userid` | 사용자 ID |
| `$xoops_uname` | 사용자 이름 |

### 레이아웃 변수

| 변수 | 설명 |
|----------|-------------|
| `$xoops_showlblock` | 왼쪽 블록 표시 |
| `$xoops_showrblock` | 오른쪽 블록 표시 |
| `$xoops_showcblock` | 중앙 블록 표시 |
| `$xoops_lblocks` | 왼쪽 블록 배열 |
| `$xoops_rblocks` | 오른쪽 블록 배열 |
| `$xoops_contents` | 메인페이지 내용 |

## 모듈 템플릿 재정의

모듈 템플릿을 테마에 배치하여 재정의합니다.

```
themes/mytheme/modules/
└── news/
    ├── news_index.tpl      # Overrides news module's index
    └── news_article.tpl    # Overrides article display
```

## CSS 조직

```css
/* css/style.css */

/* === Variables === */
:root {
    --primary-color: #3498db;
    --text-color: #333;
    --bg-color: #fff;
}

/* === Base === */
body {
    font-family: system-ui, sans-serif;
    color: var(--text-color);
    background: var(--bg-color);
}

/* === Layout === */
.page-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 20px;
    max-width: 1200px;
    margin: 0 auto;
}

/* === Components === */
.block {
    margin-bottom: 20px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 4px;
}

.block-title {
    margin: 0 0 10px;
    font-size: 1.1em;
}

/* === Responsive === */
@media (max-width: 768px) {
    .page-container {
        grid-template-columns: 1fr;
    }

    .sidebar-left,
    .sidebar-right {
        order: 2;
    }
}
```

## 관련 문서

-../Templates/Smarty-템플릿 - 템플릿 구문
- 테마 개발 - 전체 테마 가이드
- CSS 모범 사례 - 스타일 지정 지침 
-../../03-모듈-개발/블록-개발 - 블록 생성

