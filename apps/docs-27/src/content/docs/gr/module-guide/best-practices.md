---
title: "Βέλτιστες πρακτικές ανάπτυξης ενότητας"
---

## Επισκόπηση

Αυτό το έγγραφο ενοποιεί τις βέλτιστες πρακτικές για την ανάπτυξη ενοτήτων XOOPS υψηλής ποιότητας. Η τήρηση αυτών των οδηγιών εξασφαλίζει συντηρήσιμες, ασφαλείς και λειτουργικές μονάδες.

## Αρχιτεκτονική

## # Ακολουθήστε την Καθαρή Αρχιτεκτονική

Οργανώστε τον κώδικα σε επίπεδα:

```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```

## # Ενιαία Ευθύνη

Κάθε τάξη πρέπει να έχει έναν λόγο να αλλάξει:

```php
// Good: Focused classes
class ArticleRepository { /* persistence only */ }
class ArticleValidator { /* validation only */ }
class ArticleNotifier { /* notifications only */ }

// Bad: God class
class Article {
    public function save() { }
    public function validate() { }
    public function notify() { }
    public function generatePDF() { }
}
```

## # Έγχυση εξάρτησης

Εισάγετε εξαρτήσεις, μην τις δημιουργείτε:

```php
// Good
public function __construct(
    private readonly ArticleRepositoryInterface $repository
) {}

// Bad
public function __construct() {
    $this->repository = new ArticleRepository();
}
```

## Ποιότητα κώδικα

## # Τύπος Ασφάλεια

Χρησιμοποιήστε αυστηρούς τύπους και δηλώσεις τύπου:

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

## # Χειρισμός σφαλμάτων

Χρησιμοποιήστε κατάλληλα εξαιρέσεις:

```php
// Throw specific exceptions
throw new ArticleNotFoundException($id);
throw new ValidationException($errors);
throw new UnauthorizedException('Cannot edit this article');

// Catch at appropriate level
try {
    $article = $service->create($dto);
} catch (ValidationException $e) {
    return $this->renderForm($e->getErrors());
} catch (UnauthorizedException $e) {
    return $this->redirectToLogin();
}
```

## # Μηδενική ασφάλεια

Αποφύγετε το null όπου είναι δυνατόν:

```php
// Use null object pattern
public function getAuthor(): UserInterface
{
    return $this->author ?? new AnonymousUser();
}

// Use Optional/Maybe pattern
public function findById(int $id): ?Article
{
    // Explicitly nullable return
}
```

## Βάση δεδομένων

## # Χρήση κριτηρίων για ερωτήματα

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

## # Escape User Input

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

## # Χρήση συναλλαγών

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

## Ασφάλεια

## # Να επικυρώνεται πάντα η είσοδος

```php
use Xmf\Request;

$id = Request::getInt('id', 0);
$title = Request::getString('title', '');
$data = Request::getArray('data', []);

// Additional validation
if (strlen($title) < 5) {
    throw new ValidationException('Title too short');
}
```

## # Χρησιμοποιήστε CSRF διακριτικά

```php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

## # Ελέγξτε τα δικαιώματα

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Απόδοση

## # Χρήση προσωρινής αποθήκευσης

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

## # Βελτιστοποίηση ερωτημάτων

```php
// Use indexes
// Add to sql/mysql.sql:
// INDEX `idx_status_date` (`status`, `created_at`)

// Select only needed columns
$handler->getObjects($criteria, false, true); // asArray = true

// Use pagination
$criteria->setLimit($perPage);
$criteria->setStart($offset);
```

## Δοκιμή

## # Γράψτε δοκιμές μονάδας

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

## Σχετική τεκμηρίωση

- Clean-Code - Αρχές καθαρού κώδικα
- Κώδικας-Οργάνωση - Δομή έργου
- Δοκιμές - Οδηγός δοκιμών
- ../02-Core-Concepts/Security/Security-Best-Practices - Οδηγός ασφαλείας
