---
title: "कार्य पैटर्न की इकाई"
---
## अवलोकन

कार्य पैटर्न की इकाई व्यावसायिक लेनदेन से प्रभावित वस्तुओं की एक सूची बनाए रखती है और परिवर्तनों को लिखने का समन्वय करती है। यह सुनिश्चित करता है कि सभी संबंधित परिवर्तन एक साथ किए गए हैं या विफल होने पर वापस ले लिए गए हैं।

## उद्देश्य

1. **लेन-देन प्रबंधन** - समूह से संबंधित संचालन
2. **ट्रैकिंग बदलें** - संशोधित संस्थाओं को ट्रैक करें
3. **बैच ऑपरेशंस** - ऑप्टिमाइज़ डेटाबेस लिखता है
4. **संगति** - डेटा अखंडता सुनिश्चित करें

## कार्यान्वयन

### कार्य इंटरफ़ेस की इकाई

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

### बुनियादी कार्यान्वयन

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

## सेवाओं में उपयोग

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

## रिपॉजिटरी इंटीग्रेशन के साथ

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

## सर्वोत्तम प्रथाएँ

1. **छोटे लेन-देन** - लेन-देन को संक्षिप्त रखें
2. **एकल जिम्मेदारी** - प्रति व्यवसाय संचालन कार्य की एक इकाई
3. **स्पष्ट सीमाएँ** - लेन-देन के दायरे को स्पष्ट रूप से परिभाषित करें
4. **त्रुटि प्रबंधन** - हमेशा रोलबैक परिदृश्यों को संभालें
5. **नेस्टेड से बचें** - काम की इकाइयों को नेस्टेड न करें

## संबंधित दस्तावेज़ीकरण

- रिपॉजिटरी-लेयर - रिपोजिटरी पैटर्न
- सेवा-परत - सेवा पैटर्न
- ../डेटाबेस/डेटाबेस-स्कीमा - डेटाबेस संचालन
- डोमेन-मॉडल - डोमेन इकाइयाँ