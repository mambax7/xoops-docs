---
title: "การตั้งค่าระบบ"
description: "คู่มือที่ครอบคลุมเกี่ยวกับการตั้งค่าระบบผู้ดูแลระบบ XOOPS ตัวเลือกการกำหนดค่า และลำดับชั้นการตั้งค่า"
---
# XOOPS การตั้งค่าระบบ

คู่มือนี้ครอบคลุมการตั้งค่าระบบทั้งหมดที่มีอยู่ในแผงผู้ดูแลระบบ XOOPS ซึ่งจัดเรียงตามหมวดหมู่

## สถาปัตยกรรมการตั้งค่าระบบ
```
mermaid
graph TD
    A[System Settings] --> B[General Settings]
    A --> C[User Settings]
    A --> D[Module Settings]
    A --> E[Meta Tags & Footer]
    A --> F[Email Settings]
    A --> G[Cache Settings]
    A --> H[URL Settings]
    A --> I[Security Settings]
    B --> B1[Site Name]
    B --> B2[Timezone]
    B --> B3[Language]
    C --> C1[Registration]
    C --> C2[Profiles]
    C --> C3[Permissions]
    F --> F1[SMTP Config]
    F --> F2[Notification Rules]
```
## การเข้าถึงการตั้งค่าระบบ

### ที่ตั้ง

**แผงผู้ดูแลระบบ > ระบบ > การตั้งค่า**

หรือนำทางโดยตรง:
```
http://your-domain.com/xoops/admin/index.php?fct=preferences
```
### ข้อกำหนดการอนุญาต

- เฉพาะผู้ดูแลระบบ (เว็บมาสเตอร์) เท่านั้นที่สามารถเข้าถึงการตั้งค่าระบบ
- การเปลี่ยนแปลงส่งผลต่อทั้งไซต์
- การเปลี่ยนแปลงส่วนใหญ่จะมีผลทันที

## การตั้งค่าทั่วไป

การกำหนดค่าพื้นฐานสำหรับการติดตั้ง XOOPS ของคุณ

### ข้อมูลพื้นฐาน
```
Site Name: [Your Site Name]
Default Description: [Brief description of your site]
Site Slogan: [Catchy slogan]
Admin Email: admin@your-domain.com
Webmaster Name: Administrator Name
Webmaster Email: admin@your-domain.com
```
### การตั้งค่ารูปลักษณ์
```
Default Theme: [Select theme]
Default Language: English (or preferred language)
Items Per Page: 15 (typically 10-25)
Words in Snippet: 25 (for search results)
Theme Upload Permission: Disabled (security)
```
### การตั้งค่าภูมิภาค
```
Default Timezone: [Your timezone]
Date Format: %Y-%m-%d (YYYY-MM-DD format)
Time Format: %H:%M:%S (HH:MM:SS format)
Daylight Saving Time: [Auto/Manual/None]
```
**ตารางรูปแบบเขตเวลา:**

| ภูมิภาค | เขตเวลา | UTC ออฟเซ็ต |
|---|---|---|
| US ตะวันออก | อเมริกา/นิวยอร์ก | -5 / -4 |
| US ภาคกลาง | อเมริกา/ชิคาโก | -6 / -5 |
| US ภูเขา | อเมริกา/เดนเวอร์ | -7 / -6 |
| US แปซิฟิก | อเมริกา/ลอสแอนเจลิส | -8 / -7 |
| UK/ลอนดอน | ยุโรป/ลอนดอน | 0 / +1 |
| ฝรั่งเศส/เยอรมนี | ยุโรป/ปารีส | +1 / +2 |
| ญี่ปุ่น | เอเชีย/โตเกียว | +9 |
| ประเทศจีน | เอเชีย/เซี่ยงไฮ้ | +8 |
| ออสเตรเลีย/ซิดนีย์ | ออสเตรเลีย/ซิดนีย์ | +10 / +11 |

### การกำหนดค่าการค้นหา
```
Enable Search: Yes
Search Admin Pages: Yes/No
Search Archives: Yes
Default Search Type: All / Pages only
Words Excluded from Search: [Comma-separated list]
```
**คำที่ยกเว้นทั่วไป:** the, a, an, และ, หรือ, แต่, ใน, บน, ที่, โดย, ถึง, จาก

## การตั้งค่าผู้ใช้

ควบคุมพฤติกรรมของบัญชีผู้ใช้และขั้นตอนการลงทะเบียน

### การลงทะเบียนผู้ใช้
```
Allow User Registration: Yes/No
Registration Type:
  ☐ Auto-activate (Instant access)
  ☐ Admin approval (Admin must approve)
  ☐ Email verification (User must verify email)

Notification to Users: Yes/No
User Email Verification: Required/Optional
```
### การกำหนดค่าผู้ใช้ใหม่
```
Auto-login New Users: Yes/No
Assign Default User Group: Yes
Default User Group: [Select group]
Create User Avatar: Yes/No
Initial User Avatar: [Select default]
```
### การตั้งค่าโปรไฟล์ผู้ใช้
```
Allow User Profiles: Yes
Show Member List: Yes
Show User Statistics: Yes
Show Last Online Time: Yes
Allow User Avatar: Yes
Avatar Max File Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### การตั้งค่าอีเมลของผู้ใช้
```
Allow Users to Hide Email: Yes
Show Email on Profile: Yes
Notification Email Interval: Immediately/Daily/Weekly/Never
```
### การติดตามกิจกรรมของผู้ใช้
```
Track User Activity: Yes
Log User Logins: Yes
Log Failed Logins: Yes
Track IP Address: Yes
Clear Activity Logs Older Than: 90 days
```
### ขีดจำกัดบัญชี
```
Allow Duplicate Email: No
Minimum Username Length: 3 characters
Maximum Username Length: 15 characters
Minimum Password Length: 6 characters
Require Special Characters: Yes
Require Numbers: Yes
Password Expiration: 90 days (or Never)
Accounts Inactive Days to Delete: 365 days
```
## การตั้งค่าโมดูล

กำหนดค่าลักษณะการทำงานของแต่ละโมดูล

### ตัวเลือกโมดูลทั่วไป

สำหรับแต่ละโมดูลที่ติดตั้ง คุณสามารถตั้งค่า:
```
Module Status: Active/Inactive
Display in Menu: Yes/No
Module Weight: [1-999] (higher = lower in display)
Homepage Default: This module shows when visiting /
Admin Access: [Allowed user groups]
User Access: [Allowed user groups]
```
### การตั้งค่าโมดูลระบบ
```
Show Homepage as: Portal / Module / Static Page
Default Homepage Module: [Select module]
Show Footer Menu: Yes
Footer Color: [Color selector]
Show System Stats: Yes
Show Memory Usage: Yes
```
### การกำหนดค่าต่อโมดูล

แต่ละโมดูลสามารถมีการตั้งค่าเฉพาะโมดูลได้:

**ตัวอย่าง - โมดูลหน้า:**
```
Enable Comments: Yes/No
Moderate Comments: Yes/No
Comments Per Page: 10
Enable Ratings: Yes
Allow Anonymous Ratings: Yes
```
**ตัวอย่าง - โมดูลผู้ใช้:**
```
Avatar Upload Folder: ./uploads/
Maximum Upload Size: 100KB
Allow File Upload: Yes
Allowed File Types: jpg, gif, png
```
เข้าถึงการตั้งค่าเฉพาะโมดูล:
- **ผู้ดูแลระบบ > โมดูล > [ชื่อโมดูล] > การตั้งค่า**

## เมตาแท็ก & SEO การตั้งค่า

กำหนดค่าเมตาแท็กสำหรับการเพิ่มประสิทธิภาพกลไกค้นหา

### เมตาแท็กทั่วโลก
```
Meta Keywords: xoops, cms, content management system
Meta Description: A powerful content management system for building dynamic websites
Meta Author: Your Name
Meta Copyright: Copyright 2025, Your Company
Meta Robots: index, follow
Meta Revisit: 30 days
```
### แนวทางปฏิบัติที่ดีที่สุดสำหรับเมตาแท็ก

| แท็ก | วัตถุประสงค์ | คำแนะนำ |
|---|---|---|
| คำสำคัญ | คำค้นหา | คำหลักที่เกี่ยวข้อง 5-10 คำ คั่นด้วยเครื่องหมายจุลภาค |
| คำอธิบาย | ค้นหารายการ | 150-160 ตัวอักษร |
| ผู้เขียน | ผู้สร้างเพจ | ชื่อหรือบริษัทของคุณ |
| ลิขสิทธิ์ | กฎหมาย | ประกาศเกี่ยวกับลิขสิทธิ์ของคุณ |
| หุ่นยนต์ | คำแนะนำของโปรแกรมรวบรวมข้อมูล | ดัชนีติดตาม (อนุญาตให้จัดทำดัชนี) |

### การตั้งค่าส่วนท้าย
```
Show Footer: Yes
Footer Color: Dark/Light
Footer Background: [Color code]
Footer Text: [HTML allowed]
Additional Footer Links: [URL and text pairs]
```
**ตัวอย่างส่วนท้าย HTML:**
```html
<p>Copyright &copy; 2025 Your Company. All rights reserved.</p>
<p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Use</a></p>
```
### แท็ก Meta โซเชียล (กราฟเปิด)
```
Enable Open Graph: Yes
Facebook App ID: [App ID]
Twitter Card Type: summary / summary_large_image / player
Default Share Image: [Image URL]
```
## การตั้งค่าอีเมล

กำหนดค่าระบบการส่งอีเมลและการแจ้งเตือน

### วิธีการส่งอีเมล
```
Use SMTP: Yes/No

If SMTP:
  SMTP Host: smtp.gmail.com
  SMTP Port: 587 (TLS) or 465 (SSL)
  SMTP Security: TLS / SSL / None
  SMTP Username: [email@example.com]
  SMTP Password: [password]
  SMTP Authentication: Yes/No
  SMTP Timeout: 10 seconds

If PHP mail():
  Sendmail Path: /usr/sbin/sendmail -t -i
```
### การกำหนดค่าอีเมล
```
From Address: noreply@your-domain.com
From Name: Your Site Name
Reply-To Address: support@your-domain.com
BCC Admin Emails: Yes/No
```
### การตั้งค่าการแจ้งเตือน
```
Send Welcome Email: Yes/No
Welcome Email Subject: Welcome to [Site Name]
Welcome Email Body: [Custom message]

Send Password Reset Email: Yes/No
Include Random Password: Yes/No
Token Expiration: 24 hours
```
### การแจ้งเตือนของผู้ดูแลระบบ
```
Notify Admin on Registration: Yes
Notify Admin on Comments: Yes
Notify Admin on Submissions: Yes
Notify Admin on Errors: Yes
```
### การแจ้งเตือนผู้ใช้
```
Notify User on Registration: Yes
Notify User on Comments: Yes
Notify User on Private Messages: Yes
Allow Users to Disable Notifications: Yes
Default Notification Frequency: Immediately
```
### เทมเพลตอีเมล

ปรับแต่งอีเมลแจ้งเตือนในแผงผู้ดูแลระบบ:

**เส้นทาง:** ระบบ > เทมเพลตอีเมล

เทมเพลตที่ใช้ได้:
- การลงทะเบียนผู้ใช้
- รีเซ็ตรหัสผ่าน
- การแจ้งเตือนความคิดเห็น
- ข้อความส่วนตัว
- การแจ้งเตือนระบบ
- อีเมลเฉพาะโมดูล

## การตั้งค่าแคช

เพิ่มประสิทธิภาพการทำงานผ่านการแคช

### การกำหนดค่าแคช
```
Enable Caching: Yes/No
Cache Type:
  ☐ File Cache
  ☐ APCu (Alternative PHP Cache)
  ☐ Memcache (Distributed caching)
  ☐ Redis (Advanced caching)

Cache Lifetime: 3600 seconds (1 hour)
```
### ตัวเลือกแคชตามประเภท

**แคชไฟล์:**
```
Cache Directory: /var/www/html/xoops/cache/
Clear Interval: Daily
Maximum Cache Files: 1000
```
**แคช APCu:**
```
Memory Allocation: 128MB
Fragmentation Level: Low
```
**Memcache/Redis:**
```
Server Host: localhost
Server Port: 11211 (Memcache) / 6379 (Redis)
Persistent Connection: Yes
```
### สิ่งที่ได้รับแคช
```
Cache Module Lists: Yes
Cache Configuration Data: Yes
Cache Template Data: Yes
Cache User Session Data: Yes
Cache Search Results: Yes
Cache Database Queries: Yes
Cache RSS Feeds: Yes
Cache Images: Yes
```
## URL การตั้งค่า

กำหนดค่า URL การเขียนใหม่และการจัดรูปแบบ

### การตั้งค่าที่เป็นมิตร URL
```
Enable Friendly URLs: Yes/No
Friendly URL Type:
  ☐ Path Info: /page/about
  ☐ Query String: /index.php?p=about

Trailing Slash: Include / Omit
URL Case: Lower case / Case sensitive
```
### URL เขียนกฎใหม่
```
.htaccess Rules: [Display current]
Nginx Rules: [Display current if Nginx]
IIS Rules: [Display current if IIS]
```
## การตั้งค่าความปลอดภัย

ควบคุมการกำหนดค่าที่เกี่ยวข้องกับความปลอดภัย

### ความปลอดภัยของรหัสผ่าน
```
Password Policy:
  ☐ Require uppercase letters
  ☐ Require lowercase letters
  ☐ Require numbers
  ☐ Require special characters

Minimum Password Length: 8 characters
Password Expiration: 90 days
Password History: Remember last 5 passwords
Force Password Change: On next login
```
### ความปลอดภัยในการเข้าสู่ระบบ
```
Lock Account After Failed Attempts: 5 attempts
Lock Duration: 15 minutes
Log All Login Attempts: Yes
Log Failed Logins: Yes
Admin Login Alert: Send email on admin login
Two-Factor Authentication: Disabled/Enabled
```
### ความปลอดภัยในการอัพโหลดไฟล์
```
Allow File Uploads: Yes/No
Maximum File Size: 128MB
Allowed File Types: jpg, gif, png, pdf, zip, doc, docx
Scan Uploads for Malware: Yes (if available)
Quarantine Suspicious Files: Yes
```
### ความปลอดภัยของเซสชัน
```
Session Management: Database/Files
Session Timeout: 1800 seconds (30 min)
Session Cookie Lifetime: 0 (until browser closes)
Secure Cookie: Yes (HTTPS only)
HTTP Only Cookie: Yes (prevent JavaScript access)
```
### CORS การตั้งค่า
```
Allow Cross-Origin Requests: No
Allowed Origins: [List domains]
Allow Credentials: No
Allowed Methods: GET, POST
```
## การตั้งค่าขั้นสูง

ตัวเลือกการกำหนดค่าเพิ่มเติมสำหรับผู้ใช้ขั้นสูง

### โหมดแก้ไขข้อบกพร่อง
```
Debug Mode: Disabled/Enabled
Log Level: Error / Warning / Info / Debug
Debug Log File: /var/log/xoops_debug.log
Display Errors: Disabled (production)
```
### การปรับแต่งประสิทธิภาพ
```
Optimize Database Queries: Yes
Use Query Cache: Yes
Compress Output: Yes
Minify CSS/JavaScript: Yes
Lazy Load Images: Yes
```
### การตั้งค่าเนื้อหา
```
Allow HTML in Posts: Yes/No
Allowed HTML Tags: [Configure]
Strip Harmful Code: Yes
Allow Embed: Yes/No
Content Moderation: Automatic/Manual
Spam Detection: Yes
```
## การตั้งค่า ส่งออก/นำเข้า

### การตั้งค่าการสำรองข้อมูล

ส่งออกการตั้งค่าปัจจุบัน:

**แผงผู้ดูแลระบบ > ระบบ > เครื่องมือ > การตั้งค่าการส่งออก**
```bash
# Settings exported as JSON file
# Download and store securely
```
### คืนค่าการตั้งค่า

นำเข้าการตั้งค่าที่ส่งออกก่อนหน้านี้:

**แผงผู้ดูแลระบบ > ระบบ > เครื่องมือ > การตั้งค่าการนำเข้า**
```bash
# Upload JSON file
# Verify changes before confirming
```
## ลำดับชั้นการกำหนดค่า

XOOPS ลำดับชั้นการตั้งค่า (บนลงล่าง - นัดแรกชนะ):
```
1. mainfile.php (Constants)
2. Module-specific config
3. Admin System Settings
4. Theme configuration
5. User preferences (for user-specific settings)
```
## สคริปต์สำรองข้อมูลการตั้งค่า

สร้างการสำรองข้อมูลการตั้งค่าปัจจุบัน:
```php
<?php
// Backup script: /var/www/html/xoops/backup-settings.php
require_once __DIR__ . '/mainfile.php';

$config_handler = xoops_getHandler('config');
$configs = $config_handler->getConfigs();

$backup = [
    'exported_date' => date('Y-m-d H:i:s'),
    'xoops_version' => XOOPS_VERSION,
    'php_version' => PHP_VERSION,
    'settings' => []
];

foreach ($configs as $config) {
    $backup['settings'][$config->getVar('conf_name')] = [
        'value' => $config->getVar('conf_value'),
        'description' => $config->getVar('conf_desc'),
        'type' => $config->getVar('conf_type'),
    ];
}

// Save to JSON file
file_put_contents(
    '/backups/xoops_settings_' . date('YmdHis') . '.json',
    json_encode($backup, JSON_PRETTY_PRINT)
);

echo "Settings backed up successfully!";
?>
```
## การเปลี่ยนแปลงการตั้งค่าทั่วไป

### เปลี่ยนชื่อไซต์

1. ผู้ดูแลระบบ > ระบบ > การตั้งค่า > การตั้งค่าทั่วไป
2. แก้ไข "ชื่อไซต์"
3. คลิก "บันทึก"

### เปิด/ปิดการลงทะเบียน

1. ผู้ดูแลระบบ > ระบบ > การตั้งค่า > การตั้งค่าผู้ใช้
2. สลับ "อนุญาตให้ลงทะเบียนผู้ใช้"
3. เลือกประเภทการลงทะเบียน
4. คลิก "บันทึก"

### เปลี่ยนธีมเริ่มต้น

1. ผู้ดูแลระบบ > ระบบ > การตั้งค่า > การตั้งค่าทั่วไป
2. เลือก "ธีมเริ่มต้น"
3. คลิก "บันทึก"
4. ล้างแคชเพื่อให้การเปลี่ยนแปลงมีผล

### อัปเดตอีเมลติดต่อ

1. ผู้ดูแลระบบ > ระบบ > การตั้งค่า > การตั้งค่าทั่วไป
2. แก้ไข "อีเมลผู้ดูแลระบบ"
3. แก้ไข "อีเมลผู้ดูแลเว็บ"
4. คลิก "บันทึก"

## รายการตรวจสอบการตรวจสอบ

หลังจากกำหนดการตั้งค่าระบบแล้ว ให้ตรวจสอบ:

- [ ] ชื่อไซต์แสดงอย่างถูกต้อง
- [ ] เขตเวลาแสดงเวลาที่ถูกต้อง
- [ ] ส่งการแจ้งเตือนทางอีเมลอย่างถูกต้อง
- [ ] การลงทะเบียนผู้ใช้ทำงานตามที่กำหนดค่าไว้
- [ ] หน้าแรกแสดงค่าเริ่มต้นที่เลือก
- [ ] ฟังก์ชันการค้นหาใช้งานได้
- [ ] แคชช่วยเพิ่มเวลาในการโหลดหน้าเว็บ
- [ ] URL ที่จำง่ายใช้งานได้ (หากเปิดใช้งาน)
- [ ] เมตาแท็กปรากฏในแหล่งที่มาของหน้า
- [ ] ได้รับการแจ้งเตือนจากผู้ดูแลระบบ
- [ ] บังคับใช้การตั้งค่าความปลอดภัย

## การตั้งค่าการแก้ไขปัญหา

### การตั้งค่าไม่บันทึก

**วิธีแก้ปัญหา:**
```bash
# Check file permissions on config directory
chmod 755 /var/www/html/xoops/var/

# Verify database writable
# Try saving again in admin panel
```
### การเปลี่ยนแปลงไม่มีผล

**วิธีแก้ปัญหา:**
```bash
# Clear cache
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# If still not working, restart web server
systemctl restart apache2
```
### อีเมล์ไม่ส่ง

**วิธีแก้ปัญหา:**
1. ตรวจสอบข้อมูลรับรอง SMTP ในการตั้งค่าอีเมล
2. ทดสอบด้วยปุ่ม "ส่งอีเมลทดสอบ"
3. ตรวจสอบบันทึกข้อผิดพลาด
4. ลองใช้ PHP mail() แทน SMTP

## ขั้นตอนต่อไป

หลังจากการกำหนดค่าการตั้งค่าระบบ:

1. กำหนดการตั้งค่าความปลอดภัย
2. เพิ่มประสิทธิภาพการทำงาน
3. สำรวจคุณสมบัติของแผงผู้ดูแลระบบ
4. ตั้งค่าการจัดการผู้ใช้

---

**Tags:** #system-settings #configuration #preferences #admin-panel

**บทความที่เกี่ยวข้อง:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- ความปลอดภัย-การกำหนดค่า
- การเพิ่มประสิทธิภาพการทำงาน
- ../First-Steps/Admin-Panel-ภาพรวม