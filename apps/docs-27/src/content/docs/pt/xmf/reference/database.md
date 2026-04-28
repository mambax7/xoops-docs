---
title: "Utilitários de Banco de Dados"
description: "Utilitários de banco de dados XMF para gerenciamento de schema, migrações e carregamento de dados"
---

O namespace `Xmf\Database` fornece classes para simplificar tarefas de manutenção de banco de dados associadas com instalação e atualização de módulos XOOPS. Estes utilitários manipulam migrações de schema, modificações de tabelas e carregamento de dados inicial.

## Visão Geral

Os utilitários de banco de dados incluem:

- **Tables** - Construindo e executando declarações DDL para modificações de tabela
- **Migrate** - Sincronizando schema de banco de dados entre versões de módulo
- **TableLoad** - Carregando dados inicial em tabelas

## Xmf\Database\Tables

A classe `Tables` simplifica criar e modificar tabelas de banco de dados. Ela constrói uma fila de trabalho de declarações DDL (Data Definition Language) que são executadas juntas.

### Principais Características

- Carrega schema atual de tabelas existentes
- Enfileira mudanças sem execução imediata
- Considera estado atual ao determinar trabalho a fazer
- Manipula automaticamente prefixo de tabela XOOPS

### Começando

```php
use Xmf\Database\Tables;

// Criar nova instância Tables
$tables = new Tables();

// Carregar tabela existente ou iniciar novo schema
$tables->addTable('mymodule_items');

// Apenas para tabelas existentes (falha se tabela não existe)
$tables->useTable('mymodule_items');
```

### Operações de Tabela

#### Renomear uma Tabela

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### Definir Opções de Tabela

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### Dropar uma Tabela

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### Copiar uma Tabela

```php
// Copiar apenas estrutura
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copiar estrutura e dados
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### Trabalhando com Colunas

#### Adicionar uma Coluna

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

#### Alterar uma Coluna

```php
$tables->useTable('mymodule_items');

// Mudar atributos de coluna
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Renomear e modificar coluna
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### Obter Atributos de Coluna

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Retorna: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### Dropar uma Coluna

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### Trabalhando com Índices

#### Obter Índices de Tabela

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Retorna array como:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### Adicionar Chave Primária

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Chave primária composta
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### Adicionar Índice

```php
$tables->useTable('mymodule_items');

// Índice simples
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Índice único
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Índice composto
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### Dropar Índice

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### Dropar Todos os Índices Não-Primários

```php
// Útil para limpeza de nomes de índice auto-gerados
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### Dropar Chave Primária

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### Operações de Dados

#### Inserir Dados

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Sem citação automática (para expressões)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### Atualizar Dados

```php
$tables->useTable('mymodule_items');

// Atualizar com objeto criteria
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Atualizar com string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### Deletar Dados

```php
$tables->useTable('mymodule_items');

// Deletar com criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Deletar com string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### Truncar Tabela

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### Gerenciamento da Fila de Trabalho

#### Executar Fila

```php
// Execução normal (respeita segurança de método HTTP)
$result = $tables->executeQueue();

// Forçar execução mesmo em requisições GET
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Erro: ' . $tables->getLastError();
}
```

#### Resetar Fila

```php
// Limpar fila sem executar
$tables->resetQueue();
```

#### Adicionar SQL Bruto

```php
// Adicionar SQL customizado à fila
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### Manipulação de Erro

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Manipular erro
}
```

## Xmf\Database\Migrate

A classe `Migrate` simplifica sincronizar mudanças de banco de dados entre versões de módulo. Ela estende `Tables` com comparação de schema e sincronização automática.

### Uso Básico

```php
use Xmf\Database\Migrate;

// Criar instância migrate para um módulo
$migrate = new Migrate('mymodule');

// Sincronizar banco de dados com schema alvo
$migrate->synchronizeSchema();
```

### Em Atualização de Módulo

Tipicamente chamado na função `xoops_module_pre_update_*` do módulo:

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Realizar qualquer ação pré-sync (renomear, etc.)
    // ...

    // Sincronizar schema
    return $migrate->synchronizeSchema();
}
```

### Obtendo Declarações DDL

Para bancos de dados grandes ou migrações de linha de comando:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Executar declarações em lotes ou de CLI
foreach ($statements as $sql) {
    // Processar cada declaração
}
```

### Ações Pré-Sync

Algumas mudanças requerem manipulação explícita antes de sincronização. Estenda `Migrate` para migrações complexas:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // Renomear tabela antes de sync
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Renomear coluna
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

// Uso
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### Gerenciamento de Schema

#### Obter Schema Atual

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### Obter Schema Alvo

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### Salvar Schema Atual

Para desenvolvedores de módulo capturem schema após mudanças de banco de dados:

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Salva schema para sql/migrate.yml do módulo
```

> **Nota de Desenvolvedor:** Sempre faça mudanças ao banco de dados primeiro, depois execute `saveCurrentSchema()`. Não edite manualmente o arquivo schema gerado.

## Xmf\Database\TableLoad

A classe `TableLoad` simplifica carregamento de dados inicial em tabelas. Útil para semear tabelas com dados padrão durante instalação de módulo.

### Carregando Dados de Arrays

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

### Carregando Dados de YAML

```php
// Carregar de arquivo YAML
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

### Extraindo Dados

#### Contar Linhas

```php
// Contar todas as linhas
$total = TableLoad::countRows('mymodule_items');

// Contar com criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### Extrair Linhas

```php
// Extrair todas as linhas
$rows = TableLoad::extractRows('mymodule_items');

// Extrair com criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Pular certas colunas
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### Salvando Dados para YAML

```php
// Salvar todos os dados
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Salvar dados filtrados
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Salvar sem certas colunas
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### Truncar Tabela

```php
// Esvaziar tabela
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## Exemplo Completo de Migração

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
    // Criar classe migrate customizada
    $migrate = new MyModuleMigrate('mymodule');

    // Manipular migrações específicas de versão
    if ($previousVersion < 120) {
        // Versão 1.2.0 renomeou uma tabela
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // Versão 1.3.0 renomeou uma coluna
        $migrate->renameOldColumn();
    }

    // Sincronizar schema
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Migrações de dados pós-atualização
    if ($previousVersion < 130) {
        // Carregar novas configurações padrão
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

## Referência da API

### Xmf\Database\Tables

| Método | Descrição |
|--------|-----------|
| `addTable($table)` | Carregar ou criar schema de tabela |
| `useTable($table)` | Carregar apenas tabela existente |
| `renameTable($table, $newName)` | Enfileirar renomeação de tabela |
| `setTableOptions($table, $options)` | Enfileirar mudança de opções de tabela |
| `dropTable($table)` | Enfileirar dropar tabela |
| `copyTable($table, $newTable, $withData)` | Enfileirar cópia de tabela |
| `addColumn($table, $column, $attributes)` | Enfileirar adição de coluna |
| `alterColumn($table, $column, $attributes, $newName)` | Enfileirar mudança de coluna |
| `getColumnAttributes($table, $column)` | Obter definição de coluna |
| `dropColumn($table, $column)` | Enfileirar dropar coluna |
| `getTableIndexes($table)` | Obter definições de índice |
| `addPrimaryKey($table, $column)` | Enfileirar chave primária |
| `addIndex($name, $table, $column, $unique)` | Enfileirar índice |
| `dropIndex($name, $table)` | Enfileirar dropar índice |
| `dropIndexes($table)` | Enfileirar dropar todos os índices |
| `dropPrimaryKey($table)` | Enfileirar dropar chave primária |
| `insert($table, $columns, $quote)` | Enfileirar insert |
| `update($table, $columns, $criteria, $quote)` | Enfileirar update |
| `delete($table, $criteria)` | Enfileirar delete |
| `truncate($table)` | Enfileirar truncate |
| `executeQueue($force)` | Executar operações enfileiradas |
| `resetQueue()` | Limpar fila |
| `addToQueue($sql)` | Adicionar SQL bruto |
| `getLastError()` | Obter mensagem de último erro |
| `getLastErrNo()` | Obter código de último erro |

### Xmf\Database\Migrate

| Método | Descrição |
|--------|-----------|
| `__construct($dirname)` | Criar para módulo |
| `synchronizeSchema()` | Sincronizar banco de dados para alvo |
| `getSynchronizeDDL()` | Obter declarações DDL |
| `preSyncActions()` | Sobrescrever para ações customizadas |
| `getCurrentSchema()` | Obter schema de banco de dados atual |
| `getTargetDefinitions()` | Obter schema alvo |
| `saveCurrentSchema()` | Salvar schema para desenvolvedores |

### Xmf\Database\TableLoad

| Método | Descrição |
|--------|-----------|
| `loadTableFromArray($table, $data)` | Carregar de array |
| `loadTableFromYamlFile($table, $file)` | Carregar de YAML |
| `truncateTable($table)` | Esvaziar tabela |
| `countRows($table, $criteria)` | Contar linhas |
| `extractRows($table, $criteria, $skip)` | Extrair linhas |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | Salvar para YAML |

## Veja Também

- ../XMF-Framework - Visão geral do framework
- ../Basics/XMF-Module-Helper - Classe module helper
- Metagen - Utilitários de metadados

---

#xmf #database #migration #schema #tables #ddl
