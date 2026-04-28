---
title: "Exigences"
---

## Environnement logiciel (la pile)

La plupart des sites de production XOOPS s'exécutent sur une pile _LAMP_ (un système **L**inux exécutant **A**pache, **M**ySQL et **P**HP) mais il y a beaucoup de piles différentes possibles.

Il est souvent plus facile de prototyper un nouveau site sur une machine locale. Pour ce cas, beaucoup d'utilisateurs XOOPS choisissent une pile _WAMP_ (en utilisant **W**indows comme OS,) tandis que d'autres exécutent des piles _LAMP_ ou _MAMP_ (**M**AC).

### PHP

N'importe quelle version de PHP >= 8.2.0 (PHP 8.4 ou supérieur est fortement recommandé)

> **Important :** XOOPS 2.7.0 nécessite **PHP 8.2 ou plus récent**. PHP 7.x et les versions antérieures ne sont plus supportées. Si vous mettez à jour un site plus ancien, confirmez que votre hébergeur offre PHP 8.2+ avant de commencer.

### MySQL

Serveur MySQL 5.7 ou supérieur (serveur MySQL 8.4 ou supérieur est fortement recommandé.) MySQL 9.0 est également supporté. MariaDB est un remplacement compatible en arrière, compatible à la baisse de MySQL, et fonctionne également bien avec XOOPS.

### Serveur web

Un serveur web qui supporte l'exécution de scripts PHP, comme Apache, NGINX, LiteSpeed, etc.

### Extensions PHP requises

Le programme d'installation XOOPS vérifie les extensions suivantes avant de permettre l'installation :

* `mysqli` — Pilote de base de données MySQL
* `session` — Gestion des sessions
* `pcre` — Expressions régulières compatibles Perl
* `filter` — Filtrage et validation des entrées
* `fileinfo` — Détection du type MIME pour les uploads

### Paramètres PHP requis

En plus des extensions ci-dessus, le programme d'installation vérifie le paramètre `php.ini` suivant :

* `file_uploads` doit être **activé** — sans cela, XOOPS ne peut pas accepter les fichiers chargés

### Extensions PHP recommandées

Le programme d'installation vérifie également ces extensions. Elles ne sont pas strictement requises, mais XOOPS et la plupart des modules y comptent pour une fonctionnalité complète. Activez-en autant que votre hébergeur le permet :

* `mbstring` — Gestion des chaînes multi-octets
* `intl` — Internationalisation
* `iconv` — Conversion de jeu de caractères
* `xml` — Analyse XML
* `zlib` — Compression
* `gd` — Traitement d'images
* `exif` — Métadonnées d'images
* `curl` — Client HTTP pour les flux et les appels API

## Services

### Accès au système de fichiers (pour l'accès au webmaster)

Vous aurez besoin d'une méthode (FTP, SFTP, etc.) pour transférer les fichiers de distribution XOOPS vers le serveur web.

### Accès au système de fichiers (pour le processus du serveur web)

Pour exécuter XOOPS, la possibilité de créer, lire et supprimer des fichiers et des répertoires est nécessaire. Les chemins suivants doivent être accessibles en écriture par le processus du serveur web pour une installation normale et pour le fonctionnement quotidien normal :

* `uploads/`
* `uploads/avatars/`
* `uploads/files/`
* `uploads/images/`
* `uploads/ranks/`
* `uploads/smilies/`
* `mainfile.php` (accessible en écriture pendant l'installation et la mise à niveau)
* `xoops_data/`
* `xoops_data/caches/`
* `xoops_data/caches/xoops_cache/`
* `xoops_data/caches/smarty_cache/`
* `xoops_data/caches/smarty_compile/`
* `xoops_data/configs/`
* `xoops_data/configs/captcha/`
* `xoops_data/configs/textsanitizer/`
* `xoops_data/data/`
* `xoops_data/protector/`

### Base de données

XOOPS aura besoin de créer, modifier et interroger des tables dans MySQL. Pour cela, vous aurez besoin de :

* Un compte utilisateur MySQL et un mot de passe
* Une base de données MySQL que cet utilisateur a tous les privilèges sur (ou alternativement, l'utilisateur peut avoir le privilège de créer une telle base de données)

### E-mail

Pour un site actif, vous aurez besoin d'une adresse e-mail fonctionnelle que XOOPS peut utiliser pour la communication des utilisateurs, comme les activations de compte et les réinitialisations de mot de passe. Bien que ne soit pas strictement nécessaire, il est recommandé si possible d'utiliser une adresse e-mail qui correspond au domaine sur lequel s'exécute votre XOOPS. Cela aide à éviter que vos communications soient rejetées ou marquées comme spam.

## Outils

Vous pourriez avoir besoin de certains outils supplémentaires pour configurer et personnaliser votre installation XOOPS. Ceux-ci peuvent inclure :

* Logiciel client FTP
* Éditeur de texte
* Logiciel d'archive pour travailler avec les fichiers de version XOOPS (_.zip_ ou _.tar.gz_).

Consultez la section [Outils du métier](../tools/tools.md) pour obtenir quelques suggestions d'outils appropriés et de piles de serveurs web si nécessaire.

## Sujets spéciaux

Certaines combinaisons spécifiques de logiciels système pourraient nécessiter des configurations supplémentaires pour fonctionner avec XOOPS. Si vous utilisez un environnement SELinux, ou mettez à niveau un site plus ancien avec des thèmes personnalisés, veuillez consulter [Sujets spéciaux](specialtopics.md) pour plus d'informations.
