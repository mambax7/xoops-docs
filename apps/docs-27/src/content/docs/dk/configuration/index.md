---
title: "Grundlæggende konfiguration"
description: "Oprindelig XOOPS opsætning inklusive mainfile.php-indstillinger, webstedsnavn, e-mail og tidszonekonfiguration"
---

# Grundlæggende XOOPS-konfiguration

Denne vejledning dækker vigtige konfigurationsindstillinger for at få dit XOOPS-websted til at køre korrekt efter installationen.

## mainfile.php Konfiguration

`mainfile.php`-filen indeholder kritisk konfiguration for din XOOPS-installation. Det oprettes under installationen, men du skal muligvis redigere det manuelt.

### Placering

```
/var/www/html/xoops/mainfile.php
```

### Filstruktur

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

### Kritiske indstillinger forklaret

| Indstilling | Formål | Eksempel |
|---|---|---|
| `XOOPS_DB_TYPE` | Databasesystem | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Databaseserverplacering | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Database brugernavn | `xoops_user` |
| `XOOPS_DB_PASS` | Database adgangskode | [sikker_adgangskode] |
| `XOOPS_DB_NAME` | Databasenavn | `xoops_db` |
| `XOOPS_DB_PREFIX` | Tabelnavn præfiks | `xoops_` (tillader flere XOOPS på én DB) |
| `XOOPS_ROOT_PATH` | Fysisk filsystemsti | `/var/www/html/xoops` |
| `XOOPS_URL` | Web tilgængelig URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Pålidelig sti (uden for webroden) | `/var/www/xoops_var` |

### Redigering af mainfile.php

Åbn mainfile.php i en teksteditor:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Almindelige mainfile.php ændringer

**Skift websted URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Aktiver fejlretningstilstand (kun udvikling):**
```php
define('XOOPS_DEBUG', 1);
```

**Skift tabelpræfiks (hvis nødvendigt):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Flyt tillidssti uden for webroden (avanceret):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Admin Panel Konfiguration

Konfigurer grundlæggende indstillinger gennem XOOPS admin panel.

### Adgang til systemindstillinger

1. Log ind på admin panel: `http://your-domain.com/xoops/admin/`
2. Naviger til: **System > Præferencer > Generelle indstillinger**
3. Rediger indstillinger (se nedenfor)
4. Klik på "Gem" nederst

### Webstedets navn og beskrivelse

Konfigurer, hvordan dit websted vises:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Kontaktoplysninger

Indstil webstedets kontaktoplysninger:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Sprog og region

Indstil standardsprog og område:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## E-mail-konfiguration

Konfigurer e-mail-indstillinger for meddelelser og brugerkommunikation.

### E-mail-indstillinger Placering

**Admin Panel:** System > Præferencer > E-mail-indstillinger

### SMTP Konfiguration

For pålidelig e-mail-levering skal du bruge SMTP i stedet for PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail-konfigurationseksempel

Konfigurer XOOPS til at sende e-mail via Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Bemærk:** Gmail kræver en app-adgangskode, ikke din Gmail-adgangskode:
1. Gå til https://myaccount.google.com/apppasswords
2. Generer app-adgangskode til "Mail" og "Windows-computer"
3. Brug den genererede adgangskode i XOOPS

### PHP mail() Konfiguration (enklere, men mindre pålidelig)

Hvis SMTP ikke er tilgængelig, skal du bruge PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Sørg for, at din server har sendmail eller postfix konfigureret:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Indstillinger for e-mailfunktioner

Konfigurer, hvad der udløser e-mails:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Tidszonekonfiguration

Indstil korrekt tidszone for korrekte tidsstempler og planlægning.

### Indstilling af tidszone i Admin Panel

**Sti:** System > Præferencer > Generelle indstillinger

```
Default Timezone: [Select your timezone]
```

**Fælles tidszoner:**
- Amerika/New_York (EST/EDT)
- Amerika/Chicago (CST/CDT)
- Amerika/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europa/London (GMT/BST)
- Europa/Paris (CET/CEST)
- Asien/Tokyo (JST)
- Asien/Shanghai (CST)
- Australien/Sydney (AEDT/AEST)

### Bekræft tidszone

Tjek den aktuelle servertidszone:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Indstil systemtidszone (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL Konfiguration

### Aktiver rene URL'er (venlige URL'er)

For webadresser som `/page/about` i stedet for `/index.php?page=about`

**Krav:**
- Apache med mod_rewrite aktiveret
- `.htaccess`-fil i XOOPS-roden

**Aktiver i Admin Panel:**1. Gå til: **System > Præferencer > URL Indstillinger**
2. Marker: "Aktiver venlige URL'er"
3. Vælg: "URL Type" (stioplysninger eller forespørgsel)
4. Gem

**Bekræft, at .htaccess eksisterer:**

```bash
cat /var/www/html/xoops/.htaccess
```

Eksempel på .htaccess indhold:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Fejlfinding af rene webadresser:**

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

### Konfigurer websted URL

**Admin Panel:** System > Præferencer > Generelle indstillinger

Indstil korrekt URL for dit domæne:

```
Site URL: http://your-domain.com/xoops/
```

Eller hvis XOOPS er i root:

```
Site URL: http://your-domain.com/
```

## Søgemaskineoptimering (SEO)

Konfigurer SEO-indstillinger for bedre søgemaskinesynlighed.

### Metatags

Indstil globale metatags:

**Admin Panel:** System > Præferencer > SEO Indstillinger

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Disse vises på side `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Sitemap

Aktiver XML sitemap for søgemaskiner:

1. Gå til: **System > Moduler**
2. Find "Sitemap"-modulet
3. Klik for at installere og aktivere
4. Få adgang til sitemap på: `/xoops/sitemap.xml`

### Robots.txt

Styr søgemaskinecrawling:

Opret `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Brugerindstillinger

Konfigurer standard brugerrelaterede indstillinger.

### Brugerregistrering

**Admin Panel:** System > Præferencer > Brugerindstillinger

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Brugerprofil

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Visning af bruger-e-mail

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Cache-konfiguration

Forbedre ydeevnen med korrekt caching.

### Cacheindstillinger

**Admin Panel:** System > Præferencer > Cacheindstillinger

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Ryd cache

Ryd gamle cache-filer:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Tjekliste for indledende indstillinger

Efter installationen skal du konfigurere:

- [ ] Webstedets navn og beskrivelse er indstillet korrekt
- [ ] Admin email konfigureret
- [ ] SMTP e-mail-indstillinger konfigureret og testet
- [ ] Tidszone indstillet til dit område
- [ ] URL konfigureret korrekt
- [ ] Rene URL'er (venlige URL'er) aktiveret, hvis det ønskes
- [ ] Brugerregistreringsindstillinger konfigureret
- [ ] Metatags for SEO konfigureret
- [ ] Standardsproget er valgt
- [ ] Cache-indstillinger aktiveret
- [ ] Admin brugeradgangskode er stærk (16+ tegn)
- [ ] Test brugerregistrering
- [ ] Test e-mail-funktionalitet
- [ ] Test fil upload
- [ ] Besøg hjemmesiden og bekræft udseendet

## Test af konfiguration

### Test e-mail

Send en test-e-mail:

**Admin Panel:** System > Email Test

Eller manuelt:

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

### Test databaseforbindelse

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

**Vigtigt:** Slet testfiler efter test!

```bash
rm /var/www/html/xoops/test-*.php
```

## Opsummering af konfigurationsfiler

| Fil | Formål | Redigeringsmetode |
|---|---|---|
| hovedfil.php | Database og kerneindstillinger | Teksteditor |
| Admin Panel | De fleste indstillinger | Webgrænseflade |
| .htaccess | URL omskrivning | Teksteditor |
| robots.txt | Søgemaskine crawling | Teksteditor |

## Næste trin

Efter grundlæggende konfiguration:

1. Konfigurer systemindstillinger i detaljer
2. Hærd sikkerheden
3. Udforsk admin panel
4. Opret dit første indhold
5. Konfigurer brugerkonti

---

**Tags:** #konfiguration #opsætning #e-mail #tidszone #seo

**Relaterede artikler:**
- ../Installation/Installation
- System-indstillinger
- Sikkerhed-konfiguration
- Performance-optimering
