---
title: "توسيع Publisher"
description: "دليل المطور لتوسيع وتخصيص وحدة Publisher"
dir: rtl
lang: ar
---

> دليل مطور لتخصيص وتوسيع وحدة Publisher.

---

## نظرة عامة على المعمارية

```mermaid
classDiagram
    class Item {
        +int itemid
        +int categoryid
        +string title
        +string body
        +int status
        +getVar()
        +setVar()
        +toArray()
    }

    class Category {
        +int categoryid
        +int parentid
        +string name
        +getVar()
        +setVar()
    }

    class ItemHandler {
        +create()
        +get()
        +insert()
        +delete()
        +getObjects()
        +getPublishedItems()
    }

    class CategoryHandler {
        +create()
        +get()
        +insert()
        +getTree()
        +getChildren()
    }

    class Helper {
        +getInstance()
        +getHandler()
        +getConfig()
        +getModule()
    }

    Item --> ItemHandler : تُدار من قبل
    Category --> CategoryHandler : تُدار من قبل
    ItemHandler --> Helper : يستخدم
    CategoryHandler --> Helper : يستخدم
```

---

## البدء

### الوصول إلى Helper

```php
<?php
// الحصول على مثيل مساعد Publisher
$helper = \XoopsModules\Publisher\Helper::getInstance();

// الحصول على معالجات
$itemHandler = $helper->getHandler('Item');
$categoryHandler = $helper->getHandler('Category');

// الحصول على قيم التكوين
$itemsPerPage = $helper->getConfig('items_perpage');
$allowRatings = $helper->getConfig('perm_rating');
```

### العمل مع العناصر

```php
<?php
use XoopsModules\Publisher\Helper;

$helper = Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

// إنشاء عنصر جديد
$item = $itemHandler->create();
$item->setVar('title', 'مقالتي');
$item->setVar('categoryid', 1);
$item->setVar('body', 'محتوى المقالة...');
$item->setVar('summary', 'ملخص قصير');
$item->setVar('uid', $xoopsUser->getVar('uid'));
$item->setVar('datesub', time());
$item->setVar('status', Constants::PUBLISHER_STATUS_PUBLISHED);

if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}

// الحصول على العناصر المنشورة
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->setSort('datesub');
$criteria->setOrder('DESC');
$criteria->setLimit(10);

$items = $itemHandler->getObjects($criteria);

foreach ($items as $item) {
    echo $item->getVar('title') . "\n";
}
```

### العمل مع الفئات

```php
<?php
$categoryHandler = $helper->getHandler('Category');

// الحصول على فئة
$category = $categoryHandler->get(1);
echo $category->getVar('name');

// الحصول على شجرة الفئات
$categoryTree = $categoryHandler->getTree();

// الحصول على الأطفال من الفئة
$children = $categoryHandler->getChildren(1);

// الحصول على العناصر في الفئة
$items = $itemHandler->getItemsFromCategory($categoryId, $limit, $start);
```

---

## استعلامات مخصصة

### استعلامات العناصر المتقدمة

```php
<?php
// الحصول على العناصر بمعايير متعددة
$criteria = new \CriteriaCompo();
$criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
$criteria->add(new \Criteria('categoryid', '(1, 2, 3)', 'IN'));
$criteria->add(new \Criteria('datesub', time() - (30 * 24 * 60 * 60), '>='));

// البحث في العنوان والمحتوى
$searchCriteria = new \CriteriaCompo();
$searchCriteria->add(new \Criteria('title', '%keyword%', 'LIKE'));
$searchCriteria->add(new \Criteria('body', '%keyword%', 'LIKE'), 'OR');
$criteria->add($searchCriteria);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### استعلامات SQL مخصصة

```php
<?php
$db = \XoopsDatabaseFactory::getDatabaseConnection();

$sql = sprintf(
    "SELECT i.*, c.name as category_name
     FROM %s i
     LEFT JOIN %s c ON i.categoryid = c.categoryid
     WHERE i.status = %d
     ORDER BY i.datesub DESC
     LIMIT %d",
    $db->prefix('publisher_items'),
    $db->prefix('publisher_categories'),
    Constants::PUBLISHER_STATUS_PUBLISHED,
    10
);

$result = $db->query($sql);
while ($row = $db->fetchArray($result)) {
    // معالجة الصف
}
```

---

## الخطافات والأحداث

### الأحمال المسبقة

إنشاء `preloads/core.php`:

```php
<?php

namespace XoopsModules\Publisher\Preloads;

use XoopsPreloadItem;

class Core extends XoopsPreloadItem
{
    /**
     * يُستدعى عند إنشاء عنصر
     */
    public static function eventPublisherItemCreated($args)
    {
        $item = $args['item'];

        // إرسال إشعار
        self::notifyNewItem($item);

        // تسجيل النشاط
        self::logActivity('item_created', $item->getVar('itemid'));
    }

    /**
     * يُستدعى عند تحديث عنصر
     */
    public static function eventPublisherItemUpdated($args)
    {
        $item = $args['item'];
        // منطق مخصص هنا
    }

    /**
     * يُستدعى عند عرض عنصر
     */
    public static function eventPublisherItemViewed($args)
    {
        $item = $args['item'];
        // تتبع التحليلات، تحديث عدد المشاهدات، إلخ.
    }

    private static function notifyNewItem($item)
    {
        // منطق الإخطار
    }

    private static function logActivity($action, $itemId)
    {
        // منطق التسجيل
    }
}
```

---

## القوالب المخصصة

### تجاوز القالب

إنشاء قوالس مخصصة في المظهر الخاص بك:

```
themes/mytheme/modules/publisher/
├── publisher_index.tpl
├── publisher_item.tpl
├── publisher_category.tpl
└── blocks/
    └── publisher_block_recent.tpl
```

### متغيرات القالب

```smarty
{* متاحة في item.tpl *}
<article class="publisher-item">
    <h1><{$item.title}></h1>

    <div class="meta">
        <span class="author">بقلم <{$item.author}></span>
        <span class="date"><{$item.datesub}></span>
        <span class="category">
            <a href="<{$item.categorylink}>"><{$item.categoryname}></a>
        </span>
    </div>

    <{if $item.image}>
        <img src="<{$item.image}>" alt="<{$item.title}>">
    <{/if}>

    <div class="summary">
        <{$item.summary}>
    </div>

    <div class="body">
        <{$item.body}>
    </div>

    <{if $item.files}>
        <div class="attachments">
            <h3>المرفقات</h3>
            <ul>
            <{foreach item=file from=$item.files}>
                <li><a href="<{$file.url}>"><{$file.name}></a></li>
            <{/foreach}>
            </ul>
        </div>
    <{/if}>

    <{if $item.canRate}>
        <div class="rating">
            <{include file="db:publisher_rating.tpl"}>
        </div>
    <{/if}>

    <{if $item.canComment}>
        <div class="comments">
            <{$item.comments}>
        </div>
    <{/if}>
</article>
```

---

## كتل مخصصة

### إنشاء كتلة مخصصة

```php
<?php
// blocks/custom_block.php

function publisher_block_custom_show($options)
{
    $helper = \XoopsModules\Publisher\Helper::getInstance();
    $itemHandler = $helper->getHandler('Item');

    $criteria = new \CriteriaCompo();
    $criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
    $criteria->setSort($options[1] ?? 'datesub');
    $criteria->setOrder('DESC');
    $criteria->setLimit($options[0] ?? 5);

    $items = $itemHandler->getObjects($criteria);

    $block = [];
    foreach ($items as $item) {
        $block['items'][] = $item->toArray();
    }

    return $block;
}

function publisher_block_custom_edit($options)
{
    $form = '';
    $form .= 'عدد العناصر: <input type="text" name="options[0]" value="' . ($options[0] ?? 5) . '">';
    $form .= '<br>الترتيب حسب: <select name="options[1]">';
    $form .= '<option value="datesub"' . (($options[1] ?? '') === 'datesub' ? ' selected' : '') . '>التاريخ</option>';
    $form .= '<option value="counter"' . (($options[1] ?? '') === 'counter' ? ' selected' : '') . '>المشاهدات</option>';
    $form .= '<option value="rating"' . (($options[1] ?? '') === 'rating' ? ' selected' : '') . '>التقييم</option>';
    $form .= '</select>';

    return $form;
}
```

### تسجيل الكتلة في xoops_version.php

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/custom_block.php',
    'name'        => _MI_PUBLISHER_BLOCK_CUSTOM,
    'description' => _MI_PUBLISHER_BLOCK_CUSTOM_DESC,
    'show_func'   => 'publisher_block_custom_show',
    'edit_func'   => 'publisher_block_custom_edit',
    'options'     => '5|datesub',
    'template'    => 'publisher_block_custom.tpl',
];
```

---

## دمج API

### نقطة نهاية REST API

```php
<?php
// api/items.php

require_once dirname(dirname(dirname(__DIR__))) . '/mainfile.php';

header('Content-Type: application/json');

$helper = \XoopsModules\Publisher\Helper::getInstance();
$itemHandler = $helper->getHandler('Item');

$action = $_GET['action'] ?? 'list';
$response = ['success' => false];

try {
    switch ($action) {
        case 'list':
            $limit = min((int)($_GET['limit'] ?? 10), 50);
            $start = (int)($_GET['start'] ?? 0);

            $criteria = new \CriteriaCompo();
            $criteria->add(new \Criteria('status', Constants::PUBLISHER_STATUS_PUBLISHED));
            $criteria->setLimit($limit);
            $criteria->setStart($start);

            $items = $itemHandler->getObjects($criteria);
            $response = [
                'success' => true,
                'data' => array_map(fn($item) => $item->toArray(), $items),
                'total' => $itemHandler->getCount($criteria)
            ];
            break;

        case 'get':
            $id = (int)($_GET['id'] ?? 0);
            $item = $itemHandler->get($id);

            if ($item && $item->getVar('status') == Constants::PUBLISHER_STATUS_PUBLISHED) {
                $response = [
                    'success' => true,
                    'data' => $item->toArray()
                ];
            } else {
                http_response_code(404);
                $response = ['success' => false, 'error' => 'لم يتم العثور على العنصر'];
            }
            break;
    }
} catch (\Exception $e) {
    http_response_code(500);
    $response = ['success' => false, 'error' => $e->getMessage()];
}

echo json_encode($response);
```

---

## معمارية المكون الإضافي

```mermaid
graph TB
    subgraph "قلب Publisher"
        A[معالج العناصر]
        B[معالج الفئات]
        C[نظام الأحداث]
    end

    subgraph "المكونات الإضافية"
        D[مكون SEO]
        E[مكون وسائط اجتماعية]
        F[مكون التحليلات]
        G[مكون مخصص]
    end

    C --> D
    C --> E
    C --> F
    C --> G

    A --> C
    B --> C
```

---

## الوثائق ذات الصلة

- دليل المستخدم - البدء
- نمط MVC
- واجهة XoopsObject

---

#xoops #publisher #developer #extending #api
