---
title: "ผู้เผยแพร่ - การกำหนดค่าพื้นฐาน"
description: "คำแนะนำในการกำหนดค่าการตั้งค่าและการกำหนดลักษณะของโมดูลผู้เผยแพร่"
---
# การกำหนดค่าพื้นฐานของผู้เผยแพร่โฆษณา

> กำหนดการตั้งค่าโมดูลผู้เผยแพร่ การกำหนดลักษณะ และตัวเลือกทั่วไปสำหรับการติดตั้ง XOOPS ของคุณ

---

## การเข้าถึงการกำหนดค่า

### การนำทางแผงผู้ดูแลระบบ
```
XOOPS Admin Panel
└── Modules
    └── Publisher
        ├── Preferences
        ├── Settings
        └── Configuration
```
1. เข้าสู่ระบบในฐานะ **ผู้ดูแลระบบ**
2. ไปที่ **แผงผู้ดูแลระบบ → โมดูล**
3. ค้นหาโมดูล **ผู้เผยแพร่**
4. คลิกลิงก์ **การตั้งค่า** หรือ **ผู้ดูแลระบบ**

---

## การตั้งค่าทั่วไป

### การกำหนดค่าการเข้าถึง
```
Admin Panel → Modules → Publisher
```
คลิก **ไอคอนรูปเฟือง** หรือ **การตั้งค่า** สำหรับตัวเลือกเหล่านี้:

#### ตัวเลือกการแสดงผล

| การตั้งค่า | ตัวเลือก | ค่าเริ่มต้น | คำอธิบาย |
|---------|---------|---------|-------------|
| **รายการต่อหน้า** | 5-50 | 10 | บทความที่แสดงในรายการ |
| **แสดงเส้นทาง** | ใช่/ไม่ใช่ | ใช่ | การแสดงเส้นทางการเดินเรือ |
| **ใช้การเพจ** | ใช่/ไม่ใช่ | ใช่ | แบ่งหน้ารายการแบบยาว |
| **แสดงวันที่** | ใช่/ไม่ใช่ | ใช่ | แสดงวันที่บทความ |
| **แสดงหมวดหมู่** | ใช่/ไม่ใช่ | ใช่ | แสดงหมวดหมู่บทความ |
| **แสดงผู้เขียน** | ใช่/ไม่ใช่ | ใช่ | แสดงผู้เขียนบทความ |
| **แสดงมุมมอง** | ใช่/ไม่ใช่ | ใช่ | แสดงจำนวนการดูบทความ |

**ตัวอย่างการกำหนดค่า:**
```yaml
Items Per Page: 15
Show Breadcrumb: Yes
Use Paging: Yes
Show Date: Yes
Show Category: Yes
Show Author: Yes
Show Views: Yes
```
#### ตัวเลือกผู้เขียน

| การตั้งค่า | ค่าเริ่มต้น | คำอธิบาย |
|---------|---------|-------------|
| **แสดงชื่อผู้แต่ง** | ใช่ | แสดงชื่อจริงหรือชื่อผู้ใช้ |
| **ใช้ชื่อผู้ใช้** | ไม่ | แสดงชื่อผู้ใช้แทนชื่อ |
| **แสดงอีเมลของผู้เขียน** | ไม่ | แสดงอีเมลติดต่อผู้เขียน |
| **แสดงอวาตาร์ผู้เขียน** | ใช่ | แสดงอวตารของผู้ใช้ |

---

## การกำหนดค่าตัวแก้ไข

### เลือก WYSIWYG เครื่องมือแก้ไข

ผู้เผยแพร่รองรับบรรณาธิการหลายคน:

#### บรรณาธิการที่มีอยู่
```
mermaid
graph LR
    A[Editor Selection] -->|CKEditor| B[Modern, feature-rich]
    A -->|FCKeditor| C[Legacy, compatible]
    A -->|TinyMCE| D[Lightweight, simple]
    A -->|DHTML Editor| E[Very basic, minimal]
```
### CKEditor (แนะนำ)

**ดีที่สุดสำหรับ:** ผู้ใช้ส่วนใหญ่ เบราว์เซอร์สมัยใหม่ ฟีเจอร์ครบครัน

1. ไปที่ **การตั้งค่า**
2. ตั้งค่า **ตัวแก้ไข**: CKEditor
3. กำหนดค่าตัวเลือก:
```
Editor: CKEditor 4.x
Toolbar: Full
Height: 400px
Width: 100%
Remove plugins: []
Add plugins: [mathjax, codesnippet]
```
### FCKeditor

**ดีที่สุดสำหรับ:** ความเข้ากันได้ ระบบรุ่นเก่า
```
Editor: FCKeditor
Toolbar: Default
Custom config: (optional)
```
### TinyMCE

**เหมาะสำหรับ:** ใช้พื้นที่น้อย การแก้ไขขั้นพื้นฐาน
```
Editor: TinyMCE
Plugins: [paste, table, link, image]
Toolbar: minimal
```
---

## การตั้งค่าไฟล์และอัพโหลด

### กำหนดค่าไดเรกทอรีการอัปโหลด
```
Admin → Publisher → Preferences → Upload Settings
```
#### การตั้งค่าประเภทไฟล์
```yaml
Allowed File Types:
  Images:
    - jpg
    - jpeg
    - gif
    - png
    - webp
  Documents:
    - pdf
    - doc
    - docx
    - xls
    - xlsx
    - ppt
    - pptx
  Archives:
    - zip
    - rar
    - 7z
  Media:
    - mp3
    - mp4
    - webm
    - mov
```
#### ขีดจำกัดขนาดไฟล์

| ประเภทไฟล์ | ขนาดสูงสุด | หมายเหตุ |
|----------|----------|-------|
| **รูปภาพ** | 5 MB | ต่อไฟล์ภาพ |
| **เอกสาร** | 10 MB | PDF ไฟล์ Office |
| **สื่อ** | 50 MB | ไฟล์วิดีโอ/เสียง |
| **ไฟล์ทั้งหมด** | 100 MB | รวมต่อการอัปโหลด |

**การกำหนดค่า:**
```
Max Image Upload Size: 5 MB
Max Document Upload Size: 10 MB
Max Media Upload Size: 50 MB
Total Upload Size: 100 MB
Max Files per Article: 5
```
### การปรับขนาดรูปภาพ

ผู้จัดพิมพ์ปรับขนาดรูปภาพอัตโนมัติเพื่อความสอดคล้อง:
```yaml
Thumbnail Size:
  Width: 150
  Height: 150
  Mode: Crop/Resize

Category Image Size:
  Width: 300
  Height: 200
  Mode: Resize

Article Featured Image:
  Width: 600
  Height: 400
  Mode: Resize
```
---

## การตั้งค่าความคิดเห็นและการโต้ตอบ

### การกำหนดค่าความคิดเห็น
```
Preferences → Comments Section
```
#### ตัวเลือกความคิดเห็น
```yaml
Allow Comments:
  - Enabled: Yes/No
  - Default: Yes
  - Per-article override: Yes

Comment Moderation:
  - Moderate comments: Yes/No
  - Moderate guest comments only: Yes/No
  - Spam filter: Enabled
  - Max comments per day: (unlimited)

Comment Display:
  - Display format: Threaded/Flat
  - Comments per page: 10
  - Date format: Full date/Time ago
  - Show comment count: Yes/No
```
### การกำหนดค่าการให้คะแนน
```yaml
Allow Ratings:
  - Enabled: Yes/No
  - Default: Yes
  - Per-article override: Yes

Rating Options:
  - Rating scale: 5 stars (default)
  - Allow user to rate own: No
  - Show average rating: Yes
  - Show rating count: Yes
```
---

## SEO & URL การตั้งค่า

### การเพิ่มประสิทธิภาพกลไกค้นหา
```
Preferences → SEO Settings
```
#### URL การกำหนดค่า
```yaml
SEO URLs:
  - Enabled: No (set to Yes for SEO URLs)
  - URL rewriting: None/Apache mod_rewrite/IIS rewrite

URL Format:
  - Category: /category/news
  - Article: /article/welcome-to-site
  - Archive: /archive/2024/01

Meta Description:
  - Auto-generate: Yes
  - Max length: 160 characters

Meta Keywords:
  - Auto-generate: Yes
  - From: Article tags, title
```
### เปิดใช้งาน SEO URL (ขั้นสูง)

**ข้อกำหนดเบื้องต้น:**
- Apache ที่เปิดใช้งาน `mod_rewrite`
- เปิดใช้งานการสนับสนุน `.htaccess`

**ขั้นตอนการกำหนดค่า:**

1. ไปที่ **การตั้งค่า → SEO การตั้งค่า**
2. ตั้งค่า **SEO URLs**: ใช่
3. ตั้งค่า **URL การเขียนใหม่**: Apache mod_rewrite
4. ตรวจสอบว่ามีไฟล์ `.htaccess` ในโฟลเดอร์ Publisher

**.htaccess การกำหนดค่า:**
```
apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /modules/publisher/

    # Category rewrites
    RewriteRule ^category/([0-9]+)-(.*)\.html$ index.php?op=showcategory&categoryid=$1 [L,QSA]

    # Article rewrites
    RewriteRule ^article/([0-9]+)-(.*)\.html$ index.php?op=showitem&itemid=$1 [L,QSA]

    # Archive rewrites
    RewriteRule ^archive/([0-9]+)/([0-9]+)/$ index.php?op=archive&year=$1&month=$2 [L,QSA]
</IfModule>
```
---

## แคชและประสิทธิภาพ

### การกำหนดค่าแคช
```
Preferences → Cache Settings
```

```yaml
Enable Caching:
  - Enabled: Yes
  - Cache type: File (or Memcache)

Cache Lifetime:
  - Category lists: 3600 seconds (1 hour)
  - Article lists: 1800 seconds (30 minutes)
  - Single article: 7200 seconds (2 hours)
  - Recent articles block: 900 seconds (15 minutes)

Cache Clear:
  - Manual clear: Available in admin
  - Auto-clear on article save: Yes
  - Clear on category change: Yes
```
### ล้างแคช

**ล้างแคชด้วยตนเอง:**

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → เครื่องมือ**
2. คลิก **ล้างแคช**
3. เลือกประเภทแคชที่จะล้าง:
   - [ ] หมวดหมู่แคช
   - [ ] แคชบทความ
   - [ ] บล็อกแคช
   - [ ] แคชทั้งหมด
4. คลิก **ล้างรายการที่เลือก**

**บรรทัดคำสั่ง:**
```bash
# Clear all Publisher cache
php /path/to/xoops/admin/cache_manage.php publisher

# Or directly delete cache files
rm -rf /path/to/xoops/var/cache/publisher/*
```
---

## การแจ้งเตือนและขั้นตอนการทำงาน

### การแจ้งเตือนทางอีเมล
```
Preferences → Notifications
```

```yaml
Notify Admin on New Article:
  - Enabled: Yes
  - Recipient: Admin email
  - Include summary: Yes

Notify Moderators:
  - Enabled: Yes
  - On new submission: Yes
  - On pending articles: Yes

Notify Author:
  - On approval: Yes
  - On rejection: Yes
  - On comment: No (optional)
```
### ขั้นตอนการส่งผลงาน
```yaml
Require Approval:
  - Enabled: Yes
  - Editor approval: Yes
  - Admin approval: No

Draft Save:
  - Auto-save interval: 60 seconds
  - Save local versions: Yes
  - Revision history: Last 5 versions
```
---

## การตั้งค่าเนื้อหา

### ค่าเริ่มต้นการเผยแพร่
```
Preferences → Content Settings
```

```yaml
Default Article Status:
  - Draft/Published: Draft
  - Featured by default: No
  - Auto-publish time: None

Default Visibility:
  - Public/Private: Public
  - Show on front page: Yes
  - Show in categories: Yes

Scheduled Publishing:
  - Enabled: Yes
  - Allow per-article: Yes

Content Expiration:
  - Enabled: No
  - Auto-archive old: No
  - Archive after days: (unlimited)
```
### WYSIWYG ตัวเลือกเนื้อหา
```yaml
Allow HTML:
  - In articles: Yes
  - In comments: No

Allow Embedded Media:
  - Videos (iframe): Yes
  - Images: Yes
  - Plugins: No

Content Filtering:
  - Strip tags: No
  - XSS filter: Yes (recommended)
```
---

## การตั้งค่าเครื่องมือค้นหา

### กำหนดค่าการรวมการค้นหา
```
Preferences → Search Settings
```

```yaml
Enable Article Indexing:
  - Include in site search: Yes
  - Index type: Full text/Title only

Search Options:
  - Search in titles: Yes
  - Search in content: Yes
  - Search in comments: Yes

Meta Tags:
  - Auto generate: Yes
  - OG tags (social): Yes
  - Twitter cards: Yes
```
---

## การตั้งค่าขั้นสูง

### โหมดแก้ไขข้อบกพร่อง (การพัฒนาเท่านั้น)
```
Preferences → Advanced
```

```yaml
Debug Mode:
  - Enabled: No (only for development!)

Development Features:
  - Show SQL queries: No
  - Log errors: Yes
  - Error email: admin@example.com
```
### การเพิ่มประสิทธิภาพฐานข้อมูล
```
Admin → Tools → Optimize Database
```

```bash
# Manual optimization
mysql> OPTIMIZE TABLE publisher_items;
mysql> OPTIMIZE TABLE publisher_categories;
mysql> OPTIMIZE TABLE publisher_comments;
```
---

## การปรับแต่งโมดูล

### เทมเพลตธีม
```
Preferences → Display → Templates
```
เลือกชุดเทมเพลต:
- ค่าเริ่มต้น
- คลาสสิค
- ทันสมัย
- มืด
- กำหนดเอง

แต่ละเทมเพลตควบคุม:
- เค้าโครงบทความ
- รายการหมวดหมู่
- การแสดงเอกสารเก่า
- แสดงความคิดเห็น

---

## เคล็ดลับการกำหนดค่า

### แนวทางปฏิบัติที่ดีที่สุด
```
mermaid
graph TD
    A[Configuration Strategy] -->|Start| B[Enable basic features]
    B -->|Test| C[Verify functionality]
    C -->|Scale| D[Enable advanced features]
    D -->|Optimize| E[Performance tune]
    E -->|Secure| F[Apply security settings]
```
1. **เริ่มแบบง่าย** - เปิดใช้งานฟีเจอร์หลักก่อน
2. **ทดสอบการเปลี่ยนแปลงแต่ละครั้ง** - ตรวจสอบก่อนดำเนินการต่อ
3. **เปิดใช้งานแคช** - ปรับปรุงประสิทธิภาพ
4. **สำรองข้อมูลก่อน** - ส่งออกการตั้งค่าก่อนการเปลี่ยนแปลงครั้งใหญ่
5. **บันทึกการตรวจสอบ** - ตรวจสอบบันทึกข้อผิดพลาดเป็นประจำ

### การเพิ่มประสิทธิภาพประสิทธิภาพ
```yaml
For Better Performance:
  - Enable caching: Yes
  - Cache lifetime: 3600 seconds
  - Limit items per page: 10-15
  - Compress images: Yes
  - Minify CSS/JS: Yes (if available)
```
### การเพิ่มความปลอดภัย
```yaml
For Better Security:
  - Moderate comments: Yes
  - Disable HTML in comments: Yes
  - XSS filtering: Yes
  - File type whitelist: Strict
  - Max upload size: Reasonable limit
```
---

## การตั้งค่าการส่งออก/นำเข้า

### การกำหนดค่าการสำรองข้อมูล
```
Admin → Tools → Export Settings
```
**หากต้องการสำรองข้อมูลการกำหนดค่าปัจจุบัน:**

1. คลิก **ส่งออกการกำหนดค่า**
2. บันทึกไฟล์ `.cfg` ที่ดาวน์โหลดไว้
3. เก็บในที่ปลอดภัย

**วิธีคืนค่า:**

1. คลิก **นำเข้าการกำหนดค่า**
2. เลือกไฟล์ `.cfg`
3. คลิก **กู้คืน**

---

## คำแนะนำการกำหนดค่าที่เกี่ยวข้อง

- การจัดการหมวดหมู่
- การสร้างบทความ
- การกำหนดค่าการอนุญาต
- คู่มือการติดตั้ง

---

## การกำหนดค่าการแก้ไขปัญหา

### การตั้งค่าจะไม่บันทึก

**วิธีแก้ปัญหา:**
1. ตรวจสอบการอนุญาตไดเรกทอรีบน `/var/config/`
2. ตรวจสอบการเข้าถึงการเขียน PHP
3. ตรวจสอบบันทึกข้อผิดพลาด PHP เพื่อดูปัญหา
4. ล้างแคชของเบราว์เซอร์แล้วลองอีกครั้ง

### ตัวแก้ไขไม่ปรากฏ

**วิธีแก้ปัญหา:**
1. ตรวจสอบว่าติดตั้งปลั๊กอินตัวแก้ไขแล้ว
2. ตรวจสอบการกำหนดค่าตัวแก้ไข XOOPS
3. ลองใช้ตัวเลือกตัวแก้ไขอื่น
4. ตรวจสอบคอนโซลเบราว์เซอร์เพื่อหาข้อผิดพลาด JavaScript

### ปัญหาด้านประสิทธิภาพ

**วิธีแก้ปัญหา:**
1. เปิดใช้งานการแคช
2. ลดรายการต่อหน้า
3. บีบอัดรูปภาพ
4. ตรวจสอบการเพิ่มประสิทธิภาพฐานข้อมูล
5. ตรวจสอบบันทึกการสืบค้นที่ช้า

---

## ขั้นตอนต่อไป

- กำหนดค่าการอนุญาตของกลุ่ม
- สร้างบทความแรกของคุณ
- ตั้งค่าหมวดหมู่
- ตรวจสอบเทมเพลตที่กำหนดเอง

---

#ผู้เผยแพร่ #การกำหนดค่า #การตั้งค่า #การตั้งค่า #xoops