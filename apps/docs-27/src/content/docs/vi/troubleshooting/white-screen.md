---
title: "Màn hình trắng chết chóc (WSOD)"
description: "Chẩn đoán và sửa lỗi màn hình trắng chết chóc trên XOOPS"
---
> Cách chẩn đoán và sửa lỗi trang trắng trống trong XOOPS.

---

## Sơ đồ chẩn đoán

```mermaid
flowchart TD
    A[White Screen] --> B{PHP Errors Visible?}
    B -->|No| C[Enable Error Display]
    B -->|Yes| D[Read Error Message]

    C --> E{Errors Now Visible?}
    E -->|Yes| D
    E -->|No| F[Check PHP Error Log]

    D --> G{Error Type?}
    G -->|Memory| H[Increase memory_limit]
    G -->|Syntax| I[Fix PHP Syntax]
    G -->|Missing File| J[Restore File]
    G -->|Permission| K[Fix Permissions]
    G -->|Database| L[Check DB Connection]

    F --> M{Log Has Errors?}
    M -->|Yes| D
    M -->|No| N[Check Web Server Logs]

    N --> O{Found Issue?}
    O -->|Yes| D
    O -->|No| P[Enable XOOPS Debug]
```

---

## Chẩn đoán nhanh

### Bước 1: Kích hoạt hiển thị lỗi PHP

Thêm tạm thời vào `mainfile.php`:

```php
<?php
// Add at the very top, after <?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
```

### Bước 2: Kiểm tra Nhật ký lỗi PHP

```bash
# Common log locations
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
tail -100 /var/log/nginx/error.log

# Or check PHP info for log location
php -i | grep error_log
```

### Bước 3: Kích hoạt tính năng gỡ lỗi XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);
```

---

## Nguyên nhân & giải pháp thường gặp

```mermaid
pie title WSOD Common Causes
    "Memory Limit" : 25
    "PHP Syntax Error" : 20
    "Missing Files" : 15
    "Database Issues" : 15
    "Permissions" : 10
    "Template Errors" : 10
    "Timeout" : 5
```

### 1. Đã vượt quá giới hạn bộ nhớ

**Triệu chứng:**
- Trang trống về các hoạt động lớn
- Hoạt động với dữ liệu nhỏ, thất bại với dữ liệu lớn

**Lỗi:**
```
Fatal error: Allowed memory size of 134217728 bytes exhausted
```

**Giải pháp:**

```php
// In mainfile.php
ini_set('memory_limit', '256M');

// Or in .htaccess
php_value memory_limit 256M

// Or in php.ini
memory_limit = 256M
```

### 2. Lỗi cú pháp PHP

**Triệu chứng:**
- WSOD sau khi chỉnh sửa file PHP
- Trang cụ thể bị lỗi, các trang khác hoạt động

**Lỗi:**
```
Parse error: syntax error, unexpected '}' in /path/file.php on line 123
```

**Giải pháp:**

```bash
# Check file for syntax errors
php -l /path/to/file.php

# Check all PHP files in module
find modules/mymodule -name "*.php" -exec php -l {} \;
```

### 3. Thiếu tệp cần thiết

**Triệu chứng:**
- WSOD sau khi tải lên/di chuyển
- Trang ngẫu nhiên bị lỗi

**Lỗi:**
```
Fatal error: require_once(): Failed opening required 'class/Helper.php'
```

**Giải pháp:**

```bash
# Re-upload missing files
# Compare against fresh installation
diff -r /path/to/xoops /path/to/fresh-xoops

# Check file permissions
ls -la class/
```

### 4. Kết nối cơ sở dữ liệu không thành công

**Triệu chứng:**
- Tất cả các trang đều hiển thị WSOD
- Tệp tĩnh (hình ảnh, CSS) hoạt động

**Lỗi:**
```
Warning: mysqli_connect(): Access denied for user
```

**Giải pháp:**

```php
// Verify credentials in mainfile.php
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_USER', 'your_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'your_database');

// Test connection manually
<?php
$conn = new mysqli('localhost', 'user', 'pass', 'database');
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
echo "Connected successfully";
```

### 5. Vấn đề về quyền

**Triệu chứng:**
- WSOD khi ghi file
- Lỗi bộ đệm/biên dịch

**Giải pháp:**

```bash
# Fix directory permissions
chmod -R 755 htdocs/
chmod -R 777 xoops_data/
chmod -R 777 uploads/

# Fix ownership
chown -R www-data:www-data /path/to/xoops
```

### 6. Lỗi mẫu Smarty

**Triệu chứng:**
- WSOD trên các trang cụ thể
- Hoạt động sau khi xóa bộ nhớ cache

**Giải pháp:**

```bash
# Clear Smarty cache
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*

# Check template syntax
```

### 7. Thời gian thực hiện tối đa

**Triệu chứng:**
- WSOD sau ~30 giây
- Hoạt động lâu không thành công

**Lỗi:**
```
Fatal error: Maximum execution time of 30 seconds exceeded
```

**Giải pháp:**

```php
// In mainfile.php
set_time_limit(300);

// Or in .htaccess
php_value max_execution_time 300
```

---

## Tập lệnh gỡ lỗi

Tạo `debug.php` trong root XOOPS:

```php
<?php
/**
 * XOOPS Debug Script
 * Delete after troubleshooting!
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');

echo "<h1>XOOPS Debug</h1>";

// Check PHP version
echo "<h2>PHP Version</h2>";
echo "PHP " . PHP_VERSION . "<br>";

// Check required extensions
echo "<h2>Required Extensions</h2>";
$required = ['mysqli', 'gd', 'curl', 'json', 'mbstring'];
foreach ($required as $ext) {
    $status = extension_loaded($ext) ? '✓' : '✗';
    echo "$status $ext<br>";
}

// Check file permissions
echo "<h2>Directory Permissions</h2>";
$dirs = [
    'xoops_data' => 'xoops_data',
    'uploads' => 'uploads',
    'cache' => 'xoops_data/caches'
];
foreach ($dirs as $name => $path) {
    $writable = is_writable($path) ? '✓ Writable' : '✗ Not writable';
    echo "$name: $writable<br>";
}

// Test database connection
echo "<h2>Database Connection</h2>";
if (file_exists('mainfile.php')) {
    // Extract credentials (simple regex, not production safe)
    $mainfile = file_get_contents('mainfile.php');
    preg_match("/XOOPS_DB_HOST.*'(.+?)'/", $mainfile, $host);
    preg_match("/XOOPS_DB_USER.*'(.+?)'/", $mainfile, $user);
    preg_match("/XOOPS_DB_PASS.*'(.+?)'/", $mainfile, $pass);
    preg_match("/XOOPS_DB_NAME.*'(.+?)'/", $mainfile, $name);

    if (!empty($host[1])) {
        $conn = @new mysqli($host[1], $user[1], $pass[1], $name[1]);
        if ($conn->connect_error) {
            echo "✗ Connection failed: " . $conn->connect_error;
        } else {
            echo "✓ Connected to database";
            $conn->close();
        }
    }
} else {
    echo "mainfile.php not found";
}

// Memory info
echo "<h2>Memory</h2>";
echo "Memory Limit: " . ini_get('memory_limit') . "<br>";
echo "Current Usage: " . round(memory_get_usage() / 1024 / 1024, 2) . " MB<br>";

// Check error log location
echo "<h2>Error Log</h2>";
echo "Location: " . ini_get('error_log');
```

---

## Phòng ngừa

```mermaid
graph LR
    A[Backup Before Changes] --> E[Stable Site]
    B[Test in Development] --> E
    C[Monitor Error Logs] --> E
    D[Use Version Control] --> E
```

1. **Luôn sao lưu** trước khi thực hiện thay đổi
2. **Kiểm tra cục bộ** trước khi triển khai
3. **Theo dõi nhật ký lỗi** thường xuyên
4. **Sử dụng git** để theo dõi các thay đổi
5. ** Luôn cập nhật PHP** trong các phiên bản được hỗ trợ

---

## Tài liệu liên quan

- Lỗi kết nối cơ sở dữ liệu
- Lỗi từ chối quyền
- Kích hoạt chế độ gỡ lỗi

---

#xoops #khắc phục sự cố #wsod #gỡ lỗi #lỗi