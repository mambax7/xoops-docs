---
title: "Помилки підключення до бази даних"
description: "Посібник з усунення проблем із підключенням до бази даних XOOPS"
---
Помилки підключення до бази даних є одними з найпоширеніших проблем під час встановлення XOOPS. Цей посібник містить систематичні кроки з усунення несправностей для виявлення та вирішення проблем підключення.

## Поширені повідомлення про помилки

### "Не вдається підключитися до сервера MySQL"
```
Error: Can't connect to MySQL server on 'localhost' (111)
```
Ця помилка зазвичай вказує на те, що сервер MySQL не працює або недоступний.

### "Користувачу заборонено доступ"
```
Error: Access denied for user 'xoops_user'@'localhost' (using password: YES)
```
Це вказує на неправильні облікові дані бази даних у вашій конфігурації.

### "Невідома база даних"
```
Error: Unknown database 'xoops_db'
```
Зазначена база даних не існує на сервері MySQL.

## Файли конфігурації

### XOOPS Розташування конфігурації

Основний файл конфігурації знаходиться за адресою:
```
/mainfile.php
```
Основні налаштування бази даних:
```php
// Database Configuration
define('XOOPS_DB_TYPE', 'mysqli');
define('XOOPS_DB_HOST', 'localhost');
define('XOOPS_DB_PORT', '3306');
define('XOOPS_DB_USER', 'xoops_user');
define('XOOPS_DB_PASS', 'your_password');
define('XOOPS_DB_NAME', 'xoops_db');
define('XOOPS_DB_PREFIX', 'xoops_');
```
## Етапи усунення несправностей

### Крок 1. Переконайтеся, що служба MySQL запущена

#### На Linux/Unix
```bash
# Check if MySQL is running
sudo systemctl status mysql

# Start MySQL if not running
sudo systemctl start mysql

# Restart MySQL
sudo systemctl restart mysql
```
### Крок 2: Перевірте підключення MySQL

#### Використання командного рядка
```bash
# Test connection with credentials
mysql -h localhost -u xoops_user -p xoops_db

# If prompted for password, enter it
# Success shows: mysql>

# Exit MySQL
mysql> EXIT;
```
### Крок 3: Перевірте облікові дані бази даних

#### Перевірте конфігурацію XOOPS
```php
// In mainfile.php, verify these constants:
echo "Host: " . XOOPS_DB_HOST . "\n";
echo "User: " . XOOPS_DB_USER . "\n";
echo "Port: " . XOOPS_DB_PORT . "\n";
echo "Database: " . XOOPS_DB_NAME . "\n";
```
### Крок 4: Перевірте існування бази даних
```bash
# Connect to MySQL
mysql -u root -p

# List all databases
SHOW DATABASES;

# Check for your database
SHOW DATABASES LIKE 'xoops_db';

# If not found, create it
CREATE DATABASE xoops_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```
### Крок 5: Перевірте дозволи користувача
```bash
# Connect as root
mysql -u root -p

# Check user privileges
SHOW GRANTS FOR 'xoops_user'@'localhost';

# Grant all privileges if needed
GRANT ALL PRIVILEGES ON xoops_db.* TO 'xoops_user'@'localhost';

# Reload privileges
FLUSH PRIVILEGES;
```
## Поширені проблеми та рішення

### Проблема 1: MySQL не працює

**Симптоми:**
- Помилка підключення відмовлено
- Не вдається підключитися до локального хосту

**Рішення:**
```bash
# Linux: Check and start MySQL
sudo systemctl status mysql
sudo systemctl start mysql
```
### Проблема 2: неправильні облікові дані

**Симптоми:**
- Помилка "Доступ заборонено".
- «за допомогою пароля: ТАК» або «за допомогою пароля: НІ»

**Рішення:**
```bash
# Reset password (as root)
mysql -u root -p

# Change user password
ALTER USER 'xoops_user'@'localhost' IDENTIFIED BY 'new_password';

# Update mainfile.php
define('XOOPS_DB_PASS', 'new_password');
```
### Проблема 3: База даних не створена

**Симптоми:**
- Помилка «Невідома база даних».
- Помилка встановлення під час створення бази даних

**Рішення:**
```bash
# Check if database exists
mysql -u root -p -e "SHOW DATABASES;"

# Create database if missing
mysql -u root -p -e "CREATE DATABASE xoops_db CHARACTER SET utf8mb4;"
```
## Діагностичний скрипт

Створіть повний діагностичний сценарій:
```php
<?php
// diagnose-db.php

echo "=== XOOPS Database Diagnostic ===\n\n";

// Check constants defined
echo "1. Configuration Check:\n";
echo "   Host: " . (defined('XOOPS_DB_HOST') ? XOOPS_DB_HOST : "NOT DEFINED") . "\n";
echo "   User: " . (defined('XOOPS_DB_USER') ? XOOPS_DB_USER : "NOT DEFINED") . "\n";
echo "   Database: " . (defined('XOOPS_DB_NAME') ? XOOPS_DB_NAME : "NOT DEFINED") . "\n\n";

// Check PHP MySQL extension
echo "2. Extension Check:\n";
echo "   MySQLi: " . (extension_loaded('mysqli') ? "YES" : "NO") . "\n\n";

// Test connection
echo "3. Connection Test:\n";
try {
    $conn = new mysqli(
        XOOPS_DB_HOST,
        XOOPS_DB_USER,
        XOOPS_DB_PASS,
        XOOPS_DB_NAME,
        XOOPS_DB_PORT
    );

    if ($conn->connect_error) {
        echo "   FAILED: " . $conn->connect_error . "\n";
    } else {
        echo "   SUCCESS: Connected to MySQL\n";
        echo "   Server Info: " . $conn->get_server_info() . "\n";
        $conn->close();
    }
} catch (Exception $e) {
    echo "   EXCEPTION: " . $e->getMessage() . "\n";
}

echo "\n=== End Diagnostic ===\n";
?>
```
## Пов'язана документація

- White-Screen-of-Death - загальне усунення несправностей WSOD
- ../../01-Getting-Started/Configuration/Performance-Optimization - Налаштування продуктивності бази даних
- ../../06-Publisher-Module/User-Guide/Basic-Configuration - Початкове налаштування XOOPS
- ../../04-API-Reference/Database/XoopsDatabase - Посилання на базу даних API

---

**Останнє оновлення:** 2026-01-31
**Стосується:** XOOPS 2.5.7+
**PHP Версії:** 7.4+