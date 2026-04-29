---
title: "สำนักพิมพ์ - การสร้างบทความ"
description: "คู่มือฉบับสมบูรณ์สำหรับการสร้าง แก้ไข และจัดรูปแบบบทความใน Publisher"
---
#การสร้างบทความในสำนักพิมพ์

> คำแนะนำทีละขั้นตอนในการสร้าง แก้ไข การจัดรูปแบบ และการเผยแพร่บทความในโมดูลผู้เผยแพร่

---

## เข้าถึงการจัดการบทความ

### การนำทางแผงผู้ดูแลระบบ
```
Admin Panel
└── Modules
    └── Publisher
        └── Articles
            ├── Create New
            ├── Edit
            ├── Delete
            └── Publish
```
### เส้นทางที่เร็วที่สุด

1. เข้าสู่ระบบในฐานะ **ผู้ดูแลระบบ**
2. คลิก **โมดูล** ในแถบผู้ดูแลระบบ
3. ค้นหา **ผู้จัดพิมพ์**
4. คลิกลิงก์ **ผู้ดูแลระบบ**
5. คลิก **บทความ** ในเมนูด้านซ้าย
6. คลิกปุ่ม **เพิ่มบทความ**

---

## แบบฟอร์มการสร้างบทความ

### ข้อมูลพื้นฐาน

เมื่อสร้างบทความใหม่ ให้กรอกข้อมูลในส่วนต่อไปนี้:
```
mermaid
graph TD
    A[Article Creation Form] -->|Step 1| B[Basic Info]
    A -->|Step 2| C[Content]
    A -->|Step 3| D[Images]
    A -->|Step 4| E[Files]
    A -->|Step 5| F[Publishing]
    A -->|Step 6| G[Save]
```
---

## ขั้นตอนที่ 1: ข้อมูลพื้นฐาน

### ช่องที่ต้องกรอก

#### ชื่อบทความ
```
Field: Title
Type: Text input (required)
Max length: 255 characters
Example: "Top 5 Tips for Better Photography"
```
**แนวทาง:**
- บรรยายและเฉพาะเจาะจง
- รวมคำหลักสำหรับ SEO
- หลีกเลี่ยง ALL CAPS
- มีความยาวไม่เกิน 60 ตัวอักษรเพื่อการแสดงผลที่ดีที่สุด

#### เลือกหมวดหมู่
```
Field: Category
Type: Dropdown (required)
Options: List of created categories
Example: Photography > Tutorials
```
**เคล็ดลับ:**
- มีผู้ปกครองและหมวดหมู่ย่อย
- เลือกหมวดหมู่ที่เกี่ยวข้องมากที่สุด
- มีเพียงหนึ่งหมวดหมู่ต่อบทความเท่านั้น
- สามารถเปลี่ยนแปลงได้ในภายหลัง

#### คำบรรยายบทความ (ไม่บังคับ)
```
Field: Subtitle
Type: Text input (optional)
Max length: 255 characters
Example: "Learn photography fundamentals in 5 easy steps"
```
**ใช้สำหรับ:**
- พาดหัวเรื่องย่อ
- ข้อความทีเซอร์
- ชื่อเรื่องขยาย

### คำอธิบายบทความ

#### คำอธิบายสั้น ๆ
```
Field: Short Description
Type: Textarea (optional)
Max length: 500 characters
```
**วัตถุประสงค์:**
- ข้อความแสดงตัวอย่างบทความ
- แสดงในรายการหมวดหมู่
- ใช้ในผลการค้นหา
- คำอธิบาย Meta สำหรับ SEO

**ตัวอย่าง:**
```
"Discover essential photography techniques that will transform your photos
from ordinary to extraordinary. This comprehensive guide covers composition,
lighting, and exposure settings."
```
#### เนื้อหาเต็ม
```
Field: Article Body
Type: WYSIWYG Editor (required)
Max length: Unlimited
Format: HTML
```
พื้นที่เนื้อหาบทความหลักพร้อมการแก้ไข Rich Text

---

## ขั้นตอนที่ 2: การจัดรูปแบบเนื้อหา

### การใช้โปรแกรมแก้ไข WYSIWYG

#### การจัดรูปแบบข้อความ
```
Bold:           Ctrl+B or click [B] button
Italic:         Ctrl+I or click [I] button
Underline:      Ctrl+U or click [U] button
Strikethrough:  Alt+Shift+D or click [S] button
Subscript:      Ctrl+, (comma)
Superscript:    Ctrl+. (period)
```
#### โครงสร้างส่วนหัว

สร้างลำดับชั้นเอกสารที่เหมาะสม:
```html
<h1>Article Title</h1>      <!-- Use once at top -->
<h2>Main Section</h2>        <!-- For major sections -->
<h3>Subsection</h3>          <!-- For subtopics -->
<h4>Sub-subsection</h4>      <!-- For details -->
```
**ในตัวแก้ไข:**
- คลิกเมนูแบบเลื่อนลง **รูปแบบ**
- เลือกระดับหัวเรื่อง (H1-H6)
- พิมพ์หัวเรื่องของคุณ

#### รายการ

**รายการไม่เรียงลำดับ (หัวข้อย่อย):**
```
markdown
• Point one
• Point two
• Point three
```
ขั้นตอนในตัวแก้ไข:
1. คลิกปุ่ม [≡] รายการสัญลักษณ์แสดงหัวข้อย่อย
2. พิมพ์แต่ละจุด
3. กด Enter เพื่อไปยังรายการถัดไป
4. กด Backspace สองครั้งเพื่อสิ้นสุดรายการ

**รายการสั่งซื้อ(หมายเลข):**
```
markdown
1. First step
2. Second step
3. Third step
```
ขั้นตอนในตัวแก้ไข:
1. คลิกปุ่ม [1.] รายการลำดับเลข
2. พิมพ์แต่ละรายการ
3. กด Enter เพื่อดำเนินการต่อ
4. กด Backspace สองครั้งเพื่อสิ้นสุด

**รายการที่ซ้อนกัน:**
```
markdown
1. Main point
   a. Sub-point
   b. Sub-point
2. Next point
```
ขั้นตอน:
1. สร้างรายการแรก
2. กด Tab เพื่อเยื้อง
3. สร้างรายการที่ซ้อนกัน
4. กด Shift+Tab เพื่อเยื้องออก

#### ลิงค์

**เพิ่มไฮเปอร์ลิงก์:**

1. เลือกข้อความที่จะลิงก์
2. คลิกปุ่ม **[🔗] ลิงก์**
3. ป้อน URL: `https://example.com`
4. ตัวเลือกเสริม: เพิ่มชื่อ/เป้าหมาย
5. คลิก **ใส่ลิงค์**

**ลบลิงค์:**

1. คลิกภายในข้อความที่เชื่อมโยง
2. คลิกปุ่ม **[🔗] ลบลิงก์**

#### รหัสและคำคม

**บล็อคโควต:**
```
"This is an important quote from an expert"
- Attribution
```
ขั้นตอน:
1. พิมพ์ข้อความอ้างอิง
2. คลิกปุ่ม **[❝] Blockquote**
3. ข้อความถูกเยื้องและจัดรูปแบบ

**บล็อคโค้ด:**
```
python
def hello_world():
    print("Hello, World!")
```
ขั้นตอน:
1. คลิก **รูปแบบ → รหัส**
2. วางโค้ด
3. เลือกภาษา (ไม่บังคับ)
4. รหัสแสดงพร้อมเน้นไวยากรณ์

---

## ขั้นตอนที่ 3: การเพิ่มรูปภาพ

### ภาพเด่น (ภาพฮีโร่)
```
Field: Featured Image / Main Image
Type: Image upload
Format: JPG, PNG, GIF, WebP
Max size: 5 MB
Recommended: 600x400 px
```
**การอัพโหลด:**

1. คลิกปุ่ม **อัปโหลดรูปภาพ**
2. เลือกภาพจากคอมพิวเตอร์
3. ครอบตัด/ปรับขนาดหากจำเป็น
4. คลิก **ใช้รูปภาพนี้**

**ตำแหน่งรูปภาพ:**
- แสดงที่ด้านบนของบทความ
- ใช้ในรายการหมวดหมู่
- แสดงในเอกสารสำคัญ
- ใช้สำหรับการแบ่งปันทางสังคม

### รูปภาพอินไลน์

แทรกรูปภาพภายในข้อความบทความ:

1. วางเคอร์เซอร์ในโปรแกรมแก้ไขในตำแหน่งที่รูปภาพควรอยู่
2. คลิกปุ่ม **[🖼️] รูปภาพ** ในแถบเครื่องมือ
3. เลือกตัวเลือกการอัปโหลด:
   - อัปโหลดภาพใหม่
   - เลือกจากแกลเลอรี
   - กรอกรูปภาพ URL
4. กำหนดค่า:
   
```
   ขนาดภาพ:
   - ความกว้าง: 300-600 พิกเซล
   - ความสูง: อัตโนมัติ (คงอัตราส่วน)
   - การจัดตำแหน่ง: ซ้าย/กลาง/ขวา
   
```
5. คลิก **ใส่รูปภาพ**

**ตัดข้อความรอบๆ รูปภาพ:**

ในเครื่องมือแก้ไขหลังจากแทรก:
```html
<!-- Image floats left, text wraps around -->
<img src="image.jpg" style="float: left; margin: 10px;">
```
### แกลเลอรี่ภาพ

สร้างแกลเลอรีหลายภาพ:

1. คลิกปุ่ม **แกลเลอรี** (ถ้ามี)
2. อัปโหลดหลายภาพ:
   - คลิกเพียงครั้งเดียว: เพิ่มหนึ่งรายการ
   - ลากและวาง: เพิ่มหลายรายการ
3. จัดเรียงลำดับโดยการลาก
4. ตั้งค่าคำบรรยายสำหรับแต่ละภาพ
5. คลิก **สร้างแกลเลอรี**

---

## ขั้นตอนที่ 4: การแนบไฟล์

### เพิ่มไฟล์แนบ
```
Field: File Attachments
Type: File upload (multiple allowed)
Supported: PDF, DOC, XLS, ZIP, etc.
Max per file: 10 MB
Max per article: 5 files
```
**การแนบ:**

1. คลิกปุ่ม **เพิ่มไฟล์**
2. เลือกไฟล์จากคอมพิวเตอร์
3. ทางเลือก: เพิ่มคำอธิบายไฟล์
4. คลิก **แนบไฟล์**
5. ทำซ้ำหลายไฟล์

**ตัวอย่างไฟล์:**
- PDF คำแนะนำ
- สเปรดชีต Excel
- เอกสารเวิร์ด
- ZIP เอกสารสำคัญ
- ซอร์สโค้ด

### จัดการไฟล์แนบ

**แก้ไขไฟล์:**

1. คลิกชื่อไฟล์
2. แก้ไขคำอธิบาย
3. คลิก **บันทึก**

**ลบไฟล์:**

1. ค้นหาไฟล์ในรายการ
2. คลิกไอคอน **[×] ลบ**
3. ยืนยันการลบ

---

## ขั้นตอนที่ 5: การเผยแพร่และสถานะ

### สถานะบทความ
```
Field: Status
Type: Dropdown
Options:
  - Draft: Not published, only author sees
  - Pending: Waiting for approval
  - Published: Live on site
  - Archived: Old content
  - Unpublished: Was published, now hidden
```
**ขั้นตอนการทำงานสถานะ:**
```
mermaid
graph LR
    A[Draft] -->|Author saves| B[Draft]
    B -->|Submit| C[Pending Review]
    C -->|Editor approves| D[Published]
    D -->|Author unpublishes| E[Unpublished]
    C -->|Editor rejects| F[Draft]
```
### ตัวเลือกการเผยแพร่

#### เผยแพร่ทันที
```
Status: Published
Start Date: Today (auto-filled)
End Date: (leave blank for no expiration)
```
#### กำหนดการสำหรับภายหลัง
```
Status: Scheduled
Start Date: Future date/time
Example: February 15, 2024 at 9:00 AM
```
บทความจะเผยแพร่โดยอัตโนมัติตามเวลาที่กำหนด

#### กำหนดวันหมดอายุ
```
Enable Expiration: Yes
Expiration Date: Future date
Action: Archive/Hide/Delete
Example: April 1, 2024 (article auto-archives)
```
### ตัวเลือกการมองเห็น
```yaml
Show Article:
  - Display on front page: Yes/No
  - Show in category: Yes/No
  - Include in search: Yes/No
  - Include in recent articles: Yes/No

Featured Article:
  - Mark as featured: Yes/No
  - Featured section position: (number)
```
---

## ขั้นตอนที่ 6: SEO และข้อมูลเมตา

### SEO การตั้งค่า
```
Field: SEO Settings (Expand section)
```
#### คำอธิบายเมตา
```
Field: Meta Description
Type: Text (160 characters recommended)
Used by: Search engines, social media

Example:
"Learn photography fundamentals in 5 easy steps.
Discover composition, lighting, and exposure techniques."
```
#### คำหลักเมตา
```
Field: Meta Keywords
Type: Comma-separated list
Max: 5-10 keywords

Example: Photography, Tutorial, Composition, Lighting, Exposure
```
#### URL ทาก
```
Field: URL Slug (auto-generated from title)
Type: Text
Format: lowercase, hyphens, no spaces

Auto: "top-5-tips-for-better-photography"
Edit: Change before publishing
```
#### เปิดแท็กกราฟ

สร้างอัตโนมัติจากข้อมูลบทความ:
- ชื่อเรื่อง
- คำอธิบาย
- รูปภาพเด่น
- บทความ URL
- วันที่ตีพิมพ์

ใช้โดย Facebook, LinkedIn, WhatsApp ฯลฯ

---

## ขั้นตอนที่ 7: ความคิดเห็นและการโต้ตอบ

### การตั้งค่าความคิดเห็น
```yaml
Allow Comments:
  - Enable: Yes/No
  - Default: Inherit from preferences
  - Override: Specific to this article

Moderate Comments:
  - Require approval: Yes/No
  - Default: Inherit from preferences
```
### การตั้งค่าการให้คะแนน
```yaml
Allow Ratings:
  - Enable: Yes/No
  - Scale: 5 stars (default)
  - Show average: Yes/No
  - Show count: Yes/No
```
---

## ขั้นตอนที่ 8: ตัวเลือกขั้นสูง

### ผู้แต่งและทางสายย่อย
```
Field: Author
Type: Dropdown
Default: Current user
Options: All users with author permission

Display:
  - Show author name: Yes/No
  - Show author bio: Yes/No
  - Show author avatar: Yes/No
```
### แก้ไขการล็อค
```
Field: Edit Lock
Purpose: Prevent accidental changes

Lock Article:
  - Locked: Yes/No
  - Lock reason: "Final version"
  - Unlock date: (optional)
```
### ประวัติการแก้ไข

บทความเวอร์ชันที่บันทึกอัตโนมัติ:
```
View Revisions:
  - Click "Revision History"
  - Shows all saved versions
  - Compare versions
  - Restore previous version
```
---

## การบันทึกและการเผยแพร่

### บันทึกขั้นตอนการทำงาน
```
mermaid
graph TD
    A[Start Article] -->|Save as Draft| B[Draft Saved]
    B -->|Continue editing| C[Save again]
    C -->|Ready to publish| D[Change Status to Published]
    D -->|Click Save| E[Live on Site]
```
### บันทึกบทความ

**บันทึกอัตโนมัติ:**
- ทริกเกอร์ทุกๆ 60 วินาที
- บันทึกเป็นแบบร่างโดยอัตโนมัติ
- แสดง "บันทึกล่าสุด: 2 นาทีที่แล้ว"

**บันทึกด้วยตนเอง:**
- คลิก **บันทึกและดำเนินการต่อ** เพื่อแก้ไขต่อ
- คลิก **บันทึกและดู** เพื่อดูเวอร์ชันที่เผยแพร่
- คลิก **บันทึก** เพื่อบันทึกและปิด

### เผยแพร่บทความ

1. ตั้งค่า **สถานะ**: เผยแพร่แล้ว
2. ตั้งค่า **วันที่เริ่มต้น**: ตอนนี้ (หรือวันที่ในอนาคต)
3. คลิก **บันทึก** หรือ **เผยแพร่**
4. ข้อความยืนยันปรากฏขึ้น
5. บทความถ่ายทอดสด (หรือกำหนดเวลา)

---

## การแก้ไขบทความที่มีอยู่

### เข้าถึงตัวแก้ไขบทความ

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → บทความ**
2. ค้นหาบทความในรายการ
3. คลิกไอคอน/ปุ่ม **แก้ไข**
4. ทำการเปลี่ยนแปลง
5. คลิก **บันทึก**

### แก้ไขเป็นกลุ่ม

แก้ไขหลายบทความพร้อมกัน:
```
1. Go to Articles list
2. Select articles (checkboxes)
3. Choose "Bulk Edit" from dropdown
4. Change selected field
5. Click "Update All"

Available for:
  - Status
  - Category
  - Featured (Yes/No)
  - Author
```
### ดูตัวอย่างบทความ

ก่อนเผยแพร่:

1. คลิกปุ่ม **ดูตัวอย่าง**
2. ดูแบบที่ผู้อ่านจะได้เห็น
3. ตรวจสอบการจัดรูปแบบ
4. ทดสอบลิงค์
5. กลับไปที่ตัวแก้ไขเพื่อปรับเปลี่ยน

---

## การจัดการบทความ

### ดูบทความทั้งหมด

**มุมมองรายการบทความ:**
```
Admin → Publisher → Articles

Columns:
  - Title
  - Category
  - Author
  - Status
  - Created date
  - Modified date
  - Actions (Edit, Delete, Preview)

Sorting:
  - By title (A-Z)
  - By date (newest/oldest)
  - By status (Published/Draft)
  - By category
```
### กรองบทความ
```
Filter Options:
  - By category
  - By status
  - By author
  - By date range
  - Search by title

Example: Show all "Draft" articles by "John" in "News" category
```
### ลบบทความ

**Soft Delete (แนะนำ):**

1. เปลี่ยน **สถานะ**: ไม่ได้เผยแพร่
2. คลิก **บันทึก**
3. บทความถูกซ่อนแต่ไม่ถูกลบ
4. สามารถกู้คืนได้ในภายหลัง

**ฮาร์ดลบ:**

1. เลือกบทความในรายการ
2. คลิกปุ่ม **ลบ**
3. ยืนยันการลบ
4. บทความถูกลบอย่างถาวร

---

## แนวทางปฏิบัติที่ดีที่สุดสำหรับเนื้อหา

### การเขียนบทความคุณภาพ
```
Structure:
  ✓ Compelling title
  ✓ Clear subtitle/description
  ✓ Engaging opening paragraph
  ✓ Logical sections with headers
  ✓ Supporting visuals
  ✓ Conclusion/summary
  ✓ Call-to-action

Length:
  - Blog posts: 500-2000 words
  - News: 300-800 words
  - Guides: 2000-5000 words
  - Minimum: 300 words
```
### SEO การเพิ่มประสิทธิภาพ
```
Title Optimization:
  ✓ Include primary keyword
  ✓ Keep under 60 characters
  ✓ Put keyword near beginning
  ✓ Be descriptive and specific

Content Optimization:
  ✓ Use headings (H1, H2, H3)
  ✓ Include keyword in heading
  ✓ Use bold for important terms
  ✓ Add descriptive links
  ✓ Include images with alt text

Meta Description:
  ✓ Include primary keyword
  ✓ 155-160 characters
  ✓ Action-oriented
  ✓ Unique per article
```
### เคล็ดลับการจัดรูปแบบ
```
Readability:
  ✓ Short paragraphs (2-4 sentences)
  ✓ Bullet points for lists
  ✓ Subheadings every 300 words
  ✓ Generous whitespace
  ✓ Line breaks between sections

Visual Appeal:
  ✓ Featured image at top
  ✓ Inline images in content
  ✓ Alt text on all images
  ✓ Code blocks for technical
  ✓ Blockquotes for emphasis
```
---

## แป้นพิมพ์ลัด

### ทางลัดตัวแก้ไข
```
Bold:               Ctrl+B
Italic:             Ctrl+I
Underline:          Ctrl+U
Link:               Ctrl+K
Save Draft:         Ctrl+S
```
### ทางลัดข้อความ
```
-- →  (dash to em dash)
... → … (three dots to ellipsis)
(c) → © (copyright)
(r) → ® (registered)
(tm) → ™ (trademark)
```
---

## งานทั่วไป

### คัดลอกบทความ

1. เปิดบทความ
2. คลิกปุ่ม **ทำซ้ำ** หรือ **โคลน**
3. บทความคัดลอกเป็นฉบับร่าง
4. แก้ไขชื่อและเนื้อหา
5. เผยแพร่

### กำหนดการบทความ

1. สร้างบทความ
2. ตั้งค่า **วันที่เริ่มต้น**: วันที่/เวลาในอนาคต
3. ตั้งค่า **สถานะ**: เผยแพร่แล้ว
4. คลิก **บันทึก**
5. บทความเผยแพร่โดยอัตโนมัติ

### การเผยแพร่เป็นกลุ่ม

1. สร้างบทความเป็นฉบับร่าง
2. กำหนดวันที่เผยแพร่
3. บทความเผยแพร่อัตโนมัติตามเวลาที่กำหนด
4. ตรวจสอบจากมุมมอง "กำหนดเวลา"

### ย้ายไปมาระหว่างหมวดหมู่

1. แก้ไขบทความ
2. เปลี่ยนเมนูแบบเลื่อนลง **หมวดหมู่**
3. คลิก **บันทึก**
4. บทความปรากฏในหมวดหมู่ใหม่

---

## การแก้ไขปัญหา

### ปัญหา: ไม่สามารถบันทึกบทความได้

**วิธีแก้ปัญหา:**
```
1. Check form for required fields
2. Verify category is selected
3. Check PHP memory limit
4. Try saving as draft first
5. Clear browser cache
```
### ปัญหา: รูปภาพไม่แสดง

**วิธีแก้ปัญหา:**
```
1. Verify image upload succeeded
2. Check image file format (JPG, PNG)
3. Verify image path in database
4. Check upload directory permissions
5. Try re-uploading image
```
### ปัญหา: แถบเครื่องมือตัวแก้ไขไม่แสดง

**วิธีแก้ปัญหา:**
```
1. Clear browser cache
2. Try different browser
3. Disable browser extensions
4. Check JavaScript console for errors
5. Verify editor plugin installed
```
### ปัญหา: บทความไม่ได้รับการเผยแพร่

**วิธีแก้ปัญหา:**
```
1. Verify Status = "Published"
2. Check Start Date is today or earlier
3. Verify permissions allow publishing
4. Check category is published
5. Clear module cache
```
---

## คำแนะนำที่เกี่ยวข้อง

- คู่มือการกำหนดค่า
- การจัดการหมวดหมู่
- การตั้งค่าการอนุญาต
- เทมเพลตที่กำหนดเอง

---

## ขั้นตอนต่อไป

- สร้างบทความแรกของคุณ
- ตั้งค่าหมวดหมู่
- กำหนดค่าการอนุญาต
- ตรวจสอบการปรับแต่งเทมเพลต

---

#ผู้เผยแพร่ #บทความ #เนื้อหา #การสร้าง #การจัดรูปแบบ #การแก้ไข #xoops