---
title: "หน่วยของรูปแบบการทำงาน"
---
## ภาพรวม

รูปแบบหน่วยงานจะเก็บรักษารายการออบเจ็กต์ที่ได้รับผลกระทบจากธุรกรรมทางธุรกิจและประสานงานในการเขียนการเปลี่ยนแปลง ช่วยให้มั่นใจได้ว่าการเปลี่ยนแปลงที่เกี่ยวข้องทั้งหมดจะกระทำร่วมกันหรือย้อนกลับเมื่อล้มเหลว

## วัตถุประสงค์

1. **การจัดการธุรกรรม** - การดำเนินการที่เกี่ยวข้องกับกลุ่ม
2. **การติดตามการเปลี่ยนแปลง** - ติดตามเอนทิตีที่แก้ไข
3. **การดำเนินการเป็นกลุ่ม** - เพิ่มประสิทธิภาพการเขียนฐานข้อมูล
4. **ความสม่ำเสมอ** - ตรวจสอบความสมบูรณ์ของข้อมูล

## การนำไปปฏิบัติ

### หน่วยงานอินเทอร์เฟซการทำงาน
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
### การใช้งานขั้นพื้นฐาน
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
## การใช้งานในบริการ
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
## ด้วยการรวมพื้นที่เก็บข้อมูล
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
## แนวทางปฏิบัติที่ดีที่สุด

1. **ธุรกรรมระยะสั้น** - ทำให้ธุรกรรมสั้นกระชับ
2. **ความรับผิดชอบเดี่ยว** - งานหนึ่งหน่วยต่อการดำเนินธุรกิจ
3. **Clear Boundaries** - กำหนดขอบเขตการทำธุรกรรมให้ชัดเจน
4. **การจัดการข้อผิดพลาด** - จัดการกับสถานการณ์การย้อนกลับเสมอ
5. **หลีกเลี่ยงการซ้อนกัน** - อย่าซ้อนหน่วยงาน

## เอกสารที่เกี่ยวข้อง

- Repository-Layer - รูปแบบพื้นที่เก็บข้อมูล
- Service-Layer - รูปแบบการบริการ
- ../Database/Database-Schema - การดำเนินงานฐานข้อมูล
- โดเมน-โมเดล - เอนทิตีโดเมน