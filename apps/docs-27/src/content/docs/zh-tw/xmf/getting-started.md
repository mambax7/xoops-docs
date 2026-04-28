---
title: "XMF 入門"
description: "XOOPS 模組框架的安裝、基本概念和第一步"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

本指南涵蓋 XOOPS 模組框架 (XMF) 的基本概念以及如何在您的模組中開始使用它。

## 先決條件

- XOOPS 2.5.8 或更新版本已安裝
- PHP 7.2 或更新版本
- 對 PHP 物件導向程式設計的基本了解

## 了解命名空間

XMF 使用 PHP 命名空間來組織其類別並避免命名衝突。所有 XMF 類別都在 `Xmf` 命名空間中。

### 全域空間問題

沒有命名空間，所有 PHP 類別都共享一個全域空間。這可能會導致衝突：

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### 命名空間解決方案

命名空間建立隔離的命名上下文：

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### 使用 XMF 命名空間

您可以透過幾種方式參考 XMF 類別：

**完整命名空間路徑：**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**使用 use 陳述：**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**多個匯入：**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## 自動載入

XMF 最大的便利之一是自動類別載入。您永遠不需要手動包含 XMF 類別檔案。

### 傳統 XOOPS 載入

舊的方法需要明確載入：

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF 自動載入

使用 XMF，類別在被引用時會自動載入：

```php
$input = Xmf\Request::getString('input', '');
```

或使用 use 陳述：

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

自動載入器遵循 [PSR-4](http://www.php-fig.org/psr/psr-4/) 標準，也管理 XMF 所依賴的相依性。

## 基本用法範例

### 讀取請求輸入

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### 使用模組協助者

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### 路徑和 URL 協助者

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## 使用 XMF 進行偵錯

XMF 提供有用的偵錯工具：

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

偵錯輸出是可折疊的，並以易於閱讀的格式顯示物件和陣列。

## 專案結構建議

構建基於 XMF 的模組時，組織您的程式碼：

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## 常見包含模式

典型的模組進入點：

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## 下一步

現在您了解了基礎知識，探索：

- XMF-Request - 詳細的請求處理文件
- XMF-Module-Helper - 完整的模組協助者參考
- ../Recipes/Permission-Helper - 管理使用者權限
- ../Recipes/Module-Admin-Pages - 建立管理介面

## 相關資訊

- ../XMF-Framework - 框架概述
- ../Reference/JWT - JSON Web Token 支援
- ../Reference/Database - 資料庫公用程式

---

#xmf #getting-started #namespaces #autoloading #basics
