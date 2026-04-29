---
title: "xoops_version.php - 모듈 매니페스트"
---

## 개요

`xoops_version.php` 파일은 모든 XOOPS 모듈의 핵심입니다. 모듈 메타데이터, 데이터베이스 테이블, 템플릿, 블록, 구성 옵션 및 설치 후크를 정의합니다.

## 기본 구조

```php
<?php
/**
 * Module manifest file
 */

$modversion = [
    // Module identity
    'name'           => _MI_MYMODULE_NAME,
    'version'        => '1.0.0',
    'description'    => _MI_MYMODULE_DESC,
    'author'         => 'Your Name',
    'author_mail'    => 'your@email.com',
    'author_website' => 'https://yoursite.com',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0 or later',
    'license_url'    => 'https://www.gnu.org/licenses/gpl-2.0.html',
    'dirname'        => basename(__DIR__),

    // Images
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // System settings
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,
    'hasSearch'      => 1,
    'hasComments'    => 0,
    'hasNotification'=> 0,
];
```

## 전체 참조

### 모듈 식별

| 열쇠 | 유형 | 설명 |
|-----|------|-------------|
| `name` | 문자열 | 표시 이름(언어 상수 사용) |
| `version` | 문자열 | 의미론적 버전(MAJOR.MINOR.PATCH) |
| `description` | 문자열 | 모듈 설명 |
| `author` | 문자열 | 주저자명 |
| `credits` | 문자열 | 추가 기여자 |
| `license` | 문자열 | 라이센스 이름 |
| `dirname` | 문자열 | 모듈 디렉토리 이름 |

### 데이터베이스 테이블

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### 템플릿

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

### 블록

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0',  // default options
    'can_clone'   => true,
];
```

### 구성 옵션

```php
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

$modversion['config'][] = [
    'name'        => 'enable_comments',
    'title'       => '_MI_MYMODULE_ENABLE_COMMENTS',
    'description' => '',
    'formtype'    => 'yesno',
    'valuetype'   => 'int',
    'default'     => 1,
];

$modversion['config'][] = [
    'name'        => 'display_mode',
    'title'       => '_MI_MYMODULE_DISPLAY_MODE',
    'description' => '',
    'formtype'    => 'select',
    'valuetype'   => 'text',
    'default'     => 'list',
    'options'     => [
        _MI_MYMODULE_MODE_LIST => 'list',
        _MI_MYMODULE_MODE_GRID => 'grid',
    ],
];
```

### 양식 유형

| 양식 유형 | 값 유형 | 설명 |
|----------|-----------|-------------|
| `textbox` | `text`/`int` | 한 줄 입력 |
| `textarea` | `text` | 다중 라인 입력 |
| `yesno` | `int` | 예/아니요 라디오 |
| `select` | `text` | 드롭다운 선택 |
| `select_multi` | `array` | 다중 선택 |
| `group` | `int` | 그룹 선택기 |
| `group_multi` | `array` | 다중 그룹 선택기 |
| `user` | `int` | 사용자 선택기 |
| `color` | `text` | 색상 선택기 |
| `hidden` | `text` | 숨겨진 필드 |

### 메뉴 항목

```php
// Main menu
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

### 설치 후크

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### 검색 통합

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### 댓글 통합

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### 알림

```php
$modversion['hasNotification'] = 1;
$modversion['notification'] = [
    'lookup_file' => 'include/notification.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => '',
            'subscribe_from' => 'index.php',
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => '',
            'subscribe_from' => 'item.php',
            'item_name'      => 'item_id',
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SUBJ,
        ],
    ],
];
```

## 관련 문서

- 모듈 개발 - 전체 모듈 가이드
- 모듈 구조 - 디렉토리 구조
- 블록 개발 - 블록 생성
- 데이터베이스 운영 - 데이터베이스 설정
