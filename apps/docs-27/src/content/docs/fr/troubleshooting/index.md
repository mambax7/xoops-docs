---
title: "Dépannage"
description: "Solutions pour les problèmes courants de XOOPS, techniques de débogage et FAQ"
---

> Solutions aux problèmes courants et techniques de débogage pour XOOPS CMS.

---

## Diagnostic rapide

Avant de plonger dans des problèmes spécifiques, vérifiez ces causes courantes:

1. **Permissions des fichiers** - Les répertoires ont besoin de 755, les fichiers ont besoin de 644
2. **Version PHP** - Assurez-vous que PHP 7.4+ (8.x recommandé)
3. **Journaux d'erreurs** - Vérifiez `xoops_data/logs/` et les journaux d'erreurs PHP
4. **Cache** - Effacez le cache dans Admin > Système > Maintenance

---

## Contenu de la section

### Problèmes courants
- Écran blanc de la mort (WSOD)
- Erreurs de connexion à la base de données
- Erreurs de permission refusée
- Défaillances d'installation du module
- Erreurs de compilation de modèles

### FAQ
- FAQ Installation
- FAQ Modules
- FAQ Thèmes
- FAQ Performance

### Débogage
- Activation du mode débogage
- Utilisation du débogueur Ray
- Débogage des requêtes de base de données
- Débogage des modèles Smarty

---

## Problèmes courants et solutions

### Écran blanc de la mort (WSOD)

**Symptômes:** Page blanche vierge, pas de message d'erreur

**Solutions:**

1. **Activer temporairement l'affichage des erreurs PHP:**
   ```php
   // Add to mainfile.php temporarily
   error_reporting(E_ALL);
   ini_set('display_errors', 1);
   ```

2. **Vérifier le journal d'erreurs PHP:**
   ```bash
   tail -f /var/log/php/error.log
   ```

3. **Causes courantes:**
   - Limite de mémoire dépassée
   - Erreur de syntaxe PHP fatale
   - Extension requise manquante

4. **Corriger les problèmes de mémoire:**
   ```php
   // In mainfile.php or php.ini
   ini_set('memory_limit', '256M');
   ```

---

### Erreurs de connexion à la base de données

**Symptômes:** "Impossible de se connecter à la base de données" ou similaire

**Solutions:**

1. **Vérifier les identifiants dans mainfile.php:**
   ```php
   define('XOOPS_DB_HOST', 'localhost');
   define('XOOPS_DB_USER', 'your_username');
   define('XOOPS_DB_PASS', 'your_password');
   define('XOOPS_DB_NAME', 'your_database');
   ```

2. **Tester la connexion manuellement:**
   ```php
   <?php
   $conn = new mysqli('localhost', 'user', 'pass', 'database');
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   echo "Connected successfully";
   ```

3. **Vérifier le service MySQL:**
   ```bash
   sudo systemctl status mysql
   sudo systemctl restart mysql
   ```

4. **Vérifier les permissions de l'utilisateur:**
   ```sql
   GRANT ALL PRIVILEGES ON xoops.* TO 'user'@'localhost';
   FLUSH PRIVILEGES;
   ```

---

### Erreurs de permission refusée

**Symptômes:** Impossible de télécharger des fichiers, impossible d'enregistrer les paramètres

**Solutions:**

1. **Définir les permissions correctes:**
   ```bash
   # Directories
   find /path/to/xoops -type d -exec chmod 755 {} \;

   # Files
   find /path/to/xoops -type f -exec chmod 644 {} \;

   # Writable directories
   chmod -R 777 xoops_data/
   chmod -R 777 uploads/
   ```

2. **Définir la propriété correcte:**
   ```bash
   chown -R www-data:www-data /path/to/xoops
   ```

3. **Vérifier SELinux (CentOS/RHEL):**
   ```bash
   # Check status
   sestatus

   # Allow httpd to write
   setsebool -P httpd_unified 1
   ```

---

### Défaillances d'installation du module

**Symptômes:** Le module ne s'installe pas, erreurs SQL

**Solutions:**

1. **Vérifier les exigences du module:**
   - Compatibilité de la version PHP
   - Extensions PHP requises
   - Compatibilité de la version XOOPS

2. **Installation SQL manuelle:**
   ```bash
   mysql -u user -p database < modules/mymodule/sql/mysql.sql
   ```

3. **Effacer le cache du module:**
   ```php
   // In xoops_data/caches/
   rm -rf xoops_cache/*
   rm -rf smarty_cache/*
   rm -rf smarty_compile/*
   ```

4. **Vérifier la syntaxe xoops_version.php:**
   ```bash
   php -l modules/mymodule/xoops_version.php
   ```

---

### Erreurs de compilation de modèles

**Symptômes:** Erreurs Smarty, modèle non trouvé

**Solutions:**

1. **Effacer le cache Smarty:**
   ```bash
   rm -rf xoops_data/caches/smarty_cache/*
   rm -rf xoops_data/caches/smarty_compile/*
   ```

2. **Vérifier la syntaxe du modèle:**
   ```smarty
   {* Correct *}
   {$variable}

   {* Incorrect - missing $ *}
   {variable}
   ```

3. **Vérifier que le modèle existe:**
   ```bash
   ls modules/mymodule/templates/
   ```

4. **Régénérer les modèles:**
   - Admin > Système > Maintenance > Modèles > Régénérer

---

## Techniques de débogage

### Activer le mode débogage XOOPS

```php
// In mainfile.php
define('XOOPS_DEBUG_LEVEL', 2);

// Levels:
// 0 = Off
// 1 = PHP debug
// 2 = PHP + SQL debug
// 3 = PHP + SQL + Smarty templates
```

### Utilisation du débogueur Ray

Ray est un excellent outil de débogage pour PHP:

```php
// Install via Composer
composer require spatie/ray --dev

// Usage in your code
ray($variable);
ray($object)->expand();
ray()->measure();

// Database queries
ray($sql)->label('Query');
```

### Console de débogage Smarty

```smarty
{* Enable in template *}
{debug}

{* Or in PHP *}
$xoopsTpl->debugging = true;
```

### Journalisation des requêtes de base de données

```php
// Enable query logging
$GLOBALS['xoopsDB']->setLogger(new XoopsLogger());

// Get all queries
$queries = $GLOBALS['xoopsLogger']->queries;
foreach ($queries as $query) {
    echo $query['sql'] . " - " . $query['time'] . "s\n";
}
```

---

## Questions fréquemment posées

### Installation

**Q: L'assistant d'installation affiche une page vierge**
R: Vérifiez les journaux d'erreurs PHP, assurez-vous que PHP dispose de suffisamment de mémoire, vérifiez les permissions des fichiers.

**Q: Impossible d'écrire dans mainfile.php lors de l'installation**
R: Définissez les permissions: `chmod 666 mainfile.php` lors de l'installation, puis `chmod 444` après.

**Q: Les tables de base de données ne sont pas créées**
R: Vérifiez que l'utilisateur MySQL dispose des privilèges CREATE TABLE, vérifiez que la base de données existe.

### Modules

**Q: La page d'administration du module est vierge**
R: Effacez le cache, vérifiez les erreurs de syntaxe dans le fichier admin/menu.php du module.

**Q: Les blocs du module ne s'affichent pas**
R: Vérifiez les permissions de bloc dans Admin > Blocs, vérifiez que le bloc est assigné aux pages.

**Q: La mise à jour du module échoue**
R: Sauvegardez la base de données, essayez les mises à jour SQL manuelles, vérifiez les exigences de version.

### Thèmes

**Q: Le thème ne s'applique pas correctement**
R: Effacez le cache Smarty, vérifiez que theme.html existe, vérifiez les permissions du thème.

**Q: Le CSS personnalisé ne se charge pas**
R: Vérifiez le chemin du fichier, effacez le cache du navigateur, vérifiez la syntaxe CSS.

**Q: Les images ne s'affichent pas**
R: Vérifiez les chemins d'image, vérifiez les permissions du dossier des téléchargements.

### Performance

**Q: Le site est très lent**
R: Activez la mise en cache, optimisez la base de données, vérifiez les requêtes lentes, activez OpCache.

**Q: Utilisation élevée de la mémoire**
R: Augmentez memory_limit, optimisez les grandes requêtes, implémentez la pagination.

---

## Commandes de maintenance

### Effacer tous les caches

```bash
#!/bin/bash
# clear_cache.sh
rm -rf xoops_data/caches/xoops_cache/*
rm -rf xoops_data/caches/smarty_cache/*
rm -rf xoops_data/caches/smarty_compile/*
echo "Cache cleared!"
```

### Optimisation de la base de données

```sql
-- Optimize all tables
OPTIMIZE TABLE xoops_config;
OPTIMIZE TABLE xoops_users;
OPTIMIZE TABLE xoops_session;
-- Repeat for other tables

-- Or optimize all at once
mysqlcheck -o -u user -p database
```

### Vérifier l'intégrité des fichiers

```bash
# Compare against fresh install
diff -r /path/to/xoops /path/to/fresh-xoops
```

---

## Documentation connexe

- Démarrage
- Meilleures pratiques de sécurité
- Feuille de route XOOPS 4.0

---

## Ressources externes

- [Forums XOOPS](https://xoops.org/modules/newbb/)
- [Problèmes GitHub](https://github.com/XOOPS/XoopsCore27/issues)
- [Référence des erreurs PHP](https://www.php.net/manual/en/errorfunc.constants.php)

---

#xoops #dépannage #débogage #faq #erreurs #solutions
