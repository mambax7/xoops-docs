---
title: "Phát triển mô-đun"
description: "Hướng dẫn toàn diện để phát triển XOOPS modules bằng cách sử dụng các phương pháp PHP hiện đại"
---
Phần này cung cấp tài liệu toàn diện để phát triển XOOPS modules bằng cách sử dụng các phương pháp, mẫu thiết kế và phương pháp hay nhất PHP hiện đại.

## Tổng quan

Quá trình phát triển mô-đun XOOPS đã phát triển đáng kể trong những năm qua. Đòn bẩy modules hiện đại:

- **Kiến trúc MVC** - Phân tách rõ ràng các vấn đề
- **Tính năng PHP 8.x** - Khai báo kiểu, thuộc tính, đối số được đặt tên
- **Mẫu thiết kế** - Kho lưu trữ, DTO, mẫu Lớp dịch vụ
- **Thử nghiệm** - PHPUnit với các phương pháp thử nghiệm hiện đại
- **XMF Framework** - Tiện ích khung mô-đun XOOPS

## Cấu trúc tài liệu

### Hướng dẫn

Hướng dẫn từng bước để xây dựng XOOPS modules từ đầu.

- Hướng dẫn/Hello-World-Module - Mô-đun XOOPS đầu tiên của bạn
- Hướng dẫn/Building-a-CRUD-Module - Hoàn thiện chức năng Tạo, Đọc, Cập nhật, Xóa

### Mẫu thiết kế

Các mẫu kiến trúc được sử dụng trong phát triển mô-đun XOOPS hiện đại.

- Patterns/MVC-Pattern - Kiến trúc Model-View-Controller
- Patterns/Repository-Pattern - Trừu tượng truy cập dữ liệu
- Patterns/DTO-Pattern - Đối tượng truyền dữ liệu cho luồng dữ liệu sạch

### Các phương pháp hay nhất

Hướng dẫn viết mã chất lượng cao, có thể bảo trì.

- Các phương pháp thực hành tốt nhất/Mã sạch - Nguyên tắc mã sạch cho XOOPS
- Các phương pháp thực hành tốt nhất/Mùi mã - Các mô hình chống phổ biến và cách khắc phục chúng
- Thực tiễn/Thử nghiệm tốt nhất - Chiến lược thử nghiệm PHPUnit

### Ví dụ

Phân tích mô-đun trong thế giới thực và các ví dụ triển khai.

- Phân tích mô-đun nhà xuất bản - Đi sâu vào mô-đun Nhà xuất bản

## Cấu trúc thư mục mô-đun

Mô-đun XOOPS được tổ chức tốt tuân theo cấu trúc thư mục sau:

```
/modules/mymodule/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /css/
        /js/
        /images/
    /blocks/
        myblock.php
    /class/
        /Controller/
        /Entity/
        /Repository/
        /Service/
    /include/
        common.php
        install.php
        uninstall.php
        update.php
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /preloads/
        core.php
    /sql/
        mysql.sql
    /templates/
        /admin/
        /blocks/
        main_index.tpl
    /test/
        bootstrap.php
        /Unit/
        /Integration/
    index.php
    xoops_version.php
```

## Giải thích các tập tin chính

### xoops_version.php

Tệp định nghĩa mô-đun cho XOOPS biết về mô-đun của bạn:

```php
<?php
$modversion = [];

// Basic Information
$modversion['name']        = 'My Module';
$modversion['version']     = 1.00;
$modversion['description'] = 'A sample XOOPS module';
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'Your Team';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['dirname']     = 'mymodule';
$modversion['image']       = 'assets/images/logo.png';

// Module Flags
$modversion['hasMain']     = 1;  // Has frontend pages
$modversion['hasAdmin']    = 1;  // Has admin section
$modversion['system_menu'] = 1;  // Show in admin menu

// Admin Configuration
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';

// Database
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
];

// Templates
$modversion['templates'][] = [
    'file'        => 'mymodule_index.tpl',
    'description' => 'Index page template',
];

// Blocks
$modversion['blocks'][] = [
    'file'        => 'myblock.php',
    'name'        => 'My Block',
    'description' => 'Displays recent items',
    'show_func'   => 'mymodule_block_show',
    'edit_func'   => 'mymodule_block_edit',
    'template'    => 'mymodule_block.tpl',
];

// Module Preferences
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];
```

### Tệp bao gồm phổ biến

Tạo một tệp bootstrap chung cho mô-đun của bạn:

```php
<?php
// include/common.php

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

// Module constants
define('MYMODULE_DIRNAME', 'mymodule');
define('MYMODULE_PATH', XOOPS_ROOT_PATH . '/modules/' . MYMODULE_DIRNAME);
define('MYMODULE_URL', XOOPS_URL . '/modules/' . MYMODULE_DIRNAME);

// Autoload classes
require_once MYMODULE_PATH . '/class/autoload.php';
```

## Yêu cầu phiên bản PHP

XOOPS modules hiện đại nên nhắm mục tiêu PHP 8.0 trở lên để tận dụng:

- **Khuyến mãi bất động sản xây dựng**
- **Đối số được đặt tên**
- **Các loại liên minh**
- **Kết hợp biểu thức**
- **Thuộc tính**
- **Người vận hành Nullsafe**

## Bắt đầu

1. Bắt đầu với hướng dẫn Tutorials/Hello-World-Module
2. Tiến tới Hướng dẫn/Building-a-CRUD-Module
3. Nghiên cứu Mẫu/Mẫu MVC để được hướng dẫn về kiến trúc
4. Áp dụng các phương pháp Thực hành Tốt nhất/Mã sạch xuyên suốt
5. Thực hiện các phương pháp thực hành/thử nghiệm tốt nhất ngay từ đầu

## Tài nguyên liên quan

- ../05-XMF-Framework/XMF-Framework - Tiện ích khung mô-đun XOOPS
- Cơ sở dữ liệu-Hoạt động - Làm việc với cơ sở dữ liệu XOOPS
- ../04-API-Reference/Template/Template-System - Smarty tạo khuôn mẫu trong XOOPS
- ../02-Core-Concepts/Security/Security-Best-Thực hành - Bảo mật mô-đun của bạn

## Lịch sử phiên bản

| Phiên bản | Ngày | Thay đổi |
|----------|------|----------|
| 1.0 | 28-01-2025 | Tài liệu ban đầu |