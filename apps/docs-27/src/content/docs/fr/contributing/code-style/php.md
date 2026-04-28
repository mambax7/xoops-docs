---
title: "Normes de Codage PHP"
description: "Normes de codage PHP XOOPS basées sur PSR-1, PSR-4 et PSR-12"
---

# Normes PHP

> XOOPS suit les normes de codage PSR-1, PSR-4 et PSR-12 avec des conventions spécifiques à XOOPS.

---

## Aperçu des Normes

```mermaid
graph TB
    subgraph "Normes PSR"
        A[PSR-1: Codage Base]
        B[PSR-4: Chargement Auto]
        C[PSR-12: Style Étendu]
    end

    subgraph "Conventions XOOPS"
        D[Motifs de Nommage]
        E[Organisation des Fichiers]
        F[Documentation]
    end

    A --> G[Code Propre]
    B --> G
    C --> G
    D --> G
    E --> G
    F --> G
```

---

## Structure des Fichiers

### Balises PHP

```php
<?php
// Utilisez toujours les balises PHP complètes, jamais les balises courtes
// Omettez la balise fermante ?> dans les fichiers PHP purs

declare(strict_types=1);

namespace XoopsModules\MyModule;

// Code ici...
```

### En-tête du Fichier

```php
<?php

declare(strict_types=1);

/**
 * XOOPS - Système de Gestion de Contenu PHP
 *
 * @package    XoopsModules\MyModule
 * @subpackage Class
 * @author     Votre Nom <email@example.com>
 * @copyright  2026 Projet XOOPS
 * @license    GPL-2.0-or-later
 * @link       https://xoops.org
 */

namespace XoopsModules\MyModule;

use XoopsObject;
use XoopsPersistableObjectHandler;
```

---

## Conventions de Nommage

### Classes

```php
// PascalCase pour les noms de classes
class ItemHandler extends XoopsPersistableObjectHandler
{
    // ...
}

// Les interfaces se terminent par "Interface"
interface RepositoryInterface
{
    public function find(int $id): ?object;
}

// Les traits se terminent par "Trait"
trait TimestampTrait
{
    public function getCreatedAt(): \DateTimeInterface
    {
        // ...
    }
}

// Les classes abstraites commencent par "Abstract"
abstract class AbstractEntity
{
    // ...
}
```

### Méthodes et Fonctions

```php
// camelCase pour les méthodes
public function getActiveItems(): array
{
    // ...
}

// Verbes pour les méthodes d'action
public function createItem(array $data): Item
public function updateItem(int $id, array $data): bool
public function deleteItem(int $id): bool
public function findById(int $id): ?Item
public function hasPermission(string $permission): bool
public function isActive(): bool
public function canEdit(): bool
```

### Variables et Propriétés

```php
class Item
{
    // camelCase pour les propriétés
    private int $itemId;
    private string $itemTitle;
    private bool $isPublished;
    private array $categoryIds;

    // camelCase pour les variables
    public function process(): void
    {
        $itemCount = 0;
        $activeItems = [];
        $isValid = true;
    }
}
```

### Constantes

```php
// UPPER_SNAKE_CASE pour les constantes
class Config
{
    public const DEFAULT_ITEMS_PER_PAGE = 10;
    public const MAX_UPLOAD_SIZE = 10485760;
    public const CACHE_LIFETIME = 3600;
}

// Ou dans les appels define()
define('XOOPS_ROOT_PATH', '/path/to/xoops');
define('MYMODULE_VERSION', '1.0.0');
```

---

## Structure des Classes

```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule;

use XoopsDatabase;
use XoopsPersistableObjectHandler;

/**
 * Gestionnaire pour les objets Item
 *
 * @package XoopsModules\MyModule
 */
class ItemHandler extends XoopsPersistableObjectHandler
{
    // 1. Constantes
    public const TABLE_NAME = 'mymodule_items';

    // 2. Propriétés (ordre de visibilité: public, protected, private)
    public int $defaultLimit = 10;

    protected string $table;

    private XoopsDatabase $db;

    // 3. Constructeur
    public function __construct(?XoopsDatabase $db = null)
    {
        $this->db = $db ?? \XoopsDatabaseFactory::getDatabaseConnection();
        parent::__construct($this->db, self::TABLE_NAME, Item::class, 'id', 'title');
    }

    // 4. Méthodes publiques
    public function getPublishedItems(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function findBySlug(string $slug): ?Item
    {
        $criteria = new \Criteria('slug', $slug);
        $items = $this->getObjects($criteria);

        return $items[0] ?? null;
    }

    // 5. Méthodes protégées
    protected function validateItem(Item $item): bool
    {
        // Logique de validation
        return true;
    }

    // 6. Méthodes privées
    private function sanitizeInput(string $input): string
    {
        return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
    }
}
```

---

## Règles de Formatage

### Indentation et Espacement

```php
// Utilisez 4 espaces pour l'indentation (pas de tabulations)
class Example
{
    public function method(): void
    {
        if ($condition) {
            // 4 espaces
            foreach ($items as $item) {
                // 8 espaces
                $this->process($item);
            }
        }
    }
}

// Une ligne vierge entre les méthodes
public function methodOne(): void
{
    // ...
}

public function methodTwo(): void
{
    // ...
}

// Pas d'espaces à la fin
// Les fichiers se terminent par une seule nouvelle ligne
```

### Longueur des Lignes

```php
// Maximum 120 caractères par ligne
// Casser les longues lignes logiquement

// Appels de méthode longs
$result = $this->someHandler->processComplexOperation(
    $parameter1,
    $parameter2,
    $parameter3,
    $parameter4
);

// Longs tableaux
$config = [
    'option1' => 'value1',
    'option2' => 'value2',
    'option3' => 'value3',
];

// Conditions longues
if ($condition1
    && $condition2
    && $condition3
) {
    // ...
}
```

### Structures de Contrôle

```php
// if/elseif/else
if ($condition) {
    // code
} elseif ($otherCondition) {
    // code
} else {
    // code
}

// switch
switch ($value) {
    case 1:
        doSomething();
        break;

    case 2:
        doSomethingElse();
        break;

    default:
        doDefault();
        break;
}

// try/catch
try {
    $result = $this->riskyOperation();
} catch (SpecificException $e) {
    $this->handleSpecific($e);
} catch (\Exception $e) {
    $this->handleGeneral($e);
} finally {
    $this->cleanup();
}

// foreach
foreach ($items as $key => $value) {
    // code
}

// for
for ($i = 0; $i < $count; $i++) {
    // code
}
```

---

## Déclarations de Typage

```php
<?php

declare(strict_types=1);

class TypeExample
{
    // Types de propriétés (PHP 7.4+)
    private int $id;
    private string $title;
    private ?string $description = null;
    private array $tags = [];
    private bool $isActive = false;

    // Constructeur avec paramètres typés
    public function __construct(
        int $id,
        string $title,
        ?string $description = null
    ) {
        $this->id = $id;
        $this->title = $title;
        $this->description = $description;
    }

    // Déclarations de type de retour
    public function getId(): int
    {
        return $this->id;
    }

    public function getTitle(): string
    {
        return $this->title;
    }

    // Type de retour nullable
    public function getDescription(): ?string
    {
        return $this->description;
    }

    // Types union (PHP 8.0+)
    public function getValue(): int|string
    {
        return $this->value;
    }

    // Type de retour void
    public function setTitle(string $title): void
    {
        $this->title = $title;
    }

    // Retour de tableau avec docblock pour le contenu
    /**
     * @return Item[]
     */
    public function getItems(): array
    {
        return $this->items;
    }
}
```

---

## Documentation

### DocBlock de Classe

```php
/**
 * Gère les opérations CRUD pour les entités Article
 *
 * Ce gestionnaire fournit des méthodes pour créer, lire, mettre à jour,
 * et supprimer des articles dans la base de données.
 *
 * @package    XoopsModules\Publisher
 * @subpackage Handler
 * @author     Équipe de Développement XOOPS
 * @since      1.0.0
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
```

### DocBlock de Méthode

```php
/**
 * Récupère les articles par catégorie
 *
 * Récupère les articles publiés appartenant à une catégorie spécifique,
 * ordonnés par date de création décroissante.
 *
 * @param int  $categoryId Identifiant de la catégorie
 * @param int  $limit      Nombre maximum d'articles à retourner
 * @param int  $offset     Position de démarrage pour la pagination
 * @param bool $published  Retourner uniquement les articles publiés
 *
 * @return Article[] Tableau d'objets Article
 *
 * @throws \InvalidArgumentException Si l'identifiant de catégorie est invalide
 *
 * @since 1.0.0
 */
public function getByCategory(
    int $categoryId,
    int $limit = 10,
    int $offset = 0,
    bool $published = true
): array {
```

---

## Configuration des Outils

### PHP CS Fixer

```php
// .php-cs-fixer.php
<?php

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__ . '/class')
    ->in(__DIR__ . '/src');

return (new PhpCsFixer\Config())
    ->setRules([
        '@PSR12' => true,
        'array_syntax' => ['syntax' => 'short'],
        'ordered_imports' => ['sort_algorithm' => 'alpha'],
        'no_unused_imports' => true,
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

### PHPStan

```yaml
# phpstan.neon
parameters:
    level: 6
    paths:
        - class/
        - src/
    ignoreErrors:
        - '#Call to an undefined method XoopsObject::#'
```

---

## Documentation Connexe

- Normes JavaScript
- Organisation du Code
- Directives de Demande de Tirage

---

#xoops #php #coding-standards #psr #best-practices
