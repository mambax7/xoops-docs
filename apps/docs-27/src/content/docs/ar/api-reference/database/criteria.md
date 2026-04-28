---
title: "فئات Criteria و CriteriaCompo"
description: "بناء الاستعلام والتصفية المتقدمة باستخدام فئات Criteria"
dir: rtl
lang: ar
---

توفر فئات `Criteria` و `CriteriaCompo` واجهة سلسة موجهة للكائنات لبناء استعلامات قاعدة بيانات معقدة. تجرد هذه الفئات شروط SQL WHERE، مما يسمح للمطورين ببناء استعلامات ديناميكية بأمان وسهولة قراءة.

## نظرة عامة على الفئة

### فئة Criteria

فئة `Criteria` تمثل شرط واحد في جملة WHERE:

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## الاستخدام الأساسي

### معايير بسيطة

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// شرط واحد
$criteria = new Criteria('status', 'active');
// يصرف: `status` = 'active'
```

### عوامل تشغيلية مختلفة

```php
// المساواة (الافتراضي)
$criteria = new Criteria('status', 'active', '=');

// ليس مساوي
$criteria = new Criteria('status', 'active', '<>');

// أكبر من
$criteria = new Criteria('age', 18, '>');

// أقل من أو يساوي
$criteria = new Criteria('age', 65, '<=');

// LIKE (للمطابقة النمطية)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (لقيم متعددة)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## بناء استعلامات معقدة

### منطق AND (الافتراضي)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// يصرف: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### منطق OR

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## التكامل مع نمط المستودع

### مثال المستودع

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## الأمان والحماية

### الهروب التلقائي

تفرّ فئة `Criteria` القيم تلقائياً لمنع حقن SQL:

```php
// آمن - يتم الهروب من القيمة تلقائياً
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// الهروب الآمن يصرف: `username` = '\''; DROP TABLE users; --'
```

## مرجع API

### طرق Criteria

| الطريقة | الوصف | الإرجاع |
|--------|-------------|--------|
| `__construct()` | تهيئة شرط المعايير | void |
| `render($prefix = '')` | صرف إلى مقطع جملة WHERE في SQL | string |
| `getColumn()` | الحصول على اسم العمود | string |
| `getValue()` | الحصول على قيمة المقارنة | mixed |
| `getOperator()` | الحصول على عامل المقارنة | string |

### طرق CriteriaCompo

| الطريقة | الوصف | الإرجاع |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | تهيئة معايير مركبة | void |
| `add($criteria, $logic = null)` | إضافة معايير أو مركبة متداخلة | void |
| `render($prefix = '')` | صرف إلى جملة WHERE كاملة | string |
| `count()` | الحصول على عدد المعايير | int |
| `clear()` | إزالة جميع المعايير | void |

## التوثيق ذي الصلة

- XoopsDatabase - مرجع فئة قاعدة البيانات
- ../../03-Module-Development/Patterns/Repository-Pattern - نمط المستودع في XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - نمط طبقة الخدمة

## معلومات الإصدار

- **تم تقديمه:** XOOPS 2.5.0
- **آخر تحديث:** XOOPS 4.0
- **التوافقية:** PHP 7.4+
