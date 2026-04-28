---
title: "Préparations pour la mise à niveau"
---

## Éteindre le site

Avant de commencer le processus de mise à niveau de XOOPS, vous devez définir l'élément "Éteindre votre site ?" sur _Oui_ dans la page Préférences -> Options système -> Paramètres généraux dans le menu Administration.

Cela empêche les utilisateurs de rencontrer un site cassé lors de la mise à niveau. Cela réduit également les contentions pour les ressources afin d'assurer une mise à niveau plus fluide.

Au lieu d'erreurs et d'un site cassé, vos visiteurs verront quelque chose comme ceci :

![Site fermé sur mobile](/xoops-docs/2.7/img/installation/mobile-site-closed.png)

## Sauvegarde

C'est une bonne idée d'utiliser la section _Maintenance_ de l'administration XOOPS pour _Nettoyer le dossier de cache_ pour tous les caches avant de faire une sauvegarde complète de vos fichiers de site. Avec le site éteint, l'utilisation de _Vider la table des sessions_ est également recommandée afin que si une restauration est nécessaire, les sessions obsolètes ne fassent pas partie.

### Fichiers

La sauvegarde des fichiers peut être faite avec FTP, copiant tous les fichiers sur votre machine locale. Si vous avez un accès direct au shell vers le serveur, il peut être _beaucoup_ plus rapide de faire une copie (ou une copie d'archive) là.

### Base de données

Pour faire une sauvegarde de la base de données, vous pouvez utiliser les fonctions intégrées dans la section _Maintenance_ de l'administration XOOPS. Vous pouvez également utiliser les fonctions _Exporter_ dans _phpMyAdmin_, si disponible. Si vous avez un accès shell, vous pouvez utiliser la commande _mysql_ pour vider votre base de données.

Être fluide dans la sauvegarde et la _restauration_ de votre base de données est une compétence importante du webmaster. Il y a beaucoup de ressources en ligne que vous pouvez utiliser pour en savoir plus sur ces opérations selon vos besoins d'installation, comme [http://webcheatsheet.com/sql/mysql_backup_restore.php](http://webcheatsheet.com/sql/mysql_backup_restore.php)

![Export phpMyAdmin](/xoops-docs/2.7/img/installation/phpmyadmin-export-01.png)

## Copier les nouveaux fichiers sur le site

Copier les nouveaux fichiers vers votre site est pratiquement identique à l'étape [Préparations](../../installation/preparations/) lors de l'installation. Vous devez copier les répertoires _xoops_data_ et _xoops_lib_ où ceux-ci ont été déplacés lors de l'installation. Ensuite, copiez le reste du contenu du répertoire _htdocs_ de la distribution (avec quelques exceptions couvertes dans la section suivante) sur les fichiers et répertoires existants dans votre racine web.

Dans XOOPS 2.7.0, copier une nouvelle distribution sur un site existant **ne remplacera pas les fichiers de configuration existants** tels que `mainfile.php` ou `xoops_data/data/secure.php`. C'est un changement bienvenu par rapport aux versions antérieures, mais vous devriez toujours faire une sauvegarde complète avant de commencer.

Copiez l'ensemble du répertoire _upgrade_ de la distribution vers votre racine web, en créant un répertoire _upgrade_ là.

## Exécuter la vérification de pré-vol Smarty 4

Avant de lancer le principal flux `/upgrade/`, vous devez exécuter le scanner de pré-vol fourni dans le répertoire `upgrade/`. Il examine vos thèmes existants et les modèles de modules pour les problèmes de compatibilité Smarty 4 et peut réparer automatiquement beaucoup d'entre eux.

1. Pointez votre navigateur vers _your-site-url_/upgrade/preflight.php
2. Connectez-vous avec un compte administrateur
3. Exécutez l'analyse et vérifiez le rapport
4. Appliquez les réparations automatiques proposées ou corrigez manuellement les modèles signalés
5. Réexécutez l'analyse jusqu'à ce qu'elle soit propre
6. Seulement ensuite, continuez vers la principale mise à niveau

Consultez la page [Vérification de pré-vol](preflight.md) pour une procédure complète.

### Choses que vous pourriez ne pas vouloir copier

Vous ne devez pas recopier le répertoire _install_ dans un système XOOPS fonctionnant. Laisser le dossier d'installation dans votre installation XOOPS expose votre système à des problèmes de sécurité potentiels. Le programme d'installation le renomme aléatoirement, mais vous devez le supprimer et vérifier que vous n'en copiez pas un autre.

Il y a quelques fichiers que vous avez pu éditer pour personnaliser votre site, et vous voudrez préserver ceux-ci. Voici une liste des personnalisations courantes.

* _xoops_data/configs/xoopsconfig.php_ s'il a été modifié depuis que le site a été installé
* Tous les répertoires dans _themes_ s'ils sont personnalisés pour votre site. Dans ce cas, vous pourriez vouloir comparer les fichiers pour identifier les mises à jour utiles.
* N'importe quel fichier dans _class/captcha/_ commençant par "config" s'il a été modifié depuis que le site a été installé
* Toute personnalisation dans _class/textsanitizer_
* Toute personnalisation dans _class/xoopseditor_

Si vous réalisez après la mise à niveau que quelque chose a été accidentellement écrasé, ne paniquez pas -- c'est pourquoi vous avez commencé avec une sauvegarde complète. _(Vous avez fait une sauvegarde, non ?)_

## Vérifier mainfile.php (Mise à niveau à partir de XOOPS pré-2.5)

Cette étape s'applique uniquement si vous mettez à niveau une ancienne version de XOOPS (2.3 ou antérieure). Si vous mettez à niveau à partir de XOOPS 2.5.x, vous pouvez ignorer cette section.

Les anciennes versions de XOOPS nécessitaient quelques modifications manuelles pour être apportées dans `mainfile.php` afin d'activer le module Protector. Dans votre racine web, vous devez avoir un fichier nommé `mainfile.php`. Ouvrez ce fichier dans votre éditeur et recherchez ces lignes :

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/precheck.inc.php' ;
```

et

```php
include XOOPS_TRUST_PATH.'/modules/protector/include/postcheck.inc.php' ;
```

Supprimez ces lignes si vous les trouvez, et enregistrez le fichier avant de continuer.
