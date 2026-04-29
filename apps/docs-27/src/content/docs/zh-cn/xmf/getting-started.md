---
title：“XMF入门”
description：“XOOPS模区块框架的安装、基本概念和第一步”
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

本指南涵盖了XOOPS模区块框架(XMF)的基本概念以及如何开始在模区块中使用它。

## 先决条件

- 安装了XOOPS2.5.8或更高版本
- PHP 7.2 或更高版本
- 对PHP对象-oriented编程的基本了解

## 了解命名空间

XMF使用PHP命名空间来组织其类并避免命名冲突。所有 XMF 类都位于 `XMF` 命名空间中。

### 全球空间问题

如果没有命名空间，所有 PHP 类共享一个全局空间。这可能会导致冲突：

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

### 命名空间解决方案

命名空间创建隔离的命名上下文：

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

### 使用XMF命名空间

您可以通过多种方式引用XMF类：

**完整命名空间路径：**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**带有使用声明：**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**多次导入：**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## 自动加载

XMF 最大的便利之一是自动类加载。您永远不需要手动包含 XMF 类文件。

### 传统 XOOPS 加载

旧方法需要显式加载：

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF 自动加载

使用XMF，类在被引用时自动加载：

```php
$input = Xmf\Request::getString('input', '');
```

或者使用 use 语句：

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

自动加载器遵循 [PSR-4](http://www.php-fig.org/psr/psr-4/) 标准，还管理 XMF 所依赖的依赖项。

## 基本用法示例

### 读取请求输入

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

### 使用模区块助手

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

### 路径和 URL 助手

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

## 使用 XMF 进行调试

XMF提供了有用的调试工具：

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

调试输出是可折叠的，并以简单的-to-read格式显示对象和数组。

## 项目结构推荐

构建 XMF-based 模区块时，组织你的代码：

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

## 常见包含模式

典型的模区块入口点：

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

## 后续步骤

现在您已经了解了基础知识，请探索：

- XMF-Request - 详细的请求处理文档
- XMF-Module-Helper - 完整的模区块帮助参考
- ../Recipes/Permission-Helper - 管理用户权限
- ../Recipes/Module-Admin-Pages - 构建管理界面

## 另请参阅

- ../XMF-Framework - 框架概述
- ../Reference/JWT - JSON Web 令牌支持
- ../Reference/Database - 数据库实用程序

---

#xmf #获取-started #namespaces #autoloading #basics