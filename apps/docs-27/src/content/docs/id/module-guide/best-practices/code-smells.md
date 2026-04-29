---
title: "Kode Berbau dalam Pengembangan XOOPS"
---

## Ikhtisar

Bau kode adalah indikator potensi masalah dalam kode. Hal ini tidak berarti bahwa kode tersebut rusak, namun menyarankan area yang dapat memperoleh manfaat dari pemfaktoran ulang.

## Bau Kode Umum

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

## Kembung

### Metode Panjang

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

### Kelas Besar (Objek Dewa)

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

### Daftar Parameter Panjang

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

## Pelaku Orientasi Objek

### Ganti Pernyataan

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

### Bidang Sementara

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

## Ubah Pencegah

### Perubahan Divergen

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

### Bedah Senapan

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

## Bahan habis pakai

### Kode Mati

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

### Kode Duplikat

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

## Skrup

### Fitur Iri

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

## Daftar Periksa Pemfaktoran Ulang

Saat Anda melihat bau kode:

1. **Identifikasi** - Bau apa itu?
2. **Menilai** - Seberapa parah dampaknya?
3. **Rencana** - Teknik pemfaktoran ulang apa yang berlaku?
4. **Tes** - Pastikan ada pengujian sebelum pemfaktoran ulang
5. **Refactor** - Membuat perubahan kecil dan bertahap
6. **Verifikasi** - Jalankan pengujian setelah setiap perubahan

## Dokumentasi Terkait

- Prinsip Kode Bersih
- Organisasi Kode
- Menguji Praktik Terbaik
