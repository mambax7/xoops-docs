---
title: "Assistant du module XMF"
description: "Opérations simplifiées du module utilisant la classe Xmf\\Module\\Helper et assistants connexes"
---

La classe `Xmf\Module\Helper` fournit un moyen facile d'accéder aux informations relatives aux modules, aux configurations, aux gestionnaires, etc. L'utilisation de l'assistant du module simplifie votre code et réduit le passe-partout.

## Aperçu

L'assistant du module fournit:

- Accès à la configuration simplifié
- Récupération d'objet de module
- Instanciation du gestionnaire
- Résolution des chemins et des URL
- Assistants des permissions et des sessions
- Gestion du cache

## Obtenir un assistant de module

### Utilisation de base

```php
use Xmf\Module\Helper;

// Obtenir l'assistant pour un module spécifique
$helper = Helper::getHelper('mymodule');

// L'assistant est automatiquement associé au répertoire du module
```

### À partir du module actuel

Si vous ne spécifiez pas de nom de module, il utilise le module actuellement actif:

```php
$helper = Helper::getHelper('');
// ou
$helper = Helper::getHelper(basename(__DIR__));
```

## Accès à la configuration

### Façon XOOPS traditionnelle

Obtenir la configuration du module de l'ancienne façon est verbeux:

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "La valeur de 'foo' est: " . $value;
```

### Façon XMF

Avec l'assistant du module, la même tâche devient simple:

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "La valeur de 'foo' est: " . $helper->getConfig('foo', 'default');
```

## Méthodes d'aide

### getModule()

Retourne l'objet XoopsModule de l'assistant.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

Retourne une valeur de configuration du module ou toutes les configurations.

```php
// Obtenir une seule config avec la valeur par défaut
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Obtenir toutes les configs sous forme de tableau
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

Retourne un gestionnaire d'objets pour le module.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Utiliser le gestionnaire
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### loadLanguage($name)

Charge un fichier de langue pour le module.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

Vérifie si ce module est le module actuellement actif.

```php
if ($helper->isCurrentModule()) {
    // Nous sommes dans les pages du module
} else {
    // Appelé à partir d'un autre module ou emplacement
}
```

### isUserAdmin()

Vérifie si l'utilisateur actuel dispose des droits d'administration pour ce module.

```php
if ($helper->isUserAdmin()) {
    // Afficher les options d'administration
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## Méthodes des chemins et des URL

### url($url)

Retourne une URL absolue pour un chemin relatif au module.

```php
$logoUrl = $helper->url('images/logo.png');
// Retourne: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Retourne: https://example.com/modules/mymodule/admin/index.php
```

### path($path)

Retourne un chemin d'accès au système de fichiers absolu pour un chemin relatif au module.

```php
$templatePath = $helper->path('templates/view.tpl');
// Retourne: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### uploadUrl($url)

Retourne une URL absolue pour les fichiers de téléchargement du module.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### uploadPath($path)

Retourne un chemin du système de fichiers absolu pour les fichiers de téléchargement du module.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### redirect($url, $time, $message)

Redirige dans le module vers une URL relative au module.

```php
$helper->redirect('index.php', 3, 'Élément enregistré avec succès');
$helper->redirect('view.php?id=' . $newId, 2, 'Créé!');
```

## Support de débogage

### setDebug($bool)

Activer ou désactiver le mode de débogage pour l'assistant.

```php
$helper->setDebug(true);  // Activer
$helper->setDebug(false); // Désactiver
$helper->setDebug();      // Activer (valeur par défaut est true)
```

### addLog($log)

Ajouter un message au journal du module.

```php
$helper->addLog('Traitement de l\'élément ID: ' . $id);
$helper->addLog('Cache miss, chargement depuis la base de données');
```

## Classes d'aide connexes

XMF fournit des assistants spécialisés qui étendent `Xmf\Module\Helper\AbstractHelper`:

### Assistant des permissions

Voir ../Recipes/Permission-Helper pour la documentation détaillée.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Vérifier la permission
if ($permHelper->checkPermission('view', $itemId)) {
    // L'utilisateur a la permission
}

// Vérifier et rediriger si pas de permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Accès refusé');
```

### Assistant de session

Stockage de session compatible avec les modules avec préfixage automatique des clés.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Valeur du magasin
$session->set('last_viewed', $itemId);

// Valeur de récupération
$lastViewed = $session->get('last_viewed', 0);

// Supprimer la valeur
$session->del('last_viewed');

// Effacer toutes les données de session du module
$session->destroy();
```

### Assistant de cache

Mise en cache compatible avec les modules avec préfixage automatique des clés.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Écrire en cache (TTL en secondes)
$cache->write('item_' . $id, $itemData, 3600);

// Lire du cache
$data = $cache->read('item_' . $id, null);

// Supprimer du cache
$cache->delete('item_' . $id);

// Lire avec régénération automatique
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // Cela s'exécute uniquement si cache miss
        return computeExpensiveData();
    },
    3600
);
```

## Exemple complet

Voici un exemple complet utilisant l'assistant du module:

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialiser les assistants
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Charger la langue
$helper->loadLanguage('main');

// Obtenir la configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Gérer la demande
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Vérifier la permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Piste dans la session
        $session->set('last_viewed', $id);

        // Obtenir l'article
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Élément non trouvé');
        }

        // Afficher l'élément
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Afficher le dernier consulté s'il existe
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Lien d'administration si autorisé
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Classe de base AbstractHelper

Toutes les classes d'aide XMF étendent `Xmf\Module\Helper\AbstractHelper`, qui fournit:

### Constructeur

```php
public function __construct($dirname)
```

Instancie avec un nom de répertoire de module. Si vide, utilise le module actuel.

### dirname()

Retourne le nom du répertoire du module associé à l'assistant.

```php
$dirname = $helper->dirname();
```

### init()

Appelé par le constructeur après le chargement du module. Remplacer dans des assistants personnalisés pour la logique d'initialisation.

## Créer des assistants personnalisés

Vous pouvez étendre l'assistant pour la fonctionnalité spécifique au module:

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Initialisation personnalisée
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## Voir aussi

- Getting-Started-with-XMF - Utilisation de base de XMF
- XMF-Request - Traitement des demandes
- ../Recipes/Permission-Helper - Gestion des permissions
- ../Recipes/Module-Admin-Pages - Création d'interfaces d'administration

---

#xmf #module-helper #configuration #handlers #session #cache
