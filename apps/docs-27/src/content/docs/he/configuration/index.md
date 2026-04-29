---
title: "תצורה בסיסית"
description: "הגדרה ראשונית של XOOPS כולל הגדרות mainfile.php, שם אתר, דוא"ל ותצורת אזור זמן"
---
# תצורה בסיסית XOOPS

מדריך זה מכסה הגדרות תצורה חיוניות כדי לגרום לאתר XOOPS שלך לפעול כהלכה לאחר ההתקנה.

## תצורת mainfile.php

הקובץ `mainfile.php` מכיל תצורה קריטית עבור התקנת XOOPS שלך. הוא נוצר במהלך ההתקנה, אך ייתכן שיהיה עליך לערוך אותו באופן ידני.

### מיקום
```
/var/www/html/xoops/mainfile.php
```
### מבנה הקובץ
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
### הגדרות קריטיות מוסברות

| הגדרה | מטרה | דוגמה |
|---|---|---|
| `XOOPS_DB_TYPE` | מערכת מסדי נתונים | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | מיקום שרת מסד הנתונים | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | שם משתמש במסד הנתונים | `xoops_user` |
| `XOOPS_DB_PASS` | סיסמת מסד נתונים | [סיסמה_מאובטחת] |
| `XOOPS_DB_NAME` | שם מסד הנתונים | `xoops_db` |
| `XOOPS_DB_PREFIX` | קידומת שם טבלה | `xoops_` (מאפשר מספר XOOPS על DB אחד) |
| `XOOPS_ROOT_PATH` | נתיב מערכת קבצים פיזית | `/var/www/html/xoops` |
| `XOOPS_URL` | נגיש לאינטרנט URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | נתיב מהימן (מחוץ לשורש האינטרנט) | `/var/www/xoops_var` |

### עריכת mainfile.php

פתח את mainfile.php בעורך טקסט:
```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```
### שינויים נפוצים ב-mainfile.php

**שנה אתר URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```
**אפשר מצב ניפוי באגים (פיתוח בלבד):**
```php
define('XOOPS_DEBUG', 1);
```
**שנה קידומת טבלה (במידת הצורך):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**העבר נתיב אמון מחוץ לשורש האינטרנט (מתקדם):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## תצורת לוח הניהול

הגדר הגדרות בסיסיות דרך פאנל הניהול של XOOPS.

### גישה להגדרות המערכת

1. היכנס לפאנל הניהול: `http://your-domain.com/xoops/admin/`
2. נווט אל: **מערכת > העדפות > הגדרות כלליות**
3. שנה הגדרות (ראה להלן)
4. לחץ על "שמור" בתחתית

### שם ותיאור האתר

הגדר כיצד האתר שלך יופיע:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### מידע ליצירת קשר

הגדר פרטי יצירת קשר עם האתר:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### שפה ואזור

הגדר שפת ברירת מחדל ואזור:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## תצורת דוא"ל

הגדר הגדרות דואר אלקטרוני עבור התראות ותקשורת משתמשים.

### הגדרות דוא"ל מיקום

**לוח ניהול:** מערכת > העדפות > הגדרות דוא"ל

### SMTP תצורה

למשלוח דוא"ל אמין, השתמש ב-SMTP במקום PHP mail():
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### דוגמה לתצורת Gmail

הגדר XOOPS כדי לשלוח דוא"ל דרך Gmail:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**הערה:** Gmail דורש סיסמת אפליקציה, לא סיסמת Gmail שלך:
1. עבור אל https://myaccount.google.com/apppasswords
2. צור סיסמת אפליקציה עבור "Mail" ו-"Windows Computer"
3. השתמש בסיסמה שנוצרה ב- XOOPS

### PHP mail() תצורה (פשוטה יותר אך פחות אמינה)

אם SMTP אינו זמין, השתמש ב-PHP mail():
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
ודא שלשרת שלך מוגדרים sendmail או postfix:
```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### הגדרות פונקציית דוא"ל

הגדר מה מפעיל הודעות דוא"ל:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## תצורת אזור זמן

הגדר אזור זמן מתאים עבור חותמות זמן ותזמון נכונים.

### הגדרת אזור זמן בלוח הניהול

**נתיב:** מערכת > העדפות > הגדרות כלליות
```
Default Timezone: [Select your timezone]
```
**אזורי זמן נפוצים:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### אמת אזור זמן

בדוק את אזור הזמן הנוכחי של השרת:
```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### הגדר אזור זמן של המערכת (לינוקס)
```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## URL תצורה

### אפשר נקי URLs (ידידותי URLs)

עבור URLs כמו `/page/about` במקום `/index.php?page=about`

**דרישות:**
- Apache עם mod_rewrite מופעל
- `.htaccess` קובץ בבסיס XOOPS

**הפעל בלוח הניהול:**

1. עבור אל: **מערכת > העדפות > URL הגדרות**
2. סמן: "אפשר ידידותי URLs"
3. בחר: "URL סוג" (מידע נתיב או שאילתה)
4. שמור

**וודא ש-.htaccess קיים:**
```bash
cat /var/www/html/xoops/.htaccess
```
תוכן ‎.htaccess לדוגמה:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**פתרון בעיות נקי URLs:**
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
### הגדר את האתר URL

**לוח ניהול:** מערכת > העדפות > הגדרות כלליות

הגדר URL נכונה עבור הדומיין שלך:
```
Site URL: http://your-domain.com/xoops/
```
או אם XOOPS נמצא בשורש:
```
Site URL: http://your-domain.com/
```
## אופטימיזציה למנועי חיפוש (SEO)

הגדר הגדרות SEO עבור נראות טובה יותר של מנוע החיפוש.

### מטא תגים

הגדר מטא תגיות גלובליות:

**פאנל ניהול:** מערכת > העדפות > SEO הגדרות
```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```
אלה מופיעים בעמוד `<head>`:
```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### מפת אתר

אפשר XML מפת אתר עבור מנועי חיפוש:

1. עבור אל: **מערכת > מודולים**
2. מצא את מודול "מפת האתר".
3. לחץ כדי להתקין ולהפעיל
4. גש למפת האתר בכתובת: `/xoops/sitemap.xml`

### Robots.txt

שליטה בסריקה של מנוע החיפוש:

צור `/var/www/html/xoops/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```
## הגדרות משתמש

הגדר הגדרות ברירת מחדל הקשורות למשתמש.

### רישום משתמש

**לוח ניהול:** מערכת > העדפות > הגדרות משתמש
```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```
### פרופיל משתמש
```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### תצוגת דוא"ל משתמש
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## תצורת cache

שפר את הביצועים עם שמירה נאותה בcache.

### הגדרות cache

**לוח ניהול:** מערכת > העדפות > הגדרות cache
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### נקה cache

נקה קבצי cache ישנים:
```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## רשימת הגדרות ראשוניות

לאחר ההתקנה, הגדר:

- [ ] שם האתר והתיאור מוגדרים כהלכה
- [ ] הוגדר כתובת אימייל למנהל
- [ ] SMTP הגדרות דוא"ל מוגדרות ונבדקו
- [ ] אזור הזמן מוגדר לאזור שלך
- [ ] URL מוגדר כהלכה
- [ ] נקי URLs (ידידותי URLs) מופעל אם תרצה
- [ ] הגדרות רישום משתמש מוגדרות
- [ ] מטא תגים עבור SEO מוגדרים
- [ ] נבחרה שפת ברירת מחדל
- [ ] הגדרות cache מופעלות
- [ ] סיסמת משתמש מנהל חזקה (16+ תווים)
- [ ] בדוק את רישום המשתמש
- [ ] בדוק את פונקציונליות הדוא"ל
- [ ] העלאת קובץ בדיקה
- [ ] בקר בדף הבית ובדוק את המראה

## בדיקת תצורה

### דוא"ל בדיקה

שלח אימייל לבדיקה:

**פאנל ניהול:** מערכת > בדיקת אימייל

או ידנית:
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
### בדוק את חיבור מסד הנתונים
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
**חשוב:** מחק קבצי בדיקה לאחר בדיקה!
```bash
rm /var/www/html/xoops/test-*.php
```
## סיכום קבצי תצורה

| קובץ | מטרה | שיטת עריכה |
|---|---|---|
| mainfile.php | מסד נתונים והגדרות ליבה | עורך טקסט |
| פאנל ניהול | רוב ההגדרות | ממשק אינטרנט |
| .htaccess | URL שכתוב | עורך טקסט |
| robots.txt | סריקת מנוע חיפוש | עורך טקסט |

## השלבים הבאים

לאחר תצורה בסיסית:

1. הגדר את הגדרות המערכת בפירוט
2. הקשיח את האבטחה
3. חקור את פאנל הניהול
4. צור את התוכן הראשון שלך
5. הגדר חשבונות משתמש

---

**תגים:** #configuration #setup #email #timezone #seo

**מאמרים קשורים:**
- ../Installation/Installation
- הגדרות מערכת
- אבטחה-תצורה
- ביצועים-אופטימיזציה