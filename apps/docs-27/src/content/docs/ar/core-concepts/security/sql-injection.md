---
title: "منع حقن SQL"
description: "ممارسات أمان قاعدة البيانات ومنع حقن SQL في XOOPS"
dir: rtl
lang: ar
---

حقن SQL هو أحد أخطر وأكثر الثغرات الشائعة في تطبيقات الويب. يغطي هذا الدليل كيفية حماية وحدات XOOPS الخاصة بك من هجمات حقن SQL.

## الوثائق ذات الصلة

- أفضل ممارسات الأمان - دليل الأمان الشامل
- حماية CSRF - نظام الرمز وفئة XoopsSecurity
- تطهير المدخلات - MyTextSanitizer والتحقق

## فهم حقن SQL

يحدث حقن SQL عندما يتم تضمين إدخال المستخدم مباشرة في استعلامات SQL بدون تطهير أو ترميز مناسب.

### مثال كود عرضة للهجوم

```php
// خطر - لا تستخدم
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

إذا مرر المستخدم `1 OR 1=1` كـ ID، يصبح الاستعلام:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

هذا يُرجع جميع السجلات بدلاً من واحدة فقط.

## استخدام الاستعلامات المحضرة

أفضل دفاع ضد حقن SQL هو استخدام الاستعلامات المحضرة (البيانات المعدة مسبقاً).

### الاستعلام المحضر الأساسي

```php
// احصل على اتصال قاعدة البيانات
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// آمن - استخدام استعلام محضر
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### معاملات متعددة

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

## استخدام XoopsObject و XoopsObjectHandler

يوفر XOOPS وصول قاعدة بيانات موجه للكائنات يساعد على منع حقن SQL من خلال نظام Criteria.

### استخدام Criteria الأساسي

```php
// احصل على المعالج
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// إنشاء معايير
$criteria = new Criteria('category_id', (int)$categoryId);

// الحصول على الكائنات - آمن تلقائياً من حقن SQL
$items = $itemHandler->getObjects($criteria);
```

### CriteriaCompo لشروط متعددة

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// اختياري: إضافة ترتيب وحدود
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

## أفضل الممارسات الملخص

1. **استخدم دائماً الاستعلامات المحضرة** (البيانات المعدة مسبقاً)
2. **استخدم XoopsObject/XoopsObjectHandler** عند الإمكان
3. **استخدم فئات Criteria** لبناء الاستعلامات
4. **قائمة بيضاء القيم المسموح بها** للأعمدة وأسماء الجداول
5. **صب القيم الرقمية** بشكل صريح مع `(int)` أو `(float)`
6. **لا تكشف أخطاء قاعدة البيانات** للمستخدمين
7. **استخدم المعاملات** للاستعلامات المرتبطة المتعددة
8. **اختبر حقن SQL** أثناء التطوير
9. **تجنب أحرف LIKE البدليلة** في استعلامات البحث
10. **طهر قيم جملة IN** بشكل فردي

---

#أمان #حقن-sql #قاعدة-بيانات #xoops #البيانات-المعدة-مسبقاً #Criteria
