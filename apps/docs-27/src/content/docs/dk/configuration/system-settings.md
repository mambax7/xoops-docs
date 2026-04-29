---
title: "Systemindstillinger"
description: "Omfattende guide til XOOPS admin systemindstillinger, konfigurationsmuligheder og præferencehierarki"
---

# XOOPS Systemindstillinger

Denne vejledning dækker de komplette systemindstillinger, der er tilgængelige i XOOPS-administrationspanelet, organiseret efter kategori.

## Systemindstillinger arkitektur

```mermaid
graph TD
    A[System Settings] --> B[General Settings]
    A --> C[User Settings]
    A --> D[Module Settings]
    A --> E[Meta Tags & Footer]
    A --> F[Email Settings]
    A --> G[Cache Settings]
    A --> H[URL Settings]
    A --> I[Security Settings]
    B --> B1[Site Name]
    B --> B2[Timezone]
    B --> B3[Language]
    C --> C1[Registration]
    C --> C2[Profiles]
    C --> C3[Permissions]
    F --> F1[SMTP Config]
    F --> F2[Notification Rules]
```

## Adgang til systemindstillinger

### Placering

**Admin Panel > System > Præferencer**

Eller naviger direkte:

```
http://your-domain.com/xoops/admin/index.php?fct=preferences
```

### Tilladelseskrav

- Kun administratorer (webmastere) kan få adgang til systemindstillinger
- Ændringer påvirker hele webstedet
- De fleste ændringer træder i kraft med det samme

## Generelle indstillinger

Den grundlæggende konfiguration for din XOOPS installation.

### Grundlæggende oplysninger

```
Site Name: [Your Site Name]
Default Description: [Brief description of your site]
Site Slogan: [Catchy slogan]
Admin Email: admin@your-domain.com
Webmaster Name: Administrator Name
Webmaster Email: admin@your-domain.com
```

### Udseendeindstillinger

```
Default Theme: [Select theme]
Default Language: English (or preferred language)
Items Per Page: 15 (typically 10-25)
Words in Snippet: 25 (for search results)
Theme Upload Permission: Disabled (security)
```

### Regionale indstillinger

```
Default Timezone: [Your timezone]
Date Format: %Y-%m-%d (YYYY-MM-DD format)
Time Format: %H:%M:%S (HH:MM:SS format)
Daylight Saving Time: [Auto/Manual/None]
```

**Tabel med tidszoneformat:**

| Region | Tidszone | UTC Offset |
|---|---|---|
| US Eastern | Amerika/New_York | -5 / -4 |
| US Central | Amerika/Chicago | -6 / -5 |
| US Mountain | Amerika/Denver | -7 / -6 |
| USA Stillehavet | Amerika/Los_Angeles | -8 / -7 |
| Storbritannien/London | Europa/London | 0 / +1 |
| Frankrig/Tyskland | Europa/Paris | +1 / +2 |
| Japan | Asien/Tokyo | +9 |
| Kina | Asien/Shanghai | +8 |
| Australien/Sydney | Australien/Sydney | +10 / +11 |

### Søgekonfiguration

```
Enable Search: Yes
Search Admin Pages: Yes/No
Search Archives: Yes
Default Search Type: All / Pages only
Words Excluded from Search: [Comma-separated list]
```

**Almindelige udelukkede ord:**, et, et og, eller, men, i, på, ved, ved, til, fra

## Brugerindstillinger

Kontroller brugerkontoadfærd og registreringsprocessen.

### Brugerregistrering

```
Allow User Registration: Yes/No
Registration Type:
  ☐ Auto-activate (Instant access)
  ☐ Admin approval (Admin must approve)
  ☐ Email verification (User must verify email)

Notification to Users: Yes/No
User Email Verification: Required/Optional
```

### Ny brugerkonfiguration

```
Auto-login New Users: Yes/No
Assign Default User Group: Yes
Default User Group: [Select group]
Create User Avatar: Yes/No
Initial User Avatar: [Select default]
```

### Brugerprofilindstillinger

```
Allow User Profiles: Yes
Show Member List: Yes
Show User Statistics: Yes
Show Last Online Time: Yes
Allow User Avatar: Yes
Avatar Max File Size: 100KB
Avatar Dimensions: 100x100 pixels
```

### Bruger-e-mail-indstillinger

```
Allow Users to Hide Email: Yes
Show Email on Profile: Yes
Notification Email Interval: Immediately/Daily/Weekly/Never
```

### Brugeraktivitetssporing

```
Track User Activity: Yes
Log User Logins: Yes
Log Failed Logins: Yes
Track IP Address: Yes
Clear Activity Logs Older Than: 90 days
```

### Kontogrænser

```
Allow Duplicate Email: No
Minimum Username Length: 3 characters
Maximum Username Length: 15 characters
Minimum Password Length: 6 characters
Require Special Characters: Yes
Require Numbers: Yes
Password Expiration: 90 days (or Never)
Accounts Inactive Days to Delete: 365 days
```

## Modulindstillinger

Konfigurer individuel moduladfærd.

### Fælles modulindstillinger

For hvert installeret modul kan du indstille:

```
Module Status: Active/Inactive
Display in Menu: Yes/No
Module Weight: [1-999] (higher = lower in display)
Homepage Default: This module shows when visiting /
Admin Access: [Allowed user groups]
User Access: [Allowed user groups]
```

### Systemmodulindstillinger

```
Show Homepage as: Portal / Module / Static Page
Default Homepage Module: [Select module]
Show Footer Menu: Yes
Footer Color: [Color selector]
Show System Stats: Yes
Show Memory Usage: Yes
```

### Konfiguration pr. modul

Hvert modul kan have modulspecifikke indstillinger:

**Eksempel - Sidemodul:**
```
Enable Comments: Yes/No
Moderate Comments: Yes/No
Comments Per Page: 10
Enable Ratings: Yes
Allow Anonymous Ratings: Yes
```

**Eksempel - Brugermodul:**
```
Avatar Upload Folder: ./uploads/
Maximum Upload Size: 100KB
Allow File Upload: Yes
Allowed File Types: jpg, gif, png
```

Få adgang til modulspecifikke indstillinger:
- **Admin > Moduler > [Modulnavn] > Præferencer**

## Metatags & SEO-indstillinger

Konfigurer metatags til søgemaskineoptimering.

### Globale metatags

```
Meta Keywords: xoops, cms, content management system
Meta Description: A powerful content management system for building dynamic websites
Meta Author: Your Name
Meta Copyright: Copyright 2025, Your Company
Meta Robots: index, follow
Meta Revisit: 30 days
```

### Bedste praksis for metatag

| Tag | Formål | Anbefaling |
|---|---|---|
| Nøgleord | Søgeord | 5-10 relevante søgeord, kommasepareret |
| Beskrivelse | Søg liste | 150-160 tegn |
| Forfatter | Sideopretter | Dit navn eller firma |
| Copyright | Juridisk | Din copyright-meddelelse |
| Robotter | Crawler instruktioner | indeks, følg (tillad indeksering) |

### Sidefodsindstillinger

```
Show Footer: Yes
Footer Color: Dark/Light
Footer Background: [Color code]
Footer Text: [HTML allowed]
Additional Footer Links: [URL and text pairs]
```

**Eksempel på sidefod HTML:**
```html
<p>Copyright &copy; 2025 Your Company. All rights reserved.</p>
<p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Use</a></p>
```

### Sociale metatags (åben graf)

```
Enable Open Graph: Yes
Facebook App ID: [App ID]
Twitter Card Type: summary / summary_large_image / player
Default Share Image: [Image URL]
```

## E-mail-indstillinger

Konfigurer e-maillevering og meddelelsessystem.

### E-mail leveringsmetode

```
Use SMTP: Yes/No

If SMTP:
  SMTP Host: smtp.gmail.com
  SMTP Port: 587 (TLS) or 465 (SSL)
  SMTP Security: TLS / SSL / None
  SMTP Username: [email@example.com]
  SMTP Password: [password]
  SMTP Authentication: Yes/No
  SMTP Timeout: 10 seconds

If PHP mail():
  Sendmail Path: /usr/sbin/sendmail -t -i
```

### E-mail-konfiguration

```
From Address: noreply@your-domain.com
From Name: Your Site Name
Reply-To Address: support@your-domain.com
BCC Admin Emails: Yes/No
```

### Meddelelsesindstillinger

```
Send Welcome Email: Yes/No
Welcome Email Subject: Welcome to [Site Name]
Welcome Email Body: [Custom message]

Send Password Reset Email: Yes/No
Include Random Password: Yes/No
Token Expiration: 24 hours
```

### Admin-meddelelser

```
Notify Admin on Registration: Yes
Notify Admin on Comments: Yes
Notify Admin on Submissions: Yes
Notify Admin on Errors: Yes
```

### Brugermeddelelser

```
Notify User on Registration: Yes
Notify User on Comments: Yes
Notify User on Private Messages: Yes
Allow Users to Disable Notifications: Yes
Default Notification Frequency: Immediately
```

### E-mail skabeloner

Tilpas underretnings-e-mails i administratorpanelet:

**Sti:** System > E-mail-skabeloner

Tilgængelige skabeloner:
- Brugerregistrering
- Nulstilling af adgangskode
- Kommentarmeddelelse
- Privat besked
- Systemadvarsler
- Modulspecifikke e-mails

## Cacheindstillinger

Optimer ydeevnen gennem caching.

### Cache-konfiguration

```
Enable Caching: Yes/No
Cache Type:
  ☐ File Cache
  ☐ APCu (Alternative PHP Cache)
  ☐ Memcache (Distributed caching)
  ☐ Redis (Advanced caching)

Cache Lifetime: 3600 seconds (1 hour)
```

### Cacheindstillinger efter type

**Filcache:**
```
Cache Directory: /var/www/html/xoops/cache/
Clear Interval: Daily
Maximum Cache Files: 1000
```

**APCu Cache:**
```
Memory Allocation: 128MB
Fragmentation Level: Low
```

**Memcache/Redis:**
```
Server Host: localhost
Server Port: 11211 (Memcache) / 6379 (Redis)
Persistent Connection: Yes
```

### Hvad bliver cachelagret

```
Cache Module Lists: Yes
Cache Configuration Data: Yes
Cache Template Data: Yes
Cache User Session Data: Yes
Cache Search Results: Yes
Cache Database Queries: Yes
Cache RSS Feeds: Yes
Cache Images: Yes
```

## URL Indstillinger

Konfigurer URL omskrivning og formatering.

### Venlige URL indstillinger

```
Enable Friendly URLs: Yes/No
Friendly URL Type:
  ☐ Path Info: /page/about
  ☐ Query String: /index.php?p=about

Trailing Slash: Include / Omit
URL Case: Lower case / Case sensitive
```

### URL Omskrivningsregler

```
.htaccess Rules: [Display current]
Nginx Rules: [Display current if Nginx]
IIS Rules: [Display current if IIS]
```

## Sikkerhedsindstillinger

Styr sikkerhedsrelateret konfiguration.

### Adgangskodesikkerhed

```
Password Policy:
  ☐ Require uppercase letters
  ☐ Require lowercase letters
  ☐ Require numbers
  ☐ Require special characters

Minimum Password Length: 8 characters
Password Expiration: 90 days
Password History: Remember last 5 passwords
Force Password Change: On next login
```

### Loginsikkerhed

```
Lock Account After Failed Attempts: 5 attempts
Lock Duration: 15 minutes
Log All Login Attempts: Yes
Log Failed Logins: Yes
Admin Login Alert: Send email on admin login
Two-Factor Authentication: Disabled/Enabled
```

### Filoverførselssikkerhed

```
Allow File Uploads: Yes/No
Maximum File Size: 128MB
Allowed File Types: jpg, gif, png, pdf, zip, doc, docx
Scan Uploads for Malware: Yes (if available)
Quarantine Suspicious Files: Yes
```

### Sessionssikkerhed

```
Session Management: Database/Files
Session Timeout: 1800 seconds (30 min)
Session Cookie Lifetime: 0 (until browser closes)
Secure Cookie: Yes (HTTPS only)
HTTP Only Cookie: Yes (prevent JavaScript access)
```

### CORS Indstillinger

```
Allow Cross-Origin Requests: No
Allowed Origins: [List domains]
Allow Credentials: No
Allowed Methods: GET, POST
```

## Avancerede indstillinger

Yderligere konfigurationsmuligheder for avancerede brugere.

### Debug Mode

```
Debug Mode: Disabled/Enabled
Log Level: Error / Warning / Info / Debug
Debug Log File: /var/log/xoops_debug.log
Display Errors: Disabled (production)
```

### Performance Tuning

```
Optimize Database Queries: Yes
Use Query Cache: Yes
Compress Output: Yes
Minify CSS/JavaScript: Yes
Lazy Load Images: Yes
```

### Indholdsindstillinger
```
Allow HTML in Posts: Yes/No
Allowed HTML Tags: [Configure]
Strip Harmful Code: Yes
Allow Embed: Yes/No
Content Moderation: Automatic/Manual
Spam Detection: Yes
```

## Indstillinger Eksport/import

### Sikkerhedskopieringsindstillinger

Eksporter aktuelle indstillinger:

**Adminpanel > System > Værktøjer > Eksportindstillinger**

```bash
# Settings exported as JSON file
# Download and store securely
```

### Gendan indstillinger

Importer tidligere eksporterede indstillinger:

**Adminpanel > System > Værktøjer > Importindstillinger**

```bash
# Upload JSON file
# Verify changes before confirming
```

## Konfigurationshierarki

XOOPS indstillingshierarki (top til bund - første kamp vinder):

```
1. mainfile.php (Constants)
2. Module-specific config
3. Admin System Settings
4. Theme configuration
5. User preferences (for user-specific settings)
```

## Indstillinger Backup Script

Opret en sikkerhedskopi af aktuelle indstillinger:

```php
<?php
// Backup script: /var/www/html/xoops/backup-settings.php
require_once __DIR__ . '/mainfile.php';

$config_handler = xoops_getHandler('config');
$configs = $config_handler->getConfigs();

$backup = [
    'exported_date' => date('Y-m-d H:i:s'),
    'xoops_version' => XOOPS_VERSION,
    'php_version' => PHP_VERSION,
    'settings' => []
];

foreach ($configs as $config) {
    $backup['settings'][$config->getVar('conf_name')] = [
        'value' => $config->getVar('conf_value'),
        'description' => $config->getVar('conf_desc'),
        'type' => $config->getVar('conf_type'),
    ];
}

// Save to JSON file
file_put_contents(
    '/backups/xoops_settings_' . date('YmdHis') . '.json',
    json_encode($backup, JSON_PRETTY_PRINT)
);

echo "Settings backed up successfully!";
?>
```

## Ændringer i almindelige indstillinger

### Skift webstedsnavn

1. Admin > System > Præferencer > Generelle indstillinger
2. Rediger "Webstedsnavn"
3. Klik på "Gem"

### Aktiver/deaktiver registrering

1. Admin > System > Præferencer > Brugerindstillinger
2. Skift "Tillad brugerregistrering"
3. Vælg registreringstype
4. Klik på "Gem"

### Skift standardtema

1. Admin > System > Præferencer > Generelle indstillinger
2. Vælg "Standardtema"
3. Klik på "Gem"
4. Ryd cache for at ændringerne træder i kraft

### Opdater kontaktmail

1. Admin > System > Præferencer > Generelle indstillinger
2. Rediger "Admin Email"
3. Rediger "Webmaster-e-mail"
4. Klik på "Gem"

## Verifikationstjekliste

Efter konfiguration af systemindstillinger skal du kontrollere:

- [ ] Webstedets navn vises korrekt
- [ ] Tidszone viser korrekt tid
- [ ] E-mail-meddelelser sendes korrekt
- [ ] Brugerregistrering fungerer som konfigureret
- [ ] Hjemmesiden viser valgt standard
- [ ] Søgefunktionaliteten virker
- [ ] Cache forbedrer sidens indlæsningstid
- [ ] Venlige URL'er virker (hvis aktiveret)
- [ ] Metatags vises i sidekilden
- [ ] Admin-meddelelser modtaget
- [ ] Sikkerhedsindstillinger håndhæves

## Fejlfindingsindstillinger

### Indstillinger gemmes ikke

**Løsning:**
```bash
# Check file permissions on config directory
chmod 755 /var/www/html/xoops/var/

# Verify database writable
# Try saving again in admin panel
```

### Ændringer træder ikke i kraft

**Løsning:**
```bash
# Clear cache
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# If still not working, restart web server
systemctl restart apache2
```

### E-mail sendes ikke

**Løsning:**
1. Bekræft SMTP legitimationsoplysninger i e-mail-indstillinger
2. Test med knappen "Send testmail".
3. Tjek fejllogfiler
4. Prøv at bruge PHP mail() i stedet for SMTP

## Næste trin

Efter konfiguration af systemindstillinger:

1. Konfigurer sikkerhedsindstillinger
2. Optimer ydeevnen
3. Udforsk funktionerne i administrationspanelet
4. Opsæt brugeradministration

---

**Tags:** #systemindstillinger #konfiguration #præferencer #admin-panel

**Relaterede artikler:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Sikkerhed-konfiguration
- Performance-optimering
- ../First-Steps/Admin-Panel-Overview
