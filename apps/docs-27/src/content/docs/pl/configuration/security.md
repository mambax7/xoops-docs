---
title: "Konfiguracja bezpieczeństwa"
description: "Kompletny przewodnik wzmacniania bezpieczeństwa dla XOOPS, w tym uprawnienia do plików, SSL/HTTPS, katalogi wrażliwe i najlepsze praktyki bezpieczeństwa"
---

# Konfiguracja bezpieczeństwa XOOPS

Kompleksowy przewodnik zabezpieczania instalacji XOOPS przed powszechnymilukami w bezpieczeństwie sieci.

## Checklist bezpieczeństwa

Przed uruchomieniem witryny wdrażaj te środki bezpieczeństwa:

- [ ] Uprawnienia do plików ustawione poprawnie (644/755)
- [ ] Folder instalacji usunięty lub chroniony
- [ ] mainfile.php chroniony przed modyfikacją
- [ ] SSL/HTTPS włączony na wszystkich stronach
- [ ] Folder administracyjny przemianowany lub chroniony
- [ ] Poufne pliki niedostępne sieciowo
- [ ] Ograniczenia .htaccess w miejscu
- [ ] Automatyczne kopie zapasowe
- [ ] Nagłówki bezpieczeństwa skonfigurowane
- [ ] Ochrona CSRF włączona
- [ ] Ochrony przed wstrzyknięciami SQL aktywne
- [ ] Moduły/rozszerzenia zaktualizowane

## Bezpieczeństwo systemu plików

### Uprawnienia do plików

Prawidłowe uprawnienia do plików są krytyczne dla bezpieczeństwa.

#### Wytyczne dotyczące uprawnień

| Ścieżka | Uprawnienia | Właściciel | Powód |
|---|---|---|---|
| mainfile.php | 644 | root | Zawiera poświadczenia BD |
| pliki *.php | 644 | root | Zapobiegaj nieautoryzowanej modyfikacji |
| Katalogi | 755 | root | Zezwól na czytanie, zapobiegnij pisaniu |
| cache/ | 777 | www-data | Serwer www musi pisać |
| templates_c/ | 777 | www-data | Skompilowane szablony |
| uploads/ | 777 | www-data | Przesyłanie przez użytkownika |
| var/ | 777 | www-data | Dane zmienne |
| install/ | Usuń | - | Usuń po instalacji |
| configs/ | 755 | root | Czytelne, nie do zapisu |

#### Skrypt ustawiania uprawnień

```bash
#!/bin/bash
# Plik: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# Ustaw własność
echo "Ustawianie własności..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Ustaw restrykcyjne uprawnienia domyślne
echo "Ustawianie uprawnień podstawowych..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Ustaw określone katalogi jako zapisywalne
echo "Ustawianie katalogów z możliwością zapisu..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# Chroń wrażliwe pliki
echo "Ochrona wrażliwych plików..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # Jeśli istnieje (tylko do odczytu)

# Weryfikuj uprawnienia
echo "Weryfikowanie uprawnień..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "Wzmacnianie bezpieczeństwa ukończone!"
```

Uruchom skrypt:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### Usuń folder instalacji

**KRYTYCZNE:** Folder instalacji musi być usunięty po instalacji!

```bash
# Opcja 1: Usuń całkowicie
rm -rf /var/www/html/xoops/install/

# Opcja 2: Zmień nazwę i zachowaj do referencji
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Weryfikuj usunięcie
ls -la /var/www/html/xoops/ | grep install
```

### Chroń katalogi wrażliwe

Utwórz pliki .htaccess aby zablokować dostęp sieciowy do poufnych folderów:

**Plik: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**Plik: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**Plik: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### Chroń katalog przesyłania

Zapobiegaj wykonywaniu skryptów w przesyłaniach:

**Plik: /var/www/html/xoops/uploads/.htaccess**

```apache
# Zapobiegaj wykonywaniu skryptów
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# Zapobiegaj wylistowaniu katalogu
Options -Indexes

# Dodatkowa ochrona
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # Blokuj podejrzane pliki
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## Konfiguracja SSL/HTTPS

Szyfruj cały ruch pomiędzy użytkownikami a serwerem.

### Uzyskaj certyfikat SSL

**Opcja 1: Bezpłatny certyfikat z Let's Encrypt**

```bash
# Zainstaluj Certbot
apt-get install certbot python3-certbot-apache

# Uzyskaj certyfikat (automatycznie konfiguruje Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Weryfikuj zainstalowany certyfikat
ls /etc/letsencrypt/live/your-domain.com/
```

**Opcja 2: Komercyjny certyfikat SSL**

Skontaktuj się z dostawcą SSL lub rejestratorem:
1. Kup certyfikat SSL
2. Weryfikuj własność domeny
3. Zainstaluj pliki certyfikatu na serwerze
4. Skonfiguruj serwer internetowy

### Konfiguracja SSL Apache

Utwórz wirtualnego hosta HTTPS:

**Plik: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # Konfiguracja SSL
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # Nagłówki bezpieczeństwa
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "no-referrer-when-downgrade"
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"

    <Directory /var/www/html/xoops>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Ograniczaj folder instalacji
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # Rejestrowanie
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# Przekieruj HTTP do HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

Włącz konfigurację:

```bash
# Włącz moduł SSL
a2enmod ssl

# Włącz witrynę
a2ensite xoops-ssl

# Wyłącz witrynę bez SSL jeśli istnieje
a2dissite 000-default

# Przetestuj konfigurację
apache2ctl configtest
# Powinno wyjść: Syntax OK

# Uruchom Apache ponownie
systemctl restart apache2
```

### Konfiguracja SSL Nginx

**Plik: /etc/nginx/sites-available/xoops**

```nginx
# Przekieruj HTTP do HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Serwer HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # Konfiguracja certyfikatu SSL
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Nowoczesna konfiguracja SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Nagłówek HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Nagłówki bezpieczeństwa
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # Ograniczaj folder instalacji
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # Odrzuć dostęp do wrażliwych plików
    location ~ /\. {
        deny all;
    }

    # Backend PHP-FPM
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Buforowanie plików statycznych
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Przepisywanie adresu URL
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Rejestrowanie
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

Włącz konfigurację:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Weryfikuj instalację HTTPS

```bash
# Przetestuj konfigurację SSL
openssl s_client -connect your-domain.com:443 -tls1_2

# Sprawdź ważność certyfikatu
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# Test SSL/TLS online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Automatyczne odnowienie certyfikatu Let's Encrypt

```bash
# Włącz automatyczne odnowienie
systemctl enable certbot.timer
systemctl start certbot.timer

# Przetestuj proces odnowienia
certbot renew --dry-run

# Ręczne odnowienie jeśli potrzeba
certbot renew --force-renewal
```

## Bezpieczeństwo aplikacji webowej

### Ochrona przed wstrzykiwaniem SQL

XOOPS używa sparametryzowanych zapytań (domyślnie bezpieczne), ale zawsze:

```php
// NIEBEZPIECZNE - Nigdy tego nie rób!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// BEZPIECZNE - Użyj przygotowanych stwierdzeń
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### Zapobieganie Cross-Site Scripting (XSS)

Zawsze oczyszczaj dane wejściowe użytkownika:

```php
// NIEBEZPIECZNE
echo $_GET['user_input'];

// BEZPIECZNE - Użyj funkcji dezynfekcji XOOPS
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Lub użyj funkcji XOOPS
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### Zapobieganie Cross-Site Request Forgery (CSRF)

XOOPS zawiera ochronę przed tokenami CSRF. Zawsze dołączaj tokeny:

```html
<!-- W formularzach -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### Wyłącz wykonywanie PHP w folderze przesyłania

Zapobiegaj atakującym przesyłaniu i wykonywaniu PHP:

```bash
# Utwórz .htaccess w folderze uploads
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternatywa: Wyłącz wykonywanie globalnie w uploads
chmod 444 /var/www/html/xoops/uploads/  # Tylko do odczytu
```

### Nagłówki bezpieczeństwa

Skonfiguruj ważne nagłówki bezpieczeństwa HTTP:

```apache
# Strict-Transport-Security (HSTS)
# Wymusza HTTPS przez 1 rok
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# Zapobiega wykrywaniu typów MIME
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# Zapobiega atakom clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# Ochrona XSS przeglądarki
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Kontroluje informacje referera
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# Kontroluje ładowanie zasobów
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## Bezpieczeństwo panelu administracyjnego

### Zmień nazwę folderu administracyjnego

Chroń folder administracyjny poprzez zmianę jego nazwy:

```bash
# Zmień nazwę folderu administracyjnego
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Zaktualizuj adres URL dostępu administratora
# Stary: http://your-domain.com/xoops/admin/
# Nowy: http://your-domain.com/xoops/myadmin123/
```

Skonfiguruj XOOPS do korzystania z zmienionego folderu:

Edytuj mainfile.php:

```php
// Zmień tę linię
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### Białe listy IP dla administracji

Ograniczaj dostęp administratora do określonych adresów IP:

**Plik: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Zezwól tylko na określone adresy IP
<RequireAll>
    Require ip 192.168.1.100   # Twój IP biura
    Require ip 203.0.113.50    # Twój IP domu
    Deny from all
</RequireAll>
```

Lub z Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### Silne poświadczenia administracyjne

Wymusź silne hasła dla administratorów:

1. Użyj co najmniej 16 znaków
2. Mieszaj wielkie, małe, cyfry, symbole
3. Zmień hasło regularnie (co 90 dni)
4. Użyj menedżera haseł
5. Włącz uwierzytelnianie dwuczynnikowe jeśli dostępne

### Monitoruj aktywność administracyjną

Włącz rejestrowanie logowań administracyjnych:

**Panel administracyjny > System > Preferencje > Ustawienia użytkownika**

```
Zaloguj logowania administracyjne: Tak
Zaloguj nieudane próby logowania: Tak
Alert e-mail przy logowaniu administracyjnym: Tak
```

Przeglądzaj dzienniki regularnie:

```bash
# Sprawdź bazę danych pod kątem prób logowania
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Regularna konserwacja

### Zaktualizuj XOOPS i moduły

Trzymaj XOOPS i wszystkie moduły na bieżąco:

```bash
# Sprawdź aktualizacje w panelu administracyjnym
# Admin > Moduły > Sprawdź aktualizacje

# Lub przez wiersz poleceń
cd /var/www/html/xoops
# Pobierz i zainstaluj najnowszą wersję
# Postępuj zgodnie z przewodnikiem aktualizacji
```

### Automatyczne skanowanie bezpieczeństwa

```bash
#!/bin/bash
# Skrypt audytu bezpieczeństwa

# Sprawdzaj uprawnienia do plików
echo "Sprawdzanie uprawnień do plików..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Sprawdzaj podejrzane pliki
echo "Sprawdzanie podejrzanych plików..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# Sprawdzaj bazę danych pod kątem podejrzanej aktywności
echo "Sprawdzanie nieudanych prób logowania..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### Regularne kopie zapasowe

Automatyzuj codzienne kopie zapasowe:

```bash
#!/bin/bash
# Dziennie skrypt kopii zapasowej

BACKUP_DIR="/backups/xoops"
RETENTION=30  # Przechowuj 30 dni

# Kopia zapasowa bazy danych
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Kopia zapasowa plików
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# Usuń stare kopie zapasowe
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Kopia zapasowa ukończona o $(date)"
```

Zaplanuj za pomocą cron:

```bash
# Edytuj crontab
crontab -e

# Dodaj linię (uruchamia codziennie o 2 rano)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Szablon listy kontrolnej bezpieczeństwa

Użyj tego szablonu do regularnych audytów bezpieczeństwa:

```
Tygodniowa lista kontrolna bezpieczeństwa
========================================

Data: ___________
Sprawdzane przez: ___________

System plików:
[ ] Uprawnienia poprawne (644/755)
[ ] Folder instalacji usunięty
[ ] Brak podejrzanych plików
[ ] mainfile.php chroniony

Bezpieczeństwo sieci:
[ ] HTTPS/SSL działa
[ ] Obecne nagłówki bezpieczeństwa
[ ] Panel administracyjny ograniczony
[ ] Aktywne ograniczenia przesyłania plików
[ ] Zalogowane próby logowania

Aplikacja:
[ ] Wersja XOOPS aktualna
[ ] Wszystkie moduły zaktualizowane
[ ] Brak komunikatów o błędach w dziennikach
[ ] Baza danych zoptymalizowana
[ ] Cache wyczyszczony

Kopie zapasowe:
[ ] Baza danych w kopii zapasowej
[ ] Pliki w kopii zapasowej
[ ] Kopia zapasowa przetestowana
[ ] Kopia spoza lokalizacji zweryfikowana

Znalezione problemy:
1. ___________
2. ___________
3. ___________

Podjęte działania:
1. ___________
2. ___________
```

## Zasoby bezpieczeństwa

- Server Requirements
- Basic Configuration
- Performance Optimization
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Tagi:** #bezpieczeństwo #ssl #https #wzmacnianie #najlepsze-praktyki

**Powiązane artykuły:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
