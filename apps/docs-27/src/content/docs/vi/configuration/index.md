---
title: "Cấu hình cơ bản"
description: "Thiết lập XOOPS ban đầu bao gồm cài đặt mainfile.php, tên trang web, email và cấu hình múi giờ"
---
# Cấu hình XOOPS cơ bản

Hướng dẫn này bao gồm các cài đặt cấu hình cần thiết để giúp trang XOOPS của bạn chạy bình thường sau khi cài đặt.

## Cấu hình mainfile.php

Tệp `mainfile.php` chứa cấu hình quan trọng cho quá trình cài đặt XOOPS của bạn. Nó được tạo trong quá trình cài đặt nhưng bạn có thể cần chỉnh sửa thủ công.

### Vị trí

```
/var/www/html/xoops/mainfile.php
```

### Cấu trúc tệp

```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```

### Giải thích về cài đặt quan trọng

| Cài đặt | Mục đích | Ví dụ |
|---|---|---|
| `XOOPS_DB_TYPE` | Hệ thống cơ sở dữ liệu | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Vị trí máy chủ cơ sở dữ liệu | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Tên người dùng cơ sở dữ liệu | `xoops_user` |
| `XOOPS_DB_PASS` | Mật khẩu cơ sở dữ liệu | [mật khẩu bảo mật] |
| `XOOPS_DB_NAME` | Tên cơ sở dữ liệu | `xoops_db` |
| `XOOPS_DB_PREFIX` | Tiền tố tên bảng | `xoops_` (cho phép nhiều XOOPS trên một DB) |
| `XOOPS_ROOT_PATH` | Đường dẫn hệ thống tập tin vật lý | `/var/www/html/xoops` |
| `XOOPS_URL` | Có thể truy cập web URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Đường dẫn đáng tin cậy (bên ngoài web root) | `/var/www/xoops_var` |

### Chỉnh sửa mainfile.php

Mở mainfile.php trong trình soạn thảo văn bản:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Các thay đổi phổ biến của mainfile.php

**Thay đổi trang URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Bật chế độ gỡ lỗi (chỉ dành cho phát triển):**
```php
define('XOOPS_DEBUG', 1);
```

**Thay đổi tiền tố bảng (nếu cần):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Di chuyển đường dẫn tin cậy ra ngoài web root (nâng cao):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Cấu hình bảng quản trị

Định cấu hình cài đặt cơ bản thông qua bảng XOOPS admin.

### Truy cập Cài đặt Hệ thống

1. Đăng nhập vào bảng admin: `http://your-domain.com/xoops/admin/`
2. Điều hướng đến: **Hệ thống > Tùy chọn > Cài đặt chung**
3. Sửa đổi cài đặt (xem bên dưới)
4. Nhấp vào "Lưu" ở dưới cùng

### Tên trang web và mô tả

Định cấu hình cách trang web của bạn xuất hiện:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Thông tin liên hệ

Đặt chi tiết liên hệ của trang web:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Ngôn ngữ và khu vực

Đặt mặc định language và vùng:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## Cấu hình email

Định cấu hình cài đặt email cho thông báo và liên lạc của người dùng.

### Cài đặt Email Vị trí

**Bảng quản trị:** Hệ thống > Tùy chọn > Cài đặt email

### Cấu hình SMTP

Để gửi email đáng tin cậy, hãy sử dụng SMTP thay vì PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Ví dụ về cấu hình Gmail

Thiết lập XOOPS gửi email qua Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Lưu ý:** Gmail yêu cầu Mật khẩu ứng dụng chứ không phải mật khẩu Gmail của bạn:
1. Vào https://myaccount.google.com/apppasswords
2. Tạo mật khẩu ứng dụng cho "Mail" và "Máy tính Windows"
3. Sử dụng mật khẩu đã tạo trong XOOPS

### Cấu hình PHP mail() (Đơn giản hơn nhưng kém tin cậy hơn)

Nếu SMTP không khả dụng, hãy sử dụng PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Đảm bảo máy chủ của bạn đã cấu hình sendmail hoặc postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Cài đặt chức năng email

Định cấu hình những gì kích hoạt email:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Cấu hình múi giờ

Đặt múi giờ thích hợp để có dấu thời gian và lập lịch chính xác.

### Đặt múi giờ trong bảng quản trị

**Đường dẫn:** Hệ thống > Tùy chọn > Cài đặt chung
```
Default Timezone: [Select your timezone]
```

**Múi giờ chung:**
- Châu Mỹ/New_York (EST/EDT)
- Mỹ/Chicago (CST/CDT)
- Mỹ/Denver (MST/MDT)
- Châu Mỹ/Los_Angeles (PST/PDT)
- Châu Âu/Luân Đôn (GMT/BST)
- Châu Âu/Paris (CET/CEST)
- Châu Á/Tokyo (JST)
- Châu Á/Thượng Hải (CST)
- Úc/Sydney (AEDT/AEST)

### Xác minh múi giờ

Kiểm tra múi giờ máy chủ hiện tại:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Đặt múi giờ hệ thống (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## Cấu hình URL

### Kích hoạt URL sạch (URL thân thiện)

Đối với các URL như `/page/about` thay vì `/index.php?page=about`

**Yêu cầu:**
- Apache đã bật mod_rewrite
- Tệp `.htaccess` trong thư mục gốc XOOPS

**Bật trong Bảng quản trị:**

1. Đi tới: **Hệ thống > Tùy chọn > Cài đặt URL**
2. Kiểm tra: "Bật URL thân thiện"
3. Chọn: "Loại URL" (Thông tin đường dẫn hoặc Truy vấn)
4. Lưu

**Xác minh .htaccess tồn tại:**

```bash
cat /var/www/html/xoops/.htaccess
```

Nội dung .htaccess mẫu:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Khắc phục sự cố URL sạch:**

```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```

### Định cấu hình trang web URL

**Bảng quản trị:** Hệ thống > Tùy chọn > Cài đặt chung

Đặt đúng URL cho miền của bạn:

```
Site URL: http://your-domain.com/xoops/
```

Hoặc nếu XOOPS ở chế độ root:

```
Site URL: http://your-domain.com/
```

## Tối ưu hóa công cụ tìm kiếm (SEO)

Định cấu hình cài đặt SEO để hiển thị công cụ tìm kiếm tốt hơn.

### Thẻ Meta

Đặt thẻ meta toàn cầu:

**Bảng quản trị:** Hệ thống > Tùy chọn > Cài đặt SEO

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Chúng xuất hiện trong trang `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Sơ đồ trang web

Kích hoạt sơ đồ trang web XML cho các công cụ tìm kiếm:

1. Đi tới: **Hệ thống > Mô-đun**
2. Tìm mô-đun "Sơ đồ trang web"
3. Nhấp để cài đặt và kích hoạt
4. Truy cập sitemap tại: `/xoops/sitemap.xml`

### Robots.txt

Kiểm soát việc thu thập thông tin của công cụ tìm kiếm:

Tạo `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Cài đặt người dùng

Định cấu hình cài đặt mặc định liên quan đến người dùng.

### Đăng ký người dùng

**Bảng quản trị:** Hệ thống > Tùy chọn > Cài đặt người dùng

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Hồ sơ người dùng

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Hiển thị email người dùng

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Cấu hình bộ đệm

Cải thiện hiệu suất với bộ nhớ đệm thích hợp.

### Cài đặt bộ đệm

**Bảng quản trị:** Hệ thống > Tùy chọn > Cài đặt bộ đệm

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Xóa bộ nhớ đệm

Xóa các tập tin bộ đệm cũ:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Danh sách kiểm tra cài đặt ban đầu

Sau khi cài đặt, cấu hình:

- [] Tên trang web và mô tả được đặt chính xác
- [ ] Đã định cấu hình email quản trị viên
- [ ] Cài đặt email SMTP được định cấu hình và kiểm tra
- [ ] Múi giờ được đặt theo khu vực của bạn
- [ ] URL được cấu hình đúng
- [] Bật URL sạch (URL thân thiện) nếu muốn
- [ ] Đã định cấu hình cài đặt đăng ký người dùng
- [] Thẻ meta dành cho cấu hình SEO
- [ ] Mặc định đã chọn language
- [] Đã bật cài đặt bộ đệm
- [] Mật khẩu người dùng quản trị viên mạnh (16+ ký tự)
- [ ] Đăng ký người dùng thử nghiệm
- [ ] Kiểm tra chức năng email
- [ ] Tải lên tập tin thử nghiệm
- [ ] Truy cập trang chủ và xác minh sự xuất hiện

## Cấu hình thử nghiệm

### Email kiểm tra

Gửi email kiểm tra:

**Bảng quản trị:** Hệ thống > Kiểm tra email

Hoặc bằng tay:

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```

### Kiểm tra kết nối cơ sở dữ liệu

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```

**Quan trọng:** Xóa các tệp kiểm tra sau khi kiểm tra!

```bash
rm /var/www/html/xoops/test-*.php
```

## Tóm tắt tệp cấu hình| Tập tin | Mục đích | Phương pháp chỉnh sửa |
|---|---|---|
| mainfile.php | Cài đặt cơ sở dữ liệu và cốt lõi | Trình soạn thảo văn bản |
| Bảng quản trị | Hầu hết các cài đặt | Giao diện web |
| .htaccess | Viết lại URL | Trình soạn thảo văn bản |
| robot.txt | Thu thập thông tin công cụ tìm kiếm | Trình soạn thảo văn bản |

## Các bước tiếp theo

Sau khi cấu hình cơ bản:

1. Cấu hình chi tiết cài đặt hệ thống
2. Tăng cường an ninh
3. Khám phá bảng điều khiển admin
4. Tạo nội dung đầu tiên của bạn
5. Thiết lập tài khoản người dùng

---

**Tags:** #configuration #setup #email #timezone #seo

**Bài viết liên quan:**
- ../Cài đặt/Cài đặt
- Cài đặt hệ thống
- Cấu hình bảo mật
- Tối ưu hóa hiệu suất