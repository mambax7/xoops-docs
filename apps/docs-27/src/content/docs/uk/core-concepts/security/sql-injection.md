---
title: "SQL Запобігання ін'єкціям"
description: "Практики безпеки бази даних і запобігання впровадження SQL у XOOPS"
---
Ін’єкція SQL є однією з найнебезпечніших і найпоширеніших уразливостей веб-додатків. У цьому посібнику описано, як захистити ваші модулі XOOPS від ін’єкційних атак SQL.

## Пов'язана документація

- Security-Best-Practices - Вичерпний посібник із безпеки
- CSRF-Protection - система токенів і клас XoopsSecurity
- Очистка введення - MyTextSanitizer і перевірка

## Розуміння ін’єкції SQL

Ін’єкція SQL відбувається, коли введені користувачем дані безпосередньо включені до запитів SQL без належної обробки чи параметризації.

### Приклад вразливого коду
```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```
Якщо користувач передає `1 OR 1=1` як ідентифікатор, запит виглядає так:
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```
Це повертає всі записи замість одного.

## Використання параметризованих запитів

Найефективнішим захистом від впровадження SQL є використання параметризованих запитів (підготовлених операторів).

### Базовий параметризований запит
```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```
### Кілька параметрів
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```
### Іменовані параметри

Деякі абстракції бази даних підтримують іменовані параметри:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```
## Використання XoopsObject і XoopsObjectHandler

XOOPS забезпечує об’єктно-орієнтований доступ до бази даних, який допомагає запобігти ін’єкції SQL через систему Criteria.

### Основні критерії використання
```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```
### CriteriaCompo для кількох умов
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```
### Оператори критеріїв
```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```
### Умови АБО
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```
## Префікси таблиць

Завжди використовуйте систему префіксів таблиці XOOPS:
```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```
## INSERT Запити

### Використання підготовлених операторів
```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```
### Використання XoopsObject
```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```
## ОНОВЛЕННЯ запитів

### Використання підготовлених операторів
```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```
### Використання XoopsObject
```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```
## ВИДАЛИТИ запити

### Використання підготовлених операторів
```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Використання XoopsObject
```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```
### Масове видалення з критеріями
```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```
## Втеча за потреби

Якщо ви не можете використовувати підготовлені оператори, використовуйте правильне екранування:
```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```
Однак **завжди віддавайте перевагу підготовленим заявам**, а не екрануванню.

## Безпечне створення динамічних запитів

### Безпечні динамічні імена стовпців

Назви стовпців не можна параметризувати. Перевірте білий список:
```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```
### Безпечні динамічні імена таблиць

Подібним чином перевірте імена таблиць:
```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```
### Динамічне створення речень WHERE
```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```
## LIKE запити

Будьте обережні з запитами LIKE, щоб уникнути введення шаблонів підстановки:
```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```
## Речення IN

Використовуючи пропозиції IN, переконайтеся, що всі значення введено правильно:
```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```
Або з критеріями:
```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```
## Безпека транзакцій

Під час виконання кількох пов’язаних запитів:
```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```
## Обробка помилок

Ніколи не повідомляйте користувачам про помилки SQL:
```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```
## Типових помилок, яких слід уникати

### Помилка 1: пряма інтерполяція змінних
```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```
### Помилка 2: використання addslashes()
```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```
### Помилка 3: довіряти числовим ідентифікаторам
```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```
### Помилка 4: ін'єкція другого порядку
```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```
## Тестування безпеки

### Перевірте свої запити

Перевірте свої форми за допомогою цих вхідних даних, щоб перевірити ін’єкцію SQL:

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

Якщо будь-який із них викликає неочікувану поведінку чи помилки, у вас є вразливість.

### Автоматичне тестування

Використовуйте автоматизовані засоби тестування ін’єкції SQL під час розробки:

- SQLMap
- Люкс Burp
- OWASP ZAP

## Підсумок найкращих практик

1. **Завжди використовуйте параметризовані запити** (підготовлені оператори)
2. **Використовуйте XoopsObject/XoopsObjectHandler**, коли це можливо
3. **Використовуйте класи критеріїв** для створення запитів
4. **Дозволені значення білого списку** для стовпців і назв таблиць
5. **Приведіть числові значення** явно за допомогою `(int)` або `(float)`
6. **Ніколи не повідомляйте користувачам про помилки бази даних**
7. **Використовуйте транзакції** для кількох пов’язаних запитів
8. **Тест на введення SQL** під час розробки
9. **Уникайте символів підстановки LIKE** у пошукових запитах
10. **Очистіть значення пропозиції IN** окремо

---

#security #sql-injection #database #xoops #prepared-statements #Criteria