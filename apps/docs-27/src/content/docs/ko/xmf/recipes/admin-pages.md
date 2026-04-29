---
title: "모듈 관리 페이지"
description: "XMF를 사용하여 표준화되고 앞으로 호환되는 모듈 관리 페이지 만들기"
---

`Xmf\Module\Admin` 클래스는 모듈 관리 인터페이스를 생성하는 일관된 방법을 제공합니다. 관리 페이지에 XMF를 사용하면 일관된 사용자 경험을 유지하면서 향후 XOOPS 버전과의 호환성이 보장됩니다.

## 개요

XOOPS 프레임워크의 ModuleAdmin 클래스를 사용하면 관리가 더 쉬워졌지만 해당 API는 버전에 따라 발전했습니다. `Xmf\Module\Admin` 래퍼:

- XOOPS 버전에서 작동하는 안정적인 API를 제공합니다.
- 버전 간 API 차이를 자동으로 처리합니다.
- 관리자 코드가 향후 호환되는지 확인합니다.
- 일반적인 작업에 편리한 정적 방법을 제공합니다.

## 시작하기

### 관리 인스턴스 만들기

```php
$admin = \Xmf\Module\Admin::getInstance();
```

이는 이미 호환되는 경우 `Xmf\Module\Admin` 인스턴스 또는 기본 시스템 클래스를 반환합니다.

## 아이콘 관리

### 아이콘 위치 문제

아이콘이 XOOPS 버전 간에 이동하여 유지 관리 문제가 발생했습니다. XMF는 유틸리티 방법으로 이 문제를 해결합니다.

### 아이콘 찾기

**기존 방식(버전에 따라 다름):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF 방식:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()` 메서드는 전체 URL을 반환하므로 경로 구성에 대해 걱정할 필요가 없습니다.

### 아이콘 크기

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### 메뉴 아이콘

관리자 menu.php 파일의 경우:

**기존 방식:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**XMF 방식:**
```php
// Get path to icons
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## 표준 관리 페이지

### 색인 페이지

**이전 형식:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF 형식:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### 페이지 소개

**이전 형식:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF 형식:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **참고:** 향후 XOOPS 버전에서는 PayPal 정보가 xoops_version.php에 설정됩니다. `setPaypal()` 호출은 최신 버전과의 호환성을 보장하지만 최신 버전에는 영향을 미치지 않습니다.

## 탐색

### 탐색 메뉴 표시

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## 정보 상자

### 정보 상자 만들기

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add an info box
$admin->addInfoBox('Module Statistics');

// Add lines to the info box
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Display the info box
$admin->displayInfoBox();
```

## 구성 상자

구성 상자에는 시스템 요구 사항 및 상태 확인이 표시됩니다.

### 기본 구성 라인

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add a simple message
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Check if directory exists
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Check directory with permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Check if module is installed
$admin->addConfigBoxLine('xlanguage', 'module');

// Check module with warning instead of error if missing
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### 편의 방법

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add error message
$admin->addConfigError('Upload directory is not writable');

// Add success/accept message
$admin->addConfigAccept('Database tables verified');

// Add warning message
$admin->addConfigWarning('Cache directory should be cleared');

// Check module version
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### 구성 상자 유형

| 유형 | 가치 | 행동 |
|------|-------|----------|
| `default` | 메시지 문자열 | 메시지를 직접 표시 |
| `folder` | 디렉토리 경로 | 존재하는 경우 승인을 표시하고, 존재하지 않는 경우 오류를 표시 |
| `chmod` | `[path, permission]` | 권한이 있는 디렉토리가 존재하는지 확인 |
| `module` | 모듈 이름 | 설치되어 있으면 승인하고, 그렇지 않으면 오류 |
| `module` | `[name, 'warning']` | 설치된 경우 승인, 그렇지 않은 경우 경고 |

## 아이템 버튼

관리 페이지에 작업 버튼을 추가합니다:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Add buttons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Display buttons (left aligned by default)
$admin->displayButton('left');

// Or get HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## 전체 관리 페이지 예시

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Display navigation
$adminObject->displayNavigation(basename(__FILE__));

// Add info box with statistics
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Check configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Check optional modules
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Display the index page
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Get operation
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Add action buttons
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // List items
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Display table
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Form handling code...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Set PayPal ID for donations (optional)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Display about page
// Pass false to hide XOOPS logo, true to show it
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### 메뉴.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Get icon path using XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Items
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Categories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// About
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## API 참조

### 정적 메소드

| 방법 | 설명 |
|--------|-------------|
| `getInstance()` | 관리 인스턴스 가져오기 |
| `iconUrl($name, $size)` | 아이콘 URL 가져오기(크기: 16 또는 32) |
| `menuIconPath($image)` | menu.php의 아이콘 경로 가져오기 |
| `setPaypal($paypal)` | 정보 페이지의 PayPal ID 설정 |

### 인스턴스 메소드

| 방법 | 설명 |
|--------|-------------|
| `displayNavigation($menu)` | 탐색 메뉴 표시 |
| `renderNavigation($menu)` | 탐색 HTML 반환 |
| `addInfoBox($title)` | 정보 상자 추가 |
| `addInfoBoxLine($text, $type, $color)` | 정보 상자에 줄 추가 |
| `displayInfoBox()` | 정보 상자 표시 |
| `renderInfoBox()` | 정보 상자 HTML 반환 |
| `addConfigBoxLine($value, $type)` | 구성 확인 라인 추가 |
| `addConfigError($value)` | 구성 상자에 오류 추가 |
| `addConfigAccept($value)` | 구성 상자에 성공 추가 |
| `addConfigWarning($value)` | 구성 상자에 경고 추가 |
| `addConfigModuleVersion($moddir, $version)` | 모듈 버전 확인 |
| `addItemButton($title, $link, $icon, $extra)` | 작업 버튼 추가 |
| `displayButton($position, $delimiter)` | 디스플레이 버튼 |
| `renderButton($position, $delimiter)` | 복귀 버튼 HTML |
| `displayIndex()` | 색인 페이지 표시 |
| `renderIndex()` | 색인 페이지 HTML 반환 |
| `displayAbout($logo_xoops)` | 페이지 정보 표시 |
| `renderAbout($logo_xoops)` | 페이지 HTML 정보로 돌아가기 |

## 참고 항목

-../Basics/XMF-Module-Helper - 모듈 도우미 클래스
- 권한 도우미 - 권한 관리
-../XMF-Framework - 프레임워크 개요

---

#xmf #관리자 #모듈 개발 #탐색 #아이콘
