---
title: "Optimisation des Performances"
description: "Guide d'optimisation de la vitesse pour XOOPS incluant la mise en cache, l'optimisation de la base de données, l'intégration CDN et la surveillance des performances"
---

# Optimisation des Performances XOOPS

Guide complet pour optimiser XOOPS pour une vitesse et une efficacité maximales.

## Aperçu de l'Optimisation des Performances

```mermaid
graph TD
    A[Performance] --> B[Caching]
    A --> C[Database]
    A --> D[Web Server]
    A --> E[Frontend]
    A --> F[Code]
    B --> B1[Page Cache]
    B --> B2[Query Cache]
    B --> B3[Template Cache]
    C --> C1[Indexes]
    C --> C2[Queries]
    C --> C3[Optimization]
    D --> D1[Compression]
    D --> D2[Headers]
    D --> D3[Connection]
    E --> E1[Images]
    E --> E2[CSS/JS]
    E --> E3[Lazy Load]
    F --> F1[Modules]
    F --> F2[Queries]
```

## Configuration de la Mise en Cache

La mise en cache est le moyen le plus rapide d'améliorer les performances.

### Mise en Cache au Niveau des Pages

Activez la mise en cache complète des pages dans XOOPS :

**Panneau Admin > Système > Préférences > Paramètres du Cache**

```
Activer la Mise en Cache: Oui
Type de Cache: Cache Fichier (ou APCu/Memcache)
Durée de Vie du Cache: 3600 secondes (1 heure)
Listes de Modules en Cache: Oui
Configuration en Cache: Oui
Résultats de Recherche en Cache: Oui
```

### Mise en Cache Basée sur Fichiers

Configurez l'emplacement du cache de fichiers :

```bash
# Create cache directory outside web root (more secure)
mkdir -p /var/cache/xoops
chown www-data:www-data /var/cache/xoops
chmod 755 /var/cache/xoops

# Edit mainfile.php
define('XOOPS_CACHE_PATH', '/var/cache/xoops/');
```

### Mise en Cache APCu

APCu fournit la mise en cache en mémoire (très rapide) :

```bash
# Install APCu
apt-get install php-apcu

# Verify installation
php -m | grep apcu

# Configure in php.ini
apc.enabled = 1
apc.memory_size = 128M
apc.ttl = 0
apc.user_ttl = 3600
apc.shm_size = 128
```

Activez dans XOOPS :

**Panneau Admin > Système > Préférences > Paramètres du Cache**

```
Type de Cache: APCu
```

### Mise en Cache Memcache/Redis

Mise en cache distribuée pour les sites à haut trafic :

**Installer Memcache:**

```bash
# Install Memcache server
apt-get install memcached

# Start service
systemctl start memcached
systemctl enable memcached

# Verify running
netstat -tlnp | grep memcached
# Should show listening on port 11211
```

**Configurer dans XOOPS:**

Modifiez mainfile.php :

```php
// Memcache configuration
define('XOOPS_CACHE_TYPE', 'memcache');
define('XOOPS_CACHE_HOST', 'localhost');
define('XOOPS_CACHE_PORT', 11211);
define('XOOPS_CACHE_TIMEOUT', 0);
```

Ou dans le panneau admin :

```
Type de Cache: Memcache
Hôte Memcache: localhost:11211
```

### Mise en Cache des Modèles

Compilez et mettez en cache les modèles XOOPS :

```bash
# Ensure templates_c is writable
chmod 777 /var/www/html/xoops/templates_c/

# Clear old cached templates
rm -rf /var/www/html/xoops/templates_c/*
```

Configurez dans le thème :

```html
<!-- In theme xoops_version.php -->
{smarty.const.XOOPS_VAR_PATH|constant}
<{$xoops_meta}>

<!-- Templates use caching -->
{cache}
    [Cached content here]
{/cache}
```

## Optimisation de la Base de Données

### Ajouter des Index à la Base de Données

Les bases de données correctement indexées interrogent beaucoup plus rapidement.

```sql
-- Check current indexes
SHOW INDEXES FROM xoops_users;

-- Common indexes to add
ALTER TABLE xoops_users ADD INDEX idx_uname (uname);
ALTER TABLE xoops_users ADD INDEX idx_email (email);
ALTER TABLE xoops_users ADD INDEX idx_uid_active (uid, user_actkey);

-- Add indexes to posts/content tables
ALTER TABLE xoops_posts ADD INDEX idx_post_published (post_published);
ALTER TABLE xoops_posts ADD INDEX idx_post_uid (post_uid);
ALTER TABLE xoops_posts ADD INDEX idx_post_created (post_created);

-- Verify indexes created
SHOW INDEXES FROM xoops_users\G
```

### Optimiser les Tables

L'optimisation régulière des tables améliore les performances :

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;

-- Or optimize all at once
REPAIR TABLE xoops_users;
OPTIMIZE TABLE xoops_users;
REPAIR TABLE xoops_posts;
OPTIMIZE TABLE xoops_posts;
```

Créez un script d'optimisation automatisé :

```bash
#!/bin/bash
# Database optimization script

echo "Optimizing XOOPS database..."

mysql -u xoops_user -p xoops_db << EOF
-- Optimize all tables
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;
OPTIMIZE TABLE xoops_users_online;

-- Show database size
SELECT table_schema,
       ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) as total_mb
FROM information_schema.tables
WHERE table_schema = 'xoops_db'
GROUP BY table_schema;
EOF

echo "Database optimization completed!"
```

Programmez avec cron :

```bash
# Weekly optimization
crontab -e
# Add: 0 3 * * 0 /usr/local/bin/optimize-xoops-db.sh
```

### Optimisation des Requêtes

Examinez les requêtes lentes :

```sql
-- Enable slow query log
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;

-- View slow queries
SELECT * FROM mysql.slow_log;

-- Or check slow log file
tail -100 /var/log/mysql/slow.log
```

Techniques d'optimisation courantes :

```php
// SLOW - Avoid unnecessary queries in loops
foreach ($users as $user) {
    $profile = getUserProfile($user['uid']);  // Query in loop!
    echo $profile['name'];
}

// FAST - Get all data at once
$profiles = getAllUserProfiles($user_ids);
foreach ($users as $user) {
    echo $profiles[$user['uid']]['name'];
}
```

### Augmenter la Taille du Buffer Pool

Configurez MySQL pour une meilleure mise en cache :

Modifiez `/etc/mysql/mysql.conf.d/mysqld.cnf` :

```ini
# InnoDB Buffer Pool (50-80% of system RAM)
innodb_buffer_pool_size = 1G

# Query Cache (optional, can be disabled in MySQL 5.7+)
query_cache_size = 64M
query_cache_type = 1

# Max Connections
max_connections = 500

# Max Allowed Packet
max_allowed_packet = 256M

# Connection timeout
connect_timeout = 10
```

Redémarrez MySQL :

```bash
systemctl restart mysql
```

## Optimisation du Serveur Web

### Activer la Compression Gzip

Compressez les réponses pour réduire la bande passante :

**Configuration Apache:**

```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json

    # Don't compress images and already compressed files
    SetEnvIfNoCase Request_URI \.(jpg|jpeg|png|gif|zip|gzip)$ no-gzip dont-vary

    # Log compressed responses
    DeflateBufferSize 8096
</IfModule>
```

**Configuration Nginx:**

```nginx
gzip on;
gzip_types text/html text/plain text/css text/javascript application/javascript application/json;
gzip_min_length 1000;
gzip_vary on;
gzip_comp_level 6;

# Don't compress already compressed formats
gzip_disable "msie6";
```

Vérifiez la compression :

```bash
# Check if response is gzipped
curl -I -H "Accept-Encoding: gzip" http://your-domain.com/xoops/

# Should show:
# Content-Encoding: gzip
```

### En-têtes de Cache du Navigateur

Définissez l'expiration du cache pour les actifs statiques :

**Apache:**

```apache
<IfModule mod_expires.c>
    ExpiresActive On

    # Cache images for 30 days
    ExpiresByType image/jpeg "access plus 30 days"
    ExpiresByType image/gif "access plus 30 days"
    ExpiresByType image/png "access plus 30 days"
    ExpiresByType image/svg+xml "access plus 30 days"

    # Cache CSS/JS for 30 days
    ExpiresByType text/css "access plus 30 days"
    ExpiresByType application/javascript "access plus 30 days"
    ExpiresByType text/javascript "access plus 30 days"

    # Cache fonts for 1 year
    ExpiresByType font/eot "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"

    # Don't cache HTML
    ExpiresByType text/html "access plus 1 hour"
</IfModule>
```

**Nginx:**

```nginx
location ~* \.(jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(css|js)$ {
    expires 30d;
    add_header Cache-Control "public";
}

location ~ \.html$ {
    expires 1h;
    add_header Cache-Control "public";
}
```

### Connexion Keep-Alive

Activez les connexions HTTP persistantes :

**Apache:**

```apache
<IfModule mod_http.c>
    KeepAlive On
    KeepAliveTimeout 15
    MaxKeepAliveRequests 100
</IfModule>
```

**Nginx:**

```nginx
keepalive_timeout 15s;
keepalive_requests 100;
```

## Optimisation du Frontend

### Optimiser les Images

Réduisez les tailles de fichier image :

```bash
# Batch compress JPEG images
for img in *.jpg; do
    convert "$img" -quality 85 "optimized_$img"
done

# Batch compress PNG images
for img in *.png; do
    optipng -o2 "$img"
done

# Or use imagemin CLI
npm install -g imagemin-cli
imagemin images/ --out-dir=images-optimized
```

### Minifier CSS et JavaScript

Réduisez les tailles de fichier CSS/JS :

**Utilisation des outils Node.js:**

```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JavaScript
uglifyjs script.js -o script.min.js

# Minify CSS
cleancss style.css -o style.min.css
```

**Utilisation d'outils en ligne:**
- CSS Minifier: https://cssminifier.com/
- JavaScript Minifier: https://www.minifycode.com/javascript-minifier/

### Chargement Différé des Images

Chargez les images uniquement si nécessaire :

```html
<!-- Add loading="lazy" attribute -->
<img src="image.jpg" alt="Description" loading="lazy">

<!-- Or use JavaScript library for older browsers -->
<img class="lazy" src="placeholder.jpg" data-src="image.jpg" alt="Description">

<script src="https://cdnjs.cloudflare.com/ajax/libs/vanilla-lazyload/17.1.2/lazyload.min.js"></script>
<script>
    var lazyLoad = new LazyLoad({
        elements_selector: ".lazy"
    });
</script>
```

### Réduire les Ressources de Blocage de Rendu

Chargez le CSS/JS stratégiquement :

```html
<!-- Load critical CSS inline -->
<style>
    /* Critical styles for above-the-fold */
</style>

<!-- Defer non-critical CSS -->
<link rel="stylesheet" href="style.css" media="print" onload="this.media='all'">

<!-- Defer JavaScript -->
<script src="script.js" defer></script>

<!-- Or use async for non-critical scripts -->
<script src="analytics.js" async></script>
```

## Intégration CDN

Utilisez un réseau de distribution de contenu pour un accès global plus rapide.

### CDNs Populaires

| CDN | Coût | Fonctionnalités |
|---|---|---|
| Cloudflare | Gratuit/Payant | DDoS, DNS, Cache, Analytique |
| AWS CloudFront | Payant | Performance Élevée, Mondial |
| Bunny CDN | Abordable | Stockage, Vidéo, Cache |
| jsDelivr | Gratuit | Bibliothèques JavaScript |
| cdnjs | Gratuit | Bibliothèques Populaires |

### Configuration de Cloudflare

1. Inscrivez-vous sur https://www.cloudflare.com/
2. Ajoutez votre domaine
3. Mettez à jour les serveurs de noms avec ceux de Cloudflare
4. Activez les options de mise en cache :
   - Niveau de Cache: Agressif
   - Mise en Cache sur Tout: Activé
   - TTL du Cache du Navigateur: 1 mois

5. Dans XOOPS, mettez à jour votre domaine pour utiliser le DNS de Cloudflare

### Configurer CDN dans XOOPS

Mettez à jour les URLs des images vers le CDN :

Modifiez le modèle du thème :

```html
<!-- Original -->
<img src="{$xoops_url}/uploads/image.jpg" alt="">

<!-- With CDN -->
<img src="https://cdn.your-domain.com/uploads/image.jpg" alt="">
```

Ou définissez en PHP :

```php
// In mainfile.php or config
define('XOOPS_CDN_URL', 'https://cdn.your-domain.com');

// In template
<img src="{$smarty.const.XOOPS_CDN_URL}/uploads/image.jpg" alt="">
```

## Surveillance des Performances

### Test PageSpeed Insights

Testez les performances de votre site :

1. Visitez Google PageSpeed Insights: https://pagespeed.web.dev/
2. Entrez votre URL XOOPS
3. Examinez les recommandations
4. Mettez en œuvre les améliorations suggérées

### Surveillance des Performances du Serveur

Surveillez les métriques du serveur en temps réel :

```bash
# Install monitoring tools
apt-get install htop iotop nethogs

# Monitor CPU and memory
htop

# Monitor disk I/O
iotop

# Monitor network
nethogs
```

### Profilage des Performances PHP

Identifiez le code PHP lent :

```php
<?php
// Use Xdebug for profiling
xdebug_start_trace('profile');

// Your code here
$result = someExpensiveFunction();

xdebug_stop_trace();
?>
```

### Surveillance des Requêtes MySQL

Suivez les requêtes lentes :

```bash
# Enable query logging
mysql -u root -p

SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'FILE';
SET GLOBAL general_log_file = '/var/log/mysql/query.log';

# Review slow queries
tail -f /var/log/mysql/slow.log

# Analyze query with EXPLAIN
EXPLAIN SELECT * FROM xoops_users WHERE uid = 1\G
```

## Liste de Contrôle de l'Optimisation des Performances

Mettez en œuvre ces éléments pour des performances optimales :

- [ ] **Mise en Cache:** Activez la mise en cache des fichiers/APCu/Memcache
- [ ] **Base de Données:** Ajoutez des index, optimisez les tables
- [ ] **Compression:** Activez la compression Gzip
- [ ] **Cache du Navigateur:** Définissez les en-têtes de cache
- [ ] **Images:** Optimisez et compressez
- [ ] **CSS/JS:** Minifiez les fichiers
- [ ] **Chargement Différé:** Mettez en œuvre pour les images
- [ ] **CDN:** Utilisez pour les actifs statiques
- [ ] **Keep-Alive:** Activez les connexions persistantes
- [ ] **Modules:** Désactivez les modules inutilisés
- [ ] **Thèmes:** Utilisez des thèmes légers et optimisés
- [ ] **Surveillance:** Suivez les métriques de performance
- [ ] **Maintenance Régulière:** Effacez le cache, optimisez la BD

## Script d'Optimisation des Performances

Optimisation automatisée :

```bash
#!/bin/bash
# Performance optimization script

echo "=== XOOPS Performance Optimization ==="

# Clear cache
echo "Clearing cache..."
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# Optimize database
echo "Optimizing database..."
mysql -u xoops_user -p xoops_db << EOF
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_posts;
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_comments;
EOF

# Check file permissions
echo "Verifying file permissions..."
find /var/www/html/xoops -type f -exec chmod 644 {} \;
find /var/www/html/xoops -type d -exec chmod 755 {} \;
chmod 777 /var/www/html/xoops/cache
chmod 777 /var/www/html/xoops/templates_c
chmod 777 /var/www/html/xoops/uploads
chmod 777 /var/www/html/xoops/var

# Generate performance report
echo "Performance Optimization Complete!"
echo ""
echo "Next steps:"
echo "1. Test site at https://pagespeed.web.dev/"
echo "2. Monitor performance in admin panel"
echo "3. Consider CDN for static assets"
echo "4. Review slow queries in MySQL"
```

## Métriques Avant et Après

Suivez les améliorations :

```
Before Optimization:
- Page Load Time: 3.5 seconds
- Database Queries: 45
- Cache Hit Rate: 0%
- Database Size: 250MB

After Optimization:
- Page Load Time: 0.8 seconds (77% faster)
- Database Queries: 8 (cached)
- Cache Hit Rate: 85%
- Database Size: 120MB (optimized)
```

## Prochaines Étapes

1. Examinez la configuration de base
2. Assurez-vous que les mesures de sécurité sont en place
3. Mettez en œuvre la mise en cache
4. Surveillez les performances avec les outils
5. Ajustez en fonction des métriques

---

**Tags:** #performance #optimization #caching #database #cdn

**Articles Connexes:**
- ../../06-Publisher-Module/User-Guide/Basic-Configuration
- System-Settings
- Security-Configuration
- ../Installation/Server-Requirements
