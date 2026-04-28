---
title: "Utilitaires de base de données"
description: "Utilitaires XMF pour la gestion des schémas, les migrations et le chargement des données"
---

L'espace de noms `Xmf\Database` fournit des classes pour simplifier les tâches de maintenance de base de données associées à l'installation et à la mise à jour des modules XOOPS. Ces utilitaires gèrent les migrations de schéma, les modifications de table, et le chargement de données initiales.

## Aperçu

Les utilitaires de base de données incluent:

- **Tables** - Construction et exécution des déclarations DDL pour les modifications de table
- **Migrate** - Synchronisation du schéma de base de données entre les versions de module
- **TableLoad** - Chargement des données initiales dans les tables

## Xmf\Database\Tables

La classe `Tables` simplifie la création et la modification des tables de base de données. Elle construit une file d'attente de travail avec des déclarations DDL (Data Definition Language) qui sont exécutées ensemble.

### Caractéristiques clés

- Charge le schéma actuel à partir des tables existantes
- Met en file d'attente les modifications sans exécution immédiate
- Considère l'état actuel lors de la détermination du travail à faire
- Gère automatiquement le préfixe de table XOOPS

### Démarrage

```php
use Xmf\Database\Tables;

// Créer une nouvelle instance Tables
$tables = new Tables();

// Charger une table existante ou commencer un nouveau schéma
$tables->addTable('mymodule_items');

// Pour les tables existantes seulement (échoue si la table n'existe pas)
$tables->useTable('mymodule_items');
```

### Opérations sur les tables

#### Renommer une table

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Définir les options de table

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Supprimer une table

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Copier une table

```php
// Copier la structure uniquement
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copier la structure et les données
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Travailler avec les colonnes

#### Ajouter une colonne

```php
$tables = new Tables();
$tables->addTable('mymodule_items');

$tables->addColumn(
    'mymodule_items',
    'status',
    "TINYINT(1) NOT NULL DEFAULT '1'"
);

$tables->executeQueue();
```

#### Modifier une colonne

```php
$tables->useTable('mymodule_items');

// Modifier les attributs de la colonne
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Renommer et modifier la colonne
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### Obtenir les attributs de colonne

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Retourne: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Supprimer une colonne

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Travailler avec les index

#### Obtenir les index de table

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Retourne un tableau comme:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Ajouter une clé primaire

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Clé primaire composite
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Ajouter un index

```php
$tables->useTable('mymodule_items');

// Index simple
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Index unique
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Index composite
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Supprimer un index

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Supprimer tous les index non-primaires

```php
// Utile pour nettoyer les noms d'index générés automatiquement
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Supprimer la clé primaire

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Opérations sur les données

#### Insérer des données

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Sans guillemets automatiques (pour les expressions)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### Mettre à jour les données

```php
$tables->useTable('mymodule_items');

// Mettre à jour avec un objet de critères
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Mettre à jour avec des critères de chaîne
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Supprimer des données

```php
$tables->useTable('mymodule_items');

// Supprimer avec critères
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Supprimer avec critères de chaîne
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Tronquer une table

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Gestion de la file d'attente de travail

#### Exécuter la file d'attente

```php
// Exécution normale (respecte la sécurité de la méthode HTTP)
$result = $tables->executeQueue();

// Forcer l'exécution même sur les requêtes GET
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Réinitialiser la file d'attente

```php
// Effacer la file d'attente sans exécuter
$tables->resetQueue();
```

#### Ajouter du SQL brut

```php
// Ajouter du SQL personnalisé à la file d'attente
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Gestion des erreurs

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Gérer l'erreur
}
```

## Xmf\Database\Migrate

La classe `Migrate` simplifie la synchronisation des modifications de base de données entre les versions de module. Elle étend `Tables` avec la comparaison de schéma et la synchronisation automatique.

### Utilisation de base

```php
use Xmf\Database\Migrate;

// Créer une instance migrate pour un module
$migrate = new Migrate('mymodule');

// Synchroniser la base de données avec le schéma cible
$migrate->synchronizeSchema();
```

### Lors de la mise à jour du module

Généralement appelé dans la fonction `xoops_module_pre_update_*` du module:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Effectuer toute action pré-sync (renommages, etc.)
    // ...

    // Synchroniser le schéma
    return $migrate->synchronizeSchema();
}
```

### Obtenir les déclarations DDL

Pour les grandes bases de données ou les migrations en ligne de commande:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Exécuter les déclarations en lots ou à partir de CLI
foreach ($statements as $sql) {
    // Traiter chaque déclaration
}
```

### Actions pré-sync

Certains changements nécessitent une gestion explicite avant la synchronisation. Étendre `Migrate` pour les migrations complexes:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // Renommer une table avant sync
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Renommer une colonne
        $this->useTable('mymodule_items');
        $this->alterColumn(
            'mymodule_items',
            'old_column',
            'VARCHAR(255) NOT NULL',
            'new_column'
        );
        $this->executeQueue();
    }
}

// Utilisation
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### Gestion des schémas

#### Obtenir le schéma actuel

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Obtenir le schéma cible

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Enregistrer le schéma actuel

Pour les développeurs de modules pour capturer le schéma après les modifications de base de données:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Enregistre le schéma dans sql/migrate.yml du module
```

> **Note du développeur:** Toujours apporter des modifications à la base de données en premier, puis exécuter `saveCurrentSchema()`. Ne pas modifier manuellement le fichier de schéma généré.

## Xmf\Database\TableLoad

La classe `TableLoad` simplifie le chargement des données initiales dans les tables. Utile pour l'ensemencement des tables avec des données par défaut lors de l'installation du module.

### Chargement de données à partir de tableaux

```php
use Xmf\Database\TableLoad;

$data = [
    ['category_id' => 1, 'name' => 'General', 'weight' => 0],
    ['category_id' => 2, 'name' => 'News', 'weight' => 10],
    ['category_id' => 3, 'name' => 'Events', 'weight' => 20]
];

$count = TableLoad::loadTableFromArray('mymodule_categories', $data);
echo "Inserted {$count} rows";
```

### Chargement de données à partir de YAML

```php
// Charger à partir du fichier YAML
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Format YAML:

```yaml
-
  category_id: 1
  name: General
  weight: 0
-
  category_id: 2
  name: News
  weight: 10
```

### Extraction de données

#### Compter les lignes

```php
// Compter toutes les lignes
$total = TableLoad::countRows('mymodule_items');

// Compter avec critères
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Extraire les lignes

```php
// Extraire toutes les lignes
$rows = TableLoad::extractRows('mymodule_items');

// Extraire avec critères
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Ignorer certaines colonnes
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Enregistrement de données en YAML

```php
// Enregistrer toutes les données
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Enregistrer les données filtrées
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Enregistrer sans certaines colonnes
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### Tronquer une table

```php
// Vider une table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Exemple de migration complet

### xoops_version.php

```php
$modversion['sqlfile']['mysql'] = 'sql/mysql.sql';
$modversion['tables'] = [
    'mymodule_items',
    'mymodule_categories',
    'mymodule_settings'
];
```

### include/onupdate.php

```php
<?php
use Xmf\Database\Migrate;
use Xmf\Database\Tables;
use Xmf\Database\TableLoad;

function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    // Créer une classe migrate personnalisée
    $migrate = new MyModuleMigrate('mymodule');

    // Gérer les migrations spécifiques à la version
    if ($previousVersion < 120) {
        // Version 1.2.0 a renommé une table
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // Version 1.3.0 a renommé une colonne
        $migrate->renameOldColumn();
    }

    // Synchroniser le schéma
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Migrations de données post-mise à jour
    if ($previousVersion < 130) {
        // Charger les nouveaux paramètres par défaut
        TableLoad::loadTableFromYamlFile(
            'mymodule_settings',
            XOOPS_ROOT_PATH . '/modules/mymodule/sql/new_settings.yml'
        );
    }

    return true;
}

class MyModuleMigrate extends Migrate
{
    public function renameOldTable()
    {
        if ($this->useTable('mymodule_posts')) {
            $this->renameTable('mymodule_posts', 'mymodule_items');
            $this->executeQueue();
        }
    }

    public function renameOldColumn()
    {
        if ($this->useTable('mymodule_items')) {
            $this->alterColumn(
                'mymodule_items',
                'post_title',
                "VARCHAR(255) NOT NULL DEFAULT ''",
                'title'
            );
            $this->executeQueue();
        }
    }
}
```

## Référence API

### Xmf\Database\Tables

| Méthode | Description |
|--------|-------------|
| `addTable($table)` | Charger ou créer le schéma de table |
| `useTable($table)` | Charger la table existante seulement |
| `renameTable($table, $newName)` | Mettre en file d'attente le renommage de table |
| `setTableOptions($table, $options)` | Mettre en file d'attente le changement des options de table |
| `dropTable($table)` | Mettre en file d'attente la suppression de table |
| `copyTable($table, $newTable, $withData)` | Mettre en file d'attente la copie de table |
| `addColumn($table, $column, $attributes)` | Mettre en file d'attente l'ajout de colonne |
| `alterColumn($table, $column, $attributes, $newName)` | Mettre en file d'attente le changement de colonne |
| `getColumnAttributes($table, $column)` | Obtenir la définition de colonne |
| `dropColumn($table, $column)` | Mettre en file d'attente la suppression de colonne |
| `getTableIndexes($table)` | Obtenir les définitions d'index |
| `addPrimaryKey($table, $column)` | Mettre en file d'attente la clé primaire |
| `addIndex($name, $table, $column, $unique)` | Mettre en file d'attente l'index |
| `dropIndex($name, $table)` | Mettre en file d'attente la suppression d'index |
| `dropIndexes($table)` | Mettre en file d'attente la suppression de tous les index |
| `dropPrimaryKey($table)` | Mettre en file d'attente la suppression de clé primaire |
| `insert($table, $columns, $quote)` | Mettre en file d'attente l'insertion |
| `update($table, $columns, $criteria, $quote)` | Mettre en file d'attente la mise à jour |
| `delete($table, $criteria)` | Mettre en file d'attente la suppression |
| `truncate($table)` | Mettre en file d'attente la troncature |
| `executeQueue($force)` | Exécuter les opérations en file d'attente |
| `resetQueue()` | Effacer la file d'attente |
| `addToQueue($sql)` | Ajouter du SQL brut |
| `getLastError()` | Obtenir le dernier message d'erreur |
| `getLastErrNo()` | Obtenir le dernier code d'erreur |

### Xmf\Database\Migrate

| Méthode | Description |
|--------|-------------|
| `__construct($dirname)` | Créer pour un module |
| `synchronizeSchema()` | Synchroniser la base de données cible |
| `getSynchronizeDDL()` | Obtenir les déclarations DDL |
| `preSyncActions()` | Remplacer pour les actions personnalisées |
| `getCurrentSchema()` | Obtenir le schéma de base de données actuel |
| `getTargetDefinitions()` | Obtenir le schéma cible |
| `saveCurrentSchema()` | Enregistrer le schéma pour les développeurs |

### Xmf\Database\TableLoad

| Méthode | Description |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Charger à partir d'un tableau |
| `loadTableFromYamlFile($table, $file)` | Charger à partir de YAML |
| `truncateTable($table)` | Vider une table |
| `countRows($table, $criteria)` | Compter les lignes |
| `extractRows($table, $criteria, $skip)` | Extraire les lignes |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Enregistrer en YAML |

## Voir aussi

- ../XMF-Framework - Aperçu du framework
- ../Basics/XMF-Module-Helper - Classe d'aide du module
- Metagen - Utilitaires de métadonnées

---

#xmf #database #migration #schema #tables #ddl
