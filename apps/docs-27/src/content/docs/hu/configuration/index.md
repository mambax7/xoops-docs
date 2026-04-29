---
title: "Alapkonfiguráció"
description: "A XOOPS kezdeti beállítása, beleértve a mainfile.php beállításait, a webhely nevét, az e-mail címét és az időzóna konfigurációját"
---
# Alapvető XOOPS konfiguráció

Ez az útmutató a XOOPS webhely megfelelő működéséhez szükséges alapvető konfigurációs beállításokat tartalmazza a telepítés után.

## mainfile.php konfiguráció

A `mainfile.php` fájl kritikus konfigurációt tartalmaz a XOOPS telepítéséhez. A telepítés során jön létre, de előfordulhat, hogy manuálisan kell szerkesztenie.

### Helyszín

```
/var/www/html/xoops/mainfile.php
```

### Fájlszerkezet

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

### A kritikus beállítások magyarázata

| Beállítás | Cél | Példa |
|---|---|---|
| `XOOPS_DB_TYPE` | Adatbázis rendszer | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Adatbázis-szerver helye | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Adatbázis felhasználónév | `xoops_user` |
| `XOOPS_DB_PASS` | Adatbázis jelszó | [biztonságos_jelszó] |
| `XOOPS_DB_NAME` | Adatbázis neve | `xoops_db` |
| `XOOPS_DB_PREFIX` | Táblanév előtag | `xoops_` (több XOOPS egy DB-n) |
| `XOOPS_ROOT_PATH` | Fizikai fájlrendszer elérési útja | `/var/www/html/xoops` |
| `XOOPS_URL` | Interneten elérhető URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Megbízható elérési út (a webgyökeren kívül) | `/var/www/xoops_var` |

### mainfile.php szerkesztése

Nyissa meg a mainfile.php-t egy szövegszerkesztőben:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Gyakori mainfile.php változások

**Webhely módosítása URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Hibakeresési mód engedélyezése (csak fejlesztés):**
```php
define('XOOPS_DEBUG', 1);
```

**A táblázat előtagjának módosítása (ha szükséges):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Megbízhatósági útvonal áthelyezése a webes gyökérkönyvtáron kívülre (speciális):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Felügyeleti panel konfigurációja

Konfigurálja az alapvető beállításokat a XOOPS adminisztrációs panelen keresztül.

### A rendszerbeállítások elérése

1. Jelentkezzen be az adminisztrációs panelre: `http://your-domain.com/xoops/admin/`
2. Lépjen a következőhöz: **Rendszer > Beállítások > Általános beállítások**
3. Módosítsa a beállításokat (lásd alább)
4. Kattintson a "Mentés" gombra alul

### Webhely neve és leírása

Állítsa be webhelye megjelenését:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Elérhetőségi adatok

Állítsa be a webhely elérhetőségi adatait:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Nyelv és régió

Állítsa be az alapértelmezett nyelvet és régiót:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## E-mail konfiguráció

Konfigurálja az e-mail beállításokat az értesítésekhez és a felhasználói kommunikációhoz.

### E-mail beállítások Hely

**Felügyeleti panel:** Rendszer > Beállítások > E-mail beállítások

### SMTP konfiguráció

A megbízható e-mail-kézbesítés érdekében használja a PHP mail() helyett a SMTP-t:

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail konfigurációs példa

Állítsa be a XOOPS-t e-mailek küldéséhez Gmailen keresztül:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Megjegyzés:** A Gmailhez alkalmazásjelszó szükséges, nem a Gmail jelszava:
1. Lépjen a https://myaccount.google.com/apppasswords oldalra
2. Alkalmazásjelszó létrehozása a "Mail" és a "Windows Computer" számára
3. Használja a XOOPS-ban generált jelszót

### PHP mail() konfiguráció (egyszerűbb, de kevésbé megbízható)

Ha a SMTP nem érhető el, használja a PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Győződjön meg arról, hogy a szerveren be van állítva a sendmail vagy a postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### E-mail funkció beállításai

Állítsa be, hogy mi aktiválja az e-maileket:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Időzóna konfiguráció

Állítsa be a megfelelő időzónát a megfelelő időbélyegekhez és ütemezéshez.

### Időzóna beállítása a Felügyeleti panelen

**Elérési út:** Rendszer > Beállítások > Általános beállítások

```
Default Timezone: [Select your timezone]
```

**Gyakori időzónák:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Időzóna ellenőrzése

Ellenőrizze a szerver aktuális időzónáját:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Rendszeridőzóna beállítása (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL konfiguráció

### Tiszta URL-ek engedélyezése (barátságos URL-ek)

Olyan URL-ekhez, mint a `/page/about` a `/index.php?page=about` helyett

**Követelmények:**
- Apache a mod_rewrite engedélyezésével
- `.htaccess` fájl a XOOPS gyökérben

**Engedélyezés az adminisztrációs panelen:**

1. Nyissa meg: **Rendszer > Beállítások > URL Beállítások**
2. Jelölje be: "Barátságos URL-ek engedélyezése"
3. Válassza ki: "URL Type" (útvonalinformáció vagy lekérdezés)
4. Mentés

**A .htaccess létezésének ellenőrzése:**
```bash
cat /var/www/html/xoops/.htaccess
```

Minta .htaccess tartalom:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Tiszta URL-ek hibaelhárítása:**

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

### Webhely konfigurálása URL

**Felügyeleti panel:** Rendszer > Beállítások > Általános beállítások

Állítsa be a megfelelő URL-t a domainhez:

```
Site URL: http://your-domain.com/xoops/
```

Vagy ha a XOOPS a gyökérben van:

```
Site URL: http://your-domain.com/
```

## Keresőoptimalizálás (SEO)

Konfigurálja a SEO beállításait a keresőmotor jobb láthatósága érdekében.

### Metacímkék

Globális metacímkék beállítása:

**Felügyeleti panel:** Rendszer > Beállítások > SEO beállítások

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Ezek a `<head>` oldalon jelennek meg:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Webhelytérkép

XML webhelytérkép engedélyezése a keresőmotorok számára:

1. Nyissa meg: **Rendszer > modulok**
2. Keresse meg a "Webhelytérkép" modult
3. Kattintson a telepítéshez és engedélyezéshez
4. A webhelytérkép elérése a következő címen: `/xoops/sitemap.xml`

### Robots.txt

A keresőmotor feltérképezésének vezérlése:

`/var/www/html/xoops/robots.txt` létrehozása:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Felhasználói beállítások

Konfigurálja az alapértelmezett felhasználói beállításokat.

### Felhasználói regisztráció

**Felügyeleti panel:** Rendszer > Beállítások > Felhasználói beállítások

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Felhasználói profil

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Felhasználói e-mail megjelenítése

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Gyorsítótár konfigurációja

A teljesítmény javítása megfelelő gyorsítótárazással.

### Gyorsítótár beállításai

**Felügyeleti panel:** Rendszer > Beállítások > Gyorsítótár beállításai

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Törölje a gyorsítótárat

Törölje a régi gyorsítótár fájlokat:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Kezdeti beállítások ellenőrzőlista

A telepítés után konfigurálja:

- [ ] A webhely neve és leírása helyesen van beállítva
- [ ] Admin e-mail konfigurálva
- [ ] SMTP e-mail beállítások konfigurálva és tesztelve
- [ ] Az időzóna az Ön régiójában van beállítva
- [ ] A URL megfelelően van konfigurálva
- [ ] Tiszta URL-ek (barátságos URL-ek) engedélyezve, ha szükséges
- [ ] Felhasználó regisztrációs beállítások konfigurálva
- [ ] A SEO metacímkéi konfigurálva
- [ ] Alapértelmezett nyelv kiválasztva
- [ ] A gyorsítótár beállításai engedélyezve
- [ ] Az adminisztrátori jelszó erős (16+ karakter)
- [ ] Felhasználói regisztráció tesztelése
- [ ] E-mail funkció tesztelése
- [ ] Próbafájl feltöltése
- [ ] Látogassa meg a honlapot, és ellenőrizze megjelenését

## Konfiguráció tesztelése

### Teszt e-mail

Küldj teszt e-mailt:

**Felügyeleti panel:** Rendszer > E-mail teszt

Vagy manuálisan:

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

### Adatbázis-kapcsolat tesztelése

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

**Fontos:** A tesztelés után törölje a tesztfájlokat!

```bash
rm /var/www/html/xoops/test-*.php
```

## Konfigurációs fájlok összefoglalása

| Fájl | Cél | Módszer szerkesztése |
|---|---|---|
| mainfile.php | Adatbázis és alapvető beállítások | Szövegszerkesztő |
| Felügyeleti panel | A legtöbb beállítás | Webes felület |
| .htaccess | URL újraírás | Szövegszerkesztő |
| robots.txt | Keresőmotor feltérképezése | Szövegszerkesztő |

## Következő lépések

Az alapkonfiguráció után:

1. Részletesen konfigurálja a rendszerbeállításokat
2. Erősítse meg a biztonságot
3. Fedezze fel az adminisztrációs panelt
4. Hozd létre az első tartalmadat
5. Felhasználói fiókok beállítása

---

**Címkék:** #konfiguráció #beállítás #e-mail #időzóna #seo

**Kapcsolódó cikkek:**
- ../Installation/Installation
- Rendszerbeállítások
- Biztonság-konfiguráció
- Teljesítmény-optimalizálás
