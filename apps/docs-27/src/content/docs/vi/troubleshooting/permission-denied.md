---
title: "Lỗi từ chối quyền"
description: "Khắc phục sự cố về quyền đối với tệp và thư mục trong XOOPS"
---
Các vấn đề về quyền đối với tệp và thư mục thường gặp trong quá trình cài đặt XOOPS, đặc biệt là sau khi tải lên hoặc di chuyển máy chủ. Hướng dẫn này giúp chẩn đoán và giải quyết các vấn đề về quyền.

## Tìm hiểu quyền của tệp

### Thông tin cơ bản về quyền của Linux/Unix

Quyền của tệp được thể hiện dưới dạng mã gồm ba chữ số:

```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```

## Lỗi cấp phép phổ biến

### "Quyền bị từ chối" trong Tải lên

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "Không thể ghi tập tin"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "Không thể tạo thư mục"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## Thư mục XOOPS quan trọng

### Thư mục yêu cầu quyền ghi

| Thư mục | Tối thiểu | Mục đích |
|---|---|---|
| `/uploads` | 755 | Người dùng uploads |
| `/cache` | 755 | Tệp bộ nhớ đệm |
| `/templates_c` | 755 | Đã biên soạn templates |
| `/var` | 755 | Dữ liệu biến đổi |
| `mainfile.php` | 644 | Cấu hình (có thể đọc được) |

## Khắc phục sự cố Linux/Unix

### Bước 1: Kiểm tra quyền hiện tại

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### Bước 2: Xác định người dùng máy chủ web

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### Bước 3: Sửa quyền sở hữu

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### Bước 4: Sửa quyền

#### Tùy chọn A: Quyền hạn chế (Được khuyến nghị)

```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```

#### Tùy chọn B: Tập lệnh tất cả cùng một lúc

```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```

## Các vấn đề về quyền theo thư mục

### Thư mục tải lên

**Vấn đề:** Không thể tải tệp lên

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### Thư mục bộ đệm

**Vấn đề:** Tệp bộ nhớ đệm không được ghi

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### Bộ đệm mẫu

**Vấn đề:** Mẫu không được biên dịch

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## Khắc phục sự cố Windows

### Bước 1: Kiểm tra thuộc tính file

1. Nhấp chuột phải vào tệp → Thuộc tính
2. Nhấp vào tab "Bảo mật"
3. Nhấp vào nút "Chỉnh sửa"
4. Chọn người dùng và xác minh quyền

### Bước 2: Cấp quyền ghi

#### Qua GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### Qua dòng lệnh (PowerShell):

```powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```

## PHP Tập lệnh để kiểm tra quyền

```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```

## Các phương pháp hay nhất

### 1. Nguyên tắc đặc quyền tối thiểu

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. Sao lưu trước khi thay đổi

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## Tham khảo nhanh

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## Tài liệu liên quan

- Màn hình trắng chết chóc - Các lỗi thường gặp khác
- Lỗi kết nối cơ sở dữ liệu - Sự cố cơ sở dữ liệu
- ../../01-Bắt đầu/Cấu hình/Cài đặt hệ thống - Cấu hình XOOPS

---

**Cập nhật lần cuối:** 2026-01-31
**Áp dụng cho:** XOOPS 2.5.7+
**HĐH:** Linux, Windows, macOS