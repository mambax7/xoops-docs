---
title: "Базова конфігурація"
description: "Початкове налаштування XOOPS, включаючи налаштування mainfile.php, назву сайту, електронну адресу та налаштування часового поясу"
---
# Базова конфігурація XOOPS

Цей посібник охоплює основні параметри конфігурації, щоб ваш сайт XOOPS працював належним чином після встановлення.

Конфігурація ## mainfile.php

Файл `mainfile.php` містить критичну конфігурацію для встановлення XOOPS. Він створений під час встановлення, але вам, можливо, доведеться відредагувати його вручну.

### Розташування
```
/var/www/html/xoops/mainfile.php
```
### Структура файлу
```php
<?php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');  // Database type
define('XOOPS_DB_HOST', 'localhost');  // Database host
define('XOOPS_DB_USER', 'xoops_user');  // Database user
define('XOOPS_DB_PASS', 'password');  // Database password
define('XOOPS_DB_NAME', 'xoops_db');  // Database name
define('XOOPS_DB_PREFIX', 'xoops_');  // Table prefix

// Site Configuration
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // File system path
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Web URL
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Trusted path

// Character Set
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Database charset
define('_CHARSET', 'UTF-8');  // Page charset

// Debug Mode (set to 0 in production)
define('XOOPS_DEBUG', 0);  // Set to 1 for debugging
?>
```
### Пояснення критичних параметрів

| Налаштування | Призначення | Приклад |
|---|---|---|
| `XOOPS_DB_TYPE` | Система баз даних | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Розташування сервера бази даних | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Ім'я користувача бази даних | `xoops_user` |
| `XOOPS_DB_PASS` | Пароль бази даних | [безпечний_пароль] |
| `XOOPS_DB_NAME` | Назва бази даних | `xoops_db` |
| `XOOPS_DB_PREFIX` | Префікс імені таблиці | `xoops_` (дозволяє кілька XOOPS в одній БД) |
| `XOOPS_ROOT_PATH` | Шлях до фізичної файлової системи | `/var/www/html/xoops` |
| `XOOPS_URL` | Доступ в Інтернеті URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Надійний шлях (поза кореневим веб-сайтом) | `/var/www/xoops_var` |

### Редагування mainfile.php

Відкрийте mainfile.php у текстовому редакторі:
```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```
### Загальні зміни mainfile.php

**Змінити сайт URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```
**Увімкнути режим налагодження (тільки для розробки):**
```php
define('XOOPS_DEBUG', 1);
```
**Змінити префікс таблиці (за потреби):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**Перемістити довірчий шлях за межі кореневого веб-сайту (розширений):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## Конфігурація панелі адміністратора

Налаштуйте основні параметри через панель адміністратора XOOPS.

### Доступ до налаштувань системи

1. Увійдіть до панелі адміністратора: `http://your-domain.com/xoops/admin/`
2. Перейдіть до: **Система > Параметри > Загальні параметри**
3. Змініть налаштування (див. нижче)
4. Натисніть «Зберегти» внизу

### Назва та опис сайту

Налаштуйте вигляд сайту:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### Контактна інформація

Встановити контактні дані сайту:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### Мова та регіон

Встановити мову та регіон за умовчанням:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## Конфігурація електронної пошти

Налаштуйте параметри електронної пошти для сповіщень і спілкування користувачів.

### Розташування налаштувань електронної пошти

**Панель адміністратора:** Система > Налаштування > Налаштування електронної пошти

### Конфігурація SMTP

Для надійної доставки електронної пошти використовуйте SMTP замість PHP mail():
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### Приклад конфігурації Gmail

Налаштуйте XOOPS для надсилання електронної пошти через Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**Примітка.** Для Gmail потрібен пароль програми, а не ваш пароль Gmail:
1. Перейдіть до https://myaccount.google.com/apppasswords
2. Створіть пароль програми для «Пошти» та «Комп’ютера Windows»
3. Використовуйте згенерований пароль у XOOPS

### PHP mail() Конфігурація (Простіша, але менш надійна)

Якщо SMTP недоступний, використовуйте PHP mail():
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
Переконайтеся, що на вашому сервері налаштовано sendmail або postfix:
```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### Налаштування функції електронної пошти

Налаштуйте, що запускає електронні листи:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## Конфігурація часового поясу

Встановіть правильний часовий пояс для правильних позначок часу та планування.

### Налаштування часового поясу в панелі адміністратора

**Шлях:** Система > Параметри > Загальні параметри
```
Default Timezone: [Select your timezone]
```
**Загальні часові пояси:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Перевірте часовий пояс

Перевірте поточний часовий пояс сервера:
```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### Встановити системний часовий пояс (Linux)
```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## Конфігурація URL

### Увімкнути чисті URL-адреси (дружні URL-адреси)

Для таких URL-адрес, як `/page/about` замість `/index.php?page=about`

**Вимоги:**
- Apache з увімкненим mod_rewrite
- файл `.htaccess` у кореневому каталозі XOOPS

**Увімкнути в панелі адміністратора:**

1. Перейдіть до: **Система > Налаштування > Налаштування URL**
2. Поставте галочку: «Увімкнути дружні URL-адреси»
3. Виберіть: «URL Type» (Інформація про шлях або запит)
4. Зберегти

**Перевірте наявність .htaccess:**
```bash
cat /var/www/html/xoops/.htaccess
```
Зразок вмісту .htaccess:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**Усунення несправностей із чистими URL-адресами:**
```bash
# Verify mod_rewrite enabled
apache2ctl -M | grep rewrite

# Enable if needed
a2enmod rewrite

# Restart Apache
systemctl restart apache2

# Test rewrite rule
curl -I http://your-domain.com/xoops/index.php
```
### Налаштувати сайт URL

**Панель адміністратора:** Система > Параметри > Загальні налаштування

Установіть правильний URL для свого домену:
```
Site URL: http://your-domain.com/xoops/
```
Або якщо XOOPS знаходиться в root:
```
Site URL: http://your-domain.com/
```
## Пошукова оптимізація (SEO)

Налаштуйте параметри SEO для кращої видимості пошукової системи.

### Мета-теги

Встановити глобальні мета-теги:

**Панель адміністратора:** Система > Налаштування > Налаштування SEO
```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```
Вони з’являються на сторінці `<head>`:
```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### Карта сайту

Увімкнути карту сайту XML для пошукових систем:

1. Перейдіть до: **Система > Модулі**
2. Знайдіть модуль «Карта сайту».
3. Натисніть, щоб установити та ввімкнути
4. Доступ до карти сайту: `/xoops/sitemap.xml`

### Robots.txt

Керуйте скануванням пошукової системи:

Створити `/var/www/html/xoops/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```
## Налаштування користувача

Налаштувати параметри користувача за замовчуванням.

### Реєстрація користувача

**Панель адміністратора:** Система > Параметри > Параметри користувача
```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```
### Профіль користувача
```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### Відображення електронної пошти користувача
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## Конфігурація кешу

Підвищте продуктивність за допомогою належного кешування.

### Параметри кешу

**Панель адміністратора:** Система > Параметри > Параметри кешу
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### Очистити кеш

Очистити старі файли кешу:
```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## Контрольний список початкових налаштувань

Після встановлення налаштуйте:

- [ ] Правильно встановлено назву та опис сайту
- [ ] Налаштовано електронну адресу адміністратора
- [ ] Параметри електронної пошти SMTP налаштовано та протестовано
- [ ] Часовий пояс встановлено відповідно до вашого регіону
- [ ] URL налаштовано правильно
- [ ] Чисті URL-адреси (дружні URL-адреси) увімкнено, якщо потрібно
- [ ] Параметри реєстрації користувача налаштовано
- [ ] Налаштовано мета-теги для SEO
- [ ] Вибрано мову за замовчуванням
- [ ] Параметри кешу ввімкнено
- [ ] Пароль адміністратора надійний (16+ символів)
- [ ] Реєстрація тестового користувача
- [ ] Перевірити функціональність електронної пошти
- [ ] Тестове завантаження файлу
- [ ] Відвідайте домашню сторінку та перевірте зовнішній вигляд

## Конфігурація тестування

### Перевірка електронної пошти

Надіслати тестовий електронний лист:

**Панель адміністратора:** Система > Перевірка електронної пошти

Або вручну:
```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('XOOPS Email Test');
$mailer->setBody('This is a test email from XOOPS');

if ($mailer->send()) {
    echo "Email sent successfully!";
} else {
    echo "Failed to send email: " . $mailer->getError();
}
?>
```
### Перевірте підключення до бази даних
```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Database connected successfully!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Query successful!";
    }
} else {
    echo "Database connection failed!";
}
?>
```
**Важливо:** Видаліть тестові файли після тестування!
```bash
rm /var/www/html/xoops/test-*.php
```
## Короткий опис файлів конфігурації

| Файл | Призначення | Метод редагування |
|---|---|---|
| основний файл.php | Налаштування бази даних і ядра | Текстовий редактор |
| Панель адміністратора | Більшість налаштувань | Веб-інтерфейс |
| .htaccess | URL переписування | Текстовий редактор |
| robots.txt | Сканування пошукової системи | Текстовий редактор |

## Наступні кроки

Після базової конфігурації:

1. Детально налаштуйте параметри системи
2. Посилити безпеку
3. Перегляньте панель адміністратора
4. Створіть свій перший контент
5. Налаштуйте облікові записи користувачів

---

**Теги:** #конфігурація #налаштування #електронна пошта #часовий пояс #seo

**Пов’язані статті:**
- ../Installation/Installation
- Параметри системи
- Конфігурація безпеки
- Оптимізація продуктивності