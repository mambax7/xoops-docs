---
title: "Mẫu đơn vị công việc"
---
## Tổng quan

Mẫu Đơn vị công việc duy trì danh sách các đối tượng bị ảnh hưởng bởi giao dịch kinh doanh và điều phối việc viết ra các thay đổi. Nó đảm bảo tất cả các thay đổi liên quan được thực hiện cùng nhau hoặc được khôi phục khi có lỗi.

## Mục đích

1. **Quản lý giao dịch** - Hoạt động liên quan đến nhóm
2. **Theo dõi thay đổi** - Theo dõi các thực thể đã sửa đổi
3. **Hoạt động hàng loạt** - Tối ưu hóa việc ghi cơ sở dữ liệu
4. **Tính nhất quán** - Đảm bảo tính toàn vẹn dữ liệu

## Triển khai

### Đơn vị giao diện công việc

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

### Triển khai cơ bản

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

## Cách sử dụng trong Dịch vụ

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

## Với tích hợp kho lưu trữ

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

## Các phương pháp hay nhất

1. **Giao dịch ngắn** - Giữ giao dịch ngắn gọn
2. **Trách nhiệm duy nhất** - Một đơn vị công việc cho mỗi hoạt động kinh doanh
3. **Ranh giới rõ ràng** - Xác định phạm vi giao dịch rõ ràng
4. **Xử lý lỗi** - Luôn xử lý các tình huống khôi phục
5. **Tránh lồng nhau** - Không lồng các đơn vị công việc

## Tài liệu liên quan

- Lớp lưu trữ - Mẫu kho lưu trữ
- Lớp dịch vụ - Mẫu dịch vụ
- ../Database/Database-Schema - Thao tác với cơ sở dữ liệu
- Domain-Model - Thực thể miền