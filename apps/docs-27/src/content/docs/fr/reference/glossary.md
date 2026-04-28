---
title: "Glossaire XOOPS"
description: "Définitions des termes et concepts spécifiques à XOOPS"
---

> Glossaire complet de la terminologie et des concepts spécifiques à XOOPS.

---

## A

### Admin Framework
Framework d'interface administrative standardisé introduit dans XOOPS 2.3, fournissant des pages d'administration cohérentes dans tous les modules.

### Autoloading
Le chargement automatique des classes PHP lorsqu'elles sont nécessaires, utilisant la norme PSR-4 dans XOOPS moderne.

---

## B

### Block
Unité de contenu auto-contenue qui peut être positionnée dans les régions de thème. Les blocs peuvent afficher le contenu du module, du HTML personnalisé ou des données dynamiques.

```php
// Définition de bloc
$modversion['blocks'][] = [
    'file'      => 'myblock.php',
    'name'      => 'My Block',
    'show_func' => 'mymodule_block_show'
];
```

### Bootstrap
Le processus d'initialisation du noyau XOOPS avant d'exécuter le code du module, généralement via `mainfile.php` et `header.php`.

---

## C

### Criteria / CriteriaCompo
Classes pour construire les conditions de requête de base de données de manière orientée objet.

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
```

### CSRF (Cross-Site Request Forgery)
Une attaque de sécurité prévenue dans XOOPS en utilisant les jetons de sécurité via `XoopsFormHiddenToken`.

---

## D

### DI (Dependency Injection)
Un motif de conception prévu pour XOOPS 4.0 où les dépendances sont injectées plutôt que créées en interne.

### Dirname
Le nom du répertoire d'un module, utilisé comme identifiant unique dans le système.

### DTYPE (Data Type)
Des constantes définissant comment les variables XoopsObject sont stockées et assainies:
- `XOBJ_DTYPE_INT` - Entier
- `XOBJ_DTYPE_TXTBOX` - Texte (une ligne)
- `XOBJ_DTYPE_TXTAREA` - Texte (plusieurs lignes)
- `XOBJ_DTYPE_EMAIL` - Adresse électronique

---

## E

### Event
Une occurrence du cycle de vie XOOPS qui peut déclencher du code personnalisé via des préchargements ou des crochets.

---

## F

### Framework
Voir XMF (XOOPS Module Framework).

### Form Element
Un composant du système de formulaire XOOPS représentant un champ de formulaire HTML.

---

## G

### Group
Une collection d'utilisateurs avec des permissions partagées. Les groupes de base incluent: Administrateurs web, Utilisateurs enregistrés, Anonyme.

---

## H

### Handler
Une classe qui gère les opérations CRUD pour les instances XoopsObject.

```php
$handler = xoops_getModuleHandler('item', 'mymodule');
$item = $handler->get($id);
```

### Helper
Une classe utilitaire fournissant un accès facile aux gestionnaires de module, configurations et services.

```php
$helper = \XoopsModules\MyModule\Helper::getInstance();
```

---

## K

### Kernel
Les classes centrales de XOOPS fournissant les fonctionnalités fondamentales: accès à la base de données, gestion des utilisateurs, sécurité, etc.

---

## L

### Language File
Fichiers PHP contenant des constantes pour l'internationalisation, stockés dans les répertoires `language/[code]/`.

---

## M

### mainfile.php
Le fichier de configuration principal de XOOPS contenant les identifiants de base de données et les définitions de chemin.

### MCP (Model-Controller-Presenter)
Un motif architectural similaire à MVC, souvent utilisé dans le développement de modules XOOPS.

### Middleware
Un logiciel qui se situe entre la requête et la réponse, prévu pour XOOPS 4.0 utilisant PSR-15.

### Module
Un paquet auto-contenu qui étend la fonctionnalité XOOPS, installé dans le répertoire `modules/`.

### MOC (Map of Content)
Un concept Obsidian pour les notes d'aperçu qui se lient au contenu connexe.

---

## N

### Namespace
Fonctionnalité PHP pour organiser les classes, utilisée dans XOOPS 2.5+:
```php
namespace XoopsModules\MyModule;
```

### Notification
Le système XOOPS pour alerter les utilisateurs des événements via email ou MP.

---

## O

### Object
Voir XoopsObject.

---

## P

### Permission
Contrôle d'accès géré par les groupes et les gestionnaires de permissions.

### Preload
Une classe qui se raccorde aux événements XOOPS, chargée automatiquement depuis le répertoire `preloads/`.

### PSR (PHP Standards Recommendation)
Normes de PHP-FIG que XOOPS 4.0 implémentera pleinement.

---

## R

### Renderer
Une classe qui génère les éléments de formulaire ou d'autres composants d'interface utilisateur dans des formats spécifiques (Bootstrap, etc.).

---

## S

### Smarty
Le moteur de modèles utilisé par XOOPS pour séparer la présentation de la logique.

```smarty
<{$variable}>
<{foreach item=item from=$items}>
    <{$item.title}>
<{/foreach}>
```

### Service
Une classe fournissant une logique métier réutilisable, généralement accessible via Helper.

---

## T

### Template
Un fichier Smarty (`.tpl` ou `.html`) définissant la couche de présentation pour les modules.

### Theme
Une collection de modèles et d'actifs définissant l'apparence visuelle du site.

### Token
Un mécanisme de sécurité (protection CSRF) assurant que les soumissions de formulaires proviennent de sources légitimes.

---

## U

### uid
User ID - l'identifiant unique de chaque utilisateur dans le système.

---

## V

### Variable (Var)
Un champ défini sur un XoopsObject en utilisant `initVar()`.

---

## W

### Widget
Un petit composant d'interface utilisateur auto-contenu, similaire aux blocs.

---

## X

### XMF (XOOPS Module Framework)
Une collection d'utilitaires et de classes pour le développement moderne de modules XOOPS.

### XOBJ_DTYPE
Constantes pour définir les types de données des variables dans XoopsObject.

### XoopsDatabase
La couche d'abstraction de base de données fournissant l'exécution de requêtes et l'échappement.

### XoopsForm
Le système de génération de formulaires pour créer des formulaires HTML par programme.

### XoopsObject
La classe de base pour tous les objets de données dans XOOPS, fournissant la gestion des variables et l'assainissement.

### xoops_version.php
Le fichier manifeste du module définissant les propriétés du module, les tables, les blocs, les modèles et la configuration.

---

## Acronymes communs

| Acronyme | Signification |
|---------|---------|
| XOOPS | eXtensible Object-Oriented Portal System |
| XMF | XOOPS Module Framework |
| CSRF | Cross-Site Request Forgery |
| XSS | Cross-Site Scripting |
| ORM | Object-Relational Mapping |
| PSR | PHP Standards Recommendation |
| DI | Dependency Injection |
| MVC | Model-View-Controller |
| CRUD | Create, Read, Update, Delete |

---

## Documentation connexe

- Concepts de base
- Référence API
- Ressources externes

---

#xoops #glossaire #référence #terminologie #définitions
