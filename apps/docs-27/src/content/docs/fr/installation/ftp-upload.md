---
title: "Annexe 2 : Charger XOOPS via FTP"
---

Cette annexe guide le déploiement de XOOPS 2.7.0 sur un hôte distant en utilisant FTP ou SFTP. N'importe quel panneau de contrôle (cPanel, Plesk, DirectAdmin, etc.) expose les mêmes étapes sous-jacentes.

## 1. Préparer la base de données

Via le panneau de contrôle de votre hébergeur :

1. Créez une nouvelle base de données MySQL pour XOOPS.
2. Créez un utilisateur de base de données avec un mot de passe fort.
3. Accordez à l'utilisateur tous les privilèges sur la base de données nouvellement créée.
4. Enregistrez le nom de la base de données, le nom d'utilisateur, le mot de passe et l'hôte — vous les entrerez dans le programme d'installation de XOOPS.

> **Conseil**
>
> Les panneaux de contrôle modernes génèrent des mots de passe forts pour vous. Comme l'application stocke le mot de passe dans `xoops_data/data/secure.php`, vous n'avez pas besoin de le taper souvent — préférez une valeur longue et générée aléatoirement.

## 2. Créer une boîte aux lettres administrateur

Créez une boîte aux lettres e-mail qui recevra les notifications d'administration du site. Le programme d'installation de XOOPS demande cette adresse lors de la configuration du compte webmaster et la valide avec `FILTER_VALIDATE_EMAIL`.

## 3. Charger les fichiers

XOOPS 2.7.0 est livré avec ses dépendances tierces pré-installées dans `xoops_lib/vendor/` (packages Composer, Smarty 4, HTMLPurifier, PHPMailer, Monolog, TCPDF, etc.). Cela rend `xoops_lib/` nettement plus grand que dans 2.5.x — comptez des dizaines de mégaoctets.

**Ne sautez pas sélectivement les fichiers à l'intérieur de `xoops_lib/vendor/`.** Ignorer les fichiers dans l'arborescence du vendeur Composer cassera l'autoload et l'installation échouera.

Structure de chargement (en supposant que `public_html` est la racine du document) :

1. Chargez `xoops_data/` et `xoops_lib/` **à côté de** `public_html`, pas dedans. Placer ces répertoires en dehors de la racine web est la posture de sécurité recommandée pour 2.7.0.

   ```
   /home/your-user/
   ├── public_html/
   ├── xoops_data/     ← charger ici
   └── xoops_lib/      ← charger ici
   ```

   ![](/xoops-docs/2.7/img/installation/img_66.jpg)
   ![](/xoops-docs/2.7/img/installation/img_67.jpg)

2. Chargez le reste du contenu du répertoire `htdocs/` de la distribution dans `public_html/`.

   ![](/xoops-docs/2.7/img/installation/img_68.jpg)

> **Si votre hébergeur ne permet pas les répertoires en dehors de la racine du document**
>
> Chargez `xoops_data/` et `xoops_lib/` **dedans** `public_html/` et **renommez-les en noms non-évidents** (par exemple `xdata_8f3k2/` et `xlib_7h2m1/`). Vous entrerez les chemins renommés dans le programme d'installation lorsqu'il vous demande le chemin de données XOOPS et le chemin de la bibliothèque XOOPS.

## 4. Rendre les répertoires accessibles

Via le dialogue CHMOD du client FTP (ou SSH), rendez les répertoires énumérés au chapitre 2 accessibles en écriture par le serveur web. Sur la plupart des hébergeurs partagés, `0775` sur les répertoires et `0664` sur `mainfile.php` sont suffisants. `0777` est acceptable pendant l'installation si votre hébergeur exécute PHP sous un utilisateur autre que l'utilisateur FTP, mais resserrez les permissions après la fin de l'installation.

## 5. Lancer le programme d'installation

Pointez votre navigateur vers l'URL publique du site. Si tous les fichiers sont en place, l'assistant d'installation de XOOPS démarre et vous pouvez suivre le reste de ce guide à partir du [Chapitre 2](chapter-2-introduction.md).
