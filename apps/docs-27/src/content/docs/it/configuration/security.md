---
title: "Configurazione Sicurezza"
description: "Guida completa al rafforzamento della sicurezza di XOOPS incluse permessi file, SSL/HTTPS, directory sensibili e best practice di sicurezza"
---

# Configurazione Sicurezza XOOPS

Guida completa al rafforzamento della tua installazione XOOPS contro le vulnerabilità web comuni.

## Checklist Sicurezza

Prima di lanciare il tuo sito, implementa queste misure di sicurezza:

- [ ] Permessi file impostati correttamente (644/755)
- [ ] Cartella install rimossa o protetta
- [ ] mainfile.php protetto da modifiche
- [ ] SSL/HTTPS abilitato su tutte le pagine
- [ ] Cartella admin rinominata o protetta
- [ ] File sensibili non accessibili dal web
- [ ] Restrizioni .htaccess in place
- [ ] Backup automatizzati
- [ ] Header di sicurezza configurati
- [ ] Protezione CSRF abilitata
- [ ] Protezioni SQL injection attive
- [ ] Moduli/estensioni aggiornati

## Sicurezza File System

### Permessi File

I permessi file corretti sono critici per la sicurezza.

#### Linee Guida Permessi

| Percorso | Permessi | Proprietario | Motivo |
|---|---|---|---|
| mainfile.php | 644 | root | Contiene credenziali DB |
| File *.php | 644 | root | Previeni modifiche non autorizzate |
| Directory | 755 | root | Consenti lettura, previeni scrittura |
| cache/ | 777 | www-data | Web server deve scrivere |
| templates_c/ | 777 | www-data | Template compilati |
| uploads/ | 777 | www-data | Caricamenti utente |
| var/ | 777 | www-data | Dati variabili |
| install/ | Rimuovi | - | Cancella dopo installazione |
| configs/ | 755 | root | Leggibile, non scrivibile |

#### Script Impostazione Permessi

```bash
#!/bin/bash
# File: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# Imposta proprietà
echo "Impostazione proprietà..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Imposta permessi restrittivi di default
echo "Impostazione permessi base..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Rendi directory specifiche scrivibili
echo "Impostazione directory scrivibili..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# Proteggi file sensibili
echo "Protezione file sensibili..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # Se esiste (sola lettura)

# Verifica permessi
echo "Verifica permessi..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "Rafforzamento sicurezza completato!"
```

Esegui lo script:

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### Rimuovi Cartella Installazione

**CRITICO:** La cartella install deve essere rimossa dopo l'installazione!

```bash
# Opzione 1: Cancella completamente
rm -rf /var/www/html/xoops/install/

# Opzione 2: Rinomina e mantieni come riferimento
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verifica rimozione
ls -la /var/www/html/xoops/ | grep install
```

### Proteggi Directory Sensibili

Crea file .htaccess per bloccare accesso web a cartelle sensibili:

**File: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**File: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**File: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### Proteggi Directory Upload

Previeni esecuzione di script in upload:

**File: /var/www/html/xoops/uploads/.htaccess**

```apache
# Previeni esecuzione script
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# Previeni elencazione directory
Options -Indexes

# Protezione aggiuntiva
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # Blocca file sospetti
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## Configurazione SSL/HTTPS

Cripta tutto il traffico tra utenti e il tuo server.

### Ottieni Certificato SSL

**Opzione 1: Certificato Gratuito da Let's Encrypt**

```bash
# Installa Certbot
apt-get install certbot python3-certbot-apache

# Ottieni certificato (configura automaticamente Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verifica certificato installato
ls /etc/letsencrypt/live/your-domain.com/
```

**Opzione 2: Certificato SSL Commerciale**

Contatta provider SSL o registrar:
1. Acquista certificato SSL
2. Verifica proprietà dominio
3. Installa file certificato su server
4. Configura web server

### Configurazione SSL Apache

Crea virtual host HTTPS:

**File: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # Configurazione SSL
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # Header di Sicurezza
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

    # Ristringe cartella install
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# Reindirizza HTTP a HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

Abilita configurazione:

```bash
# Abilita modulo SSL
a2enmod ssl

# Abilita sito
a2ensite xoops-ssl

# Disabilita sito non-SSL se esiste
a2dissite 000-default

# Prova configurazione
apache2ctl configtest
# Deve mostrare: Syntax OK

# Riavvia Apache
systemctl restart apache2
```

### Configurazione SSL Nginx

**File: /etc/nginx/sites-available/xoops**

```nginx
# Reindirizza HTTP a HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# Server HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # Configurazione Certificato SSL
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Configurazione SSL Moderna
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Header HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Header di Sicurezza
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # Ristringe cartella install
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # Nega accesso a file sensibili
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

    # Caching file statici
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Riscrittura URL
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Logging
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

Abilita configurazione:

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Verifica Installazione HTTPS

```bash
# Prova configurazione SSL
openssl s_client -connect your-domain.com:443 -tls1_2

# Controlla validità certificato
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# Test SSL/TLS online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Rinnovamento Automatico Certificato Let's Encrypt

```bash
# Abilita rinnovamento automatico
systemctl enable certbot.timer
systemctl start certbot.timer

# Prova processo rinnovamento
certbot renew --dry-run

# Rinnovamento manuale se necessario
certbot renew --force-renewal
```

## Sicurezza Applicazione Web

### Proteggi Contro SQL Injection

XOOPS usa query parametrizzate (sicure per default), ma sempre:

```php
// NON SICURO - Non farlo mai!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SICURO - Usa prepared statement
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### Prevenzione Cross-Site Scripting (XSS)

Sempre sanifica l'input dell'utente:

```php
// NON SICURO
echo $_GET['user_input'];

// SICURO - Usa funzioni di sanificazione XOOPS
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Oppure usa funzioni XOOPS
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### Prevenzione Cross-Site Request Forgery (CSRF)

XOOPS include protezione token CSRF. Sempre includi token:

```html
<!-- Nei form -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### Disabilita Esecuzione PHP nella Cartella Upload

Previeni attaccanti da caricare ed eseguire PHP:

```bash
# Crea .htaccess nella cartella uploads
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternativa: Disabilita esecuzione globalmente in uploads
chmod 444 /var/www/html/xoops/uploads/  # Sola lettura
```

### Header di Sicurezza

Configura importanti header di sicurezza HTTP:

```apache
# Strict-Transport-Security (HSTS)
# Forza HTTPS per 1 anno
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# Previene MIME type sniffing
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# Previene attacchi clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# Protezione XSS browser
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Controlla informazioni referrer
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# Controlla caricamento risorsa
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## Sicurezza Pannello Admin

### Rinomina Cartella Admin

Proteggi cartella admin rinominandola:

```bash
# Rinomina cartella admin
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Aggiorna URL accesso admin
# Vecchio: http://your-domain.com/xoops/admin/
# Nuovo: http://your-domain.com/xoops/myadmin123/
```

Configura XOOPS per usare cartella rinominata:

Modifica mainfile.php:

```php
// Cambia questa riga
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### IP Whitelisting per Admin

Ristringe accesso admin a IP specifici:

**File: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Consenti solo IP specifici
<RequireAll>
    Require ip 192.168.1.100   # IP ufficio
    Require ip 203.0.113.50    # IP casa
    Deny from all
</RequireAll>
```

Oppure con Apache 2.2:

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### Credenziali Admin Forti

Applica password forti per amministratori:

1. Usa almeno 16 caratteri
2. Mescola maiuscole, minuscole, numeri, simboli
3. Cambia password regolarmente (ogni 90 giorni)
4. Usa password manager
5. Abilita autenticazione a due fattori se disponibile

### Monitora Attività Admin

Abilita log accesso admin:

**Pannello Admin > Sistema > Preferenze > Impostazioni Utente**

```
Log Accessi Admin: Yes
Log Tentativi Login Falliti: Yes
Allerta Email su Accesso Admin: Yes
```

Rivedi log regolarmente:

```bash
# Controlla database per tentativi login
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Manutenzione Regolare

### Aggiorna XOOPS e Moduli

Mantieni XOOPS e tutti i moduli aggiornati:

```bash
# Controlla aggiornamenti nel pannello admin
# Admin > Moduli > Controlla Aggiornamenti

# Oppure via riga di comando
cd /var/www/html/xoops
# Scarica e installa versione più recente
# Segui guida upgrade
```

### Scansione Sicurezza Automatizzata

```bash
#!/bin/bash
# Script audit di sicurezza

# Controlla permessi file
echo "Controllo permessi file..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Controlla file sospetti
echo "Controllo file sospetti..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# Controlla database per attività sospetta
echo "Controllo tentativi login falliti..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### Backup Regolari

Automatizza backup giornalieri:

```bash
#!/bin/bash
# Script backup giornaliero

BACKUP_DIR="/backups/xoops"
RETENTION=30  # Mantieni 30 giorni

# Backup database
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Backup file
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# Rimuovi backup vecchi
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Backup completato a $(date)"
```

Pianifica con cron:

```bash
# Modifica crontab
crontab -e

# Aggiungi riga (esegui quotidianamente alle 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Modello Checklist Sicurezza

Usa questo modello per audit di sicurezza regolari:

```
Checklist Sicurezza Settimanale
========================

Data: ___________
Controllato da: ___________

File System:
[ ] Permessi corretti (644/755)
[ ] Cartella install rimossa
[ ] Nessun file sospetto
[ ] mainfile.php protetto

Sicurezza Web:
[ ] HTTPS/SSL funzionante
[ ] Header di sicurezza presenti
[ ] Pannello admin ristretto
[ ] Restrizioni caricamento file attive
[ ] Tentativi login registrati

Applicazione:
[ ] Versione XOOPS attuale
[ ] Tutti i moduli aggiornati
[ ] Nessun messaggio di errore nei log
[ ] Database ottimizzato
[ ] Cache cancellata

Backup:
[ ] Database sottoposto a backup
[ ] File sottoposti a backup
[ ] Backup testato
[ ] Copia offsite verificata

Problemi Trovati:
1. ___________
2. ___________
3. ___________

Azioni Intraprese:
1. ___________
2. ___________
```

## Risorse Sicurezza

- Requisiti Server
- Configurazione di Base
- Ottimizzazione Prestazioni
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Tag:** #sicurezza #ssl #https #rafforzamento #best-practice

**Articoli Correlati:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
