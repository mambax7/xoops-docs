---
title: "FAQ modules"
description: "Questions fréquemment posées sur les modules XOOPS"
---

# Questions fréquemment posées sur les modules

> Questions et réponses courantes sur les modules XOOPS, l'installation et la gestion.

---

## Installation et activation

### Q: Comment installer un module dans XOOPS?

**R:**
1. Télécharger le fichier zip du module
2. Aller à XOOPS Admin > Modules > Gérer les modules
3. Cliquer sur "Parcourir" et sélectionner le fichier zip
4. Cliquer sur "Télécharger"
5. Le module apparaît dans la liste (généralement désactivé)
6. Cliquer sur l'icône d'activation pour l'activer

Alternativement, extraire le zip directement dans `/xoops_root/modules/` et accéder au panneau d'administration.

---

### Q: Le téléchargement du module échoue avec "Permission refusée"

**R:** Problème de permission des fichiers:

```bash
# Corriger les permissions du répertoire des modules
chmod 755 /path/to/xoops/modules

# Corriger le répertoire de téléchargement (si applicable)
chmod 777 /path/to/xoops/uploads

# Corriger la propriété si nécessaire
chown -R www-data:www-data /path/to/xoops
```

Voir Échecs d'installation des modules pour plus de détails.

---

### Q: Pourquoi je ne vois pas le module dans le panneau d'administration après l'installation?

**R:** Vérifier:

1. **Module non activé** - Cliquer sur l'icône d'œil dans la liste des modules
2. **Page d'administration manquante** - Le module doit avoir `hasAdmin = 1` dans xoopsversion.php
3. **Fichiers de langue manquants** - Besoin de `language/english/admin.php`
4. **Cache non vidé** - Vider le cache et rafraîchir le navigateur

```bash
# Vider le cache XOOPS
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### Q: Comment désinstaller un module?

**R:**
1. Aller à XOOPS Admin > Modules > Gérer les modules
2. Désactiver le module (cliquer sur l'icône d'œil)
3. Cliquer sur l'icône corbeille/supprimer
4. Supprimer manuellement le dossier du module si vous voulez une suppression complète:

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## Gestion des modules

### Q: Quelle est la différence entre désactiver et désinstaller?

**R:**
- **Désactiver**: Désactiver le module (cliquer sur l'icône d'œil). Les tables de base de données restent.
- **Désinstaller**: Supprimer le module. Supprime les tables de base de données et retire de la liste.

Pour supprimer complètement:
```bash
rm -rf modules/modulename
```

---

### Q: Comment vérifier si un module est correctement installé?

**R:** Utiliser le script de débogage:

```php
<?php
// Créer admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin uniquement');
}

echo "<h1>Débogage du module</h1>";

// Lister tous les modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Statut: " . ($module->getVar('isactive') ? "Actif" : "Inactif") . "<br>";
    echo "Répertoire: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### Q: Puis-je exécuter plusieurs versions du même module?

**R:** Non, XOOPS ne supporte pas cela nativement. Cependant, vous pouvez:

1. Créer une copie avec un nom de répertoire différent: `mymodule` et `mymodule2`
2. Mettre à jour le dirname dans le xoopsversion.php des deux modules
3. S'assurer que les noms des tables de base de données sont uniques

Ce n'est pas recommandé car ils partagent le même code.

---

## Configuration des modules

### Q: Où configurer les paramètres du module?

**R:**
1. Aller à XOOPS Admin > Modules
2. Cliquer sur l'icône des paramètres/engrenage à côté du module
3. Configurer les préférences

Les paramètres sont stockés dans la table `xoops_config`.

**Accès dans le code:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

## Débogage et optimisation

### Q: Le module est lent, comment l'optimiser?

**R:**
1. **Vérifier les requêtes de base de données** - Utiliser l'enregistrement des requêtes
2. **Mettre en cache les données** - Utiliser le cache XOOPS:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 heure
}
?>
```

3. **Optimiser les modèles** - Éviter les boucles dans les modèles
4. **Activer PHP opcode cache** - APCu, XDebug, etc.

Voir FAQ sur les performances pour plus de détails.

---

## Documentation connexe

- Échecs d'installation des modules
- Structure des modules
- FAQ sur les performances
- Activer le mode débogage

---

#xoops #modules #faq #troubleshooting
