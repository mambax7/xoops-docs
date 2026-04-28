---
title: "Najlepsze praktyki rozwoju modułów"
---

## Przegląd

Dokument ten konsoliduje najlepsze praktyki dla tworzenia wysokiej jakości modułów XOOPS. Postępowanie zgodnie z tymi wytycznymi zapewnia konserwowalne, bezpieczne i wydajne moduły.

## Architektura

### Postępuj zgodnie z czystą architekturą

Organizuj kod w warstwy:

```
src/
├── Domain/          # Logika biznesowa, jednostki
├── Application/     # Przypadki użycia, usługi
├── Infrastructure/  # Baza danych, usługi zewnętrzne
└── Presentation/    # Kontrolery, szablony
```

### Pojedyncza odpowiedzialność

Każda klasa powinna mieć jeden powód do zmiany:

```php
// Dobrze: Skoncentrowane klasy
class ArticleRepository { /* persistence only */ }
class ArticleValidator { /* validation only */ }
class ArticleNotifier { /* notifications only */ }

// Źle: Klasa boga
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

### Wstrzykiwanie zależności

Wstrzyknij zależności, nie twórz ich:

```php
// Dobrze
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Źle
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Jakość kodu

### Bezpieczeństwo typów

Używaj ścisłych typów i deklaracji typów:

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

### Obsługa błędów

Używaj wyjątków odpowiednio:

```php
// Rzuć określone wyjątki
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Łap na odpowiednim poziomie
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

### Bezpieczeństwo wartości null

Unikaj wartości null, jeśli to możliwe:

```php
// Użyj wzorca obiektu null
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Użyj wzorca Optional/Maybe
public function findById(int $id): ?Article
{
    // Jawnie nullable zwrot
}
```

## Baza danych

### Używaj kryteriów do zapytań

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Uciekaj dane wejściowe użytkownika

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Używaj transakcji

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

## Bezpieczeństwo

### Zawsze waliduj dane wejściowe

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Dodatkowa walidacja
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

### Używaj tokenów CSRF

```php
// W formularzu
$form->addElement(new XoopsFormHiddenToken());

// Po wysłaniu
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### Sprawdzaj uprawnienia

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Wydajność

### Używaj buforowania

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Optymalizuj zapytania

```php
// Używaj indeksów
// Dodaj do sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Wybieraj tylko potrzebne kolumny
$handler->getObjects($criteria, false, true); // asArray = true

// Używaj paginacji
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Testowanie

### Napisz testy jednostkowe

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

## Powiązana dokumentacja

- Clean-Code - Zasady czystego kodu
- Code-Organization - Struktura projektu
- Testing - Przewodnik testowania
- ../02-Core-Concepts/Security/Security-Best-Practices - Przewodnik bezpieczeństwa
