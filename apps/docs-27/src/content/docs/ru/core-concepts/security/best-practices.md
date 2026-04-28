---
title: "Лучшие практики безопасности"
description: "Комплексное руководство по безопасности для разработки модулей XOOPS"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[API безопасности стабильны в разных версиях]
Практики и API безопасности, описанные здесь, работают как в XOOPS 2.5.x, так и в XOOPS 4.0.x. Основные классы безопасности (`XoopsSecurity`, `MyTextSanitizer`) остаются стабильными.
:::

Этот документ предоставляет комплексные рекомендации по безопасности для разработчиков модулей XOOPS. Следование этим рекомендациям поможет гарантировать, что ваши модули безопасны и не введут уязвимостей в установки XOOPS.

## Принципы безопасности

Каждый разработчик XOOPS должен следовать этим фундаментальным принципам безопасности:

1. **Защита в глубину**: Реализуйте несколько слоев управления безопасностью
2. **Принцип минимального привилегия**: Предоставляйте только минимально необходимые права доступа
3. **Валидация входных данных**: Никогда не доверяйте пользовательскому вводу
4. **Безопасность по умолчанию**: Безопасность должна быть конфигурацией по умолчанию
5. **Простота**: Сложные системы сложнее защищать

## Связанная документация

- CSRF-Protection - Система токенов и класс XoopsSecurity
- Input-Sanitization - MyTextSanitizer и валидация
- SQL-Injection-Prevention - Практики безопасности базы данных

## Контрольный список быстрой справки

Перед выпуском вашего модуля убедитесь:

- [ ] Все формы включают токены XOOPS
- [ ] Все пользовательские входные данные валидируются и очищаются
- [ ] Все выходные данные должным образом экранируются
- [ ] Все запросы к базе данных используют параметризованные выражения
- [ ] Загрузки файлов должным образом валидируются
- [ ] Проверки аутентификации и авторизации на месте
- [ ] Обработка ошибок не раскрывает конфиденциальную информацию
- [ ] Конфиденциальная конфигурация защищена
- [ ] Библиотеки третьих сторон актуальны
- [ ] Проведено тестирование безопасности

## Аутентификация и авторизация

### Проверка аутентификации пользователя

```php
// Проверка, вошёл ли пользователь
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Проверка прав доступа пользователя

```php
// Проверка, имеет ли пользователь право доступа к этому модулю
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Проверка определённого разрешения
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### Настройка разрешений модуля

```php
// Создание разрешения в функции установки/обновления
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Добавление разрешения для всех групп
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## Безопасность сеанса

### Лучшие практики обработки сеанса

1. Не сохраняйте конфиденциальную информацию в сеансе
2. Регенерируйте ID сеанса после входа/изменения привилегий
3. Валидируйте данные сеанса перед использованием

```php
// Регенерация ID сеанса после входа
session_regenerate_id(true);

// Валидация данных сеанса
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Проверка наличия пользователя в базе данных
}
```

### Предотвращение фиксации сеанса

```php
// После успешного входа
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// При последующих запросах
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Возможная попытка перехвата сеанса
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## Безопасность загрузки файлов

### Валидация загрузки файлов

```php
// Проверка корректной загрузки файла
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Проверка размера файла
if ($_FILES['userfile']['size'] > 1000000) { // Лимит 1MB
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Проверка типа файла
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Валидация расширения файла
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### Использование загрузчика XOOPS

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Сохранение имени файла в базе данных
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### Безопасное сохранение загруженных файлов

```php
// Определение каталога загрузки вне веб-корня
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Создание каталога, если его не существует
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Перемещение загруженного файла
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## Обработка ошибок и логирование

### Безопасная обработка ошибок

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Логирование ошибки
    xoops_error($e->getMessage());

    // Вывод общего сообщения об ошибке пользователю
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### Логирование событий безопасности

```php
// Логирование событий безопасности
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## Безопасность конфигурации

### Сохранение конфиденциальной конфигурации

```php
// Определение пути конфигурации вне веб-корня
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Загрузка конфигурации
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Обработка отсутствующей конфигурации
}
```

### Защита файлов конфигурации

Используйте `.htaccess` для защиты файлов конфигурации:

```apache
# В .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## Библиотеки третьих сторон

### Выбор библиотек

1. Выбирайте активно поддерживаемые библиотеки
2. Проверяйте на уязвимости безопасности
3. Убедитесь, что лицензия библиотеки совместима с XOOPS

### Обновление библиотек

```php
// Проверка версии библиотеки
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### Изоляция библиотек

```php
// Загрузка библиотеки контролируемым способом
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## Тестирование безопасности

### Контрольный список ручного тестирования

1. Тестируйте все формы с неправильными входными данными
2. Попытайтесь обойти аутентификацию и авторизацию
3. Протестируйте функцию загрузки файлов с вредоносными файлами
4. Проверьте на XSS уязвимости во всём выводе
5. Протестируйте на SQL инъекции во всех запросах к базе данных

### Автоматизированное тестирование

Используйте автоматизированные инструменты для сканирования уязвимостей:

1. Инструменты статического анализа кода
2. Сканеры веб-приложений
3. Проверки зависимостей для библиотек третьих сторон

## Экранирование выходных данных

### Контекст HTML

```php
// Для обычного HTML-контента
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Использование MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### Контекст JavaScript

```php
// Для данных, используемых в JavaScript
echo json_encode($variable);

// Для встроенного JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### Контекст URL

```php
// Для данных, используемых в URL
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### Переменные шаблона

```php
// Назначение переменных шаблону Smarty
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// Для HTML-контента, который должен отображаться как есть
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## Ресурсы

- [OWASP Top Ten](https://owasp.org/www-project-top-ten/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS Documentation](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization
