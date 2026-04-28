---
title: "Utilità di Database"
description: "Utilità di database XMF per la gestione dello schema, le migrazioni e il caricamento dei dati"
---

Lo spazio dei nomi `Xmf\Database` fornisce classi per semplificare le attività di manutenzione del database associate all'installazione e all'aggiornamento dei moduli XOOPS. Queste utilità gestiscono le migrazioni di schema, le modifiche delle tabelle e il caricamento dei dati iniziali.

## Panoramica

Le utilità di database includono:

- **Tables** - Costruzione ed esecuzione di istruzioni DDL per le modifiche delle tabelle
- **Migrate** - Sincronizzazione dello schema del database tra le versioni del modulo
- **TableLoad** - Caricamento dei dati iniziali nelle tabelle

## Xmf\Database\Tables

La classe `Tables` semplifica la creazione e la modifica delle tabelle di database. Crea una coda di lavoro di istruzioni DDL (Data Definition Language) che vengono eseguite insieme.

### Caratteristiche Principali

- Carica lo schema corrente dalle tabelle esistenti
- Mette in coda i cambiamenti senza esecuzione immediata
- Considera lo stato corrente nel determinare il lavoro da fare
- Gestisce automaticamente il prefisso della tabella XOOPS

### Iniziare

```php
use Xmf\Database\Tables;

// Crea una nuova istanza Tables
$tables = new Tables();

// Carica una tabella esistente o avvia un nuovo schema
$tables->addTable('mymodule_items');

// Solo per tabelle esistenti (fallisce se la tabella non esiste)
$tables->useTable('mymodule_items');
```

### Operazioni sulla Tabella

#### Rinomina una Tabella

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Imposta Opzioni Tabella

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Elimina una Tabella

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Copia una Tabella

```php
// Copia solo la struttura
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copia la struttura e i dati
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Lavoro con le Colonne

#### Aggiungi una Colonna

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

#### Modifica una Colonna

```php
$tables->useTable('mymodule_items');

// Cambia gli attributi della colonna
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Rinomina e modifica la colonna
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### Ottieni Attributi della Colonna

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Ritorna: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Elimina una Colonna

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Lavoro con gli Indici

#### Ottieni Indici della Tabella

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Ritorna un array come:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Aggiungi Chiave Primaria

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Chiave primaria composita
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Aggiungi Indice

```php
$tables->useTable('mymodule_items');

// Indice semplice
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Indice univoco
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Indice composito
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Elimina Indice

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Elimina Tutti gli Indici Non-Primari

```php
// Utile per pulire i nomi degli indici auto-generati
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Elimina Chiave Primaria

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Operazioni sui Dati

#### Inserisci Dati

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Senza virgolettatura automatica (per le espressioni)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### Aggiorna Dati

```php
$tables->useTable('mymodule_items');

// Aggiorna con l'oggetto criteri
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Aggiorna con criteri stringa
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Elimina Dati

```php
$tables->useTable('mymodule_items');

// Elimina con criteri
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Elimina con criteri stringa
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Truncate Tabella

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Gestione della Coda di Lavoro

#### Esegui Coda

```php
// Esecuzione normale (rispetta la sicurezza del metodo HTTP)
$result = $tables->executeQueue();

// Forza l'esecuzione anche nelle richieste GET
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### Reimposta Coda

```php
// Pulisci la coda senza eseguire
$tables->resetQueue();
```

#### Aggiungi SQL Grezzo

```php
// Aggiungi SQL personalizzato alla coda
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Gestione degli Errori

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Gestisci l'errore
}
```

## Xmf\Database\Migrate

La classe `Migrate` semplifica la sincronizzazione dei cambiamenti del database tra le versioni del modulo. Estende `Tables` con confronto dello schema e sincronizzazione automatica.

### Utilizzo di Base

```php
use Xmf\Database\Migrate;

// Crea istanza di migrazione per un modulo
$migrate = new Migrate('mymodule');

// Sincronizza il database con lo schema di destinazione
$migrate->synchronizeSchema();
```

### In Aggiornamento del Modulo

Tipicamente chiamato nella funzione `xoops_module_pre_update_*` del modulo:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Esegui azioni pre-sync (rinomina, ecc.)
    // ...

    // Sincronizza lo schema
    return $migrate->synchronizeSchema();
}
```

### Ottenimento di Istruzioni DDL

Per database grandi o migrazioni da riga di comando:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Esegui le istruzioni in batch o da CLI
foreach ($statements as $sql) {
    // Elabora ogni istruzione
}
```

### Azioni Pre-Sync

Alcuni cambiamenti richiedono la gestione esplicita prima della sincronizzazione. Estendi `Migrate` per le migrazioni complesse:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // Rinomina una tabella prima della sync
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Rinomina una colonna
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

// Utilizzo
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### Gestione dello Schema

#### Ottieni Schema Corrente

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Ottieni Schema di Destinazione

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Salva Schema Corrente

Per gli sviluppatori di moduli per catturare lo schema dopo i cambiamenti del database:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Salva lo schema nel file sql/migrate.yml del modulo
```

> **Nota per lo Sviluppatore:** Effettua sempre i cambiamenti al database per primo, poi esegui `saveCurrentSchema()`. Non modificare manualmente il file di schema generato.

## Xmf\Database\TableLoad

La classe `TableLoad` semplifica il caricamento dei dati iniziali nelle tabelle. Utile per il seeding delle tabelle con dati predefiniti durante l'installazione del modulo.

### Caricamento di Dati da Array

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

### Caricamento di Dati da YAML

```php
// Carica da file YAML
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

Formato YAML:

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

### Estrazione di Dati

#### Conta Righe

```php
// Conta tutte le righe
$total = TableLoad::countRows('mymodule_items');

// Conta con criteri
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Estrai Righe

```php
// Estrai tutte le righe
$rows = TableLoad::extractRows('mymodule_items');

// Estrai con criteri
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Salta determinate colonne
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Salvataggio dei Dati in YAML

```php
// Salva tutti i dati
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Salva i dati filtrati
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Salva senza determinate colonne
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### Truncate Tabella

```php
// Svuota una tabella
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Esempio Completo di Migrazione

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
    // Crea una classe di migrazione personalizzata
    $migrate = new MyModuleMigrate('mymodule');

    // Gestisci le migrazioni specifiche della versione
    if ($previousVersion < 120) {
        // La versione 1.2.0 ha rinominato una tabella
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // La versione 1.3.0 ha rinominato una colonna
        $migrate->renameOldColumn();
    }

    // Sincronizza lo schema
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Migrazioni di dati post-aggiornamento
    if ($previousVersion < 130) {
        // Carica le nuove impostazioni predefinite
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

## Riferimento API

### Xmf\Database\Tables

| Metodo | Descrizione |
|--------|-------------|
| `addTable($table)` | Carica o crea schema della tabella |
| `useTable($table)` | Carica solo tabella esistente |
| `renameTable($table, $newName)` | Metti in coda rinomina tabella |
| `setTableOptions($table, $options)` | Metti in coda il cambio delle opzioni della tabella |
| `dropTable($table)` | Metti in coda l'eliminazione della tabella |
| `copyTable($table, $newTable, $withData)` | Metti in coda la copia della tabella |
| `addColumn($table, $column, $attributes)` | Metti in coda l'aggiunta di colonna |
| `alterColumn($table, $column, $attributes, $newName)` | Metti in coda il cambio della colonna |
| `getColumnAttributes($table, $column)` | Ottieni la definizione della colonna |
| `dropColumn($table, $column)` | Metti in coda l'eliminazione della colonna |
| `getTableIndexes($table)` | Ottieni le definizioni degli indici |
| `addPrimaryKey($table, $column)` | Metti in coda la chiave primaria |
| `addIndex($name, $table, $column, $unique)` | Metti in coda l'indice |
| `dropIndex($name, $table)` | Metti in coda l'eliminazione dell'indice |
| `dropIndexes($table)` | Metti in coda l'eliminazione di tutti gli indici |
| `dropPrimaryKey($table)` | Metti in coda l'eliminazione della chiave primaria |
| `insert($table, $columns, $quote)` | Metti in coda l'inserimento |
| `update($table, $columns, $criteria, $quote)` | Metti in coda l'aggiornamento |
| `delete($table, $criteria)` | Metti in coda l'eliminazione |
| `truncate($table)` | Metti in coda il truncate |
| `executeQueue($force)` | Esegui operazioni in coda |
| `resetQueue()` | Pulisci la coda |
| `addToQueue($sql)` | Aggiungi SQL grezzo |
| `getLastError()` | Ottieni messaggio di ultimo errore |
| `getLastErrNo()` | Ottieni codice di ultimo errore |

### Xmf\Database\Migrate

| Metodo | Descrizione |
|--------|-------------|
| `__construct($dirname)` | Crea per il modulo |
| `synchronizeSchema()` | Sincronizza il database al target |
| `getSynchronizeDDL()` | Ottieni le istruzioni DDL |
| `preSyncActions()` | Sovrascrivere per azioni personalizzate |
| `getCurrentSchema()` | Ottieni lo schema del database corrente |
| `getTargetDefinitions()` | Ottieni lo schema target |
| `saveCurrentSchema()` | Salva lo schema per gli sviluppatori |

### Xmf\Database\TableLoad

| Metodo | Descrizione |
|--------|-------------|
| `loadTableFromArray($table, $data)` | Carica da array |
| `loadTableFromYamlFile($table, $file)` | Carica da YAML |
| `truncateTable($table)` | Svuota la tabella |
| `countRows($table, $criteria)` | Conta le righe |
| `extractRows($table, $criteria, $skip)` | Estrai le righe |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Salva in YAML |

## Vedere Anche

- ../XMF-Framework - Panoramica del framework
- ../Basics/XMF-Module-Helper - Classe module helper
- Metagen - Utilità di metadati

---

#xmf #database #migration #schema #tables #ddl
