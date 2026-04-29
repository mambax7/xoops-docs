---
title: "ทำความสะอาดหลักการโค้ดสำหรับ XOOPS"
---
## ภาพรวม

Clean Code คือโค้ดที่อ่าน เข้าใจ และบำรุงรักษาได้ง่าย คู่มือนี้ครอบคลุมถึงหลักการของ Clean Code ที่ใช้กับการพัฒนาโมดูล XOOPS โดยเฉพาะ

## หลักการสำคัญ
```
mermaid
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
## ชื่อที่มีความหมาย

### ตัวแปร
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
### ฟังก์ชั่น
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
### ชั้นเรียน
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
## ฟังก์ชั่นขนาดเล็ก

### ความรับผิดชอบเดียว
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
### ความยาวของฟังก์ชัน

ทำให้ฟังก์ชั่นสั้น - ควรต่ำกว่า 20 บรรทัด:
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
## DRY หลักการ (อย่าพูดซ้ำ)

### แยกรหัสทั่วไป
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
## การจัดการข้อผิดพลาด

### ใช้ข้อยกเว้นอย่างเหมาะสม
```php
// Bad - generic exceptions
throw new Exception('Error');

// Good - specific exceptions
throw new ArticleNotFoundException($articleId);
throw new PermissionDeniedException('Cannot edit article');
throw new ValidationException(['title' => 'Title is required']);
```
### จัดการกับข้อผิดพลาดอย่างสง่างาม
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
## ความคิดเห็น

### เมื่อใดที่จะแสดงความคิดเห็น
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
## องค์กรรหัส

### โครงสร้างชั้นเรียน
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
## รายการตรวจสอบโค้ดที่สะอาด

- [ ] ชื่อมีความหมายและออกเสียงได้
- [ ] ฟังก์ชั่นทำสิ่งเดียวเท่านั้น
- [ ] ฟังก์ชั่นมีขนาดเล็ก (< 20 บรรทัด)
- [ ] ไม่มีรหัสที่ซ้ำกัน
- [ ] การจัดการข้อผิดพลาดอย่างเหมาะสมพร้อมข้อยกเว้นเฉพาะ
- [ ] ความคิดเห็นอธิบายว่า "ทำไม" ไม่ใช่ "อะไร"
- [ ] การจัดรูปแบบและสไตล์ที่สอดคล้องกัน
- [ ] ไม่มีเลขวิเศษหรือสายอักขระ
- [ ] การพึ่งพาถูกฉีดเข้าไป ไม่ใช่สร้างขึ้น

## เอกสารที่เกี่ยวข้อง

- องค์กรรหัส
- การจัดการข้อผิดพลาด
- การทดสอบแนวทางปฏิบัติที่ดีที่สุด
- PHP มาตรฐาน