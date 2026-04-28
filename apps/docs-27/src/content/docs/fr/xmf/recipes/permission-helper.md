---
title: "Aide aux permissions"
description: "Gestion des permissions de groupe XOOPS avec l'assistant d'autorisation XMF"
---

XOOPS dispose d'un système de permission puissant et flexible basé sur l'appartenance au groupe utilisateur. L'assistant d'autorisation XMF simplifie le travail avec ces permissions, réduisant les vérifications de permission complexes à des appels de méthode unique.

## Aperçu

Le système de permission XOOPS associe les groupes à:
- ID du module
- Nom de la permission
- ID de l'élément

La vérification traditionnelle des permissions nécessite de trouver les groupes d'utilisateurs, de rechercher les IDs de module, et d'interroger les tables de permission. L'assistant d'autorisation XMF gère tout cela automatiquement.

## Démarrage

### Créer un assistant d'autorisation

```php
// Pour le module actuel
$permHelper = new \Xmf\Module\Helper\Permission();

// Pour un module spécifique
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');
```

L'assistant utilise automatiquement les groupes de l'utilisateur actuel et l'ID du module spécifié.

## Vérifier les permissions

### L'utilisateur dispose-t-il de la permission?

Vérifier si l'utilisateur actuel dispose d'une permission spécifique pour un élément:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Vérifier si l'utilisateur peut voir le sujet ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Afficher le sujet
} else {
    // Afficher le message d'accès refusé
}
```

### Vérifier avec redirection

Rediriger automatiquement les utilisateurs qui manquent de permission:

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Redirige vers index.php après 3 secondes en cas de pas de permission
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Le code ici s'exécute seulement si l'utilisateur a la permission
displayTopic($topicId);
```

### Substitution d'administrateur

Par défaut, les utilisateurs administrateurs ont toujours la permission. Pour vérifier même pour les administrateurs:

```php
// Vérification normale - les administrateurs ont toujours la permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Vérifier même pour les administrateurs (troisième paramètre = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Obtenir les IDs d'éléments autorisés

Récupérer tous les IDs d'éléments pour lesquels des groupes spécifiques ont la permission:

```php
// Obtenir les éléments que les groupes de l'utilisateur actuel peuvent voir
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Obtenir les éléments qu'un groupe spécifique peut voir
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Utiliser dans les requêtes
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Gestion des permissions

### Obtenir les groupes pour un élément

Trouver quels groupes ont une permission spécifique:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Obtenir les groupes qui peuvent voir le sujet 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Retourne: [1, 2, 5] (tableau d'IDs de groupe)
```

### Enregistrer les permissions

Accorder une permission à des groupes spécifiques:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Permettre aux groupes 1, 2 et 3 de voir le sujet 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Supprimer les permissions

Supprimer toutes les permissions pour un élément (généralement lors de la suppression de l'élément):

```php
$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = 42;

// Supprimer la permission de visualisation pour ce sujet
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Pour plusieurs types de permissions:

```php
// Supprimer plusieurs types de permissions à la fois
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Intégration de formulaire

### Ajouter la sélection de permission aux formulaires

L'assistant peut créer un élément de formulaire pour sélectionner des groupes:

```php
$permHelper = new \Xmf\Module\Helper\Permission();

// Créer votre formulaire
$form = new XoopsThemeForm('Edit Topic', 'topicform', 'save.php');

// Ajouter le champ de titre, etc.
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Ajouter le sélecteur de permission
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Nom de la permission
        $topicId,                              // ID de l'élément
        'Groups with View Topic Permission'   // Légende
    )
);

$form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));
```

### Options d'élément de formulaire

La signature complète de la méthode:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Nom de la permission
    $gperm_itemid,    // ID de l'élément
    $caption,         // Légende de l'élément de formulaire
    $name,            // Nom de l'élément (généré automatiquement si vide)
    $include_anon,    // Inclure le groupe anonyme (défaut: false)
    $size,            // Nombre de lignes visibles (défaut: 5)
    $multiple         // Permettre la sélection multiple (défaut: true)
)
```

### Traitement de la soumission du formulaire

```php
use Xmf\Request;

$permHelper = new \Xmf\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Obtenir le nom du champ généré automatiquement
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Obtenir les groupes sélectionnés du formulaire
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Enregistrer les permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Nom de champ par défaut

L'assistant génère des noms de champ cohérents:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Retourne quelque chose comme: 'mymodule_viewtopic_42'
```

## Exemple complet: Éléments protégés par permission

### Créer un élément avec permissions

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Enregistrer les données d'élément
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
        }

        $item->setVar('title', Request::getString('title', ''));
        $item->setVar('content', Request::getText('content', ''));

        if ($handler->insert($item)) {
            $newId = $item->getVar('item_id');

            // Enregistrer la permission de visualisation
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Enregistrer la permission de modification
            $editFieldName = $permHelper->defaultFieldName('edit', $newId);
            $editGroups = Request::getArray($editFieldName, [], 'POST');
            $permHelper->savePermissionForItem('edit', $newId, $editGroups);

            redirect_header('index.php', 2, 'Item saved');
        }
        break;

    case 'form':
    default:
        $handler = $helper->getHandler('items');

        if ($itemId > 0) {
            $item = $handler->get($itemId);
        } else {
            $item = $handler->create();
            $itemId = 0;
        }

        $form = new XoopsThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XoopsFormHidden('op', 'save'));
        $form->addElement(new XoopsFormHidden('id', $itemId));

        $form->addElement(new XoopsFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XoopsFormTextArea('Content', 'content', $item->getVar('content')));

        // Sélecteur de permission de visualisation
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Sélecteur de permission de modification
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XoopsFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Affichage avec vérification de permission

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Vérifier la permission de visualisation - redirection si refusée
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// L'utilisateur a la permission, afficher l'élément
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Afficher le bouton de modification seulement si l'utilisateur a la permission de modification
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Suppression avec nettoyage des permissions

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Supprimer l'élément
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Nettoyer toutes les permissions pour cet élément
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## Référence API

| Méthode | Description |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Vérifier si l'utilisateur a la permission |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Vérifier et rediriger si refusé |
| `getItemIds($name, $groupIds)` | Obtenir les IDs d'éléments que les groupes peuvent accéder |
| `getGroupsForItem($name, $itemId)` | Obtenir les groupes avec permission |
| `savePermissionForItem($name, $itemId, $groups)` | Enregistrer les permissions |
| `deletePermissionForItem($name, $itemId)` | Supprimer les permissions |
| `getGroupSelectFormForItem(...)` | Créer un élément de sélection de formulaire |
| `defaultFieldName($name, $itemId)` | Obtenir le nom du champ de formulaire par défaut |

## Voir aussi

- ../Basics/XMF-Module-Helper - Documentation de l'assistant de module
- Module-Admin-Pages - Création d'interface d'administration
- ../Basics/Getting-Started-with-XMF - Bases de XMF

---

#xmf #permissions #security #groups #forms
