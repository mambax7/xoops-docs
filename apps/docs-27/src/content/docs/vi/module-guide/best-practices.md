---
title: "Thực tiễn tốt nhất về phát triển mô-đun"
---
## Tổng quan

Tài liệu này tổng hợp các phương pháp hay nhất để phát triển XOOPS modules chất lượng cao. Việc tuân theo các nguyên tắc này đảm bảo modules có ​​thể bảo trì, an toàn và hoạt động hiệu quả.

## Kiến trúc

### Theo đuổi Kiến trúc Sạch

Sắp xếp mã thành các lớp:

```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```

### Trách nhiệm duy nhất

Mỗi class phải có một lý do để thay đổi:

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

### Chèn phụ thuộc

Tiêm các phần phụ thuộc, đừng tạo chúng:

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

## Chất lượng mã

### Loại an toàn

Sử dụng các loại nghiêm ngặt và khai báo kiểu:

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

### Xử lý lỗi

Sử dụng ngoại lệ một cách thích hợp:

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

### Không an toàn

Tránh null nếu có thể:

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

## Cơ sở dữ liệu

### Sử dụng Tiêu chí cho Truy vấn

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```

### Thoát khỏi đầu vào của người dùng

```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```

### Sử dụng Giao dịch

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

## Bảo mật

### Luôn xác thực đầu vào

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

### Sử dụng Token CSRF

```php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```

### Kiểm tra quyền

```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```

## Hiệu suất

### Sử dụng bộ nhớ đệm

```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```

### Tối ưu hóa truy vấn

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

## Thử nghiệm

### Viết bài kiểm tra đơn vị

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

## Tài liệu liên quan

- Clean-Code - Nguyên tắc clean code
- Mã-Tổ chức - Cấu trúc dự án
- Kiểm tra - Hướng dẫn kiểm tra
- ../02-Core-Concepts/Security/Security-Best-Thực hành - Hướng dẫn bảo mật