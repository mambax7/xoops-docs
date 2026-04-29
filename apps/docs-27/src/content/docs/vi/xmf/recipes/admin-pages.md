---
title: "Trang quản trị mô-đun"
description: "Tạo các trang administration được tiêu chuẩn hóa và tương thích về phía trước với XMF"
---
`Xmf\Module\Admin` class cung cấp một cách nhất quán để tạo giao diện mô-đun administration. Việc sử dụng XMF cho các trang admin đảm bảo khả năng tương thích về phía trước với các phiên bản XOOPS trong tương lai trong khi vẫn duy trì trải nghiệm người dùng thống nhất.

## Tổng quan

ModuleAdmin class trong XOOPS Framework giúp administration dễ dàng hơn nhưng API của nó đã phát triển qua nhiều phiên bản. Trình bao bọc `Xmf\Module\Admin`:

- Cung cấp API ổn định hoạt động trên các phiên bản XOOPS
- Tự động xử lý sự khác biệt API giữa các phiên bản
- Đảm bảo mã admin của bạn tương thích về phía trước
- Cung cấp các phương thức tĩnh thuận tiện cho các tác vụ thông thường

## Bắt đầu

### Tạo phiên bản quản trị viên

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Điều này trả về phiên bản `Xmf\Module\Admin` hoặc hệ thống gốc class nếu đã tương thích.

## Quản lý biểu tượng

### Vấn đề vị trí biểu tượng

Các biểu tượng đã di chuyển giữa các phiên bản XOOPS, khiến việc bảo trì trở nên đau đầu. XMF giải quyết vấn đề này bằng các phương thức tiện ích.

### Tìm biểu tượng

**Cách cũ (phụ thuộc vào phiên bản):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Cách XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

Phương thức `iconUrl()` trả về URL đầy đủ, do đó bạn không cần phải lo lắng về việc xây dựng đường dẫn.

### Kích thước biểu tượng

```php
// 16x16 icons
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// 32x32 icons (default)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Just the path (no filename)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Biểu tượng menu

Đối với menu admin.php files:

**Cách cũ:**
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

**Cách XMF:**
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

## Trang quản trị chuẩn

### Trang chỉ mục

**Định dạng cũ:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Định dạng XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Giới thiệu về Trang

**Định dạng cũ:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Định dạng XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Lưu ý:** Trong các phiên bản XOOPS trong tương lai, thông tin PayPal được đặt trong xoops_version.php. Lệnh gọi `setPaypal()` đảm bảo khả năng tương thích với các phiên bản hiện tại trong khi không có hiệu lực trong các phiên bản mới hơn.

## Điều hướng

### Hiển thị Menu Điều hướng

```php
$admin = \Xmf\Module\Admin::getInstance();

// Display navigation for current page
$admin->displayNavigation('items.php');

// Or get HTML string
$navHtml = $admin->renderNavigation('items.php');
```

## Hộp thông tin

### Tạo hộp thông tin

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

## Hộp cấu hình

Hộp cấu hình hiển thị các yêu cầu hệ thống và kiểm tra trạng thái.

### Dòng cấu hình cơ bản

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

### Phương pháp tiện lợi

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

### Các loại hộp cấu hình

| Loại | Giá trị | Hành vi |
|------|-------|----------|
| `default` | Chuỗi tin nhắn | Hiển thị tin nhắn trực tiếp |
| `folder` | Đường dẫn thư mục | Hiển thị chấp nhận nếu tồn tại, lỗi nếu không |
| `chmod` | `[path, permission]` | Kiểm tra thư mục tồn tại với sự cho phép |
| `module` | Tên mô-đun | Chấp nhận nếu cài đặt, lỗi nếu không |
| `module` | `[name, 'warning']` | Chấp nhận nếu cài đặt, cảnh báo nếu không |

## Nút vật phẩm

Thêm các nút tác vụ vào trang admin:

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

## Ví dụ đầy đủ về trang quản trị

### chỉ mục.php

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

### mục.php

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

### về.php

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

### thực đơn.php

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

## API Tham khảo

### Phương thức tĩnh| Phương pháp | Mô tả |
|--------|-------------|
| `getInstance()` | Nhận phiên bản admin |
| `iconUrl($name, $size)` | Nhận biểu tượng URL (kích thước: 16 hoặc 32) |
| `menuIconPath($image)` | Nhận đường dẫn biểu tượng cho menu.php |
| `setPaypal($paypal)` | Đặt ID PayPal cho trang giới thiệu |

### Các phương thức instance

| Phương pháp | Mô tả |
|--------|-------------|
| `displayNavigation($menu)` | Hiển thị menu điều hướng |
| `renderNavigation($menu)` | Quay lại điều hướng HTML |
| `addInfoBox($title)` | Thêm hộp thông tin |
| `addInfoBoxLine($text, $type, $color)` | Thêm dòng vào hộp thông tin |
| `displayInfoBox()` | Hiển thị hộp thông tin |
| `renderInfoBox()` | Hộp thông tin trả lại HTML |
| `addConfigBoxLine($value, $type)` | Thêm dòng kiểm tra cấu hình |
| `addConfigError($value)` | Thêm lỗi vào hộp cấu hình |
| `addConfigAccept($value)` | Thêm thành công vào hộp cấu hình |
| `addConfigWarning($value)` | Thêm cảnh báo vào hộp cấu hình |
| `addConfigModuleVersion($moddir, $version)` | Kiểm tra phiên bản mô-đun |
| `addItemButton($title, $link, $icon, $extra)` | Thêm nút hành động |
| `displayButton($position, $delimiter)` | Nút hiển thị |
| `renderButton($position, $delimiter)` | Nút quay lại HTML |
| `displayIndex()` | Hiển thị trang chỉ mục |
| `renderIndex()` | Trang chỉ mục trả về HTML |
| `displayAbout($logo_xoops)` | Hiển thị về trang |
| `renderAbout($logo_xoops)` | Trở về trang HTML |

## Xem thêm

- ../Basics/XMF-Module-Helper - Trình trợ giúp mô-đun class
- Permission-Helper - Quản lý quyền
- ../XMF-Framework - Tổng quan về khung

---

#xmf #admin #phát triển mô-đun #navigation #icons