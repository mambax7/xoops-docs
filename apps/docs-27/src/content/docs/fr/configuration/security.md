---
title: "Configuration de Sécurité"
description: "Guide complet du durcissement de la sécurité pour XOOPS incluant les permissions de fichiers, SSL/HTTPS, les répertoires sensibles et les meilleures pratiques de sécurité"
---

# Configuration de Sécurité XOOPS

Guide complet pour sécuriser votre installation XOOPS contre les vulnérabilités web courantes.

## Liste de Contrôle de Sécurité

Avant de lancer votre site, mettez en œuvre ces mesures de sécurité :

- [ ] Les permissions de fichiers sont définies correctement (644/755)
- [ ] Le dossier d'installation est supprimé ou protégé
- [ ] mainfile.php est protégé contre la modification
- [ ] SSL/HTTPS est activé sur toutes les pages
- [ ] Le dossier admin est renommé ou protégé
- [ ] Les fichiers sensibles ne sont pas accessibles sur le web
- [ ] Les restrictions .htaccess sont en place
- [ ] Les sauvegardes régulières sont automatisées
- [ ] Les en-têtes de sécurité sont configurés
- [ ] La protection CSRF est activée
- [ ] Les protections contre l'injection SQL sont actives
- [ ] Les modules/extensions sont à jour

## Sécurité du Système de Fichiers

### Permissions de Fichiers

Les permissions de fichiers appropriées sont essentielles pour la sécurité.

#### Directives de Permission

| Chemin | Permissions | Propriétaire | Raison |
|---|---|---|---|
| mainfile.php | 644 | root | Contient les identifiants BD |
| Fichiers *.php | 644 | root | Prévenir la modification non autorisée |
| Répertoires | 755 | root | Permettre la lecture, empêcher l'écriture |
| cache/ | 777 | www-data | Le serveur web doit écrire |
| templates_c/ | 777 | www-data | Modèles compilés |
| uploads/ | 777 | www-data | Téléchargements utilisateur |
| var/ | 777 | www-data | Données variables |
| install/ | Supprimer | - | Supprimer après l'installation |
| configs/ | 755 | root | Lisible, pas modifiable |

#### Script de Définition des Permissions

```bash
#!/bin/bash
# File: /usr/local/bin/xoops-secure.sh

XOOPS_PATH="/var/www/html/xoops"
WEB_USER="www-data"

# Set ownership
echo "Setting ownership..."
chown -R $WEB_USER:$WEB_USER $XOOPS_PATH

# Set restrictive default permissions
echo "Setting base permissions..."
find $XOOPS_PATH -type d -exec chmod 755 {} \;
find $XOOPS_PATH -type f -exec chmod 644 {} \;

# Make specific directories writable
echo "Setting writable directories..."
chmod 777 $XOOPS_PATH/cache
chmod 777 $XOOPS_PATH/templates_c
chmod 777 $XOOPS_PATH/uploads
chmod 777 $XOOPS_PATH/var

# Protect sensitive files
echo "Protecting sensitive files..."
chmod 644 $XOOPS_PATH/mainfile.php
chmod 444 $XOOPS_PATH/mainfile.php.dist  # If it exists (read-only)

# Verify permissions
echo "Verifying permissions..."
ls -la $XOOPS_PATH | grep -E "mainfile|cache|uploads|var|templates_c"

echo "Security hardening completed!"
```

Exécutez le script :

```bash
chmod +x /usr/local/bin/xoops-secure.sh
/usr/local/bin/xoops-secure.sh
```

### Supprimer le Dossier d'Installation

**CRITIQUE:** Le dossier d'installation doit être supprimé après l'installation!

```bash
# Option 1: Delete completely
rm -rf /var/www/html/xoops/install/

# Option 2: Rename and keep for reference
mv /var/www/html/xoops/install/ /var/www/html/xoops/install.bak/

# Verify removal
ls -la /var/www/html/xoops/ | grep install
```

### Protéger les Répertoires Sensibles

Créez des fichiers .htaccess pour bloquer l'accès web aux dossiers sensibles :

**Fichier: /var/www/html/xoops/var/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

<IfModule mod_autoindex.c>
    Options -Indexes
</IfModule>
```

**Fichier: /var/www/html/xoops/templates_c/.htaccess**

```apache
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar)$">
    Deny from all
</FilesMatch>

Options -Indexes
```

**Fichier: /var/www/html/xoops/cache/.htaccess**

```apache
Options -Indexes
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
```

### Protéger le Répertoire de Téléchargement

Empêchez l'exécution de scripts dans les téléchargements :

**Fichier: /var/www/html/xoops/uploads/.htaccess**

```apache
# Prevent script execution
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7|phps|pht|phar|pl|py|jsp|asp|aspx|cgi|sh|bat|exe)$">
    Deny from all
</FilesMatch>

# Prevent directory listing
Options -Indexes

# Additional protection
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/uploads/

    # Block suspicious files
    RewriteCond %{REQUEST_URI} \.(php|phtml|php3|php4|php5|php6|php7)$ [NC]
    RewriteRule ^.*$ - [F,L]
</IfModule>
```

## Configuration SSL/HTTPS

Chiffrez tout le trafic entre les utilisateurs et votre serveur.

### Obtenir un Certificat SSL

**Option 1: Certificat Gratuit de Let's Encrypt**

```bash
# Install Certbot
apt-get install certbot python3-certbot-apache

# Obtain certificate (auto-configures Apache)
certbot certonly --apache -d your-domain.com -d www.your-domain.com

# Verify certificate installed
ls /etc/letsencrypt/live/your-domain.com/
```

**Option 2: Certificat SSL Commercial**

Contactez le fournisseur SSL ou le registraire :
1. Achetez un certificat SSL
2. Vérifiez la propriété du domaine
3. Installez les fichiers de certificat sur le serveur
4. Configurez le serveur web

### Configuration SSL Apache

Créez un hôte virtuel HTTPS :

**Fichier: /etc/apache2/sites-available/xoops-ssl.conf**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    DocumentRoot /var/www/html/xoops

    # SSL Configuration
    SSLEngine on
    SSLProtocol TLSv1.2 TLSv1.3
    SSLCipherSuite HIGH:!aNULL:!MD5
    SSLCertificateFile /etc/letsencrypt/live/your-domain.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/your-domain.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/your-domain.com/chain.pem

    # Security Headers
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

    # Restrict install folder
    <Directory /var/www/html/xoops/install>
        Deny from all
    </Directory>

    # Logging
    ErrorLog ${APACHE_LOG_DIR}/xoops_ssl_error.log
    CustomLog ${APACHE_LOG_DIR}/xoops_ssl_access.log combined
</VirtualHost>

# Redirect HTTP to HTTPS
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com
    Redirect 301 / https://your-domain.com/
</VirtualHost>
```

Activez la configuration :

```bash
# Enable SSL module
a2enmod ssl

# Enable site
a2ensite xoops-ssl

# Disable non-SSL site if exists
a2dissite 000-default

# Test configuration
apache2ctl configtest
# Should output: Syntax OK

# Restart Apache
systemctl restart apache2
```

### Configuration SSL Nginx

**Fichier: /etc/nginx/sites-available/xoops**

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    server_name your-domain.com www.your-domain.com;
    root /var/www/html/xoops;
    index index.php index.html;

    # SSL Certificate Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Modern SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # HSTS Header
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;

    # Security Headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'" always;

    # Restrict install folder
    location ~ ^/(install|upgrade)/ {
        deny all;
    }

    # Deny access to sensitive files
    location ~ /\. {
        deny all;
    }

    # PHP-FPM backend
    location ~ \.php$ {
        fastcgi_pass unix:/run/php-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # Static files caching
    location ~* \.(js|css|png|jpg|gif|ico|svg)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # URL rewriting
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Logging
    access_log /var/log/nginx/xoops_access.log;
    error_log /var/log/nginx/xoops_error.log;
}
```

Activez la configuration :

```bash
ln -s /etc/nginx/sites-available/xoops /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### Vérifier l'Installation HTTPS

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443 -tls1_2

# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/your-domain.com/cert.pem -noout -text

# SSL/TLS test online
# https://www.ssllabs.com/ssltest/
# https://www.testssl.sh/
```

### Renouvellement Automatique du Certificat Let's Encrypt

```bash
# Enable auto-renewal
systemctl enable certbot.timer
systemctl start certbot.timer

# Test renewal process
certbot renew --dry-run

# Manual renewal if needed
certbot renew --force-renewal
```

## Sécurité des Applications Web

### Protéger Contre l'Injection SQL

XOOPS utilise des requêtes paramétrées (sûr par défaut), mais toujours :

```php
// UNSAFE - Never do this!
$query = "SELECT * FROM users WHERE name = '" . $_GET['name'] . "'";

// SAFE - Use prepared statements
$database = XoopsDatabaseFactory::getDatabaseConnection();
$sql = "SELECT * FROM " . $database->prefix('users') . " WHERE name = ?";
$result = $database->query($sql, array($_GET['name']));
```

### Prévention du Cross-Site Scripting (XSS)

Toujours nettoyer l'entrée utilisateur :

```php
// UNSAFE
echo $_GET['user_input'];

// SAFE - Use XOOPS sanitization functions
echo htmlspecialchars($_GET['user_input'], ENT_QUOTES, 'UTF-8');

// Or use XOOPS functions
$text_sanitizer = new xoops_text_sanitizer();
echo $text_sanitizer->stripSlashesGPC($_GET['user_input']);
```

### Prévention du Cross-Site Request Forgery (CSRF)

XOOPS inclut la protection contre les jetons CSRF. Incluez toujours les jetons :

```html
<!-- In forms -->
<form method="post">
    {xoops_token form=update}
    <input type="text" name="field">
    <input type="submit">
</form>
```

### Désactiver l'Exécution PHP dans le Dossier de Téléchargement

Empêchez les attaquants de télécharger et d'exécuter du PHP :

```bash
# Create .htaccess in uploads folder
cat > /var/www/html/xoops/uploads/.htaccess << 'EOF'
<FilesMatch "\.(php|phtml|php3|php4|php5|php6|php7)$">
    Deny from all
</FilesMatch>
php_flag engine off
EOF

# Alternative: Disable execution globally in uploads
chmod 444 /var/www/html/xoops/uploads/  # Read-only
```

### En-têtes de Sécurité

Configurez les en-têtes de sécurité HTTP importants :

```apache
# Strict-Transport-Security (HSTS)
# Forces HTTPS for 1 year
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"

# X-Content-Type-Options
# Prevents MIME type sniffing
Header always set X-Content-Type-Options "nosniff"

# X-Frame-Options
# Prevents clickjacking attacks
Header always set X-Frame-Options "SAMEORIGIN"

# X-XSS-Protection
# Browser XSS protection
Header always set X-XSS-Protection "1; mode=block"

# Referrer-Policy
# Controls referrer information
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Content-Security-Policy
# Controls resource loading
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'"
```

## Sécurité du Panneau Admin

### Renommer le Dossier Admin

Protégez le dossier admin en le renommant :

```bash
# Rename admin folder
mv /var/www/html/xoops/admin /var/www/html/xoops/myadmin123

# Update admin access URL
# Old: http://your-domain.com/xoops/admin/
# New: http://your-domain.com/xoops/myadmin123/
```

Configurez XOOPS pour utiliser le dossier renommé :

Modifiez mainfile.php :

```php
// Change this line
define('XOOPS_ADMIN_PATH', '/var/www/html/xoops/myadmin123');
```

### Liste Blanche IP pour Admin

Limitez l'accès admin à des IPs spécifiques :

**Fichier: /var/www/html/xoops/myadmin123/.htaccess**

```apache
# Allow only specific IPs
<RequireAll>
    Require ip 192.168.1.100   # Your office IP
    Require ip 203.0.113.50    # Your home IP
    Deny from all
</RequireAll>
```

Ou avec Apache 2.2 :

```apache
Order Deny,Allow
Deny from all
Allow from 192.168.1.100 203.0.113.50
```

### Identifiants Admin Forts

Appliquez des mots de passe forts pour les administrateurs :

1. Utilisez au moins 16 caractères
2. Mélangez majuscules, minuscules, chiffres, symboles
3. Changez le mot de passe régulièrement (tous les 90 jours)
4. Utilisez un gestionnaire de mots de passe
5. Activez l'authentification à deux facteurs si disponible

### Surveiller l'Activité Admin

Activez la journalisation des connexions admin :

**Panneau Admin > Système > Préférences > Paramètres Utilisateur**

```
Journaliser les Connexions Admin: Oui
Journaliser les Tentatives de Connexion Échouées: Oui
E-mail d'Alerte à la Connexion Admin: Oui
```

Examinez régulièrement les journaux :

```bash
# Check database for login attempts
mysql -u xoops_user -p xoops_db << EOF
SELECT uid, uname, DATE_FROM_UNIXTIME(user_lastlogin) as last_login
FROM xoops_users WHERE uid = 1;
EOF
```

## Maintenance Régulière

### Mettre à Jour XOOPS et les Modules

Gardez XOOPS et tous les modules à jour :

```bash
# Check for updates in admin panel
# Admin > Modules > Check for Updates

# Or via command line
cd /var/www/html/xoops
# Download and install latest version
# Follow upgrade guide
```

### Analyse de Sécurité Automatisée

```bash
#!/bin/bash
# Security audit script

# Check file permissions
echo "Checking file permissions..."
find /var/www/html/xoops -type f ! -perm 644 ! -name "*.htaccess" | head -10

# Check for suspicious files
echo "Checking for suspicious files..."
find /var/www/html/xoops -type f -name "*.php" -newer /var/www/html/xoops/install/ 2>/dev/null

# Check database for suspicious activity
echo "Checking for failed login attempts..."
mysql -u xoops_user -p xoops_db << EOF
SELECT count(*) as attempts FROM xoops_audittrail WHERE action LIKE '%login%' AND status = 0;
EOF
```

### Sauvegardes Régulières

Automatisez les sauvegardes quotidiennes :

```bash
#!/bin/bash
# Daily backup script

BACKUP_DIR="/backups/xoops"
RETENTION=30  # Keep 30 days

# Backup database
mysqldump -u xoops_user -p xoops_db | gzip > $BACKUP_DIR/db_$(date +%Y%m%d).sql.gz

# Backup files
tar -czf $BACKUP_DIR/files_$(date +%Y%m%d).tar.gz /var/www/html/xoops --exclude=cache --exclude=templates_c

# Remove old backups
find $BACKUP_DIR -type f -mtime +$RETENTION -delete

echo "Backup completed at $(date)"
```

Programmez avec cron :

```bash
# Edit crontab
crontab -e

# Add line (runs daily at 2 AM)
0 2 * * * /usr/local/bin/xoops-backup.sh >> /var/log/xoops_backup.log 2>&1
```

## Modèle de Liste de Contrôle de Sécurité

Utilisez ce modèle pour les audits de sécurité réguliers :

```
Liste de Contrôle de Sécurité Hebdomadaire
==========================================

Date: ___________
Vérifié par: ___________

Système de Fichiers:
[ ] Les permissions sont correctes (644/755)
[ ] Le dossier d'installation est supprimé
[ ] Pas de fichiers suspects
[ ] mainfile.php est protégé

Sécurité Web:
[ ] HTTPS/SSL fonctionne
[ ] Les en-têtes de sécurité sont présents
[ ] Le panneau admin est restreint
[ ] Les restrictions de téléchargement de fichiers sont actives
[ ] Les tentatives de connexion sont enregistrées

Application:
[ ] La version de XOOPS est actuelle
[ ] Tous les modules sont à jour
[ ] Aucun message d'erreur dans les journaux
[ ] La base de données est optimisée
[ ] Le cache est effacé

Sauvegardes:
[ ] Base de données sauvegardée
[ ] Fichiers sauvegardés
[ ] Sauvegarde testée
[ ] Copie hors site vérifiée

Problèmes Trouvés:
1. ___________
2. ___________
3. ___________

Actions Prises:
1. ___________
2. ___________
```

## Ressources de Sécurité

- Configuration de Base
- Installation
- Optimisation des Performances
- OWASP Top 10: https://owasp.org/www-project-top-ten/

---

**Tags:** #security #ssl #https #hardening #best-practices

**Articles Connexes:**
- ../Installation/Installation
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- ../Installation/Upgrading-XOOPS
