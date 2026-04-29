---
title: "데이터베이스 스키마 디자인"
---

## 개요

적절한 데이터베이스 스키마 디자인은 XOOPS 모듈 성능과 유지 관리에 매우 중요합니다. 이 가이드에서는 테이블 디자인, 관계, 인덱싱 및 마이그레이션에 대한 모범 사례를 다룹니다.

## 테이블 명명 규칙

### 표준 형식

```
{prefix}_{modulename}_{tablename}
```

예:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (접합 테이블)

### 스키마 파일에서

`{PREFIX}` 자리 표시자를 사용합니다.

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## 열 유형

### 권장 유형

| 데이터 | MySQL 유형 | PHP 유형 | 설명 |
|------|-----------|----------|-------------|
| 아이디(ULID) | `VARCHAR(26)` | `string` | ULID 식별자 |
| 아이디(자동) | `INT UNSIGNED AUTO_INCREMENT` | `int` | 순차 ID |
| 짧은 텍스트 | `VARCHAR(n)` | `string` | 최대 255자 |
| 긴 텍스트 | `TEXT` | `string` | 무제한 텍스트 |
| 리치 텍스트 | `MEDIUMTEXT` | `string` | HTML 콘텐츠 |
| 불리언 | `TINYINT(1)` | `bool` | 참/거짓 |
| 열거형 | `ENUM(...)` | `string` | 고정 옵션 |
| 날짜 | `DATE` | `DateTimeImmutable` | 날짜만 |
| 날짜/시간 | `DATETIME` | `DateTimeImmutable` | 날짜 및 시간 |
| 타임스탬프 | `INT UNSIGNED` | `int` | 유닉스 타임스탬프 |
| 가격 | `DECIMAL(10,2)` | `float` | 통화 가치 |
| JSON | `JSON` | `array` | 구조화된 데이터 |

### 엔터티 스키마 예

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

## 관계

### 일대다

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

### 다대다

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

### 자기 참조(계층 구조)

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

## 인덱싱 전략

### 색인을 생성할 시기

| 시나리오 | 지수 유형 |
|----------|-----------|
| 기본 키 | 기본 |
| 고유 제약조건 | 독특한 |
| 외래 키 | 일반 키 |
| WHERE 절 열 | 일반 키 |
| ORDER BY 열 | 일반 키 |
| 전체 텍스트 검색 | 전문 |

### 복합 인덱스

순서가 중요합니다. 가장 선택적인 열부터 먼저:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### 커버링 인덱스

테이블 조회를 방지하려면 쿼리된 모든 열을 포함하세요.

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## 마이그레이션

### 마이그레이션 파일 구조

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

### 열 추가

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## 모범 사례

1. **InnoDB 사용** - 트랜잭션 및 외래 키 지원
2. **UTF8MB4** - 이모티콘을 포함한 전체 유니코드 지원
3. **NULL 아님** - 가능하면 null 허용 열 대신 기본값을 사용합니다.
4. **적절한 유형** - 짧은 문자열에 TEXT를 사용하지 마세요.
5. **인덱스를 아껴서** - 각 인덱스로 인해 쓰기 속도가 느려집니다.
6. **문서 스키마** - 열에 COMMENT 추가
7. **예약어 피하기** - `order`, `group`, `key`을 열 이름으로 사용하지 마세요.

## 관련 문서

-../Database-Operations - 쿼리 실행
-../../04-API-Reference/Database/Criteria - 쿼리 작성
- 마이그레이션 - 스키마 버전 관리
-../../01-시작하기/구성/성능-최적화 - 쿼리 최적화
