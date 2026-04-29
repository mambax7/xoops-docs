---
title: "Unit of Work Pattern"
---

## Επισκόπηση

Το μοτίβο Unit of Work διατηρεί μια λίστα αντικειμένων που επηρεάζονται από μια επιχειρηματική συναλλαγή και συντονίζει τη διαγραφή αλλαγών. Διασφαλίζει ότι όλες οι σχετικές αλλαγές πραγματοποιούνται μαζί ή επαναφέρονται σε περίπτωση αποτυχίας.

## Σκοπός

1. **Διαχείριση Συναλλαγών** - Δραστηριότητες που σχετίζονται με τον Όμιλο
2. **Αλλαγή παρακολούθησης** - Παρακολούθηση τροποποιημένων οντοτήτων
3. **Λειτουργίες παρτίδας** - Βελτιστοποίηση εγγραφής βάσης δεδομένων
4. **Συνέπεια** - Διασφάλιση της ακεραιότητας των δεδομένων

## Υλοποίηση

## # Ενότητα διεπαφής εργασίας

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

## # Βασική Υλοποίηση

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

## Χρήση στις Υπηρεσίες

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

## Με ενσωμάτωση αποθετηρίου

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

## Βέλτιστες πρακτικές

1. **Σύντομες Συναλλαγές** - Κρατήστε τις συναλλαγές σύντομες
2. **Ενιαία ευθύνη** - Μία μονάδα εργασίας ανά επιχειρηματική λειτουργία
3. **Σαφής όρια** - Καθορίστε με σαφήνεια το εύρος της συναλλαγής
4. **Χειρισμός σφαλμάτων** - Να χειρίζεστε πάντα τα σενάρια επαναφοράς
5. **Αποφύγετε τις ένθετες** - Μην ενσωματώνετε μονάδες εργασίας

## Σχετική τεκμηρίωση

- Repository-Layer - Μοτίβο αποθετηρίου
- Service-Layer - Μοτίβο υπηρεσίας
- ../Database/Database-Schema - Λειτουργίες βάσης δεδομένων
- Domain-Model - Οντότητες τομέα
