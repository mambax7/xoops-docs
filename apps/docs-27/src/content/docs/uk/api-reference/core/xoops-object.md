---
title: "Клас XoopsObject"
description: "Базовий клас для всіх об’єктів даних у системі XOOPS, що забезпечує керування властивостями, перевірку та серіалізацію"
---
Клас `XoopsObject` є основним базовим класом для всіх об’єктів даних у системі XOOPS. Він надає стандартизований інтерфейс для керування властивостями об’єктів, перевірки, брудного відстеження та серіалізації.

## Огляд класу
```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```
## Ієрархія класів
```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```
## Властивості

| Власність | Тип | Видимість | Опис |
|----------|------|------------|-------------|
| `$vars` | масив | захищений | Зберігає визначення та значення змінних |
| `$cleanVars` | масив | захищений | Зберігає дезінфіковані значення для операцій бази даних |
| `$isNew` | bool | захищений | Вказує, чи новий об’єкт (ще не в базі даних) |
| `$errors` | масив | захищений | Зберігає перевірку та повідомлення про помилки |

## Конструктор
```php
public function __construct()
```
Створює новий екземпляр XoopsObject. За замовчуванням об’єкт позначено як новий.

**Приклад:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```
## Основні методи

### initVar

Ініціалізує визначення змінної для об’єкта.
```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ім'я змінної |
| `$dataType` | int | Константа типу даних (див. Типи даних) |
| `$value` | змішаний | Значення за замовчуванням |
| `$required` | bool | Чи є поле обов'язковим |
| `$maxlength` | int | Максимальна довжина типів рядків |
| `$options` | рядок | Додаткові опції |

**Типи даних:**

| Постійний | Значення | Опис |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | Введення текстового поля |
| `XOBJ_DTYPE_TXTAREA` | 2 | Вміст Textarea |
| `XOBJ_DTYPE_INT` | 3 | Ціле значення |
| `XOBJ_DTYPE_URL` | 4 | URL рядок |
| `XOBJ_DTYPE_EMAIL` | 5 | Адреса електронної пошти |
| `XOBJ_DTYPE_ARRAY` | 6 | Серіалізований масив |
| `XOBJ_DTYPE_OTHER` | 7 | Спеціальний тип |
| `XOBJ_DTYPE_SOURCE` | 8 | Вихідний код |
| `XOBJ_DTYPE_STIME` | 9 | Короткий формат часу |
| `XOBJ_DTYPE_MTIME` | 10 | Середній часовий формат |
| `XOBJ_DTYPE_LTIME` | 11 | Тривалий формат |
| `XOBJ_DTYPE_FLOAT` | 12 | Плаваюча кома |
| `XOBJ_DTYPE_DECIMAL` | 13 | Десяткове число |
| `XOBJ_DTYPE_ENUM` | 14 | Перерахування |

**Приклад:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```
---

### setVar

Встановлює значення змінної.
```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ім'я змінної |
| `$value` | змішаний | Значення для встановлення |
| `$notGpc` | bool | Якщо true, значення не з GET/POST/COOKIE |

**Повертає:** `bool` - True, якщо успішно, false, інакше

**Приклад:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```
---

### getVar

Отримує значення змінної з додатковим форматуванням.
```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ім'я змінної |
| `$format` | рядок | Вихідний формат |

**Параметри формату:**

| Формат | Опис |
|--------|-------------|
| `'s'` | Показати - сутності HTML, екрановані для відображення |
| `'e'` | Редагувати - Для введення значень форми |
| `'p'` | Попередній перегляд - схожий на показ |
| `'f'` | Дані форми - Необроблені для обробки форми |
| `'n'` | Немає – необроблене значення, без форматування |

**Повертає:** `mixed` – форматоване значення

**Приклад:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```
---

### setVars

Встановлює кілька змінних одночасно з масиву.
```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$values` | масив | Асоціативний масив пар ключ => значення |
| `$notGpc` | bool | Якщо true, значення не з GET/POST/COOKIE |

**Приклад:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```
---

### getValues

Отримує значення всіх змінних.
```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$keys` | масив | Спеціальні ключі для отримання (null для всіх) |
| `$format` | рядок | Вихідний формат |
| `$maxDepth` | int | Максимальна глибина для вкладених об'єктів |

**Повертає:** `array` - Асоціативний масив значень

**Приклад:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```
---

### assignVar

Призначає значення безпосередньо без перевірки (використовуйте з обережністю).
```php
public function assignVar(
    string $key,
    mixed $value
): void
```
**Параметри:**

| Параметр | Тип | Опис |
|-----------|------|------------|
| `$key` | рядок | Ім'я змінної |
| `$value` | змішаний | Значення для призначення |

**Приклад:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```
---

### cleanVars

Очищає всі змінні для операцій з базою даних.
```php
public function cleanVars(): bool
```
**Повертає:** `bool` - True, якщо всі змінні дійсні

**Приклад:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```
---

### це нове

Перевіряє або встановлює, чи є об'єкт новим.
```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```
**Приклад:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```
---

## Методи обробки помилок

### setErrors

Додає повідомлення про помилку.
```php
public function setErrors(string|array $error): void
```
**Приклад:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```
---

### getErrors

Отримує всі повідомлення про помилки.
```php
public function getErrors(): array
```
**Приклад:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```
---

### getHtmlErrors

Повертає помилки у форматі HTML.
```php
public function getHtmlErrors(): string
```
**Приклад:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```
---

## Корисні методи

### до масиву

Перетворює об’єкт на масив.
```php
public function toArray(): array
```
**Приклад:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```
---

### getVars

Повертає визначення змінних.
```php
public function getVars(): array
```
**Приклад:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```
---

## Повний приклад використання
```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```
## Найкращі практики

1. **Завжди ініціалізувати змінні**: визначте всі змінні в конструкторі за допомогою `initVar()`

2. **Використовуйте відповідні типи даних**: виберіть правильну константу `XOBJ_DTYPE_*` для перевірки

3. **Обережно вводьте дані користувача**: використовуйте `setVar()` із `$notGpc = false` для введення користувачами

4. **Перевірити перед збереженням**: завжди викликайте `cleanVars()` перед операціями з базою даних

5. **Використовувати параметри формату**: використовуйте відповідний формат у `getVar()` для контексту

6. **Extend for Custom Logic**: додайте доменно-спеціальні методи в підкласи

## Пов'язана документація

— XoopsObjectHandler — шаблон обробника для збереження об’єкта
- ../Database/Criteria - Побудова запиту за допомогою критеріїв
- ../Database/XoopsDatabase - Операції з базою даних

---

*Див. також: [Вихідний код XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*