---
title: "הרשאה נדחתה שגיאות"
description: "פתרון בעיות של הרשאות קבצים וספריות ב-XOOPS"
---

בעיות הרשאות קבצים וספריות שכיחות בהתקנות XOOPS, במיוחד לאחר העלאה או העברת שרת. מדריך זה עוזר לאבחן ולפתור בעיות הרשאות.

## הבנת הרשאות קובץ

### Linux/Unix יסודות ההרשאה

הרשאות קובץ מיוצגות כקודים בני שלוש ספרות:

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

## שגיאות הרשאה נפוצות

### "הרשאה נדחתה" בהעלאה

```
Warning: fopen(/var/www/html/xoops/uploads/file.jpg): failed to open stream:
Permission denied in /var/www/html/xoops/class/file.php on line 42
```

### "לא ניתן לכתוב קובץ"

```
Error: Unable to write file to /var/www/html/xoops/cache/
```

### "לא ניתן ליצור ספרייה"

```
Error: mkdir(/var/www/html/xoops/uploads/temp/): Permission denied
```

## מדריכי XOOPS קריטיים

### ספריות הדורשות הרשאות כתיבה

| מדריך | מינימום | מטרה |
|-----------|--------|--------|
| `/uploads` | 755 | העלאות משתמשים |
| `/cache` | 755 | קבצי cache |
| `/templates_c` | 755 | תבניות מלוקטות |
| `/var` | 755 | נתונים משתנים |
| `mainfile.php` | 644 | תצורה (ניתן לקריאה) |

## Linux/Unix פתרון בעיות

### שלב 1: בדוק הרשאות נוכחיות

```bash
# Check file permissions
ls -l /var/www/html/xoops/

# Check specific file
ls -l /var/www/html/xoops/mainfile.php

# Check directory permissions
ls -ld /var/www/html/xoops/uploads/
```

### שלב 2: זיהוי משתמש בשרת האינטרנט

```bash
# Check Apache user
ps aux | grep -E '[a]pache|[h]ttpd'
# Usually: www-data (Debian/Ubuntu) or apache (RedHat/CentOS)

# Check Nginx user
ps aux | grep -E '[n]ginx'
# Usually: www-data or nginx
```

### שלב 3: תקן בעלות

```bash
# Set correct ownership (assuming www-data user)
sudo chown -R www-data:www-data /var/www/html/xoops/

# Fix only web-writable directories
sudo chown www-data:www-data /var/www/html/xoops/uploads/
sudo chown www-data:www-data /var/www/html/xoops/cache/
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
sudo chown www-data:www-data /var/www/html/xoops/var/
```

### שלב 4: תקן הרשאות

#### אפשרות א': הרשאות מגבילות (מומלץ)

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

#### אפשרות ב': סקריפט הכל בבת אחת

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

## בעיות הרשאות לפי ספרייה

### ספריית העלאות

**בעיה:** לא מצליח להעלות קבצים

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/uploads/
chmod 755 /var/www/html/xoops/uploads/
find /var/www/html/xoops/uploads -type f -exec chmod 644 {} \;
find /var/www/html/xoops/uploads -type d -exec chmod 755 {} \;
```

### ספריית cache

**בעיה:** קבצי cache לא נכתבים

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/cache/
chmod 755 /var/www/html/xoops/cache/
```

### cache תבניות

**בעיה:** תבניות לא מתקיימות

```bash
# Solution
sudo chown www-data:www-data /var/www/html/xoops/templates_c/
chmod 755 /var/www/html/xoops/templates_c/
```

## פתרון בעיות של Windows

### שלב 1: בדוק את מאפייני הקובץ

1. לחץ לחיצה ימנית על קובץ ← מאפיינים
2. לחץ על הכרטיסייה "אבטחה".
3. לחץ על כפתור "ערוך".
4. בחר משתמש ואמת הרשאות

### שלב 2: הענק הרשאות כתיבה

#### דרך GUI:

```
1. Right-click folder → Properties
2. Select "Security" tab
3. Click "Edit"
4. Select "IIS_IUSRS" or "NETWORK SERVICE"
5. Check "Modify" and "Write"
6. Click "Apply" and "OK"
```

#### דרך שורת הפקודה (PowerShell):

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

## PHP סקריפט לבדיקת הרשאות

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

## שיטות עבודה מומלצות

### 1. עקרון הזכות הקטנה ביותר

```bash
# Only grant necessary permissions
# Don't use 777 or 666

# Bad
chmod 777 /var/www/html/xoops/uploads/  # Dangerous!

# Good
chmod 755 /var/www/html/xoops/uploads/  # Secure
```

### 2. גיבוי לפני שינויים

```bash
# Backup current state
getfacl -R /var/www/html/xoops > /tmp/xoops-acl-backup.txt
```

## עיון מהיר

```bash
# Quick fix (Linux)
sudo chown -R www-data:www-data /var/www/html/xoops/
find /var/www/html/xoops -type d -exec chmod 755 {} \;
find /var/www/html/xoops -type f -exec chmod 644 {} \;
```

## תיעוד קשור

- לבן-מסך-מוות - שגיאות נפוצות אחרות
- מסד נתונים-חיבור-שגיאות - בעיות במסד נתונים
- ../../01-Getting-Started/Configuration/System-Settings - תצורת XOOPS

---

**עדכון אחרון:** 2026-01-31
**חל על:** XOOPS 2.5.7+
** מערכת הפעלה:** לינוקס, Windows, macOS
