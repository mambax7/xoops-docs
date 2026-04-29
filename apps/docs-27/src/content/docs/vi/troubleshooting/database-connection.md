---
title: "Lỗi kết nối cơ sở dữ liệu"
description: "Hướng dẫn khắc phục sự cố kết nối cơ sở dữ liệu XOOPS"
---
Lỗi kết nối cơ sở dữ liệu là một trong những sự cố phổ biến nhất trong quá trình cài đặt XOOPS. Hướng dẫn này cung cấp các bước khắc phục sự cố có hệ thống để xác định và giải quyết các sự cố kết nối.

## Thông báo lỗi thường gặp

### "Không thể kết nối với máy chủ MySQL"

```
Error: Can't connect to MySQL server on 'localhost' (111)
```

Lỗi này thường cho biết máy chủ MySQL không chạy hoặc không thể truy cập được.

### "Quyền truy cập của người dùng bị từ chối"

```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```

Điều này cho thấy thông tin xác thực cơ sở dữ liệu không chính xác trong cấu hình của bạn.

### "Cơ sở dữ liệu không xác định"

```
Error: Unknown database 'xoops_db'
```

Cơ sở dữ liệu được chỉ định không tồn tại trên máy chủ MySQL.

## Tệp cấu hình

### Vị trí cấu hình XOOPS

Tệp cấu hình chính được đặt tại:

```
/mainfile.php
```

Cài đặt cơ sở dữ liệu chính:

```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```

## Các bước khắc phục sự cố

### Bước 1: Xác minh Dịch vụ MySQL đang chạy

#### Trên Linux/Unix

```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```

### Bước 2: Kiểm tra kết nối MySQL

#### Sử dụng dòng lệnh

```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```

### Bước 3: Xác minh thông tin xác thực cơ sở dữ liệu

#### Kiểm tra cấu hình XOOPS

```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```

### Bước 4: Xác minh sự tồn tại của cơ sở dữ liệu

```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### Bước 5: Kiểm tra quyền của người dùng

```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```

## Các vấn đề thường gặp và giải pháp

### Vấn đề 1: MySQL Không chạy

**Triệu chứng:**
- Lỗi từ chối kết nối
- Không thể kết nối với localhost

**Giải pháp:**

```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```

### Vấn đề 2: Thông tin xác thực không chính xác

**Triệu chứng:**
- Lỗi "Truy cập bị từ chối"
- "sử dụng mật khẩu: CÓ" hoặc "sử dụng mật khẩu: KHÔNG"

**Giải pháp:**

```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```

### Vấn đề 3: Cơ sở dữ liệu chưa được tạo

**Triệu chứng:**
- Lỗi "Cơ sở dữ liệu không xác định"
- Cài đặt không thành công khi tạo cơ sở dữ liệu

**Giải pháp:**

```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```

## Tập lệnh chẩn đoán

Tạo tập lệnh chẩn đoán toàn diện:

```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```

## Tài liệu liên quan

- Màn hình trắng chết chóc - Khắc phục sự cố WSOD thường gặp
- ../../01-Bắt đầu/Cấu hình/Tối ưu hóa hiệu suất - Điều chỉnh hiệu suất cơ sở dữ liệu
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Thiết lập XOOPS ban đầu
- ../../04-API-Reference/Database/XoopsDatabase - Cơ sở dữ liệu tham chiếu API

---

**Cập nhật lần cuối:** 2026-01-31
**Áp dụng cho:** XOOPS 2.5.7+
**Phiên bản PHP:** 7.4+