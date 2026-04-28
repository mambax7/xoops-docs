---
title: "Démarrage avec XMF"
description: "Installation, concepts de base et premiers pas avec le XOOPS Module Framework"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Ce guide couvre les concepts fondamentaux du XOOPS Module Framework (XMF) et comment l'utiliser dans vos modules.

## Conditions préalables

- XOOPS 2.5.8 ou ultérieur installé
- PHP 7.2 ou ultérieur
- Compréhension de base de la programmation orientée objet PHP

## Comprendre les espaces de noms

XMF utilise les espaces de noms PHP pour organiser ses classes et éviter les conflits de noms. Toutes les classes XMF sont dans l'espace de noms `Xmf`.

### Problème de l'espace global

Sans espaces de noms, toutes les classes PHP partagent un espace global. Cela peut causer des conflits:

```php
<?php
// Cela entrerait en conflit avec ArrayObject intégré de PHP
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Erreur fatale: Impossible de redéclarer la classe ArrayObject
```

### Solution des espaces de noms

Les espaces de noms créent des contextes de nommage isolés:

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Pas de conflit - c'est \MyNamespace\ArrayObject
```

### Utiliser les espaces de noms XMF

Vous pouvez référencer les classes XMF de plusieurs façons:

**Chemin complet de l'espace de noms:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**Avec une instruction use:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**Importations multiples:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## Autoloading

L'une des plus grandes commodités de XMF est le chargement automatique des classes. Vous n'aurez jamais besoin d'inclure manuellement les fichiers de classe XMF.

### Chargement traditionnel de XOOPS

L'ancienne façon nécessitait un chargement explicite:

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### Autoloading de XMF

Avec XMF, les classes se chargent automatiquement lorsqu'elles sont référencées:

```php
$input = Xmf\Request::getString('input', '');
```

Ou avec une instruction use:

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

L'autoloader suit la norme [PSR-4](http://www.php-fig.org/psr/psr-4/) et gère également les dépendances sur lesquelles XMF s'appuie.

## Exemples d'utilisation de base

### Lire l'entrée de la requête

```php
use Xmf\Request;

// Obtenir une valeur entière avec la valeur par défaut 0
$id = Request::getInt('id', 0);

// Obtenir une valeur de chaîne avec la chaîne vide par défaut
$title = Request::getString('title', '');

// Obtenir une commande (alphanumérique, minuscule)
$op = Request::getCmd('op', 'list');

// Obtenir un email avec validation
$email = Request::getEmail('email', '');

// Obtenir à partir d'une table spécifique (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### Utiliser l'assistant du module

```php
use Xmf\Module\Helper;

// Obtenir l'assistant pour votre module
$helper = Helper::getHelper('mymodule');

// Lire la configuration du module
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Accéder à l'objet du module
$module = $helper->getModule();
$version = $module->getVar('version');

// Obtenir un gestionnaire
$itemHandler = $helper->getHandler('items');

// Charger un fichier de langue
$helper->loadLanguage('admin');

// Vérifier le module actuel
if ($helper->isCurrentModule()) {
    // Nous sommes dans ce module
}

// Vérifier les droits d'administration
if ($helper->isUserAdmin()) {
    // L'utilisateur a accès à l'administration
}
```

### Assistants des chemins et des URL

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Obtenir l'URL du module
$moduleUrl = $helper->url('images/logo.png');
// Retourne: https://example.com/modules/mymodule/images/logo.png

// Obtenir le chemin du module
$modulePath = $helper->path('templates/view.tpl');
// Retourne: /var/www/html/modules/mymodule/templates/view.tpl

// Chemins de téléchargement
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## Débogage avec XMF

XMF fournit des outils de débogage utiles:

```php
// Vider une variable avec un formatage agréable
\Xmf\Debug::dump($myVariable);

// Vidanger plusieurs variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Vider les données POST
\Xmf\Debug::dump($_POST);

// Afficher une trace de pile
\Xmf\Debug::backtrace();
```

La sortie de débogage est réductible et affiche les objets et les tableaux dans un format facile à lire.

## Recommandation de structure de projet

Lors de la création de modules basés sur XMF, organisez votre code:

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Gestionnaire personnalisé optionnel
    ItemHandler.php     # Vos gestionnaires
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## Modèle d'inclusion courant

Un point d'entrée typique du module:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Obtenir l'opération de la demande
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Inclure l'en-tête XOOPS
require_once XOOPS_ROOT_PATH . '/header.php';

// Votre logique de module ici
switch ($op) {
    case 'view':
        // Gérer l'affichage
        break;
    case 'list':
    default:
        // Gérer la liste
        break;
}

// Inclure le pied de page XOOPS
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## Prochaines étapes

Maintenant que vous comprenez les bases, explorez:

- XMF-Request - Documentation complète du traitement des demandes
- XMF-Module-Helper - Référence complète de l'assistant de module
- ../Recipes/Permission-Helper - Gestion des permissions des utilisateurs
- ../Recipes/Module-Admin-Pages - Construction d'interfaces d'administration

## Voir aussi

- ../XMF-Framework - Vue d'ensemble du framework
- ../Reference/JWT - Support des jetons Web JSON
- ../Reference/Database - Utilitaires de base de données

---

#xmf #getting-started #namespaces #autoloading #basics
