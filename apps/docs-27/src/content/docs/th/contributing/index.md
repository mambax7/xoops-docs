---
title: "แนวทางการมีส่วนร่วม"
description: "วิธีมีส่วนร่วมในการพัฒนา XOOPS CMS มาตรฐานการเขียนโค้ด และหลักเกณฑ์ของชุมชน"
---
# 🤝 มีส่วนร่วมใน XOOPS

> เข้าร่วมชุมชน XOOPS และช่วยทำให้ชุมชน CMS ดีที่สุดในโลก

---

## 📋 ภาพรวม

XOOPS เป็นโครงการโอเพ่นซอร์สที่ประสบความสำเร็จจากการมีส่วนร่วมของชุมชน ไม่ว่าคุณจะแก้ไขข้อบกพร่อง เพิ่มฟีเจอร์ ปรับปรุงเอกสาร หรือช่วยเหลือผู้อื่น การมีส่วนร่วมของคุณก็มีคุณค่า

---

## 🗂️เนื้อหาส่วน

### แนวทาง
- หลักจรรยาบรรณ
- ขั้นตอนการทำงานสมทบ
- แนวทางการขอดึง
- การรายงานปัญหา

### รูปแบบโค้ด
- PHP มาตรฐานการเข้ารหัส
- มาตรฐานJavaScript
- CSS หลักเกณฑ์
- มาตรฐานเทมเพลต Smarty

### การตัดสินใจทางสถาปัตยกรรม
- ADR ดัชนี
- ADR เทมเพลต
- ADR-001: สถาปัตยกรรมแบบโมดูลาร์
- ADR-002: ฐานข้อมูลนามธรรม

---

## 🚀 เริ่มต้นใช้งาน

### 1. ตั้งค่าสภาพแวดล้อมการพัฒนา
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# Add upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# Install dependencies
composer install
```
### 2. สร้างสาขาฟีเจอร์
```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```
### 3. ทำการเปลี่ยนแปลง

ปฏิบัติตามมาตรฐานการเขียนโค้ดและเขียนการทดสอบฟีเจอร์ใหม่ๆ

### 4. ส่งคำขอดึง
```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```
จากนั้นสร้าง Pull Request บน GitHub

---

## 📝 มาตรฐานการเข้ารหัส

### PHP มาตรฐาน

XOOPS เป็นไปตามมาตรฐานการเข้ารหัส PSR-1, PSR-4 และ PSR¤-12
```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use Xmf\Request;
use XoopsObject;

/**
 * Class Item
 *
 * Represents an item in the module
 */
class Item extends XoopsObject
{
    /**
     * Constructor
     */
    public function __construct()
    {
        $this->initVar('id', \XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', \XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', \XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('created', \XOBJ_DTYPE_INT, time(), false);
    }

    /**
     * Get formatted title
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->getVar('title', 'e');
    }
}
```
### อนุสัญญาสำคัญ

| กฎ | ตัวอย่าง |
|------|---------|
| ชื่อคลาส | `PascalCase` |
| ชื่อวิธีการ | `camelCase` |
| ค่าคงที่ | `UPPER_SNAKE_CASE` |
| ตัวแปร | `$camelCase` |
| ไฟล์ | `ClassName.php` |
| การเยื้อง | 4 ช่อง |
| ความยาวบรรทัด | สูงสุด 120 ตัวอักษร |

### เทมเพลตอันชาญฉลาด
```smarty
{* File: templates/mymodule_index.tpl *}
{* Description: Index page template *}

<{include file="db:mymodule_header.tpl"}>

<div class="mymodule-container">
    <h1><{$page_title}></h1>

    <{if $items|@count > 0}>
        <ul class="item-list">
            <{foreach item=item from=$items}>
                <li class="item">
                    <a href="<{$item.url}>"><{$item.title}></a>
                </li>
            <{/foreach}>
        </ul>
    <{else}>
        <p class="no-items"><{$smarty.const._MD_MYMODULE_NO_ITEMS}></p>
    <{/if}>
</div>

<{include file="db:mymodule_footer.tpl"}>
```
---

## 🔀 Git เวิร์กโฟลว์

### การตั้งชื่อสาขา

| พิมพ์ | รูปแบบ | ตัวอย่าง |
|------|---------|---------|
| คุณสมบัติ | `feature/description` | `feature/add-user-export` |
| แก้ไขข้อผิดพลาด | `fix/description` | `fix/login-validation` |
| โปรแกรมแก้ไขด่วน | `hotfix/description` | `hotfix/security-patch` |
| ปล่อย | `release/version` | `release/2.7.0` |

### ส่งข้อความ

ปฏิบัติตามข้อผูกพันทั่วไป:
```
<type>(<scope>): <subject>

<body>

<footer>
```
**ประเภท:**
- `feat`: คุณลักษณะใหม่
- `fix`: แก้ไขข้อบกพร่อง
- `docs`: เอกสารประกอบ
- `style`: รูปแบบโค้ด (การจัดรูปแบบ)
- `refactor`: การปรับโครงสร้างโค้ดใหม่
- `test`: การเพิ่มการทดสอบ
- `chore`: การบำรุงรักษา

**ตัวอย่าง:**
```
feat(auth): add two-factor authentication

Implement TOTP-based 2FA for user accounts.
- Add QR code generation for authenticator apps
- Store encrypted secrets in user profile
- Add backup codes feature

Closes #123
```

```
fix(forms): resolve XSS vulnerability in text input

Properly escape user input in XoopsFormText render method.

Security: CVE-2024-XXXX
```
---

## 🧪 ทดสอบ

### การทดสอบการทำงาน
```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```
### การทดสอบการเขียน
```php
<?php

namespace XoopsModulesTest\MyModule;

use PHPUnit\Framework\TestCase;
use XoopsModules\MyModule\Item;

class ItemTest extends TestCase
{
    private Item $item;

    protected function setUp(): void
    {
        $this->item = new Item();
    }

    public function testInitialValues(): void
    {
        $this->assertNull($this->item->getVar('id'));
        $this->assertEquals('', $this->item->getVar('title'));
    }

    public function testSetTitle(): void
    {
        $this->item->setVar('title', 'Test Title');
        $this->assertEquals('Test Title', $this->item->getVar('title'));
    }

    public function testTitleEscaping(): void
    {
        $this->item->setVar('title', '<script>alert("xss")</script>');
        $escaped = $this->item->getTitle();
        $this->assertStringNotContainsString('<script>', $escaped);
    }
}
```
---

## 📋 ดึงรายการตรวจสอบคำขอ

ก่อนที่จะส่ง PR ตรวจสอบให้แน่ใจว่า:

- [ ] รหัสเป็นไปตามมาตรฐานการเข้ารหัส XOOPS
- [ ] ผ่านการทดสอบทั้งหมด
- [ ] คุณสมบัติใหม่มีการทดสอบ
- [ ] เอกสารได้รับการอัปเดตหากจำเป็น
- [ ] ไม่มีข้อขัดแย้งในการผสานกับสาขาหลัก
- [ ] ข้อความยืนยันเป็นแบบอธิบาย
- [ ] PR คำอธิบายอธิบายการเปลี่ยนแปลง
- [ ] มีการเชื่อมโยงประเด็นที่เกี่ยวข้องแล้ว

---

## 🏗️ บันทึกการตัดสินใจทางสถาปัตยกรรม

ADR บันทึกการตัดสินใจทางสถาปัตยกรรมที่สำคัญ

### ADR เทมเพลต
```
markdown
# ADR-XXX: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue we're addressing?

## Decision
What is the change being proposed?

## Consequences
What are the positive and negative effects?

## Alternatives Considered
What other options were evaluated?
```
### ADR ปัจจุบัน

| ADR | ชื่อเรื่อง | สถานะ |
|-----|-------|--------|
| ADR-001 | สถาปัตยกรรมแบบแยกส่วน | ยอมรับแล้ว |
| ADR-002 | การเข้าถึงฐานข้อมูลเชิงวัตถุ | ยอมรับแล้ว |
| ADR-003 | เครื่องมือเทมเพลต Smarty | ยอมรับแล้ว |
| ADR-004 | การออกแบบระบบรักษาความปลอดภัย | ยอมรับแล้ว |
| ADR-005 | PSR-15 มิดเดิลแวร์ (4.0.x) | เสนอ |

---

## 🎖️ การรับรู้

ผู้ร่วมให้ข้อมูลได้รับการยอมรับผ่าน:

- **รายชื่อผู้ร่วมให้ข้อมูล** - มีรายชื่ออยู่ในพื้นที่เก็บข้อมูล
- **หมายเหตุการเผยแพร่** - ให้เครดิตในการเผยแพร่
- **หอเกียรติยศ** - ผู้มีส่วนร่วมที่โดดเด่น
- **การรับรองโมดูล** - ป้ายคุณภาพสำหรับโมดูล

---

## 🔗 เอกสารที่เกี่ยวข้อง

- XOOPS 4.0 แผนการทำงาน
- แนวคิดหลัก
- การพัฒนาโมดูล

---

## 📚 แหล่งข้อมูล

- [พื้นที่เก็บข้อมูล GitHub](https://github.com/XOOPS/XoopsCore27)
- [ตัวติดตามปัญหา](https://github.com/XOOPS/XoopsCore27/issues)
- [XOOPS ฟอรั่ม](https://xoops.org/modules/newbb/)
- [ชุมชนที่ไม่ลงรอยกัน](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-มาตรฐาน