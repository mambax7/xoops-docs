---
title: "Критерії та класи CriteriaCompo"
description: "Побудова запитів і розширена фільтрація за допомогою класів критеріїв"
---
Класи `Criteria` і `CriteriaCompo` забезпечують плавний об’єктно-орієнтований інтерфейс для створення складних запитів до бази даних. Ці класи абстрагують пропозиції WHERE SQL, що дозволяє розробникам створювати динамічні запити безпечно та зрозуміло.

## Огляд класу

### Критерій Клас

Клас `Criteria` представляє одну умову в реченні WHERE:
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
## Основне використання

### Прості критерії
```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```
### Різні оператори
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
## Побудова складних запитів

### І логіка (за замовчуванням)
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```
### АБО Логіка
```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```
## Інтеграція з шаблоном сховища

### Приклад сховища
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
## Безпека

### Автоматичне екранування

Клас `Criteria` автоматично екранує значення, щоб запобігти ін’єкції SQL:
```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```
## API Посилання

### Методи критеріїв

| Метод | Опис | Повернення |
|--------|-------------|--------|
| `__construct()` | Ініціалізація критеріальної умови | недійсний |
| `render($prefix = '')` | Виводити до SQL сегмент пропозиції WHERE | рядок |
| `getColumn()` | Отримати назву стовпця | рядок |
| `getValue()` | Отримати значення порівняння | змішаний |
| `getOperator()` | Отримати оператор порівняння | рядок |

### Методи CriteriaCompo

| Метод | Опис | Повернення |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | Ініціалізація складених критеріїв | недійсний |
| `add($criteria, $logic = null)` | Додайте критерії або вкладений складений | недійсний |
| `render($prefix = '')` | Відобразити, щоб завершити речення WHERE | рядок |
| `count()` | Отримати кількість критеріїв | int |
| `clear()` | Видалити всі критерії | недійсний |

## Пов'язана документація

- XoopsDatabase - посилання на клас бази даних
- ../../03-Module-Development/Patterns/Repository-Pattern - шаблон сховища в XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Шаблон шару служби

## Інформація про версію

- **Опубліковано:** XOOPS 2.5.0
- **Останнє оновлення:** XOOPS 4.0
- **Сумісність:** PHP 7.4+