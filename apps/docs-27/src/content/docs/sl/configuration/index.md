---
title: "Osnovna konfiguracija"
description: "Začetna nastavitev XOOPS vključno z glavno datoteko.php settings, site name, email, and timezone configuration"
---
# Osnovna XOOPS konfiguracija

Ta priročnik pokriva bistvene konfiguracijske nastavitve, da vaše spletno mesto XOOPS po namestitvi pravilno deluje.

## glavna datoteka.php Configuration

Datoteka `mainfile.php` vsebuje kritično konfiguracijo za vašo namestitev XOOPS. Ustvarjen je med namestitvijo, vendar ga boste morda morali ročno urediti.

### Lokacija
```
/var/www/html/xoops/mainfile.php
```
### Struktura datoteke
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
### Pojasnjene kritične nastavitve

| Nastavitev | Namen | Primer |
|---|---|---|
| `XOOPS_DB_TYPE` | Sistem baz podatkov | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Lokacija strežnika baze podatkov | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Uporabniško ime baze podatkov | `xoops_user` |
| `XOOPS_DB_PASS` | Geslo baze podatkov | [varno_geslo] |
| `XOOPS_DB_NAME` | Ime baze podatkov | `xoops_db` |
| `XOOPS_DB_PREFIX` | Predpona imena tabele | `xoops_` (omogoča več XOOPS na enem DB) |
| `XOOPS_ROOT_PATH` | Pot do fizičnega datotečnega sistema | `/var/www/html/XOOPS` |
| `XOOPS_URL` | Spletno dostopen URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Zaupanja vredna pot (zunaj spletnega korena) | `/var/www/xoops_var` |

### Urejanje glavne datoteke.php

Open mainfile.php in a text editor:
```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```
### Skupna glavna datoteka.php Changes

**Spremeni mesto URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```
**Omogoči način za odpravljanje napak (samo za razvoj):**
```php
define('XOOPS_DEBUG', 1);
```
**Spremeni predpono tabele (če je potrebno):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```
**Premakni pot zaupanja zunaj spletnega korena (napredno):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```
## Konfiguracija skrbniške plošče

Konfigurirajte osnovne nastavitve prek skrbniške plošče XOOPS.

### Dostop do sistemskih nastavitev

1. Prijavite se v skrbniško ploščo: `http://your-domain.com/XOOPS/admin/`
2. Pomaknite se do: **Sistem > Nastavitve > Splošne nastavitve**
3. Spremenite nastavitve (glejte spodaj)
4. Na dnu kliknite »Shrani«.

### Ime in opis mesta

Konfigurirajte, kako se prikaže vaše spletno mesto:
```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```
### Kontaktni podatki

Nastavite kontaktne podatke spletnega mesta:
```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```
### Jezik in regija

Nastavite privzeti jezik in regijo:
```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```
## Konfiguracija e-pošte

Konfigurirajte e-poštne nastavitve za obvestila in uporabniško komunikacijo.

### Nastavitve e-pošte Lokacija

**Skrbniška plošča:** Sistem > Nastavitve > Nastavitve e-pošte

### SMTP Konfiguracija

Za zanesljivo dostavo e-pošte uporabite SMTP namesto PHP mail():
```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```
### Primer konfiguracije Gmaila

Nastavite XOOPS za pošiljanje e-pošte prek Gmaila:
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```
**Opomba:** Gmail zahteva geslo za aplikacijo, ne vašega gesla za Gmail:
1. Pojdite na https://myaccount.google.com/apppasswords
2. Ustvarite geslo za aplikacijo za »Mail« in »Windows Computer«
3. Uporabite ustvarjeno geslo v XOOPS

### PHP mail() Konfiguracija (preprostejša, a manj zanesljiva)

Če SMTP ni na voljo, uporabite PHP mail():
```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```
Zagotovite, da ima vaš strežnik konfiguriran sendmail ali postfix:
```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```
### Nastavitve funkcij e-pošte

Konfigurirajte, kaj sproži e-pošto:
```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```
## Konfiguracija časovnega pasu

Nastavite ustrezen časovni pas za pravilne časovne žige in razpored.

### Nastavitev časovnega pasu v skrbniški plošči

**Pot:** Sistem > Nastavitve > Splošne nastavitve
```
Default Timezone: [Select your timezone]
```
**Pogosti časovni pasovi:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Preverite časovni pas

Preverite trenutni časovni pas strežnika:
```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```
### Nastavi sistemski časovni pas (Linux)
```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```
## URL Konfiguracija

### Omogoči čiste URL-je (prijazne URL-je)

Za URL-je, kot je `/page/about` namesto `/index.php?page=about`

**Zahteve:**
- Apache z omogočenim mod_rewrite
- `.htaccess` datoteka v korenu XOOPS

**Omogoči na skrbniški plošči:**

1. Pojdite na: **Sistem > Nastavitve > URL Nastavitve**
2. Označite: »Omogoči prijazne URL-je«
3. Izberite: "URL Type" (Informacije o poti ali poizvedba)
4. Shrani

**Preverite, da .htaccess obstaja:**
```bash
cat /var/www/html/xoops/.htaccess
```
Primer vsebine .htaccess:
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```
**Odpravljanje težav s čistimi URL-ji:**
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
### Konfigurirajte spletno mesto URL

**Skrbniška plošča:** Sistem > Nastavitve > Splošne nastavitve

Nastavite pravilno URL za svojo domeno:
```
Site URL: http://your-domain.com/xoops/
```
Ali če je XOOPS v korenu:
```
Site URL: http://your-domain.com/
```
## Optimizacija iskalnikov (SEO)

Konfigurirajte nastavitve SEO za boljšo vidnost iskalnika.

### Meta oznake

Nastavite globalne meta oznake:

**Skrbniška plošča:** Sistem > Nastavitve > SEO Nastavitve
```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```
Ti so prikazani na strani `<head>`:
```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```
### Zemljevid spletnega mesta

Omogoči zemljevid spletnega mesta XML za iskalnike:

1. Pojdite na: **Sistem > Moduli**
2. Poiščite modul "Zemljevid spletnega mesta".
3. Kliknite, da namestite in omogočite
4. Do zemljevida strani dostopajte na: `/XOOPS/sitemap.xml`

### Robots.txt

Nadzirajte iskanje po iskalniku:

Ustvari `/var/www/html/XOOPS/robots.txt`:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```
## Uporabniške nastavitve

Konfigurirajte privzete nastavitve, povezane z uporabnikom.

### Registracija uporabnika

**Skrbniška plošča:** Sistem > Nastavitve > Uporabniške nastavitve
```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```
### Uporabniški profil
```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### Prikaz e-pošte uporabnika
```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```
## Konfiguracija predpomnilnika

Izboljšajte zmogljivost s pravilnim predpomnjenjem.

### Nastavitve predpomnilnika

**Skrbniška plošča:** Sistem > Nastavitve > Nastavitve predpomnilnika
```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```
### Počisti predpomnilnik

Počisti stare datoteke predpomnilnika:
```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```
## Kontrolni seznam začetnih nastavitev

Po namestitvi konfigurirajte:

- [ ] Ime in opis mesta sta pravilno nastavljena
- [ ] E-pošta skrbnika je konfigurirana
- [ ] SMTP nastavitve e-pošte konfigurirane in preizkušene
- [ ] Časovni pas nastavljen na vašo regijo
- [ ] URL pravilno konfiguriran
- [ ] Po želji omogočeni čisti URL-ji (prijazni URL-ji).
- [ ] Nastavitve registracije uporabnika konfigurirane
- [ ] Konfigurirane meta oznake za SEO
- [ ] Izbran je privzeti jezik
- [ ] Nastavitve predpomnilnika omogočene
- [] Skrbniško uporabniško geslo je močno (16+ znakov)
- [ ] Testna registracija uporabnika
- [ ] Preizkusite funkcionalnost e-pošte
- [ ] Preskusno nalaganje datoteke
- [ ] Obiščite domačo stran in preverite videz

## Konfiguracija testiranja

### Testna e-pošta

Pošlji testno e-poštno sporočilo:

**Skrbniška plošča:** Sistem > Test e-pošte

Ali ročno:
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
### Preskusi povezavo z bazo podatkov
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
**Pomembno:** Po testiranju izbrišite testne datoteke!
```bash
rm /var/www/html/xoops/test-*.php
```
## Povzetek konfiguracijskih datotek

| Datoteka | Namen | Način urejanja |
|---|---|---|
| glavna datoteka.php | Database and core settings | Text editor |
| Skrbniška plošča | Večina nastavitev | Spletni vmesnik |
| .htaccess | URL prepis | Urejevalnik besedil |
| robots.txt | Iskanje po iskalniku | Urejevalnik besedil |

## Naslednji koraki

Po osnovni konfiguraciji:

1. Podrobno konfigurirajte sistemske nastavitve
2. Okrepite varnost
3. Raziščite skrbniško ploščo
4. Ustvarite svojo prvo vsebino
5. Nastavite uporabniške račune

---

**Oznake:** #konfiguracija #nastavitev #e-pošta #časovni pas #seo

**Povezani članki:**
- ../Installation/Installation
- Sistemske nastavitve
- Varnostna konfiguracija
- Optimizacija zmogljivosti