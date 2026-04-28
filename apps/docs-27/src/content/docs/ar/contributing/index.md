---
title: "إرشادات المساهمة"
description: "كيفية المساهمة في تطوير نظام إدارة المحتوى XOOPS ومعايير الترميز والإرشادات المجتمعية"
dir: rtl
lang: ar
---

# 🤝 المساهمة في XOOPS

> انضم إلى مجتمع XOOPS وساعد في جعله أفضل نظام إدارة محتوى في العالم.

---

## 📋 نظرة عامة

XOOPS مشروع مفتوح المصدر يزدهر من خلال مساهمات المجتمع. سواء كنت تصلح الأخطاء أو تضيف ميزات أو تحسن التوثيق أو تساعد الآخرين، فإن مساهماتك قيمة.

---

## 🗂️ محتويات القسم

### الإرشادات
- قواعس السلوك
- سير عمل المساهمة
- إرشادات طلب السحب
- الإبلاغ عن المشاكل

### نمط الأكواد
- معايير ترميز PHP
- معايير JavaScript
- إرشادات CSS
- معايير قوالب Smarty

### قرارات العمارة
- فهرس ADR
- قالب ADR
- ADR-001: العمارة المعيارية
- ADR-002: تجريد قاعدة البيانات

---

## 🚀 البدء السريع

### 1. إعداد بيئة التطوير

```bash
# انسخ المستودع على GitHub
# ثم استنسخ نسختك
git clone https://github.com/YOUR_USERNAME/XoopsCore27.git
cd XoopsCore27

# أضف upstream remote
git remote add upstream https://github.com/XOOPS/XoopsCore27.git

# تثبيت الاعتماديات
composer install
```

### 2. إنشاء فرع الميزة

```bash
# قم بالمزامنة مع upstream
git fetch upstream
git checkout -b feature/my-feature upstream/main
```

### 3. قم بإجراء التغييرات

اتبع معايير الترميز واكتب اختبارات للميزات الجديدة.

### 4. قدم طلب السحب

```bash
# احفظ التغييرات
git add .
git commit -m "Add: Brief description of changes"

# ادفع إلى نسختك
git push origin feature/my-feature
```

ثم أنشئ طلب سحب على GitHub.

---

## 📝 معايير الترميز

### معايير PHP

يتبع XOOPS معايير PSR-1 و PSR-4 و PSR-12.

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

### الاتفاقيات الرئيسية

| القاعدة | المثال |
|------|---------|
| أسماء الفئات | `PascalCase` |
| أسماء الطرق | `camelCase` |
| الثوابت | `UPPER_SNAKE_CASE` |
| المتغيرات | `$camelCase` |
| الملفات | `ClassName.php` |
| المحاذاة | 4 مسافات |
| طول السطر | 120 حرف كحد أقصى |

### قوالب Smarty

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

## 🔀 سير عمل Git

### تسمية الفروع

| النوع | النمط | المثال |
|------|---------|---------|
| الميزة | `feature/description` | `feature/add-user-export` |
| إصلاح | `fix/description` | `fix/login-validation` |
| إصلاح طارئ | `hotfix/description` | `hotfix/security-patch` |
| الإصدار | `release/version` | `release/2.7.0` |

### رسائل الالتزام

اتبع conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**الأنواع:**
- `feat`: ميزة جديدة
- `fix`: إصلاح الخطأ
- `docs`: التوثيق
- `style`: نمط الأكواد (التنسيق)
- `refactor`: إعادة هيكلة الأكواد
- `test`: إضافة الاختبارات
- `chore`: الصيانة

**أمثلة:**
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

## 🧪 الاختبار

### تشغيل الاختبارات

```bash
# قم بتشغيل جميع الاختبارات
./vendor/bin/phpunit

# قم بتشغيل مجموعة اختبارات محددة
./vendor/bin/phpunit --testsuite unit

# قم بالتشغيل مع التغطية
./vendor/bin/phpunit --coverage-html coverage/
```

### كتابة الاختبارات

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

## 📋 قائمة فحص طلب السحب

قبل تقديم طلب السحب، تأكد من:

- [ ] يتبع الأكواس معايير XOOPS
- [ ] تمر جميع الاختبارات
- [ ] الميزات الجديدة لديها اختبارات
- [ ] تم تحديث التوثيق إذا لزم الأمر
- [ ] لا توجد تضاربات دمج مع الفرع الرئيسي
- [ ] رسائل الالتزام وصفية
- [ ] وصف PR يشرح التغييرات
- [ ] تم ربط المشاكل ذات الصلة

---

## 🏗️ سجلات قرارات العمارة

ADRs توثق قرارات العمارة المهمة.

### قالب ADR

```markdown
# ADR-XXX: العنوان

## الحالة
مقترح | مقبول | منتهي الصلاحية | تم استبداله

## السياق
ما هي المشكلة التي نعالجها؟

## القرار
ما هو التغيير المقترح؟

## العواقب
ما هي التأثيرات الإيجابية والسلبية؟

## البدائل المدروسة
ما هي الخيارات الأخرى التي تم تقييمها؟
```

### ADRs الحالية

| ADR | العنوان | الحالة |
|-----|-------|--------|
| ADR-001 | العمارة المعيارية | مقبول |
| ADR-002 | الوصول الموجه للكائنات | مقبول |
| ADR-003 | محرك قالب Smarty | مقبول |
| ADR-004 | تصميم نظام الأمان | مقبول |
| ADR-005 | وسيط PSR-15 (4.0.x) | مقترح |

---

## 🎖️ الاعتراف

يتم الاعتراف بالمساهمين من خلال:

- **قائمة المساهمين** - مدرجة في المستودع
- **ملاحظات الإصدار** - معترف به في الإصدارات
- **قاعة الشهرة** - المساهمون البارزون
- **شهادة الوحدة** - شارة الجودة للوحدات

---

## 🔗 التوثيق ذات الصلة

- خارطة طريق XOOPS 4.0
- المفاهيم الأساسية
- تطوير الوحدات

---

## 📚 الموارد

- [مستودع GitHub](https://github.com/XOOPS/XoopsCore27)
- [متتبع المشاكل](https://github.com/XOOPS/XoopsCore27/issues)
- [منتديات XOOPS](https://xoops.org/modules/newbb/)
- [مجتمع Discord](https://discord.gg/xoops)

---

#xoops #contributing #open-source #community #development #coding-standards
