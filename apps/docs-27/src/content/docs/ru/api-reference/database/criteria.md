---
title: "Классы Criteria и CriteriaCompo"
description: "Построение запросов и расширенная фильтрация с использованием классов Criteria"
---

Классы `Criteria` и `CriteriaCompo` предоставляют беглый, объектно-ориентированный интерфейс для построения сложных запросов базы данных. Эти классы абстрагируют SQL WHERE предложения, позволяя разработчикам создавать динамические запросы безопасно и разборчиво.

## Обзор класса

### Класс Criteria

Класс `Criteria` представляет одно условие в предложении WHERE:

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

## Базовое использование

### Простые критерии

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Одно условие
$criteria = new Criteria('status', 'active');
// Визуализируется как: `status` = 'active'
```

### Различные операторы

```php
// Равенство (по умолчанию)
$criteria = new Criteria('status', 'active', '=');

// Не равно
$criteria = new Criteria('status', 'active', '<>');

// Больше чем
$criteria = new Criteria('age', 18, '>');

// Меньше или равно
$criteria = new Criteria('age', 65, '<=');

// LIKE (для поиска по шаблону)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (для нескольких значений)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## Построение сложных запросов

### Логика И (по умолчанию)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Визуализируется как: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### Логика ИЛИ

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## Интеграция с паттерном Repository

### Пример Repository

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

## Безопасность

### Автоматическое экранирование

Класс `Criteria` автоматически экранирует значения для предотвращения SQL инъекций:

```php
// Безопасно - значение автоматически экранируется
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Безопасно визуализируется как: `username` = '\''; DROP TABLE users; --'
```

## Справочник API

### Методы Criteria

| Метод | Описание | Возврат |
|-------|---------|--------|
| `__construct()` | Инициализировать условие критерия | void |
| `render($prefix = '')` | Визуализировать в сегмент WHERE SQL | string |
| `getColumn()` | Получить имя колонки | string |
| `getValue()` | Получить значение сравнения | mixed |
| `getOperator()` | Получить оператор сравнения | string |

### Методы CriteriaCompo

| Метод | Описание | Возврат |
|-------|---------|--------|
| `__construct($logic = 'AND')` | Инициализировать композитные критерии | void |
| `add($criteria, $logic = null)` | Добавить критерии или вложенные композитные | void |
| `render($prefix = '')` | Визуализировать в полное WHERE предложение | string |
| `count()` | Получить количество критериев | int |
| `clear()` | Удалить все критерии | void |

## Связанная документация

- XoopsDatabase - Справочник класса базы данных
- ../../03-Module-Development/Patterns/Repository-Pattern - Паттерн Repository в XOOPS
- ../../03-Module-Development/Patterns/Service-Layer-Pattern - Паттерн слоя сервиса

## Информация о версии

- **Введено:** XOOPS 2.5.0
- **Последнее обновление:** XOOPS 4.0
- **Совместимость:** PHP 7.4+
