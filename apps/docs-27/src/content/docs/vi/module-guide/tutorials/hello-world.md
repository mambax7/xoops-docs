---
title: "Mô-đun Hello World"
description: "Hướng dẫn từng bước để tạo mô-đun XOOPS đầu tiên của bạn"
---
# Hướng dẫn mô-đun Hello World

Hướng dẫn này hướng dẫn bạn cách tạo mô-đun XOOPS đầu tiên của bạn. Cuối cùng, bạn sẽ có một mô-đun hoạt động hiển thị "Hello World" trên cả khu vực giao diện người dùng và admin.

## Điều kiện tiên quyết

- XOOPS 2.5.x đã được cài đặt và đang chạy
- PHP 8.0 trở lên
- Kiến thức cơ bản về PHP
- Trình soạn thảo văn bản hoặc IDE (khuyên dùng PhpStorm)

## Bước 1: Tạo cấu trúc thư mục

Tạo cấu trúc thư mục sau trong `/modules/helloworld/`:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Bước 2: Tạo định nghĩa mô-đun

Tạo `xoops_version.php`:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## Bước 3: Tạo file ngôn ngữ

### modinfo.php (Module Information)

Tạo `language/english/modinfo.php`:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### chính.php (Frontend Language)

Tạo `language/english/main.php`:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Ngôn ngữ quản trị)

Tạo `language/english/admin.php`:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Bước 4: Tạo Frontend Index

Tạo `index.php` trong thư mục gốc của mô-đun:

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## Bước 5: Tạo mẫu giao diện người dùng

Tạo `templates/helloworld_index.tpl`:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Bước 6: Tạo file quản trị

### Tiêu đề quản trị viên

Tạo `admin/admin_header.php`:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Chân trang quản trị

Tạo `admin/admin_footer.php`:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Menu quản trị

Tạo `admin/menu.php`:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Trang chỉ mục quản trị

Tạo `admin/index.php`:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## Bước 7: Tạo Mẫu quản trị

Tạo `templates/admin/helloworld_admin_index.tpl`:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Bước 8: Tạo Logo Mô-đun

Tạo hoặc sao chép hình ảnh PNG (kích thước được đề xuất: 92x92 pixel) sang:
`assets/images/logo.png`

Bạn có thể sử dụng bất kỳ trình chỉnh sửa hình ảnh nào để tạo một biểu tượng đơn giản hoặc sử dụng trình giữ chỗ từ trang web như placeholder.com.

## Bước 9: Cài đặt Module

1. Đăng nhập vào trang XOOPS của bạn với tên administrator
2. Đi tới **Quản trị hệ thống** > **Mô-đun**
3. Tìm "Hello World" trong danh sách modules có sẵn
4. Nhấp vào nút **Cài đặt**
5. Xác nhận cài đặt

## Bước 10: Kiểm tra mô-đun của bạn

### Kiểm tra giao diện người dùng

1. Điều hướng đến trang XOOPS của bạn
2. Nhấp vào "Xin chào thế giới" trong menu chính
3. Bạn sẽ thấy thông báo chào mừng và thời gian hiện tại

### Kiểm tra quản trị

1. Vào khu vực admin
2. Nhấp vào "Xin chào thế giới" trong menu admin
3. Bạn sẽ thấy bảng điều khiển admin

## Khắc phục sự cố

### Mô-đun không xuất hiện trong danh sách cài đặt

- Kiểm tra quyền truy cập tệp (755 đối với thư mục, 644 đối với tệp)
- Xác minh `xoops_version.php` không có lỗi cú pháp
- Xóa bộ nhớ đệm XOOPS

### Mẫu không tải

- Đảm bảo các tập tin mẫu nằm trong đúng thư mục
- Kiểm tra tên file mẫu có khớp với tên trong `xoops_version.php`
- Xác minh cú pháp Smarty đúng

### Chuỗi ngôn ngữ không hiển thị

- Kiểm tra đường dẫn file language
- Đảm bảo hằng số language được xác định
- Xác minh đúng thư mục language tồn tại

## Các bước tiếp theo

Bây giờ bạn đã có một mô-đun hoạt động được, hãy tiếp tục học với:

- Building-a-CRUD-Module - Thêm chức năng cơ sở dữ liệu
- ../Patterns/MVC-Pattern - Sắp xếp mã của bạn đúng cách
- ../Thực hành tốt nhất/Thử nghiệm - Thêm các bài kiểm tra PHPUnit

## Tham chiếu tệp hoàn chỉnh

Mô-đun đã hoàn thành của bạn phải có các tệp này:

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Tóm tắtChúc mừng! Bạn đã tạo mô-đun XOOPS đầu tiên của mình. Các khái niệm chính được đề cập:

1. **Cấu trúc mô-đun** - Bố cục thư mục mô-đun XOOPS tiêu chuẩn
2. **xoops_version.php** - Định nghĩa và cấu hình mô-đun
3. **Tệp ngôn ngữ** - Hỗ trợ quốc tế hóa
4. **Mẫu** - Tích hợp mẫu Smarty
5. **Giao diện quản trị** - Bảng điều khiển admin cơ bản

Xem thêm: ../Module-Phát triển | Mô-đun xây dựng-a-CRUD | ../Patterns/MVC-Pattern