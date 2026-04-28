---
title: "Класс XoopsDatabase"
description: "Уровень абстракции базы данных, обеспечивающий управление соединением, выполнение запросов и обработку результатов"
---

Класс `XoopsDatabase` предоставляет уровень абстракции БД для XOOPS, обрабатывая управление соединением, выполнение запросов, обработку результатов и обработку ошибок. Он поддерживает несколько драйверов БД через архитектуру драйверов.

## Обзор класса

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## Иерархия класса

```
XoopsDatabase (Абстрактная база)
├── XoopsMySQLDatabase (Расширение MySQL)
│   └── XoopsMySQLDatabaseProxy (Прокси безопасности)
└── XoopsMySQLiDatabase (Расширение MySQLi)
    └── XoopsMySQLiDatabaseProxy (Прокси безопасности)

XoopsDatabaseFactory
└── Создает экземпляры соответствующих драйверов
```

## Получение экземпляра БД

### Использование фабрики

```php
// Рекомендуется: используйте фабрику
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

## Основные методы

### query

Выполняет SQL запрос.

```php
public function query(string $sql, int $limit = 0, int $start = 0)
```

**Параметры:**

| Параметр | Тип | Описание |
|----------|-----|---------|
| `$sql` | string | SQL запрос для выполнения |
| `$limit` | int | Максимальное количество строк |
| `$start` | int | Начальное смещение |

**Пример:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$result = $db->query("SELECT * FROM " . $db->prefix('users'));

if ($result) {
    while ($row = $db->fetchArray($result)) {
        echo $row['username'];
    }
}
```

### fetchArray

Получает строку результата как ассоциативный массив.

```php
public function fetchArray($result): ?array
```

**Пример:**
```php
$result = $db->query("SELECT * FROM " . $db->prefix('users'));
while ($row = $db->fetchArray($result)) {
    echo $row['uname']; // Доступ по имени колонки
}
```

### fetchObject

Получает строку результата как объект.

```php
public function fetchObject($result): ?object
```

**Пример:**
```php
$result = $db->query("SELECT * FROM " . $db->prefix('users'));
while ($obj = $db->fetchObject($result)) {
    echo $obj->uname; // Доступ через свойства объекта
}
```

### getRowsNum

Получает количество строк в результате.

```php
public function getRowsNum($result): int
```

**Пример:**
```php
$result = $db->query("SELECT * FROM " . $db->prefix('users'));
echo "Найдено " . $db->getRowsNum($result) . " пользователей";
```

### getAffectedRows

Получает количество затронутых строк последней операции.

```php
public function getAffectedRows(): int
```

**Пример:**
```php
$db->query("UPDATE " . $db->prefix('users') . " SET level = 1");
echo "Обновлено " . $db->getAffectedRows() . " строк";
```

### getInsertId

Получает ID последней вставленной строки.

```php
public function getInsertId(): int
```

**Пример:**
```php
$sql = "INSERT INTO " . $db->prefix('users') . " (uname, email) VALUES ('john', 'john@example.com')";
$db->query($sql);
$newId = $db->getInsertId();
echo "Вставлен ID: " . $newId;
```

### escape

Экранирует строку для безопасного использования в SQL.

```php
public function escape(string $string): string
```

**Пример:**
```php
$username = $_POST['username'];
$escaped = $db->escape($username);
$result = $db->query("SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $escaped . "'");
```

## Вспомогательные методы

### prefix

Возвращает название таблицы с префиксом БД.

```php
public function prefix(string $tablename): string
```

**Пример:**
```php
$table = $db->prefix('users'); // xoops_users
$sql = "SELECT * FROM " . $table;
```

### error

Получает последнюю ошибку БД.

```php
public function error(): string
```

**Пример:**
```php
if (!$result) {
    echo "Ошибка БД: " . $db->error();
}
```

## Лучшие практики

1. **Используйте QueryBuilder** - Для сложных запросов используйте QueryBuilder вместо сырого SQL
2. **Всегда экранируйте** - Используйте `escape()` для пользовательского ввода
3. **Используйте подготовленные операторы** - Предпочитайте параметризованные запросы
4. **Обработка ошибок** - Проверяйте результаты запросов
5. **Используйте транзакции** - Для нескольких связанных операций

## Связанная документация

- QueryBuilder - Современное построение запросов
- Criteria - Система построения критериев запроса
- ../Core/XoopsObject - Объекты данных

---

*См. также: [API БД XOOPS](https://github.com/XOOPS/XoopsCore27)*
