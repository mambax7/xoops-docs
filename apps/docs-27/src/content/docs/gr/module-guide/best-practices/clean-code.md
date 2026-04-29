---
title: "Αρχές καθαρού κώδικα για XOOPS"
---

## Επισκόπηση

Ο καθαρός κώδικας είναι κώδικας που είναι εύκολο να διαβαστεί, να κατανοηθεί και να διατηρηθεί. Αυτός ο οδηγός καλύπτει αρχές καθαρού κώδικα που εφαρμόζονται ειδικά στην ανάπτυξη της μονάδας XOOPS.

## Βασικές Αρχές

```mermaid
mindmap
  root((Clean Code))
    Readability
      Meaningful Names
      Small Functions
      Comments When Needed
    Simplicity
      Single Responsibility
      DRY Principle
      KISS Principle
    Maintainability
      Consistent Style
      Error Handling
      Testing
```

## Ονόματα με νόημα

## # Μεταβλητές

```php
// Bad
$d = new DateTime();
$u = $memberHandler->getUser($id);
$arr = [];

// Good
$createdDate = new DateTime();
$currentUser = $memberHandler->getUser($userId);
$publishedArticles = [];
```

## # Λειτουργίες

```php
// Bad
function process($data) { ... }
function handle($item) { ... }
function doStuff($x, $y) { ... }

// Good
function publishArticle(Article $article): void { ... }
function calculateTotalPrice(array $items): float { ... }
function sendNotificationEmail(User $user, string $subject): bool { ... }
```

## # Μαθήματα

```php
// Bad
class Manager { ... }
class Helper { ... }
class Utils { ... }

// Good
class ArticleRepository { ... }
class NotificationService { ... }
class PermissionChecker { ... }
```

## Μικρές λειτουργίες

## # Ενιαία Ευθύνη

```php
// Bad - does too many things
function processArticle($data) {
    // Validate
    if (empty($data['title'])) {
        throw new Exception('Title required');
    }
    // Save
    $article = new Article();
    $article->setTitle($data['title']);
    $this->repository->save($article);
    // Notify
    $this->mailer->send($article->getAuthor(), 'Article published');
    // Log
    $this->logger->info('Article created');
    return $article;
}

// Good - each function does one thing
function validateArticleData(array $data): void
{
    if (empty($data['title'])) {
        throw new ValidationException('Title required');
    }
}

function createArticle(array $data): Article
{
    $this->validateArticleData($data);
    return Article::create($data['title'], $data['content']);
}

function publishArticle(Article $article): void
{
    $this->repository->save($article);
    $this->notifyAuthor($article);
    $this->logArticleCreation($article);
}
```

## # Μήκος λειτουργίας

Διατηρήστε τις λειτουργίες σύντομες - ιδανικά κάτω από 20 γραμμές:

```php
// Good - focused function
public function getPublishedArticles(int $limit = 10): array
{
    $criteria = new CriteriaCompo();
    $criteria->add(new Criteria('status', 'published'));
    $criteria->setSort('published_at');
    $criteria->setOrder('DESC');
    $criteria->setLimit($limit);

    return $this->repository->getObjects($criteria);
}
```

## DRY Αρχή (Μην επαναλαμβάνετε τον εαυτό σας)

## # Εξαγωγή κοινού κώδικα

```php
// Bad - repeated code
function getActiveUsers() {
    $criteria = new CriteriaCompo();
    $criteria->add(new Criteria('level', 0, '>'));
    $criteria->setSort('uname');
    return $this->userHandler->getObjects($criteria);
}

function getActiveAdmins() {
    $criteria = new CriteriaCompo();
    $criteria->add(new Criteria('level', 0, '>'));
    $criteria->add(new Criteria('is_admin', 1));
    $criteria->setSort('uname');
    return $this->userHandler->getObjects($criteria);
}

// Good - shared logic extracted
function getUsers(CriteriaCompo $criteria): array
{
    $criteria->add(new Criteria('level', 0, '>'));
    $criteria->setSort('uname');
    return $this->userHandler->getObjects($criteria);
}

function getActiveUsers(): array
{
    return $this->getUsers(new CriteriaCompo());
}

function getActiveAdmins(): array
{
    $criteria = new CriteriaCompo();
    $criteria->add(new Criteria('is_admin', 1));
    return $this->getUsers($criteria);
}
```

## Χειρισμός σφαλμάτων

## # Χρησιμοποιήστε σωστά τις εξαιρέσεις

```php
// Bad - generic exceptions
throw new Exception('Error');

// Good - specific exceptions
throw new ArticleNotFoundException($articleId);
throw new PermissionDeniedException('Cannot edit article');
throw new ValidationException(['title' => 'Title is required']);
```

## # Χειριστείτε τα σφάλματα με χάρη

```php
public function findArticle(string $id): ?Article
{
    try {
        return $this->repository->findById($id);
    } catch (DatabaseException $e) {
        $this->logger->error('Database error finding article', [
            'id' => $id,
            'error' => $e->getMessage()
        ]);
        throw new ServiceException('Unable to retrieve article', 0, $e);
    }
}
```

## Σχόλια

## # Πότε να σχολιάσετε

```php
// Bad - obvious comment
// Increment counter
$counter++;

// Good - explains why, not what
// Cache for 1 hour to reduce database load during peak traffic
$cache->set($key, $data, 3600);

// Good - documents complex algorithm
/**
 * Calculate article relevance score using TF-IDF algorithm.
 * Higher scores indicate better match with search terms.
 */
function calculateRelevanceScore(Article $article, array $terms): float
{
    // ...
}
```

## Οργάνωση κώδικα

## # Δομή τάξης

```php
class ArticleService
{
    // 1. Constants
    private const MAX_TITLE_LENGTH = 255;

    // 2. Properties
    private ArticleRepository $repository;
    private EventDispatcher $events;

    // 3. Constructor
    public function __construct(
        ArticleRepository $repository,
        EventDispatcher $events
    ) {
        $this->repository = $repository;
        $this->events = $events;
    }

    // 4. Public methods
    public function publish(Article $article): void { ... }
    public function archive(Article $article): void { ... }

    // 5. Private methods
    private function validateForPublication(Article $article): void { ... }
}
```

## Λίστα ελέγχου καθαρού κώδικα

- [ ] Τα ονόματα έχουν νόημα και προφέρονται
- [ ] Οι συναρτήσεις κάνουν ένα μόνο πράγμα
- [ ] Οι συναρτήσεις είναι μικρές (< 20 γραμμές)
- [ ] Χωρίς διπλότυπο κωδικό
- [ ] Σωστός χειρισμός σφαλμάτων με συγκεκριμένες εξαιρέσεις
- [ ] Τα σχόλια εξηγούν "γιατί", όχι "τι"
- [ ] Συνεπής μορφοποίηση και στυλ
- [ ] Χωρίς μαγικούς αριθμούς ή συμβολοσειρές
- [ ] Οι εξαρτήσεις εγχέονται, δεν δημιουργούνται

## Σχετική τεκμηρίωση

- Οργάνωση κώδικα
- Χειρισμός σφαλμάτων
- Δοκιμή βέλτιστων πρακτικών
- PHP Πρότυπα
