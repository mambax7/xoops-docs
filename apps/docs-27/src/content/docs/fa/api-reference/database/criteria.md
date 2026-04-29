---
title: "کلاس های Criteria و CriteriaCompo"
description: "ساخت پرس و جو و فیلترینگ پیشرفته با استفاده از کلاس های Criteria"
---
کلاس های `Criteria` و `CriteriaCompo` یک رابط شی گرا و روان برای ساخت پرس و جوهای پیچیده پایگاه داده ارائه می کنند. این کلاس‌ها بندهای SQL WHERE را انتزاعی می‌کنند، و به توسعه‌دهندگان اجازه می‌دهند تا کوئری‌های پویا را به صورت ایمن و قابل خواندن بسازند.

## نمای کلی کلاس

### کلاس معیار

کلاس `Criteria` یک شرط واحد را در یک عبارت WHERE نشان می دهد:

```php
namespace XOOPS\Database;

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

## استفاده اولیه

### معیارهای ساده

```php
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### اپراتورهای مختلف

```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## پرس و جوهای مجتمع ساختمانی

### و منطق (پیش‌فرض)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### یا منطق

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## ادغام با الگوی مخزن

### مثال مخزن

```php
namespace MyModule\Repository;

use XOOPS\Database\XoopsDatabase;
use XOOPS\Database\Criteria;
use XOOPS\Database\CriteriaCompo;

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

## ایمنی و امنیت

### فرار خودکار

کلاس `Criteria` به طور خودکار از مقادیر برای جلوگیری از تزریق SQL فرار می کند:

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## مرجع API

### روشهای معیار

| روش | توضیحات | بازگشت |
|--------|------------|--------|
| `__construct()` | راه اندازی یک شرط معیار | خالی |
| `render($prefix = '')` | رندر به بخش عبارت SQL WHERE | رشته |
| `getColumn()` | دریافت نام ستون | رشته |
| `getValue()` | دریافت مقدار مقایسه | مخلوط |
| `getOperator()` | دریافت عملگر مقایسه | رشته |

### معیارها روشهای Compo

| روش | توضیحات | بازگشت |
|--------|------------|--------|
| `__construct($logic = 'AND')` | مقداردهی اولیه معیارهای ترکیبی | خالی |
| `add($criteria, $logic = null)` | افزودن معیار یا ترکیب تو در تو | خالی |
| `render($prefix = '')` | برای تکمیل عبارت WHERE رندر کنید | رشته |
| `count()` | دریافت تعداد معیارها | int |
| `clear()` | حذف همه معیارها | خالی |

## مستندات مرتبط

- XoopsDatabase - مرجع کلاس پایگاه داده
- ../../03-Module-Development/Patterns/Repository-Pattern - الگوی مخزن در XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - الگوی لایه سرویس

## اطلاعات نسخه

- **معرفی شد:** XOOPS 2.5.0
- **آخرین به روز رسانی:** XOOPS 4.0
- **سازگاری:** PHP 7.4+