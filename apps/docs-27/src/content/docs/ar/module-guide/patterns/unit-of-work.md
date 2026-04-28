---
title: "نمط وحدة العمل"
dir: rtl
lang: ar
---

## نظرة عامة

نمط وحدة العمل يحتفظ بقائمة الكائنات المتأثرة بمعاملة عمل وينسق كتابة التغييرات. يضمن التزام جميع التغييرات ذات الصلة معاً أو التراجع عند الفشل.

## الغرض

1. **إدارة المعاملات** - تجميع العمليات ذات الصلة
2. **تتبع التغييرات** - تتبع الكيانات المعدلة
3. **العمليات الدفعية** - تحسين كتابات قاعدة البيانات
4. **الاتساق** - ضمان تكامل البيانات

## التنفيذ

### واجهة وحدة العمل

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

### التنفيذ الأساسي

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

## الاستخدام في الخدمات

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
            // علم المقالة كمعدلة
            $article->publish();
            $this->unitOfWork->registerDirty($article);

            // إضافة تعليقات جديدة
            foreach ($comments as $comment) {
                $this->unitOfWork->registerNew($comment);
            }

            // التزم بجميع التغييرات معاً
            $this->unitOfWork->commit();

        } catch (\Exception $e) {
            $this->unitOfWork->rollback();
            throw $e;
        }
    }
}
```

## مع تكامل المستودع

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

## أفضل الممارسات

1. **معاملات قصيرة** - احتفظ بالمعاملات مختصرة
2. **مسؤولية واحدة** - وحدة عمل واحدة لكل عملية عمل
3. **حدود واضحة** - حدد نطاق المعاملة بوضوح
4. **معالجة الأخطاء** - تعامل دائماً مع سيناريوهات التراجع
5. **تجنب التداخل** - لا تتداخل وحدات العمل

## الوثائق ذات الصلة

- Repository-Layer - نمط المستودع
- Service-Layer - نمط الخدمة
- ../Database/Database-Schema - عمليات قاعدة البيانات
- Domain-Model - كيانات المجال
