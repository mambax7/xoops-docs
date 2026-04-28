---
title: "إرشادات طلب السحب"
description: "إرشادات تقديم طلبات السحب إلى مشاريع XOOPS"
dir: rtl
lang: ar
---

وثيقة شاملة لإرشادات تقديم طلبات السحب إلى مشاريع XOOPS. يضمن اتباع هذه الإرشادات عملية مراجعة سلسة وأوقات دمج أسرع.

## قبل إنشاء طلب سحب

### الخطوة 1: تحقق من المشاكل الموجودة

```
1. انتقل إلى مستودع GitHub
2. انتقل إلى علامة المشاكل
3. ابحث عن المشاكل الموجودة المتعلقة بتغييرك
4. فحص المشاكل المفتوحة والمغلقة
```

### الخطوة 2: انسخ المستودع

```bash
# انسخ المستودع على GitHub
# انقر على زر "Fork" في صفحة المستودع

# استنسخ النسخة المتشعبة
git clone https://github.com/YOUR_USERNAME/XOOPS.git
cd XOOPS

# أضف upstream remote
git remote add upstream https://github.com/XOOPS/XOOPS.git

# تحقق من remotes
git remote -v
```

### الخطوة 3: أنشئ فرع ميزة

```bash
# حدّث main branch
git fetch upstream
git checkout main
git merge upstream/main

# أنشئ فرع ميزة
# استخدم أسماء وصفية: bugfix/رقم-المشكلة أو feature/الوصف
git checkout -b bugfix/123-fix-database-connection
git checkout -b feature/add-psr-7-support
```

### الخطوة 4: قم بالتغييرات

```bash
# قم بالتغييرات على الملفات
# اتبع إرشادات نمط الأكواد

# رتب التغييرات
git add .

# قم بالالتزام برسالة واضحة
git commit -m "إصلاح مشكلة انقطاع اتصال قاعدة البيانات"

# قم بالالتزامات المتعددة للتغييرات المنطقية
git commit -m "أضف منطق إعادة المحاولة"
git commit -m "تحسين رسائل الخطأ للتصحيح"
```

---

## معايير رسالة الالتزام

### رسائل الالتزام الجيدة

استخدم رسائل واضحة ووصفية بعد هذه الأنماط:

```
# الصيغة
<type>: <subject>

<body>

<footer>

# مثال 1: إصلاح الخطأ
fix: حل مشكلة انقطاع اتصال قاعدة البيانات

أضف آلية إعادة محاولة الأسي لاتصال قاعدة البيانات.
الآن تعيد المحاولة حتى 3 مرات مع تأخيرات متزايدة.

Fixes #123
```

---

## متطلبات جودة الأكواد

### نمط الأكواس

اتبع إرشادات Code-Style:

```php
<?php
// جيد: نمط PSR-12
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

---

## متطلبات الاختبار

### اختبارات الوحدة

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

### تشغيل الاختبارات

```bash
# قم بتشغيل جميع الاختبارات
vendor/bin/phpunit

# قم بتشغيل ملف اختبار محدد
vendor/bin/phpunit tests/Feature/DatabaseConnectionTest.php

# قم بتشغيل مع الغطاء
vendor/bin/phpunit --coverage-html coverage/
```

---

## إنشاء طلب السحب

### صيغة عنوان PR

```
[Type] Short description (fix/feature/docs)

أمثلة:
- [FIX] حل مشكلة انقطاع اتصال قاعدة البيانات (#123)
- [FEATURE] تطبيق واجهات رسالة HTTP المتوافقة مع PSR-7
- [DOCS] تحديث مرجع API لفئة Criteria
```

## عملية مراجعة الأكواس

### ما يبحث عنه المراجعون

1. **الصحة**
   - هل يحل الأكواد المشكلة المذكورة؟
   - هل تم التعامل مع الحالات الحدية؟
   - هل معالجة الأخطاء مناسبة؟

2. **الجودة**
   - هل يتبع معايير الأكواس؟
   - هل يمكن صيانته؟
   - هل اختبر بشكل جيد؟

3. **الأداء**
   - هل يوجد تراجع في الأداء؟
   - هل الاستعلامات محسّنة؟
   - هل استخدام الذاكرة معقول؟

4. **الأمان**
   - هل التحقق من الإدخال موجود؟
   - هل الحماية من حقن SQL موجودة؟
   - هل المصادقة/التخويل صحيحة؟

---

## بعد الدمج

### التنظيف

```bash
# الانتقال إلى main
git checkout main

# تحديث main
git pull upstream main

# حذف الفرع المحلي
git branch -d bugfix/123-fix-database-connection

# حذف من fork
git push origin --delete bugfix/123-fix-database-connection
```

---

## ملخص أفضل الممارسات

### افعل

- أنشئ رسائل التزام وصفية
- اجعل طلبات السحب مركزة وأحادية الغرض
- أدرج الاختبارات للوظائف الجديدة
- حدّث التوثيق
- أرجع المشاكل ذات الصلة
- اجعل وصف PR واضحاً
- استجب بسرعة للمراجعات

### لا تفعل

- لا تدرج التغييرات غير ذات الصلة
- لا تدمج main في فرعك (استخدم rebase)
- لا تفرض الدفع بعد بدء المراجعة
- لا تتخطَّ الاختبارات
- لا تقدم أعمال قيد الإنجاز
- لا تتجاهل تعليقات مراجعة الأكواس

---

## التوثيق ذات الصلة

- المساهمة - نظرة عامة على المساهمة
- نمط الأكواس - إرشادات نمط الأكواس
- اختبار - أفضل ممارسات الاختبار
- ADR Index - إرشادات المعمارية

---

**آخر تحديث:** 2026-01-31
**ينطبق على:** جميع مشاريع XOOPS
**المستودع:** https://github.com/XOOPS/XOOPS
