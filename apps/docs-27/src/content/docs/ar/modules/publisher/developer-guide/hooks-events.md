---
title: "Publisher - الخطافات والأحداث"
description: "دليل توسيع Publisher باستخدام الخطافات والأحداث ونظام المكون الإضافي"
dir: rtl
lang: ar
---

# خطافات وأحداث Publisher

> دليل شامل لتوسيع وظائف Publisher باستخدام الأحداث والخطافات والمكونات الإضافية.

---

## نظرة عامة على نظام الأحداث

### ما هي الأحداث؟

تتيح الأحداث للوحدات الأخرى التفاعل مع إجراءات Publisher:

```
إجراء Publisher → تفعيل الحدث → استماع الوحدات الأخرى/تفاعلها

أمثلة:
  - إنشاء مقالة → إرسال بريد إخطار
  - نشر مقالة → تحديث وسائط اجتماعية
  - تعليق على مقالة → إخطار المؤلف
  - إنشاء فئة → تحديث فهرس البحث
```

### تدفق الحدث

```mermaid
graph LR
    A[إجراء في Publisher] -->|فعّل| B[تم إطلاق الحدث]
    B -->|تم إخطار المستمعين| C[وحدات أخرى تتفاعل]
    C -->|تنفيذ callbacks| D[المكونات الإضافية/الخطافات تعمل]
```

---

## الأحداث المتاحة

### أحداث العنصر (المقالة)

#### publisher.item.created

يتم تفعيله عند إنشاء مقالة جديدة.

```php
// نقطة التفعيل في Publisher
xoops_events()->trigger('publisher.item.created', array(
    'item' => $item,
    'itemid' => $item->getVar('itemid'),
    'title' => $item->getVar('title'),
    'uid' => $item->getVar('uid')
));
```

**مستمع المثال:**

```php
// الاستماع لإنشاء المقالة
xoops_events()->attach('publisher.item.created', 'onArticleCreated');

function onArticleCreated($item) {
    $itemId = $item['itemid'];
    $title = $item['title'];
    $uid = $item['uid'];

    // إرسال إخطار بريد
    sendEmailNotification($uid, "مقالة جديدة: $title");

    // تسجيل النشاط
    logActivity('Article created', $itemId);

    // تحديث فهرس البحث
    updateSearchIndex($itemId);
}
```

#### publisher.item.updated

يتم تفعيله عند تحديث مقالة.

```php
xoops_events()->trigger('publisher.item.updated', array(
    'item' => $item,
    'itemid' => $itemId,
    'changes' => $changes
));
```

#### publisher.item.deleted

يتم تفعيله عند حذف مقالة.

```php
xoops_events()->trigger('publisher.item.deleted', array(
    'itemid' => $itemId,
    'title' => $title,
    'categoryid' => $categoryId
));
```

#### publisher.item.published

يتم تفعيله عند تغيير حالة المقالة إلى منشورة.

```php
xoops_events()->trigger('publisher.item.published', array(
    'item' => $item,
    'itemid' => $itemId
));
```

#### publisher.item.approved

يتم تفعيله عند الموافقة على مقالة معلقة.

```php
xoops_events()->trigger('publisher.item.approved', array(
    'item' => $item,
    'itemid' => $itemId,
    'uid' => $uid
));
```

#### publisher.item.rejected

يتم تفعيله عند رفض مقالة.

```php
xoops_events()->trigger('publisher.item.rejected', array(
    'item' => $item,
    'itemid' => $itemId,
    'reason' => $reason
));
```

### أحداث الفئة

#### publisher.category.created

يتم تفعيله عند إنشاء فئة.

```php
xoops_events()->trigger('publisher.category.created', array(
    'category' => $category,
    'categoryid' => $categoryId,
    'name' => $name
));
```

#### publisher.category.updated

يتم تفعيله عند تحديث فئة.

```php
xoops_events()->trigger('publisher.category.updated', array(
    'category' => $category,
    'categoryid' => $categoryId
));
```

#### publisher.category.deleted

يتم تفعيله عند حذف فئة.

```php
xoops_events()->trigger('publisher.category.deleted', array(
    'categoryid' => $categoryId,
    'name' => $name,
    'itemCount' => $itemCount
));
```

### أحداث التعليق

#### publisher.comment.created

يتم تفعيله عند نشر تعليق.

```php
xoops_events()->trigger('publisher.comment.created', array(
    'comment' => $comment,
    'commentid' => $commentId,
    'itemid' => $itemId
));
```

#### publisher.comment.approved

يتم تفعيله عند الموافقة على تعليق.

```php
xoops_events()->trigger('publisher.comment.approved', array(
    'comment' => $comment,
    'commentid' => $commentId
));
```

#### publisher.comment.deleted

يتم تفعيله عند حذف تعليق.

```php
xoops_events()->trigger('publisher.comment.deleted', array(
    'commentid' => $commentId,
    'itemid' => $itemId
));
```

---

## الاستماع للأحداث

### تسجيل مستمع الحدث

في الوحدة أو المكون الإضافي:

```php
<?php
// تسجيل مستمع في xoops_version.php أو ملف التهيئة
xoops_events()->attach(
    'publisher.item.created',
    array('MyModuleListener', 'onPublisherItemCreated')
);

// أو استخدم اسم الدالة
xoops_events()->attach(
    'publisher.item.created',
    'my_module_on_item_created'
);
?>
```

### طريقة فئة المستمع

```php
<?php
class MyModuleListener {
    public static function onPublisherItemCreated($data) {
        $itemId = $data['itemid'];
        $title = $data['title'];

        // تنفيذ إجراء
        self::notifySubscribers($itemId, $title);
    }

    protected static function notifySubscribers($itemId, $title) {
        // التنفيذ
    }
}
?>
```

### دالة المستمع

```php
<?php
function my_module_on_item_created($data) {
    $itemId = $data['itemid'];
    $title = $data['title'];
    $uid = $data['uid'];

    // إرسال إخطار
    notifyUser($uid, "تم إنشاء مقالة: $title");
}
?>
```

---

## أمثلة الأحداث

### مثال 1: إرسال بريد عند إنشاء مقالة

```php
<?php
// الاستماع لإنشاء المقالة
xoops_events()->attach(
    'publisher.item.created',
    'send_article_notification_email'
);

function send_article_notification_email($data) {
    $itemId = $data['itemid'];
    $title = $data['title'];
    $uid = $data['uid'];

    // الحصول على كائن المستخدم
    $userHandler = xoops_getHandler('user');
    $user = $userHandler->get($uid);

    if (!$user) {
        return;
    }

    // الحصول على رسائل بريد المسؤول
    $config = xoops_getModuleConfig();
    $adminEmails = $config['admin_emails'];

    // تحضير البريد
    $subject = "مقالة جديدة: $title";
    $message = "تم إنشاء مقالة جديدة:\n\n";
    $message .= "العنوان: $title\n";
    $message .= "المؤلف: " . $user->getVar('uname') . "\n";
    $message .= "التاريخ: " . date('Y-m-d H:i:s') . "\n";
    $message .= "المعرف: $itemId\n\n";
    $message .= "الرابط: " . XOOPS_URL . "/modules/publisher/?op=showitem&itemid=$itemId\n";

    // إرسال للمسؤولين
    foreach (explode(',', $adminEmails) as $email) {
        xoops_mail($email, $subject, $message);
    }
}
?>
```

### مثال 2: تحديث فهرس البحث

```php
<?php
// الاستماع لحدث نشر المقالة
xoops_events()->attach(
    'publisher.item.published',
    'update_search_index'
);

function update_search_index($data) {
    $itemId = $data['itemid'];
    $item = $data['item'];

    // تحديث فهرس البحث
    $searchHandler = xoops_getModuleHandler('Search');
    $searchHandler->indexArticle($itemId, array(
        'title' => $item->getVar('title'),
        'content' => $item->getVar('body'),
        'author' => $item->getVar('uname'),
        'date' => $item->getVar('datesub')
    ));
}
?>
```

### مثال 3: نشر تلقائي على وسائل التواصل الاجتماعي

```php
<?php
// الاستماع لنشر المقالة
xoops_events()->attach(
    'publisher.item.published',
    'post_to_social_media'
);

function post_to_social_media($data) {
    $item = $data['item'];
    $itemId = $data['itemid'];

    // الحصول على الإعدادات
    $config = xoops_getModuleConfig();

    if ($config['post_to_twitter']) {
        postToTwitter(
            $item->getVar('title'),
            XOOPS_URL . '/modules/publisher/?op=showitem&itemid=' . $itemId
        );
    }

    if ($config['post_to_facebook']) {
        postToFacebook(
            $item->getVar('title'),
            $item->getVar('description')
        );
    }
}

function postToTwitter($text, $url) {
    // دمج Twitter OAuth
    // استخدم مكتبة OAuth على تويتر
}

function postToFacebook($title, $description) {
    // دمج Facebook API
}
?>
```

### مثال 4: مزامنة مع نظام خارجي

```php
<?php
// الاستماع لإنشاء وتحديث المقالة
xoops_events()->attach(
    'publisher.item.created',
    'sync_external_system'
);

xoops_events()->attach(
    'publisher.item.updated',
    'sync_external_system'
);

function sync_external_system($data) {
    $item = $data['item'];
    $itemId = $data['itemid'];

    // الحصول على إعدادات API الخارجي
    $config = xoops_getModuleConfig();
    $apiUrl = $config['external_api_url'];
    $apiKey = $config['external_api_key'];

    // تحضير الحمل
    $payload = json_encode(array(
        'id' => $itemId,
        'title' => $item->getVar('title'),
        'content' => $item->getVar('body'),
        'date' => date('c', $item->getVar('datesub'))
    ));

    // إرسال لنظام خارجي
    $ch = curl_init($apiUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        'Content-Type: application/json',
        'Authorization: Bearer ' . $apiKey
    ));
    curl_exec($ch);
    curl_close($ch);
}
?>
```

---

## نظام الخطافات

### خطافات Publisher

تسمح الخطافات بتعديلات سلوك Publisher:

#### publisher.view.article.start

يُستدعى قبل عرض المقالة.

```php
xoops_events()->attach(
    'publisher.view.article.start',
    'modify_article_before_display'
);

function modify_article_before_display(&$item) {
    // تعديل العنصر قبل العرض
    $title = $item->getVar('title');
    $item->setVar('title', '[مميزة] ' . $title);
}
```

#### publisher.view.article.end

يُستدعى بعد عرض المقالة.

```php
xoops_events()->attach(
    'publisher.view.article.end',
    'append_to_article'
);

function append_to_article(&$article) {
    // إضافة محتوى بعد المقالة
    $article .= '<div class="related-articles">';
    $article .= '<!-- محتوى المقالات ذات الصلة -->';
    $article .= '</div>';
}
```

#### publisher.permission.check

يُستدعى عند فحص الصلاحيات.

```php
xoops_events()->attach(
    'publisher.permission.check',
    'custom_permission_logic'
);

function custom_permission_logic(&$allowed, $permission, $itemId) {
    // منطق صلاحيات مخصص
    if (custom_rule_applies($itemId)) {
        $allowed = true;
    }
}
```

---

## نظام المكون الإضافي

### إنشاء مكون إضافي

المكونات الإضافية توسيع وظائف Publisher:

**هيكل الملفات:**

```
modules/publisher/plugins/
├── myplugin/
│   ├── plugin.php (الملف الرئيسي)
│   ├── language/
│   │   └── english.php
│   ├── templates/
│   └── css/
```

**plugin.php:**

```php
<?php
// معلومات المكون الإضافي
define('MYPLUGIN_NAME', 'مكون Publisher الخاص بي');
define('MYPLUGIN_VERSION', '1.0.0');
define('MYPLUGIN_DESCRIPTION', 'يوسع Publisher بميزات مخصصة');

// تسجيل الخطافات/الأحداث
xoops_events()->attach(
    'publisher.item.created',
    'myplugin_on_item_created'
);

xoops_events()->attach(
    'publisher.view.article.end',
    'myplugin_append_content'
);

// دوال المكون الإضافي
function myplugin_on_item_created($data) {
    // معالجة إنشاء العنصر
}

function myplugin_append_content(&$content) {
    // إضافة محتوى بعد المقالة
    $content .= '<div class="myplugin-content">محتوى مخصص</div>';
}

// واجهة API للمكون الإضافي
class MyPublisherPlugin {
    public static function getArticles($limit = 10) {
        $itemHandler = xoops_getModuleHandler('Item', 'publisher');
        return $itemHandler->getRecent($limit);
    }

    public static function getCategoryTree() {
        $catHandler = xoops_getModuleHandler('Category', 'publisher');
        return $catHandler->getRoots();
    }
}
?>
```

### تحميل المكون الإضافي

في تهيئة Publisher:

```php
<?php
// تحميل المكون الإضافي
$pluginPath = XOOPS_ROOT_PATH . '/modules/publisher/plugins/myplugin/plugin.php';
if (file_exists($pluginPath)) {
    include_once $pluginPath;
}
?>
```

---

## الفلاتر

### فلاتر المحتوى

تعدّل الفلاتر البيانات قبل/بعد المعالجة:

```php
<?php
// تصفية عنوان المقالة
$title = apply_filters('publisher_item_title', $title, $itemId);

// تصفية جسم المقالة
$body = apply_filters('publisher_item_body', $body, $itemId);

// تصفية عرض المقالة
$display = apply_filters('publisher_item_display', $display, $item);
?>
```

### تسجيل الفلتر

```php
<?php
// إضافة فلتر
add_filter('publisher_item_title', 'my_title_filter');

function my_title_filter($title, $itemId) {
    // تعديل العنوان
    return strtoupper($title);
}

// إضافة فلتر بأولوية
add_filter(
    'publisher_item_body',
    'my_body_filter',
    10,  // الأولوية (أقل = في وقت أبكر)
    2    // عدد الحجج
);

function my_body_filter($body, $itemId) {
    // إضافة علامة مائية للجسم
    return $body . '<p class="watermark">© ' . date('Y') . '</p>';
}
?>
```

---

## خطافات الإجراء

### إجراءات مخصصة

تنفيذ الكود في نقاط محددة:

```php
<?php
// تنفيذ إجراء
do_action('publisher_article_saved', $itemId, $item);

// تنفيذ إجراء مع حجج
do_action('publisher_comment_approved', $commentId, $comment);

// الاستماع للإجراء
add_action('publisher_article_saved', 'my_action_handler');

function my_action_handler($itemId, $item) {
    // تنفيذ الكود
    log_article_save($itemId);
    update_statistics();
}
?>
```

---

## التوسيع باستخدام المكونات الإضافية

### مكون إضافي مثال: المقالات ذات الصلة

```php
<?php
// ملف: modules/publisher/plugins/related-articles/plugin.php

class RelatedArticlesPlugin {
    public static function init() {
        xoops_events()->attach(
            'publisher.view.article.end',
            array(__CLASS__, 'displayRelated')
        );
    }

    public static function displayRelated(&$content) {
        // الحصول على المقالات ذات الصلة
        $related = self::getRelatedArticles();

        if (count($related) > 0) {
            $html = '<div class="related-articles">';
            $html .= '<h3>المقالات ذات الصلة</h3>';
            $html .= '<ul>';

            foreach ($related as $article) {
                $html .= '<li>';
                $html .= '<a href="' . $article->url() . '">';
                $html .= $article->title();
                $html .= '</a>';
                $html .= '</li>';
            }

            $html .= '</ul>';
            $html .= '</div>';

            $content .= $html;
        }
    }

    protected static function getRelatedArticles() {
        // الحصول على المقالة الحالية
        global $itemId;

        $itemHandler = xoops_getModuleHandler('Item', 'publisher');
        $item = $itemHandler->get($itemId);

        if (!$item) {
            return array();
        }

        // الحصول على المقالات في نفس الفئة
        $related = $itemHandler->getByCategory(
            $item->getVar('categoryid'),
            $limit = 5
        );

        // إزالة المقالة الحالية
        $related = array_filter($related, function($article) {
            global $itemId;
            return $article->getVar('itemid') != $itemId;
        });

        return array_slice($related, 0, 3);
    }
}

// تهيئة المكون الإضافي
RelatedArticlesPlugin::init();
?>
```

---

## أفضل الممارسات

### إرشادات مستمع الحدث

```php
✓ احتفظ بالمستمعين بكفاءة
  - لا تقم بمعالجة ثقيلة في الأحداث
  - احفظ النتائج عند الإمكان

✓ التعامل مع الأخطاء بلطف
  - استخدم try/catch
  - سجّل الأخطاء
  - لا تكسر التدفق الرئيسي

✓ استخدم أسماء ذات معنى
  - my_module_on_publisher_item_created
  - بدلاً من: process_event_1

✓ وثّق الأحداث الخاصة بك
  - علّق نقطة التفعيل
  - اسرد البيانات المتوقعة
  - أظهر أمثلة الاستخدام

✓ تفريغ المستمعين بشكل صحيح
  - نظّف عند إلغاء تثبيت الوحدة
  - أزل الخطافات عند عدم الحاجة إليها
```

### نصائح الأداء

```
✗ تجنب استعلامات قاعدة البيانات في المستمعين
✗ لا تحجب التنفيذ بعمليات بطيئة
✗ تجنب تعديل البيانات دون الضرورة

✓ صفّ المهام طويلة المدى
✓ خزّن مؤقتاً استدعاءات API الخارجية
✓ استخدم التحميل الكسول للتبعيات
✓ عمليات قاعدة البيانات على دفعات
```

---

## تصحيح الأحداث

### تفعيل وضع التصحيح

```php
<?php
// في تهيئة الوحدة
if (defined('XOOPS_DEBUG')) {
    xoops_events()->attach(
        'publisher.item.created',
        'publisher_debug_event'
    );
}

function publisher_debug_event($data) {
    error_log('حدث Publisher: ' . print_r($data, true));
}
?>
```

### تسجيل الأحداث

```php
<?php
// تسجيل بيانات الحدث
xoops_events()->attach(
    'publisher.item.created',
    'log_publisher_events'
);

function log_publisher_events($data) {
    $log = XOOPS_ROOT_PATH . '/var/log/publisher.log';
    $entry = date('Y-m-d H:i:s') . ' - ';
    $entry .= 'الحدث: publisher.item.created' . "\n";
    $entry .= 'البيانات: ' . json_encode($data) . "\n\n";
    file_put_contents($log, $entry, FILE_APPEND);
}
?>
```

---

## الوثائق ذات الصلة

- مرجع API
- القوالب المخصصة
- إنشاء المقالات

---

## الموارد

- [مستودع Publisher على GitHub](https://github.com/XoopsModules25x/publisher)
- [نظام أحداث XOOPS](../../03-Module-Development/Module-Development.md)
- [تطوير المكونات الإضافية](../../03-Module-Development/Module-Development.md)

---

#publisher #hooks #events #plugins #extensions #customization #xoops
