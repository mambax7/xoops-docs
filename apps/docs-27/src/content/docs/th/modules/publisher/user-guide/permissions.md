---
title: "ผู้จัดพิมพ์ - การตั้งค่าสิทธิ์"
description: "คู่มือที่ครอบคลุมในการตั้งค่าสิทธิ์ของกลุ่มและการควบคุมการเข้าถึงใน Publisher"
---
# การตั้งค่าสิทธิ์ของผู้จัดพิมพ์

> คำแนะนำฉบับสมบูรณ์เกี่ยวกับการกำหนดค่าสิทธิ์ของกลุ่ม การควบคุมการเข้าถึง และการจัดการการเข้าถึงของผู้ใช้ใน Publisher

---

## พื้นฐานการอนุญาต

### สิทธิ์คืออะไร?

สิทธิ์ควบคุมสิ่งที่กลุ่มผู้ใช้ต่างๆ สามารถทำได้ใน Publisher:
```
Who can:
  - View articles
  - Submit articles
  - Edit articles
  - Approve articles
  - Manage categories
  - Configure settings
```
### ระดับการอนุญาต
```
Anonymous
  └── View published articles only

Registered Users
  ├── View articles
  ├── Submit articles (pending approval)
  └── Edit own articles

Editors/Moderators
  ├── All registered permissions
  ├── Approve articles
  ├── Edit all articles
  └── Manage some categories

Administrators
  └── Full access to everything
```
---

## การจัดการสิทธิ์การเข้าถึง

### นำทางไปยังการอนุญาต
```
Admin Panel
└── Modules
    └── Publisher
        ├── Permissions
        ├── Category Permissions
        └── Group Management
```
### การเข้าถึงด่วน

1. เข้าสู่ระบบในฐานะ **ผู้ดูแลระบบ**
2. ไปที่ **ผู้ดูแลระบบ → โมดูล**
3. คลิก **ผู้เผยแพร่ → ผู้ดูแลระบบ**
4. คลิก **สิทธิ์** ในเมนูด้านซ้าย

---

## สิทธิ์ทั่วโลก

### สิทธิ์ระดับโมดูล

ควบคุมการเข้าถึงโมดูลและคุณสมบัติผู้เผยแพร่:
```
Permissions configuration view:
┌─────────────────────────────────────┐
│ Permission             │ Anon │ Reg │ Editor │ Admin │
├────────────────────────┼──────┼─────┼────────┼───────┤
│ View articles          │  ✓   │  ✓  │   ✓    │  ✓   │
│ Submit articles        │  ✗   │  ✓  │   ✓    │  ✓   │
│ Edit own articles      │  ✗   │  ✓  │   ✓    │  ✓   │
│ Edit all articles      │  ✗   │  ✗  │   ✓    │  ✓   │
│ Approve articles       │  ✗   │  ✗  │   ✓    │  ✓   │
│ Manage categories      │  ✗   │  ✗  │   ✗    │  ✓   │
│ Access admin panel     │  ✗   │  ✗  │   ✓    │  ✓   │
└─────────────────────────────────────┘
```
### คำอธิบายการอนุญาต

| การอนุญาต | ผู้ใช้ | เอฟเฟกต์ |
|------------|-------|--------|
| **ดูบทความ** | ทุกกลุ่ม | สามารถดูบทความที่เผยแพร่ได้ที่ front-end |
| **ส่งบทความ** | ลงทะเบียน+ | สามารถสร้างบทความใหม่ได้ (รอการอนุมัติ) |
| **แก้ไขบทความของตัวเอง** | ลงทะเบียน+ | สามารถแก้ไข/ลบบทความของตนเองได้ |
| **แก้ไขบทความทั้งหมด** | บรรณาธิการ+ | สามารถแก้ไขบทความของผู้ใช้คนใดก็ได้ |
| **ลบบทความของตัวเอง** | ลงทะเบียน+ | สามารถลบบทความที่ยังไม่ได้เผยแพร่ของตนเองได้ |
| **ลบบทความทั้งหมด** | บรรณาธิการ+ | สามารถลบบทความใดๆ |
| **อนุมัติบทความ** | บรรณาธิการ+ | สามารถเผยแพร่บทความที่รอดำเนินการได้ |
| **จัดการหมวดหมู่** | ผู้ดูแลระบบ | สร้าง แก้ไข ลบ หมวดหมู่ |
| **การเข้าถึงของผู้ดูแลระบบ** | บรรณาธิการ+ | เข้าถึงส่วนต่อประสานผู้ดูแลระบบ |

---

## กำหนดค่าสิทธิ์ทั่วโลก

### ขั้นตอนที่ 1: การตั้งค่าสิทธิ์การเข้าถึง

1. ไปที่ **ผู้ดูแลระบบ → โมดูล**
2. ค้นหา **ผู้จัดพิมพ์**
3. คลิก **สิทธิ์** (หรือลิงก์ผู้ดูแลระบบ จากนั้นคลิกสิทธิ์)
4. คุณเห็นเมทริกซ์การอนุญาต

### ขั้นตอนที่ 2: ตั้งค่าสิทธิ์ของกลุ่ม

สำหรับแต่ละกลุ่ม ให้กำหนดค่าสิ่งที่พวกเขาสามารถทำได้:

#### ผู้ใช้ที่ไม่ระบุชื่อ
```yaml
Anonymous Group Permissions:
  View articles: ✓ YES
  Submit articles: ✗ NO
  Edit articles: ✗ NO
  Delete articles: ✗ NO
  Approve articles: ✗ NO
  Manage categories: ✗ NO
  Admin access: ✗ NO

Result: Anonymous users can only view published content
```
#### ผู้ใช้ที่ลงทะเบียน
```yaml
Registered Group Permissions:
  View articles: ✓ YES
  Submit articles: ✓ YES (with approval required)
  Edit own articles: ✓ YES
  Edit all articles: ✗ NO
  Delete own articles: ✓ YES (drafts only)
  Delete all articles: ✗ NO
  Approve articles: ✗ NO
  Manage categories: ✗ NO
  Admin access: ✗ NO

Result: Registered users can contribute content after approval
```
#### กลุ่มบรรณาธิการ
```yaml
Editors Group Permissions:
  View articles: ✓ YES
  Submit articles: ✓ YES
  Edit own articles: ✓ YES
  Edit all articles: ✓ YES
  Delete own articles: ✓ YES
  Delete all articles: ✓ YES
  Approve articles: ✓ YES
  Manage categories: ✓ LIMITED
  Admin access: ✓ YES
  Configure settings: ✗ NO

Result: Editors manage content but not settings
```
#### ผู้ดูแลระบบ
```yaml
Admins Group Permissions:
  ✓ FULL ACCESS to all features

  - All editor permissions
  - Manage all categories
  - Configure all settings
  - Manage permissions
  - Install/uninstall
```
### ขั้นตอนที่ 3: บันทึกสิทธิ์

1. กำหนดค่าการอนุญาตของแต่ละกลุ่ม
2. ทำเครื่องหมายในช่องสำหรับการดำเนินการที่อนุญาต
3. ยกเลิกการทำเครื่องหมายในช่องสำหรับการดำเนินการที่ถูกปฏิเสธ
4. คลิก **บันทึกสิทธิ์**
5. ข้อความยืนยันปรากฏขึ้น

---

## สิทธิ์ระดับหมวดหมู่

### ตั้งค่าการเข้าถึงหมวดหมู่

ควบคุมผู้ที่สามารถดู/ส่งไปยังหมวดหมู่เฉพาะ:
```
Admin → Publisher → Categories
→ Select category → Permissions
```
### เมทริกซ์การอนุญาตหมวดหมู่
```
                 Anonymous  Registered  Editor  Admin
View category        ✓         ✓         ✓       ✓
Submit to category   ✗         ✓         ✓       ✓
Edit own in category ✗         ✓         ✓       ✓
Edit all in category ✗         ✗         ✓       ✓
Approve in category  ✗         ✗         ✓       ✓
Manage category      ✗         ✗         ✗       ✓
```
### กำหนดค่าการอนุญาตหมวดหมู่

1. ไปที่ผู้ดูแลระบบ **หมวดหมู่**
2. ค้นหาหมวดหมู่
3. คลิกปุ่ม **สิทธิ์**
4. สำหรับแต่ละกลุ่ม ให้เลือก:
   - [ ] ดูหมวดหมู่นี้
   - [ ] ส่งบทความ
   - [ ] แก้ไขบทความของตัวเอง
   - [ ] แก้ไขบทความทั้งหมด
   - [ ] อนุมัติบทความ
   - [ ] จัดการหมวดหมู่
5. คลิก **บันทึก**

### ตัวอย่างการอนุญาตหมวดหมู่

#### หมวดข่าวสาธารณะ
```
Anonymous: View only
Registered: View + Submit (pending approval)
Editors: Approve + Edit
Admins: Full control
```
#### หมวดหมู่การอัปเดตภายใน
```
Anonymous: No access
Registered: View only
Editors: Submit + Approve
Admins: Full control
```
#### หมวดหมู่บล็อกแขก
```
Anonymous: View only
Registered: Submit (pending approval)
Editors: Approve
Admins: Full control
```
---

## สิทธิ์ระดับฟิลด์

### การมองเห็นฟิลด์แบบฟอร์มควบคุม

จำกัดฟิลด์แบบฟอร์มที่ผู้ใช้สามารถดู/แก้ไขได้:
```
Admin → Publisher → Permissions → Fields
```
### ตัวเลือกฟิลด์
```yaml
Visible Fields for Registered Users:
  ✓ Title
  ✓ Description
  ✓ Content (body)
  ✓ Featured image
  ✓ Category
  ✓ Tags
  ✗ Author (auto-set)
  ✗ Publication date (editors only)
  ✗ Scheduled date (editors only)
  ✗ Featured flag (editors only)
  ✗ Permissions (admins only)
```
### ตัวอย่าง

#### ส่งจำนวนจำกัดสำหรับการลงทะเบียน

ผู้ใช้ที่ลงทะเบียนจะเห็นตัวเลือกน้อยลง:
```
Available fields:
  - Title ✓
  - Description ✓
  - Content ✓
  - Featured image ✓
  - Category ✓

Hidden fields:
  - Author (auto-current user)
  - Publication date (editors decide)
  - Scheduled date (admins only)
  - Featured status (editors choose)
```
#### แบบฟอร์มฉบับเต็มสำหรับบรรณาธิการ

บรรณาธิการเห็นตัวเลือกทั้งหมด:
```
Available fields:
  - All basic fields
  - All metadata
  - Author selection ✓
  - Publication date/time ✓
  - Scheduled date ✓
  - Featured status ✓
  - Expiration date ✓
  - Permissions ✓
```
---

## การกำหนดค่ากลุ่มผู้ใช้

### สร้างกลุ่มที่กำหนดเอง

1. ไปที่ **ผู้ดูแลระบบ → ผู้ใช้ → กลุ่ม**
2. คลิก **สร้างกลุ่ม**
3. กรอกรายละเอียดกลุ่ม:
```
Group Name: "Community Bloggers"
Group Description: "Users who contribute blog content"
Type: Regular group
```
4. คลิก **บันทึกกลุ่ม**
5. กลับไปที่การอนุญาตของผู้เผยแพร่
6. ตั้งค่าการอนุญาตสำหรับกลุ่มใหม่

### ตัวอย่างกลุ่ม
```
Suggested Groups for Publisher:

Group: Contributors
  - Regular members who submit articles
  - Can edit own articles
  - Cannot approve articles

Group: Reviewers
  - Can see submitted articles
  - Can approve/reject articles
  - Cannot delete others' articles

Group: Editors
  - Can edit any article
  - Can approve articles
  - Can moderate comments
  - Can manage some categories

Group: Publishers
  - Can edit any article
  - Can publish directly (no approval)
  - Can manage all categories
  - Can configure settings
```
---

## ลำดับชั้นการอนุญาต

### ขั้นตอนการอนุญาต
```
mermaid
graph TD
    A[XOOPS Core Permissions] -->|Granted by| B[System Modules]
    B -->|Applied to| C[User Groups]
    C -->|Restrict| D[Publisher Permissions]
    D -->|Apply to| E[Global Permissions]
    E -->|Override by| F[Category Permissions]
    F -->|Apply to| G[Field Permissions]
```
### สืบทอดการอนุญาต
```
Base: Global module permissions
  ↓
Category: Overrides for specific categories
  ↓
Field: Further restricts available fields
  ↓
User: Has permission if ALL levels allow
```
**ตัวอย่าง:**
```
User wants to edit article:
1. User group must have "edit articles" permission (global)
2. Category must allow editing (category level)
3. Field restrictions must allow (if applicable)
4. User must be author OR editor (for own vs all)

If ANY level denies → Permission denied
```
---

## สิทธิ์เวิร์กโฟลว์การอนุมัติ

### กำหนดค่าการอนุมัติการส่ง

ควบคุมว่าบทความต้องได้รับการอนุมัติหรือไม่:
```
Admin → Publisher → Preferences → Workflow
```
#### ตัวเลือกการอนุมัติ
```yaml
Submission Workflow:
  Require Approval: Yes

  For Registered Users:
    - New articles: Draft (pending approval)
    - Editors must approve
    - User can edit while pending
    - After approval: User can still edit

  For Editors:
    - New articles: Publish directly (optional)
    - Skip approval queue
    - Or always require approval
```
#### กำหนดค่าต่อกลุ่ม

1. ไปที่การตั้งค่า
2. ค้นหา "ขั้นตอนการส่งผลงาน"
3. สำหรับแต่ละกลุ่ม ให้ตั้งค่า:
```
Group: Registered Users
  Require approval: ✓ YES
  Default status: Draft
  Can modify while pending: ✓ YES

Group: Editors
  Require approval: ✗ NO
  Default status: Published
  Can modify published: ✓ YES
```
4. คลิก **บันทึก**

---

## บทความปานกลาง

### อนุมัติบทความที่รอดำเนินการ

สำหรับผู้ใช้ที่มีสิทธิ์ "อนุมัติบทความ":

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → บทความ**
2. กรองตาม **สถานะ**: รอดำเนินการ
3. คลิกบทความเพื่อตรวจสอบ
4. ตรวจสอบคุณภาพเนื้อหา
5. ตั้งค่า **สถานะ**: เผยแพร่แล้ว
6. ตัวเลือกเสริม: เพิ่มบันทึกย่อของบรรณาธิการ
7. คลิก **บันทึก**

### ปฏิเสธบทความ

หากบทความไม่เป็นไปตามมาตรฐาน:

1. เปิดบทความ
2. ตั้งค่า **สถานะ**: ร่าง
3. เพิ่มเหตุผลในการปฏิเสธ (ในความคิดเห็นหรืออีเมล)
4. คลิก **บันทึก**
5. ส่งข้อความถึงผู้เขียนเพื่ออธิบายการปฏิเสธ

### ความคิดเห็นปานกลาง

หากมีการกลั่นกรองความคิดเห็น:

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → ความคิดเห็น**
2. กรองตาม **สถานะ**: รอดำเนินการ
3. ตรวจสอบความคิดเห็น
4. ตัวเลือก:
   - อนุมัติ: คลิก **อนุมัติ**
   - ปฏิเสธ: คลิก **ลบ**
   - แก้ไข: คลิก **แก้ไข** แก้ไข บันทึก
5. คลิก **บันทึก**

---

## จัดการการเข้าถึงของผู้ใช้

### ดูกลุ่มผู้ใช้

ดูว่าผู้ใช้รายใดอยู่ในกลุ่ม:
```
Admin → Users → User Groups

For each user:
  - Primary group (one)
  - Secondary groups (multiple)

Permissions apply from all groups (union)
```
### เพิ่มผู้ใช้ในกลุ่ม

1. ไปที่ **ผู้ดูแลระบบ → ผู้ใช้**
2. ค้นหาผู้ใช้
3. คลิก **แก้ไข**
4. ใต้ **กลุ่ม** ให้เลือกกลุ่มที่จะเพิ่ม
5. คลิก **บันทึก**

### เปลี่ยนการอนุญาตของผู้ใช้

สำหรับผู้ใช้รายบุคคล (หากรองรับ):

1. ไปที่ผู้ดูแลระบบผู้ใช้
2. ค้นหาผู้ใช้
3. คลิก **แก้ไข**
4. ค้นหาการแทนที่สิทธิ์ส่วนบุคคล
5. กำหนดค่าตามความจำเป็น
6. คลิก **บันทึก**

---

## สถานการณ์การอนุญาตทั่วไป

### สถานการณ์ที่ 1: เปิดบล็อก

อนุญาตให้ทุกคนส่ง:
```
Anonymous: View
Registered: Submit, edit own, delete own
Editors: Approve, edit all, delete all
Admins: Full control

Result: Open community blog
```
### สถานการณ์ที่ 2: เว็บไซต์ข่าวที่ผ่านการตรวจสอบ

กระบวนการอนุมัติที่เข้มงวด:
```
Anonymous: View only
Registered: Cannot submit
Editors: Submit, approve others
Admins: Full control

Result: Only approved professionals publish
```
### สถานการณ์ที่ 3: บล็อกของพนักงาน

พนักงานสามารถมีส่วนร่วม:
```
Create group: "Staff"
Anonymous: View
Registered: View only (non-staff)
Staff: Submit, edit own, publish directly
Admins: Full control

Result: Staff-authored blog
```
### สถานการณ์ที่ 4: หลายหมวดหมู่พร้อมตัวแก้ไขที่แตกต่างกัน

บรรณาธิการที่แตกต่างกันสำหรับหมวดหมู่ต่างๆ:
```
News category:
  Editors group A: Full control

Reviews category:
  Editors group B: Full control

Tutorials category:
  Editors group C: Full control

Result: Decentralized editorial control
```
---

## การทดสอบการอนุญาต

### ตรวจสอบการอนุญาตทำงาน

1. สร้างผู้ใช้ทดสอบในแต่ละกลุ่ม
2. เข้าสู่ระบบในฐานะผู้ใช้ทดสอบแต่ละคน
3. พยายาม:
   - ดูบทความ
   - ส่งบทความ (ควรสร้างฉบับร่างหากได้รับอนุญาต)
   - แก้ไขบทความ (ของตัวเองและผู้อื่น)
   - ลบบทความ
   - เข้าถึงแผงผู้ดูแลระบบ
   - หมวดหมู่การเข้าถึง

4. ตรวจสอบผลลัพธ์ที่ตรงกับสิทธิ์ที่คาดหวัง

### กรณีทดสอบทั่วไป
```
Test Case 1: Anonymous user
  [ ] Can view published articles: ✓
  [ ] Cannot submit articles: ✓
  [ ] Cannot access admin: ✓

Test Case 2: Registered user
  [ ] Can submit articles: ✓
  [ ] Articles go to Draft: ✓
  [ ] Can edit own article: ✓
  [ ] Cannot edit others: ✓
  [ ] Cannot access admin: ✓

Test Case 3: Editor
  [ ] Can approve articles: ✓
  [ ] Can edit any article: ✓
  [ ] Can access admin: ✓
  [ ] Cannot delete all: ✓ (or ✓ if allowed)

Test Case 4: Admin
  [ ] Can do everything: ✓
```
---

## การแก้ไขปัญหาการอนุญาต

### ปัญหา: ผู้ใช้ไม่สามารถส่งบทความได้

**ตรวจสอบ:**
```
1. User group has "submit articles" permission
   Admin → Publisher → Permissions

2. User belongs to allowed group
   Admin → Users → Edit user → Groups

3. Category allows submission from user's group
   Admin → Publisher → Categories → Permissions

4. User is registered (not anonymous)
```
**สารละลาย:**
```bash
1. Verify registered user group has submission permission
2. Add user to appropriate group
3. Check category permissions
4. Clear user session cache
```
### ปัญหา: ผู้แก้ไขไม่สามารถอนุมัติบทความได้

**ตรวจสอบ:**
```
1. Editor group has "approve articles" permission
2. Articles exist with "Pending" status
3. Editor is in correct group
4. Category allows approval from editor's group
```
**สารละลาย:**
```bash
1. Go to Permissions, check "approve articles" is checked for editor group
2. Create test article, set to Draft
3. Try to approve as editor
4. Check error messages in system log
```
### ปัญหา: สามารถดูบทความได้แต่ไม่สามารถเข้าถึงหมวดหมู่ได้

**ตรวจสอบ:**
```
1. Category is not disabled/hidden
2. Category permissions allow viewing
3. User's group is permitted to view category
4. Category is published
```
**สารละลาย:**
```bash
1. Go to Categories, check category status is "Enabled"
2. Check category permissions are set
3. Add user's group to category view permission
```
### ปัญหา: การอนุญาตมีการเปลี่ยนแปลงแต่ไม่มีผล

**วิธีแก้ปัญหา:**
```bash
1. Clear cache: Admin → Tools → Clear Cache
2. Clear session: Logout and login again
3. Check system log for errors
4. Verify permissions actually saved
5. Try different browser/incognito window
```
---

## การสำรองข้อมูลและส่งออกสิทธิ์

### สิทธิ์ในการส่งออก

บางระบบอนุญาตให้ส่งออก:

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → เครื่องมือ**
2. คลิก **ส่งออกสิทธิ์**
3. บันทึกไฟล์ `.xml` หรือ `.json`
4. เก็บไว้เป็นข้อมูลสำรอง

### สิทธิ์การนำเข้า

กู้คืนจากข้อมูลสำรอง:

1. ไปที่ **ผู้ดูแลระบบ → ผู้เผยแพร่ → เครื่องมือ**
2. คลิก **นำเข้าสิทธิ์**
3. เลือกไฟล์สำรอง
4. ตรวจสอบการเปลี่ยนแปลง
5. คลิก **นำเข้า**

---

## แนวทางปฏิบัติที่ดีที่สุด

### รายการตรวจสอบการกำหนดค่าสิทธิ์

- [ ] ตัดสินใจเลือกกลุ่มผู้ใช้
- [ ] กำหนดชื่อกลุ่มให้ชัดเจน
- [ ] ตั้งค่าการอนุญาตพื้นฐานสำหรับแต่ละกลุ่ม
- [ ] ทดสอบแต่ละระดับการอนุญาต
- [ ] โครงสร้างการอนุญาตเอกสาร
- [ ] สร้างขั้นตอนการอนุมัติ
- [ ] ฝึกอบรมบรรณาธิการเรื่องการกลั่นกรอง
- [ ] ตรวจสอบการใช้สิทธิ์
- [ ] ตรวจสอบสิทธิ์ทุกไตรมาส
- [ ] การตั้งค่าการอนุญาตการสำรองข้อมูล

### แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย
```
✓ Principle of Least Privilege
  - Grant minimum necessary permissions

✓ Role-Based Access
  - Use groups for roles (editor, moderator, etc)

✓ Audit Permissions
  - Review who has what access

✓ Separate Duties
  - Submitter, approver, publisher are different

✓ Regular Review
  - Check permissions quarterly
  - Remove access when users leave
  - Update for new requirements
```
---

## คำแนะนำที่เกี่ยวข้อง

- การสร้างบทความ
- การจัดการหมวดหมู่
- การกำหนดค่าพื้นฐาน
- การติดตั้ง

---

## ขั้นตอนต่อไป

- ตั้งค่าการอนุญาตสำหรับเวิร์กโฟลว์ของคุณ
- สร้างบทความที่มีสิทธิ์ที่เหมาะสม
- กำหนดค่าหมวดหมู่ที่มีสิทธิ์
- ฝึกอบรมผู้ใช้เกี่ยวกับการสร้างบทความ

---

#ผู้เผยแพร่ #สิทธิ์ #กลุ่ม #การควบคุมการเข้าถึง #ความปลอดภัย #การกลั่นกรอง #xoops