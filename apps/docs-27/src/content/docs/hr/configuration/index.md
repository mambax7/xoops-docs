---
title: "Osnovna konfiguracija"
description: "Početno postavljanje XOOPS uključujući postavke mainfile.php, naziv web mjesta, e-poštu i konfiguraciju vremenske zone"
---
# Osnovna konfiguracija XOOPS

Ovaj vodič pokriva bitne konfiguracijske postavke kako bi vaše XOOPS web mjesto ispravno radilo nakon instalacije.

## mainfile.php Konfiguracija

Datoteka `mainfile.php` sadrži kritičnu konfiguraciju za vašu instalaciju XOOPS. Stvoren je tijekom instalacije, ali ćete ga možda morati ručno urediti.

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

### Objašnjenje kritičnih postavki

| Postavka | Svrha | Primjer |
|---|---|---|
| `XOOPS_DB_TYPE` | Sustav baza podataka | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Lokacija poslužitelja baze podataka | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Korisničko ime baze podataka | `xoops_user` |
| `XOOPS_DB_PASS` | Lozinka baze podataka | [sigurna_lozinka] |
| `XOOPS_DB_NAME` | Naziv baze podataka | `xoops_db` |
| `XOOPS_DB_PREFIX` | Prefiks naziva tablice | `xoops_` (dopušta više XOOPS na jednom DB-u) |
| `XOOPS_ROOT_PATH` | Staza fizičkog datotečnog sustava | `/var/www/html/xoops` |
| `XOOPS_URL` | Dostupno na webu URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Pouzdana staza (izvan web korijena) | `/var/www/xoops_var` |

### Uređivanje mainfile.php

Otvorite mainfile.php u uređivaču teksta:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Uobičajene mainfile.php promjene

**Promijeni mjesto URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Omogući način otklanjanja pogrešaka (samo za razvoj):**
```php
define('XOOPS_DEBUG', 1);
```

**Promijenite prefiks tablice (ako je potrebno):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Premjesti pouzdanu stazu izvan web korijena (napredno):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Konfiguracija administratorske ploče

Konfigurirajte osnovne postavke putem ploče XOOPS admin.

### Pristup postavkama sustava

1. Prijavite se na ploču admin: `http://your-domain.com/xoops/admin/`
2. Idite na: **Sustav > Postavke > Opće postavke**
3. Izmijenite postavke (pogledajte dolje)
4. Kliknite "Spremi" na dnu

### Naziv i opis stranice

Konfigurirajte kako se vaša web stranica prikazuje:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Podaci za kontakt

Postavite podatke za kontakt stranice:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Jezik i regija

Postavite zadani language i regiju:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## Konfiguracija e-pošte

Konfigurirajte postavke e-pošte za obavijesti i korisničku komunikaciju.

### Postavke e-pošte Lokacija

**administratorska ploča:** Sustav > Postavke > Postavke e-pošte

### SMTP konfiguracija

Za pouzdanu isporuku e-pošte koristite SMTP umjesto PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Primjer konfiguracije Gmaila

Postavite XOOPS za slanje e-pošte putem Gmaila:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Napomena:** Gmail zahtijeva lozinku aplikacije, a ne vašu lozinku za Gmail:
1. Idite na https://myaccount.google.com/apppasswords
2. Generirajte lozinku aplikacije za "Mail" i "Windows Computer"
3. Koristite generiranu lozinku u XOOPS

### PHP mail() Konfiguracija (jednostavnija, ali manje pouzdana)

Ako SMTP nije dostupan, koristite PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Provjerite ima li vaš poslužitelj konfiguriran sendmail ili postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Postavke funkcije e-pošte

Konfigurirajte što pokreće e-poštu:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Konfiguracija vremenske zone

Postavite odgovarajuću vremensku zonu za ispravne vremenske oznake i raspored.

### Postavljanje vremenske zone u Admin panelu

**Put:** Sustav > Postavke > Opće postavke
```
Default Timezone: [Select your timezone]
```

**Uobičajene vremenske zone:**
- Amerika/New_York (EST/EDT)
- Amerika/Chicago (CST/CDT)
- Amerika/Denver (MST/MDT)
- Amerika/Los_Angeles (PST/PDT)
- Europa/London (GMT/BST)
- Europa/Pariz (CET/CEST)
- Azija/Tokio (JST)
- Azija/Šangaj (CST)
- Australija/Sydney (AEDT/AEST)

### Provjerite vremensku zonu

Provjerite trenutnu vremensku zonu poslužitelja:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Postavljanje vremenske zone sustava (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL Konfiguracija

### Omogući čiste URL-ove (prijateljski URL-ovi)

Za URL-ove poput `/page/about` umjesto `/index.php?page=about`

**Zahtjevi:**
- Apache s omogućenim mod_rewrite
- `.htaccess` datoteka u korijenu XOOPS

**Omogući na administrativnoj ploči:**

1. Idite na: **Sustav > Postavke > URL Postavke**
2. Označite: "Omogući prijateljske URL-ove"
3. Odaberite: "Vrsta URL" (Informacije o putu ili upit)
4. Spremiti

**Potvrdite da .htaccess postoji:**

```bash
cat /var/www/html/xoops/.htaccess
```

Primjer .htaccess sadržaja:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Rješavanje problema s čistim URL-ovima:**

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

### Konfigurirajte stranicu URL

**administratorska ploča:** Sustav > Postavke > Opće postavke

Postavite ispravan URL za svoju domenu:

```
Site URL: http://your-domain.com/xoops/
```

Ili ako je XOOPS u rootu:

```
Site URL: http://your-domain.com/
```

## Optimizacija za tražilice (SEO)

Konfigurirajte SEO postavke za bolju vidljivost tražilice.

### Meta oznake

Postavite globalne meta oznake:

**administratorska ploča:** Sustav > Postavke > SEO postavke

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Ovo se pojavljuje na stranici `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Sitemap

Omogući XML kartu web stranice za tražilice:

1. Idite na: **Sustav > moduli**
2. Pronađite modul "Sitemap".
3. Kliknite za instaliranje i omogućivanje
4. Pristupite karti web stranice na: `/xoops/sitemap.xml`

### Robots.txt

Kontrolirajte indeksiranje tražilice:

Kreiraj `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Korisničke postavke

Konfigurirajte zadane korisničke postavke.

### Registracija korisnika

**administratorska ploča:** Sustav > Postavke > Korisničke postavke

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Korisnički profil

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Prikaz korisničke e-pošte

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Konfiguracija predmemorije

Poboljšajte performanse pravilnim predmemoriranjem.

### Postavke predmemorije

**administratorska ploča:** Sustav > Postavke > Postavke predmemorije

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Očisti predmemoriju

Obrišite stare cache datoteke:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Kontrolni popis početnih postavki

Nakon instalacije konfigurirajte:

- [ ] Naziv stranice i opis postavljeni ispravno
- [ ] E-pošta administratora konfigurirana
- [ ] Postavke SMTP e-pošte konfigurirane i testirane
- [ ] Vremenska zona postavljena na vašu regiju
- [ ] URL ispravno konfiguriran
- [ ] Čisti URL-ovi (prijateljski URL-ovi) omogućeni po želji
- [ ] Postavke registracije korisnika konfigurirane
- [ ] Meta oznake za SEO konfigurirane
- [ ] Odabrano zadano language
- [ ] Postavke predmemorije omogućene
- [] administratorska korisnička lozinka je jaka (16+ znakova)
- [ ] Probna registracija korisnika
- [ ] Testirajte funkcionalnost e-pošte
- [ ] Probno učitavanje datoteke
- [ ] Posjetite početnu stranicu i provjerite izgled

## Konfiguracija testiranja

### Testirajte e-poštu

Pošalji probnu e-poštu:

**administratorska ploča:** Sustav > Test e-pošte

Ili ručno:

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

### Testiraj vezu s bazom podataka

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

**Važno:** Izbrišite testne datoteke nakon testiranja!

```bash
rm /var/www/html/xoops/test-*.php
```

## Sažetak konfiguracijskih datoteka| Datoteka | Svrha | Način uređivanja |
|---|---|---|
| mainfile.php | Postavke baze podataka i jezgre | Uređivač teksta |
| administratorska ploča | Većina postavki | Web sučelje |
| .htaccess | URL prepisivanje | Uređivač teksta |
| roboti.txt | Pretrazivanje tražilice | Uređivač teksta |

## Sljedeći koraci

Nakon osnovne konfiguracije:

1. Detaljno konfigurirajte postavke sustava
2. Ojačajte sigurnost
3. Istražite ploču admin
4. Kreirajte svoj prvi sadržaj
5. Postavite korisničke račune

---

**Oznake:** #konfiguracija #postavljanje #e-pošta #vremenska zona #seo

**Povezani članci:**
- ../Instalacija/Instalacija
- Postavke sustava
- Sigurnosna konfiguracija
- Optimizacija performansi
