---
title: "Sistemske nastavitve"
description: "Obsežen vodnik po XOOPS skrbniških sistemskih nastavitvah, konfiguracijskih možnostih in hierarhiji nastavitev"
---
# XOOPS Sistemske nastavitve

Ta priročnik pokriva celotne sistemske nastavitve, ki so na voljo v skrbniški plošči XOOPS, razvrščene po kategorijah.

## Arhitektura sistemskih nastavitev
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
## Dostop do sistemskih nastavitev

### Lokacija

**Skrbniška plošča > Sistem > Nastavitve**

Ali pa navigirajte neposredno:
```
http://your-domain.com/xoops/admin/index.php?fct=preferences
```
### Zahteve za dovoljenje

- Samo skrbniki (spletni skrbniki) lahko dostopajo do sistemskih nastavitev
- Spremembe vplivajo na celotno spletno mesto
- Večina sprememb stopi v veljavo takoj

## Splošne nastavitve

Osnovna konfiguracija za vašo namestitev XOOPS.

### Osnovne informacije
```
Site Name: [Your Site Name]
Default Description: [Brief description of your site]
Site Slogan: [Catchy slogan]
Admin Email: admin@your-domain.com
Webmaster Name: Administrator Name
Webmaster Email: admin@your-domain.com
```
### Nastavitve videza
```
Default Theme: [Select theme]
Default Language: English (or preferred language)
Items Per Page: 15 (typically 10-25)
Words in Snippet: 25 (for search results)
Theme Upload Permission: Disabled (security)
```
### Regionalne nastavitve
```
Default Timezone: [Your timezone]
Date Format: %Y-%m-%d (YYYY-MM-DD format)
Time Format: %H:%M:%S (HH:MM:SS format)
Daylight Saving Time: [Auto/Manual/None]
```
**Tabela oblike časovnega pasu:**

| Regija | Časovni pas | UTC Odmik |
|---|---|---|
| Vzhod ZDA | America/New_York | -5 / -4 |
| Srednja ZDA | America/Chicago | -6 / -5 |
| US Mountain | America/Denver | -7 / -6 |
| ZDA Pacifik | America/Los_Angeles | -8 / -7 |
| UK/London | Europe/London | 0 / +1 |
| France/Germany | Europe/Paris | +1 / +2 |
| Japonska | Asia/Tokyo | +9 |
| Kitajska | Asia/Shanghai | +8 |
| Australia/Sydney | Australia/Sydney | +10 / +11 |

### Konfiguracija iskanja
```
Enable Search: Yes
Search Admin Pages: Yes/No
Search Archives: Yes
Default Search Type: All / Pages only
Words Excluded from Search: [Comma-separated list]
```
**Pogoste izključene besede:** the, a, an, and, or, but, in, on, at, by, to, from

## Uporabniške nastavitve

Nadzorujte vedenje uporabniškega računa in postopek registracije.

### Registracija uporabnika
```
Allow User Registration: Yes/No
Registration Type:
  ☐ Auto-activate (Instant access)
  ☐ Admin approval (Admin must approve)
  ☐ Email verification (User must verify email)

Notification to Users: Yes/No
User Email Verification: Required/Optional
```
### Nova uporabniška konfiguracija
```
Auto-login New Users: Yes/No
Assign Default User Group: Yes
Default User Group: [Select group]
Create User Avatar: Yes/No
Initial User Avatar: [Select default]
```
### Nastavitve uporabniškega profila
```
Allow User Profiles: Yes
Show Member List: Yes
Show User Statistics: Yes
Show Last Online Time: Yes
Allow User Avatar: Yes
Avatar Max File Size: 100KB
Avatar Dimensions: 100x100 pixels
```
### Uporabniške e-poštne nastavitve
```
Allow Users to Hide Email: Yes
Show Email on Profile: Yes
Notification Email Interval: Immediately/Daily/Weekly/Never
```
### Sledenje dejavnosti uporabnika
```
Track User Activity: Yes
Log User Logins: Yes
Log Failed Logins: Yes
Track IP Address: Yes
Clear Activity Logs Older Than: 90 days
```
### Omejitve računa
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
## Nastavitve modula

Konfigurirajte vedenje posameznega modula.

### Skupne možnosti modula

Za vsak nameščen modul lahko nastavite:
```
Module Status: Active/Inactive
Display in Menu: Yes/No
Module Weight: [1-999] (higher = lower in display)
Homepage Default: This module shows when visiting /
Admin Access: [Allowed user groups]
User Access: [Allowed user groups]
```
### Nastavitve sistemskega modula
```
Show Homepage as: Portal / Module / Static Page
Default Homepage Module: [Select module]
Show Footer Menu: Yes
Footer Color: [Color selector]
Show System Stats: Yes
Show Memory Usage: Yes
```
### Konfiguracija na modul

Vsak modul ima lahko nastavitve, specifične za modul:

**Primer – modul strani:**
```
Enable Comments: Yes/No
Moderate Comments: Yes/No
Comments Per Page: 10
Enable Ratings: Yes
Allow Anonymous Ratings: Yes
```
**Primer – uporabniški modul:**
```
Avatar Upload Folder: ./uploads/
Maximum Upload Size: 100KB
Allow File Upload: Yes
Allowed File Types: jpg, gif, png
```
Dostop do nastavitev, specifičnih za modul:
- **Skrbnik > Moduli > [Ime modula] > Nastavitve**

## Meta oznake & SEO Nastavitve

Konfigurirajte meta oznake za optimizacijo iskalnikov.

### Globalne meta oznake
```
Meta Keywords: xoops, cms, content management system
Meta Description: A powerful content management system for building dynamic websites
Meta Author: Your Name
Meta Copyright: Copyright 2025, Your Company
Meta Robots: index, follow
Meta Revisit: 30 days
```
### Najboljše prakse metaoznak

| Oznaka | Namen | Priporočilo |
|---|---|---|
| Ključne besede | Iskalni izrazi | 5-10 ustreznih ključnih besed, ločenih z vejico |
| Opis | Iskalni seznam | 150-160 znakov |
| Avtor | Ustvarjalec strani | Vaše ime ali podjetje |
| Avtorske pravice | Pravno | Vaše obvestilo o avtorskih pravicah |
| Roboti | Navodila za pajke | indeks, sledi (omogoča indeksiranje) |

### Nastavitve noge
```
Show Footer: Yes
Footer Color: Dark/Light
Footer Background: [Color code]
Footer Text: [HTML allowed]
Additional Footer Links: [URL and text pairs]
```
**Vzorec noge HTML:**
```html
<p>Copyright &copy; 2025 Your Company. All rights reserved.</p>
<p><a href="/privacy">Privacy Policy</a> | <a href="/terms">Terms of Use</a></p>
```
### Socialne metaoznake (odprti graf)
```
Enable Open Graph: Yes
Facebook App ID: [App ID]
Twitter Card Type: summary / summary_large_image / player
Default Share Image: [Image URL]
```
## Nastavitve e-pošte

Konfigurirajte dostavo e-pošte in sistem obveščanja.

### Način dostave e-pošte
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
### Konfiguracija e-pošte
```
From Address: noreply@your-domain.com
From Name: Your Site Name
Reply-To Address: support@your-domain.com
BCC Admin Emails: Yes/No
```
### Nastavitve obvestil
```
Send Welcome Email: Yes/No
Welcome Email Subject: Welcome to [Site Name]
Welcome Email Body: [Custom message]

Send Password Reset Email: Yes/No
Include Random Password: Yes/No
Token Expiration: 24 hours
```
### Skrbniška obvestila
```
Notify Admin on Registration: Yes
Notify Admin on Comments: Yes
Notify Admin on Submissions: Yes
Notify Admin on Errors: Yes
```
### Obvestila uporabnika
```
Notify User on Registration: Yes
Notify User on Comments: Yes
Notify User on Private Messages: Yes
Allow Users to Disable Notifications: Yes
Default Notification Frequency: Immediately
```
### E-poštne predloge

Prilagodite e-poštna obvestila v skrbniški plošči:

**Pot:** Sistem > E-poštne predloge

Razpoložljive predloge:
- Registracija uporabnika
- Ponastavitev gesla
- Obvestilo o komentarju
- Zasebno sporočilo
- Sistemska opozorila
- E-poštna sporočila za posamezne module

## Nastavitve predpomnilnika

Optimizirajte delovanje s predpomnilnikom.

### Konfiguracija predpomnilnika
```
Enable Caching: Yes/No
Cache Type:
  ☐ File Cache
  ☐ APCu (Alternative PHP Cache)
  ☐ Memcache (Distributed caching)
  ☐ Redis (Advanced caching)

Cache Lifetime: 3600 seconds (1 hour)
```
### Možnosti predpomnilnika po vrsti

**Predpomnilnik datotek:**
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
### Kaj se shrani v predpomnilnik
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
## URL Nastavitve

Konfigurirajte prepisovanje in oblikovanje URL.

### Prijazne URL nastavitve
```
Enable Friendly URLs: Yes/No
Friendly URL Type:
  ☐ Path Info: /page/about
  ☐ Query String: /index.php?p=about

Trailing Slash: Include / Omit
URL Case: Lower case / Case sensitive
```
### URL Prepiši pravila
```
.htaccess Rules: [Display current]
Nginx Rules: [Display current if Nginx]
IIS Rules: [Display current if IIS]
```
## Varnostne nastavitve

Nadzor konfiguracije, povezane z varnostjo.

### Varnost z geslom
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
### Varnost prijave
```
Lock Account After Failed Attempts: 5 attempts
Lock Duration: 15 minutes
Log All Login Attempts: Yes
Log Failed Logins: Yes
Admin Login Alert: Send email on admin login
Two-Factor Authentication: Disabled/Enabled
```
### Varnost nalaganja datotek
```
Allow File Uploads: Yes/No
Maximum File Size: 128MB
Allowed File Types: jpg, gif, png, pdf, zip, doc, docx
Scan Uploads for Malware: Yes (if available)
Quarantine Suspicious Files: Yes
```
### Varnost seje
```
Session Management: Database/Files
Session Timeout: 1800 seconds (30 min)
Session Cookie Lifetime: 0 (until browser closes)
Secure Cookie: Yes (HTTPS only)
HTTP Only Cookie: Yes (prevent JavaScript access)
```
### CORS Nastavitve
```
Allow Cross-Origin Requests: No
Allowed Origins: [List domains]
Allow Credentials: No
Allowed Methods: GET, POST
```
## Napredne nastavitve

Dodatne možnosti konfiguracije za napredne uporabnike.

### Način odpravljanja napak
```
Debug Mode: Disabled/Enabled
Log Level: Error / Warning / Info / Debug
Debug Log File: /var/log/xoops_debug.log
Display Errors: Disabled (production)
```
### Nastavitev zmogljivosti
```
Optimize Database Queries: Yes
Use Query Cache: Yes
Compress Output: Yes
Minify CSS/JavaScript: Yes
Lazy Load Images: Yes
```
### Nastavitve vsebine
```
Allow HTML in Posts: Yes/No
Allowed HTML Tags: [Configure]
Strip Harmful Code: Yes
Allow Embed: Yes/No
Content Moderation: Automatic/Manual
Spam Detection: Yes
```
## Nastavitve Export/Import

### Nastavitve varnostnega kopiranja

Izvoz trenutnih nastavitev:

**Skrbniška plošča > Sistem > Orodja > Izvozi nastavitve**
```bash
# Settings exported as JSON file
# Download and store securely
```
### Obnovi nastavitve

Uvozi predhodno izvožene nastavitve:

**Skrbniška plošča > Sistem > Orodja > Uvozi nastavitve**
```bash
# Upload JSON file
# Verify changes before confirming
```
## Hierarhija konfiguracije

XOOPS hierarhija nastavitev (od zgoraj navzdol - prva tekma zmaga):
```
1. mainfile.php (Constants)
2. Module-specific config
3. Admin System Settings
4. Theme configuration
5. User preferences (for user-specific settings)
```
## Nastavitve Varnostni skript

Ustvarite varnostno kopijo trenutnih nastavitev:
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
## Pogoste spremembe nastavitev

### Spremeni ime mesta

1. Skrbnik > Sistem > Nastavitve > Splošne nastavitve
2. Spremenite »Ime spletnega mesta«
3. Kliknite »Shrani«

### Enable/Disable Registracija

1. Skrbnik > Sistem > Nastavitve > Uporabniške nastavitve
2. Preklopite »Dovoli registracijo uporabnika«
3. Izberite vrsto registracije
4. Kliknite »Shrani«

### Spremeni privzeto temo

1. Skrbnik > Sistem > Nastavitve > Splošne nastavitve
2. Izberite "Privzeta tema"
3. Kliknite »Shrani«
4. Počistite predpomnilnik, da bodo spremembe začele veljati

### Posodobi kontaktni e-poštni naslov

1. Skrbnik > Sistem > Nastavitve > Splošne nastavitve
2. Spremenite "E-poštni naslov skrbnika"
3. Spremenite "E-poštni naslov spletnega skrbnika"
4. Kliknite »Shrani«

## Kontrolni seznam za preverjanje

Po konfiguraciji sistemskih nastavitev preverite:

- [ ] Ime spletnega mesta je pravilno prikazano
- [ ] Časovni pas prikazuje točen čas
- [ ] E-poštna obvestila se pošiljajo pravilno
- [ ] Registracija uporabnika deluje, kot je konfigurirano
- [ ] Domača stran prikazuje izbrano privzeto
- [ ] Funkcija iskanja deluje
- [ ] Predpomnilnik izboljša čas nalaganja strani
- [ ] Prijazni URL-ji delujejo (če so omogočeni)
- [ ] Meta oznake se prikažejo v viru strani
- [ ] Prejeta skrbniška obvestila
- [ ] Varnostne nastavitve so uveljavljene

## Nastavitve za odpravljanje težav

### Nastavitve se ne shranjujejo

**Rešitev:**
```bash
# Check file permissions on config directory
chmod 755 /var/www/html/xoops/var/

# Verify database writable
# Try saving again in admin panel
```
### Spremembe ne veljajo

**Rešitev:**
```bash
# Clear cache
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# If still not working, restart web server
systemctl restart apache2
```
### E-pošta se ne pošilja

**Rešitev:**
1. Preverite poverilnice SMTP v nastavitvah e-pošte
2. Preizkusite z gumbom "Pošlji testno e-pošto".
3. Preverite dnevnike napak
4. Poskusite uporabiti PHP mail() namesto SMTP

## Naslednji koraki

Po konfiguraciji sistemskih nastavitev:

1. Konfigurirajte varnostne nastavitve
2. Optimizirajte delovanje
3. Raziščite funkcije skrbniške plošče
4. Nastavite upravljanje uporabnikov

---

**Oznake:** #system-settings #configuration #preferences #admin-panel

**Povezani članki:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- Varnostna konfiguracija
- Optimizacija zmogljivosti
- ../First-Steps/Admin-Panel-Overview