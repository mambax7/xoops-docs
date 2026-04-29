---
title: "Thiết kế lược đồ cơ sở dữ liệu"
---
## Tổng quan

Thiết kế lược đồ cơ sở dữ liệu phù hợp là rất quan trọng đối với hiệu suất và khả năng bảo trì của mô-đun XOOPS. Hướng dẫn này bao gồm các phương pháp hay nhất về thiết kế bảng, mối quan hệ, lập chỉ mục và di chuyển.

## Quy ước đặt tên bảng

### Định dạng chuẩn

```
{prefix}_{modulename}_{tablename}
```

Ví dụ:
- `xoops_mymodule_articles`
- `xoops_mymodule_categories`
- `xoops_mymodule_article_category` (bàn nối)

### Trong tệp lược đồ

Sử dụng trình giữ chỗ `{PREFIX}`:

```sql
CREATE TABLE `{PREFIX}_mymodule_articles` (
    ...
);
```

## Các loại cột

### Loại được đề xuất

| Dữ liệu | Loại MySQL | Loại PHP | Mô tả |
|------|--------------|----------|-------------|
| ID (ULID) | `VARCHAR(26)` | `string` | Mã định danh ULID |
| ID (Tự động) | `INT UNSIGNED AUTO_INCREMENT` | `int` | ID tuần tự |
| Văn bản ngắn | `VARCHAR(n)` | `string` | Lên tới 255 ký tự |
| Văn bản dài | `TEXT` | `string` | Văn bản không giới hạn |
| Văn bản phong phú | `MEDIUMTEXT` | `string` | Nội dung HTML |
| Boolean | `TINYINT(1)` | `bool` | Đúng/sai |
| liệt kê | `ENUM(...)` | `string` | Tùy chọn cố định |
| Ngày | `DATE` | `DateTimeImmutable` | Chỉ ngày |
| Ngày Giờ | `DATETIME` | `DateTimeImmutable` | Ngày giờ |
| Dấu thời gian | `INT UNSIGNED` | `int` | Dấu thời gian Unix |
| Giá | `DECIMAL(10,2)` | `float` | Giá trị tiền tệ |
| JSON | `JSON` | `array` | Dữ liệu có cấu trúc |

### Ví dụ về lược đồ thực thể

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

## Mối quan hệ

### Một-nhiều

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

### Nhiều-nhiều

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

### Tự tham chiếu (Phân cấp)

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

## Chiến lược lập chỉ mục

### Khi nào cần lập chỉ mục

| Kịch bản | Loại chỉ mục |
|----------|----------|
| Khóa chính | CHÍNH |
| Ràng buộc duy nhất | ĐỘC ĐÁO |
| Khóa ngoại | KEY thông thường |
| cột mệnh đề WHERE | KEY thông thường |
| ĐẶT HÀNG THEO cột | KEY thông thường |
| Tìm kiếm toàn văn | ĐẦY ĐỦ |

### Chỉ mục tổng hợp

Vấn đề thứ tự - cột được chọn lọc nhiều nhất trước tiên:

```sql
-- Good: matches WHERE status = 'published' ORDER BY created_at
KEY `idx_status_created` (`status`, `created_at`)

-- Query optimization
SELECT * FROM articles
WHERE status = 'published'
ORDER BY created_at DESC
```

### Bao gồm các chỉ mục

Bao gồm tất cả các cột được truy vấn để tránh tra cứu bảng:

```sql
-- Covers: SELECT title, status FROM articles WHERE author_id = ?
KEY `idx_author_covering` (`author_id`, `title`, `status`)
```

## Di chuyển

### Cấu trúc tệp di chuyển

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

### Thêm cột

```php
// migrations/002_add_status_column.php
public function up(\XoopsDatabase $db): void
{
    $table = $db->prefix('mymodule_articles');
    $db->queryF("ALTER TABLE `{$table}` ADD COLUMN `status` ENUM('draft','published') DEFAULT 'draft' AFTER `title`");
    $db->queryF("CREATE INDEX `idx_status` ON `{$table}` (`status`)");
}
```

## Các phương pháp hay nhất

1. **Sử dụng InnoDB** - Hỗ trợ giao dịch và khóa ngoại
2. **UTF8MB4** - Hỗ trợ Unicode đầy đủ bao gồm cả biểu tượng cảm xúc
3. **NOT NULL** - Sử dụng các giá trị mặc định thay vì các cột có thể rỗng khi có thể
4. **Các loại thích hợp** - Không sử dụng TEXT cho chuỗi ngắn
5. **Chỉ mục một cách tiết kiệm** - Mỗi chỉ mục sẽ làm chậm quá trình ghi
6. **Lược đồ tài liệu** - Thêm BÌNH LUẬN vào các cột
7. **Tránh các từ dành riêng** - Không sử dụng `order`, `group`, `key` làm tên cột

## Tài liệu liên quan

- ../Database-Operations - Thực hiện truy vấn
- ../../04-API-Reference/Database/Tiêu chí - Xây dựng truy vấn
- Di chuyển - Lập phiên bản lược đồ
- ../../01-Bắt đầu/Cấu hình/Tối ưu hóa hiệu suất - Tối ưu hóa truy vấn