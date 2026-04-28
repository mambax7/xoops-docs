---
title: "Санитизация входных данных"
description: "Использование MyTextSanitizer и методы валидации в XOOPS"
---

Никогда не доверяйте пользовательскому вводу. Всегда валидируйте и санитизируйте все входные данные перед использованием. XOOPS предоставляет класс `MyTextSanitizer` для санитизации текстовых входных данных и различные вспомогательные функции для валидации.

## Связанная документация

- Security-Best-Practices - Комплексное руководство по безопасности
- CSRF-Protection - Система токенов и класс XoopsSecurity
- SQL-Injection-Prevention - Практики безопасности базы данных

## Золотое правило

**Никогда не доверяйте пользовательскому вводу.** Все данные из внешних источников должны быть:

1. **Валидированы**: Проверьте, что они соответствуют ожидаемому формату и типу
2. **Санитизированы**: Удалите или экранируйте потенциально опасные символы
3. **Экранированы**: При выводе экранируйте для конкретного контекста (HTML, JavaScript, SQL)

## Класс MyTextSanitizer

XOOPS предоставляет класс `MyTextSanitizer` (обычно именуемый как `$myts`) для санитизации текста.

### Получение экземпляра

```php
// Получение единственного экземпляра
$myts = MyTextSanitizer::getInstance();
```

### Базовая санитизация текста

```php
$myts = MyTextSanitizer::getInstance();

// Для полей обычного текста (без HTML)
$title = $myts->htmlSpecialChars($_POST['title']);

// Это преобразует:
// < в &lt;
// > в &gt;
// & в &amp;
// " в &quot;
// ' в &#039;
```

### Обработка содержимого Textarea

Метод `displayTarea()` обеспечивает комплексную обработку textarea:

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = Нет HTML, 1 = HTML разрешён
    $allowsmiley = 1,    // 1 = Смайлики включены
    $allowxcode = 1,     // 1 = Коды XOOPS включены (BBCode)
    $allowimages = 1,    // 1 = Изображения разрешены
    $allowlinebreak = 1  // 1 = Переводы строк конвертируются в <br>
);
```

### Распространённые методы санитизации

```php
$myts = MyTextSanitizer::getInstance();

// Экранирование специальных символов HTML
$safe_text = $myts->htmlSpecialChars($text);

// Удаление слешей, если магические кавычки включены
$text = $myts->stripSlashesGPC($text);

// Преобразование кодов XOOPS (BBCode) в HTML
$html = $myts->xoopsCodeDecode($text);

// Преобразование смайликов в изображения
$html = $myts->smiley($text);

// Превращение ссылок в кликабельные
$html = $myts->makeClickable($text);

// Полная обработка текста для предпросмотра
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## Валидация входных данных

### Валидация целых чисел

```php
// Валидация целого числа ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Альтернатива с filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### Валидация адресов электронной почты

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### Валидация URL

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Дополнительная проверка разрешённых протоколов
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### Валидация дат

```php
$date = $_POST['date'] ?? '';

// Валидация формата даты (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Валидация фактической даты
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### Валидация имён файлов

```php
// Удаление всех символов, кроме буквенно-цифровых, подчёркивания и дефиса
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Или используйте подход с whitelist
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## Обработка различных типов входных данных

### Текстовый ввод

```php
$myts = MyTextSanitizer::getInstance();

// Короткий текст (названия, имена)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Ограничение длины
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Проверка пустых обязательных полей
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### Числовой ввод

```php
// Целое число
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Убедитесь в диапазоне 0-1000

// Число с плавающей точкой
$price = (float)$_POST['price'];
$price = round($price, 2); // Округление до 2 десятичных знаков

// Валидация диапазона
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### Булев ввод

```php
// Значения чекбокса
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Или с явной проверкой значения
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### Ввод массива

```php
// Валидация ввода массива (например, несколько чекбоксов)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### Ввод Select/Option

```php
// Валидация против разрешённых значений
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## Объект Request (XMF)

При использовании XMF класс Request обеспечивает более чистую обработку входных данных:

```php
use Xmf\Request;

// Получение целого числа
$id = Request::getInt('id', 0);

// Получение строки
$title = Request::getString('title', '');

// Получение массива
$ids = Request::getArray('ids', []);

// Получение с указанием метода
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Проверка метода запроса
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## Создание класса валидации

Для сложных форм создайте специальный класс валидации:

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Валидация названия
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Валидация электронной почты
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Валидация статуса
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

Использование:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Отображение ошибок пользователю
}
```

## Санитизация для сохранения в базе данных

При сохранении данных в базе данных:

```php
$myts = MyTextSanitizer::getInstance();

// Для сохранения (будет обработана снова при отображении)
$title = $myts->addSlashes($_POST['title']);

// Лучше: используйте параметризованные выражения (см. Предотвращение SQL инъекций)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## Санитизация для отображения

Различные контексты требуют различного экранирования:

```php
$myts = MyTextSanitizer::getInstance();

// Контекст HTML
echo $myts->htmlSpecialChars($title);

// Внутри HTML атрибутов
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// Контекст JavaScript
echo json_encode($title);

// Параметр URL
echo urlencode($title);

// Полный URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## Распространённые ошибки

### Двойное кодирование

**Проблема**: Данные кодируются несколько раз

```php
// Неправильно - двойное кодирование
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Правильно - кодируйте один раз в подходящее время
$title = $_POST['title']; // Сохраняйте в исходном виде
echo $myts->htmlSpecialChars($title); // Кодируйте при выводе
```

### Непостоянное кодирование

**Проблема**: Некоторые выходы кодируются, некоторые нет

**Решение**: Всегда используйте последовательный подход, предпочтительно кодирование при выводе:

```php
// Назначение шаблону
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### Отсутствующая валидация

**Проблема**: Только санитизация без валидации

**Решение**: Всегда валидируйте сначала, затем санитизируйте:

```php
// Сначала валидируйте
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Затем санитизируйте для сохранения/отображения
$username = $myts->htmlSpecialChars($_POST['username']);
```

## Резюме лучших практик

1. **Используйте MyTextSanitizer** для обработки текстового контента
2. **Используйте filter_var()** для валидации конкретного формата
3. **Используйте приведение типов** для числовых значений
4. **Используйте whitelist разрешённых значений** для инпутов select
5. **Валидируйте перед санитизацией**
6. **Экранируйте при выводе**, не при вводе
7. **Используйте параметризованные выражения** для запросов к базе данных
8. **Создавайте классы валидации** для сложных форм
9. **Никогда не доверяйте валидации на стороне клиента** - всегда валидируйте на стороне сервера

---

#security #sanitization #validation #xoops #MyTextSanitizer #input-handling
