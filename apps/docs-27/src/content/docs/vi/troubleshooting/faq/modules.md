---
title: "Câu hỏi thường gặp về mô-đun"
description: "Các câu hỏi thường gặp về XOOPS modules"
---
# Câu hỏi thường gặp trong mô-đun

> Các câu hỏi và câu trả lời thường gặp về XOOPS modules, cài đặt và quản lý.

---

## Cài đặt & Kích hoạt

### Hỏi: Làm cách nào để cài đặt mô-đun trong XOOPS?

**Đ:**
1. Tải xuống tệp zip mô-đun
2. Truy cập XOOPS Quản trị viên > Mô-đun > Quản lý mô-đun
3. Nhấp vào "Duyệt" và chọn tệp zip
4. Nhấp vào "Tải lên"
5. Mô-đun xuất hiện trong danh sách (thường bị vô hiệu hóa)
6. Nhấp vào biểu tượng kích hoạt để kích hoạt nó

Ngoài ra, hãy giải nén zip trực tiếp vào `/xoops_root/modules/` và điều hướng đến bảng admin.

---

### Hỏi: Tải lên mô-đun không thành công với "Quyền bị từ chối"

**A:** Đây là vấn đề về quyền đối với tệp:

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

Xem Lỗi cài đặt mô-đun để biết thêm chi tiết.

---

### Hỏi: Tại sao tôi không thể thấy mô-đun trong bảng admin sau khi cài đặt?

**Đ:** Hãy kiểm tra những mục sau:

1. **Mô-đun chưa được kích hoạt** - Nhấp vào biểu tượng con mắt trong danh sách Mô-đun
2. **Thiếu trang admin** - Mô-đun phải có `hasAdmin = 1` trong xoopsversion.php
3. **Language files missing** - Need `language/english/admin.php`
4. **Chưa xóa bộ nhớ đệm** - Xóa bộ nhớ đệm và làm mới trình duyệt

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Hỏi: Làm cách nào để gỡ cài đặt một mô-đun?

**Đ:**
1. Đi tới Quản trị viên XOOPS > Mô-đun > Quản lý mô-đun
2. Tắt module (click vào biểu tượng con mắt)
3. Nhấp vào biểu tượng thùng rác/xóa
4. Xóa thư mục mô-đun theo cách thủ công nếu bạn muốn xóa hoàn toàn:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Quản lý mô-đun

### Hỏi: Sự khác biệt giữa tắt và gỡ cài đặt là gì?

**Đ:**
- **Tắt**: Tắt mô-đun (nhấp vào biểu tượng con mắt). Các bảng cơ sở dữ liệu vẫn còn.
- **Gỡ cài đặt**: Gỡ bỏ mô-đun. Xóa các bảng cơ sở dữ liệu và loại bỏ khỏi danh sách.

Để thực sự xóa, hãy xóa cả thư mục:
```bash
rm -rf modules/modulename
```

---

### Hỏi: Làm cách nào để kiểm tra xem một mô-đun đã được cài đặt đúng chưa?

**A:** Sử dụng tập lệnh gỡ lỗi:

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### Hỏi: Tôi có thể chạy nhiều phiên bản của cùng một mô-đun không?

**A:** Không, XOOPS vốn không hỗ trợ tính năng này. Tuy nhiên, bạn có thể:

1. Tạo một bản sao với tên thư mục khác: `mymodule` và `mymodule2`
2. Cập nhật tên thư mục trong cả modules' xoopsversion.php
3. Ensure unique database table names

Điều này không được khuyến khích vì chúng có cùng mã.

---

## Cấu hình mô-đun

### Hỏi: Tôi định cấu hình cài đặt mô-đun ở đâu?

**Đ:**
1. Đi tới Quản trị viên XOOPS > Mô-đun
2. Nhấp vào biểu tượng cài đặt/bánh răng bên cạnh mô-đun
3. Cấu hình tùy chọn

Các cài đặt được lưu trữ trong bảng `xoops_config`.

**Truy cập bằng mã:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### Hỏi: Làm cách nào để xác định các tùy chọn cấu hình mô-đun?

**A:** Trong xoopsversion.php:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## Tính năng mô-đun

### Hỏi: Làm cách nào để thêm trang admin vào mô-đun của tôi?

**A:** Tạo cấu trúc:

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

Trong xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

Tạo `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### Hỏi: Làm cách nào để thêm chức năng tìm kiếm vào mô-đun của tôi?

**Đ:**
1. Đặt trong xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. Tạo `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

### Hỏi: Làm cách nào để thêm thông báo vào mô-đun của tôi?

**Đ:**
1. Đặt trong xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. Thông báo kích hoạt bằng mã:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## Quyền của mô-đun

### Hỏi: Làm cách nào để đặt quyền cho mô-đun?**Đ:**
1. Đi tới Quản trị viên XOOPS > Mô-đun > Quyền của mô-đun
2. Chọn mô-đun
3. Chọn người dùng/nhóm và cấp độ quyền
4. Lưu

**Trong mã:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## Cơ sở dữ liệu mô-đun

### Hỏi: Các bảng cơ sở dữ liệu mô-đun được lưu trữ ở đâu?

**A:** Tất cả đều có trong cơ sở dữ liệu XOOPS chính, có tiền tố bảng của bạn (thường là `xoops_`):

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### Hỏi: Làm cách nào để cập nhật bảng cơ sở dữ liệu mô-đun?

**A:** Tạo tập lệnh cập nhật trong mô-đun của bạn:

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## Phụ thuộc mô-đun

### Hỏi: Làm cách nào để kiểm tra xem modules đã được cài đặt chưa?

**Đ:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

### Hỏi: modules có thể phụ thuộc vào modules khác không?

**A:** Có, khai báo trong xoopsversion.php:

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## Khắc phục sự cố

### Hỏi: Module xuất hiện trong danh sách nhưng không kích hoạt

**Đ:** Kiểm tra:
1. xoopsversion.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. Tệp cơ sở dữ liệu SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. Tệp ngôn ngữ:
```bash
ls -la modules/mymodule/language/english/
```

Xem Lỗi cài đặt mô-đun để biết chẩn đoán chi tiết.

---

### Hỏi: Module đã kích hoạt nhưng không hiển thị trên trang chính

**Đ:**
1. Đặt `hasMain = 1` trong xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. Tạo `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### Hỏi: Module gây ra "màn hình trắng chết chóc"

**A:** Bật gỡ lỗi để tìm lỗi:

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

Kiểm tra nhật ký lỗi:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

Xem Màn hình trắng chết chóc để biết giải pháp.

---

## Hiệu suất

### Hỏi: Mô-đun chạy chậm, làm cách nào để tối ưu hóa?

**Đ:**
1. **Kiểm tra truy vấn cơ sở dữ liệu** - Sử dụng ghi nhật ký truy vấn
2. **Dữ liệu bộ đệm** - Sử dụng bộ đệm XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **Tối ưu hóa templates** - Tránh vòng lặp trong templates
4. **Kích hoạt bộ nhớ đệm opcode PHP** - APCu, XDebug, v.v.

Xem Câu hỏi thường gặp về hiệu suất để biết thêm chi tiết.

---

## Phát triển mô-đun

### Hỏi: Tôi có thể tìm tài liệu phát triển mô-đun ở đâu?

**Đ:** Xem:
- Hướng dẫn phát triển mô-đun
- Cấu trúc mô-đun
- Tạo mô-đun đầu tiên của bạn

---

## Tài liệu liên quan

- Lỗi cài đặt mô-đun
- Cấu trúc mô-đun
- Câu hỏi thường gặp về hiệu suất
- Kích hoạt chế độ gỡ lỗi

---

#xoops #modules #faq #khắc phục sự cố