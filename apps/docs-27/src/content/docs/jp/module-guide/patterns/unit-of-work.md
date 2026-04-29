---
title: "ユニットオブワークパターン"
---

## 概要

ユニットオブワークパターンはビジネストランザクションに影響を受けるオブジェクトのリストを維持し、書き込み変更を調整します。関連するすべての変更がまとめてコミットされ、失敗時にはロールバックされることを確保します。

## 目的

1. **トランザクション管理** - 関連する操作をグループ化
2. **変更追跡** - 変更されたエンティティを追跡
3. **バッチ操作** - データベース書き込みを最適化
4. **一貫性** - データ整合性を確保

## 実装

### ユニットオブワークインターフェース

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

### 基本的な実装

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
            throw new \RuntimeException('トランザクションは既に開始されています');
        }

        $this->db->query('START TRANSACTION');
        $this->inTransaction = true;
    }

    public function commit(): void
    {
        if (!$this->inTransaction) {
            throw new \RuntimeException('進行中のトランザクションがありません');
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

## サービスでの使用

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
            // 記事が変更されたとしてマーク
            $article->publish();
            $this->unitOfWork->registerDirty($article);

            // 新しいコメントを追加
            foreach ($comments as $comment) {
                $this->unitOfWork->registerNew($comment);
            }

            // すべての変更をまとめてコミット
            $this->unitOfWork->commit();

        } catch (\Exception $e) {
            $this->unitOfWork->rollback();
            throw $e;
        }
    }
}
```

## リポジトリ統合を含む

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

## ベストプラクティス

1. **短いトランザクション** - トランザクションは簡潔に保つ
2. **単一責任** - 1つのユニットオブワークは1つのビジネス操作
3. **明確な境界** - トランザクションスコープを明確に定義
4. **エラーハンドリング** - 常にロールバックシナリオをハンドル
5. **ネストを避ける** - ユニットオブワークをネストしない

## 関連ドキュメント

- リポジトリレイヤー - リポジトリパターン
- サービスレイヤー - サービスパターン
- ../Database/Database-Schema - データベース操作
- ドメインモデル - ドメインエンティティ
