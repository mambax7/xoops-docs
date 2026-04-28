---
title: "Module Hello World"
description: "Tutoriel étape par étape pour créer votre premier module XOOPS"
---

# Tutoriel du module Hello World

Ce tutoriel vous guide dans la création de votre premier module XOOPS. À la fin, vous aurez un module fonctionnant qui affiche "Hello World" sur le frontend et l'admin.

## Prérequis

- XOOPS 2.5.x installé et en cours d'exécution
- PHP 8.0 ou supérieur
- Connaissances PHP de base
- Éditeur de texte ou IDE (PhpStorm recommandé)

## Étape 1 : Créer la structure des répertoires

Créez la structure de répertoires suivante dans `/modules/helloworld/` :

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Étape 2 : Créer la définition du module

Créez `xoops_version.php` :

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## Étape 3 : Créer les fichiers de langue

### modinfo.php (Informations sur le module)

Créez `language/english/modinfo.php` :

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (Langue Frontend)

Créez `language/english/main.php` :

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (Langue Admin)

Créez `language/english/admin.php` :

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## Étape 4 : Créer l'index Frontend

Créez `index.php` dans la racine du module :

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## Étape 5 : Créer le modèle Frontend

Créez `templates/helloworld_index.tpl` :

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## Étape 6 : Créer les fichiers Admin

### En-tête Admin

Créez `admin/admin_header.php` :

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### Pied de page Admin

Créez `admin/admin_footer.php` :

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### Menu Admin

Créez `admin/menu.php` :

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### Page index Admin

Créez `admin/index.php` :

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## Étape 7 : Créer le modèle Admin

Créez `templates/admin/helloworld_admin_index.tpl` :

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## Étape 8 : Créer le logo du module

Créez ou copiez une image PNG (taille recommandée : 92x92 pixels) vers :
`assets/images/logo.png`

Vous pouvez utiliser n'importe quel éditeur d'images pour créer un logo simple, ou utiliser un espace réservé d'un site comme placeholder.com.

## Étape 9 : Installer le module

1. Connectez-vous à votre site XOOPS en tant qu'administrateur
2. Allez à **System Admin** > **Modules**
3. Trouvez "Hello World" dans la liste des modules disponibles
4. Cliquez sur le bouton **Install**
5. Confirmez l'installation

## Étape 10 : Tester votre module

### Test Frontend

1. Accédez à votre site XOOPS
2. Cliquez sur "Hello World" dans le menu principal
3. Vous devriez voir le message de bienvenue et l'heure actuelle

### Test Admin

1. Allez à la zone admin
2. Cliquez sur "Hello World" dans le menu admin
3. Vous devriez voir le tableau de bord admin

## Dépannage

### Le module n'apparaît pas dans la liste d'installation

- Vérifiez les permissions de fichiers (755 pour les répertoires, 644 pour les fichiers)
- Vérifiez que `xoops_version.php` n'a pas d'erreurs de syntaxe
- Videz le cache XOOPS

### Le modèle ne se charge pas

- Assurez-vous que les fichiers de modèle sont dans le bon répertoire
- Vérifiez que les noms de fichiers de modèle correspondent à ceux de `xoops_version.php`
- Vérifiez que la syntaxe Smarty est correcte

### Les chaînes de langue ne s'affichent pas

- Vérifiez les chemins de fichiers de langue
- Assurez-vous que les constantes de langue sont définies
- Vérifiez que le dossier de langue correct existe

## Prochaines étapes

Maintenant que vous avez un module fonctionnant, continuez à apprendre avec :

- Building-a-CRUD-Module - Ajouter la fonctionnalité de base de données
- ../Patterns/MVC-Pattern - Organiser votre code correctement
- ../Best-Practices/Testing - Ajouter des tests PHPUnit

## Référence complète des fichiers

Votre module complet devrait avoir ces fichiers :

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## Résumé

Félicitations ! Vous avez créé votre premier module XOOPS. Concepts clés couverts :

1. **Structure du module** - Disposition standard du répertoire du module XOOPS
2. **xoops_version.php** - Définition et configuration du module
3. **Fichiers de langue** - Support de l'internationalisation
4. **Modèles** - Intégration de modèles Smarty
5. **Interface Admin** - Panneau admin de base

Voir aussi : ../Module-Development | Building-a-CRUD-Module | ../Patterns/MVC-Pattern
