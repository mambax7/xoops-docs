---
title: "xoops_version.php - Bản kê khai mô-đun"
---
## Tổng quan

Tệp `xoops_version.php` là trái tim của mọi mô-đun XOOPS. Nó xác định siêu dữ liệu mô-đun, bảng cơ sở dữ liệu, templates, khối, tùy chọn cấu hình và móc cài đặt.

## Cấu trúc cơ bản

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

## Tài liệu tham khảo đầy đủ

### Nhận dạng mô-đun

| Chìa khóa | Loại | Mô tả |
|------|------|-------------|
| `name` | chuỗi | Tên hiển thị (sử dụng hằng số language) |
| `version` | chuỗi | Phiên bản ngữ nghĩa (MAJOR.MINOR.PATCH) |
| `description` | chuỗi | Mô tả mô-đun |
| `author` | chuỗi | Tên tác giả chính |
| `credits` | chuỗi | Người đóng góp bổ sung |
| `license` | chuỗi | Tên giấy phép |
| `dirname` | chuỗi | Tên thư mục mô-đun |

### Bảng cơ sở dữ liệu

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

### Mẫu

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

### Khối

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

### Tùy chọn cấu hình

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

### Các loại biểu mẫu

| kiểu mẫu | giá trị | Mô tả |
|----------|-------------|-------------|
| `textbox` | `text`/`int` | Đầu vào một dòng |
| `textarea` | `text` | Đầu vào nhiều dòng |
| `yesno` | `int` | Có/Không đài |
| `select` | `text` | Chọn thả xuống |
| `select_multi` | `array` | Chọn nhiều |
| `group` | `int` | Bộ chọn nhóm |
| `group_multi` | `array` | Bộ chọn nhiều nhóm |
| `user` | `int` | Bộ chọn người dùng |
| `color` | `text` | Công cụ chọn màu |
| `hidden` | `text` | Trường ẩn |

### Mục thực đơn

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

### Móc cài đặt

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

### Tích hợp tìm kiếm

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

### Tích hợp bình luận

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

### Thông báo

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

## Tài liệu liên quan

- Phát triển mô-đun - Hướng dẫn mô-đun hoàn chỉnh
- Cấu trúc module - Cấu trúc thư mục
- Phát triển khối - Tạo khối
- Hoạt động cơ sở dữ liệu - Thiết lập cơ sở dữ liệu