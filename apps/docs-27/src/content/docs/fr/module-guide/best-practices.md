---
title: "Meilleures pratiques du développement de modules"
---

## Aperçu

Ce document consolide les meilleures pratiques pour développer des modules XOOPS de haute qualité. Suivre ces directives garantit que les modules sont maintenables, sécurisés et performants.

## Architecture

### Suivre une architecture propre

Organisez le code en couches :

```
src/
├── Domain/          # Logique métier, entités
├── Application/     # Cas d'usage, services
├── Infrastructure/  # Base de données, services externes
└── Presentation/    # Contrôleurs, modèles
```

### Responsabilité unique

Chaque classe devrait avoir une seule raison de changer :

```php
// Bien : Classes ciblées
class ArticleRepository { /* persistence only */ }
class ArticleValidator { /* validation only */ }
class ArticleNotifier { /* notifications only */ }

// Mauvais : Classe Dieu
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Injection de dépendances

Injecter les dépendances, ne pas les créer :

```php
// Bien
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Mauvais
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Qualité du code

### Sécurité de type

Utiliser les types stricts et les déclarations de type :

```php
<?php

declare(strict_types=1);

final class ArticleService
{
    public function findById(int $id): ?Article
    {
        // ...
    }

    public function create(CreateArticleDTO $dto): Article
    {
        // ...
    }
}
```

### Gestion des erreurs

Utiliser les exceptions de manière appropriée :

```php
// Lever des exceptions spécifiques
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Capturer au niveau approprié
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Sécurité des valeurs nulles

Éviter les valeurs nulles si possible :

```php
// Utiliser le motif null object
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Utiliser le motif Optional/Maybe
public function findById(int $id): ?Article
{
    // Explicitement nullable return
}
```

## Base de données

### Utiliser les critères pour les requêtes

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Échapper l'entrée utilisateur

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Utiliser les transactions

```php
$db->query('START TRANSACTION');

try {
    $handler->insert($article);
    $handler->insert($metadata);
    $db->query('COMMIT');
} catch (\Exception $e) {
    $db->query('ROLLBACK');
    throw $e;
}
```

## Sécurité

### Toujours valider l'entrée

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Validation supplémentaire
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### Utiliser les jetons CSRF

```php
// Dans le formulaire
$form->addElement(new XoopsFormHiddenToken());

// À la soumission
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### Vérifier les permissions

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Performance

### Utiliser la mise en cache

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Optimiser les requêtes

```php
// Utiliser les index
// Ajouter à sql/mysql.sql :
// INDEX `idx_status_date` (`status`, `created_at`)

// Sélectionner uniquement les colonnes nécessaires
$handler->getObjects($criteria, false, true); // asArray = true

// Utiliser la pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Tests

### Écrire des tests unitaires

```php
public function testCreateArticle(): void
{
    $repository = $this->createMock(ArticleRepositoryInterface::class);
    $repository->expects($this->once())->method('save');

    $service = new ArticleService($repository);
    $dto = new CreateArticleDTO('Title', 'Content');

    $article = $service->create($dto);

    $this->assertInstanceOf(Article::class, $article);
}
```

## Documentation connexe

- Code-propre - Principes de code propre
- Organisation-du-code - Structure du projet
- Tests - Guide de test
- ../02-Core-Concepts/Security/Meilleures-pratiques-de-sécurité - Guide de sécurité
