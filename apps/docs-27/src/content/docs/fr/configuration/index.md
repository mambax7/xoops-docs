---
title: "Configuration de Base"
description: "Configuration initiale de XOOPS incluant les paramètres mainfile.php, le nom du site, l'e-mail et la configuration du fuseau horaire"
---

# Configuration de Base de XOOPS

Ce guide couvre les paramètres de configuration essentiels pour que votre site XOOPS fonctionne correctement après l'installation.

## Configuration de mainfile.php

Le fichier `mainfile.php` contient la configuration critique de votre installation XOOPS. Il est créé lors de l'installation, mais vous pourrez avoir besoin de le modifier manuellement.

### Localisation

```
/var/www/html/xoops/mainfile.php
```

### Structure du Fichier

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

### Paramètres Critiques Expliqués

| Paramètre | Objectif | Exemple |
|---|---|---|
| `XOOPS_DB_TYPE` | Système de base de données | `mysqli`, `mysql`, `pdo` |
| `XOOPS_DB_HOST` | Emplacement du serveur de base de données | `localhost`, `192.168.1.1` |
| `XOOPS_DB_USER` | Nom d'utilisateur de la base de données | `xoops_user` |
| `XOOPS_DB_PASS` | Mot de passe de la base de données | [secure_password] |
| `XOOPS_DB_NAME` | Nom de la base de données | `xoops_db` |
| `XOOPS_DB_PREFIX` | Préfixe du nom de la table | `xoops_` (permet plusieurs XOOPS sur une DB) |
| `XOOPS_ROOT_PATH` | Chemin du système de fichiers physique | `/var/www/html/xoops` |
| `XOOPS_URL` | URL accessible sur le web | `http://your-domain.com` |
| `XOOPS_TRUST_PATH` | Chemin de confiance (en dehors de la racine web) | `/var/www/xoops_var` |

### Édition de mainfile.php

Ouvrez mainfile.php dans un éditeur de texte :

```bash
# Using nano
nano /var/www/html/xoops/mainfile.php

# Using vi
vi /var/www/html/xoops/mainfile.php

# Using sed (find and replace)
sed -i "s|define('XOOPS_URL'.*|define('XOOPS_URL', 'http://new-domain.com');|" /var/www/html/xoops/mainfile.php
```

### Modifications Courantes de mainfile.php

**Changer l'URL du site:**
```php
define('XOOPS_URL', 'https://yourdomain.com');
```

**Activer le mode débogage (développement uniquement):**
```php
define('XOOPS_DEBUG', 1);
```

**Changer le préfixe de la table (si nécessaire):**
```php
define('XOOPS_DB_PREFIX', 'myxoops_');
```

**Déplacer le chemin de confiance en dehors de la racine web (avancé):**
```php
define('XOOPS_TRUST_PATH', '/var/www/xoops_var');
```

## Configuration du Panneau Admin

Configurez les paramètres de base via le panneau d'administration XOOPS.

### Accès aux Paramètres Système

1. Connectez-vous au panneau d'administration : `http://your-domain.com/xoops/admin/`
2. Naviguez vers : **Système > Préférences > Paramètres Généraux**
3. Modifiez les paramètres (voir ci-dessous)
4. Cliquez sur "Enregistrer" en bas

### Nom et Description du Site

Configurez comment votre site s'affiche :

```
Nom du Site: Mon Site XOOPS
Description du Site: Un système de gestion de contenu dynamique
Slogan du Site: Construit avec XOOPS
```

### Informations de Contact

Définissez les détails de contact du site :

```
E-mail Admin du Site: admin@your-domain.com
Nom Admin du Site: Administrateur du Site
E-mail Formulaire de Contact: support@your-domain.com
E-mail Support: help@your-domain.com
```

### Langue et Région

Définissez la langue par défaut et la région :

```
Langue par Défaut: Français
Fuseau Horaire par Défaut: Europe/Paris  (ou votre fuseau horaire)
Format de Date: %Y-%m-%d
Format de l'Heure: %H:%M:%S
```

## Configuration de l'E-mail

Configurez les paramètres d'e-mail pour les notifications et les communications des utilisateurs.

### Emplacement des Paramètres d'E-mail

**Panneau Admin:** Système > Préférences > Paramètres d'E-mail

### Configuration SMTP

Pour une livraison fiable des e-mails, utilisez SMTP plutôt que PHP mail() :

```
Utiliser SMTP: Oui
Hôte SMTP: smtp.gmail.com  (ou votre fournisseur SMTP)
Port SMTP: 587  (TLS) ou 465 (SSL)
Nom d'Utilisateur SMTP: your-email@gmail.com
Mot de Passe SMTP: [app_password]
Sécurité SMTP: TLS ou SSL
```

### Exemple de Configuration Gmail

Configurez XOOPS pour envoyer des e-mails via Gmail :

```
Hôte SMTP: smtp.gmail.com
Port SMTP: 587
Sécurité SMTP: TLS
Nom d'Utilisateur SMTP: your-email@gmail.com
Mot de Passe SMTP: [Mot de Passe App Google - PAS le mot de passe Gmail normal]
Adresse D'Origine: your-email@gmail.com
Nom D'Origine: Nom de Votre Site
```

**Remarque:** Gmail nécessite un mot de passe d'application, pas votre mot de passe Gmail :
1. Allez à https://myaccount.google.com/apppasswords
2. Générez un mot de passe d'application pour "Mail" et "Ordinateur Windows"
3. Utilisez le mot de passe généré dans XOOPS

### Configuration PHP mail() (Plus Simple Mais Moins Fiable)

Si SMTP n'est pas disponible, utilisez PHP mail() :

```
Utiliser SMTP: Non
Adresse D'Origine: noreply@your-domain.com
Nom D'Origine: Nom de Votre Site
```

Assurez-vous que votre serveur a sendmail ou postfix configuré :

```bash
# Check if sendmail is available
which sendmail

# Or check postfix
systemctl status postfix
```

### Paramètres de Fonction d'E-mail

Configurez ce qui déclenche les e-mails :

```
Envoyer les Notifications: Oui
Notifier Admin à l'Enregistrement d'Utilisateur: Oui
Envoyer un E-mail de Bienvenue aux Nouveaux Utilisateurs: Oui
Envoyer un Lien de Réinitialisation de Mot de Passe: Oui
Activer l'E-mail Utilisateur: Oui
Activer les Messages Privés: Oui
Notifier lors des Actions Admin: Oui
```

## Configuration du Fuseau Horaire

Définissez le fuseau horaire approprié pour les horodatages et la programmation corrects.

### Définition du Fuseau Horaire dans le Panneau Admin

**Chemin:** Système > Préférences > Paramètres Généraux

```
Fuseau Horaire par Défaut: [Sélectionnez votre fuseau horaire]
```

**Fuseaux Horaires Courants:**
- America/New_York (EST/EDT)
- America/Chicago (CST/CDT)
- America/Denver (MST/MDT)
- America/Los_Angeles (PST/PDT)
- Europe/London (GMT/BST)
- Europe/Paris (CET/CEST)
- Asia/Tokyo (JST)
- Asia/Shanghai (CST)
- Australia/Sydney (AEDT/AEST)

### Vérifier le Fuseau Horaire

Vérifiez le fuseau horaire actuel du serveur :

```bash
# Show current timezone
timedatectl

# Or check date
date +%Z

# List available timezones
timedatectl list-timezones
```

### Définir le Fuseau Horaire Système (Linux)

```bash
# Set timezone
timedatectl set-timezone America/New_York

# Or use symlink method
ln -sf /usr/share/zoneinfo/America/New_York /etc/localtime

# Verify
date
```

## Configuration de l'URL

### Activer les URLs Propres (URLs Conviviales)

Pour les URLs comme `/page/about` au lieu de `/index.php?page=about`

**Conditions Requises:**
- Apache avec mod_rewrite activé
- Fichier `.htaccess` à la racine de XOOPS

**Activer dans le Panneau Admin:**

1. Allez à : **Système > Préférences > Paramètres d'URL**
2. Cochez : "Activer les URLs Conviviales"
3. Sélectionnez : "Type d'URL" (Path Info ou Query)
4. Enregistrez

**Vérifier que .htaccess Existe:**

```bash
cat /var/www/html/xoops/.htaccess
```

Contenu .htaccess exemple :

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /xoops/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ index.php?$1 [L,QSA]
</IfModule>
```

**Dépannage des URLs Propres:**

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

### Configurer l'URL du Site

**Panneau Admin:** Système > Préférences > Paramètres Généraux

Définissez l'URL correcte pour votre domaine :

```
URL du Site: http://your-domain.com/xoops/
```

Ou si XOOPS est à la racine :

```
URL du Site: http://your-domain.com/
```

## Optimisation des Moteurs de Recherche (SEO)

Configurez les paramètres de SEO pour une meilleure visibilité dans les moteurs de recherche.

### Balises Meta

Définissez les balises meta globales :

**Panneau Admin:** Système > Préférences > Paramètres SEO

```
Mots-clés Meta: xoops, cms, gestion de contenu
Description Meta: Un système de gestion de contenu dynamique
```

Ceux-ci apparaissent dans la page `<head>` :

```html
<meta name="keywords" content="xoops, cms, gestion de contenu">
<meta name="description" content="Un système de gestion de contenu dynamique">
```

### Sitemap

Activez le sitemap XML pour les moteurs de recherche :

1. Allez à : **Système > Modules**
2. Trouvez le module "Sitemap"
3. Cliquez pour installer et activer
4. Accédez au sitemap à : `/xoops/sitemap.xml`

### Robots.txt

Contrôlez l'exploration des moteurs de recherche :

Créez `/var/www/html/xoops/robots.txt` :

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /templates_c/
Disallow: /install/
Disallow: /upgrade/

Sitemap: https://your-domain.com/xoops/sitemap.xml
```

## Paramètres Utilisateur

Configurez les paramètres par défaut relatifs aux utilisateurs.

### Enregistrement des Utilisateurs

**Panneau Admin:** Système > Préférences > Paramètres Utilisateur

```
Autoriser l'Enregistrement Utilisateur: Oui/Non
Type d'Enregistrement Utilisateur:
  - Instantané (Approbation Automatique)
  - Approbation Requise (Approbation Admin Requise)
  - Vérification E-mail (Confirmation E-mail Requise)

Vérification E-mail Requise: Oui/Non
Méthode d'Activation de Compte: Automatique/Manuelle
```

### Profil Utilisateur

```
Activer les Profils Utilisateur: Oui
Afficher l'Avatar Utilisateur: Oui
Taille Maximale de l'Avatar: 100KB
Dimensions de l'Avatar: 100x100 pixels
```

### Affichage E-mail Utilisateur

```
Afficher l'E-mail Utilisateur: Non (pour la confidentialité)
Les Utilisateurs Peuvent Masquer l'E-mail: Oui
Les Utilisateurs Peuvent Changer l'Avatar: Oui
Les Utilisateurs Peuvent Télécharger des Fichiers: Oui
```

## Configuration du Cache

Améliorez les performances avec la mise en cache appropriée.

### Paramètres du Cache

**Panneau Admin:** Système > Préférences > Paramètres du Cache

```
Activer la Mise en Cache: Oui
Méthode de Cache: Fichier (ou APCu/Memcache si disponible)
Durée de Vie du Cache: 3600 secondes (1 heure)
```

### Effacer le Cache

Effacez les anciens fichiers de cache :

```bash
# Manual cache clear
rm -rf /var/www/html/xoops/cache/*
rm -rf /var/www/html/xoops/templates_c/*

# From admin panel:
# System > Dashboard > Tools > Clear Cache
```

## Liste de Contrôle des Paramètres Initiaux

Après l'installation, configurez :

- [ ] Le nom du site et la description sont définis correctement
- [ ] L'e-mail admin est configuré
- [ ] Les paramètres e-mail SMTP sont configurés et testés
- [ ] Le fuseau horaire est défini sur votre région
- [ ] L'URL est configurée correctement
- [ ] Les URLs propres (URLs conviviales) sont activées si souhaité
- [ ] Les paramètres d'enregistrement utilisateur sont configurés
- [ ] Les balises meta pour le SEO sont configurées
- [ ] La langue par défaut est sélectionnée
- [ ] Les paramètres du cache sont activés
- [ ] Le mot de passe utilisateur admin est fort (16+ caractères)
- [ ] Testez l'enregistrement des utilisateurs
- [ ] Testez la fonctionnalité e-mail
- [ ] Testez le téléchargement de fichier
- [ ] Visitez la page d'accueil et vérifiez l'apparence

## Test de Configuration

### Tester l'E-mail

Envoyez un e-mail de test :

**Panneau Admin:** Système > Test E-mail

Ou manuellement :

```php
<?php
// Create test file: /var/www/html/xoops/test-email.php
require_once __DIR__ . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/class/mail/phpmailer/class.phpmailer.php';

$mailer = xoops_getMailer();
$mailer->addRecipient('admin@your-domain.com');
$mailer->setSubject('Test E-mail XOOPS');
$mailer->setBody('Ceci est un e-mail de test de XOOPS');

if ($mailer->send()) {
    echo "E-mail envoyé avec succès!";
} else {
    echo "Échec de l'envoi de l'e-mail: " . $mailer->getError();
}
?>
```

### Tester la Connexion à la Base de Données

```php
<?php
// Create test file: /var/www/html/xoops/test-db.php
require_once __DIR__ . '/mainfile.php';

$connection = XoopsDatabaseFactory::getDatabaseConnection();
if ($connection) {
    echo "Connexion à la base de données réussie!";
    $result = $connection->query("SELECT COUNT(*) FROM " . $connection->prefix("users"));
    if ($result) {
        echo "Requête réussie!";
    }
} else {
    echo "Échec de la connexion à la base de données!";
}
?>
```

**Important:** Supprimez les fichiers de test après le test!

```bash
rm /var/www/html/xoops/test-*.php
```

## Résumé des Fichiers de Configuration

| Fichier | Objectif | Méthode d'Édition |
|---|---|---|
| mainfile.php | Paramètres de base de données et principaux | Éditeur de texte |
| Panneau Admin | La plupart des paramètres | Interface Web |
| .htaccess | Réécriture d'URL | Éditeur de texte |
| robots.txt | Exploration des moteurs de recherche | Éditeur de texte |

## Prochaines Étapes

Après la configuration de base :

1. Configurez les paramètres système en détail
2. Renforcez la sécurité
3. Explorez le panneau admin
4. Créez votre premier contenu
5. Configurez les comptes utilisateur

---

**Tags:** #configuration #setup #email #timezone #seo

**Articles Connexes:**
- ../Installation/Installation
- System-Settings
- Security-Configuration
- Performance-Optimization
