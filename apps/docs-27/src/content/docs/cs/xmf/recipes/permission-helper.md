---
title: "Pomocník pro povolení"
description: "Správa oprávnění skupiny XOOPS pomocí pomocníka pro oprávnění XMF"
---

XOOPS má výkonný a flexibilní systém oprávnění založený na členství ve skupině uživatelů. XMF Permission Helper zjednodušuje práci s těmito oprávněními a omezuje složité kontroly oprávnění na volání jedné metody.

## Přehled

Systém oprávnění XOOPS sdružuje skupiny s:
- ID modulu
- Název oprávnění
- ID položky

Kontrola oprávnění tradičně vyžaduje nalezení skupin uživatelů, vyhledání ID modulů a dotazování na tabulky oprávnění. XMF Permission Helper toto vše zvládá automaticky.

## Začínáme

### Vytvoření pomocníka pro oprávnění

```php
// For the current module
$permHelper = new \XMF\Module\Helper\Permission();

// For a specific module
$permHelper = new \XMF\Module\Helper\Permission('mymodule');
```

Pomocník automaticky používá skupiny aktuálního uživatele a zadané ID modulu.

## Kontrola oprávnění

### Má uživatel oprávnění?

Zkontrolujte, zda má aktuální uživatel konkrétní oprávnění pro položku:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Check if user can view topic ID 42
$canView = $permHelper->checkPermission('viewtopic', 42);

if ($canView) {
    // Display the topic
} else {
    // Show access denied message
}
```

### Zkontrolujte pomocí přesměrování

Automaticky přesměrovat uživatele, kteří nemají oprávnění:

```php
$permHelper = new \XMF\Module\Helper\Permission();
$topicId = 42;

// Redirects to index.php after 3 seconds if no permission
$permHelper->checkPermissionRedirect(
    'viewtopic',
    $topicId,
    'index.php',
    3,
    'You are not allowed to view that topic'
);

// Code here only runs if user has permission
displayTopic($topicId);
```

### Přepsání správcem

Ve výchozím nastavení mají správci vždy oprávnění. Pro kontrolu i pro administrátory:

```php
// Normal check - admins always have permission
$hasPermission = $permHelper->checkPermission('viewtopic', $id);

// Check even for admins (third parameter = false)
$hasPermission = $permHelper->checkPermission('viewtopic', $id, false);
```

### Získejte ID povolených položek

Načíst všechna ID položek, ke kterým mají konkrétní skupiny oprávnění:

```php
// Get items the current user's groups can view
$viewableIds = $permHelper->getItemIds('viewtopic', $GLOBALS['xoopsUser']->getGroups());

// Get items a specific group can view
$viewableIds = $permHelper->getItemIds('viewtopic', [XOOPS_GROUP_USERS]);

// Use in queries
$criteria = new Criteria('topic_id', '(' . implode(',', $viewableIds) . ')', 'IN');
```

## Správa oprávnění

### Získejte skupiny pro položku

Zjistěte, které skupiny mají konkrétní oprávnění:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Get groups that can view topic 42
$groups = $permHelper->getGroupsForItem('viewtopic', 42);
// Returns: [1, 2, 5](array of group IDs)
```

### Uložit oprávnění

Udělit oprávnění konkrétním skupinám:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Allow groups 1, 2, and 3 to view topic 42
$groups = [1, 2, 3];
$permHelper->savePermissionForItem('viewtopic', 42, $groups);
```

### Smazat oprávnění

Odebrat všechna oprávnění pro položku (obvykle při mazání položky):

```php
$permHelper = new \XMF\Module\Helper\Permission();
$topicId = 42;

// Delete view permission for this topic
$permHelper->deletePermissionForItem('viewtopic', $topicId);
```

Pro více typů oprávnění:

```php
// Delete multiple permission types at once
$permissionNames = ['viewtopic', 'posttopic', 'edittopic'];
$permHelper->deletePermissionForItem($permissionNames, $topicId);
```

## Integrace formuláře

### Přidání výběru oprávnění do formulářů

Pomocník může vytvořit formulářový prvek pro výběr skupin:

```php
$permHelper = new \XMF\Module\Helper\Permission();

// Build your form
$form = new XOOPSThemeForm('Edit Topic', 'topicform', 'save.php');

// Add title field, etc.
$form->addElement(new XOOPSFormText('Title', 'title', 50, 255, $topic->getVar('title')));

// Add permission selector
$form->addElement(
    $permHelper->getGroupSelectFormForItem(
        'viewtopic',                           // Permission name
        $topicId,                              // Item ID
        'Groups with View Topic Permission'   // Caption
    )
);

$form->addElement(new XOOPSFormButton('', 'submit', 'Save', 'submit'));
```

### Možnosti prvku formuláře

Úplný podpis metody:

```php
getGroupSelectFormForItem(
    $gperm_name,      // Permission name
    $gperm_itemid,    // Item ID
    $caption,         // Form element caption
    $name,            // Element name (auto-generated if empty)
    $include_anon,    // Include anonymous group (default: false)
    $size,            // Number of visible rows (default: 5)
    $multiple         // Allow multiple selection (default: true)
)
```

### Zpracování odeslání formuláře

```php
use XMF\Request;

$permHelper = new \XMF\Module\Helper\Permission();
$topicId = Request::getInt('topic_id', 0);

// Get the auto-generated field name
$fieldName = $permHelper->defaultFieldName('viewtopic', $topicId);

// Get selected groups from form
$selectedGroups = Request::getArray($fieldName, [], 'POST');

// Save the permissions
$permHelper->savePermissionForItem('viewtopic', $topicId, $selectedGroups);
```

### Výchozí název pole

Pomocník generuje konzistentní názvy polí:

```php
$fieldName = $permHelper->defaultFieldName('viewtopic', 42);
// Returns something like: 'mymodule_viewtopic_42'
```

## Úplný příklad: Položky chráněné oprávněním

### Vytvoření položky s oprávněními

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';
require_once XOOPS_ROOT_PATH . '/header.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$op = Request::getCmd('op', 'form');
$itemId = Request::getInt('id', 0);

switch ($op) {
    case 'save':
        // Save item data
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

            // Save view permission
            $viewFieldName = $permHelper->defaultFieldName('view', $newId);
            $viewGroups = Request::getArray($viewFieldName, [], 'POST');
            $permHelper->savePermissionForItem('view', $newId, $viewGroups);

            // Save edit permission
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

        $form = new XOOPSThemeForm('Edit Item', 'itemform', 'edit.php');
        $form->addElement(new XOOPSFormHidden('op', 'save'));
        $form->addElement(new XOOPSFormHidden('id', $itemId));

        $form->addElement(new XOOPSFormText('Title', 'title', 50, 255, $item->getVar('title')));
        $form->addElement(new XOOPSFormTextArea('Content', 'content', $item->getVar('content')));

        // View permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('view', $itemId, 'Groups that can view')
        );

        // Edit permission selector
        $form->addElement(
            $permHelper->getGroupSelectFormForItem('edit', $itemId, 'Groups that can edit')
        );

        $form->addElement(new XOOPSFormButton('', 'submit', 'Save', 'submit'));

        $form->display();
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Zobrazení s kontrolou oprávnění

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Check view permission - redirects if denied
$permHelper->checkPermissionRedirect(
    'view',
    $itemId,
    'index.php',
    3,
    'You do not have permission to view this item'
);

require_once XOOPS_ROOT_PATH . '/header.php';

// User has permission, display the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

$xoopsTpl->assign('item', $item->toArray());

// Show edit button only if user has edit permission
if ($permHelper->checkPermission('edit', $itemId)) {
    $xoopsTpl->assign('can_edit', true);
    $xoopsTpl->assign('edit_url', $helper->url('edit.php?id=' . $itemId));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

### Mazání s vyčištěním oprávnění

```php
<?php
use XMF\Request;
use XMF\Module\Helper;
use XMF\Module\Helper\Permission;

$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');

$itemId = Request::getInt('id', 0);

// Delete the item
$handler = $helper->getHandler('items');
$item = $handler->get($itemId);

if ($item && $handler->delete($item)) {
    // Clean up all permissions for this item
    $permissionNames = ['view', 'edit', 'delete'];
    $permHelper->deletePermissionForItem($permissionNames, $itemId);

    redirect_header('index.php', 2, 'Item deleted');
}
```

## Reference API

| Metoda | Popis |
|--------|-------------|
| `checkPermission($name, $itemId, $trueIfAdmin)` | Zkontrolujte, zda má uživatel oprávnění |
| `checkPermissionRedirect($name, $itemId, $url, $time, $message, $trueIfAdmin)` | Zkontrolujte a v případě zamítnutí přesměrujte |
| `getItemIds($name, $groupIds)` | Získat ID položek, ke kterým mají přístup skupiny |
| `getGroupsForItem($name, $itemId)` | Získejte skupiny s povolením |
| `savePermissionForItem($name, $itemId, $groups)` | Uložit oprávnění |
| `deletePermissionForItem($name, $itemId)` | Smazat oprávnění |
| `getGroupSelectFormForItem(...)` | Vytvořit formulář vybrat prvek |
| `defaultFieldName($name, $itemId)` | Získat výchozí název pole formuláře |

## Viz také

- ../Basics/XMF-Module-Helper - Dokumentace pomocníka modulu
- Module-Admin-Pages - Vytvoření administrátorského rozhraní
- ../Basics/Getting-Started-with-XMF - XMF základy

---

#xmf #oprávnění #zabezpečení #skupiny #formuláře