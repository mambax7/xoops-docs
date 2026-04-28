---
title: "Pages d'administration du module"
description: "Créer des pages d'administration standardisées et compatibles futures avec XMF"
---

La classe `Xmf\Module\Admin` fournit un moyen cohérent de créer des interfaces d'administration de module. Utiliser XMF pour les pages d'administration assure la compatibilité future avec les futures versions de XOOPS tout en maintenant une expérience utilisateur uniforme.

## Aperçu

La classe ModuleAdmin dans les frameworks XOOPS a facilité l'administration, mais son API a évolué à travers les versions. Le wrapper `Xmf\Module\Admin`:

- Fournit une API stable qui fonctionne sur les versions XOOPS
- Gère automatiquement les différences API entre les versions
- Assure que votre code d'administration est compatible à l'avenir
- Offre des méthodes statiques pratiques pour les tâches courantes

## Démarrage

### Créer une instance d'administration

```php
$admin = \Xmf\Module\Admin::getInstance();
```

Cela retourne soit une instance `Xmf\Module\Admin`, soit une classe système native si déjà compatible.

## Gestion des icônes

### Le problème de l'emplacement des icônes

Les icônes ont changé de place entre les versions de XOOPS, causant des problèmes de maintenance. XMF résout cela avec des méthodes utilitaires.

### Trouver les icônes

**Ancienne méthode (dépendante de la version):**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon16 = $module->getInfo('icons16');
$img_src = $pathIcon16 . '/delete.png';
```

**Méthode XMF:**
```php
$img_src = \Xmf\Module\Admin::iconUrl('delete.png', 16);
```

La méthode `iconUrl()` retourne une URL complète, donc vous n'avez pas besoin de vous soucier de la construction du chemin.

### Tailles d'icônes

```php
// Icônes 16x16
$smallIcon = \Xmf\Module\Admin::iconUrl('edit.png', 16);

// Icônes 32x32 (par défaut)
$largeIcon = \Xmf\Module\Admin::iconUrl('edit.png', 32);

// Juste le chemin (pas de nom de fichier)
$iconPath = \Xmf\Module\Admin::iconUrl('', 16);
```

### Icônes de menu

Pour les fichiers menu.php d'administration:

**Ancienne méthode:**
```php
$dirname = basename(dirname(dirname(__FILE__)));
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname($dirname);
$pathIcon32 = $module->getInfo('icons32');

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => '../../' . $pathIcon32 . '/home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => '../../' . $pathIcon32 . '/about.png'
];
```

**Méthode XMF:**
```php
// Obtenir le chemin des icônes
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];
$adminmenu[] = [
    'title' => _MI_DEMO_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Pages d'administration standard

### Page d'index

**Format ancien:**
```php
$indexAdmin = new ModuleAdmin();

echo $indexAdmin->addNavigation('index.php');
echo $indexAdmin->renderIndex();
```

**Format XMF:**
```php
$indexAdmin = \Xmf\Module\Admin::getInstance();

$indexAdmin->displayNavigation('index.php');
$indexAdmin->displayIndex();
```

### Page À propos

**Format ancien:**
```php
$aboutAdmin = new ModuleAdmin();

echo $aboutAdmin->addNavigation('about.php');
echo $aboutAdmin->renderAbout('6XYZRW5DR3VTJ', false);
```

**Format XMF:**
```php
$aboutAdmin = \Xmf\Module\Admin::getInstance();

$aboutAdmin->displayNavigation('about.php');
\Xmf\Module\Admin::setPaypal('6XYZRW5DR3VTJ');
$aboutAdmin->displayAbout(false);
```

> **Note:** Dans les futures versions XOOPS, les informations PayPal sont définies dans xoops_version.php. L'appel `setPaypal()` assure la compatibilité avec les versions actuelles tout en n'ayant aucun effet dans les versions plus récentes.

## Navigation

### Afficher le menu de navigation

```php
$admin = \Xmf\Module\Admin::getInstance();

// Afficher la navigation pour la page actuelle
$admin->displayNavigation('items.php');

// Ou obtenir la chaîne HTML
$navHtml = $admin->renderNavigation('items.php');
```

## Boîtes d'information

### Créer des boîtes d'information

```php
$admin = \Xmf\Module\Admin::getInstance();

// Ajouter une boîte d'information
$admin->addInfoBox('Module Statistics');

// Ajouter des lignes à la boîte d'information
$admin->addInfoBoxLine('Total Items: ' . $itemCount, 'default', 'green');
$admin->addInfoBoxLine('Active Users: ' . $userCount, 'default', 'blue');

// Afficher la boîte d'information
$admin->displayInfoBox();
```

## Boîtes de configuration

Les boîtes de configuration affichent les exigences système et les vérifications de statut.

### Lignes de configuration de base

```php
$admin = \Xmf\Module\Admin::getInstance();

// Ajouter un message simple
$admin->addConfigBoxLine('Module is properly configured', 'default');

// Vérifier si le répertoire existe
$admin->addConfigBoxLine('/uploads/mymodule', 'folder');

// Vérifier le répertoire avec des permissions
$admin->addConfigBoxLine(['/uploads/mymodule', '0755'], 'chmod');

// Vérifier si le module est installé
$admin->addConfigBoxLine('xlanguage', 'module');

// Vérifier le module avec un avertissement au lieu d'une erreur s'il manque
$admin->addConfigBoxLine(['xlanguage', 'warning'], 'module');
```

### Méthodes pratiques

```php
$admin = \Xmf\Module\Admin::getInstance();

// Ajouter un message d'erreur
$admin->addConfigError('Upload directory is not writable');

// Ajouter un message de succès/acceptation
$admin->addConfigAccept('Database tables verified');

// Ajouter un message d'avertissement
$admin->addConfigWarning('Cache directory should be cleared');

// Vérifier la version du module
$admin->addConfigModuleVersion('xlanguage', '1.0');
```

### Types de boîte de configuration

| Type | Valeur | Comportement |
|------|--------|----------|
| `default` | Chaîne de message | Affiche le message directement |
| `folder` | Chemin du répertoire | Affiche l'acceptation s'il existe, une erreur sinon |
| `chmod` | `[chemin, permission]` | Vérifie que le répertoire existe avec la permission |
| `module` | Nom du module | Acceptation si installé, erreur sinon |
| `module` | `[nom, 'warning']` | Acceptation si installé, avertissement sinon |

## Boutons d'éléments

Ajouter des boutons d'action aux pages d'administration:

```php
$admin = \Xmf\Module\Admin::getInstance();

// Ajouter des boutons
$admin->addItemButton('Add New Item', 'item.php?op=new', 'add');
$admin->addItemButton('Import Items', 'import.php', 'import');

// Afficher les boutons (alignés à gauche par défaut)
$admin->displayButton('left');

// Ou obtenir le HTML
$buttonHtml = $admin->renderButton('right', ' | ');
```

## Exemples complets de pages d'administration

### index.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Afficher la navigation
$adminObject->displayNavigation(basename(__FILE__));

// Ajouter une boîte d'information avec des statistiques
$adminObject->addInfoBox(_MI_MYMODULE_DASHBOARD);

$itemHandler = $helper->getHandler('items');
$itemCount = $itemHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_ITEMS, $itemCount));

$categoryHandler = $helper->getHandler('categories');
$categoryCount = $categoryHandler->getCount();
$adminObject->addInfoBoxLine(sprintf(_MI_MYMODULE_TOTAL_CATEGORIES, $categoryCount));

// Vérifier la configuration
$uploadDir = XOOPS_UPLOAD_PATH . '/mymodule';
$adminObject->addConfigBoxLine($uploadDir, 'folder');
$adminObject->addConfigBoxLine([$uploadDir, '0755'], 'chmod');

// Vérifier les modules optionnels
$adminObject->addConfigBoxLine(['xlanguage', 'warning'], 'module');

// Afficher la page d'index
$adminObject->displayIndex();

require_once __DIR__ . '/admin_footer.php';
```

### items.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

// Obtenir l'opération
$op = \Xmf\Request::getCmd('op', 'list');

switch ($op) {
    case 'list':
    default:
        $adminObject->displayNavigation(basename(__FILE__));

        // Ajouter des boutons d'action
        $adminObject->addItemButton(_MI_MYMODULE_ADD_ITEM, 'items.php?op=new', 'add');
        $adminObject->displayButton('left');

        // Lister les éléments
        $itemHandler = $helper->getHandler('items');
        $criteria = new CriteriaCompo();
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit(20);

        $items = $itemHandler->getObjects($criteria);

        // Afficher le tableau
        echo '<table class="outer">';
        echo '<tr><th>' . _MI_MYMODULE_TITLE . '</th><th>' . _MI_MYMODULE_ACTIONS . '</th></tr>';

        foreach ($items as $item) {
            $editUrl = 'items.php?op=edit&amp;id=' . $item->getVar('item_id');
            $deleteUrl = 'items.php?op=delete&amp;id=' . $item->getVar('item_id');

            echo '<tr>';
            echo '<td>' . $item->getVar('title') . '</td>';
            echo '<td>';
            echo '<a href="' . $editUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('edit.png', 16) . '" alt="Edit"></a> ';
            echo '<a href="' . $deleteUrl . '"><img src="' . \Xmf\Module\Admin::iconUrl('delete.png', 16) . '" alt="Delete"></a>';
            echo '</td>';
            echo '</tr>';
        }

        echo '</table>';
        break;

    case 'new':
    case 'edit':
        // Code de gestion de formulaire...
        break;
}

require_once __DIR__ . '/admin_footer.php';
```

### about.php

```php
<?php
require_once dirname(dirname(dirname(__DIR__))) . '/include/cp_header.php';
require_once dirname(__DIR__) . '/include/common.php';

$adminObject = \Xmf\Module\Admin::getInstance();

$adminObject->displayNavigation(basename(__FILE__));

// Définir l'ID PayPal pour les dons (optionnel)
\Xmf\Module\Admin::setPaypal('YOUR_PAYPAL_ID');

// Afficher la page À propos
// Passer false pour masquer le logo XOOPS, true pour l'afficher
$adminObject->displayAbout(false);

require_once __DIR__ . '/admin_footer.php';
```

### menu.php

```php
<?php
defined('XOOPS_ROOT_PATH') || exit('XOOPS root path not defined');

// Obtenir le chemin des icônes en utilisant XMF
$pathIcon32 = '';
if (class_exists('Xmf\Module\Admin', true)) {
    $pathIcon32 = \Xmf\Module\Admin::menuIconPath('');
}

$adminmenu = [];

// Tableau de bord
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => $pathIcon32 . 'home.png'
];

// Éléments
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ITEMS,
    'link'  => 'admin/items.php',
    'icon'  => $pathIcon32 . 'content.png'
];

// Catégories
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_CATEGORIES,
    'link'  => 'admin/categories.php',
    'icon'  => $pathIcon32 . 'category.png'
];

// Permissions
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_PERMISSIONS,
    'link'  => 'admin/permissions.php',
    'icon'  => $pathIcon32 . 'permissions.png'
];

// À propos
$adminmenu[] = [
    'title' => _MI_MYMODULE_ADMIN_ABOUT,
    'link'  => 'admin/about.php',
    'icon'  => $pathIcon32 . 'about.png'
];
```

## Référence API

### Méthodes statiques

| Méthode | Description |
|--------|-------------|
| `getInstance()` | Obtenir l'instance d'administration |
| `iconUrl($name, $size)` | Obtenir l'URL de l'icône (taille: 16 ou 32) |
| `menuIconPath($image)` | Obtenir le chemin de l'icône pour menu.php |
| `setPaypal($paypal)` | Définir l'ID PayPal pour la page À propos |

### Méthodes d'instance

| Méthode | Description |
|--------|-------------|
| `displayNavigation($menu)` | Afficher le menu de navigation |
| `renderNavigation($menu)` | Retourner le HTML de navigation |
| `addInfoBox($title)` | Ajouter une boîte d'information |
| `addInfoBoxLine($text, $type, $color)` | Ajouter une ligne à la boîte d'information |
| `displayInfoBox()` | Afficher la boîte d'information |
| `renderInfoBox()` | Retourner le HTML de la boîte d'information |
| `addConfigBoxLine($value, $type)` | Ajouter une ligne de vérification de configuration |
| `addConfigError($value)` | Ajouter une erreur à la boîte de configuration |
| `addConfigAccept($value)` | Ajouter un succès à la boîte de configuration |
| `addConfigWarning($value)` | Ajouter un avertissement à la boîte de configuration |
| `addConfigModuleVersion($moddir, $version)` | Vérifier la version du module |
| `addItemButton($title, $link, $icon, $extra)` | Ajouter un bouton d'action |
| `displayButton($position, $delimiter)` | Afficher les boutons |
| `renderButton($position, $delimiter)` | Retourner le HTML des boutons |
| `displayIndex()` | Afficher la page d'index |
| `renderIndex()` | Retourner le HTML de la page d'index |
| `displayAbout($logo_xoops)` | Afficher la page À propos |
| `renderAbout($logo_xoops)` | Retourner le HTML de la page À propos |

## Voir aussi

- ../Basics/XMF-Module-Helper - Classe d'aide du module
- Permission-Helper - Gestion des permissions
- ../XMF-Framework - Aperçu du framework

---

#xmf #admin #module-development #navigation #icons
