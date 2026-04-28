---
title: "Best Practices für Modulentwicklung"
---

## Überblick

Dieses Dokument konsolidiert Best Practices für die Entwicklung hochwertiger XOOPS-Module. Die Befolgung dieser Richtlinien stellt sicher, dass Module wartbar, sicher und leistungsfähig sind.

## Architektur

### Folgen Sie Clean Architecture

Organisieren Sie den Code in Schichten:

```
src/
├── Domain/          # Geschäftslogik, Entitäten
├── Application/     # Use Cases, Services
├── Infrastructure/  # Datenbank, externe Services
└── Presentation/    # Controller, Templates
```

### Single Responsibility

Jede Klasse sollte einen Grund haben, sich zu ändern:

```php
// Gut: Fokussierte Klassen
class ArticleRepository { /* nur Persistenz */ }
class ArticleValidator { /* nur Validierung */ }
class ArticleNotifier { /* nur Benachrichtigungen */ }

// Schlecht: Gott-Klasse
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Dependency Injection

Injizieren Sie Abhängigkeiten, erstellen Sie sie nicht:

```php
// Gut
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Schlecht
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Code-Qualität

### Typsicherheit

Verwenden Sie strikte Typen und Typdeklarationen:

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

### Fehlerbehandlung

Verwenden Sie Exceptions angemessen:

```php
// Werfen Sie spezifische Exceptions
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Fangen Sie auf angemessener Ebene
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Null-Sicherheit

Vermeiden Sie null, wo möglich:

```php
// Verwenden Sie Null-Objekt-Muster
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Verwenden Sie Optional/Maybe-Muster
public function findById(int $id): ?Article
{
    // Explizit nullbar zurück
}
```

## Datenbank

### Verwenden Sie Criteria für Queries

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Entwenden Sie Benutzereingaben

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Verwenden Sie Transaktionen

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

## Sicherheit

### Validieren Sie immer Eingaben

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Zusätzliche Validierung
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### Verwenden Sie CSRF-Tokens

```php
// Im Formular
$form->addElement(new XoopsFormHiddenToken());

// Bei Absendung
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### Überprüfen Sie Berechtigungen

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Leistung

### Verwenden Sie Caching

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Optimieren Sie Queries

```php
// Verwenden Sie Indizes
// Hinzufügen zu sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Wählen Sie nur benötigte Spalten
$handler->getObjects($criteria, false, true); // asArray = true

// Verwenden Sie Pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Testen

### Schreiben Sie Unit Tests

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

## Verwandte Dokumentation

- Clean-Code - Clean Code-Prinzipien
- Code-Organization - Projektstruktur
- Testing - Leitfaden zum Testen
- ../02-Core-Concepts/Security/Security-Best-Practices - Sicherheitsleitfaden
