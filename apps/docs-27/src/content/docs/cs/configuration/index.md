---
title: "Základní konfigurace"
description: "Počáteční nastavení XOOPS včetně nastavení mainfile.php, názvu webu, e-mailu a konfigurace časového pásma"
---

# Základní konfigurace XOOPS

Tato příručka obsahuje základní konfigurační nastavení, aby váš web XOOPS po instalaci fungoval správně.

## Konfigurace mainfile.php

Soubor `mainfile.php` obsahuje kritickou konfiguraci pro vaši instalaci XOOPS. Je vytvořen během instalace, ale možná jej budete muset upravit ručně.

### Umístění

```
/var/www/html/xoops/mainfile.php
```

### Struktura souboru

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

### Vysvětlení kritických nastavení

| Nastavení | Účel | Příklad |
|---|---|---|
| `XOOPS_DB_TYPE` | Databázový systém | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Umístění databázového serveru | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Uživatelské jméno databáze | `xoops_user` |
| `XOOPS_DB_PASS` | Heslo databáze | [zabezpečené_heslo] |
| `XOOPS_DB_NAME` | Název databáze | `xoops_db` |
| `XOOPS_DB_PREFIX` | Předpona názvu tabulky | `xoops_` (umožňuje více XOOPS na jednom DB) |
| `XOOPS_ROOT_PATH` | Cesta fyzického systému souborů | `/var/www/html/xoops` |
| `XOOPS_URL` | Web přístupný URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Důvěryhodná cesta (mimo kořen webu) | `/var/www/xoops_var` |

### Úprava mainfile.php

Otevřete mainfile.php v textovém editoru:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Běžné změny mainfile.php

**Změnit web URL:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Povolit režim ladění (pouze pro vývoj):**
```php
define('XOOPS_DEBUG', 1);
```

**Změňte předponu tabulky (v případě potřeby):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Přesunout důvěryhodnou cestu mimo webový kořen (pokročilé):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Konfigurace panelu administrátora

Nakonfigurujte základní nastavení prostřednictvím administrátorského panelu XOOPS.

### Přístup k nastavení systému

1. Přihlaste se do administračního panelu: `http://your-domain.com/xoops/admin/`
2. Přejděte na: **Systém > Předvolby > Obecná nastavení**
3. Upravte nastavení (viz níže)
4. Klikněte na "Uložit" dole

### Název a popis webu

Nakonfigurujte, jak se vaše stránky zobrazují:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Kontaktní informace

Nastavit kontaktní údaje webu:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Jazyk a region

Nastavit výchozí jazyk a region:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## Konfigurace e-mailu

Nakonfigurujte nastavení e-mailu pro upozornění a uživatelskou komunikaci.

### Umístění nastavení e-mailu

**Panel správce:** Systém > Předvolby > Nastavení e-mailu

### Konfigurace SMTP

Pro spolehlivé doručování e-mailů použijte SMTP místo PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Příklad konfigurace Gmailu

Nastavte XOOPS pro odesílání e-mailů přes Gmail:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Poznámka:** Gmail vyžaduje heslo aplikace, nikoli vaše heslo k Gmailu:
1. Přejděte na https://myaccount.google.com/apppasswords
2. Vygenerujte heslo aplikace pro "Mail" a "Windows Computer"
3. Použijte vygenerované heslo v XOOPS

### Konfigurace mail() PHP (jednodušší, ale méně spolehlivá)

Pokud SMTP není k dispozici, použijte PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Ujistěte se, že váš server má nakonfigurovaný sendmail nebo postfix:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Nastavení funkce e-mailu

Nakonfigurujte, co spouští e-maily:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Konfigurace časového pásma

Nastavte správné časové pásmo pro správná časová razítka a plánování.

### Nastavení časového pásma na panelu administrátora

**Cesta:** Systém > Předvolby > Obecná nastavení

```
Default Timezone: [Select your timezone]
```

**Běžná časová pásma:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Ověřte časové pásmo

Zkontrolujte aktuální časové pásmo serveru:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Nastavit časové pásmo systému (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## Konfigurace URL

### Povolit čisté adresy URL (přátelské adresy URL)

Pro adresy URL jako `/page/about` místo `/index.php?page=about`

**Požadavky:**
- Apache s povoleným mod_rewrite
- Soubor `.htaccess` v kořenovém adresáři XOOPS

**Povolit v panelu administrátora:**

1. Přejděte na: **Systém > Předvolby > Nastavení URL**
2. Zaškrtněte: „Povolit přátelské adresy URL“
3. Vyberte: "URL Type" (informace o cestě nebo dotaz)
4. Uložit

**Ověřte existenci .htaccess:**

```bash
cat /var/www/html/xoops/.htaccess
```

Ukázkový obsah .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Odstraňování problémů s čistými adresami URL:**

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

### Konfigurace webu URL

**Panel správce:** Systém > Předvolby > Obecná nastavení

Nastavte správné URL pro vaši doménu:

```
Site URL: http://your-domain.com/xoops/
```

Nebo pokud je XOOPS v rootu:

```
Site URL: http://your-domain.com/
```

## Optimalizace pro vyhledávače (SEO)Nakonfigurujte nastavení SEO pro lepší viditelnost vyhledávače.

### Meta tagy

Nastavit globální značky metadat:

**Panel správce:** Systém > Předvolby > Nastavení SEO

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Tyto se zobrazí na stránce `<head>`:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Soubor Sitemap

Povolit mapu webu XML pro vyhledávače:

1. Přejděte na: **Systém > Moduly**
2. Najděte modul „Sitemap“.
3. Klepnutím nainstalujte a povolte
4. Přístup k mapě webu na: `/xoops/sitemap.xml`

### Robots.txt

Ovládání procházení vyhledávačem:

Vytvořit `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Uživatelská nastavení

Nakonfigurujte výchozí uživatelská nastavení.

### Registrace uživatele

**Panel správce:** Systém > Předvolby > Uživatelská nastavení

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Profil uživatele

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Zobrazení uživatelského e-mailu

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Konfigurace mezipaměti

Zlepšete výkon pomocí správného ukládání do mezipaměti.

### Nastavení mezipaměti

**Panel správce:** Systém > Předvolby > Nastavení mezipaměti

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache if available)
Cache Lifetime: 3600 seconds (1 hour)
```

### Vymazat mezipaměť

Vymazat staré soubory mezipaměti:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Kontrolní seznam počátečních nastavení

Po instalaci nakonfigurujte:

- [ ] Správně nastavený název a popis webu
- [ ] Nakonfigurován e-mail správce
- [ ] Nastavení e-mailu SMTP nakonfigurováno a otestováno
- [ ] Časové pásmo nastavené na vaši oblast
- [ ] URL správně nakonfigurován
- [ ] Čisté adresy URL (přátelské adresy URL) jsou v případě potřeby povoleny
- [ ] Nakonfigurováno nastavení registrace uživatele
- [ ] Nakonfigurovány metaznačky pro SEO
- [ ] Vybrán výchozí jazyk
- [ ] Nastavení mezipaměti povoleno
- [ ] Uživatelské heslo správce je silné (16+ znaků)
- [ ] Testovací registrace uživatele
- [ ] Otestujte funkčnost e-mailu
- [ ] Nahrání testovacího souboru
- [ ] Navštivte domovskou stránku a ověřte vzhled

## Testování konfigurace

### Testovací e-mail

Pošlete zkušební e-mail:

**Panel správce:** Systém > Test e-mailu

Nebo ručně:

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

### Testovat připojení databáze

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XOOPSDatabaseFactory::getDatabaseConnection();
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

**Důležité:** Po testování smažte testovací soubory!

```bash
rm /var/www/html/xoops/test-*.php
```

## Souhrn konfiguračních souborů

| Soubor | Účel | Upravit metodu |
|---|---|---|
| mainfile.php | Nastavení databáze a jádra | Textový editor |
| Admin Panel | Většina nastavení | Webové rozhraní |
| .htaccess | Přepisování URL | Textový editor |
| robots.txt | Procházení vyhledávačem | Textový editor |

## Další kroky

Po základní konfiguraci:

1. Podrobně nakonfigurujte nastavení systému
2. Harden zabezpečení
3. Prozkoumejte panel administrátora
4. Vytvořte svůj první obsah
5. Nastavte uživatelské účty

---

**Značky:** #konfigurace #nastavení #e-mail #časové pásmo #seo

**Související články:**
- ../Installation/Installation
- Nastavení systému
- Konfigurace zabezpečení
- Optimalizace výkonu