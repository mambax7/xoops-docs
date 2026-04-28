---
title: "Opérations de base de données"
---

## Aperçu

XOOPS fournit une couche d'abstraction de base de données qui prend en charge à la fois les motifs hérités procéduraux et les approches modernes orientées objet. Ce guide couvre les opérations de base de données courantes pour le développement de modules.

## Connexion à la base de données

### Obtenir l'instance de la base de données

```php
// Approche héritée
global $xoopsDB;

// Approche moderne via factory
$db = \XoopsDatabaseFactory::getDatabaseConnection();

// Via helper XMF
$helper = \Xmf\Module\Helper::getHelper('mymodule');
$db = $GLOBALS['xoopsDB'];
```

## Opérations de base

### Requêtes SELECT

```php
// Requête simple
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE status = 1";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo $row['title'];
}

// Avec paramètres (approche sûre)
$sql = sprintf(
    "SELECT * FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);

// Ligne unique
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = " . intval($id);
$result = $db->query($sql);
$row = $db->fetchArray($result);
```

### Opérations INSERT

```php
// Insertion de base
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    $db->quoteString($content),
    time()
);
$db->queryF($sql);

// Obtenir le dernier ID inséré
$newId = $db->getInsertId();
```

### Opérations UPDATE

```php
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('mymodule_items'),
    $db->quoteString($title),
    time(),
    intval($id)
);
$db->queryF($sql);

// Vérifier les lignes affectées
$affectedRows = $db->getAffectedRows();
```

### Opérations DELETE

```php
$sql = sprintf(
    "DELETE FROM %s WHERE id = %d",
    $db->prefix('mymodule_items'),
    intval($id)
);
$db->queryF($sql);
```

## Utilisation de critères

Le système de critères fournit un moyen type sûr de construire des requêtes :

```php
use Criteria;
use CriteriaCompo;

// Critère simple
$criteria = new Criteria('status', 1);
$items = $itemHandler->getObjects($criteria);

// Critère composé
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->add(new Criteria('category_id', $categoryId));
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart($offset);

$items = $itemHandler->getObjects($criteria);
$count = $itemHandler->getCount($criteria);
```

### Opérateurs de critères

| Opérateur | Description |
|----------|-------------|
| `=` | Égal (par défaut) |
| `!=` | Non égal |
| `<` | Inférieur à |
| `>` | Supérieur à |
| `<=` | Inférieur ou égal |
| `>=` | Supérieur ou égal |
| `LIKE` | Correspondance de modèle |
| `IN` | Dans un ensemble de valeurs |

```php
// Critère LIKE
$criteria = new Criteria('title', '%search%', 'LIKE');

// Critère IN
$criteria = new Criteria('id', '(1,2,3)', 'IN');

// Plage de dates
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('created', $startDate, '>='));
$criteria->add(new Criteria('created', $endDate, '<='));
```

## Gestionnaires d'objets

### Méthodes du gestionnaire

```php
$handler = xoops_getModuleHandler('item', 'mymodule');

// Créer un nouvel objet
$item = $handler->create();

// Obtenir par ID
$item = $handler->get($id);

// Obtenir plusieurs
$items = $handler->getObjects($criteria);

// Obtenir en tant que tableau
$items = $handler->getAll($criteria);

// Compter
$count = $handler->getCount($criteria);

// Sauvegarder
$success = $handler->insert($item);

// Supprimer
$success = $handler->delete($item);
```

### Méthodes du gestionnaire personnalisé

```php
class ItemHandler extends \XoopsPersistableObjectHandler
{
    public function getPublished(int $limit = 10): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('status', 'published'));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    public function getByCategory(int $categoryId): array
    {
        $criteria = new Criteria('category_id', $categoryId);
        return $this->getObjects($criteria);
    }
}
```

## Transactions

```php
// Commencer la transaction
$db->query('START TRANSACTION');

try {
    // Effectuer plusieurs opérations
    $db->queryF($sql1);
    $db->queryF($sql2);
    $db->queryF($sql3);

    // Valider si tout réussit
    $db->query('COMMIT');
} catch (\Exception $e) {
    // Annuler en cas d'erreur
    $db->query('ROLLBACK');
    throw $e;
}
```

## Déclarations préparées (moderne)

```php
// Utiliser PDO via la couche de base de données XOOPS
$sql = "SELECT * FROM " . $db->prefix('mymodule_items') . " WHERE id = :id";
$stmt = $db->prepare($sql);
$stmt->execute(['id' => $id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
```

## Gestion du schéma

### Création de tables

```sql
-- sql/mysql.sql
CREATE TABLE `{PREFIX}_mymodule_items` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT,
    `status` ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    `author_id` INT(11) UNSIGNED NOT NULL,
    `created` INT(11) UNSIGNED NOT NULL,
    `updated` INT(11) UNSIGNED DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `idx_status` (`status`),
    INDEX `idx_author` (`author_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### Migrations

```php
// migrations/001_create_items.php
return new class {
    public function up(\XoopsDatabase $db): void
    {
        $sql = "CREATE TABLE IF NOT EXISTS " . $db->prefix('mymodule_items') . " (
            id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            created INT UNSIGNED NOT NULL
        )";
        $db->queryF($sql);
    }

    public function down(\XoopsDatabase $db): void
    {
        $sql = "DROP TABLE IF EXISTS " . $db->prefix('mymodule_items');
        $db->queryF($sql);
    }
};
```

## Meilleures pratiques

1. **Toujours citer les chaînes** - Utiliser `$db->quoteString()` pour l'entrée utilisateur
2. **Utiliser Intval** - Convertir les entiers avec `intval()` ou les déclarations de type
3. **Préférer les gestionnaires** - Utiliser les gestionnaires d'objets plutôt que le SQL brut si possible
4. **Utiliser les critères** - Construire les requêtes avec Criteria pour la sécurité de type
5. **Gérer les erreurs** - Vérifier les valeurs de retour et gérer les échecs
6. **Utiliser les transactions** - Envelopper les opérations connexes dans les transactions

## Documentation connexe

- ../04-API-Reference/Kernel/Critères - Construction de requêtes avec Criteria
- ../04-API-Reference/Core/Gestionnaire d'objets XOOPS - Motif du gestionnaire
- ../02-Core-Concepts/Database/Couche-de-base-de-données - Abstraction de base de données
- Base-de-données/Schéma-de-base-de-données - Guide de conception de schéma
