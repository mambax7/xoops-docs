---
title: "डेटाबेस स्कीमा डिज़ाइन"
---
## अवलोकन

उचित डेटाबेस स्कीमा डिज़ाइन XOOPS मॉड्यूल प्रदर्शन और रखरखाव के लिए महत्वपूर्ण है। यह मार्गदर्शिका तालिका डिज़ाइन, संबंध, अनुक्रमण और माइग्रेशन के लिए सर्वोत्तम प्रथाओं को शामिल करती है।

## तालिका नामकरण परंपराएँ

### मानक प्रारूप

```
{prefix}_{modulename}_{tablename}
```

उदाहरण:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (जंक्शन टेबल)

### स्कीमा फ़ाइलों में

`{PREFIX}` प्लेसहोल्डर का उपयोग करें:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## कॉलम प्रकार

### अनुशंसित प्रकार

| डेटा | MySQL प्रकार | PHP प्रकार | विवरण |
|------|----||--|---||
| आईडी (ULID) | `VARCHAR(26)` | `string` | ULID पहचानकर्ता |
| आईडी (ऑटो) | `INT UNSIGNED AUTO_INCREMENT` | `int` | अनुक्रमिक आईडी |
| लघु पाठ | `VARCHAR(n)` | `string` | 255 वर्ण तक |
| लंबा पाठ | `TEXT` | `string` | असीमित पाठ |
| समृद्ध पाठ | `MEDIUMTEXT` | `string` | HTML सामग्री |
| बूलियन | `TINYINT(1)` | `bool` | सत्य/असत्य |
| एनम | `ENUM(...)` | `string` | निश्चित विकल्प |
| दिनांक | `DATE` | `DateTimeImmutable` | केवल तिथि |
| DateTime | `DATETIME` | `DateTimeImmutable` | दिनांक और समय |
| टाइमस्टैम्प | `INT UNSIGNED` | `int` | यूनिक्स टाइमस्टैम्प |
| कीमत | `DECIMAL(10,2)` | `float` | मुद्रा मूल्य |
| JSON | `JSON` | `array` | संरचित डेटा |

### इकाई स्कीमा उदाहरण

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

## रिश्ते

### एक-से-अनेक

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

### अनेक-से-अनेक

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

### स्व-संदर्भित (पदानुक्रम)

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

## अनुक्रमण रणनीति

### कब अनुक्रमित करें

| परिदृश्य | सूचकांक प्रकार |
|---|----|
| प्राथमिक कुंजी | PRIMARY |
| अनोखी बाधा | UNIQUE |
| विदेशी कुंजी | नियमित कुंजी |
| WHERE क्लॉज कॉलम | नियमित कुंजी |
| ORDER कॉलम द्वारा | नियमित कुंजी |
| पूर्ण-पाठ खोज | FULLTEXT |

### समग्र सूचकांक

आदेश मायने रखता है - सबसे चयनात्मक कॉलम पहले:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### सूचकांकों को कवर करना

तालिका लुकअप से बचने के लिए सभी पूछे गए कॉलम शामिल करें:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## प्रवास

### माइग्रेशन फ़ाइल संरचना

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

### कॉलम जोड़ना

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## सर्वोत्तम प्रथाएँ

1. **InnoDB@** का उपयोग करें - लेनदेन और विदेशी कुंजी का समर्थन करता है
2. **UTF8MB4@** - इमोजी सहित पूर्ण यूनिकोड समर्थन
3. **NULL@** नहीं - जब संभव हो तो निरर्थक कॉलम के बजाय डिफ़ॉल्ट का उपयोग करें
4. **उपयुक्त प्रकार** - छोटी स्ट्रिंग के लिए TEXT का उपयोग न करें
5. **सूचकांक संयमपूर्वक** - प्रत्येक सूचकांक धीमा लिखता है
6. **दस्तावेज़ स्कीमा** - कॉलम में COMMENT जोड़ें
7. **आरक्षित शब्दों से बचें** - कॉलम नाम के रूप में `order`, `group`, `key` का उपयोग न करें

## संबंधित दस्तावेज़ीकरण

- ../डेटाबेस-ऑपरेशंस - क्वेरी निष्पादन
- ../../04-API-Reference/Database/Criteria - क्वेरी बिल्डिंग
- माइग्रेशन - स्कीमा वर्जनिंग
- ../../01-आरंभ करना/कॉन्फ़िगरेशन/प्रदर्शन-अनुकूलन - क्वेरी अनुकूलन