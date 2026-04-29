---
title: "יחידת דפוס עבודה"
---
## סקירה כללית

דפוס יחידת העבודה שומר רשימה של אובייקטים המושפעים מעסקה עסקית ומתאם כתיבת שינויים. זה מבטיח שכל השינויים הקשורים יתבצעו יחד או יחזרו לכישלון.

## מטרה

1. **ניהול עסקאות** - פעולות הקשורות לקבוצה
2. **שינוי מעקב** - עקוב אחר ישויות ששונו
3. **פעולות אצווה** - ייעול כתיבת מסד נתונים
4. **עקביות** - הבטח שלמות הנתונים

## יישום

### ממשק יחידת עבודה
```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Infrastructure;

interface UnitOfWorkInterface
{
    public function begin(): void;
    public function commit(): void;
    public function rollback(): void;
    public function registerNew(object $entity): void;
    public function registerDirty(object $entity): void;
    public function registerDeleted(object $entity): void;
}
```
### יישום בסיסי
```php
<?php

declare(strict_types=1);

namespace XoopsModules\MyModule\Infrastructure;

final class UnitOfWork implements UnitOfWorkInterface
{
    private array $newEntities = [];
    private array $dirtyEntities = [];
    private array $deletedEntities = [];
    private bool $inTransaction = false;

    public function __construct(
        private readonly \XoopsDatabase $db,
        private readonly EntityMapperRegistry $mappers
    ) {}

    public function begin(): void
    {
        if ($this->inTransaction) {
            throw new \RuntimeException('Transaction already started');
        }

        $this->db->query('START TRANSACTION');
        $this->inTransaction = true;
    }

    public function commit(): void
    {
        if (!$this->inTransaction) {
            throw new \RuntimeException('No transaction in progress');
        }

        try {
            $this->insertNew();
            $this->updateDirty();
            $this->deleteRemoved();

            $this->db->query('COMMIT');
            $this->clear();
        } catch (\Exception $e) {
            $this->rollback();
            throw $e;
        }
    }

    public function rollback(): void
    {
        if ($this->inTransaction) {
            $this->db->query('ROLLBACK');
            $this->clear();
        }
    }

    public function registerNew(object $entity): void
    {
        $id = spl_object_id($entity);
        $this->newEntities[$id] = $entity;
    }

    public function registerDirty(object $entity): void
    {
        $id = spl_object_id($entity);
        if (!isset($this->newEntities[$id])) {
            $this->dirtyEntities[$id] = $entity;
        }
    }

    public function registerDeleted(object $entity): void
    {
        $id = spl_object_id($entity);
        unset($this->newEntities[$id], $this->dirtyEntities[$id]);
        $this->deletedEntities[$id] = $entity;
    }

    private function insertNew(): void
    {
        foreach ($this->newEntities as $entity) {
            $mapper = $this->mappers->getMapper($entity::class);
            $mapper->insert($entity);
        }
    }

    private function updateDirty(): void
    {
        foreach ($this->dirtyEntities as $entity) {
            $mapper = $this->mappers->getMapper($entity::class);
            $mapper->update($entity);
        }
    }

    private function deleteRemoved(): void
    {
        foreach ($this->deletedEntities as $entity) {
            $mapper = $this->mappers->getMapper($entity::class);
            $mapper->delete($entity);
        }
    }

    private function clear(): void
    {
        $this->newEntities = [];
        $this->dirtyEntities = [];
        $this->deletedEntities = [];
        $this->inTransaction = false;
    }
}
```
## שימוש בשירותים
```php
final class ArticleService
{
    public function __construct(
        private readonly UnitOfWorkInterface $unitOfWork,
        private readonly ArticleRepository $articles,
        private readonly CommentRepository $comments
    ) {}

    public function publishWithComments(
        Article $article,
        array $comments
    ): void {
        $this->unitOfWork->begin();

        try {
            // Mark article as modified
            $article->publish();
            $this->unitOfWork->registerDirty($article);

            // Add new comments
            foreach ($comments as $comment) {
                $this->unitOfWork->registerNew($comment);
            }

            // Commit all changes together
            $this->unitOfWork->commit();

        } catch (\Exception $e) {
            $this->unitOfWork->rollback();
            throw $e;
        }
    }
}
```
## עם שילוב מאגר
```php
final class ArticleRepository implements ArticleRepositoryInterface
{
    public function __construct(
        private readonly UnitOfWorkInterface $unitOfWork,
        private readonly ArticleMapper $mapper
    ) {}

    public function add(Article $article): void
    {
        $this->unitOfWork->registerNew($article);
    }

    public function update(Article $article): void
    {
        $this->unitOfWork->registerDirty($article);
    }

    public function remove(Article $article): void
    {
        $this->unitOfWork->registerDeleted($article);
    }

    public function findById(ArticleId $id): ?Article
    {
        return $this->mapper->findById($id);
    }
}
```
## שיטות עבודה מומלצות

1. **עסקאות קצרות** - הקפידו על עסקאות קצרות
2. **אחריות אחת** - יחידת עבודה אחת לכל פעילות עסקית
3. ** גבולות ברורים** - הגדירו את היקף העסקאות בצורה ברורה
4. **טיפול בשגיאות** - טפל תמיד בתרחישים של חזרה לאחור
5. **הימנע מקינון** - אין לקנן יחידות עבודה

## תיעוד קשור

- Repository-Layer - תבנית מאגר
- שכבת שירות - תבנית שירות
- ../Database/Database-Schema - פעולות מסד נתונים
- Domain-Model - ישויות דומיין