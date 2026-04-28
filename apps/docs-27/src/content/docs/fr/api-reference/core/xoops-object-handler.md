---
title: "Classe XoopsObjectHandler"
description: "Classe gestionnaire de base pour les opérations CRUD sur les instances XoopsObject avec persistance base de données"
---

La classe `XoopsObjectHandler` et son extension `XoopsPersistableObjectHandler` fournissent une interface standardisée pour effectuer les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) sur les instances `XoopsObject`. Cela implémente le modèle Data Mapper, séparant la logique de domaine de l'accès à la base de données.

## Vue d'ensemble de la classe

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## Hiérarchie des classes

```
XoopsObjectHandler (Base abstraite)
└── XoopsPersistableObjectHandler (Implémentation étendue)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Gestionnaires de modules personnalisés]
```

## XoopsObjectHandler

### Constructeur

```php
public function __construct(XoopsDatabase $db)
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Instance de connexion base de données |

**Exemple :**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### create

Crée une nouvelle instance d'objet.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$isNew` | bool | Si l'objet est nouveau (défaut : true) |

**Retour :** `XoopsObject|null` - Nouvelle instance d'objet

**Exemple :**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### get

Récupère un objet par sa clé primaire.

```php
abstract public function get(int $id): ?XoopsObject
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$id` | int | Valeur clé primaire |

**Retour :** `XoopsObject|null` - Instance d'objet ou null si non trouvé

**Exemple :**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### insert

Enregistre un objet dans la base de données (insertion ou mise à jour).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objet à enregistrer |
| `$force` | bool | Forcer l'opération même si l'objet inchangé |

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "Utilisateur enregistré avec ID : " . $user->getVar('uid');
} else {
    echo "Échec de l'enregistrement : " . implode(', ', $user->getErrors());
}
```

---

### delete

Supprime un objet de la base de données.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$obj` | XoopsObject | Objet à supprimer |
| `$force` | bool | Forcer la suppression |

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "Utilisateur supprimé";
}
```

---

## XoopsPersistableObjectHandler

La classe `XoopsPersistableObjectHandler` étend `XoopsObjectHandler` avec des méthodes supplémentaires pour les requêtes et opérations en masse.

### Constructeur

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$db` | XoopsDatabase | Connexion base de données |
| `$table` | string | Nom de la table (sans préfixe) |
| `$className` | string | Nom de classe complet de l'objet |
| `$keyName` | string | Nom du champ clé primaire |
| `$identifierName` | string | Champ identifiant lisible |

**Exemple :**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Nom de table
            'Article',               // Nom de classe
            'article_id',            // Clé primaire
            'title'                  // Champ identifiant
        );
    }
}
```

---

### getObjects

Récupère plusieurs objets correspondant aux critères.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critères de requête (optionnel) |
| `$idAsKey` | bool | Utiliser la clé primaire comme clé de tableau |
| `$asObject` | bool | Retourner des objets (true) ou des tableaux (false) |

**Retour :** `array` - Tableau d'objets ou de tableaux associatifs

**Exemple :**
```php
$handler = xoops_getHandler('user');

// Obtenir tous les utilisateurs actifs
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Obtenir les utilisateurs avec ID comme clé
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Accès par ID

// Obtenir sous forme de tableaux au lieu d'objets
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

Compte les objets correspondant aux critères.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critères de requête (optionnel) |

**Retour :** `int` - Nombre d'objets correspondants

**Exemple :**
```php
$handler = xoops_getHandler('user');

// Compter tous les utilisateurs
$totalUsers = $handler->getCount();

// Compter les utilisateurs actifs
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total : $totalUsers, Actifs : $activeUsers";
```

---

### getAll

Récupère tous les objets (alias pour getObjects sans critères).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critères de requête |
| `$fields` | array | Champs spécifiques à récupérer |
| `$asObject` | bool | Retourner sous forme d'objets |
| `$idAsKey` | bool | Utiliser l'ID comme clé de tableau |

**Exemple :**
```php
$handler = xoops_getHandler('module');

// Obtenir tous les modules
$modules = $handler->getAll();

// Obtenir seulement les champs spécifiques
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getIds

Récupère seulement les clés primaires des objets correspondants.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critères de requête |

**Retour :** `array` - Tableau de valeurs clé primaire

**Exemple :**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Tableau des IDs d'utilisateurs administrateurs
```

---

### getList

Récupère une liste clé-valeur pour les listes déroulantes.

```php
public function getList(CriteriaElement $criteria = null): array
```

**Retour :** `array` - Tableau associatif [id => identifiant]

**Exemple :**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrateurs', 2 => 'Utilisateurs enregistrés', ...]

// Pour une liste déroulante select
$form->addElement(new XoopsFormSelect('Groupe', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### deleteAll

Supprime tous les objets correspondant aux critères.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | Critères pour les objets à supprimer |
| `$force` | bool | Forcer la suppression |
| `$asObject` | bool | Charger les objets avant suppression (déclenche les événements) |

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Supprimer tous les commentaires pour un article spécifique
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Supprimer avec chargement d'objets (déclenche les événements de suppression)
$handler->deleteAll($criteria, true, true);
```

---

### updateAll

Met à jour une valeur de champ pour tous les objets correspondants.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$fieldname` | string | Champ à mettre à jour |
| `$fieldvalue` | mixed | Nouvelle valeur |
| `$criteria` | CriteriaElement | Critères pour les objets à mettre à jour |
| `$force` | bool | Forcer la mise à jour |

**Retour :** `bool` - True en cas de succès

**Exemple :**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Marquer tous les articles d'un auteur comme brouillon
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Mettre à jour le compteur de vues
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### insert (Étendu)

La méthode insert étendue avec fonctionnalités supplémentaires.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**Comportement :**
- Si l'objet est nouveau (`isNew() === true`) : INSERT
- Si l'objet existe (`isNew() === false`) : UPDATE
- Appelle `cleanVars()` automatiquement
- Définit l'ID d'auto-incrémentation sur les nouveaux objets

**Exemple :**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Créer un nouvel article
$article = $handler->create();
$article->setVar('title', 'Nouvel article');
$article->setVar('content', 'Contenu ici');
$handler->insert($article);
echo "Créé avec ID : " . $article->getVar('article_id');

// Mettre à jour un article existant
$article = $handler->get(5);
$article->setVar('title', 'Titre mis à jour');
$handler->insert($article);
```

---

## Fonctions d'aide

### xoops_getHandler

Fonction globale pour récupérer un gestionnaire principal.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$name` | string | Nom du gestionnaire (user, module, group, etc.) |
| `$optional` | bool | Retourner null au lieu de déclencher une erreur |

**Exemple :**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

Récupère un gestionnaire spécifique à un module.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**Paramètres :**

| Paramètre | Type | Description |
|-----------|------|-------------|
| `$name` | string | Nom du gestionnaire |
| `$dirname` | string | Nom du répertoire du module |
| `$optional` | bool | Retourner null en cas d'échec |

**Exemple :**
```php
// Obtenir le gestionnaire du module actuel
$articleHandler = xoops_getModuleHandler('article');

// Obtenir le gestionnaire d'un module spécifique
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## Meilleures pratiques

1. **Utiliser Criteria pour les requêtes** : Toujours utiliser les objets Criteria pour les requêtes de type sécurisé

2. **Étendre pour les méthodes personnalisées** : Ajouter des méthodes de requête spécifiques au domaine aux gestionnaires

3. **Remplacer insert/delete** : Ajouter des opérations en cascade et des horodatages dans les remplacements

4. **Utiliser les transactions si nécessaire** : Envelopper les opérations complexes dans des transactions

5. **Utiliser getList** : Utiliser `getList()` pour les listes déroulantes select pour réduire les requêtes

6. **Indexer les clés** : S'assurer que les champs utilisés dans les critères sont indexés

7. **Limiter les résultats** : Toujours utiliser `setLimit()` pour les résultats potentiellement volumineux

## Documentation connexe

- XoopsObject - Classe d'objet de base
- ../Database/Criteria - Construction de critères de requête
- ../Database/XoopsDatabase - Opérations base de données

---

*Voir aussi : [Code source XOOPS](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
