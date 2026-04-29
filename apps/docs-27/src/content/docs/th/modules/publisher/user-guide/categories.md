---
title: "ผู้จัดพิมพ์ - การจัดการหมวดหมู่"
description: "คู่มือการสร้าง จัดระเบียบ และจัดการหมวดหมู่บทความใน Publisher"
---
# การจัดการหมวดหมู่ใน Publisher

> คู่มือฉบับสมบูรณ์สำหรับการสร้าง การจัดลำดับชั้น และการจัดการหมวดหมู่ในโมดูลผู้เผยแพร่

---

## พื้นฐานหมวดหมู่

### หมวดหมู่คืออะไร?

หมวดหมู่จัดระเบียบบทความออกเป็นกลุ่มตรรกะ:
```
Example Structure:

  News (Main Category)
    ├── Technology
    ├── Sports
    └── Entertainment

  Tutorials (Main Category)
    ├── Photography
    │   ├── Basics
    │   └── Advanced
    └── Writing
        └── Blogging
```
### ประโยชน์ของโครงสร้างหมวดหมู่ที่ดี
```
✓ Better user navigation
✓ Organized content
✓ Improved SEO
✓ Easier content management
✓ Better editorial workflow
```
---

## การจัดการหมวดหมู่การเข้าถึง

### การนำทางแผงผู้ดูแลระบบ
```
Admin Panel
└── Modules
    └── Publisher
        └── Categories
            ├── Create New
            ├── Edit
            ├── Delete
            ├── Permissions
            └── Organize
```
### การเข้าถึงด่วน

1. เข้าสู่ระบบในฐานะ **ผู้ดูแลระบบ**
2. ไปที่ **ผู้ดูแลระบบ → โมดูล**
3. คลิก **ผู้เผยแพร่ → ผู้ดูแลระบบ**
4. คลิก **หมวดหมู่** ในเมนูด้านซ้าย

---

## การสร้างหมวดหมู่

### แบบฟอร์มการสร้างหมวดหมู่
```
mermaid
graph TD
    A[Create Category] -->|Step 1| B[Basic Info]
    A -->|Step 2| C[Details]
    A -->|Step 3| D[Images]
    A -->|Step 4| E[Settings]
    A -->|Step 5| F[Save]
```
### ขั้นตอนที่ 1: ข้อมูลพื้นฐาน

#### ชื่อหมวดหมู่
```
Field: Category Name
Type: Text input (required)
Max length: 100 characters
Uniqueness: Should be unique
Example: "Photography"
```
**แนวทาง:**
- พรรณนาและเป็นเอกพจน์หรือพหูพจน์อย่างสม่ำเสมอ
- ใช้ตัวพิมพ์ใหญ่อย่างเหมาะสม
- หลีกเลี่ยงอักขระพิเศษ
- สั้นพอสมควร

#### คำอธิบายหมวดหมู่
```
Field: Description
Type: Textarea (optional)
Max length: 500 characters
Used in: Category listing pages, category blocks
```
**วัตถุประสงค์:**
- อธิบายเนื้อหาหมวดหมู่
- ปรากฏเหนือบทความหมวดหมู่
- ช่วยให้ผู้ใช้เข้าใจขอบเขต
- ใช้สำหรับคำอธิบายเมตา SEO

**ตัวอย่าง:**
```
"Photography tips, tutorials, and inspiration for
all skill levels. From composition basics to advanced
lighting techniques, master your craft."
```
### ขั้นตอนที่ 2: หมวดหมู่ผู้ปกครอง

#### สร้างลำดับชั้น
```
Field: Parent Category
Type: Dropdown
Options: None (root), or existing categories
```
**ตัวอย่างลำดับชั้น:**
```
Flat Structure:
  News
  Tutorials
  Reviews

Nested Structure:
  News
    Technology
    Business
    Sports
  Tutorials
    Photography
      Basics
      Advanced
    Writing
```
**สร้างหมวดหมู่ย่อย:**

1. คลิกเมนูแบบเลื่อนลง **หมวดหมู่หลัก**
2. เลือกผู้ปกครอง (เช่น "ข่าว")
3. กรอกชื่อหมวดหมู่
4. บันทึก
5. หมวดหมู่ใหม่จะปรากฏเป็นรายการย่อย

### ขั้นตอนที่ 3: รูปภาพหมวดหมู่

#### อัพโหลดภาพหมวดหมู่
```
Field: Category Image
Type: Image upload (optional)
Format: JPG, PNG, GIF, WebP
Max size: 5 MB
Recommended: 300x200 px (or your theme size)
```
**การอัพโหลด:**

1. คลิกปุ่ม **อัปโหลดรูปภาพ**
2. เลือกภาพจากคอมพิวเตอร์
3. ครอบตัด/ปรับขนาดหากจำเป็น
4. คลิก **ใช้รูปภาพนี้**

**ใช้ที่ไหน:**
- หน้ารายการหมวดหมู่
- ส่วนหัวของบล็อกหมวดหมู่
- Breadcrumb (บางธีม)
- การแชร์โซเชียลมีเดีย

### ขั้นตอนที่ 4: การตั้งค่าหมวดหมู่

#### การตั้งค่าการแสดงผล
```yaml
Status:
  - Enabled: Yes/No
  - Hidden: Yes/No (hidden from menus, still accessible)

Display Options:
  - Show description: Yes/No
  - Show image: Yes/No
  - Show article count: Yes/No
  - Show subcategories: Yes/No

Layout:
  - Items per page: 10-50
  - Display order: Date/Title/Author
  - Display direction: Ascending/Descending
```
#### สิทธิ์หมวดหมู่
```yaml
Who Can View:
  - Anonymous: Yes/No
  - Registered: Yes/No
  - Specific groups: Configure per group

Who Can Submit:
  - Registered: Yes/No
  - Specific groups: Configure per group
  - Author must have: "submit articles" permission
```
### ขั้นตอนที่ 5: SEO การตั้งค่า

#### เมตาแท็ก
```
Field: Meta Description
Type: Text (160 characters)
Purpose: Search engine description

Field: Meta Keywords
Type: Comma-separated list
Example: photography, tutorials, tips, techniques
```
#### URL การกำหนดค่า
```
Field: URL Slug
Type: Text
Auto-generated from category name
Example: "photography" from "Photography"
Can be customized before saving
```
### บันทึกหมวดหมู่

1. กรอกข้อมูลในช่องที่ต้องกรอกทั้งหมด:
   - ชื่อหมวดหมู่ ✓
   - คำอธิบาย (แนะนำ)
2. ตัวเลือกเสริม: อัปโหลดรูปภาพ ตั้งค่า SEO
3. คลิก **บันทึกหมวดหมู่**
4. ข้อความยืนยันปรากฏขึ้น
5. หมวดหมู่พร้อมใช้งานแล้ว

---

## ลำดับชั้นของหมวดหมู่

### สร้างโครงสร้างที่ซ้อนกัน
```
Step-by-step example: Create News → Technology subcategory

1. Go to Categories admin
2. Click "Add Category"
3. Name: "News"
4. Parent: (leave blank - this is root)
5. Save
6. Click "Add Category" again
7. Name: "Technology"
8. Parent: "News" (select from dropdown)
9. Save
```
### ดูแผนผังลำดับชั้น
```
Categories view shows tree structure:

📁 News
  📄 Technology
  📄 Sports
  📄 Entertainment
📁 Tutorials
  📄 Photography
    📄 Basics
    📄 Advanced
  📄 Writing
```
คลิกขยายลูกศรเพื่อแสดง/ซ่อนหมวดหมู่ย่อย

### จัดระเบียบหมวดหมู่ใหม่

#### ย้ายหมวด

1. ไปที่รายการหมวดหมู่
2. คลิก **แก้ไข** บนหมวดหมู่
3. เปลี่ยน **หมวดหมู่หลัก**
4. คลิก **บันทึก**
5. หมวดหมู่ถูกย้ายไปยังตำแหน่งใหม่

#### เรียงลำดับหมวดหมู่ใหม่

หากมี ให้ใช้การลากและวาง:

1. ไปที่รายการหมวดหมู่
2. คลิกและลากหมวดหมู่
3. เลื่อนตำแหน่งใหม่
4. บันทึกคำสั่งซื้อโดยอัตโนมัติ

#### ลบหมวดหมู่

**ตัวเลือกที่ 1: ลบแบบนุ่มนวล (ซ่อน)**

1. แก้ไขหมวดหมู่
2. ตั้งค่า **สถานะ**: ปิดใช้งาน
3. คลิก **บันทึก**
4. หมวดหมู่ถูกซ่อนแต่ไม่ถูกลบ

**ตัวเลือกที่ 2: ฮาร์ดลบ**

1. ไปที่รายการหมวดหมู่
2. คลิก **ลบ** บนหมวดหมู่
3. เลือกการดำเนินการสำหรับบทความ:
   
```
   ☐ ย้ายบทความไปยังหมวดหมู่หลัก
   ☐ ย้ายบทความไปที่รูท (ข่าว)
   ☐ ลบบทความทั้งหมดในหมวดหมู่
   
```
4. ยืนยันการลบ

---

## การดำเนินงานหมวดหมู่

### แก้ไขหมวดหมู่

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → หมวดหมู่**
2. คลิก **แก้ไข** บนหมวดหมู่
3. แก้ไขฟิลด์:
   - ชื่อ
   - คำอธิบาย
   - หมวดหมู่ผู้ปกครอง
   - รูปภาพ
   - การตั้งค่า
4. คลิก **บันทึก**

### แก้ไขการอนุญาตหมวดหมู่

1. ไปที่หมวดหมู่
2. คลิก **สิทธิ์** บนหมวดหมู่ (หรือคลิกหมวดหมู่ จากนั้นคลิกสิทธิ์)
3. กำหนดค่ากลุ่ม:
```
For each group:
  ☐ View articles in this category
  ☐ Submit articles to this category
  ☐ Edit own articles
  ☐ Edit all articles
  ☐ Approve/Moderate articles
  ☐ Manage category
```
4. คลิก **บันทึกสิทธิ์**

### ตั้งค่ารูปภาพหมวดหมู่

**อัพโหลดภาพใหม่:**

1. แก้ไขหมวดหมู่
2. คลิก **เปลี่ยนภาพ**
3. อัปโหลดหรือเลือกรูปภาพ
4. ครอบตัด/ปรับขนาด
5. คลิก **ใช้รูปภาพ**
6. คลิก **บันทึกหมวดหมู่**

**ลบภาพ:**

1. แก้ไขหมวดหมู่
2. คลิก **ลบรูปภาพ** (ถ้ามี)
3. คลิก **บันทึกหมวดหมู่**

---

## สิทธิ์หมวดหมู่

### เมทริกซ์การอนุญาต
```
                 Anonymous  Registered  Editor  Admin
View category        ✓         ✓         ✓       ✓
Submit article       ✗         ✓         ✓       ✓
Edit own article     ✗         ✓         ✓       ✓
Edit all articles    ✗         ✗         ✓       ✓
Moderate articles    ✗         ✗         ✓       ✓
Manage category      ✗         ✗         ✗       ✓
```
### ตั้งค่าสิทธิ์ระดับหมวดหมู่

#### การควบคุมการเข้าถึงตามหมวดหมู่

1. ไปที่รายการ **หมวดหมู่**
2. เลือกหมวดหมู่
3. คลิก **สิทธิ์**
4. สำหรับแต่ละกลุ่ม เลือกการอนุญาต:
```
Example: News category
  Anonymous:   View only
  Registered:  Submit articles
  Editors:     Approve articles
  Admins:      Full control
```
5. คลิก **บันทึก**

#### สิทธิ์ระดับฟิลด์

ควบคุมว่าฟิลด์แบบฟอร์มใดที่ผู้ใช้สามารถดู/แก้ไขได้:
```
Example: Limit field visibility for Registered users

Registered users can see/edit:
  ✓ Title
  ✓ Description
  ✓ Content
  ✗ Author (auto-set to current user)
  ✗ Scheduled date (only editors)
  ✗ Featured (only admins)
```
**กำหนดค่าใน:**
- สิทธิ์หมวดหมู่
- ค้นหาส่วน "การมองเห็นภาคสนาม"

---

## แนวทางปฏิบัติที่ดีที่สุดสำหรับหมวดหมู่

### โครงสร้างหมวดหมู่
```
✓ Keep hierarchy 2-3 levels deep
✗ Don't create too many top-level categories
✗ Don't create categories with one article

✓ Use consistent naming (plural or singular)
✗ Don't use vague names ("Stuff", "Other")

✓ Create categories for articles that exist
✗ Don't create empty categories in advance
```
### แนวทางการตั้งชื่อ
```
Good names:
  "Photography"
  "Web Development"
  "Travel Tips"
  "Business News"

Avoid:
  "Articles" (too vague)
  "Content" (redundant)
  "News&Updates" (inconsistent)
  "PHOTOGRAPHY STUFF" (formatting)
```
### เคล็ดลับการจัดองค์กร
```
By Topic:
  News
    Technology
    Sports
    Entertainment

By Type:
  Tutorials
    Video
    Text
    Interactive

By Audience:
  For Beginners
  For Experts
  Case Studies

Geographic:
  North America
    United States
    Canada
  Europe
```
---

## บล็อกหมวดหมู่

### บล็อกหมวดหมู่ผู้เผยแพร่โฆษณา

แสดงรายการหมวดหมู่บนไซต์ของคุณ:

1. ไปที่ **ผู้ดูแลระบบ → บล็อก**
2. ค้นหา **ผู้จัดพิมพ์ - หมวดหมู่**
3. คลิก **แก้ไข**
4. กำหนดค่า:
```
Block Title: "News Categories"
Show subcategories: Yes/No
Show article count: Yes/No
Height: (pixels or auto)
```
5. คลิก **บันทึก**

### บล็อกบทความหมวดหมู่

แสดงบทความล่าสุดจากหมวดหมู่เฉพาะ:

1. ไปที่ **ผู้ดูแลระบบ → บล็อก**
2. ค้นหา **ผู้จัดพิมพ์ - บทความหมวดหมู่**
3. คลิก **แก้ไข**
4. เลือก:
```
Category: News (or specific category)
Number of articles: 5
Show images: Yes/No
Show description: Yes/No
```
5. คลิก **บันทึก**

---

## การวิเคราะห์หมวดหมู่

### ดูสถิติหมวดหมู่

จากผู้ดูแลระบบหมวดหมู่:
```
Each category shows:
  - Total articles: 45
  - Published: 42
  - Draft: 2
  - Pending approval: 1
  - Total views: 5,234
  - Latest article: 2 hours ago
```
### ดูหมวดหมู่การเข้าชม

หากเปิดใช้งานการวิเคราะห์:

1. คลิกชื่อหมวดหมู่
2. คลิกแท็บ **สถิติ**
3. ดู:
   - การดูหน้าเว็บ
   - บทความยอดนิยม
   - แนวโน้มการเข้าชม
   - คำค้นหาที่ใช้

---

## เทมเพลตหมวดหมู่

### ปรับแต่งการแสดงหมวดหมู่

หากใช้เทมเพลตแบบกำหนดเอง แต่ละหมวดหมู่สามารถแทนที่:
```
publisher_category.tpl
  ├── Category header
  ├── Category description
  ├── Category image
  ├── Article listing
  └── Pagination
```
**วิธีปรับแต่ง:**

1. คัดลอกไฟล์เทมเพลต
2. แก้ไข HTML/CSS
3. กำหนดหมวดหมู่ในผู้ดูแลระบบ
4. หมวดหมู่ใช้เทมเพลตที่กำหนดเอง

---

## งานทั่วไป

### สร้างลำดับชั้นของข่าวสาร
```
Admin → Publisher → Categories
1. Create "News" (parent)
2. Create "Technology" (parent: News)
3. Create "Sports" (parent: News)
4. Create "Entertainment" (parent: News)
```
### ย้ายบทความระหว่างหมวดหมู่

1. ไปที่ผู้ดูแลระบบ **บทความ**
2. เลือกบทความ (ช่องทำเครื่องหมาย)
3. เลือก **"เปลี่ยนหมวดหมู่"** จากดรอปดาวน์การดำเนินการแบบกลุ่ม
4. เลือกหมวดหมู่ใหม่
5. คลิก **อัปเดตทั้งหมด**

### ซ่อนหมวดหมู่โดยไม่ต้องลบ

1. แก้ไขหมวดหมู่
2. ตั้งค่า **สถานะ**: ปิดใช้งาน/ซ่อน
3. บันทึก
4. หมวดหมู่ไม่แสดงในเมนู (ยังสามารถเข้าถึงได้ผ่าน URL)

### สร้างหมวดหมู่สำหรับร่างจดหมาย
```
Best Practice:

Create "In Review" category
  ├── Purpose: Articles awaiting approval
  ├── Permissions: Hidden from public
  ├── Only admins/editors can see
  ├── Move articles here until approved
  └── Move to "News" when published
```
---

## หมวดหมู่นำเข้า / ส่งออก

### หมวดหมู่การส่งออก

หากมี:

1. ไปที่ผู้ดูแลระบบ **หมวดหมู่**
2. คลิก **ส่งออก**
3. เลือกรูปแบบ: CSV/JSON/¤XML
4. ดาวน์โหลดไฟล์
5. บันทึกข้อมูลสำรองแล้ว

### นำเข้าหมวดหมู่

หากมี:

1. เตรียมไฟล์ตามหมวดหมู่
2. ไปที่ผู้ดูแลระบบ **หมวดหมู่**
3. คลิก **นำเข้า**
4. อัพโหลดไฟล์
5. เลือกกลยุทธ์การอัพเดต:
   - สร้างใหม่เท่านั้น
   - อัปเดตที่มีอยู่
   - เปลี่ยนใหม่หมด
6. คลิก **นำเข้า**

---

## หมวดหมู่การแก้ไขปัญหา

### ปัญหา: หมวดหมู่ย่อยไม่แสดง

**วิธีแก้ปัญหา:**
```
1. Verify parent category status is "Enabled"
2. Check permissions allow viewing
3. Verify subcategories have status "Enabled"
4. Clear cache: Admin → Tools → Clear Cache
5. Check theme shows subcategories
```
### ปัญหา: ไม่สามารถลบหมวดหมู่ได้

**วิธีแก้ปัญหา:**
```
1. Category must have no articles
2. Move or delete articles first:
   Admin → Articles
   Select articles in category
   Change category to another
3. Then delete empty category
4. Or choose "move articles" option when deleting
```
### ปัญหา: รูปภาพหมวดหมู่ไม่แสดง

**วิธีแก้ปัญหา:**
```
1. Verify image uploaded successfully
2. Check image file format (JPG, PNG)
3. Verify upload directory permissions
4. Check theme displays category images
5. Try re-uploading image
6. Clear browser cache
```
### ปัญหา: การอนุญาตไม่มีผล

**วิธีแก้ปัญหา:**
```
1. Check group permissions in Category
2. Check global Publisher permissions
3. Check user belongs to configured group
4. Clear session cache
5. Log out and log back in
6. Check permission modules installed
```
---

## รายการตรวจสอบแนวทางปฏิบัติที่ดีที่สุดสำหรับหมวดหมู่

ก่อนที่จะปรับใช้หมวดหมู่:

- [ ] ลำดับชั้นมีความลึก 2-3 ระดับ
- [ ] แต่ละหมวดหมู่มีบทความมากกว่า 5 บทความ
- [ ] ชื่อหมวดหมู่มีความสอดคล้องกัน
- [ ] สิทธิ์มีความเหมาะสม
- [ ] รูปภาพหมวดหมู่ได้รับการปรับให้เหมาะสม
- [ ] คำอธิบายเสร็จสมบูรณ์
- [ ] SEO กรอกข้อมูลเมตาดาต้าแล้ว
- [ ] URL ที่เป็นมิตร
- [ ] หมวดหมู่ทดสอบบนส่วนหน้า
- [ ] อัปเดตเอกสารแล้ว

---

## คำแนะนำที่เกี่ยวข้อง

- การสร้างบทความ
- การจัดการสิทธิ์
- การกำหนดค่าโมดูล
- คู่มือการติดตั้ง

---

## ขั้นตอนต่อไป

- สร้างบทความเป็นหมวดหมู่
- กำหนดค่าการอนุญาต
- ปรับแต่งด้วยเทมเพลตที่กำหนดเอง

---

#ผู้เผยแพร่ #หมวดหมู่ #องค์กร #ลำดับชั้น #การจัดการ #xoops