---
title: "Усунення несправностей"
description: "Рішення типових XOOPS проблем, методи налагодження та FAQ"
---
> Рішення типових проблем і методи налагодження для XOOPS CMS.

---

## 📋 Швидка діагностика

Перш ніж заглиблюватися в конкретні проблеми, перевірте ці поширені причини:

1. **Дозволи на файли** – для каталогів потрібно 755, для файлів – 644
2. **PHP Версія** - Переконайтеся, що PHP 7.4+ (рекомендується 8.x)
3. **Журнали помилок** - Перевірте журнали помилок `xoops_data/logs/` і PHP
4. **Кеш** - очистіть кеш у Адміністраторі → Система → Технічне обслуговування

---

## 🗂️ Зміст розділу

### Поширені проблеми
- Білий екран смерті (WSOD)
- Помилки підключення до бази даних
- Помилки дозволу заборонено
- Помилки встановлення модуля
- Помилки компіляції шаблону

### FAQ
- Встановлення FAQ
- Модуль FAQ
- Тема FAQ
- Продуктивність FAQ

### Налагодження
- Увімкнення режиму налагодження
- Використання Ray Debugger
— Налагодження запитів до бази даних
— Налагодження шаблону Smarty

---

## 🚨 Поширені проблеми та рішення

### Білий екран смерті (WSOD)

**Симптоми:** Порожня біла сторінка, повідомлення про помилку відсутнє

**Рішення:**

1. **Тимчасово ввімкнути відображення помилок PHP:**   
```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   
```
2. **Перевірити журнал помилок PHP:**   
```bash
   tail -f /var/log/php/error.log
   
```
3. **Поширені причини:**
   - Перевищено ліміт пам'яті
   - Фатальна PHP синтаксична помилка
   - Відсутнє необхідне розширення

4. **Виправити проблеми з пам’яттю:**   
```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   
```
---

### Помилки підключення до бази даних

**Симптоми:** «Не вдається підключитися до бази даних» або подібне

**Рішення:**

1. **Перевірте облікові дані в mainfile.php:**   
```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   
```
2. **Перевірте з’єднання вручну:**   
```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   
```
3. **Перевірте службу MySQL:**   
```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   
```
4. **Перевірте дозволи користувача:**   
```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   
```
---

### Помилки дозволу заборонено

**Симптоми:** Неможливо завантажити файли, неможливо зберегти налаштування

**Рішення:**

1. **Установіть правильні дозволи:**   
```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   
```
2. **Установіть правильне право власності:**   
```bash
   chown -R www-data:www-data /path/to/xoops
   
```
3. **Перевірте SELinux (CentOS/RHEL):**   
```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   
```
---

### Помилки встановлення модуля

**Симптоми:** Модуль не встановлюється, SQL помилок

**Рішення:**

1. **Перевірте вимоги до модуля:**
   - Сумісність версії PHP
   - Необхідні розширення PHP
   - Сумісність версії XOOPS

2. **Ручне встановлення SQL:**   
```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   
```
3. **Очистити кеш модуля:**   
```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   
```
4. **Перевірте xoops_version.php syntax:**   
```bash
   php -l modules/mymodule/xoops_version.php
   
```
---

### Помилки компіляції шаблону

**Симптоми:** помилки Smarty, шаблон не знайдено

**Рішення:**

1. **Очистити кеш Smarty:**   
```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   
```
2. **Перевірте синтаксис шаблону:**   
```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   
```
3. **Перевірте наявність шаблону:**   
```bash
   ls modules/mymodule/templates/
   
```
4. **Відновити шаблони:**
   - Адміністратор → Система → Обслуговування → Шаблони → Відновити

---

## 🐛 Методи налагодження

### Увімкнути XOOPS режим налагодження
```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```
### Використання Ray Debugger

Ray є чудовим інструментом налагодження для PHP:
```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```
### Smarty Debug Console
```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```
### Журнал запитів до бази даних
```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```
---

## ❓ Часті запитання

### Установка

**З: Майстер інсталяції показує порожню сторінку**
A: Перевірте журнали помилок PHP, переконайтеся, що PHP має достатньо пам’яті, перевірте права доступу до файлів.

**З: Неможливо записати в основний файл.php during installation**
A: Встановіть дозволи: `chmod 666 mainfile.php` під час встановлення, потім `chmod 444` після.

**П: таблиці бази даних не створено**
A: Перевірте, чи має користувач MySQL привілеї CREATE TABLE, перевірте наявність бази даних.

### Модулі

**З: Сторінка адміністратора модуля порожня**
A: Очистіть кеш, перевірте модуль admin/menu.php на наявність синтаксичних помилок.

**З: Модульні блоки не відображаються**
A: Перевірте дозволи на блокування в Адміністратор → Блоки, переконайтеся, що блокування призначено сторінкам.

**П: Не вдається оновити модуль**
A: Створіть резервну копію бази даних, спробуйте вручну SQL оновлення, перевірте вимоги до версії.

### Теми

**З: Тема не застосовується належним чином**
A: Очистіть кеш Smarty, перевірте наявність theme.html, перевірте дозволи теми.

**З: Спеціальний CSS не завантажується**
A: Перевірте шлях до файлу, очистіть кеш браузера, перевірте синтаксис CSS.

**П: Зображення не відображаються**
A: Перевірте шляхи до зображень, перевірте дозволи папки завантажень.

### Продуктивність

**З: Сайт дуже повільний**
A: Увімкніть кешування, оптимізуйте базу даних, перевірте наявність повільних запитів, увімкніть OpCache.

**З: Велике використання пам’яті**
A: Збільште memory_limit, оптимізуйте великі запити, запровадьте розбиття на сторінки.---

## 🔧 Команди обслуговування

### Очистити всі кеші
```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```
### Оптимізація бази даних
```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```
### Перевірте цілісність файлу
```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```
---

## 🔗 Пов’язана документація

- Початок роботи
- Найкращі методи безпеки
- XOOPS 4.0 Дорожня карта

---

## 📚 Зовнішні ресурси

- [XOOPS Форуми](https://XOOPS.org/modules/newbb/)
- [Проблеми GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [PHP Посилання на помилку](https://www.php.net/manual/en/errorfunc.constants.php)

---

#XOOPS #усунення несправностей #debugging #faq #errors #solutions