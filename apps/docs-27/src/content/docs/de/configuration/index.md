---
title: "Grundkonfiguration"
description: "Initiales XOOPS-Setup einschließlich mainfile.php-Einstellungen, Seitennamen, E-Mail und Zeitzonen-Konfiguration"
---

# XOOPS-Grundkonfiguration

Dieser Leitfaden behandelt wesentliche Konfigurationseinstellungen für den ordnungsgemäßen Betrieb Ihrer XOOPS-Site nach der Installation.

## mainfile.php-Konfiguration

Die Datei `mainfile.php` enthält kritische Konfigurationen für Ihre XOOPS-Installation. Sie wird während der Installation erstellt, aber Sie müssen sie möglicherweise manuell bearbeiten.

### Speicherort

```
/var/www/html/xoops/mainfile.php
```

### Dateistruktur

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

### Erklärung der kritischen Einstellungen

| Einstellung | Zweck | Beispiel |
|---|---|---|
| `XOOPS_DB_TYPE` | Datenbanksystem | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Datenbankserverort | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Datenbankbenutzername | `xoops_user` |
| `XOOPS_DB_PASS` | Datenbankpasswort | [secure_password] |
| `XOOPS_DB_NAME` | Datenbankname | `xoops_db` |
| `XOOPS_DB_PREFIX` | Tabellennamenprefix | `xoops_` (ermöglicht mehrere XOOPS in einer DB) |
| `XOOPS_ROOT_PATH` | Physischer Dateisystempfad | `/var/www/html/xoops` |
| `XOOPS_URL` | Webzugängliche URL | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Vertrauenswürdiger Pfad (außerhalb des Web-Wurzelverzeichnisses) | `/var/www/xoops_var` |

### mainfile.php bearbeiten

Öffnen Sie mainfile.php in einem Texteditor:

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Häufige mainfile.php-Änderungen

**Website-URL ändern:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Debug-Modus aktivieren (nur für Entwicklung):**
```php
define('XOOPS_DEBUG', 1);
```

**Tabellenprefix ändern (wenn nötig):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Trust Path außerhalb des Web-Wurzelverzeichnisses verschieben (fortgeschritten):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Admin-Panel-Konfiguration

Konfigurieren Sie grundlegende Einstellungen über das XOOPS-Admin-Panel.

### Zugriff auf Systemeinstellungen

1. Melden Sie sich im Admin-Panel an: `http://your-domain.com/xoops/admin/`
2. Navigieren Sie zu: **System > Preferences > General Settings**
3. Ändern Sie Einstellungen (siehe unten)
4. Klicken Sie am Ende auf "Speichern"

### Seitennamen und Beschreibung

Konfigurieren Sie, wie Ihre Site angezeigt wird:

```
Site Name: My XOOPS Site
Site Description: A dynamic content management system
Site Slogan: Built with XOOPS
```

### Kontaktinformationen

Legen Sie Seitenkontaktdetails fest:

```
Site Admin Email: admin@your-domain.com
Site Admin Name: Site Administrator
Contact Form Email: support@your-domain.com
Support Email: help@your-domain.com
```

### Sprache und Region

Legen Sie Standardsprache und Region fest:

```
Default Language: English
Default Timezone: America/New_York  (or your timezone)
Date Format: %Y-%m-%d
Time Format: %H:%M:%S
```

## E-Mail-Konfiguration

Konfigurieren Sie E-Mail-Einstellungen für Benachrichtigungen und Benutzerkommunikation.

### Speicherort der E-Mail-Einstellungen

**Admin-Panel:** System > Preferences > Email Settings

### SMTP-Konfiguration

Verwenden Sie für zuverlässige E-Mail-Zustellung SMTP statt PHP mail():

```
Use SMTP: Yes
SMTP Host: smtp.gmail.com  (or your SMTP provider)
SMTP Port: 587  (TLS) or 465 (SSL)
SMTP Username: your-email@gmail.com
SMTP Password: [app_password]
SMTP Security: TLS or SSL
```

### Gmail-Konfigurationsbeispiel

Richten Sie XOOPS zum Versenden von E-Mails über Gmail ein:

```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Security: TLS
SMTP Username: your-email@gmail.com
SMTP Password: [Google App Password - NOT regular password]
From Address: your-email@gmail.com
From Name: Your Site Name
```

**Hinweis:** Gmail erfordert ein App-Passwort, nicht Ihr Gmail-Passwort:
1. Gehen Sie zu https://myaccount.google.com/apppasswords
2. Generieren Sie ein App-Passwort für "Mail" und "Windows Computer"
3. Verwenden Sie das generierte Passwort in XOOPS

### PHP mail()-Konfiguration (Einfacher, aber weniger zuverlässig)

Wenn SMTP nicht verfügbar ist, verwenden Sie PHP mail():

```
Use SMTP: No
From Address: noreply@your-domain.com
From Name: Your Site Name
```

Stellen Sie sicher, dass Ihr Server Sendmail oder Postfix konfiguriert hat:

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### E-Mail-Funktionseinstellungen

Konfigurieren Sie, was E-Mails auslöst:

```
Send Notifications: Yes
Notify Admin on User Registration: Yes
Send Welcome Email to New Users: Yes
Send Password Reset Link: Yes
Enable User Email: Yes
Enable Private Messages: Yes
Notify on Admin Actions: Yes
```

## Zeitzonen-Konfiguration

Legen Sie die richtige Zeitzone für korrekte Zeitstempel und Planung fest.

### Zeitzonen-Einstellung im Admin-Panel

**Pfad:** System > Preferences > General Settings

```
Default Timezone: [Select your timezone]
```

**Häufige Zeitzonen:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Zeitzonen verifizieren

Überprüfen Sie die aktuelle Serverzeit:

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Systemzeit (Linux) einstellen

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## URL-Konfiguration

### Aktivieren Sie saubere URLs (freundliche URLs)

Für URLs wie `/page/about` statt `/index.php?page=about`

**Anforderungen:**
- Apache mit mod_rewrite aktiviert
- `.htaccess`-Datei im XOOPS-Wurzelverzeichnis

**Im Admin-Panel aktivieren:**

1. Gehen Sie zu: **System > Preferences > URL Settings**
2. Aktivieren Sie: "Enable Friendly URLs"
3. Wählen Sie: "URL Type" (Path Info oder Query)
4. Speichern

**Überprüfen Sie, ob .htaccess vorhanden ist:**

```bash
cat /var/www/html/xoops/.htaccess
```

Beispielinhalt von .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Fehlerbehebung für saubere URLs:**

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

### Konfigurieren Sie die Site-URL

**Admin-Panel:** System > Preferences > General Settings

Legen Sie die korrekte URL für Ihre Domain fest:

```
Site URL: http://your-domain.com/xoops/
```

Oder wenn XOOPS im Wurzelverzeichnis ist:

```
Site URL: http://your-domain.com/
```

## Suchmaschinenoptimierung (SEO)

Konfigurieren Sie SEO-Einstellungen für bessere Suchmaschinen-Sichtbarkeit.

### Meta-Tags

Legen Sie globale Meta-Tags fest:

**Admin-Panel:** System > Preferences > SEO Settings

```
Meta Keywords: xoops, cms, content management
Meta Description: A dynamic content management system
```

Diese werden in der Seite `<head>` angezeigt:

```html
<meta name="keywords" content="xoops, cms, content management">
<meta name="description" content="A dynamic content management system">
```

### Sitemap

Aktivieren Sie die XML-Sitemap für Suchmaschinen:

1. Gehen Sie zu: **System > Modules**
2. Suchen Sie das Modul "Sitemap"
3. Klicken Sie zum Installieren und Aktivieren
4. Greifen Sie auf die Sitemap unter `/xoops/sitemap.xml` zu

### Robots.txt

Kontrollieren Sie das Crawlen von Suchmaschinen:

Erstellen Sie `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Benutzereinstellungen

Konfigurieren Sie standardmäßige benutzerbezogene Einstellungen.

### Benutzerregistrierung

**Admin-Panel:** System > Preferences > User Settings

```
Allow User Registration: Yes/No
User Registration Type:
  - Instant (Automatic approval)
  - Approval Required (Admin approval needed)
  - Email Verification (Email confirmation required)

Email Confirmation Required: Yes/No
Account Activation Method: Automatic/Manual
```

### Benutzerprofil

```
Enable User Profiles: Yes
Show User Avatar: Yes
Maximum Avatar Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### E-Mail-Anzeige des Benutzers

```
Show User Email: No (for privacy)
Users Can Hide Email: Yes
Users Can Change Avatar: Yes
Users Can Upload Files: Yes
```

## Cache-Konfiguration

Verbessern Sie die Leistung mit ordnungsgemäßem Caching.

### Cache-Einstellungen

**Admin-Panel:** System > Preferences > Cache Settings

```
Enable Caching: Yes
Cache Method: File (or APCu/Memcache)
Cache Lifetime: 3600 seconds (1 hour)
```

### Cache löschen

Löschen Sie alte Cache-Dateien:

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Checkliste für anfängliche Einstellungen

Nach der Installation konfigurieren Sie:

- [ ] Seitennamen und Beschreibung korrekt eingestellt
- [ ] Admin-E-Mail konfiguriert
- [ ] SMTP-E-Mail-Einstellungen konfiguriert und getestet
- [ ] Zeitzone auf Ihre Region eingestellt
- [ ] URL korrekt konfiguriert
- [ ] Saubere URLs (freundliche URLs) aktiviert, falls gewünscht
- [ ] Benutzerregistrierungseinstellungen konfiguriert
- [ ] Meta-Tags für SEO konfiguriert
- [ ] Standardsprache ausgewählt
- [ ] Cache-Einstellungen aktiviert
- [ ] Admin-Benutzerpasswort ist stark (16+ Zeichen)
- [ ] Benutzerregistrierung testen
- [ ] E-Mail-Funktionalität testen
- [ ] Datei-Upload testen
- [ ] Startseite besuchen und Aussehen überprüfen

## Testkonfiguration

### Test E-Mail

Senden Sie eine Test-E-Mail:

**Admin-Panel:** System > Email Test

Oder manuell:

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

### Datenbankverbindung testen

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

**Wichtig:** Löschen Sie Testdateien nach dem Testen!

```bash
rm /var/www/html/xoops/test-*.php
```

## Zusammenfassung der Konfigurationsdateien

| Datei | Zweck | Bearbeitungsmethode |
|---|---|---|
| mainfile.php | Datenbank- und Kerneinstellungen | Texteditor |
| Admin-Panel | Meiste Einstellungen | Web-Schnittstelle |
| .htaccess | URL-Umschreiben | Texteditor |
| robots.txt | Suche von Suchmaschinen | Texteditor |

## Nächste Schritte

Nach der Grundkonfiguration:

1. Konfigurieren Sie Systemeinstellungen im Detail
2. Sicherheit verstärken
3. Admin-Panel erkunden
4. Erstellen Sie Ihre erste Inhaltsseite
5. Benutzerkonto einrichten

---

**Tags:** #configuration #setup #email #timezone #seo

**Related Articles:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
