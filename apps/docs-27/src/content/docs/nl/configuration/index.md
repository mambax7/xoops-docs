---
title: "Basisconfiguratie"
description: "Initiële XOOPS-installatie inclusief mainfile.php-instellingen, sitenaam, e-mail en tijdzoneconfiguratie"
---
# Basis XOOPS-configuratie

Deze handleiding behandelt de essentiële configuratie-instellingen om uw XOOPS-site na de installatie correct te laten werken.

## mainfile.php-configuratie

Het `mainfile.php`-bestand bevat essentiële configuratie voor uw XOOPS-installatie. Het wordt aangemaakt tijdens de installatie, maar het kan zijn dat u het handmatig moet bewerken.

### Locatie

```
/var/www/html/xoops/mainfile.php
```

### Bestandsstructuur

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

### Kritieke instellingen uitgelegd

| Instelling | Doel | Voorbeeld |
|---|---|---|
| `XOOPS_DB_TYPE` | Databasesysteem | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Databaseserverlocatie | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Database-gebruikersnaam | `xoops_user` |
| `XOOPS_DB_PASS` | Databasewachtwoord | [beveiligd_wachtwoord] |
| `XOOPS_DB_NAME` | Databasenaam | `xoops_db` |
| `XOOPS_DB_PREFIX` | Voorvoegsel tabelnaam | `xoops_` (staat meerdere XOOPS toe op één database) |
| `XOOPS_ROOT_PATH` | Fysiek bestandssysteempad | `/var/www/html/xoops` |
| `XOOPS_URL` | Webtoegankelijk URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Vertrouwd pad (buiten webroot) | `/var/www/xoops_var` |

### mainfile.php bewerken

Open mainfile.php in een teksteditor:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Algemene mainfile.php-wijzigingen

**Wijzig site URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Debug-modus inschakelen (alleen ontwikkeling):**
```php
define('XOOPS_DEBUG', 1);
```

**Wijzig het tabelvoorvoegsel (indien nodig):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Verplaats het vertrouwenspad buiten de webroot (geavanceerd):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Configuratie beheerderspaneel

Configureer basisinstellingen via het XOOPS beheerderspaneel.

### Toegang tot systeeminstellingen

1. Log in op het beheerderspaneel: `http://your-domain.com/xoops/admin/`
2. Navigeer naar: **Systeem > Voorkeuren > Algemene instellingen**
3. Instellingen wijzigen (zie hieronder)
4. Klik onderaan op "Opslaan".

### Sitenaam en beschrijving

Configureer hoe uw site wordt weergegeven:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Contactgegevens

Contactgegevens van de site instellen:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Taal en regio

Standaardtaal en regio instellen:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## E-mailconfiguratie

Configureer e-mailinstellingen voor meldingen en gebruikerscommunicatie.

### E-mailinstellingen Locatie

**Beheerderspaneel:** Systeem > Voorkeuren > E-mailinstellingen

### SMTP-configuratie

Voor betrouwbare e-mailbezorging gebruikt u SMTP in plaats van PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail-configuratievoorbeeld

Stel XOOPS in om e-mail te verzenden via Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Opmerking:** Voor Gmail is een app-wachtwoord vereist, niet uw Gmail-wachtwoord:
1. Ga naar https://myaccount.google.com/apppasswords
2. Genereer app-wachtwoord voor "Mail" en "Windows Computer"
3. Gebruik het gegenereerde wachtwoord in XOOPS

### PHP mail() Configuratie (eenvoudiger maar minder betrouwbaar)

Als SMTP niet beschikbaar is, gebruik dan PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Zorg ervoor dat op uw server sendmail of postfix is geconfigureerd:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### E-mailfunctie-instellingen

Configureer wat e-mails activeert:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Tijdzoneconfiguratie

Stel de juiste tijdzone in voor correcte tijdstempels en planning.

### Tijdzone instellen in het beheerdersdashboard

**Pad:** Systeem > Voorkeuren > Algemene instellingen

```
Default Timezone: [Select your timezone]
```

**Gemeenschappelijke tijdzones:**
-Amerika/New York (EST/EDT)
- Amerika/Chicago (CST/CDT)
- Amerika/Denver (MST/MDT)
- Amerika/Los_Angeles (PST/PDT)
- Europa/Londen (GMT/BST)
- Europa/Parijs (CET/CEST)
- Azië/Tokio (JST)
- Azië/Shanghai (CST)
- Australië/Sydney (AEDT/AEST)

### Controleer de tijdzone

Controleer de huidige servertijdzone:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Systeemtijdzone instellen (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL-configuratie

### Schone URL's inschakelen (vriendelijke URL's)

Voor URL's zoals `/page/about` in plaats van `/index.php?page=about`

**Vereisten:**
- Apache met mod_rewrite ingeschakeld
- `.htaccess`-bestand in de hoofdmap XOOPS

**Inschakelen in beheerdersdashboard:**

1. Ga naar: **Systeem > Voorkeuren > URL-instellingen**
2. Vink aan: 'Vriendelijke URL's inschakelen'
3. Selecteer: "URL Type" (padinfo of query)
4. Opslaan**Controleer of .htaccess bestaat:**

```bash
cat /var/www/html/xoops/.htaccess
```

Voorbeeld van .htaccess-inhoud:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Problemen met schone URL's oplossen:**

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

### Site URL configureren

**Beheerderspaneel:** Systeem > Voorkeuren > Algemene instellingen

Stel de juiste URL in voor uw domein:

```
Site URL: http://your-domain.com/xoops/
```

Of als XOOPS in root staat:

```
Site URL: http://your-domain.com/
```

## Zoekmachineoptimalisatie (SEO)

Configureer de SEO-instellingen voor een betere zichtbaarheid in zoekmachines.

### Metatags

Algemene metatags instellen:

**Beheerderspaneel:** Systeem > Voorkeuren > SEO-instellingen

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Deze verschijnen op pagina `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Sitemap

Schakel de XML-sitemap in voor zoekmachines:

1. Ga naar: **Systeem > Modules**
2. Zoek de module "Sitemap".
3. Klik om te installeren en in te schakelen
4. Ga naar de sitemap op: `/xoops/sitemap.xml`

### Robots.txt

Controle van het crawlen van zoekmachines:

`/var/www/html/xoops/robots.txt` aanmaken:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Gebruikersinstellingen

Configureer standaard gebruikersgerelateerde instellingen.

### Gebruikersregistratie

**Beheerderspaneel:** Systeem > Voorkeuren > Gebruikersinstellingen

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Gebruikersprofiel

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### E-mailweergave van gebruiker

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Cacheconfiguratie

Verbeter de prestaties met de juiste caching.

### Cache-instellingen

**Beheerderspaneel:** Systeem > Voorkeuren > Cache-instellingen

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Cache wissen

Wis oude cachebestanden:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Controlelijst initiële instellingen

Na de installatie configureert u:

- [ ] Sitenaam en beschrijving correct ingesteld
- [ ] Beheerder-e-mailadres geconfigureerd
- [ ] SMTP e-mailinstellingen geconfigureerd en getest
- [ ] Tijdzone ingesteld op uw regio
- [ ] URL correct geconfigureerd
- [ ] Schone URL's (vriendelijke URL's) ingeschakeld indien gewenst
- [ ] Gebruikersregistratie-instellingen geconfigureerd
- [ ] Metatags voor SEO geconfigureerd
- [ ] Standaardtaal geselecteerd
- [ ] Cache-instellingen ingeschakeld
- [ ] Beheerderswachtwoord is sterk (16+ tekens)
- [ ] Gebruikersregistratie testen
- [ ] E-mailfunctionaliteit testen
- [ ] Testbestand uploaden
- [ ] Bezoek de startpagina en controleer het uiterlijk

## Configuratie testen

### Test-e-mail

Stuur een testmail:

**Beheerderspaneel:** Systeem > E-mailtest

Of handmatig:

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

### Databaseverbinding testen

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

**Belangrijk:** Testbestanden verwijderen na het testen!

```bash
rm /var/www/html/xoops/test-*.php
```

## Samenvatting van configuratiebestanden

| Bestand | Doel | Bewerkingsmethode |
|---|---|---|
| mainfile.php | Database- en kerninstellingen | Teksteditor |
| Beheerderspaneel | De meeste instellingen | Webinterface |
| .htaccess | URL herschrijven | Teksteditor |
| robots.txt | Zoekmachine crawlt | Teksteditor |

## Volgende stappen

Na de basisconfiguratie:

1. Configureer de systeeminstellingen in detail
2. Verbeter de beveiliging
3. Verken het beheerderspaneel
4. Creëer je eerste inhoud
5. Stel gebruikersaccounts in

---

**Tags:** #configuration #setup #email #timezone #seo

**Gerelateerde artikelen:**
- ../Installatie/Installatie
- Systeeminstellingen
- Beveiligingsconfiguratie
- Prestatie-optimalisatie