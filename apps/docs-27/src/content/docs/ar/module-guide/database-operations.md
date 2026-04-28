---
title: "عمليات قاعدة البيانات"
dir: rtl
lang: ar
---

## نظرة عامة

يوفر XOOPS طبقة تجريد قاعدة البيانات التي تدعم الأنماط الإجرائية الموروثة والأساليب الموجهة للكائنات الحديثة. يغطي هذا الدليل عمليات قاعدة البيانات الشائعة لتطوير الوحدة.

## اتصال قاعدة البيانات

### الحصول على مثيل قاعدة البيانات

```php
// النهج الموروث
global $xoopsDB;

// النهج الحديث عبر الخيار
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// عبر مساعد XMF
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## العمليات الأساسية

### استعلامات SELECT

```php
// استعلام بسيط
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// مع المعاملات (النهج الآمن)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// صف واحد
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### عمليات INSERT

```php
// إدراج أساسي
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// احصل على معرّف الإدراج الأخير
$newId = $db->getInsertId();
```

### عمليات UPDATE

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// تحقق من الصفوف المتأثرة
$affectedRows = $db->getAffectedRows();
```

### عمليات DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## استخدام المعايير

يوفر نظام المعايير طريقة آمنة للنوع لبناء الاستعلامات:

```php
use Criteria;
use CriteriaCompo;

// معايير بسيطة
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// معايير مركبة
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### معاملات المعايير

| العامل | الوصف |
|----------|-------------|
| `=` | يساوي (الافتراضي) |
| `!=` | لا يساوي |
| `<` | أقل من |
| `>` | أكبر من |
| `<=` | أقل من أو يساوي |
| `>=` | أكبر من أو يساوي |
| `LIKE` | مطابقة النمط |
| `IN` | في مجموعة القيم |

```php
// معايير LIKE
$criteria = new Criteria('title', '%search%', 'LIKE');

// معايير IN
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// نطاق التاريخ
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## معالجات الكائنات

### طرق المعالج

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// أنشئ كائن جديد
$item = $handler->create();

// احصل على معرف
$item = $handler->get($id);

// احصل على عناصر متعددة
$items = $handler->getObjects($criteria);

// احصل على مصفوفة
$items = $handler->getAll($criteria);

// عد
$count = $handler->getCount($criteria);

// احفظ
$success = $handler->insert($item);

// احذف
$success = $handler->delete($item);
```

### طرق معالج مخصصة

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## معاملات البيانات

```php
// ابدأ معاملة
$db->query('START TRANSACTION');

try {
    // قم بعمليات متعددة
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // التزم إذا نجحت الكل
    $db->query('COMMIT');
} catch (\Exception $e) {
    // تراجع عند الخطأ
    $db->query('ROLLBACK');
    throw $e;
}
```

## البيانات المعدة الحديثة

```php
// استخدام PDO من خلال طبقة قاعدة البيانات XOOPS
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## إدارة المخطط

### إنشاء الجداول

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### الترحيلات

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## أفضل الممارسات

1. **اقتباس السلاسل دائماً** - استخدم `$db->quoteString()` لمدخلات المستخدم
2. **استخدم Intval** - اختر الأعداد الصحيحة باستخدام `intval()` أو إعلانات النوع
3. **فضل المعالجات** - استخدم معالجات الكائنات على SQL الخام عند الإمكان
4. **استخدم المعايير** - بناء الاستعلامات بالمعايير لسلامة النوع
5. **معالجة الأخطاء** - تحقق من القيم المرجعة واتعامل مع الإخفاقات
6. **استخدم المعاملات** - غلف العمليات ذات الصلة في المعاملات

## الوثائق ذات الصلة

- ../04-API-Reference/Kernel/Criteria - بناء الاستعلام مع المعايير
- ../04-API-Reference/Core/XoopsObjectHandler - نمط المعالج
- ../02-Core-Concepts/Database/Database-Layer - طبقة التجريد
- Database/Database-Schema - دليل تصميم المخطط
