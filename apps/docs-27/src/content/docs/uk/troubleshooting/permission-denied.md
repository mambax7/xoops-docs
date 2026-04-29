---
title: "Помилки дозволу заборонено"
description: "Усунення проблем із дозволами файлів і каталогів у XOOPS"
---
Проблеми з дозволами на файли та каталоги є поширеними при інсталяціях XOOPS, особливо після завантаження або міграції сервера. Цей посібник допоможе діагностувати та вирішити проблеми з дозволами.

## Розуміння дозволів на файли

### Linux/Unix Основи дозволів

Права доступу до файлів представлені у вигляді тризначних кодів:
```
rwxrwxrwx
||| ||| |||
||| ||| +-- Others (world)
||| +------ Group
+--------- Owner

r = read (4)
w = write (2)
x = execute (1)

755 = rwxr-xr-x (owner full, group read/execute, others read/execute)
644 = rw-r--r-- (owner read/write, group read, others read)
777 = rwxrwxrwx (everyone full access - NOT RECOMMENDED)
```
## Поширені помилки дозволу

### "Дозвіл заборонено" у завантаженні
```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```
### "Неможливо записати файл"
```
Error: Unable to write file to /var/www/html/xoops/cache/
```
### "Не вдається створити каталог"
```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```
## Критичні XOOPS Каталоги

### Каталоги, що вимагають дозволу на запис

| Довідник | Мінімальна | Призначення |
|-----------|---------|---------|
| `/uploads` | 755 | Завантаження користувачів |
| `/cache` | 755 | Файли кешу |
| `/templates_c` | 755 | Складені шаблони |
| `/var` | 755 | Змінні дані |
| `mainfile.php` | 644 | Конфігурація (читається) |

## Linux/Unix Усунення несправностей

### Крок 1: Перевірте поточні дозволи
```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```
### Крок 2: Ідентифікуйте користувача веб-сервера
```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```
### Крок 3. Виправте право власності
```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```
### Крок 4. Виправте дозволи

#### Варіант A: Обмежувальні дозволи (рекомендовано)
```bash
# All directories: 755 (rwxr-xr-x)
find /var/www/html/xoops -type d -exec chmod 755 {} \;

# All files: 644 (rw-r--r--)
find /var/www/html/xoops -type f -exec chmod 644 {} \;

# Except writable directories
chmod 755 /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/var/
```
#### Варіант Б: Сценарій «Все за одним».
```bash
#!/bin/bash
# fix-permissions.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

echo "Fixing XOOPS permissions..."

# Set ownership
sudo chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set directory permissions
find $XOOPS_PATH -type d -exec chmod 755 {} \;

# Set file permissions
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ensure writable directories
chmod 755 $XOOPS_PATH/uploads/
chmod 755 $XOOPS_PATH/cache/
chmod 755 $XOOPS_PATH/templates_c/
chmod 755 $XOOPS_PATH/var/

echo "Done! Permissions fixed."
```
## Проблеми з дозволом за каталогом

### Каталог завантажень

**Проблема:** не вдається завантажити файли
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```
### Каталог кешу

**Проблема:** Файли кешу не записуються
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```
### Кеш шаблонів

**Проблема:** Шаблони не компілюються
```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```
## Усунення несправностей Windows

### Крок 1: Перевірте властивості файлу

1. Клацніть правою кнопкою миші файл → Властивості
2. Перейдіть на вкладку «Безпека».
3. Натисніть кнопку «Змінити».
4. Виберіть користувача та перевірте дозволи

### Крок 2: Надайте дозволи на запис

#### Через GUI:
```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```
#### Через командний рядок (PowerShell):
```powershell
# Run PowerShell as Administrator

# Grant IIS app pool permissions
$path = "C:\inetpub\wwwroot\xoops\uploads"
$acl = Get-Acl $path
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule(
    "IIS_IUSRS",
    "Modify",
    "ContainerInherit,ObjectInherit",
    "None",
    "Allow"
)
$acl.SetAccessRule($rule)
Set-Acl -Path $path -AclObject $acl
```
## PHP Сценарій для перевірки дозволів
```php
<?php
// check-xoops-permissions.php

$paths = [
    XOOPS_ROOT_PATH . '/uploads' => 'uploads',
    XOOPS_ROOT_PATH . '/cache' => 'cache',
    XOOPS_ROOT_PATH . '/templates_c' => 'templates_c',
    XOOPS_ROOT_PATH . '/var' => 'var',
    XOOPS_ROOT_PATH . '/mainfile.php' => 'mainfile.php'
];

echo "<h2>XOOPS Permission Check</h2>";
echo "<table border='1'>";
echo "<tr><th>Path</th><th>Readable</th><th>Writable</th></tr>";

foreach ($paths as $path => $name) {
    $readable = is_readable($path) ? 'YES' : 'NO';
    $writable = is_writable($path) ? 'YES' : 'NO';

    echo "<tr>";
    echo "<td>$name</td>";
    echo "<td style='background: " . ($readable === 'YES' ? 'green' : 'red') . "'>$readable</td>";
    echo "<td style='background: " . ($writable === 'YES' ? 'green' : 'red') . "'>$writable</td>";
    echo "</tr>";
}

echo "</table>";
?>
```
## Найкращі практики

### 1. Принцип найменших привілеїв
```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```
### 2. Резервне копіювання перед змінами
```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```
## Коротка довідка
```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```
## Пов'язана документація

- Білий екран смерті - інші типові помилки
- Database-Connection-Errors - Проблеми з базою даних
- ../../01-Getting-Started/Configuration/System-Settings - XOOPS конфігурація

---

**Останнє оновлення:** 2026-01-31
**Стосується:** XOOPS 2.5.7+
**ОС:** Linux, Windows, macOS