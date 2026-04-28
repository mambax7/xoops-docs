---
title: "Konfiguracja podstawowa"
description: "Wstępna konfiguracja XOOPS, w tym ustawienia mainfile.php, nazwa strony, poczta i konfiguracja strefy czasowej"
---

# Konfiguracja podstawowa XOOPS

Ten przewodnik obejmuje podstawowe ustawienia konfiguracji niezbędne do prawidłowego działania witryny XOOPS po instalacji.

## Konfiguracja mainfile.php

Plik `mainfile.php` zawiera krytyczną konfigurację instalacji XOOPS. Tworzony jest podczas instalacji, ale może być konieczna ręczna edycja.

### Lokalizacja

```
/var/www/html/xoops/mainfile.php
```

### Struktura pliku

```php
<?php
// Konfiguracja bazy danych
define('XOOPS_DB_TYPE', 'mysqli');  // Typ bazy danych
define('XOOPS_DB_HOST', 'localhost');  // Host bazy danych
define('XOOPS_DB_USER', 'xoops_user');  // Użytkownik bazy danych
define('XOOPS_DB_PASS', 'password');  // Hasło bazy danych
define('XOOPS_DB_NAME', 'xoops_db');  // Nazwa bazy danych
define('XOOPS_DB_PREFIX', 'xoops_');  // Prefiks tabeli

// Konfiguracja witryny
define('XOOPS_ROOT_PATH', '/var/www/html/xoops');  // Ścieżka systemu plików
define('XOOPS_URL', 'http://your-domain.com/xoops');  // Adres URL sieci web
define('XOOPS_TRUST_PATH', '/var/www/html/xoops/var');  // Ścieżka zaufana

// Zestaw znaków
define('XOOPS_DB_CHARSET', 'utf8mb4');  // Zestaw znaków bazy danych
define('_CHARSET', 'UTF-8');  // Zestaw znaków strony

// Tryb debugowania (ustaw na 0 w produkcji)
define('XOOPS_DEBUG', 0);  // Ustaw na 1 do debugowania
?>
```

### Wyjaśnienie ustawień krytycznych

| Ustawienie | Cel | Przykład |
|---|---|---|
| `XOOPS_DB_TYPE` | System bazy danych | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Lokalizacja serwera bazy danych | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Nazwa użytkownika bazy danych | `xoops_user` |
| `XOOPS_DB_PASS` | Hasło bazy danych | [bezpieczne_hasło] |
| `XOOPS_DB_NAME` | Nazwa bazy danych | `xoops_db` |
| `XOOPS_DB_PREFIX` | Prefiks nazwy tabeli | `xoops_` (umożliwia wiele XOOPS w jednej BD) |
| `XOOPS_ROOT_PATH` | Fizyczna ścieżka systemu plików | `/var/www/html/xoops` |
| `XOOPS_URL` | Adres URL dostępny w sieci | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Ścieżka zaufana (poza katalogiem internetowym) | `/var/www/xoops_var` |

### Edycja mainfile.php

Otwórz mainfile.php w edytorze tekstu:

```bash
# Używanie nano
nano /var/www/html/xoops/mainfile.php

# Używanie vi
vi /var/www/html/xoops/mainfile.php

# Używanie sed (wyszukaj i zamień)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Typowe zmiany mainfile.php

**Zmiana adresu URL witryny:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Włączenie trybu debugowania (tylko dla rozwoju):**
```php
define('XOOPS_DEBUG', 1);
```

**Zmiana prefiksu tabeli (jeśli potrzeba):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Przeniesienie ścieżki zaufanej poza katalog internetowy (zaawansowane):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Konfiguracja panelu administracyjnego

Skonfiguruj podstawowe ustawienia za pośrednictwem panelu administracyjnego XOOPS.

### Dostęp do ustawień systemu

1. Zaloguj się do panelu administracyjnego: `http://your-domain.com/xoops/admin/`
2. Przejdź do: **System > Preferencje > Ustawienia ogólne**
3. Modyfikuj ustawienia (patrz poniżej)
4. Kliknij "Zapisz" u dołu

### Nazwa i opis witryny

Skonfiguruj sposób wyświetlania witryny:

```
Nazwa witryny: Moja witryna XOOPS
Opis witryny: Dynamiczny system zarządzania zawartością
Slogan witryny: Zbudowany z XOOPS
```

### Informacje kontaktowe

Ustaw szczegóły kontaktu witryny:

```
Email administratora witryny: admin@your-domain.com
Nazwa administratora witryny: Administrator witryny
Email formularza kontaktowego: support@your-domain.com
Email pomocy: help@your-domain.com
```

### Język i region

Ustaw domyślny język i region:

```
Domyślny język: Polski
Domyślna strefa czasowa: Europe/Warsaw  (lub Twoja strefa czasowa)
Format daty: %Y-%m-%d
Format czasu: %H:%M:%S
```

## Konfiguracja poczty elektronicznej

Skonfiguruj ustawienia poczty elektronicznej dla powiadomień i komunikacji użytkowników.

### Lokalizacja ustawień poczty

**Panel administracyjny:** System > Preferencje > Ustawienia poczty

### Konfiguracja SMTP

Aby uzyskać niezawodne dostarczanie wiadomości e-mail, użyj SMTP zamiast PHP mail():

```
Użyj SMTP: Tak
Host SMTP: smtp.gmail.com  (lub dostawca SMTP)
Port SMTP: 587  (TLS) lub 465 (SSL)
Nazwa użytkownika SMTP: your-email@gmail.com
Hasło SMTP: [hasło_aplikacji]
Bezpieczeństwo SMTP: TLS lub SSL
```

### Przykład konfiguracji Gmail

Skonfiguruj XOOPS do wysyłania poczty przez Gmail:

```
Host SMTP: smtp.gmail.com
Port SMTP: 587
Bezpieczeństwo SMTP: TLS
Nazwa użytkownika SMTP: your-email@gmail.com
Hasło SMTP: [Hasło aplikacji Google - NIE zwykłe hasło]
Adres nadawcy: your-email@gmail.com
Nazwa nadawcy: Nazwa Twojej witryny
```

**Uwaga:** Gmail wymaga hasła aplikacji, a nie hasła Gmail:
1. Przejdź do https://myaccount.google.com/apppasswords
2. Wygeneruj hasło aplikacji dla "Poczty" i "Komputera Windows"
3. Użyj wygenerowanego hasła w XOOPS

### Konfiguracja PHP mail() (Prostsze, ale mniej niezawodne)

Jeśli SMTP jest niedostępny, użyj PHP mail():

```
Użyj SMTP: Nie
Adres nadawcy: noreply@your-domain.com
Nazwa nadawcy: Nazwa Twojej witryny
```

Upewnij się, że serwer ma skonfigurowany sendmail lub postfix:

```bash
# Sprawdź dostępność sendmail
which sendmail

# Lub sprawdź postfix
systemctl status postfix
```

### Ustawienia funkcji poczty

Skonfiguruj co wyzwala wiadomości e-mail:

```
Wyślij powiadomienia: Tak
Powiadom administratora przy rejestracji użytkownika: Tak
Wyślij powitalną wiadomość nowym użytkownikom: Tak
Wyślij link resetowania hasła: Tak
Włącz pocztę użytkownika: Tak
Włącz prywatne wiadomości: Tak
Powiadom przy działaniach administratora: Tak
```

## Konfiguracja strefy czasowej

Ustaw prawidłową strefę czasową dla poprawnych znaczników czasu i planowania.

### Ustawienie strefy czasowej w panelu administracyjnym

**Ścieżka:** System > Preferencje > Ustawienia ogólne

```
Domyślna strefa czasowa: [Wybierz swoją strefę czasową]
```

**Popularne strefy czasowe:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Europe/Warsaw (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Weryfikacja strefy czasowej

Sprawdź bieżącą strefę czasową serwera:

```bash
# Pokaż bieżącą strefę czasową
timedatectl

# Lub sprawdź datę
date +%Z

# Wylistuj dostępne strefy czasowe
timedatectl list-timezones
```

### Ustawienie strefy czasowej systemu (Linux)

```bash
# Ustaw strefę czasową
timedatectl set-timezone Europe/Warsaw

# Lub użyj metody dowiązania symbolicznego
ln -sf /usr/share/zoneinfo/Europe/Warsaw /etc/localtime

# Weryfikuj
date
```

## Konfiguracja adresu URL

### Włączenie czystych adresów URL (przyjaznych adresów URL)

Dla adresów URL takich jak `/page/about` zamiast `/index.php?page=about`

**Wymagania:**
- Apache z włączonym mod_rewrite
- Plik `.htaccess` w głównym katalogu XOOPS

**Włącz w panelu administracyjnym:**

1. Przejdź do: **System > Preferencje > Ustawienia adresu URL**
2. Zaznacz: "Włącz przyjazne adresy URL"
3. Wybierz: "Typ adresu URL" (Path Info lub Query)
4. Zapisz

**Weryfikuj istnienie .htaccess:**

```bash
cat /var/www/html/xoops/.htaccess
```

Przykładowa zawartość .htaccess:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Rozwiązywanie problemów z czystymi adresami URL:**

```bash
# Weryfikuj włączenie mod_rewrite
apache2ctl -M | grep rewrite

# Włącz jeśli potrzeba
a2enmod rewrite

# Uruchom ponownie Apache
systemctl restart apache2

# Przetestuj regułę przepisywania
curl -I http://your-domain.com/xoops/index.php
```

### Skonfiguruj adres URL witryny

**Panel administracyjny:** System > Preferencje > Ustawienia ogólne

Ustaw prawidłowy adres URL dla domeny:

```
Adres URL witryny: http://your-domain.com/xoops/
```

Lub jeśli XOOPS jest w katalogu głównym:

```
Adres URL witryny: http://your-domain.com/
```

## Optymalizacja dla wyszukiwarek (SEO)

Skonfiguruj ustawienia SEO dla lepszej widoczności w wyszukiwarkach.

### Znaczniki Meta

Ustaw globalne znaczniki meta:

**Panel administracyjny:** System > Preferencje > Ustawienia SEO

```
Słowa kluczowe meta: xoops, cms, zarządzanie zawartością
Opis meta: Dynamiczny system zarządzania zawartością
```

Pojawiają się w sekcji `<head>` strony:

```html
<meta name="keywords" content="xoops, cms, zarządzanie zawartością">
<meta name="description" content="Dynamiczny system zarządzania zawartością">
```

### Mapa witryny

Włącz mapę witryny XML dla wyszukiwarek:

1. Przejdź do: **System > Moduły**
2. Znajdź moduł "Mapa witryny"
3. Kliknij aby zainstalować i aktywować
4. Dostęp do mapy witryny pod: `/xoops/sitemap.xml`

### Robots.txt

Kontroluj crawlowanie wyszukiwarek:

Utwórz `/var/www/html/xoops/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Ustawienia użytkownika

Skonfiguruj domyślne ustawienia związane z użytkownikami.

### Rejestracja użytkownika

**Panel administracyjny:** System > Preferencje > Ustawienia użytkownika

```
Zezwól na rejestrację użytkownika: Tak/Nie
Typ rejestracji użytkownika:
  - Natychmiastowa (Automatyczne zatwierdzenie)
  - Wymagane zatwierdzenie (Zatwierdzenie przez administratora)
  - Weryfikacja wiadomości e-mail (Wymagane potwierdzenie wiadomości e-mail)

Wymagane potwierdzenie wiadomości e-mail: Tak/Nie
Metoda aktywacji konta: Automatyczna/Ręczna
```

### Profil użytkownika

```
Włącz profile użytkownika: Tak
Pokaż awatar użytkownika: Tak
Maksymalny rozmiar awatara: 100KB
Wymiary awatara: 100x100 pikseli
```

### Wyświetlanie poczty użytkownika

```
Pokaż email użytkownika: Nie (ze względu na prywatność)
Użytkownicy mogą ukryć email: Tak
Użytkownicy mogą zmienić awatar: Tak
Użytkownicy mogą przesyłać pliki: Tak
```

## Konfiguracja cache

Popraw wydajność dzięki prawidłowemu buforowaniu.

### Ustawienia cache

**Panel administracyjny:** System > Preferencje > Ustawienia cache

```
Włącz cache: Tak
Metoda cache: Plik (lub APCu/Memcache jeśli dostępne)
Czas życia cache: 3600 sekund (1 godzina)
```

### Wyczyść cache

Wyczyść stare pliki cache:

```bash
# Ręczne czyszczenie cache
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Z panelu administracyjnego:
# System > Pulpit > Narzędzia > Wyczyść cache
```

## Checklist ustawień początkowych

Po instalacji skonfiguruj:

- [ ] Nazwa i opis witryny ustawione poprawnie
- [ ] Email administratora skonfigurowany
- [ ] Ustawienia poczty SMTP skonfigurowane i przetestowane
- [ ] Strefa czasowa ustawiona na Twój region
- [ ] Adres URL skonfigurowany poprawnie
- [ ] Czyste adresy URL (przyjazne adresy URL) włączone jeśli pożądane
- [ ] Ustawienia rejestracji użytkownika skonfigurowane
- [ ] Znaczniki meta dla SEO skonfigurowane
- [ ] Domyślny język wybrany
- [ ] Ustawienia cache włączone
- [ ] Hasło użytkownika administracyjnego jest silne (16+ znaków)
- [ ] Przetestuj rejestrację użytkownika
- [ ] Przetestuj funkcjonalność poczty
- [ ] Przetestuj przesyłanie pliku
- [ ] Odwiedź stronę główną i sprawdź wygląd

## Testowanie konfiguracji

### Przetestuj pocztę

Wyślij testową wiadomość e-mail:

**Panel administracyjny:** System > Test poczty

Lub ręcznie:

```php
<?php
// Utwórz plik testowy: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('Test poczty XOOPS');
$mailer->setBody('To jest testowa wiadomość e-mail z XOOPS');

if ($mailer->send()) {
    echo "Wiadomość e-mail wysłana pomyślnie!";
} else {
    echo "Nie udało się wysłać wiadomości e-mail: " . $mailer->getError();
}
?>
```

### Przetestuj połączenie z bazą danych

```php
<?php
// Utwórz plik testowy: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Baza danych połączona pomyślnie!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Zapytanie powiodło się!";
    }
} else {
    echo "Nie udało się nawiązać połączenia z bazą danych!";
}
?>
```

**Ważne:** Usuń pliki testowe po testowaniu!

```bash
rm /var/www/html/xoops/test-*.php
```

## Podsumowanie plików konfiguracyjnych

| Plik | Cel | Metoda edycji |
|---|---|---|
| mainfile.php | Ustawienia bazy danych i rdzenia | Edytor tekstu |
| Panel administracyjny | Większość ustawień | Interfejs sieciowy |
| .htaccess | Przepisywanie adresu URL | Edytor tekstu |
| robots.txt | Crawlowanie wyszukiwarek | Edytor tekstu |

## Następne kroki

Po konfiguracji podstawowej:

1. Szczegółowo skonfiguruj ustawienia systemu
2. Wzmocnij bezpieczeństwo
3. Przeglądaj panel administracyjny
4. Utwórz pierwszą zawartość
5. Skonfiguruj konta użytkowników

---

**Tagi:** #konfiguracja #konfiguracja #poczta #strefa-czasowa #seo

**Powiązane artykuły:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
