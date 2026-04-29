---
title: "Xử lý sự cố"
description: "Giải pháp cho các sự cố thường gặp về XOOPS, kỹ thuật gỡ lỗi và Câu hỏi thường gặp"
---
> Giải pháp cho các vấn đề thường gặp và kỹ thuật gỡ lỗi cho XOOPS CMS.

---

## 📋 Chẩn đoán nhanh

Trước khi đi sâu vào các vấn đề cụ thể, hãy kiểm tra các nguyên nhân phổ biến sau:

1. **Quyền truy cập tệp** - Thư mục cần 755, tệp cần 644
2. **Phiên bản PHP** - Đảm bảo PHP 7.4+ (khuyến nghị 8.x)
3. **Nhật ký lỗi** - Kiểm tra nhật ký lỗi `xoops_data/logs/` và PHP
4. **Cache** - Xóa bộ nhớ đệm trong Quản trị → Hệ thống → Bảo trì

---

## 🗂️ Nội dung phần

### Các vấn đề thường gặp
- Màn hình trắng chết chóc (WSOD)
- Lỗi kết nối cơ sở dữ liệu
- Lỗi từ chối quyền
- Lỗi cài đặt mô-đun
- Lỗi biên dịch mẫu

### Câu hỏi thường gặp
- Câu hỏi thường gặp về cài đặt
- Câu hỏi thường gặp về mô-đun
- Câu hỏi thường gặp về chủ đề
- Câu hỏi thường gặp về hiệu suất

### Gỡ lỗi
- Kích hoạt chế độ gỡ lỗi
- Sử dụng trình gỡ lỗi Ray
- Gỡ lỗi truy vấn cơ sở dữ liệu
- Gỡ lỗi mẫu Smarty

---

## 🚨 Các vấn đề thường gặp và giải pháp

### Màn hình trắng chết chóc (WSOD)

**Triệu chứng:** Trang trắng, không có thông báo lỗi

**Giải pháp:**

1. **Bật tạm thời hiển thị lỗi PHP:**
   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```

2. **Kiểm tra nhật ký lỗi PHP:**
   
```bash
   tail -f /var/log/php/error.log
   
```

3. **Nguyên nhân thường gặp:**
   - Đã vượt quá giới hạn bộ nhớ
   - Lỗi cú pháp PHP nghiêm trọng
   - Thiếu phần mở rộng cần thiết

4. **Khắc phục sự cố bộ nhớ:**
   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```

---

### Lỗi kết nối cơ sở dữ liệu

**Triệu chứng:** "Không thể kết nối với cơ sở dữ liệu" hoặc tương tự

**Giải pháp:**

1. **Xác minh thông tin xác thực trong mainfile.php:**
   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```

2. **Kiểm tra kết nối thủ công:**
   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```

3. **Kiểm tra dịch vụ MySQL:**
   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```

4. **Xác minh quyền của người dùng:**
   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```

---

### Lỗi bị từ chối quyền

**Triệu chứng:** Không upload được file, không lưu được cài đặt

**Giải pháp:**

1. **Đặt quyền chính xác:**
   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```

2. **Đặt quyền sở hữu chính xác:**
   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```

3. **Kiểm tra SELinux (CentOS/RHEL):**
   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```

---

### Lỗi cài đặt mô-đun

**Triệu chứng:** Mô-đun không cài đặt được, lỗi SQL

**Giải pháp:**

1. **Kiểm tra các yêu cầu của mô-đun:**
   - Khả năng tương thích phiên bản PHP
   - Phần mở rộng PHP bắt buộc
   - Khả năng tương thích phiên bản XOOPS

2. **Hướng dẫn cài đặt SQL:**
   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```

3. **Xóa bộ đệm mô-đun:**
   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```

4. **Kiểm tra cú pháp xoops_version.php:**
   
```bash
   php -l modules/mymodule/xoops_version.php
   
```

---

### Lỗi biên dịch mẫu

**Triệu chứng:** Lỗi Smarty, không tìm thấy mẫu

**Giải pháp:**

1. **Xóa bộ nhớ đệm Smarty:**
   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```

2. **Kiểm tra cú pháp mẫu:**
   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```

3. **Xác minh mẫu tồn tại:**
   
```bash
   ls modules/mymodule/templates/
   
```

4. **Tái tạo templates:**
   - Quản trị → Hệ thống → Bảo trì → Mẫu → Tạo lại

---

## 🐛 Kỹ thuật gỡ lỗi

### Kích hoạt Chế độ gỡ lỗi XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Sử dụng Trình gỡ lỗi Ray

Ray là một công cụ sửa lỗi tuyệt vời cho PHP:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Bảng điều khiển gỡ lỗi Smarty

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Ghi nhật ký truy vấn cơ sở dữ liệu

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## ❓ Câu hỏi thường gặp

### Cài đặt

**Q: Trình hướng dẫn cài đặt hiển thị trang trống**
Trả lời: Kiểm tra nhật ký lỗi PHP, đảm bảo PHP có đủ bộ nhớ, xác minh quyền truy cập tệp.**Q: Không thể ghi vào mainfile.php trong khi cài đặt**
Đáp: Đặt quyền: `chmod 666 mainfile.php` trong khi cài đặt, sau đó là `chmod 444`.

**Q: Bảng cơ sở dữ liệu không được tạo**
Trả lời: Kiểm tra xem người dùng MySQL có đặc quyền TẠO BẢNG, xác minh cơ sở dữ liệu tồn tại.

### Mô-đun

**Q: Trang admin của Mô-đun trống**
A: Xóa bộ nhớ đệm, kiểm tra admin/menu.php của mô-đun để tìm lỗi cú pháp.

**Q: Khối mô-đun không hiển thị**
Trả lời: Kiểm tra quyền chặn trong Quản trị → Khối, xác minh khối được gán cho các trang.

**Q: Cập nhật mô-đun không thành công**
A: Sao lưu cơ sở dữ liệu, thử cập nhật SQL thủ công, kiểm tra yêu cầu phiên bản.

### Chủ đề

**Q: Chủ đề không áp dụng đúng**
Trả lời: Xóa bộ đệm Smarty, kiểm tra xem theme.html có tồn tại không, xác minh quyền của chủ đề.

**Q: CSS tùy chỉnh không tải**
A: Kiểm tra đường dẫn tệp, xóa bộ nhớ cache của trình duyệt, xác minh cú pháp CSS.

**Q: Hình ảnh không hiển thị**
Trả lời: Kiểm tra đường dẫn hình ảnh, xác minh quyền của thư mục uploads.

### Hiệu suất

**Q: Trang web rất chậm**
Đáp: Bật bộ nhớ đệm, tối ưu hóa cơ sở dữ liệu, kiểm tra các truy vấn chậm, bật OpCache.

**Q: Mức sử dụng bộ nhớ cao**
Đáp: Tăng giới hạn bộ nhớ, tối ưu hóa các truy vấn lớn, triển khai phân trang.

---

## 🔧 Lệnh bảo trì

### Xóa tất cả bộ nhớ đệm

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Tối ưu hóa cơ sở dữ liệu

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Kiểm tra tính toàn vẹn của tệp

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 Tài liệu liên quan

- Bắt đầu
- Thực tiễn tốt nhất về bảo mật
- Lộ trình XOOPS 4.0

---

## 📚 Nguồn lực bên ngoài

- [Diễn đàn XOOPS](https://xoops.org/modules/newbb/)
- [Sự cố GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [Tham khảo lỗi PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #khắc phục sự cố #gỡ lỗi #câu hỏi thường gặp #lỗi #giải pháp