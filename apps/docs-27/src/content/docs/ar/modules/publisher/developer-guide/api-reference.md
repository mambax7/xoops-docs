---
title: "مرجع API لـ Publisher"
description: "مرجع API كامل لوحدة Publisher مع الفئات والطرق وأمثلة الأكواد"
dir: rtl
lang: ar
---

# مرجع API لـ Publisher

> مرجع شامل لفئات وحدة Publisher والطرق والدوال ونقاط نهاية API.

---

## هيكل الوحدة

### تنظيم الفئات

```
فئات وحدة Publisher:

├── Item / ItemHandler
│   ├── الحصول على المقالات
│   ├── إنشاء مقالات
│   ├── تحديث مقالات
│   └── حذف مقالات
│
├── Category / CategoryHandler
│   ├── الحصول على الفئات
│   ├── إنشاء فئات
│   ├── تحديث فئات
│   └── حذف فئات
│
├── Comment / CommentHandler
│   ├── الحصول على التعليقات
│   ├── إنشاء تعليقات
│   ├── الإشراف على التعليقات
│   └── حذف التعليقات
│
└── Helper
    ├── دوال المنفعة
    ├── دوال التنسيق
    └── فحوصات الصلاحيات
```

---

## فئة Item

### نظرة عامة

تمثل فئة `Item` مقالة واحدة/عنصر واحد في Publisher.

**المساحة الموزونة:** `XoopsModules\Publisher\`

**الملف:** `modules/publisher/class/Item.php`

### المُنشئ (Constructor)

```php
// إنشاء عنصر جديد
$item = new Item();

// الحصول على عنصر موجود
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);
```

### الخصائص والطرق

#### الحصول على الخصائص

```php
// الحصول على معرف المقالة
$itemId = $item->getVar('itemid');
$itemId = $item->id();

// الحصول على العنوان
$title = $item->getVar('title');
$title = $item->title();

// الحصول على الوصف
$description = $item->getVar('description');
$description = $item->description();

// الحصول على المحتوى الأساسي
$body = $item->getVar('body');
$body = $item->body();

// الحصول على العنوان الفرعي
$subtitle = $item->getVar('subtitle');
$subtitle = $item->subtitle();

// الحصول على المؤلف
$authorId = $item->getVar('uid');
$authorId = $item->authorId();

// الحصول على اسم المؤلف
$authorName = $item->getVar('uname');
$authorName = $item->uname();

// الحصول على الفئة
$categoryId = $item->getVar('categoryid');
$categoryId = $item->categoryId();

// الحصول على الحالة
$status = $item->getVar('status');
$status = $item->status();

// الحصول على تاريخ النشر
$date = $item->getVar('datesub');
$date = $item->date();

// الحصول على تاريخ التعديل
$modified = $item->getVar('datemod');
$modified = $item->modified();

// الحصول على عدد المشاهدات
$views = $item->getVar('counter');
$views = $item->views();

// الحصول على الصورة
$image = $item->getVar('image');
$image = $item->image();

// الحصول على حالة المميزة
$featured = $item->getVar('featured');
```

#### تعيين الخصائص

```php
// تعيين العنوان
$item->setVar('title', 'عنوان مقالة جديد');

// تعيين المحتوى الأساسي
$item->setVar('body', '<p>محتوى المقالة هنا</p>');

// تعيين الوصف
$item->setVar('description', 'وصف قصير');

// تعيين الفئة
$item->setVar('categoryid', 5);

// تعيين الحالة (0=مسودة، 1=منشور، إلخ)
$item->setVar('status', 1);

// تعيين المميزة
$item->setVar('featured', 1);

// تعيين الصورة
$item->setVar('image', 'path/to/image.jpg');
```

#### الطرق

```php
// الحصول على التاريخ المنسق
$formatted = $item->date('Y-m-d H:i:s');
$formatted = $item->date('l, F j, Y');

// الحصول على رابط العنصر
$url = $item->url();

// الحصول على رابط الفئة
$catUrl = $item->categoryUrl();

// التحقق من النشر
$isPublished = $item->isPublished();

// الحصول على رابط التحرير
$editUrl = $item->editUrl();

// الحصول على رابط الحذف
$deleteUrl = $item->deleteUrl();

// الحصول على الملخص
$summary = $item->getSummary(100);
$summary = $item->description();

// الحصول على جميع الوسوم
$tags = $item->getTags();

// الحصول على التعليقات
$comments = $item->getComments();
$commentCount = $item->getCommentCount();

// الحصول على التقييم
$rating = $item->getRating();

// الحصول على عدد التقييمات
$ratingCount = $item->getRatingCount();
```

---

## فئة ItemHandler

### نظرة عامة

تدير فئة `ItemHandler` عمليات CRUD للمقالات.

**الملف:** `modules/publisher/class/ItemHandler.php`

### استرجاع العناصر

```php
// الحصول على عنصر واحد حسب المعرف
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

// الحصول على جميع العناصر
$items = $itemHandler->getAll();

// الحصول على العناصر بشروط
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));  // منشور فقط
$criteria->add(new Criteria('categoryid', 5)); // فئة محددة
$criteria->setLimit(10);
$criteria->setStart(0);
$items = $itemHandler->getObjects($criteria);

// الحصول على العناصر حسب الفئة
$items = $itemHandler->getByCategory($categoryId, $limit = 10);

// الحصول على العناصر الحديثة
$items = $itemHandler->getRecent($limit = 10);

// الحصول على العناصر المميزة
$items = $itemHandler->getFeatured($limit = 5);

// حساب العناصر
$total = $itemHandler->getCount($criteria);
```

### إنشاء عنصر

```php
// إنشاء عنصر جديد
$item = $itemHandler->create();

// تعيين الخصائص
$item->setVar('title', 'عنوان المقالة');
$item->setVar('body', '<p>المحتوى</p>');
$item->setVar('description', 'وصف قصير');
$item->setVar('categoryid', 1);
$item->setVar('uid', $userId);
$item->setVar('status', 0); // مسودة
$item->setVar('datesub', time());

// الحفظ
if ($itemHandler->insert($item)) {
    $itemId = $item->getVar('itemid');
    echo "تم إنشاء المقالة: " . $itemId;
} else {
    echo "خطأ: " . implode(', ', $item->getErrors());
}
```

### تحديث عنصر

```php
// الحصول على عنصر
$item = $itemHandler->get($itemId);

// التعديل
$item->setVar('title', 'عنوان محدث');
$item->setVar('body', '<p>محتوى محدث</p>');
$item->setVar('status', 1); // نشر

// الحفظ
if ($itemHandler->insert($item)) {
    echo "تم تحديث العنصر";
} else {
    echo "خطأ: " . implode(', ', $item->getErrors());
}
```

### حذف عنصر

```php
// الحصول على عنصر
$item = $itemHandler->get($itemId);

// الحذف
if ($itemHandler->delete($item)) {
    echo "تم حذف العنصر";
} else {
    echo "خطأ في حذف العنصر";
}

// الحذف حسب المعرف الأساسي
$itemHandler->deleteByPrimary($itemId);
```

---

## فئة Category

### نظرة عامة

تمثل فئة `Category` فئة أو قسم.

**الملف:** `modules/publisher/class/Category.php`

### الطرق

```php
// الحصول على معرف الفئة
$catId = $category->getVar('categoryid');
$catId = $category->id();

// الحصول على الاسم
$name = $category->getVar('name');
$name = $category->name();

// الحصول على الوصف
$desc = $category->getVar('description');
$desc = $category->description();

// الحصول على الصورة
$image = $category->getVar('image');
$image = $category->image();

// الحصول على الفئة الأب
$parentId = $category->getVar('parentid');
$parentId = $category->parentId();

// الحصول على الحالة
$status = $category->getVar('status');

// الحصول على الرابط
$url = $category->url();

// الحصول على عدد العناصر
$count = $category->itemCount();

// الحصول على الفئات الفرعية
$subs = $category->getSubCategories();

// الحصول على كائن الفئة الأب
$parent = $category->getParent();
```

---

## فئة CategoryHandler

### نظرة عامة

تدير فئة `CategoryHandler` عمليات CRUD للفئات.

**الملف:** `modules/publisher/class/CategoryHandler.php`

### استرجاع الفئات

```php
// الحصول على فئة واحدة
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$category = $catHandler->get($categoryId);

// الحصول على جميع الفئات
$categories = $catHandler->getAll();

// الحصول على الفئات الجذرية (بدون أب)
$roots = $catHandler->getRoots();

// الحصول على الفئات الفرعية
$subs = $catHandler->getByParent($parentId);

// الحصول على الفئات بمعايير
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$categories = $catHandler->getObjects($criteria);
```

### إنشاء فئة

```php
// إنشاء جديد
$category = $catHandler->create();

// تعيين القيم
$category->setVar('name', 'أخبار');
$category->setVar('description', 'عناصر الأخبار');
$category->setVar('parentid', 0); // المستوى الجذري
$category->setVar('status', 1);

// الحفظ
if ($catHandler->insert($category)) {
    $catId = $category->getVar('categoryid');
} else {
    echo "خطأ";
}
```

### تحديث فئة

```php
// الحصول على فئة
$category = $catHandler->get($categoryId);

// التعديل
$category->setVar('name', 'الاسم المحدث');

// الحفظ
$catHandler->insert($category);
```

### حذف فئة

```php
// الحصول على فئة
$category = $catHandler->get($categoryId);

// الحذف
$catHandler->delete($category);
```

---

## دوال Helper

### دوال الأداة المساعدة

توفر فئة Helper دوال مساعدة:

**الملف:** `modules/publisher/class/Helper.php`

```php
// الحصول على مثيل مساعد
$helper = \XoopsModules\Publisher\Helper::getInstance();

// الحصول على مثيل الوحدة
$module = $helper->getModule();

// الحصول على معالج
$itemHandler = $helper->getHandler('Item');
$catHandler = $helper->getHandler('Category');

// الحصول على قيمة التكوين
$editorName = $helper->getConfig('editor');
$itemsPerPage = $helper->getConfig('items_per_page');

// التحقق من الصلاحية
$canView = $helper->hasPermission('view', $categoryId);
$canEdit = $helper->hasPermission('edit', $itemId);
$canDelete = $helper->hasPermission('delete', $itemId);
$canApprove = $helper->hasPermission('approve');

// الحصول على الرابط
$indexUrl = $helper->url('index.php');
$itemUrl = $helper->url('index.php?op=showitem&itemid=' . $itemId);

// الحصول على المسار الأساسي
$basePath = $helper->getPath();
$templatePath = $helper->getPath('templates');
```

### دوال التنسيق

```php
// تنسيق التاريخ
$formatted = $helper->formatDate($timestamp, 'Y-m-d');

// اختصار النص
$excerpt = $helper->truncate($text, $length = 100);

// تنظيف الإدخال
$clean = $helper->sanitize($input);

// تحضير الإخراج
$output = $helper->prepare($data);

// الحصول على فتات الخبز
$breadcrumb = $helper->getBreadcrumb($itemId);
```

---

## واجهة API للجافا سكريبت

### دوال JavaScript الواجهة الأمامية

يتضمن Publisher واجهة API جافا سكريبت للتفاعلات الواجهة الأمامية:

```javascript
// تضمين مكتبة Publisher JS
<script src="/modules/publisher/assets/js/publisher.js"></script>

// التحقق من وجود كائن Publisher
if (typeof Publisher !== 'undefined') {
    // استخدام واجهة Publisher API
}

// الحصول على بيانات المقالة
var item = Publisher.getItem(itemId);
console.log(item.title);
console.log(item.url);

// الحصول على بيانات الفئة
var category = Publisher.getCategory(categoryId);
console.log(category.name);

// إرسال التقييم
Publisher.submitRating(itemId, rating, function(response) {
    console.log('تم حفظ التقييم');
});

// تحميل المزيد من المقالات
Publisher.loadMore(categoryId, page, limit, function(articles) {
    // معالجة المقالات المحملة
});

// البحث عن المقالات
Publisher.search(query, function(results) {
    // معالجة نتائج البحث
});
```

### نقاط نهاية Ajax

توفر Publisher نقاط نهاية AJAX للتفاعلات الواجهة الأمامية:

```javascript
// الحصول على المقالة عبر AJAX
fetch('/modules/publisher/ajax.php?op=getItem&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));

// إرسال تعليق عبر AJAX
fetch('/modules/publisher/ajax.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'op=addComment&itemid=' + itemId + '&text=' + comment
})
.then(response => response.json())
.then(data => console.log(data));

// الحصول على التقييمات
fetch('/modules/publisher/ajax.php?op=getRatings&itemid=' + itemId)
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## واجهة REST API (إذا كانت مفعلة)

### نقاط نهاية API

إذا كانت Publisher تعرض REST API:

```
GET /modules/publisher/api/items
GET /modules/publisher/api/items/{id}
GET /modules/publisher/api/categories
GET /modules/publisher/api/categories/{id}
POST /modules/publisher/api/items
PUT /modules/publisher/api/items/{id}
DELETE /modules/publisher/api/items/{id}
```

### أمثلة استدعاءات API

```php
// الحصول على العناصر عبر REST
$url = 'http://example.com/modules/publisher/api/items';
$response = file_get_contents($url);
$items = json_decode($response, true);

// الحصول على عنصر واحد
$url = 'http://example.com/modules/publisher/api/items/1';
$response = file_get_contents($url);
$item = json_decode($response, true);

// إنشاء عنصر
$url = 'http://example.com/modules/publisher/api/items';
$data = array(
    'title' => 'مقالة جديدة',
    'body' => 'المحتوى هنا',
    'categoryid' => 1
);
$options = array(
    'http' => array(
        'method' => 'POST',
        'header' => 'Content-Type: application/json',
        'content' => json_encode($data)
    )
);
$response = file_get_contents($url, false, stream_context_create($options));
```

---

## مخطط قاعدة البيانات

### الجداول

#### publisher_categories

```
- categoryid (PK)
- name
- description
- image
- parentid (FK)
- status
- created
- modified
```

#### publisher_items

```
- itemid (PK)
- categoryid (FK)
- uid (FK to users)
- title
- subtitle
- description
- body
- image
- status
- featured
- datesub
- datemod
- counter (views)
```

#### publisher_comments

```
- commentid (PK)
- itemid (FK)
- uid (FK)
- comment
- datesub
- approved
```

#### publisher_files

```
- fileid (PK)
- itemid (FK)
- filename
- description
- uploaded
```

---

## الأحداث والخطافات

### أحداث Publisher

```php
// حدث إنشاء عنصر
$modHandler = xoops_getHandler('module');
$modHandler->activateModule('publisher');
$publisher = xoops_getModuleHandler('Item', 'publisher');
xoops_events()->trigger(
    'publisher.item.created',
    array('item' => $item)
);

// تحديث العنصر
xoops_events()->trigger(
    'publisher.item.updated',
    array('item' => $item)
);

// حذف العنصر
xoops_events()->trigger(
    'publisher.item.deleted',
    array('itemid' => $itemId)
);

// المقالة معلقة
xoops_events()->trigger(
    'publisher.comment.added',
    array('comment' => $comment)
);
```

### الاستماع للأحداث

```php
// تسجيل مستمع الحدث
xoops_events()->attach(
    'publisher.item.created',
    array($myClass, 'onItemCreated')
);

// أو في المكون الإضافي
public function onItemCreated($item) {
    // معالجة إنشاء العنصر
}
```

---

## أمثلة الأكواد

### الحصول على المقالات الحديثة

```php
<?php
// الحصول على المقالات المنشورة الحديثة
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1)); // منشور
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(5);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->title() . "\n";
    echo $item->date('Y-m-d') . "\n";
    echo $item->description() . "\n";
    echo "<a href='" . $item->url() . "'>اقرأ المزيد</a>\n\n";
}
?>
```

### إنشاء مقالة برمجياً

```php
<?php
// إنشاء مقالة
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->create();

$item->setVar('title', 'مقالة برمجية');
$item->setVar('description', 'تم إنشاؤها عبر API');
$item->setVar('body', '<p>المحتوى الكامل هنا</p>');
$item->setVar('categoryid', 1);
$item->setVar('uid', 1);
$item->setVar('status', 1); // منشور
$item->setVar('datesub', time());

if ($itemHandler->insert($item)) {
    echo "تم إنشاء المقالة: " . $item->getVar('itemid');
} else {
    echo "خطأ: " . implode(', ', $item->getErrors());
}
?>
```

### الحصول على المقالات حسب الفئة

```php
<?php
// الحصول على مقالات الفئة
$catId = 5;
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$items = $itemHandler->getByCategory($catId, $limit = 10);

echo "المقالات في الفئة " . $catId . ":\n";
foreach ($items as $item) {
    echo "- " . $item->title() . "\n";
}
?>
```

### تحديث حالة المقالة

```php
<?php
// تغيير حالة المقالة
$itemHandler = xoops_getModuleHandler('Item', 'publisher');
$item = $itemHandler->get($itemId);

if ($item) {
    $item->setVar('status', 1); // نشر

    if ($itemHandler->insert($item)) {
        echo "تم نشر المقالة";
    } else {
        echo "خطأ في نشر المقالة";
    }
} else {
    echo "لم يتم العثور على المقالة";
}
?>
```

### الحصول على شجرة الفئات

```php
<?php
// بناء شجرة الفئات
$catHandler = xoops_getModuleHandler('Category', 'publisher');
$roots = $catHandler->getRoots();

function displayTree($category, $level = 0) {
    echo str_repeat("  ", $level) . $category->name() . "\n";

    $subs = $category->getSubCategories();
    foreach ($subs as $sub) {
        displayTree($sub, $level + 1);
    }
}

foreach ($roots as $root) {
    displayTree($root);
}
?>
```

---

## معالجة الأخطاء

### معالجة الأخطاء

```php
<?php
// معالجة الأخطاء try/catch
try {
    $itemHandler = xoops_getModuleHandler('Item', 'publisher');
    $item = $itemHandler->get($itemId);

    if (!$item) {
        throw new Exception('لم يتم العثور على العنصر');
    }

    $item->setVar('title', 'عنوان جديد');

    if (!$itemHandler->insert($item)) {
        throw new Exception('فشل حفظ العنصر');
    }
} catch (Exception $e) {
    error_log('خطأ Publisher: ' . $e->getMessage());
    // معالجة الخطأ
}
?>
```

### الحصول على رسائل الخطأ

```php
<?php
// الحصول على رسائل الخطأ من الكائن
$item = $itemHandler->create();
// ... تعيين المتغيرات ...

if (!$itemHandler->insert($item)) {
    $errors = $item->getErrors();
    foreach ($errors as $error) {
        echo "خطأ: " . $error . "\n";
    }
}
?>
```

---

## الوثائق ذات الصلة

- الخطافات والأحداث
- القوالب المخصصة
- تحليل وحدة Publisher
- القوالب والكتل في Publisher
- إنشاء المقالات
- إدارة الفئات

---

## الموارد

- [مستودع Publisher على GitHub](https://github.com/XoopsModules25x/publisher)
- [واجهة XOOPS API](../../04-API-Reference/API-Reference.md)
- [وثائق PHP](https://www.php.net/docs.php)

---

#publisher #api #reference #code #classes #methods #xoops
