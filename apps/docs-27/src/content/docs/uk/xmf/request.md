---
title: "XMF Запит"
description: 'Безпечна обробка запитів HTTP та перевірка введених даних за допомогою класу XMF\Request'
---
Клас `XMF\Request` забезпечує контрольований доступ до змінних запиту HTTP із вбудованою обробкою та перетворенням типів. За замовчуванням він захищає від потенційно шкідливих ін’єкцій, водночас узгоджуючи вхідні дані з певними типами.

## Огляд

Обробка запитів є одним із найбільш важливих для безпеки аспектів веб-розробки. Клас запиту XMF:

- Автоматично дезінфікує введені дані для запобігання атакам XSS
— Забезпечує надійні засоби доступу для типових типів даних
- Підтримує кілька джерел запитів (GET, POST, COOKIE тощо)
- Пропонує узгоджену обробку значень за умовчанням

## Основне використання
```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```
## Методи запиту

### getMethod()

Повертає метод запиту HTTP для поточного запиту.
```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```
### getVar($name, $default, $hash, $type, $mask)

Основний метод, який викликає більшість інших `get*()` методів. Отримує та повертає іменовану змінну з даних запиту.

**Параметри:**
- `$name` - ім'я змінної для отримання
- `$default` - Значення за замовчуванням, якщо змінна не існує
- `$hash` - Хеш джерела: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD або REQUEST (за замовчуванням)
- `$type` - Тип даних для очищення (див. типи FilterInput нижче)
- `$mask` - Бітова маска для параметрів очищення

**Значення маски:**

| Константа маски | Ефект |
|--------------|--------|
| `MASK_NO_TRIM` | Не обрізайте leading/trailing пробіли |
| `MASK_ALLOW_RAW` | Пропустити очищення, дозволити необроблений вхід |
| `MASK_ALLOW_HTML` | Дозволити обмежений «безпечний» набір розмітки HTML |
```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```
## Типоспецифічні методи

### getInt($name, $default, $hash)

Повертає ціле значення. Допускаються лише цифри.
```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```
### getFloat($name, $default, $hash)

Повертає значення з плаваючою точкою. Дозволені лише цифри та крапки.
```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```
### getBool($name, $default, $hash)

Повертає логічне значення.
```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```
### getWord($name, $default, $hash)

Повертає рядок лише з літерами та підкресленням `[A-Za-z_]`.
```php
$action = Request::getWord('action', 'view');
```
### getCmd($name, $default, $hash)

Повертає командний рядок лише з `[A-Za-z0-9.-_]`, примусово написаним у нижньому регістрі.
```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```
### getString($name, $default, $hash, $mask)

Повертає очищений рядок із видаленим неправильним кодом HTML (якщо не перевизначено маскою).
```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```
### getArray($name, $default, $hash)

Повертає масив, рекурсивно оброблений для видалення XSS і неправильного коду.
```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```
### getText($name, $default, $hash)

Повертає необроблений текст без очищення. Використовуйте з обережністю.
```php
$rawContent = Request::getText('raw_content', '');
```
### getUrl($name, $default, $hash)

Повертає перевірений веб-сайт URL (тільки для відносних, http або https схем).
```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```
### getPath($name, $default, $hash)

Повертає перевірену файлову систему або веб-шлях.
```php
$filePath = Request::getPath('file', '');
```
### getEmail($name, $default, $hash)

Повертає перевірену електронну адресу або адресу за замовчуванням.
```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```
### getIP($name, $default, $hash)

Повертає перевірену адресу IPv4 або IPv6.
```php
$userIp = Request::getIP('client_ip', '');
```
### getHeader($headerName, $default)

Повертає значення заголовка запиту HTTP.
```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```
## Корисні методи

### hasVar($name, $hash)

Перевірте, чи існує змінна у вказаному хеші.
```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```
### setVar($name, $value, $hash, $overwrite)

Установіть змінну в указаному хеші. Повертає попереднє значення або null.
```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```
### get($hash, $mask)

Повертає очищену копію цілого хеш-масиву.
```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```
### set($array, $hash, $overwrite)

Встановлює кілька змінних із масиву.
```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```
## Інтеграція FilterInput

Клас Request використовує `XMF\FilterInput` для очищення. Доступні типи фільтрів:

| Тип | Опис |
|------|-------------|
| ALPHANUM / ALNUM | Лише буквено-цифровий |
| ARRAY | Рекурсивно очистити кожен елемент |
| BASE64 | Рядок у кодуванні Base64 |
| BOOLEAN / BOOL | Правда чи хибність |
| CMD | Команда - A-Z, 0-9, підкреслення, тире, крапка (нижній регістр) |
| EMAIL | Дійсна адреса електронної пошти |
| FLOAT / DOUBLE | Число з плаваючою комою |
| INTEGER / INT | Ціле значення |
| IP | Дійсна IP-адреса |
| PATH | Файлова система або веб-шлях |
| STRING | Загальний рядок (за замовчуванням) |
| USERNAME | Формат імені користувача |
| WEBURL | Веб URL |
| WORD | Лише букви A-Z і підкреслення |

## Практичні приклади

### Обробка форми
```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```
### AJAX Обробник
```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```
### Пагінація
```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```
### Форма пошуку
```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```
## Найкращі методи безпеки

1. **Завжди використовуйте специфічні для типу методи** - використовуйте `getInt()` для ідентифікаторів, `getEmail()` для електронних листів тощо.

2. **Надайте розумні значення за замовчуванням** - Ніколи не припускайте, що введені дані існують

3. **Перевірити після дезінфекції** - дезінфекція видаляє неправильні дані, перевірка гарантує правильні дані

4. **Використовуйте відповідний хеш** - укажіть POST для даних форми, GET для параметрів запиту

5. **Уникайте необробленого введення** - Використовуйте `getText()` або `MASK_ALLOW_RAW`, лише коли це абсолютно необхідно
```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```
## Дивіться також

- Початок роботи з-XMF - Основні поняття XMF
- XMF-Module-Helper - Клас допоміжного модуля
- ../XMF-Framework - Огляд фреймворку

---

#XMF #request #security #input-validation #sanitization