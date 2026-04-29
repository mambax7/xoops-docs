---
title: "แนวทางการขอดึง"
description: "หลักเกณฑ์ในการส่งคำขอดึงไปยังโครงการ XOOPS"
---
เอกสารนี้ให้แนวทางที่ครอบคลุมสำหรับการส่งคำขอดึงไปยังโครงการ XOOPS การปฏิบัติตามหลักเกณฑ์เหล่านี้ทำให้แน่ใจได้ว่าการตรวจสอบโค้ดจะราบรื่นและเวลาในการรวมจะเร็วขึ้น

## ก่อนที่จะสร้างคำขอดึง

### ขั้นตอนที่ 1: ตรวจสอบปัญหาที่มีอยู่
```
1. Visit the GitHub repository
2. Go to Issues tab
3. Search for existing issues related to your change
4. Check both open and closed issues
```
### ขั้นตอนที่ 2: แยกและโคลนพื้นที่เก็บข้อมูล
```bash
# Fork the repository on GitHub
# Click "Fork" button on the repository page

# Clone your fork
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# Verify remotes
git remote -v
# Should show: origin (your fork) and upstream (official)
```
### ขั้นตอนที่ 3: สร้างสาขาคุณลักษณะ
```bash
# Update main branch
git fetch upstream
git checkout main
git merge upstream/main

# Create feature branch
# Use descriptive names: bugfix/issue-number or feature/description
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```
### ขั้นตอนที่ 4: ทำการเปลี่ยนแปลงของคุณ
```bash
# Make changes to your files
# Follow code style guidelines

# Stage changes
git add .

# Commit with clear message
git commit -m "Fix database connection timeout issue"

# Create multiple commits for logical changes
git commit -m "Add connection retry logic"
git commit -m "Improve error messages for debugging"
```
## ยอมรับมาตรฐานข้อความ

### ข้อความความมุ่งมั่นที่ดี

ใช้ข้อความที่สื่อความหมายชัดเจนตามรูปแบบเหล่านี้:
```
# Format
<type>: <subject>

<body>

<footer>

# Example 1: Bug fix
fix: resolve database connection timeout

Add exponential backoff retry mechanism to database connection.
Connections now retry up to 3 times with increasing delays.

Fixes #123
```

```
# Example 2: Feature
feat: implement PSR-7 HTTP message interfaces

Implement Psr\Http\Message interfaces for request/response handling.
Provides type-safe HTTP message handling across the framework.

BREAKING CHANGE: Updated RequestHandler signature
```
### หมวดหมู่ประเภทความมุ่งมั่น

| พิมพ์ | คำอธิบาย | ตัวอย่าง |
|------|-------------|---------|
| `feat` | คุณสมบัติใหม่ | `feat: add user dashboard widget` |
| `fix` | แก้ไขข้อผิดพลาด | `fix: resolve cache invalidation bug` |
| `docs` | เอกสารประกอบ | `docs: update API reference` |
| `style` | รูปแบบโค้ด (ไม่มีการเปลี่ยนแปลงลอจิก) | `style: format imports` |
| `refactor` | การปรับโครงสร้างโค้ดใหม่ | `refactor: simplify service layer` |
| `perf` | การปรับปรุงประสิทธิภาพ | `perf: optimize database queries` |
| `test` | ทดสอบการเปลี่ยนแปลง | `test: add integration tests` |
| `chore` | การเปลี่ยนแปลงการสร้าง/เครื่องมือ | `chore: update dependencies` |

## ดึงคำอธิบายคำขอ

### PR เทมเพลต
```
markdown
## Description
Clear description of changes made and why.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #123
Related to #456

## Changes Made
- Change 1
- Change 2
- Change 3

## Testing
- [ ] Tested locally
- [ ] All tests pass
- [ ] Added new tests
- [ ] Manual testing steps included

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Added tests for new functionality
- [ ] All tests passing
```
## ข้อกำหนดด้านคุณภาพรหัส

### รูปแบบโค้ด

ปฏิบัติตามหลักเกณฑ์สไตล์โค้ด:
```php
<?php
// Good: PSR-12 style
namespace MyModule\Controller;

use MyModule\Model\Item;
use MyModule\Repository\ItemRepository;

class ItemController
{
    private ItemRepository $repository;

    public function __construct(ItemRepository $repository)
    {
        $this->repository = $repository;
    }

    public function indexAction()
    {
        $items = $this->repository->findAll();
        return $this->render('items', ['items' => $items]);
    }
}
```
## ข้อกำหนดการทดสอบ

### การทดสอบหน่วย
```php
// tests/Feature/DatabaseConnectionTest.php
namespace Tests\Feature;

use PHPUnit\Framework\TestCase;
use Xoops\Database\XoopsDatabase;

class DatabaseConnectionTest extends TestCase
{
    private XoopsDatabase $database;

    protected function setUp(): void
    {
        $this->database = new XoopsDatabase();
    }

    public function testConnectionWithValidCredentials()
    {
        $result = $this->database->connect();
        $this->assertTrue($result);
    }

    public function testConnectionWithInvalidCredentials()
    {
        $this->database->setCredentials('invalid', 'invalid');
        $result = $this->database->connect();
        $this->assertFalse($result);
    }
}
```
### การทดสอบการทำงาน
```bash
# Run all tests
vendor/bin/phpunit

# Run specific test file
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# Run with coverage
vendor/bin/phpunit --coverage-html coverage/
```
## ทำงานกับสาขา

### อัปเดตสาขาอยู่เสมอ
```bash
# Fetch latest from upstream
git fetch upstream

# Rebase on latest main
git rebase upstream/main

# Or merge if you prefer
git merge upstream/main

# Force push if rebased (warning: only on your branch!)
git push -f origin bugfix/123-fix-database-connection
```
## การสร้างคำขอดึง

### PR รูปแบบชื่อเรื่อง
```
[Type] Short description (fix/feature/docs)

Examples:
- [FIX] Resolve database connection timeout issue (#123)
- [FEATURE] Implement PSR-7 HTTP message interfaces
- [DOCS] Update API reference for Criteria class
```
## กระบวนการตรวจสอบโค้ด

### สิ่งที่ผู้วิจารณ์มองหา

1. **ความถูกต้อง**
   - รหัสช่วยแก้ปัญหาที่ระบุไว้หรือไม่
   - Edge case ได้รับการจัดการหรือไม่?
   - การจัดการข้อผิดพลาดมีความเหมาะสมหรือไม่?

2. **คุณภาพ**
   - มันเป็นไปตามมาตรฐานการเข้ารหัสหรือไม่?
   - สามารถบำรุงรักษาได้หรือไม่?
   - ผ่านการทดสอบแล้วดีไหม?

3. **ประสิทธิภาพ**
   - มีการถดถอยด้านประสิทธิภาพหรือไม่?
   - แบบสอบถามได้รับการปรับให้เหมาะสมหรือไม่
   - การใช้หน่วยความจำสมเหตุสมผลหรือไม่?

4. **ความปลอดภัย**
   - การตรวจสอบอินพุต?
   - SQL การป้องกันการฉีด?
   - การรับรองความถูกต้อง/การอนุญาต?

### การตอบสนองต่อข้อเสนอแนะ
```bash
# Address feedback
# Edit files based on review comments

# Commit changes
git commit -m "Address code review feedback

- Add additional error handling
- Improve test coverage for edge cases
- Update documentation"

# Push changes
git push origin bugfix/123-fix-database-connection
```
## ปัญหาและแนวทางแก้ไขทั่วไป PR

### ฉบับที่ 1: PR ใหญ่เกินไป

**ปัญหา:** ผู้ตรวจสอบไม่สามารถตรวจสอบ PR จำนวนมากได้อย่างมีประสิทธิภาพ

**วิธีแก้ปัญหา:** แบ่งเป็น PR ขนาดเล็กลง
- PR แรก: การเปลี่ยนแปลงหลัก
- PR ที่สอง: การทดสอบ
- PR ที่สาม: เอกสารประกอบ

### ฉบับที่ 2: ไม่รวมการทดสอบ

**ปัญหา:** ผู้ตรวจสอบไม่สามารถยืนยันการทำงานได้

**วิธีแก้ไข:** เพิ่มการทดสอบที่ครอบคลุมก่อนส่ง

### ฉบับที่ 3: ข้อขัดแย้งกับหลัก

**ปัญหา:** สาขาของคุณไม่ซิงค์กับสาขาหลัก

**วิธีแก้ไข:** Rebase บน main ล่าสุด
```bash
git fetch upstream
git rebase upstream/main
git push -f origin your-branch
```
## หลังจากรวมเข้าด้วยกัน

### ทำความสะอาด
```bash
# Switch to main
git checkout main

# Update main
git pull upstream main

# Delete local branch
git branch -d bugfix/123-fix-database-connection

# Delete remote branch
git push origin --delete bugfix/123-fix-database-connection
```
## สรุปแนวทางปฏิบัติที่ดีที่สุด

### สิ่งที่ควรทำ

- สร้างข้อความยืนยันเชิงอธิบาย
- จัดทำ PR ที่เน้นจุดประสงค์เดียว
- รวมการทดสอบฟังก์ชันการทำงานใหม่
- อัปเดตเอกสาร
- อ้างอิงประเด็นที่เกี่ยวข้อง
- เก็บคำอธิบาย PR ให้ชัดเจน
- ตอบกลับบทวิจารณ์ทันที

### สิ่งที่ไม่ควรทำ

- รวมการเปลี่ยนแปลงที่ไม่เกี่ยวข้อง
- รวม main เข้ากับสาขาของคุณ (ใช้ rebase)
- บังคับผลักดันหลังจากเริ่มการตรวจสอบ
- ข้ามการทดสอบ
- ส่งงานระหว่างดำเนินการ
- ละเว้นความคิดเห็นเกี่ยวกับการตรวจสอบโค้ด

## เอกสารที่เกี่ยวข้อง

- ../การมีส่วนร่วม - ภาพรวมการมีส่วนร่วม
- Code-Style - แนวทางสไตล์โค้ด
- ../../03-Module-Development/Best-Practices/Testing - การทดสอบแนวทางปฏิบัติที่ดีที่สุด
- ../Architecture-Decisions/ADR-Index - แนวปฏิบัติทางสถาปัตยกรรม

## แหล่งข้อมูล

- [เอกสาร Git](https://git-scm.com/doc)
- [ความช่วยเหลือในการขอดึง GitHub](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests)
- [ข้อผูกพันตามแบบแผน](https://www.conventionalcommits.org/)
- [XOOPS องค์กร GitHub](https://github.com/XOOPS)

---

**อัปเดตล่าสุด:** 31-01-2026
**ใช้กับ:** โครงการ XOOPS ทั้งหมด
**พื้นที่เก็บข้อมูล:** https://github.com/XOOPS/XOOPS