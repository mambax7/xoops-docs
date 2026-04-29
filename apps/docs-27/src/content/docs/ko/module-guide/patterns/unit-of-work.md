---
title: "작업 단위 패턴"
---

## 개요

작업 단위 패턴은 비즈니스 트랜잭션의 영향을 받는 개체 목록을 유지 관리하고 변경 사항 기록을 조정합니다. 관련된 모든 변경 사항이 함께 커밋되거나 실패 시 롤백되도록 보장합니다.

## 목적

1. **거래 관리** - 그룹 관련 업무
2. **변경 내용 추적** - 수정된 엔터티 추적
3. **일괄 작업** - 데이터베이스 쓰기 최적화
4. **일관성** - 데이터 무결성 보장

## 구현

### 작업 단위 인터페이스

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

### 기본 구현

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

## 서비스에서의 사용

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

## 리포지토리 통합 포함

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

## 모범 사례

1. **짧은 거래** - 거래를 간략하게 유지하세요.
2. **단일 책임** - 비즈니스 운영당 하나의 작업 단위
3. **명확한 경계** - 거래 범위를 명확하게 정의합니다.
4. **오류 처리** - 항상 롤백 시나리오 처리
5. **중첩 방지** - 작업 단위를 중첩하지 마세요.

## 관련 문서

- 리포지토리 레이어 - 리포지토리 패턴
- 서비스 레이어 - 서비스 패턴
-../Database/Database-Schema - 데이터베이스 작업
- 도메인 모델 - 도메인 엔터티
