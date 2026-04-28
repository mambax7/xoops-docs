---
title: "模組管理頁面"
description: "使用 XMF 建立標準化和前向相容的模組管理頁面"
---

`Xmf\Module\Admin` 類別提供建立模組管理介面的一致方式。使用 XMF 進行管理頁面可確保與未來 XOOPS 版本的前向相容性，同時保持統一的使用者體驗。

## 概述

XOOPS Frameworks 中的 ModuleAdmin 類別使管理變得更容易，但其 API 在版本間已經進化。`Xmf\Module\Admin` 包裝程式：

- 提供跨 XOOPS 版本工作的穩定 API
- 自動處理版本間的 API 差異
- 確保您的管理程式碼向前相容
- 為常見任務提供方便的靜態方法

## 入門

### 建立管理執行個體

```php
$admin = \Xmf\Module\Admin::getInstance();
```

如果已相容，這會傳回 `Xmf\Module\Admin` 執行個體或原生系統類別。

## 圖示管理

### 圖示位置問題

圖示在 XOOPS 版本之間移動，造成維護麻煩。XMF 透過公用程式方法解決此問題。

### 尋找圖示

**舊方式（版本相依）：**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**XMF 方式：**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

`iconUrl()` 方法傳回完整 URL，所以您不需要擔心路徑構造。

### 圖示大小

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### 功能表圖示

對於管理 menu.php 檔案：

**舊方式：**
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

**XMF 方式：**
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

## 標準管理頁面

### 索引頁面

**舊格式：**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**XMF 格式：**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### 關於頁面

**舊格式：**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**XMF 格式：**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **註：** 在未來的 XOOPS 版本中，PayPal 資訊在 xoops_version.php 中設定。`setPaypal()` 呼叫確保與目前版本的相容性，在較新版本中沒有效果。

## 導覽

### 顯示導覽功能表

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## 資訊框

### 建立資訊框

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

## 配置框

配置框顯示系統要求和狀態檢查。

### 基本配置行

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

### 便利方法

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

### 配置框類型

| 類型 | 值 | 行為 |
|------|-------|----------|
| `default` | 訊息字串 | 直接顯示訊息 |
| `folder` | 目錄路徑 | 如果存在顯示接受，如果不存在則顯示錯誤 |
| `chmod` | `[path, permission]` | 檢查目錄存在且具有權限 |
| `module` | 模組名稱 | 如果安裝則接受，如果不安裝則出錯 |
| `module` | `[name, 'warning']` | 如果安裝則接受，如果不安裝則警告 |

## 項目按鈕

將動作按鈕新增至管理頁面：

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

## 完整管理頁面範例

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

### menu.php

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

## API 參考資料

### 靜態方法

| 方法 | 說明 |
|--------|-------------|
| `getInstance()` | 取得管理執行個體 |
| `iconUrl($name, $size)` | 取得圖示 URL (大小: 16 或 32) |
| `menuIconPath($image)` | 取得 menu.php 的圖示路徑 |
| `setPaypal($paypal)` | 設定 PayPal ID 用於關於頁面 |

### 執行個體方法

| 方法 | 說明 |
|--------|-------------|
| `displayNavigation($menu)` | 顯示導覽功能表 |
| `renderNavigation($menu)` | 傳回導覽 HTML |
| `addInfoBox($title)` | 新增資訊框 |
| `addInfoBoxLine($text, $type, $color)` | 新增行至資訊框 |
| `displayInfoBox()` | 顯示資訊框 |
| `renderInfoBox()` | 傳回資訊框 HTML |
| `addConfigBoxLine($value, $type)` | 新增配置檢查行 |
| `addConfigError($value)` | 新增錯誤至配置框 |
| `addConfigAccept($value)` | 新增成功至配置框 |
| `addConfigWarning($value)` | 新增警告至配置框 |
| `addConfigModuleVersion($moddir, $version)` | 檢查模組版本 |
| `addItemButton($title, $link, $icon, $extra)` | 新增動作按鈕 |
| `displayButton($position, $delimiter)` | 顯示按鈕 |
| `renderButton($position, $delimiter)` | 傳回按鈕 HTML |
| `displayIndex()` | 顯示索引頁面 |
| `renderIndex()` | 傳回索引頁面 HTML |
| `displayAbout($logo_xoops)` | 顯示關於頁面 |
| `renderAbout($logo_xoops)` | 傳回關於頁面 HTML |

## 相關資訊

- ../Basics/XMF-Module-Helper - 模組協助者類別
- Permission-Helper - 權限管理
- ../XMF-Framework - 框架概述

---

#xmf #admin #module-development #navigation #icons
