---
title: "Bắt đầu với XMF"
description: "Cài đặt, khái niệm cơ bản và các bước đầu tiên với Khung mô-đun XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Hướng dẫn này bao gồm các khái niệm cơ bản của Khung mô-đun XOOPS (XMF) và cách bắt đầu sử dụng nó trong modules của bạn.

## Điều kiện tiên quyết

- Đã cài đặt XOOPS 2.5.8 trở lên
- PHP 7.2 trở lên
- Hiểu biết cơ bản về lập trình hướng đối tượng PHP

## Tìm hiểu không gian tên

XMF sử dụng không gian tên PHP để sắp xếp classes và tránh xung đột đặt tên. Tất cả XMF classes đều nằm trong không gian tên `Xmf`.

### Vấn đề không gian toàn cầu

Không có không gian tên, tất cả PHP classes đều chia sẻ một không gian toàn cầu. Điều này có thể gây ra xung đột:

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

### Giải pháp không gian tên

Không gian tên tạo bối cảnh đặt tên riêng biệt:

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

### Sử dụng không gian tên XMF

Bạn có thể tham khảo XMF classes theo nhiều cách:

**Đường dẫn không gian tên đầy đủ:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Với tuyên bố sử dụng:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Nhập nhiều lần:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Tự động tải

Một trong những tiện ích lớn nhất của XMF là tải class tự động. Bạn không bao giờ cần phải tạo các tệp include XMF class theo cách thủ công.

### Đang tải XOOPS truyền thống

Cách cũ yêu cầu tải rõ ràng:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF Tự động tải

Với XMF, classes tự động tải khi được tham chiếu:

```php
$input = Xmf\Request::getString('input', '');
```

Hoặc với một tuyên bố sử dụng:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

Trình tải tự động tuân theo tiêu chuẩn [PSR-4](http://www.php-fig.org/psr/psr-4/) và cũng quản lý các phần phụ thuộc mà XMF dựa vào.

## Ví dụ sử dụng cơ bản

### Đọc yêu cầu đầu vào

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

### Sử dụng Trình trợ giúp Mô-đun

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

### Đường dẫn và Trình trợ giúp URL

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

## Gỡ lỗi với XMF

XMF cung cấp các công cụ gỡ lỗi hữu ích:

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

Đầu ra gỡ lỗi có thể thu gọn và hiển thị các đối tượng và mảng ở định dạng dễ đọc.

## Đề xuất cấu trúc dự án

Khi xây dựng XMF dựa trên modules, hãy sắp xếp mã của bạn:

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

## Mẫu bao gồm phổ biến

Một điểm vào mô-đun điển hình:

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

## Các bước tiếp theo

Bây giờ bạn đã hiểu những điều cơ bản, hãy khám phá:

- XMF-Request - Tài liệu xử lý yêu cầu chi tiết
- XMF-Module-Helper - Tham khảo trình trợ giúp mô-đun hoàn chỉnh
- ../Recipes/Permission-Helper - Quản lý quyền của người dùng
- ../Recipes/Module-Admin-Pages - Xây dựng giao diện admin

## Xem thêm

- ../XMF-Framework - Tổng quan về khung
- ../Reference/JWT - Hỗ trợ mã thông báo web JSON
- ../Reference/Database - Tiện ích cơ sở dữ liệu

---

#xmf #bắt đầu #namespaces #autoloading #basics