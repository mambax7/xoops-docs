---
title: "xoops_version.php - Module Manifest"
---

## Επισκόπηση

Το αρχείο `xoops_version.php` είναι η καρδιά κάθε ενότητας XOOPS. Ορίζει μεταδεδομένα λειτουργιών, πίνακες βάσεων δεδομένων, πρότυπα, μπλοκ, επιλογές διαμόρφωσης και άγκιστρα εγκατάστασης.

## Βασική Δομή

```php
<?php
/**
 * Module manifest file
 */

$modversion = [
    // Module identity
    'name'           => _MI_MYMODULE_NAME,
    'version'        => '1.0.0',
    'description'    => _MI_MYMODULE_DESC,
    'author'         => 'Your Name',
    'author_mail'    => 'your@email.com',
    'author_website' => 'https://yoursite.com',
    'credits'        => 'Contributors',
    'license'        => 'GPL 2.0 or later',
    'license_url'    => 'https://www.gnu.org/licenses/gpl-2.0.html',
    'dirname'        => basename(__DIR__),

    // Images
    'image'          => 'assets/images/logo.png',
    'modicons16'     => 'assets/images/icons/16',
    'modicons32'     => 'assets/images/icons/32',

    // System settings
    'system_menu'    => 1,
    'hasAdmin'       => 1,
    'adminindex'     => 'admin/index.php',
    'adminmenu'      => 'admin/menu.php',
    'hasMain'        => 1,
    'hasSearch'      => 1,
    'hasComments'    => 0,
    'hasNotification'=> 0,
];
```

## Πλήρης αναφορά

## # Ταυτότητα ενότητας

| Κλειδί | Τύπος | Περιγραφή |
|-----|------|-------------|
| `name` | χορδή | Εμφανιζόμενο όνομα (χρήση σταθερά γλώσσας) |
| `version` | χορδή | Σημασιολογική έκδοση (MAJOR.MINOR.PATCH) |
| `description` | χορδή | Περιγραφή ενότητας |
| `author` | χορδή | Όνομα κύριου συγγραφέα |
| `credits` | χορδή | Πρόσθετοι συντελεστές |
| `license` | χορδή | Όνομα άδειας |
| `dirname` | χορδή | Όνομα καταλόγου μονάδας |

## # Πίνακες βάσεων δεδομένων

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';

$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_comments',
];
```

## # Πρότυπα

```php
$modversion['templates'] = [
    ['file' => 'mymodule_index.tpl', 'description' => 'Index page template'],
    ['file' => 'mymodule_item.tpl', 'description' => 'Single item view'],
    ['file' => 'mymodule_category.tpl', 'description' => 'Category listing'],
];
```

## # Μπλοκ

```php
$modversion['blocks'][] = [
    'file'        => 'blocks/recent.php',
    'name'        => _MI_MYMODULE_BLOCK_RECENT,
    'description' => _MI_MYMODULE_BLOCK_RECENT_DESC,
    'show_func'   => 'mymodule_recent_show',
    'edit_func'   => 'mymodule_recent_edit',
    'template'    => 'mymodule_block_recent.tpl',
    'options'     => '10|0',  // default options
    'can_clone'   => true,
];
```

## # Επιλογές διαμόρφωσης

```php
$modversion['config'][] = [
    'name'        => 'items_per_page',
    'title'       => '_MI_MYMODULE_ITEMS_PER_PAGE',
    'description' => '_MI_MYMODULE_ITEMS_PER_PAGE_DESC',
    'formtype'    => 'textbox',
    'valuetype'   => 'int',
    'default'     => 10,
];

$modversion['config'][] = [
    'name'        => 'enable_comments',
    'title'       => '_MI_MYMODULE_ENABLE_COMMENTS',
    'description' => '',
    'formtype'    => 'yesno',
    'valuetype'   => 'int',
    'default'     => 1,
];

$modversion['config'][] = [
    'name'        => 'display_mode',
    'title'       => '_MI_MYMODULE_DISPLAY_MODE',
    'description' => '',
    'formtype'    => 'select',
    'valuetype'   => 'text',
    'default'     => 'list',
    'options'     => [
        _MI_MYMODULE_MODE_LIST => 'list',
        _MI_MYMODULE_MODE_GRID => 'grid',
    ],
];
```

## # Τύποι φόρμας

| τύπος μορφής | τύπος τιμής | Περιγραφή |
|----------|-----------|-------------|
| `textbox ` | ` text `/` int` | Είσοδος μονής γραμμής |
| `textarea ` | ` text` | Είσοδος πολλαπλών γραμμών |
| `yesno ` | ` int` | Yes/No ραδιόφωνο |
| `select ` | ` text` | Αναπτυσσόμενη επιλογή |
| `select_multi ` | ` array` | Πολλαπλή επιλογή |
| `group ` | ` int` | Επιλογέας ομάδας |
| `group_multi ` | ` array` | Επιλογέας πολλαπλών ομάδων |
| `user ` | ` int` | Επιλογέας χρήστη |
| `color ` | ` text` | Επιλογέας χρώματος |
| `hidden ` | ` text` | Κρυφό πεδίο |

## # Στοιχεία μενού

```php
// Main menu
$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_INDEX,
    'url'  => 'index.php',
];

$modversion['sub'][] = [
    'name' => _MI_MYMODULE_SMENU_SUBMIT,
    'url'  => 'submit.php',
];
```

## # Άγκιστρα εγκατάστασης

```php
$modversion['onInstall'] = 'include/oninstall.php';
$modversion['onUpdate']  = 'include/onupdate.php';
$modversion['onUninstall'] = 'include/onuninstall.php';
```

## # Ενσωμάτωση αναζήτησης

```php
$modversion['hasSearch'] = 1;
$modversion['search'] = [
    'file' => 'include/search.php',
    'func' => 'mymodule_search',
];
```

## # Ενσωμάτωση σχολίων

```php
$modversion['hasComments'] = 1;
$modversion['comments'] = [
    'itemName' => 'item_id',
    'pageName' => 'item.php',
];
```

## # Ειδοποιήσεις

```php
$modversion['hasNotification'] = 1;
$modversion['notification'] = [
    'lookup_file' => 'include/notification.php',
    'lookup_func' => 'mymodule_notify_iteminfo',
    'category' => [
        [
            'name'           => 'global',
            'title'          => _MI_MYMODULE_NOTIFY_GLOBAL,
            'description'    => '',
            'subscribe_from' => 'index.php',
        ],
        [
            'name'           => 'item',
            'title'          => _MI_MYMODULE_NOTIFY_ITEM,
            'description'    => '',
            'subscribe_from' => 'item.php',
            'item_name'      => 'item_id',
        ],
    ],
    'event' => [
        [
            'name'          => 'new_item',
            'category'      => 'global',
            'title'         => _MI_MYMODULE_NOTIFY_NEW_ITEM,
            'caption'       => _MI_MYMODULE_NOTIFY_NEW_ITEM_CAP,
            'mail_template' => 'notify_newitem',
            'mail_subject'  => _MI_MYMODULE_NOTIFY_NEW_ITEM_SUBJ,
        ],
    ],
];
```

## Σχετική τεκμηρίωση

- Module-Development - Πλήρης οδηγός ενότητας
- Ενότητα-Δομή - Δομή καταλόγου
- Block-Development - Δημιουργία μπλοκ
- Βάση δεδομένων-Λειτουργίες - Ρύθμιση βάσης δεδομένων
