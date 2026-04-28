---
title: Mise à niveau de XOOPS 2.5 vers 2.7
description: Guide étape par étape pour mettre à niveau votre installation XOOPS en toute sécurité de 2.5.x vers 2.7.x.
---

:::caution[Sauvegarder d'abord]
Toujours sauvegarder votre base de données et vos fichiers avant la mise à niveau. Pas d'exceptions.
:::

## Ce qui a changé dans 2.7

- **PHP 8.2+ requis** — PHP 7.x n'est plus supporté
- **Dépendances gérées par Composer** — Bibliothèques principales gérées via `composer.json`
- **Autoloading PSR-4** — Les classes de module peuvent utiliser les espaces de noms
- **XoopsObject amélioré** — Nouveau type de sécurité `getVar()`, `obj2Array()` dépréciée
- **Interface d'administration Bootstrap 5** — Panneau d'administration reconstruit avec Bootstrap 5

## Liste de contrôle pré-mise à niveau

- [ ] PHP 8.2+ disponible sur votre serveur
- [ ] Sauvegarde complète de la base de données (`mysqldump -u user -p xoops_db > backup.sql`)
- [ ] Sauvegarde complète de votre installation
- [ ] Liste des modules installés et de leurs versions
- [ ] Thème personnalisé sauvegardé séparément

## Étapes de mise à niveau

### 1. Mettre le site en mode maintenance

```php
// mainfile.php — ajouter temporairement
define('XOOPS_MAINTENANCE', true);
```

### 2. Télécharger XOOPS 2.7

```bash
wget https://github.com/XOOPS/XoopsCore27/releases/latest/download/xoops-2.7.x.zip
unzip xoops-2.7.x.zip
```

### 3. Remplacer les fichiers principaux

Téléchargez les nouveaux fichiers, **en excluant** :
- `uploads/` — vos fichiers chargés
- `xoops_data/` — votre configuration
- `modules/` — vos modules installés
- `themes/` — vos thèmes
- `mainfile.php` — votre configuration de site

```bash
rsync -av --exclude='uploads/' --exclude='xoops_data/' \
  --exclude='modules/' --exclude='themes/' --exclude='mainfile.php' \
  xoops-2.7/ /var/www/html/
```

### 4. Exécuter le script de mise à niveau

Accédez à `https://yourdomain.com/upgrade/` dans votre navigateur.
L'assistant de mise à niveau appliquera les migrations de base de données.

### 5. Mettre à jour les modules

Les modules XOOPS 2.7 doivent être compatibles avec PHP 8.2.
Consultez le [Guide des modules](/xoops-docs/2.7/module-guide/introduction/) pour les versions mises à jour.

En Admin → Modules, cliquez sur **Mettre à jour** pour chaque module installé.

### 6. Supprimer le mode maintenance et tester

Supprimer la ligne `XOOPS_MAINTENANCE` de `mainfile.php` et
vérifier que toutes les pages se chargent correctement.

## Problèmes courants

**Erreurs "Class not found" après la mise à niveau**
- Exécutez `composer dump-autoload` dans la racine XOOPS
- Effacez le répertoire `xoops_data/caches/`

**Module cassé après la mise à jour**
- Vérifiez les versions 2.7-compatibles des versions GitHub du module
- Le module pourrait avoir besoin de modifications de code pour PHP 8.2 (fonctions dépréciées, propriétés typées)

**CSS du panneau d'administration cassés**
- Effacez le cache de votre navigateur
- Assurez-vous que `xoops_lib/` a été complètement remplacé lors du téléchargement de fichiers
