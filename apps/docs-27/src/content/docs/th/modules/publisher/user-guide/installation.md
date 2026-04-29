---
title: "ผู้จัดพิมพ์ - คู่มือการติดตั้ง"
description: "คำแนะนำทีละขั้นตอนสำหรับการติดตั้งและการเริ่มต้นโมดูลผู้เผยแพร่"
---
# คู่มือการติดตั้งผู้จัดพิมพ์

> คำแนะนำโดยละเอียดสำหรับการติดตั้งและกำหนดค่าโมดูล Publisher สำหรับ XOOPS CMS

---

## ความต้องการของระบบ

### ข้อกำหนดขั้นต่ำ

| ข้อกำหนด | เวอร์ชั่น | หมายเหตุ |
|-------------|---------|-------|
| XOOPS | 2.5.10+ | แพลตฟอร์มหลัก CMS |
| PHP | 7.1+ | PHP 8.x แนะนำ |
| MySQL | 5.7+ | เซิร์ฟเวอร์ฐานข้อมูล |
| เว็บเซิร์ฟเวอร์ | อาปาเช่/Nginx | ด้วยการสนับสนุนการเขียนซ้ำ |

### PHP ส่วนขยาย
```
- PDO (PHP Data Objects)
- pdo_mysql or mysqli
- mb_string (multibyte strings)
- curl (for external content)
- json
- gd (image processing)
```
### พื้นที่ดิสก์

- **ไฟล์โมดูล**: ~5 MB
- **ไดเรกทอรีแคช**: แนะนำ 50+ MB
- **อัพโหลดไดเร็กทอรี**: ตามความจำเป็นสำหรับเนื้อหา

---

## รายการตรวจสอบก่อนการติดตั้ง

ก่อนติดตั้ง Publisher ให้ตรวจสอบ:

- [ ] XOOPS core ได้รับการติดตั้งและใช้งานอยู่
- [ ] บัญชีผู้ดูแลระบบมีสิทธิ์การจัดการโมดูล
- [ ] สร้างการสำรองฐานข้อมูลแล้ว
- [ ] การอนุญาตไฟล์อนุญาตให้เขียนการเข้าถึงไดเร็กทอรี `/modules/`¤
- [ ] PHP ขีดจำกัดหน่วยความจำอย่างน้อย 128 MB
- [ ] ขีดจำกัดขนาดการอัปโหลดไฟล์มีความเหมาะสม (ขั้นต่ำ 10 MB)

---

## ขั้นตอนการติดตั้ง

### ขั้นตอนที่ 1: ดาวน์โหลด Publisher

#### ตัวเลือก A: จาก GitHub (แนะนำ)
```bash
# Navigate to modules directory
cd /path/to/xoops/htdocs/modules/

# Clone the repository
git clone https://github.com/XoopsModules25x/publisher.git

# Verify download
ls -la publisher/
```
#### ตัวเลือก B: ดาวน์โหลดด้วยตนเอง

1. ไปที่ [การเผยแพร่ของผู้เผยแพร่ GitHub](https://github.com/XoopsModules25x/publisher/releases)
2. ดาวน์โหลดไฟล์ `.zip` ล่าสุด
3. แยกเป็น `modules/publisher/`

### ขั้นตอนที่ 2: ตั้งค่าสิทธิ์ของไฟล์
```bash
# Set proper ownership
chown -R www-data:www-data /path/to/xoops/htdocs/modules/publisher

# Set directory permissions (755)
find publisher -type d -exec chmod 755 {} \;

# Set file permissions (644)
find publisher -type f -exec chmod 644 {} \;

# Make scripts executable
chmod 755 publisher/admin/index.php
chmod 755 publisher/index.php
```
### ขั้นตอนที่ 3: ติดตั้งผ่าน XOOPS Admin

1. เข้าสู่ระบบ **XOOPS แผงผู้ดูแลระบบ** ในฐานะผู้ดูแลระบบ
2. ไปที่ **ระบบ → โมดูล**
3. คลิก **ติดตั้งโมดูล**
4. ค้นหา **ผู้เผยแพร่** ในรายการ
5. คลิกปุ่ม **ติดตั้ง**
6. รอให้การติดตั้งเสร็จสิ้น (แสดงตารางฐานข้อมูลที่สร้างขึ้น)
```
Installation Progress:
✓ Tables created
✓ Configuration initialized
✓ Permissions set
✓ Cache cleared
Installation Complete!
```
---

## การตั้งค่าเริ่มต้น

### ขั้นตอนที่ 1: เข้าถึงผู้ดูแลระบบผู้เผยแพร่

1. ไปที่ **แผงผู้ดูแลระบบ → โมดูล**
2. ค้นหาโมดูล **ผู้เผยแพร่**
3. คลิกลิงก์ **ผู้ดูแลระบบ**
4. ขณะนี้คุณอยู่ในการดูแลผู้เผยแพร่โฆษณา

### ขั้นตอนที่ 2: กำหนดการตั้งค่าโมดูล

1. คลิก **การตั้งค่า** ในเมนูด้านซ้าย
2. กำหนดการตั้งค่าพื้นฐาน:
```
General Settings:
- Editor: Select your WYSIWYG editor
- Items per page: 10
- Show breadcrumb: Yes
- Allow comments: Yes
- Allow ratings: Yes

SEO Settings:
- SEO URLs: No (enable later if needed)
- URL rewriting: None

Upload Settings:
- Max upload size: 5 MB
- Allowed file types: jpg, png, gif, pdf, doc, docx
```
3. คลิก **บันทึกการตั้งค่า**

### ขั้นตอนที่ 3: สร้างหมวดหมู่แรก

1. คลิก **หมวดหมู่** ในเมนูด้านซ้าย
2. คลิก **เพิ่มหมวดหมู่**
3. กรอกแบบฟอร์ม:
```
Category Name: News
Description: Latest news and updates
Image: (optional) Upload category image
Parent Category: (leave blank for top-level)
Status: Enabled
```
4. คลิก **บันทึกหมวดหมู่**

### ขั้นตอนที่ 4: ตรวจสอบการติดตั้ง

ตรวจสอบตัวบ่งชี้เหล่านี้:
```
mermaid
graph TD
    A[Installation Check] -->|Database| B[✓ Tables exist]
    A -->|Files| C[✓ Folders writable]
    A -->|Admin| D[✓ Module visible]
    A -->|Frontend| E[✓ Module displays]
```
#### ตรวจสอบฐานข้อมูล
```bash
mysql -u xoops_user -p xoops_database
mysql> SHOW TABLES LIKE 'publisher%';

# Should show tables:
# - publisher_categories
# - publisher_items
# - publisher_comments
# - publisher_files
```
#### ตรวจเช็คส่วนหน้า

1. ไปที่หน้าแรก XOOPS ของคุณ
2. มองหาบล็อก **ผู้เผยแพร่** หรือ **ข่าว**
3. ควรแสดงบทความล่าสุด

---

## การกำหนดค่าหลังการติดตั้ง

### การเลือกตัวแก้ไข

ผู้เผยแพร่รองรับโปรแกรมแก้ไข WYSIWYG หลายตัว:

| บรรณาธิการ | ข้อดี | ข้อเสีย |
|--------|-------|-|
| FCKeditor | คุณสมบัติหลากหลาย | เก่ากว่า ใหญ่กว่า |
| CKEditor | มาตรฐานทันสมัย ​​| กำหนดค่าความซับซ้อน |
| TinyMCE | น้ำหนักเบา | คุณสมบัติที่จำกัด |
| DHTML เครื่องมือแก้ไข | พื้นฐาน | พื้นฐานมาก |

**วิธีเปลี่ยนตัวแก้ไข:**

1. ไปที่ **การตั้งค่า**
2. เลื่อนไปที่การตั้งค่า **ตัวแก้ไข**
3. เลือกจากเมนูแบบเลื่อนลง
4. บันทึกและทดสอบ

### อัปโหลดการตั้งค่าไดเรกทอรี
```bash
# Create upload directories
mkdir -p /path/to/xoops/uploads/publisher/
mkdir -p /path/to/xoops/uploads/publisher/categories/
mkdir -p /path/to/xoops/uploads/publisher/images/
mkdir -p /path/to/xoops/uploads/publisher/files/

# Set permissions
chmod 755 /path/to/xoops/uploads/publisher/
chmod 755 /path/to/xoops/uploads/publisher/*
```
### กำหนดขนาดภาพ

ในการตั้งค่า ให้ตั้งค่าขนาดรูปย่อ:
```
Category image size: 300 x 200 px
Article image size: 600 x 400 px
Thumbnail size: 150 x 100 px
```
---

## ขั้นตอนหลังการติดตั้ง

### 1. ตั้งค่าสิทธิ์ของกลุ่ม

1. ไปที่ **สิทธิ์** ในเมนูผู้ดูแลระบบ
2. กำหนดค่าการเข้าถึงสำหรับกลุ่ม:
   - ไม่ระบุชื่อ: ดูเท่านั้น
   - ผู้ใช้ที่ลงทะเบียน: ส่งบทความ
   - บรรณาธิการ: อนุมัติ/แก้ไขบทความ
   - ผู้ดูแลระบบ: การเข้าถึงแบบเต็ม

### 2. กำหนดค่าการมองเห็นโมดูล

1. ไปที่ **บล็อก** ใน XOOPS admin
2. ค้นหาบล็อกผู้จัดพิมพ์:
   - ผู้จัดพิมพ์ - บทความล่าสุด
   - ผู้จัดพิมพ์ - หมวดหมู่
   - สำนักพิมพ์ - หอจดหมายเหตุ
3. กำหนดค่าการมองเห็นบล็อกต่อหน้า

### 3. นำเข้าเนื้อหาทดสอบ (ไม่บังคับ)

สำหรับการทดสอบ ให้นำเข้าบทความตัวอย่าง:

1. ไปที่ **ผู้ดูแลระบบผู้เผยแพร่ → นำเข้า**
2. เลือก **เนื้อหาตัวอย่าง**
3. คลิก **นำเข้า**

### 4. เปิดใช้งาน URL SEO (ไม่บังคับ)

สำหรับ URL ที่ง่ายต่อการค้นหา:

1. ไปที่ **การตั้งค่า**
2. ตั้งค่า **SEO URLs**: ใช่
3. เปิดใช้งาน **.htaccess** การเขียนใหม่
4. ตรวจสอบว่ามีไฟล์ `.htaccess` ในโฟลเดอร์ Publisher
```
apache
# .htaccess example
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /modules/publisher/
    RewriteRule ^category/([0-9]+)-(.*)\.html$ index.php?op=showcategory&categoryid=$1 [L]
    RewriteRule ^article/([0-9]+)-(.*)\.html$ index.php?op=showitem&itemid=$1 [L]
</IfModule>
```
---

## การแก้ไขปัญหาการติดตั้ง

### ปัญหา: โมดูลไม่ปรากฏในผู้ดูแลระบบ

**วิธีแก้ปัญหา:**
```bash
# Check file permissions
ls -la /path/to/xoops/modules/publisher/

# Check xoops_version.php exists
ls /path/to/xoops/modules/publisher/xoops_version.php

# Verify PHP syntax
php -l /path/to/xoops/modules/publisher/xoops_version.php
```
### ปัญหา: ไม่ได้สร้างตารางฐานข้อมูล

**วิธีแก้ปัญหา:**
1. ตรวจสอบว่าผู้ใช้ MySQL มีสิทธิ์ CREATE TABLE
2. ตรวจสอบบันทึกข้อผิดพลาดของฐานข้อมูล:
   ``` ทุบตี
   mysql> SHOW WARNINGS;
   
```
3. นำเข้า SQL ด้วยตนเอง:
   ``` ทุบตี
   mysql -u ผู้ใช้ -p ฐานข้อมูล < modules/publisher/sql/mysql.sql
   
```

### ปัญหา: การอัปโหลดไฟล์ล้มเหลว

**วิธีแก้ปัญหา:**
```bash
# Check directory exists and is writable
stat /path/to/xoops/uploads/publisher/

# Fix permissions
chmod 777 /path/to/xoops/uploads/publisher/

# Verify PHP settings
php -i | grep upload_max_filesize
```
### ปัญหา: ข้อผิดพลาด "ไม่พบหน้า"

**วิธีแก้ปัญหา:**
1. ตรวจสอบว่ามีไฟล์ `.htaccess` อยู่
2. ตรวจสอบการเปิดใช้งาน Apache `mod_rewrite`:
   ``` ทุบตี
   a2enmod เขียนใหม่
   systemctl รีสตาร์ท apache2
   
```
3. ตรวจสอบ `AllowOverride All` ใน Apache config

---

## อัปเกรดจากเวอร์ชันก่อนหน้า

### จากผู้เผยแพร่ 1.x ถึง 2.x

1. **การสำรองข้อมูลการติดตั้งปัจจุบัน:**
   ``` ทุบตี
   cp -r โมดูล/ผู้เผยแพร่/ โมดูล/ผู้เผยแพร่สำรอง/
   mysqldump -u ผู้ใช้ -p ฐานข้อมูล > publisher-backup.sql
   
```

2. **ดาวน์โหลด Publisher 2.x**

3. **เขียนทับไฟล์:**
   ``` ทุบตี
   โมดูล rm -rf/ผู้เผยแพร่/
   เปิดเครื่องรูดผู้เผยแพร่-2.0.zip -d โมดูล/
   
```

4. **เรียกใช้การอัปเดต:**
   - ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → อัปเดต**
   - คลิก **อัพเดตฐานข้อมูล**
   - รอให้เสร็จสิ้น

5. **ยืนยัน:**
   - ตรวจสอบบทความทั้งหมดที่แสดงอย่างถูกต้อง
   - ตรวจสอบว่าการอนุญาตยังคงอยู่
   - ทดสอบการอัพโหลดไฟล์

---

## ข้อควรพิจารณาด้านความปลอดภัย

### สิทธิ์ของไฟล์
```
- Core files: 644 (readable by web server)
- Directories: 755 (browseable by web server)
- Upload directories: 755 or 777
- Config files: 600 (not readable by web)
```
### ปิดการใช้งานการเข้าถึงไฟล์ที่ละเอียดอ่อนโดยตรง

สร้าง `.htaccess` ในไดเรกทอรีอัปโหลด:
```
apache
<FilesMatch "\.(php|phtml|php3|php4|php5|phtml)$">
    Deny from all
</FilesMatch>
```
### ความปลอดภัยของฐานข้อมูล
```bash
# Use strong password
ALTER USER 'publisher_user'@'localhost' IDENTIFIED BY 'strong_password_here';

# Grant minimal permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON publisher_db.* TO 'publisher_user'@'localhost';
FLUSH PRIVILEGES;
```
---

## รายการตรวจสอบการตรวจสอบ

หลังการติดตั้ง ให้ตรวจสอบ:

- [ ] โมดูลปรากฏในรายการโมดูลผู้ดูแลระบบ
- [ ] สามารถเข้าถึงส่วนผู้ดูแลระบบผู้เผยแพร่
- [ ] สามารถสร้างหมวดหมู่ได้
- [ ] สามารถสร้างบทความได้
- [ ] บทความแสดงอยู่ที่ส่วนหน้า
- [ ] อัพโหลดไฟล์ได้
- [ ] แสดงภาพได้อย่างถูกต้อง
- [ ] มีการใช้สิทธิ์อย่างถูกต้อง
- [ ] สร้างตารางฐานข้อมูลแล้ว
- [ ] ไดเร็กทอรีแคชสามารถเขียนได้

---

## ขั้นตอนต่อไป

หลังจากติดตั้งสำเร็จ:

1. อ่านคู่มือการกำหนดค่าพื้นฐาน
2. สร้างบทความแรกของคุณ
3. ตั้งค่าการอนุญาตแบบกลุ่ม
4. ตรวจสอบการจัดการหมวดหมู่

---

## การสนับสนุนและทรัพยากร

- **ปัญหา GitHub**: [ปัญหาของผู้เผยแพร่](https://github.com/XoopsModules25x/publisher/issues)
- **XOOPS ฟอรัม**: [การสนับสนุนชุมชน](https://www.xoops.org/modules/newbb/)
- **GitHub Wiki**: [ความช่วยเหลือในการติดตั้ง](https://github.com/XoopsModules25x/publisher/wiki)

---

#publisher #การติดตั้ง #setup #xoops #module #configuration