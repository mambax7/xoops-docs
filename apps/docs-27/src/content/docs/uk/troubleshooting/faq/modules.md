---
title: "Модуль FAQ"
description: "Поширені запитання щодо XOOPS модулів"
---
# Модуль Часті запитання

> Поширені запитання та відповіді щодо модулів XOOPS, встановлення та керування.

---

## Встановлення та активація

### Q: Як мені встановити модуль у XOOPS?

**A:**
1. Завантажте zip-файл модуля
2. Перейдіть до XOOPS Адміністратор > Модулі > Керування модулями
3. Натисніть «Огляд» і виберіть файл zip
4. Натисніть «Завантажити»
5. Модуль з'являється в списку (зазвичай деактивований)
6. Натисніть піктограму активації, щоб увімкнути її

Крім того, розпакуйте архів zip безпосередньо в `/xoops_root/modules/` та перейдіть до панелі адміністратора.

---

### З: Завантаження модуля не вдається через «Дозвіл відмовлено»

**A:** Це проблема дозволу на файл:
```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```
Для отримання додаткової інформації див. Помилки встановлення модуля.

---

### Q: Чому я не бачу модуль в панелі адміністратора після встановлення?

**A:** Перевірте наступне:

1. **Модуль не активовано** - клацніть піктограму ока у списку модулів
2. **Відсутня сторінка адміністратора** - Модуль повинен мати `hasAdmin = 1` у версії XOOPS.php
3. **Language files missing** - Need `language/english/admin.php`
4. **Кеш не очищено** - очистіть кеш і оновіть браузер
```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```
---

### З: Як видалити модуль?

**A:**
1. Перейдіть до XOOPS Адміністратор > Модулі > Керування модулями
2. Деактивуйте модуль (клацніть піктограму ока)
3. Натисніть піктограму trash/delete
4. Вручну видаліть папку модуля, якщо ви хочете повністю видалити:
```bash
rm -rf /path/to/xoops/modules/modulename
```
---

## Керування модулями

### Q: Яка різниця між вимкненням і видаленням?

**A:**
- **Вимкнути**: дезактивувати модуль (натисніть значок ока). Таблиці бази даних залишаються.
- **Видалити**: видалити модуль. Видаляє таблиці бази даних і видаляє зі списку.

Щоб справді видалити, також видаліть папку:
```bash
rm -rf modules/modulename
```
---

### З: Як перевірити, чи правильно встановлено модуль?

**A:** Використовуйте сценарій налагодження:
```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```
---

### Q: Чи можу я запустити кілька версій одного модуля?

**A:** Ні, XOOPS не підтримує це оригінально. Однак ви можете:

1. Create a copy with a different directory name: `mymodule` and `mymodule2`
2. Оновіть ім’я каталогу у xoopsversion обох модулів.php
3. Ensure unique database table names

Це не рекомендується, оскільки вони мають однаковий код.

---

## Конфігурація модуля

### Q: Де я можу налаштувати параметри модуля?

**A:**
1. Перейдіть до XOOPS Адміністратор > Модулі
2. Натисніть значок settings/gear поруч із модулем
3. Налаштуйте параметри

Налаштування зберігаються в таблиці `xoops_config`.

**Доступ у коді:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```
---

### З: Як визначити параметри конфігурації модуля?

**A:** У xoopsversion.php:
```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```
---

## Функції модуля

### З: Як додати сторінку адміністратора до свого модуля?

**A:** Створіть структуру:
```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```
У xoopsversion.php:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```
Створити `admin/index.php`:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```
---

### З: Як додати функцію пошуку до свого модуля?

**A:**
1. Встановіть у xoopsversion.php:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```
2. Створіть `search.php`:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```
---

### З: Як додати сповіщення до свого модуля?

**A:**
1. Встановіть у xoopsversion.php:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```
2. Активуйте сповіщення в коді:
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```
---

## Дозволи модуля

### Q: Як встановити дозволи модуля?

**A:**
1. Перейдіть до XOOPS Адміністратор > Модулі > Дозволи модуля
2. Виберіть модуль
3. Виберіть user/group та рівень дозволу
4. Зберегти

**У коді:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```
---

## База даних модуля

### Q: Де зберігаються таблиці бази даних модуля?

**A:** Усе в основній базі даних XOOPS із префіксом вашої таблиці (зазвичай `xoops_`):
```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```
---

### З: Як оновити таблиці бази даних модуля?

**A:** Створіть сценарій оновлення у своєму модулі:
```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```
---

## Залежності модулів

### З: Як перевірити, чи встановлено необхідні модулі?

**A:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```
---

### З: Чи можуть модулі залежати від інших модулів?

**A:** Так, оголосити в xoopsversion.php:
```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```
---

## Усунення несправностей

### Q: Модуль з'являється в списку, але не активується

**A:** Перевірити:
1. xoopsversion.php syntax - Use PHP linter:
```bash
php -l modules/mymodule/xoopsversion.php
```
2. Файл бази даних SQL:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```
3. Мовні файли:
```bash
ls -la modules/mymodule/language/english/
```
Див. Помилки встановлення модуля для детальної діагностики.

---

### Q: Модуль активовано, але не відображається на головному сайті

**A:**
1. Встановіть `hasMain = 1` у xoopsversion.php:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```
2. Створіть `modules/mymodule/index.php`:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```
---

### Q: Модуль викликає "білий екран смерті"

**A:** Увімкніть налагодження, щоб знайти помилку:
```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```
Перевірте журнал помилок:
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```
Дивіться Білий екран смерті для вирішення.

---

## Продуктивність

### Q: Модуль працює повільно, як оптимізувати?

**A:**
1. **Перевірте запити до бази даних** - використовуйте журнал запитів
2. **Дані кешу** - використовувати кеш XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```
3. **Оптимізуйте шаблони** - уникайте петель у шаблонах
4. **Увімкнути кеш коду операції PHP** - APCu, XDebug тощо.

Див. Продуктивність FAQ для отримання додаткової інформації.

---

## Розробка модуля

### Q: Де я можу знайти документацію щодо розробки модуля?

**A:** Дивіться:
- Посібник із розробки модуля
- Модульна структура
- Створення вашого першого модуля

---

## Пов'язана документація

- Помилки встановлення модуля
- Модульна структура
- Продуктивність FAQ
- Увімкнути режим налагодження

---

#XOOPS #modules #faq #troubleshooting