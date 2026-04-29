---
title: "แนวทางการรายงานปัญหา"
description: "วิธีรายงานข้อบกพร่อง คำขอคุณลักษณะ และปัญหาอื่น ๆ อย่างมีประสิทธิภาพ"
---
> รายงานข้อบกพร่องที่มีประสิทธิภาพและการร้องขอคุณลักษณะมีความสำคัญอย่างยิ่งต่อการพัฒนา XOOPS คู่มือนี้ช่วยคุณสร้างปัญหาคุณภาพสูง

---

## ก่อนรายงานตัว

### ตรวจสอบปัญหาที่มีอยู่

**ค้นหาก่อนเสมอ:**

1. ไปที่ [ปัญหา GitHub](https://github.com/XOOPS/XoopsCore27/issues)
2. ค้นหาคำหลักที่เกี่ยวข้องกับปัญหาของคุณ
3. ตรวจสอบปัญหาที่ปิดแล้ว - อาจได้รับการแก้ไขแล้ว
4. ดูคำขอดึง - อาจอยู่ระหว่างดำเนินการ

ใช้ตัวกรองการค้นหา:
- `is:issue is:open label:bug` - เปิดข้อบกพร่อง
- `is:issue is:open label:feature` - เปิดคำขอคุณลักษณะ
- `is:issue sort:updated` - ปัญหาที่อัปเดตล่าสุด

### มันเป็นปัญหาจริงๆเหรอ?

พิจารณาก่อน:

- **ปัญหาการกำหนดค่า?** - ตรวจสอบเอกสารประกอบ
- **คำถามการใช้งาน?** - ถามในฟอรั่มหรือชุมชน Discord
- **ปัญหาด้านความปลอดภัย?** - ดูส่วน #ปัญหาด้านความปลอดภัย ด้านล่าง
- **เฉพาะโมดูล?** - รายงานไปยังผู้ดูแลโมดูล
- **เฉพาะธีม?** - รายงานไปยังผู้เขียนธีม

---

## ประเภทปัญหา

### รายงานข้อผิดพลาด

จุดบกพร่องคือพฤติกรรมหรือข้อบกพร่องที่ไม่คาดคิด

**ตัวอย่าง:**
- เข้าสู่ระบบใช้งานไม่ได้
- ข้อผิดพลาดของฐานข้อมูล
- ขาดการตรวจสอบแบบฟอร์ม
- ช่องโหว่ด้านความปลอดภัย

### คำขอคุณสมบัติ

คำขอคุณลักษณะเป็นข้อเสนอแนะสำหรับฟังก์ชันการทำงานใหม่

**ตัวอย่าง:**
- เพิ่มการรองรับคุณสมบัติใหม่
- ปรับปรุงฟังก์ชันการทำงานที่มีอยู่
- เพิ่มเอกสารที่ขาดหายไป
- การปรับปรุงประสิทธิภาพ

### การเพิ่มประสิทธิภาพ

การปรับปรุงปรับปรุงฟังก์ชันการทำงานที่มีอยู่

**ตัวอย่าง:**
- ข้อความแสดงข้อผิดพลาดที่ดีขึ้น
- ปรับปรุงประสิทธิภาพ
- การออกแบบ API ที่ดีกว่า
- ประสบการณ์การใช้งานที่ดีขึ้น

### เอกสารประกอบ

ปัญหาด้านเอกสารรวมถึงเอกสารที่ขาดหายไปหรือไม่ถูกต้อง

**ตัวอย่าง:**
- เอกสาร API ไม่สมบูรณ์
- คำแนะนำที่ล้าสมัย
- ตัวอย่างโค้ดที่หายไป
- การพิมพ์ผิดในเอกสาร

---

## รายงานข้อผิดพลาด

### เทมเพลตรายงานข้อผิดพลาด
```
markdown
## Description
Brief, clear description of the bug.

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- XOOPS Version: X.Y.Z
- PHP Version: 8.2/8.3/8.4
- Database: MySQL/MariaDB version
- Operating System: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari

## Screenshots
If applicable, add screenshots showing the issue.

## Additional Context
Any other relevant information.

## Possible Fix
If you have suggestions for fixing the issue (optional).
```
### ตัวอย่างรายงานข้อผิดพลาดที่ดี
```
markdown
## Description
Login page shows blank page when database connection fails.

## Steps to Reproduce
1. Stop the MySQL service
2. Navigate to the login page
3. Observe the behavior

## Expected Behavior
Show a user-friendly error message explaining the database connection issue.

## Actual Behavior
The page is completely blank - no error message, no interface visible.

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.0.28
- Database: MySQL 5.7
- Operating System: Ubuntu 20.04
- Browser: Chrome 120

## Additional Context
This likely affects other pages too. The error should be displayed to admins or logged appropriately.

## Possible Fix
Check database connection in header.php before rendering the template.
```
### ตัวอย่างรายงานข้อผิดพลาดที่ไม่ดี
```
markdown
## Description
Login doesn't work

## Steps to Reproduce
It doesn't work

## Expected Behavior
It should work

## Actual Behavior
It doesn't

## Environment
Latest version
```
---

## การรายงานคำขอคุณสมบัติ

### เทมเพลตคำขอคุณสมบัติ
```
markdown
## Description
Clear, concise description of the feature.

## Problem Statement
Why is this feature needed? What problem does it solve?

## Proposed Solution
Describe your ideal implementation or UX.

## Alternatives Considered
Are there other ways to achieve this goal?

## Additional Context
Any mockups, examples, or references.

## Expected Impact
How would this benefit users? Would it be breaking?
```
### ตัวอย่างคำขอคุณสมบัติที่ดี
```
markdown
## Description
Add two-factor authentication (2FA) for user accounts.

## Problem Statement
With increasing security breaches, many CMS platforms now offer 2FA. XOOPS users want stronger account security beyond passwords.

## Proposed Solution
Implement TOTP-based 2FA (compatible with Google Authenticator, Authy, etc.).
- Users can enable 2FA in their profile
- Display QR code for setup
- Generate backup codes for recovery
- Require 2FA code at login

## Alternatives Considered
- SMS-based 2FA (requires carrier integration, less secure)
- Hardware keys (too complex for average users)

## Additional Context
Similar to GitHub, GitLab, and WordPress implementations.
Reference: [TOTP Standard RFC 6238](https://tools.ietf.org/html/rfc6238)

## Expected Impact
Increases account security. Could be optional initially, mandatory in future versions.
```
---

## ปัญหาด้านความปลอดภัย

### ทำ NOT รายงานต่อสาธารณะ

**อย่าสร้างปัญหาสาธารณะเกี่ยวกับช่องโหว่ด้านความปลอดภัย**

### รายงานเป็นการส่วนตัว

1. **ส่งอีเมลถึงทีมรักษาความปลอดภัย:** security@xoops.org
2. **รวม:**
   - คำอธิบายของช่องโหว่
   - ขั้นตอนในการสืบพันธุ์
   - ผลกระทบที่อาจเกิดขึ้น
   - ข้อมูลการติดต่อของคุณ

### การเปิดเผยอย่างมีความรับผิดชอบ

- เราจะรับทราบการรับภายใน 48 ชั่วโมง
- เราจะให้ข้อมูลอัปเดตทุกๆ 7 วัน
- เราจะดำเนินการแก้ไขไทม์ไลน์
- คุณสามารถขอเครดิตสำหรับการค้นพบได้
- ประสานงานกำหนดเวลาการเปิดเผยต่อสาธารณะ

### ตัวอย่างปัญหาด้านความปลอดภัย
```
Subject: [SECURITY] XSS Vulnerability in Comment Form

Description:
The comment form in Publisher module does not properly escape user input,
allowing stored XSS attacks.

Steps to Reproduce:
1. Create a comment with: <img src=x onerror="alert('xss')">
2. Submit the form
3. The JavaScript executes when viewing the comment

Impact:
Attackers can steal user session tokens, perform actions as users,
or deface the website.

Environment:
- XOOPS 2.7.0
- Publisher Module 1.x
```
---

## หัวข้อปัญหาแนวทางปฏิบัติที่ดีที่สุด

### ชื่อดี
```
✅ Login page shows blank error when database connection fails
✅ Add two-factor authentication support
✅ Form validation not preventing SQL injection in name field
✅ Improve performance of user list query
✅ Update installation documentation for PHP 8.2
```
### ชื่อไม่ดี
```
❌ Bug in system
❌ Help me!!
❌ It doesn't work
❌ Question about XOOPS
❌ Error
```
### หลักเกณฑ์ชื่อเรื่อง

- **ระบุให้เจาะจง** - กล่าวถึงอะไรและที่ไหน
- **กระชับ** - ไม่เกิน 75 ตัวอักษร
- **ใช้กาลปัจจุบัน** - "แสดงหน้าว่าง" ไม่ใช่ "แสดงหน้าว่าง"
- **รวมบริบท** - "ในแผงผู้ดูแลระบบ", "ระหว่างการติดตั้ง"
- **หลีกเลี่ยงคำทั่วไป** - ไม่ใช่ "แก้ไข" "ช่วยเหลือ" "ปัญหา"

---

## คำอธิบายประเด็น แนวทางปฏิบัติที่ดีที่สุด

### รวมข้อมูลที่จำเป็น

1. **อะไร** - คำอธิบายปัญหาที่ชัดเจน
2. **ที่ไหน** - เพจ โมดูล หรือฟีเจอร์ใด
3. **เมื่อ** - ขั้นตอนในการสืบพันธุ์
4. **สภาพแวดล้อม** - เวอร์ชัน OS เบราว์เซอร์ PHP
5. **ทำไม** - เหตุใดจึงสำคัญ

### ใช้การจัดรูปแบบโค้ด
```
markdown
Error message: `Error: Cannot find user`

Code snippet:
```php
$user = $this->getUser($id);
if (!$user) {
    echo "Error: Cannot find user";
}
```
```

### Include Screenshots

For UI issues, include:
- Screenshot of the problem
- Screenshot of expected behavior
- Annotate what's wrong (arrows, circles)

### Use Labels

Add labels to categorize:
- `bug` - Bug report
- `enhancement` - Enhancement request
- `documentation` - Documentation issue
- `help wanted` - Looking for help
- `good first issue` - Good for new contributors

---

## After Reporting

### Be Responsive

- Check for questions in the issue comments
- Provide additional information if requested
- Test suggested fixes
- Verify bug still exists with new versions

### Follow Etiquette

- Be respectful and professional
- Assume good intentions
- Don't demand fixes - developers are volunteers
- Offer to help if possible
- Thank contributors for their work

### Keep Issue Focused

- Stay on topic
- Don't discuss unrelated issues
- Link to related issues instead
- Don't use issues for feature voting

---

## What Happens to Issues

### Triage Process

1. **New issue created** - GitHub notifies maintainers
2. **Initial review** - Checked for clarity and duplicates
3. **Label assignment** - Categorized and prioritized
4. **Assignment** - Assigned to someone if appropriate
5. **Discussion** - Additional info gathered if needed

### Priority Levels

- **Critical** - Data loss, security, complete breakage
- **High** - Major feature broken, affects many users
- **Medium** - Part of feature broken, workaround available
- **Low** - Minor issue, cosmetic, or niche use case

### Resolution Outcomes

- **Fixed** - Issue resolved in a PR
- **Won't fix** - Rejected for technical or strategic reasons
- **Duplicate** - Same as another issue
- **Invalid** - Not actually an issue
- **Needs more info** - Waiting for additional details

---

## Issue Examples

### Example: Good Bug Report

```
markdown
## Description
Admin users cannot delete items when using MySQL with strict mode enabled.

## Steps to Reproduce
1. Enable `sql_mode='STRICT_TRANS_TABLES'` in MySQL
2. Navigate to Publisher admin panel
3. Click delete button on any article
4. Error is shown

## Expected Behavior
Article should be deleted or show meaningful error.

## Actual Behavior
Error: "SQL Error - Unknown column 'deleted_at' in ON clause"

## Environment
- XOOPS Version: 2.7.0
- PHP Version: 8.2.0
- Database: MySQL 8.0.32 with STRICT_TRANS_TABLES
- Operating System: Ubuntu 22.04
- Browser: Firefox 120

## Screenshots
[Screenshot of error message]

## Additional Context
This only happens with strict SQL mode. Works fine with default settings.
The query is in class/PublisherItem.php:248

## Possible Fix
Use single quotes around 'deleted_at' or use backticks for all column names.
```
### ตัวอย่าง: คำขอคุณลักษณะที่ดี
```
markdown
## Description
Add REST API endpoints for read-only access to public content.

## Problem Statement
Developers want to build mobile apps and external services using XOOPS data.
Currently limited to SOAP API which is outdated and poorly documented.

## Proposed Solution
Implement RESTful API with:
- Endpoints for articles, users, comments (read-only)
- Token-based authentication
- Standard HTTP status codes and errors
- OpenAPI/Swagger documentation
- Pagination support

## Alternatives Considered
- Enhanced SOAP API (legacy, not standards-compliant)
- GraphQL (more complex, maybe future)

## Additional Context
See Publisher module API refactoring for similar patterns.
Would align with modern web development practices.

## Expected Impact
Enable ecosystem of third-party tools and mobile apps.
Would improve XOOPS adoption and ecosystem.
```
---

## เอกสารที่เกี่ยวข้อง

- หลักจรรยาบรรณ
- ขั้นตอนการทำงานสมทบ
- แนวทางการขอดึง
- ภาพรวมการมีส่วนร่วม

---

#xoops #issues #การรายงานจุดบกพร่อง #คำขอคุณสมบัติ #github