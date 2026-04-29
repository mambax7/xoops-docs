---
title: "แนวทางปฏิบัติที่ดีที่สุดสำหรับการพัฒนาโมดูล"
---
## ภาพรวม

เอกสารนี้รวบรวมแนวทางปฏิบัติที่ดีที่สุดสำหรับการพัฒนาโมดูล XOOPS คุณภาพสูง การปฏิบัติตามหลักเกณฑ์เหล่านี้ทำให้มั่นใจได้ว่าโมดูลสามารถบำรุงรักษา ปลอดภัย และมีประสิทธิภาพ

## สถาปัตยกรรม

### ติดตามสถาปัตยกรรมที่สะอาดตา

จัดระเบียบโค้ดเป็นเลเยอร์:
```
src/
├── Domain/          # Business logic, entities
├── Application/     # Use cases, services
├── Infrastructure/  # Database, external services
└── Presentation/    # Controllers, templates
```
### ความรับผิดชอบเดียว

แต่ละชั้นเรียนควรมีเหตุผลเดียวในการเปลี่ยนแปลง:
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
### การฉีดพึ่งพา

ฉีดการพึ่งพา อย่าสร้างมันขึ้นมา:
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
## คุณภาพรหัส

### ประเภทความปลอดภัย

ใช้ประเภทและการประกาศประเภทที่เข้มงวด:
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
### การจัดการข้อผิดพลาด

ใช้ข้อยกเว้นอย่างเหมาะสม:
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
### ความปลอดภัยเป็นศูนย์

หลีกเลี่ยงค่าว่างหากเป็นไปได้:
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
## ฐานข้อมูล

### ใช้เกณฑ์สำหรับการสืบค้น
```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created_at');
$criteria->setOrder('DESC');
$criteria->setLimit($limit);

$items = $handler->getObjects($criteria);
```
### Escape การป้อนข้อมูลของผู้ใช้
```php
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d AND title = %s",
    $db->prefix('mymodule_items'),
    intval($id),
    $db->quoteString($title)
);
```
### ใช้ธุรกรรม
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
## ความปลอดภัย

### ตรวจสอบอินพุตเสมอ
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
### ใช้โทเค็น CSRF
```php
// In form
$form->addElement(new XoopsFormHiddenToken());

// On submit
if (!$GLOBALS['xoopsSecurity']->check()) {
    redirect_header('index.php', 3, 'Invalid token');
}
```
### ตรวจสอบสิทธิ์
```php
if (!$helper->isUserAdmin()) {
    redirect_header('index.php', 3, _NOPERM);
}

if (!$permHandler->isGranted('edit', $categoryId)) {
    throw new UnauthorizedException();
}
```
## ประสิทธิภาพ

### ใช้แคช
```php
$cache = $helper->getCache();
$cacheKey = "articles_{$categoryId}_{$limit}";

$articles = $cache->read($cacheKey);
if ($articles === false) {
    $articles = $handler->getArticles($categoryId, $limit);
    $cache->write($cacheKey, $articles, 3600);
}
```
### เพิ่มประสิทธิภาพการค้นหา
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
## การทดสอบ

### เขียนการทดสอบหน่วย
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
## เอกสารที่เกี่ยวข้อง

- Clean-Code - หลักการของ Clean Code
- รหัสองค์กร - โครงสร้างโครงการ
- การทดสอบ - คู่มือการทดสอบ
- ../02-Core-Concepts/Security/Security-Best-Practices - คู่มือความปลอดภัย