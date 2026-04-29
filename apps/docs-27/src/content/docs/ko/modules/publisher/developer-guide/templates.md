---
title: "템플릿 및 블록"
---

## 개요

게시자는 사이드바/위젯 통합을 위한 기사 및 블록을 표시하기 위한 사용자 정의 가능한 템플릿을 제공합니다. 이 가이드에서는 템플릿 사용자 정의 및 블록 구성을 다룹니다.

## 템플릿 파일

### 핵심 템플릿

| 템플릿 | 목적 |
|----------|---------|
| `publisher_index.tpl` | 모듈 홈페이지 |
| `publisher_item.tpl` | 단일 기사 보기 |
| `publisher_category.tpl` | 카테고리 목록 |
| `publisher_archive.tpl` | 아카이브 페이지 |
| `publisher_search.tpl` | 검색결과 |
| `publisher_submit.tpl` | 기사 제출 양식 |
| `publisher_print.tpl` | 인쇄용 보기 |

### 블록 템플릿

| 템플릿 | 목적 |
|----------|---------|
| `publisher_block_latest.tpl` | 최신 기사 블록 |
| `publisher_block_spotlight.tpl` | 주요 기사 블록 |
| `publisher_block_category.tpl` | 카테고리 목록 블록 |
| `publisher_block_author.tpl` | 저자 기사 블록 |

## 템플릿 변수

### 기사 변수

```smarty
{* Available in publisher_item.tpl *}
<{$item.title}>           {* Article title *}
<{$item.body}>            {* Full content *}
<{$item.summary}>         {* Summary/excerpt *}
<{$item.author}>          {* Author name *}
<{$item.authorid}>        {* Author user ID *}
<{$item.datesub}>         {* Publication date *}
<{$item.datemodified}>    {* Last modified date *}
<{$item.counter}>         {* View count *}
<{$item.rating}>          {* Average rating *}
<{$item.votes}>           {* Number of votes *}
<{$item.categoryname}>    {* Category name *}
<{$item.categorylink}>    {* Category URL *}
<{$item.itemurl}>         {* Article URL *}
<{$item.image}>           {* Featured image *}
```

### 카테고리 변수

```smarty
{* Available in publisher_category.tpl *}
<{$category.name}>        {* Category name *}
<{$category.description}> {* Category description *}
<{$category.image}>       {* Category image *}
<{$category.total}>       {* Article count *}
<{$category.link}>        {* Category URL *}
```

## 템플릿 사용자 정의

### 위치 재정의

템플릿을 테마에 복사하여 맞춤설정하세요.

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
└── blocks/
    └── publisher_block_latest.tpl
```

### 예: 맞춤 기사 템플릿

```smarty
{* themes/mytheme/modules/publisher/publisher_item.tpl *}
<article class="publisher-article">
    <header>
        <h1><{$item.title}></h1>
        <div class="meta">
            <span class="author">By <{$item.author}></span>
            <span class="date"><{$item.datesub}></span>
            <span class="category">
                <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
            </span>
        </div>
    </header>

    <{if $item.image}>
    <figure class="featured-image">
        <img src="<{$item.image}>" alt="<{$item.title}>">
    </figure>
    <{/if}>

    <div class="content">
        <{$item.body}>
    </div>

    <footer>
        <{if $item.who_when}>
            <p class="attribution"><{$item.who_when}></p>
        <{/if}>

        <div class="actions">
            <{if $can_edit}>
                <a href="<{$xoops_url}>/modules/publisher/submit.php?itemid=<{$item.itemid}>">
                    Edit Article
                </a>
            <{/if}>
            <a href="<{$item.printlink}>" target="_blank">Print</a>
            <a href="<{$item.maillink}>">Email</a>
        </div>
    </footer>
</article>
```

## 블록

### 사용 가능한 블록

| 블록 | 설명 |
|-------|-------------|
| 최신 뉴스 | 최근 기사 표시 |
| 스포트라이트 | 주요 기사 하이라이트 |
| 카테고리 메뉴 | 카테고리 탐색 |
| 아카이브 | 아카이브 링크 |
| 탑 오써 | 가장 활동적인 작가 |
| 인기상품 | 가장 많이 본 기사 |

### 차단 옵션

#### 최신 뉴스 블록

| 옵션 | 설명 |
|--------|-------------|
| 표시 항목 | 기사수 |
| 카테고리 필터 | 특정 카테고리로 제한 |
| 요약 표시 | 기사 발췌 표시 |
| 제목 길이 | 제목 자르기 |
| 템플릿 | 블록 템플릿 파일 |

### 사용자 정의 블록 템플릿

```smarty
{* themes/mytheme/modules/publisher/blocks/publisher_block_latest.tpl *}
<div class="publisher-latest-block">
    <{foreach item=item from=$block.items}>
    <article class="block-item">
        <h4>
            <a href="<{$item.link}>"><{$item.title}></a>
        </h4>
        <{if $block.show_summary}>
            <p><{$item.summary}></p>
        <{/if}>
        <div class="block-meta">
            <span class="date"><{$item.date}></span>
            <span class="views"><{$item.counter}> views</span>
        </div>
    </article>
    <{/foreach}>
</div>
```

## 템플릿 트릭

### 조건부 표시

```smarty
{* Show different content for different users *}
<{if $xoops_isadmin}>
    <a href="admin/item.php?op=edit&itemid=<{$item.itemid}>">Admin Edit</a>
<{elseif $item.uid == $xoops_userid}>
    <a href="submit.php?itemid=<{$item.itemid}>">Edit Your Article</a>
<{/if}>
```

### 사용자 정의 CSS 클래스

```smarty
{* Add status-based styling *}
<article class="article <{$item.status}>">
    {* Content *}
</article>
```

### 날짜 형식

```smarty
{* Format dates with Smarty *}
<time datetime="<{$item.datesub|date_format:'%Y-%m-%d'}>">
    <{$item.datesub|date_format:$xoops_config.dateformat}>
</time>
```

## 관련 문서

-../User-Guide/Basic-Configuration - 모듈 설정
-../User-Guide/Creating-Articles - 콘텐츠 관리
-../../04-API-참조/템플릿/템플릿-시스템 - XOOPS 템플릿 엔진
-../../02-Core-Concepts/Themes/Theme-Development - 테마 사용자 정의
