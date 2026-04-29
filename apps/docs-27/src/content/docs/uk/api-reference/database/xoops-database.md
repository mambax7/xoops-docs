---
title: "Клас бази даних Xoops"
description: "Рівень абстракції бази даних, що забезпечує керування з’єднаннями, виконання запитів і обробку результатів"
---
Клас `XoopsDatabase` забезпечує рівень абстракції бази даних для XOOPS, керуючи керуванням з’єднаннями, виконанням запитів, обробкою результатів і обробкою помилок. Він підтримує кілька драйверів бази даних через архітектуру драйвера.

## Огляд класу
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
## Ієрархія класів
```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```
## Отримання екземпляра бази даних

### Використання фабрики
```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```
### Використання getInstance
```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```
### Глобальна змінна
```php
// Legacy: Use global variable
global $xoopsDB;
```
## Основні методи

### підключення

Встановлює підключення до бази даних.
```php
abstract public function connect(bool $selectdb = true): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$selectdb` | bool | Чи вибирати базу даних |

**Повертає:** `bool` - True у разі успішного підключення

**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```
---

### запит

Виконує запит SQL.
```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$sql` | рядок | SQL рядок запиту |
| `$limit` | int | Максимальна кількість рядків для повернення (0 = без обмежень) |
| `$start` | int | Початкове зміщення |

**Повертає:** `resource|bool` - ресурс результату або false у разі помилки

**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Simple query
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query with limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // First 10 rows

// Query with offset
$result = $db->query($sql, 10, 20); // 10 rows starting at row 20
```
---

### queryF

Виконує запит із примусовою операцією (обходить перевірки безпеки).
```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```
**Випадки використання:**
- Операції INSERT, UPDATE, DELETE
- Коли потрібно обійти обмеження лише для читання

**Приклад:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```
---

### префікс

Додає префікс таблиці бази даних.
```php
public function prefix(string $table = ''): string
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$table` | рядок | Назва таблиці без префікса |

**Повертає:** `string` - назва таблиці з префіксом

**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```
---

### fetchArray

Отримує рядок результату як асоціативний масив.
```php
abstract public function fetchArray($result): ?array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$result` | ресурс | Ресурс результатів запиту |

**Повертає:** `array|null` - Асоціативний масив або null, якщо більше немає рядків

**Приклад:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```
---

### fetchObject

Отримує рядок результату як об’єкт.
```php
abstract public function fetchObject($result): ?object
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$result` | ресурс | Ресурс результатів запиту |

**Повертає:** `object|null` – об’єкт із властивостями для кожного стовпця

**Приклад:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```
---

### fetchRow

Отримує рядок результату як числовий масив.
```php
abstract public function fetchRow($result): ?array
```
**Приклад:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```
---

### отримати обидва

Отримує рядок результатів як асоціативний, так і числовий масив.
```php
abstract public function fetchBoth($result): ?array
```
**Приклад:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```
---

### getRowsNum

Отримує кількість рядків у наборі результатів.
```php
abstract public function getRowsNum($result): int
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$result` | ресурс | Ресурс результатів запиту |

**Повертає:** `int` - кількість рядків

**Приклад:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```
---

### getAffectedRows

Отримує кількість постраждалих рядків з останнього запиту.
```php
abstract public function getAffectedRows(): int
```
**Повертає:** `int` - кількість постраждалих рядків

**Приклад:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```
---

### getInsertId

Отримує автоматично згенерований ідентифікатор з останнього INSERT.
```php
abstract public function getInsertId(): int
```
**Повертає:** `int` - ідентифікатор останньої вставки

**Приклад:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```
---

### втеча

Екранує рядок для безпечного використання в запитах SQL.
```php
abstract public function escape(string $string): string
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$string` | рядок | Рядок для екранування |

**Повертає:** `string` - екранований рядок (без лапок)

**Приклад:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```
---

### quoteString

Екранує та бере в лапки рядок для SQL.
```php
public function quoteString(string $string): string
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$string` | рядок | Рядок для цитування |

**Повертає:** `string` – екранований рядок із лапками

**Приклад:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```
---

### freeRecordSet

Звільняє пам'ять, пов'язану з результатом.
```php
abstract public function freeRecordSet($result): void
```
**Приклад:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```
---

## Обробка помилок

### помилка

Отримує останнє повідомлення про помилку.
```php
abstract public function error(): string
```
**Приклад:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```
---

### помилка

Отримує останній номер помилки.
```php
abstract public function errno(): int
```
**Приклад:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```
---

## Підготовлені оператори (MySQLi)

Драйвер MySQLi підтримує підготовлені оператори для підвищення безпеки.

### підготуватися

Створює підготовлену заяву.
```php
public function prepare(string $sql): mysqli_stmt|false
```
**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```
### Підготовлений оператор із кількома параметрами
```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```
---

## Підтримка транзакцій

### beginTransaction

Починає транзакцію.
```php
public function beginTransaction(): bool
```
### здійснити

Фіксує поточну транзакцію.
```php
public function commit(): bool
```
### відкат

Відкочує поточну транзакцію.
```php
public function rollback(): bool
```
**Приклад:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Multiple operations
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Check for errors
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```
---

## Повні приклади використання

### Основні операції CRUD
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```
### Запит на сторінки
```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Get total count
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Get page of results
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```
### Пошуковий запит з LIKE
```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limit to 50 results

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```
### Запит на приєднання
```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```
---

## Клас SqlUtility

Допоміжний клас для операцій з файлами SQL.

### splitMySqlFile

Розділяє файл SQL на окремі запити.
```php
public static function splitMySqlFile(string $content): array
```
**Приклад:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```
### prefixQuery

Замінює заповнювачі таблиці на імена таблиць із префіксом.
```php
public static function prefixQuery(string $sql, string $prefix): string
```
**Приклад:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```
---

## Найкращі практики

### Безпека

1. **Завжди виключати введення користувача**:
```php
$safe = $db->escape($_POST['input']);
```
2. **Використовуйте готові твердження, якщо вони доступні**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```
3. **Використовуйте quoteString для значень**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```
### Продуктивність

1. **Завжди використовуйте LIMIT для великих таблиць**:
```php
$result = $db->query($sql, 100);  // Limit results
```
2. **Безкоштовні набори результатів після завершення**:
```php
$db->freeRecordSet($result);
```
3. **Використовуйте відповідні індекси** у визначеннях таблиць

4. **Надавайте перевагу обробникам над необробленим SQL**, коли це можливо

### Обробка помилок

1. **Завжди перевіряйте наявність помилок**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```
2. **Використовуйте транзакції для кількох пов’язаних операцій**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```
## Пов'язана документація

- Критерії - Система критеріїв запиту
- QueryBuilder - вільне створення запитів
- ../Core/XoopsObjectHandler - Постійність об'єкта

---

*Див. також: [Вихідний код XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*