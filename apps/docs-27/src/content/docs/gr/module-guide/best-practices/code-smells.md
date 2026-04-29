---
title: "Ο κώδικας μυρίζει στην ανάπτυξη XOOPS"
---

## Επισκόπηση

Οι μυρωδιές κώδικα είναι δείκτες πιθανών προβλημάτων στον κώδικα. Δεν σημαίνουν απαραίτητα ότι ο κώδικας έχει σπάσει, αλλά προτείνουν περιοχές που θα μπορούσαν να ωφεληθούν από την ανακατασκευή.

## Κοινή μυρωδιά κώδικα

```mermaid
flowchart TD
    A[Code Smell Detected] --> B{Type?}
    B --> C[Bloaters]
    B --> D[Object-Orientation Abusers]
    B --> E[Change Preventers]
    B --> F[Dispensables]
    B --> G[Couplers]

    C --> C1[Long Method]
    C --> C2[Large Class]
    C --> C3[Long Parameter List]

    D --> D1[Switch Statements]
    D --> D2[Temporary Field]

    E --> E1[Divergent Change]
    E --> E2[Shotgun Surgery]

    F --> F1[Dead Code]
    F --> F2[Duplicate Code]

    G --> G1[Feature Envy]
    G --> G2[Inappropriate Intimacy]
```

## Bloaters

## # Μακρά μέθοδος

```php
// Smell: Method does too much
function processArticleSubmission($data) {
    // 100+ lines of validation, saving, notification, etc.
}

// Solution: Extract into focused methods
function processArticleSubmission(array $data): Article
{
    $this->validateInput($data);
    $article = $this->createArticle($data);
    $this->saveArticle($article);
    $this->notifySubscribers($article);
    return $article;
}
```

## # Μεγάλη Τάξη (Αντικείμενο του Θεού)

```php
// Smell: Class does everything
class ArticleManager {
    public function create() { ... }
    public function delete() { ... }
    public function sendEmail() { ... }
    public function generatePDF() { ... }
    public function exportToExcel() { ... }
    public function validateUser() { ... }
    public function checkPermissions() { ... }
    // ... 50 more methods
}

// Solution: Split into focused classes
class ArticleService { ... }
class ArticleExporter { ... }
class ArticleNotifier { ... }
class PermissionChecker { ... }
```

## # Μεγάλη λίστα παραμέτρων

```php
// Smell: Too many parameters
function createArticle($title, $content, $author, $category, $tags, $status, $publishDate, $featured, $image) { ... }

// Solution: Use parameter object
class CreateArticleCommand {
    public string $title;
    public string $content;
    public int $authorId;
    public int $categoryId;
    public array $tags;
    public string $status;
    public ?DateTime $publishDate;
    public bool $featured;
    public ?string $image;
}

function createArticle(CreateArticleCommand $command): Article { ... }
```

## Καταχραστές αντικειμενικού προσανατολισμού

## # Εναλλαγή δηλώσεων

```php
// Smell: Type checking with switch
function getDiscount($userType) {
    switch ($userType) {
        case 'regular':
            return 0;
        case 'premium':
            return 10;
        case 'vip':
            return 20;
        default:
            return 0;
    }
}

// Solution: Use polymorphism
interface UserType {
    public function getDiscount(): int;
}

class RegularUser implements UserType {
    public function getDiscount(): int { return 0; }
}

class PremiumUser implements UserType {
    public function getDiscount(): int { return 10; }
}

class VipUser implements UserType {
    public function getDiscount(): int { return 20; }
}
```

## # Προσωρινό πεδίο

```php
// Smell: Fields only used in certain situations
class Article {
    private $tempCalculatedScore;

    public function search($terms) {
        $this->tempCalculatedScore = $this->calculateScore($terms);
        // ... use score
    }
}

// Solution: Pass as parameter or return value
class Article {
    public function getSearchScore(array $terms): float {
        return $this->calculateScore($terms);
    }
}
```

## Αλλαγή Προληπτικών

## # Αποκλίνουσα αλλαγή

```php
// Smell: One class changed for many different reasons
class Article {
    public function save() { ... } // Database change
    public function toJson() { ... } // API format change
    public function validate() { ... } // Business rule change
    public function render() { ... } // UI change
}

// Solution: Separate responsibilities
class Article { ... } // Domain object only
class ArticleRepository { public function save() { ... } }
class ArticleSerializer { public function toJson() { ... } }
class ArticleValidator { public function validate() { ... } }
```

## # Χειρουργική με κυνηγετικό όπλο

```php
// Smell: One change requires many file edits
// Changing date format requires editing:
// - ArticleController.php
// - ArticleView.php
// - ArticleAPI.php
// - ArticleExport.php

// Solution: Centralize
class DateFormatter {
    public function format(DateTime $date): string {
        return $date->format($this->config->get('date_format'));
    }
}
```

## Αναλώσιμα

## # Νεκρός κώδικας

```php
// Smell: Unreachable or unused code
function processData($data) {
    if (true) {
        return $this->handleData($data);
    }
    // This never executes
    return $this->legacyHandler($data);
}

// Old unused method still in codebase
function oldMethod() {
    // Not called anywhere
}

// Solution: Remove dead code
function processData($data) {
    return $this->handleData($data);
}
```

## # Διπλότυπος κωδικός

```php
// Smell: Same logic in multiple places
class ArticleHandler {
    public function getActive() {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'active'));
        return $this->getObjects($criteria);
    }
}

class NewsHandler {
    public function getActive() {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'active'));
        return $this->getObjects($criteria);
    }
}

// Solution: Extract common behavior
trait ActiveRecordsTrait {
    public function getActive(): array {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'active'));
        return $this->getObjects($criteria);
    }
}
```

## Ζεύκτες

## # Χαρακτηριστικό Envy

```php
// Smell: Method uses another object's data more than its own
class Invoice {
    public function calculateTotal(Customer $customer) {
        $total = 0;
        foreach ($this->items as $item) {
            $total += $item->price;
        }
        // Uses customer data extensively
        if ($customer->isPremium()) {
            $total *= (1 - $customer->getDiscountRate());
        }
        if ($customer->getCountry() === 'US') {
            $total *= 1.08; // Tax
        }
        return $total;
    }
}

// Solution: Move behavior to the object with the data
class Customer {
    public function applyDiscount(float $amount): float {
        return $this->isPremium()
            ? $amount * (1 - $this->discountRate)
            : $amount;
    }

    public function applyTax(float $amount): float {
        return $this->country === 'US'
            ? $amount * 1.08
            : $amount;
    }
}
```

## Λίστα ελέγχου αναδιαμόρφωσης

Όταν εντοπίζετε μια μυρωδιά κωδικού:

1. **Προσδιορίστε** - Τι μυρωδιά είναι;
2. **Αξιολόγηση** - Πόσο σοβαρή είναι η επίπτωση;
3. **Σχέδιο** - Ποια τεχνική ανακατασκευής εφαρμόζεται;
4. **Δοκιμή** - Βεβαιωθείτε ότι υπάρχουν δοκιμές πριν από την ανακατασκευή
5. **Refactor** - Κάντε μικρές, σταδιακές αλλαγές
6. **Επαλήθευση** - Εκτελέστε δοκιμές μετά από κάθε αλλαγή

## Σχετική τεκμηρίωση

- Αρχές καθαρού κώδικα
- Οργάνωση κώδικα
- Δοκιμή βέλτιστων πρακτικών
