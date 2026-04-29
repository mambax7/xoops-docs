---
title: "Найкращі методи безпеки"
description: "Вичерпний посібник із безпеки для розробки модуля XOOPS"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[API безпеки стабільні в усіх версіях]
Практики безпеки та API, задокументовані тут, працюють як у XOOPS 2.5.x, так і в XOOPS 4.0.x. Основні класи безпеки (`XoopsSecurity`, `MyTextSanitizer`) залишаються стабільними.
:::

У цьому документі наведено найкращі методи безпеки для розробників модулів XOOPS. Дотримання цих вказівок допоможе переконатися, що ваші модулі безпечні та не створюють уразливості в інсталяції XOOPS.

## Принципи безпеки

Кожен розробник XOOPS повинен дотримуватися таких основних принципів безпеки:

1. **Поглиблений захист**: запровадьте кілька рівнів контролю безпеки
2. **Найменший привілей**: надайте лише мінімально необхідні права доступу
3. **Перевірка введених даних**: Ніколи не довіряйте введеним користувачами
4. **Захищено за замовчуванням**: Безпека має бути конфігурацією за замовчуванням
5. **Зробіть це просто**: складні системи важче захистити

## Пов'язана документація

- CSRF-Protection - система маркерів і клас XoopsSecurity
- Очистка введення - MyTextSanitizer і перевірка
- SQL-Injection-Prevention - Методи безпеки бази даних

## Короткий контрольний список

Перш ніж випускати свій модуль, перевірте:

- [ ] Усі форми містять маркери XOOPS
- [ ] Усі дані користувача перевіряються та очищаються
- [ ] Весь вивід правильно екранований
- [ ] Усі запити до бази даних використовують параметризовані оператори
- [ ] Завантаження файлів належним чином перевірено
- [ ] Перевірки автентифікації та авторизації на місці
- [ ] Обробка помилок не розкриває конфіденційну інформацію
- [ ] Конфігурація конфіденційна захищена
- [ ] Бібліотеки сторонніх розробників оновлені
- [ ] Тестування безпеки виконано

## Автентифікація та авторизація

### Перевірка автентифікації користувача
```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### Перевірка дозволів користувача
```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```
### Налаштування дозволів модуля
```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```
## Безпека сеансу

### Найкращі методи обробки сеансів

1. Не зберігайте конфіденційну інформацію під час сеансу
2. Відновити ідентифікатори сеансу після змін login/privilege
3. Перевірте дані сеансу перед їх використанням
```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```
### Запобігання фіксації сеансу
```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```
## Безпека завантаження файлів

### Перевірка завантаження файлів
```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```
### Використання XOOPS Uploader
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
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```
### Безпечне зберігання завантажених файлів
```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```
## Обробка помилок і журналювання

### Безпечна обробка помилок
```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```
### Реєстрація подій безпеки
```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```
## Безпека конфігурації

### Зберігання конфіденційної конфігурації
```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```
### Захист конфігураційних файлів

Використовуйте `.htaccess` для захисту конфігураційних файлів:
```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```
## Бібліотеки сторонніх розробників

### Вибір бібліотек

1. Вибирайте активно підтримувані бібліотеки
2. Перевірте наявність уразливостей у безпеці
3. Переконайтеся, що ліцензія бібліотеки сумісна з XOOPS

### Оновлення бібліотек
```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```
### Ізоляція бібліотек
```php
// Load library in a controlled way
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
## Тестування безпеки

### Контрольний список ручного тестування

1. Перевірте всі форми з неправильними введеннями
2. Спроба обійти автентифікацію та авторизацію
3. Перевірте функцію завантаження файлів зі шкідливими файлами
4. Перевірте XSS-уразливості в усіх вихідних даних
5. Перевірте впровадження SQL у всі запити бази даних

### Автоматичне тестування

Використовуйте автоматизовані інструменти для пошуку вразливостей:

1. Інструменти статичного аналізу коду
2. Сканери веб-додатків
3. Перевірка залежностей для сторонніх бібліотек

## Екранування виводу

### HTML Контекст
```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```
### JavaScript Контекст
```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```
### URL Контекст
```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```
### Змінні шаблону
```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```
## Ресурси

- [Десять найкращих OWASP](https://owasp.org/www-project-top-ten/)
- [PHP Шпаргалка безпеки](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [Документація XOOPS](https://xoops.org/)

---

#security #best-practices #xoops #module-development #authentication #authorization