---
title: "템플릿 변수"
description: "XOOPS 템플릿에서 사용 가능한 Smarty 변수"
---

XOOPS는 Smarty 템플릿에 많은 변수를 자동으로 제공합니다. 이 참조 문서에는 테마 및 모듈 템플릿 개발에 사용 가능한 변수가 나와 있습니다.

## 관련 문서

- Smarty-기본 - XOOPS의 Smarty 기본 사항
- 테마 개발 - XOOPS 테마 제작
- Smarty-4-마이그레이션 - Smarty 3에서 4로 업그레이드

## 전역 테마 변수

이러한 변수는 테마 템플릿(`theme.tpl`)에서 사용할 수 있습니다.

### 사이트 정보

| 변수 | 설명 | 예 |
|----------|-------------|---------|
| `$xoops_sitename` | 환경설정의 사이트 이름 | `"My XOOPS Site"` |
| `$xoops_pagetitle` | 현재 페이지 제목 | `"Welcome"` |
| `$xoops_slogan` | 사이트 슬로건 | `"Just Use It!"` |
| `$xoops_url` | 전체 XOOPS URL | `"https://example.com"` |
| `$xoops_langcode` | 언어 코드 | `"en"` |
| `$xoops_charset` | 문자 세트 | `"UTF-8"` |

### 메타 태그

| 변수 | 설명 |
|----------|-------------|
| `$xoops_meta_keywords` | 메타 키워드 |
| `$xoops_meta_description` | 메타 설명 |
| `$xoops_meta_robots` | 로봇 메타 태그 |
| `$xoops_meta_rating` | 콘텐츠 등급 |
| `$xoops_meta_author` | 작성자 메타 태그 |
| `$xoops_meta_copyright` | 저작권 고지 |

### 테마정보

| 변수 | 설명 |
|----------|-------------|
| `$xoops_theme` | 현재 테마 이름 |
| `$xoops_imageurl` | 테마 이미지 디렉토리 URL |
| `$xoops_themecss` | 메인 테마 CSS 파일 URL |
| `$xoops_icons32_url` | 32x32 아이콘 URL |
| `$xoops_icons16_url` | 16x16 아이콘 URL |

### 페이지 콘텐츠

| 변수 | 설명 |
|----------|-------------|
| `$xoops_contents` | 메인페이지 내용 |
| `$xoops_module_header` | 모듈별 헤드 내용 |
| `$xoops_footer` | 바닥글 내용 |
| `$xoops_js` | 포함할 JavaScript |

### 탐색 및 메뉴

| 변수 | 설명 |
|----------|-------------|
| `$xoops_mainmenu` | 기본 탐색 메뉴 |
| `$xoops_usermenu` | 사용자 메뉴 |

### 블록 변수

| 변수 | 설명 |
|----------|-------------|
| `$xoops_lblocks` | 왼쪽 블록 배열 |
| `$xoops_rblocks` | 오른쪽 블록 배열 |
| `$xoops_cblocks` | 중앙 블록 배열 |
| `$xoops_showlblock` | 왼쪽 블록 표시(불리언) |
| `$xoops_showrblock` | 오른쪽 블록 표시(불리언) |
| `$xoops_showcblock` | 중앙 블록 표시(불리언) |

## 사용자 변수

사용자가 로그인한 경우:

| 변수 | 설명 |
|----------|-------------|
| `$xoops_isuser` | 사용자가 로그인되었습니다(불리언) |
| `$xoops_isadmin` | 사용자는 관리자입니다(불리언) |
| `$xoops_userid` | 사용자 ID |
| `$xoops_uname` | 사용자 이름 |
| `$xoops_isowner` | 사용자가 현재 콘텐츠를 소유함(불리언) |

### 사용자 개체 속성에 액세스

```smarty
<{if $xoops_isuser}>
    <p>Welcome, <{$xoops_uname}>!</p>
    <p>Your email: <{$xoopsUser->getVar('email')}>}</p>
    <p>Joined: <{$xoopsUser->getVar('user_regdate')|date_format:"%Y-%m-%d"}>}</p>
<{else}>
    <p>Welcome, Guest!</p>
<{/if}>
```

## 모듈 변수

모듈 템플릿에서:

| 변수 | 설명 |
|----------|-------------|
| `$xoops_dirname` | 모듈 디렉토리 이름 |
| `$xoops_modulename` | 모듈 표시 이름 |
| `$mod_url` | 모듈 URL(지정된 경우) |

### 공통 모듈 템플릿 패턴

```php
// In PHP
$helper = \XoopsModules\MyModule\Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_name', $helper->getModule()->getVar('name'));
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Back to <{$mod_name}></a>
```

## 블록 변수

`$xoops_lblocks`, `$xoops_rblocks` 및 `$xoops_cblocks`의 각 블록에는 다음이 포함됩니다.

| 부동산 | 설명 |
|----------|-------------|
| `$block.id` | 블록 ID |
| `$block.title` | 블록 제목 |
| `$block.content` | HTML 콘텐츠 차단 |
| `$block.template` | 블록 템플릿 이름 |
| `$block.module` | 모듈 이름 |
| `$block.weight` | 블록 무게/순서 |

### 블록 표시 예

```smarty
<{foreach item=block from=$xoops_lblocks}>
<div class="block block-<{$block.module}>">
    <{if $block.title}>
    <h3 class="block-title"><{$block.title}></h3>
    <{/if}>
    <div class="block-content">
        <{$block.content}>
    </div>
</div>
<{/foreach}>
```

## 양식 변수

XoopsForm 클래스를 사용하는 경우:

```php
// PHP
$form = new XoopsThemeForm('Edit Item', 'edit_form', 'save.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $title));
$GLOBALS['xoopsTpl']->assign('form', $form->render());
```

```smarty
{* Template *}
<div class="form-container">
    <{$form}>
</div>
```

## 페이지 매김 변수

```php
// PHP
include_once XOOPS_ROOT_PATH . '/class/pagenav.php';
$pagenav = new XoopsPageNav($total, $limit, $start, 'start');
$GLOBALS['xoopsTpl']->assign('page_nav', $pagenav->renderNav());
```

```smarty
{* Template *}
<{if $page_nav}>
<div class="pagination">
    <{$page_nav}>
</div>
<{/if}>
```

## 맞춤 변수 할당

### 간단한 값

```php
$GLOBALS['xoopsTpl']->assign('my_title', 'Custom Title');
$GLOBALS['xoopsTpl']->assign('item_count', 42);
$GLOBALS['xoopsTpl']->assign('is_featured', true);
```

```smarty
<h1><{$my_title}></h1>
<p><{$item_count}> items found</p>
<{if $is_featured}>Featured!<{/if}>
```

### 배열

```php
$items = [
    ['id' => 1, 'name' => 'Item One', 'price' => 10.99],
    ['id' => 2, 'name' => 'Item Two', 'price' => 20.50],
];
$GLOBALS['xoopsTpl']->assign('items', $items);
```

```smarty
<ul>
<{foreach $items as $item}>
    <li>
        <{$item.name}> - $<{$item.price|string_format:"%.2f"}>
    </li>
<{/foreach}>
</ul>
```

### 객체

```php
$item = $itemHandler->get($itemId);
$GLOBALS['xoopsTpl']->assign('item', $item->toArray());

// Or for XoopsObject
$GLOBALS['xoopsTpl']->assign('item_obj', $item);
```

```smarty
{* Array access *}
<h2><{$item.title}></h2>
<p><{$item.content}></p>

{* Object method access *}
<h2><{$item_obj->getVar('title')}></h2>
```

### 중첩 배열

```php
$category = [
    'id' => 1,
    'name' => 'Technology',
    'items' => [
        ['id' => 1, 'title' => 'Article 1'],
        ['id' => 2, 'title' => 'Article 2'],
    ]
];
$GLOBALS['xoopsTpl']->assign('category', $category);
```

```smarty
<h2><{$category.name}></h2>
<ul>
<{foreach $category.items as $item}>
    <li><{$item.title}></li>
<{/foreach}>
</ul>
```

## Smarty 내장 변수

### $smarty.now

현재 타임스탬프:

```smarty
<p>Current year: <{$smarty.now|date_format:"%Y"}></p>
<p>Current date: <{$smarty.now|date_format:"%Y-%m-%d"}></p>
<p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
```

### $smarty.const

PHP 상수에 액세스:

```smarty
<p>XOOPS URL: <{$smarty.const.XOOPS_URL}></p>
<p>Root Path: <{$smarty.const.XOOPS_ROOT_PATH}></p>
<p>Upload Path: <{$smarty.const.XOOPS_UPLOAD_PATH}></p>
```

### $smarty.get, $smarty.post, $smarty.request

액세스 요청 변수(주의해서 사용):

```smarty
{* Only for reading, always escape output! *}
<{if $smarty.get.page}>
    Page: <{$smarty.get.page|escape}>
<{/if}>
```

### $smarty.server

서버 변수:

```smarty
<p>Server: <{$smarty.server.SERVER_NAME}></p>
<p>Request URI: <{$smarty.server.REQUEST_URI|escape}></p>
```

### $smarty.foreach

루프 정보:

```smarty
<{foreach $items as $item name=itemloop}>
    <{* Index (0-based) *}>
    Index: <{$smarty.foreach.itemloop.index}>

    <{* Iteration (1-based) *}>
    Number: <{$smarty.foreach.itemloop.iteration}>

    <{* First item *}>
    <{if $smarty.foreach.itemloop.first}>First Item!<{/if}>

    <{* Last item *}>
    <{if $smarty.foreach.itemloop.last}>Last Item!<{/if}>

    <{* Total count *}>
    Total: <{$smarty.foreach.itemloop.total}>
<{/foreach}>
```

## XMF 도우미 변수

XMF를 사용할 때 추가 도우미를 사용할 수 있습니다.

```php
// In PHP
use Xmf\Module\Helper;

$helper = Helper::getInstance();
$GLOBALS['xoopsTpl']->assign('mod_config', $helper->getConfig());
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
$GLOBALS['xoopsTpl']->assign('mod_path', $helper->path());
```

```smarty
{* In template *}
<a href="<{$mod_url}>">Module Home</a>
<{if $mod_config.show_breadcrumb}>
    {* Breadcrumb HTML *}
<{/if}>
```

## 이미지 및 자산 URL

```smarty
{* Theme images *}
<img src="<{$xoops_imageurl}>images/logo.png" alt="Logo">

{* Module images *}
<img src="<{$xoops_url}>/modules/<{$xoops_dirname}>/assets/images/icon.png">

{* Upload directory *}
<img src="<{$xoops_url}>/uploads/mymodule/<{$item.image}>">

{* Using icons *}
<img src="<{$xoops_icons32_url}>edit.png" alt="Edit">
<img src="<{$xoops_icons16_url}>delete.png" alt="Delete">
```

## 사용자 기반 조건부 표시

```smarty
{* Show only to logged-in users *}
<{if $xoops_isuser}>
    <a href="<{$xoops_url}>/modules/profile/">My Profile</a>
    <a href="<{$xoops_url}>/user.php?op=logout">Logout</a>
<{else}>
    <a href="<{$xoops_url}>/user.php">Login</a>
    <a href="<{$xoops_url}>/register.php">Register</a>
<{/if}>

{* Show only to admins *}
<{if $xoops_isadmin}>
    <a href="<{$xoops_url}>/admin.php">Admin Panel</a>
<{/if}>

{* Show only to content owner *}
<{if $xoops_isowner || $xoops_isadmin}>
    <a href="edit.php?id=<{$item.id}>">Edit</a>
    <a href="delete.php?id=<{$item.id}>">Delete</a>
<{/if}>
```

## 언어 변수

```php
// In PHP - load language file
xoops_loadLanguage('main', 'mymodule');

// Assign language constants
$GLOBALS['xoopsTpl']->assign('lang_title', _MD_MYMODULE_TITLE);
$GLOBALS['xoopsTpl']->assign('lang_submit', _SUBMIT);
```

```smarty
{* In template *}
<h1><{$lang_title}></h1>
<button type="submit"><{$lang_submit}></button>
```

또는 상수를 직접 사용하십시오.

```smarty
<h1><{$smarty.const._MD_MYMODULE_TITLE}></h1>
```

## 디버깅 변수

사용 가능한 모든 변수를 보려면:

```smarty
{* Display debug console *}
<{debug}>

{* Print specific variable *}
<pre><{$myvar|@print_r}></pre>

{* Export variable *}
<pre><{$myvar|@var_export}></pre>
```

---

#smarty #템플릿 #변수 #xoops #참조
