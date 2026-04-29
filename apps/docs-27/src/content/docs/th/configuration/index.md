---
title: "การกำหนดค่าพื้นฐาน"
description: "การตั้งค่า XOOPS เริ่มต้น รวมถึงการตั้งค่า mainfile.php ชื่อไซต์ อีเมล และการกำหนดค่าเขตเวลา"
---
# การกำหนดค่าพื้นฐาน XOOPS

คู่มือนี้ครอบคลุมถึงการตั้งค่าที่จำเป็นเพื่อให้ไซต์ XOOPS ทำงานอย่างถูกต้องหลังการติดตั้ง

## mainfile.php การกำหนดค่า

ไฟล์ `mainfile.php` มีการกำหนดค่าที่สำคัญสำหรับการติดตั้ง XOOPS ของคุณ มันถูกสร้างขึ้นระหว่างการติดตั้ง แต่คุณอาจต้องแก้ไขด้วยตนเอง

### ที่ตั้ง
```
/var/www/html/xoops/mainfile.php
```
### โครงสร้างไฟล์
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
### อธิบายการตั้งค่าที่สำคัญแล้ว

| การตั้งค่า | วัตถุประสงค์ | ตัวอย่าง |
|---|---|---|
| `XOOPS_DB_TYPE` | ระบบฐานข้อมูล | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | ตำแหน่งเซิร์ฟเวอร์ฐานข้อมูล | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | ชื่อผู้ใช้ฐานข้อมูล | `xoops_user` |
| `XOOPS_DB_PASS` | รหัสผ่านฐานข้อมูล | [รหัสผ่านที่ปลอดภัย] |
| `XOOPS_DB_NAME` | ชื่อฐานข้อมูล | `xoops_db` |
| `XOOPS_DB_PREFIX` | คำนำหน้าชื่อตาราง | `xoops_` (อนุญาตหลาย XOOPS ในหนึ่ง DB¤) |
| `XOOPS_ROOT_PATH` | เส้นทางระบบไฟล์ฟิสิคัล | `/var/www/html/xoops` |
| `XOOPS_URL` | เข้าถึงเว็บได้ URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | เส้นทางที่เชื่อถือได้ (นอกรูทเว็บ) | `/var/www/xoops_var` |

### กำลังแก้ไข mainfile.php

เปิด mainfile.php ในโปรแกรมแก้ไขข้อความ:
```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```
### การเปลี่ยนแปลงทั่วไป mainfile.php

**เปลี่ยนไซต์ URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```
**เปิดใช้งานโหมดแก้ไขข้อบกพร่อง (การพัฒนาเท่านั้น):**
```php
define('XOOPS_DEBUG', 1);
```
**เปลี่ยนคำนำหน้าตาราง (หากจำเป็น):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**ย้ายเส้นทางความน่าเชื่อถือไปนอกเว็บรูท (ขั้นสูง):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## การกำหนดค่าแผงผู้ดูแลระบบ

กำหนดการตั้งค่าพื้นฐานผ่านแผงผู้ดูแลระบบ XOOPS

### การเข้าถึงการตั้งค่าระบบ

1. เข้าสู่แผงผู้ดูแลระบบ: `http://your-domain.com/xoops/admin/`
2. ไปที่: **ระบบ > การตั้งค่า > การตั้งค่าทั่วไป**
3. แก้ไขการตั้งค่า (ดูด้านล่าง)
4. คลิก "บันทึก" ที่ด้านล่าง

### ชื่อไซต์และคำอธิบาย

กำหนดค่าลักษณะที่เว็บไซต์ของคุณปรากฏ:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### ข้อมูลการติดต่อ

ตั้งค่ารายละเอียดการติดต่อของไซต์:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### ภาษาและภูมิภาค

ตั้งค่าภาษาและภูมิภาคเริ่มต้น:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## การกำหนดค่าอีเมล

กำหนดการตั้งค่าอีเมลสำหรับการแจ้งเตือนและการสื่อสารกับผู้ใช้

### ตำแหน่งการตั้งค่าอีเมล

**แผงผู้ดูแลระบบ:** ระบบ > การตั้งค่า > การตั้งค่าอีเมล

### SMTP การกำหนดค่า

เพื่อการส่งอีเมลที่เชื่อถือได้ ให้ใช้ SMTP แทน PHP mail():
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### ตัวอย่างการกำหนดค่า Gmail

ตั้งค่า XOOPS เพื่อส่งอีเมลผ่าน Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**หมายเหตุ:** Gmail ต้องใช้รหัสผ่านสำหรับแอป ไม่ใช่รหัสผ่าน Gmail ของคุณ:
1. ไปที่ https://myaccount.google.com/apppasswords
2. สร้างรหัสผ่านสำหรับแอปสำหรับ "Mail" และ "Windows Computer"
3. ใช้รหัสผ่านที่สร้างขึ้นใน XOOPS

### PHP mail() การกำหนดค่า (เรียบง่ายแต่เชื่อถือได้น้อยกว่า)

หาก SMTP ไม่พร้อมใช้งาน ให้ใช้ PHP mail():
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
ตรวจสอบให้แน่ใจว่าเซิร์ฟเวอร์ของคุณมีการกำหนดค่า sendmail หรือ postfix:
```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### การตั้งค่าฟังก์ชั่นอีเมล

กำหนดค่าสิ่งที่กระตุ้นให้เกิดอีเมล:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## การกำหนดค่าเขตเวลา

Set proper timezone for correct timestamps and scheduling.

### การตั้งค่าเขตเวลาในแผงผู้ดูแลระบบ

**Path:** System > Preferences > General Settings
```
Default Timezone: [Select your timezone]
```
**เขตเวลาทั่วไป:**
- อเมริกา/นิวยอร์ก (EST/EDT)
- อเมริกา/ชิคาโก (CST/CDT)
- อเมริกา/เดนเวอร์ (MST/MDT)
- อเมริกา/ลอส_แองเจลิส (PST/PDT)
- ยุโรป/ลอนดอน (GMT/BST)
- ยุโรป/ปารีส (CET/CEST)
- เอเชีย/โตเกียว (JST)
- เอเชีย/เซี่ยงไฮ้ (CST)
- ออสเตรเลีย/ซิดนีย์ (AEDT/AEST)

### ยืนยันเขตเวลา

ตรวจสอบเขตเวลาเซิร์ฟเวอร์ปัจจุบัน:
```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### ตั้งค่าเขตเวลาของระบบ (Linux)
```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## URL การกำหนดค่า

### เปิดใช้งาน Clean URL (URL ที่เป็นมิตร)

สำหรับ URL เช่น `/page/about` แทนที่จะเป็น `/index.php?page=about`

**ข้อกำหนด:**
- Apache พร้อมเปิดใช้งาน mod_rewrite
- `.htaccess` ไฟล์ใน XOOPS root

**เปิดใช้งานในแผงผู้ดูแลระบบ:**

1. ไปที่: **ระบบ > การตั้งค่า > URL การตั้งค่า**
2. ตรวจสอบ: "เปิดใช้งาน URL ที่จำง่าย"
3. เลือก: "URL Type" (ข้อมูลเส้นทางหรือแบบสอบถาม)
4. บันทึก

**ตรวจสอบว่ามี .htaccess อยู่:**
```bash
cat /var/www/html/xoops/.htaccess
```
ตัวอย่างเนื้อหา .htaccess:
```
apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**การแก้ไขปัญหา URL ที่สะอาด:**
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
### กำหนดค่าไซต์ URL

**แผงผู้ดูแลระบบ:** ระบบ > การตั้งค่า > การตั้งค่าทั่วไป

ตั้งค่า URL ที่ถูกต้องสำหรับโดเมนของคุณ:
```
Site URL: http://your-domain.com/xoops/
```
หรือถ้า XOOPS อยู่ในรูท:
```
Site URL: http://your-domain.com/
```
## การเพิ่มประสิทธิภาพกลไกค้นหา (SEO)

กำหนดการตั้งค่า SEO เพื่อการมองเห็นเครื่องมือค้นหาที่ดีขึ้น

### เมตาแท็ก

ตั้งค่าเมตาแท็กส่วนกลาง:

**แผงผู้ดูแลระบบ:** ระบบ > การตั้งค่า > การตั้งค่า SEO
```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```
สิ่งเหล่านี้ปรากฏในหน้า `<head>`:
```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### แผนผังเว็บไซต์

เปิดใช้งานแผนผังเว็บไซต์ XML สำหรับเครื่องมือค้นหา:

1. ไปที่: **ระบบ > โมดูล**
2. ค้นหาโมดูล "แผนผังเว็บไซต์"
3. คลิกเพื่อติดตั้งและเปิดใช้งาน
4. เข้าถึงแผนผังเว็บไซต์ได้ที่: `/xoops/sitemap.xml`

### โรบอต.txt

ควบคุมการรวบรวมข้อมูลของเครื่องมือค้นหา:

สร้าง `/var/www/html/xoops/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```
## การตั้งค่าผู้ใช้

กำหนดการตั้งค่าเริ่มต้นที่เกี่ยวข้องกับผู้ใช้

### การลงทะเบียนผู้ใช้

**แผงผู้ดูแลระบบ:** ระบบ > การตั้งค่า > การตั้งค่าผู้ใช้
```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```
### โปรไฟล์ผู้ใช้
```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### การแสดงอีเมลผู้ใช้
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## การกำหนดค่าแคช

ปรับปรุงประสิทธิภาพด้วยการแคชที่เหมาะสม

### การตั้งค่าแคช

**แผงผู้ดูแลระบบ:** ระบบ > การตั้งค่า > การตั้งค่าแคช
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### ล้างแคช

ล้างไฟล์แคชเก่า:
```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## รายการตรวจสอบการตั้งค่าเริ่มต้น

หลังการติดตั้ง ให้กำหนดค่า:

- [ ] ตั้งค่าชื่อเว็บไซต์และคำอธิบายอย่างถูกต้อง
- [ ] กำหนดค่าอีเมลผู้ดูแลระบบแล้ว
- [ ] SMTP การตั้งค่าอีเมลได้รับการกำหนดค่าและทดสอบแล้ว
- [ ] ตั้งค่าเขตเวลาตามภูมิภาคของคุณ
- [ ] URL กำหนดค่าอย่างถูกต้อง
- [ ] เปิดใช้งานการล้าง URL (URL ที่จำง่าย) หากต้องการ
- [ ] กำหนดค่าการตั้งค่าการลงทะเบียนผู้ใช้แล้ว
- [ ] เมตาแท็กสำหรับ SEO กำหนดค่าแล้ว
- [ ] เลือกภาษาเริ่มต้นแล้ว
- [ ] เปิดใช้งานการตั้งค่าแคชแล้ว
- [ ] รหัสผ่านผู้ใช้ผู้ดูแลระบบนั้นรัดกุม (16+ ตัวอักษร)
- [ ] ทดสอบการลงทะเบียนผู้ใช้
- [ ] ทดสอบฟังก์ชันการทำงานของอีเมล
- [ ] ทดสอบการอัพโหลดไฟล์
- [ ] ไปที่หน้าแรกและตรวจสอบลักษณะที่ปรากฏ

## การกำหนดค่าการทดสอบ

### อีเมลทดสอบ

ส่งอีเมลทดสอบ:

**แผงผู้ดูแลระบบ:** ระบบ > การทดสอบอีเมล

หรือด้วยตนเอง:
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
### ทดสอบการเชื่อมต่อฐานข้อมูล
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
**ข้อสำคัญ:** ลบไฟล์ทดสอบหลังการทดสอบ!
```bash
rm /var/www/html/xoops/test-*.php
```
## สรุปไฟล์การกำหนดค่า

| ไฟล์ | วัตถุประสงค์ | แก้ไขวิธีการ |
|---|---|---|
| mainfile.php | การตั้งค่าฐานข้อมูลและคอร์ | โปรแกรมแก้ไขข้อความ |
| แผงผู้ดูแลระบบ | การตั้งค่าส่วนใหญ่ | เว็บอินเตอร์เฟส |
| .htaccess | URL เขียนใหม่ | โปรแกรมแก้ไขข้อความ |
| robots.txt | การรวบรวมข้อมูลของเครื่องมือค้นหา | โปรแกรมแก้ไขข้อความ |

## ขั้นตอนต่อไป

หลังจากการกำหนดค่าพื้นฐาน:

1. กำหนดการตั้งค่าระบบโดยละเอียด
2. เพิ่มความปลอดภัย
3. สำรวจแผงผู้ดูแลระบบ
4. สร้างเนื้อหาแรกของคุณ
5. ตั้งค่าบัญชีผู้ใช้

---

**แท็ก:** #configuration #setup #email #timezone #seo

**บทความที่เกี่ยวข้อง:**
- ../การติดตั้ง/การติดตั้ง
- ระบบ-การตั้งค่า
- ความปลอดภัย-การกำหนดค่า
- การเพิ่มประสิทธิภาพการทำงาน