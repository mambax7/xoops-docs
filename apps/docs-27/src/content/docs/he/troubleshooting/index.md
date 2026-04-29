---
title: "פתרון בעיות"
description: "פתרונות לבעיות נפוצות של XOOPS, טכניקות ניפוי באגים ו-FAQ"
---

> פתרונות לבעיות נפוצות וטכניקות ניפוי באגים עבור XOOPS CMS.

---

## 📋 אבחון מהיר

לפני שצולל לבעיות ספציפיות, בדוק את הסיבות הנפוצות הבאות:

1. **הרשאות קבצים** - ספריות צריכות 755, קבצים צריכים 644
2. **גרסת PHP** - ודא PHP 7.4+ (8.x מומלץ)
3. **יומני שגיאות** - בדוק את יומני השגיאות `xoops_data/logs/` ו-PHP
4. **cache** - נקה cache בניהול ← מערכת ← תחזוקה

---

## 🗂️ תוכן המדור

### בעיות נפוצות
- מסך מוות לבן (WSOD)
- שגיאות חיבור למסד נתונים
- שגיאות של הרשאה נדחתה
- כשלים בהתקנת מודול
- שגיאות הידור של תבניות

### FAQ
- התקנה FAQ
- מודול FAQ
- ערכת נושא FAQ
- ביצועים FAQ

### איתור באגים
- הפעלת מצב ניפוי באגים
- שימוש ב-Ray Debugger
- איתור באגים של שאילתות מסד נתונים
- Smarty איתור באגים בתבנית

---

## 🚨 בעיות ופתרונות נפוצים

### מסך מוות לבן (WSOD)

**סימפטומים:** דף לבן ריק, ללא הודעת שגיאה

**פתרונות:**

1. **אפשר תצוגת שגיאה PHP באופן זמני:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **בדוק את יומן השגיאות של PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **סיבות נפוצות:**
   - חרגת ממגבלת הזיכרון
   - שגיאת תחביר קטלנית PHP
   - חסרה הארכה נדרשת

4. **תקן בעיות זיכרון:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### שגיאות חיבור מסד נתונים

**סימפטומים:** "לא ניתן להתחבר למסד נתונים" או דומה

**פתרונות:**

1. **אמת את האישורים ב-mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **בדוק את החיבור באופן ידני:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **בדוק את שירות MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **אמת הרשאות משתמש:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### שגיאות של הרשאה נדחתה

**תסמינים:** לא יכול להעלות קבצים, לא יכול לשמור הגדרות

**פתרונות:**

1. **הגדר הרשאות נכונות:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **הגדר בעלות נכונה:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **בדוק את SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### כשלים בהתקנת מודול

**סימפטומים:** המודול לא יותקן, שגיאות SQL

**פתרונות:**

1. **בדוק את דרישות המודול:**
   - תאימות לגרסת PHP
   - הרחבות PHP נדרשות
   - תאימות לגרסת XOOPS

2. **התקנה ידנית של SQL:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **נקה את cache המודול:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **בדוק את תחביר xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### שגיאות הידור של תבניות

**סימפטומים:** שגיאות Smarty, התבנית לא נמצאה

**פתרונות:**

1. **נקה cache Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **בדוק את תחביר התבנית:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **אמת שתבנית קיימת:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **צור מחדש תבניות:**
   - ניהול → מערכת → תחזוקה → תבניות → צור מחדש

---

## 🐛 טכניקות ניפוי באגים

### הפעל את מצב ניפוי באגים XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### שימוש ב-Ray Debugger

ריי הוא כלי ניפוי באגים מצוין עבור PHP:

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

### Smarty קונסולת ניפוי באגים

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### רישום שאילתות במסד נתונים

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

## ❓ שאלות נפוצות

### התקנה

**ש: אשף ההתקנה מציג עמוד ריק**
ת: בדוק את יומני השגיאות של PHP, ודא של-PHP יש מספיק זיכרון, ודא הרשאות הקובץ.

**ש: לא ניתן לכתוב ל-mainfile.php במהלך ההתקנה**
ת: הגדר הרשאות: `chmod 666 mainfile.php` במהלך ההתקנה, ולאחר מכן `chmod 444`.

**ש: טבלאות מסד נתונים לא נוצרו**
ת: בדוק של-MySQL יש הרשאות CREATE TABLE, ודא שבסיס הנתונים קיים.

### מודולים

**ש: דף ניהול המודול ריק**
ת: נקה את הcache, בדוק את admin/menu.php של המודול עבור שגיאות תחביר.

**ש: בלוקים של מודול לא מוצגים**
ת: בדוק הרשאות חסימה ב-Admin → חסימות, ודא שהחסימה מוקצה לדפים.

**ש: עדכון המודול נכשל**
ת: גיבוי מסד נתונים, נסה עדכוני SQL ידניים, בדוק את דרישות הגרסה.

### ערכות נושא

**ש: הנושא לא חל כהלכה**
ת: נקה את הcache Smarty, בדוק את קיים של theme.html, ודא הרשאות ערכת הנושא.

**ש: CSS מותאם אישית לא נטען**
ת: בדוק את נתיב הקובץ, נקה את הcache של הדפדפן, ודא תחביר CSS.

**ש: תמונות לא מוצגות**
ת: בדוק נתיבי תמונה, ודא הרשאות תיקיית העלאות.

### ביצועים

**ש: האתר איטי מאוד**
ת: הפעל שמירה בcache, בצע אופטימיזציה של מסד הנתונים, בדוק אם יש שאילתות איטיות, הפעל את OpCache.

**ש: שימוש גבוה בזיכרון**
ת: הגדל את memory_limit, בצע אופטימיזציה של שאילתות גדולות, יישם עימוד.

---

## 🔧 פקודות תחזוקה

### נקה את כל המטמונים

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### אופטימיזציה של מסדי נתונים

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### בדוק את תקינות הקובץ

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## 🔗 תיעוד קשור

- תחילת העבודה
- שיטות עבודה מומלצות לאבטחה
- XOOPS 4.0 מפת דרכים

---

## 📚 משאבים חיצוניים

- [XOOPS פורומים](https://xoops.org/modules/newbb/)
- [GitHub Issues](https://github.com/XOOPS/XoopsCore27/issues)
- [הפניה לשגיאה PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #פתרון בעיות #ניפוי באגים #שאלות נפוצות #שגיאות #פתרונות
