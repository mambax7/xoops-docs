---
title: "رهنمودهای مشارکتی"
description: "نحوه مشارکت در توسعه XOOPS CMS، استانداردهای کدنویسی و دستورالعمل های جامعه"
---
# 🤝 مشارکت در XOOPS

> به انجمن XOOPS بپیوندید و در تبدیل آن به بهترین CMS در جهان کمک کنید.

---

## 📋 بررسی اجمالی

XOOPS یک پروژه منبع باز است که در مشارکت های جامعه رشد می کند. چه در حال رفع اشکال‌ها، افزودن ویژگی‌ها، بهبود اسناد یا کمک به دیگران باشید، مشارکت شما ارزشمند است.

---

## 🗂️ محتویات بخش

### دستورالعمل
- کد رفتار
- گردش کار مشارکت
- دستورالعمل های درخواست را بکشید
- گزارش موضوع

### سبک کد
- استانداردهای کدنویسی PHP
- استانداردهای جاوا اسکریپت
- دستورالعمل های CSS
- استانداردهای قالب هوشمند

### تصمیمات معماری
- شاخص ADR
- الگوی ADR
- ADR-001: معماری مدولار
- ADR-002: Database Abstraction

---

## 🚀 شروع به کار

### 1. محیط توسعه را تنظیم کنید

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

### 2. شاخه ویژگی ایجاد کنید

```bash
# Sync with upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. تغییرات ایجاد کنید

استانداردهای کدنویسی را دنبال کنید و برای ویژگی های جدید تست بنویسید.

### 4. درخواست کشش را ارسال کنید

```bash
# Commit changes
git add .
git commit -m "Add: Brief description of changes"

# Push to your fork
git push origin feature/my-feature
```

سپس یک Pull Request در GitHub ایجاد کنید.

---

## 📝 استانداردهای کدنویسی

### استانداردهای PHP

XOOPS از استانداردهای کدگذاری PSR-1، PSR-4 و PSR-12 پیروی می کند.

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XMF\Request;
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

### قراردادهای کلیدی

| قانون | مثال |
|------|---------|
| نام کلاس ها | `PascalCase` |
| نام روش | `camelCase` |
| ثابت ها | `UPPER_SNAKE_CASE` |
| متغیرها | `$camelCase` |
| فایل ها | `ClassName.php` |
| تورفتگی | 4 فاصله |
| طول خط | حداکثر 120 کاراکتر |

### الگوهای هوشمند

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

## 🔀 Git Workflow

### نامگذاری شاخه

| نوع | الگو | مثال |
|------|---------|---------|
| ویژگی | `feature/description` | `feature/add-user-export` |
| رفع اشکال | `fix/description` | `fix/login-validation` |
| رفع فوری | `hotfix/description` | `hotfix/security-patch` |
| انتشار | `release/version` | `release/2.7.0` |

### پیام‌ها را متعهد کنید

از تعهدات مرسوم پیروی کنید:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**انواع:**
- `feat`: ویژگی جدید
- `fix`: رفع اشکال
- `docs`: مستندات
- `style`: سبک کد (قالب‌بندی)
- `refactor`: بازسازی کد
- `test`: اضافه کردن تست ها
- `chore`: تعمیر و نگهداری

**مثال:**
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

## 🧪 تست

### تست های در حال اجرا

```bash
# Run all tests
./vendor/bin/phpunit

# Run specific test suite
./vendor/bin/phpunit --testsuite unit

# Run with coverage
./vendor/bin/phpunit --coverage-html coverage/
```

### تست های نوشتاری

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

## 📋 چک لیست درخواست را بکشید

قبل از ارسال یک PR، اطمینان حاصل کنید:

- [ ] کد از استانداردهای کدگذاری XOOPS پیروی می کند
- [ ] همه آزمون ها قبول می شوند
- [ ] ویژگی های جدید دارای تست هستند
- [ ] اسناد در صورت نیاز به روز می شوند
- [ ] بدون تداخل ادغام با شاخه اصلی
- [ ] پیام های commit توصیفی هستند
- [ ] توضیحات روابط عمومی تغییرات را توضیح می دهد
- [ ] مسائل مرتبط مرتبط هستند

---

## 🏗️ سوابق تصمیم گیری معماری

ADR ها تصمیمات مهم معماری را مستند می کنند.

### الگوی ADR

```markdown
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

### ADR های فعلی

| ADR | عنوان | وضعیت |
|-----|-------|--------|
| ADR-001 | معماری مدولار | پذیرفته شده |
| ADR-002 | دسترسی به پایگاه داده شی گرا | پذیرفته شده |
| ADR-003 | موتور قالب هوشمند | پذیرفته شده |
| ADR-004 | طراحی سیستم امنیتی | پذیرفته شده |
| ADR-005 | PSR-15 Middleware (4.0.x) | پیشنهادی |

---

## 🎖️ شناخت

مشارکت کنندگان از طریق:

- **لیست مشارکت کنندگان** - فهرست شده در مخزن
- ** یادداشت های انتشار ** - اعتبار در نسخه ها
- ** تالار مشاهیر ** - مشارکت کنندگان برجسته
- ** گواهینامه ماژول ** - نشان کیفیت برای ماژول ها

---

## 🔗 مستندات مرتبط

- نقشه راه XOOPS 4.0
- مفاهیم اصلی
- توسعه ماژول

---

## 📚 منابع

- [مخزن GitHub](https://github.com/XOOPS/XoopsCore27)
- [ردیاب مشکل](https://github.com/XOOPS/XoopsCore27/issues)
- [تالارهای XOOPS](https://xoops.org/modules/newbb/)
- [انجمن Discord](https://discord.gg/xoops)

---

#xoops #مشارکت #متن_باز #جامعه #توسعه #استانداردهای کدنویسی