---
title: "Σχεδιασμός Σχήματος Βάσης Δεδομένων"
---

## Επισκόπηση

Ο σωστός σχεδιασμός σχήματος βάσης δεδομένων είναι ζωτικής σημασίας για την απόδοση και τη συντηρησιμότητα της μονάδας XOOPS. Αυτός ο οδηγός καλύπτει τις βέλτιστες πρακτικές για τη σχεδίαση πινάκων, τις σχέσεις, την ευρετηρίαση και τις μετεγκαταστάσεις.

## Συμβάσεις ονομασίας πινάκων

## # Τυπική μορφή

```
{prefix}_{modulename}_{tablename}
```

Παραδείγματα:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (πίνακας διασταύρωσης)

## # Σε Αρχεία Σχήματος

Χρησιμοποιήστε το σύμβολο κράτησης θέσης `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Τύποι στηλών

## # Προτεινόμενοι τύποι

| Δεδομένα | MySQL Type | PHP Type | Description |
|------|-----------|----------|-------------|
| ID (ULID) | `VARCHAR(26) ` | ` string` | ULID αναγνωριστικά |
| ID (Auto) | `INT UNSIGNED AUTO_INCREMENT ` | ` int` | Διαδοχικά αναγνωριστικά |
| Σύντομο κείμενο | `VARCHAR(n) ` | ` string` | Έως 255 χαρακτήρες |
| Μακρύ κείμενο | `TEXT ` | ` string` | Απεριόριστο κείμενο |
| Πλούσιο κείμενο | `MEDIUMTEXT ` | ` string` | HTML περιεχόμενο |
| Boolean | `TINYINT(1) ` | ` bool` | True/false |
| Enum | `ENUM(...) ` | ` string` | Διορθώθηκαν επιλογές |
| Ημερομηνία | `DATE ` | ` DateTimeImmutable` | Μόνο ημερομηνία |
| Ημερομηνία Ώρα | `DATETIME ` | ` DateTimeImmutable` | Ημερομηνία και ώρα |
| Χρονική σήμανση | `INT UNSIGNED ` | ` int` | Unix timestamp |
| Τιμή | `DECIMAL(10,2) ` | ` float` | Τιμές νομισμάτων |
| JSON | `JSON ` | ` array` | Δομημένα δεδομένα |

## # Παράδειγμα σχήματος οντότητας

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) NOT NULL COMMENT 'ULID identifier',
    `title` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `content` MEDIUMTEXT,
    `summary` TEXT,
    `status` ENUM('draft', 'pending', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT UNSIGNED NOT NULL,
    `category_id` INT UNSIGNED,
    `views` INT UNSIGNED DEFAULT 0,
    `is_featured` TINYINT(1) DEFAULT 0,
    `published_at` DATETIME DEFAULT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (`id`),
    UNIQUE KEY `idx_slug` (`slug`),
    KEY `idx_status` (`status`),
    KEY `idx_author` (`author_id`),
    KEY `idx_category` (`category_id`),
    KEY `idx_published` (`published_at`),
    KEY `idx_featured` (`is_featured`, `published_at`),

    CONSTRAINT `fk_article_author`
        FOREIGN KEY (`author_id`) REFERENCES `{PREFIX}_users` (`uid`)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT `fk_article_category`
        FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Σχέσεις

## # Ένα προς πολλά

```sql
-- Categories (one)
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);

-- Articles (many)
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `category_id` INT UNSIGNED,
    FOREIGN KEY (`category_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
);
```

## # Πολλά-προς-Πολλά

```sql
-- Articles
CREATE TABLE `{PREFIX}_mymodule_articles` (
    `id` VARCHAR(26) PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL
);

-- Tags
CREATE TABLE `{PREFIX}_mymodule_tags` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    UNIQUE KEY (`name`)
);

-- Junction table
CREATE TABLE `{PREFIX}_mymodule_article_tags` (
    `article_id` VARCHAR(26) NOT NULL,
    `tag_id` INT UNSIGNED NOT NULL,
    PRIMARY KEY (`article_id`, `tag_id`),
    FOREIGN KEY (`article_id`) REFERENCES `{PREFIX}_mymodule_articles` (`id`) ON DELETE CASCADE,
    FOREIGN KEY (`tag_id`) REFERENCES `{PREFIX}_mymodule_tags` (`id`) ON DELETE CASCADE
);
```

## # Αυτοαναφορά (Ιεραρχία)

```sql
CREATE TABLE `{PREFIX}_mymodule_categories` (
    `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `parent_id` INT UNSIGNED DEFAULT NULL,
    `name` VARCHAR(255) NOT NULL,
    `path` VARCHAR(1000) COMMENT 'Materialized path: /1/5/12/',
    `depth` TINYINT UNSIGNED DEFAULT 0,

    KEY `idx_parent` (`parent_id`),
    KEY `idx_path` (`path`(255)),

    FOREIGN KEY (`parent_id`) REFERENCES `{PREFIX}_mymodule_categories` (`id`)
        ON DELETE SET NULL
);
```

## Στρατηγική ευρετηρίασης

## # Πότε να γίνει ευρετήριο

| Σενάριο | Τύπος ευρετηρίου |
|----------|-----------|
| Πρωτεύον κλειδί | PRIMARY |
| Μοναδικός περιορισμός | UNIQUE |
| Ξένο κλειδί | Κανονικό KEY |
| WHERE στήλη ρήτρας | Κανονικό KEY |
| ORDER ΚΑΤΑ στήλη | Κανονικό KEY |
| Αναζήτηση πλήρους κειμένου | FULLTEXT |

## # Σύνθετα Ευρετήρια

Η παραγγελία έχει σημασία - πρώτα η πιο επιλεκτική στήλη:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

## # Καλυπτικοί δείκτες

Συμπεριλάβετε όλες τις στήλες που υποβλήθηκαν ερωτήματα για να αποφύγετε την αναζήτηση πίνακα:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Μεταναστεύσεις

## # Δομή αρχείου μετεγκατάστασης

```php
// migrations/001_create_articles.php
<?php

return new class {
    public function up(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');

        $sql = "CREATE TABLE IF NOT EXISTS `{$prefix}` (
            `id` VARCHAR(26) NOT NULL,
            `title` VARCHAR(255) NOT NULL,
            `created_at` DATETIME NOT NULL,
            PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $prefix = $db->prefix('mymodule_articles');
        $db->queryF("DROP TABLE IF EXISTS `{$prefix}`");
    }
};
```

## # Προσθήκη στηλών

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Βέλτιστες πρακτικές

1. **Χρησιμοποιήστε το InnoDB** - Υποστηρίζει συναλλαγές και ξένα κλειδιά
2. **UTF8MB4** - Πλήρης υποστήριξη Unicode συμπεριλαμβανομένων των emojis
3. **NOT NULL** - Χρησιμοποιήστε προεπιλογές αντί για μηδενιζόμενες στήλες όταν είναι δυνατόν
4. **Κατάλληλοι τύποι** - Μην χρησιμοποιείτε το TEXT για σύντομες χορδές
5. **Δημιουργία ευρετηρίου με φειδώ** - Κάθε δείκτης επιβραδύνει την εγγραφή
6. **Σχήμα εγγράφου** - Προσθήκη COMMENT σε στήλες
7. **Αποφύγετε τις κρατημένες λέξεις** - Μην χρησιμοποιείτε τα `order `, ` group `, ` key` ως ονόματα στηλών

## Σχετική τεκμηρίωση

- ../Βάση δεδομένων-Λειτουργίες - Εκτέλεση ερωτήματος
- ../../04-API-Reference/Database/Criteria - Κτίριο ερωτημάτων
- Μετακινήσεις - Εκδόσεις σχήματος
- ../../01-Getting-Started/Configuration/Performance-Optimization - Βελτιστοποίηση ερωτημάτων
