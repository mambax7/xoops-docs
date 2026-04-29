---
title: "데이터베이스 유틸리티"
description: "스키마 관리, 마이그레이션 및 데이터 로드를 위한 XMF 데이터베이스 유틸리티"
---

`Xmf\Database` 네임스페이스는 XOOPS 모듈 설치 및 업데이트와 관련된 데이터베이스 유지 관리 작업을 단순화하는 클래스를 제공합니다. 이러한 유틸리티는 스키마 마이그레이션, 테이블 수정 및 초기 데이터 로드를 처리합니다.

## 개요

데이터베이스 유틸리티에는 다음이 포함됩니다.

- **테이블** - 테이블 수정을 위한 DDL 문 빌드 및 실행
- **마이그레이션** - 모듈 버전 간 데이터베이스 스키마 동기화
- **TableLoad** - 테이블에 초기 데이터 로드

## Xmf\Database\Tables

`Tables` 클래스는 데이터베이스 테이블 생성 및 수정을 단순화합니다. 함께 실행되는 DDL(데이터 정의 언어) 문의 작업 대기열을 구축합니다.

### 주요 기능

- 기존 테이블에서 현재 스키마를 로드합니다.
- 즉각적인 실행 없이 대기열 변경
- 해야 할 일을 결정할 때 현재 상태를 고려합니다.
- XOOPS 테이블 접두어를 자동으로 처리합니다.

### 시작하기

```php
use Xmf\Database\Tables;

// Create a new Tables instance
$tables = new Tables();

// Load an existing table or start new schema
$tables->addTable('mymodule_items');

// For existing tables only (fails if table doesn't exist)
$tables->useTable('mymodule_items');
```

### 테이블 작업

#### 테이블 이름 바꾸기

```php
$tables = new Tables();
$tables->addTable('mymodule_old_name');
$tables->renameTable('mymodule_old_name', 'mymodule_new_name');
$tables->executeQueue();
```

#### 테이블 옵션 설정

```php
$tables->addTable('mymodule_items');
$tables->setTableOptions('mymodule_items', 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
$tables->executeQueue();
```

#### 테이블 삭제

```php
$tables->addTable('mymodule_temp');
$tables->dropTable('mymodule_temp');
$tables->executeQueue();
```

#### 테이블 복사

```php
// Copy structure only
$tables->copyTable('mymodule_items', 'mymodule_items_backup', false);

// Copy structure and data
$tables->copyTable('mymodule_items', 'mymodule_items_backup', true);
$tables->executeQueue();
```

### 열 작업

#### 열 추가

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

#### 열 변경

```php
$tables->useTable('mymodule_items');

// Change column attributes
$tables->alterColumn(
    'mymodule_items',
    'title',
    "VARCHAR(255) NOT NULL DEFAULT ''"
);

// Rename and modify column
$tables->alterColumn(
    'mymodule_items',
    'old_column_name',
    "VARCHAR(100) NOT NULL",
    'new_column_name'
);

$tables->executeQueue();
```

#### 열 속성 가져오기

```php
$tables->useTable('mymodule_items');
$attributes = $tables->getColumnAttributes('mymodule_items', 'title');
// Returns: "VARCHAR(255) NOT NULL DEFAULT ''"
```

#### 열 삭제

```php
$tables->useTable('mymodule_items');
$tables->dropColumn('mymodule_items', 'obsolete_field');
$tables->executeQueue();
```

### 인덱스 작업

#### 테이블 인덱스 가져오기

```php
$tables->useTable('mymodule_items');
$indexes = $tables->getTableIndexes('mymodule_items');

// Returns array like:
// [
//     'PRIMARY' => ['columns' => 'item_id', 'unique' => true],
//     'idx_category' => ['columns' => 'category_id', 'unique' => false]
// ]
```

#### 기본 키 추가

```php
$tables->addTable('mymodule_items');
$tables->addPrimaryKey('mymodule_items', 'item_id');

// Composite primary key
$tables->addPrimaryKey('mymodule_item_tags', 'item_id, tag_id');
$tables->executeQueue();
```

#### 색인 추가

```php
$tables->useTable('mymodule_items');

// Simple index
$tables->addIndex('idx_category', 'mymodule_items', 'category_id');

// Unique index
$tables->addIndex('idx_slug', 'mymodule_items', 'slug', true);

// Composite index
$tables->addIndex('idx_cat_status', 'mymodule_items', 'category_id, status');

$tables->executeQueue();
```

#### 하락 지수

```php
$tables->useTable('mymodule_items');
$tables->dropIndex('idx_old_index', 'mymodule_items');
$tables->executeQueue();
```

#### 기본이 아닌 모든 인덱스 삭제

```php
// Useful for cleaning up auto-generated index names
$tables->dropIndexes('mymodule_items');
$tables->executeQueue();
```

#### 기본 키 삭제

```php
$tables->dropPrimaryKey('mymodule_items');
$tables->executeQueue();
```

### 데이터 작업

#### 데이터 삽입

```php
$tables->useTable('mymodule_categories');

$tables->insert('mymodule_categories', [
    'category_id' => 1,
    'name' => 'General',
    'weight' => 0
]);

// Without automatic quoting (for expressions)
$tables->insert('mymodule_logs', [
    'created' => 'NOW()',
    'message' => "'Test message'"
], false);

$tables->executeQueue();
```

#### 데이터 업데이트

```php
$tables->useTable('mymodule_items');

// Update with criteria object
$criteria = new Criteria('status', 0);
$tables->update('mymodule_items', ['status' => 1], $criteria);

// Update with string criteria
$tables->update('mymodule_items', ['hits' => 0], 'hits IS NULL');

$tables->executeQueue();
```

#### 데이터 삭제

```php
$tables->useTable('mymodule_items');

// Delete with criteria
$criteria = new Criteria('status', -1);
$tables->delete('mymodule_items', $criteria);

// Delete with string criteria
$tables->delete('mymodule_items', 'created < DATE_SUB(NOW(), INTERVAL 1 YEAR)');

$tables->executeQueue();
```

#### 테이블 자르기

```php
$tables->useTable('mymodule_cache');
$tables->truncate('mymodule_cache');
$tables->executeQueue();
```

### 작업 대기열 관리

#### 실행 대기열

```php
// Normal execution (respects HTTP method safety)
$result = $tables->executeQueue();

// Force execution even on GET requests
$result = $tables->executeQueue(true);

if (!$result) {
    echo 'Error: ' . $tables->getLastError();
}
```

#### 대기열 재설정

```php
// Clear queue without executing
$tables->resetQueue();
```

#### 원시 SQL 추가

```php
// Add custom SQL to the queue
$tables->addToQueue('ALTER TABLE ' . $GLOBALS['xoopsDB']->prefix('mymodule_items') . ' CONVERT TO CHARACTER SET utf8mb4');
$tables->executeQueue();
```

### 오류 처리

```php
$tables = new Tables();

if (!$tables->addTable('mymodule_items')) {
    $error = $tables->getLastError();
    $errno = $tables->getLastErrNo();
    // Handle error
}
```

## Xmf\Database\Migrate

`Migrate` 클래스는 모듈 버전 간의 데이터베이스 변경 사항 동기화를 단순화합니다. 스키마 비교 및 ​​자동 동기화를 통해 `Tables`을 확장합니다.

### 기본 사용법

```php
use Xmf\Database\Migrate;

// Create migrate instance for a module
$migrate = new Migrate('mymodule');

// Synchronize database with target schema
$migrate->synchronizeSchema();
```

### 모듈 업데이트 중

일반적으로 모듈의 `xoops_module_pre_update_*` 함수에서 호출됩니다.

```php
function xoops_module_pre_update_mymodule($module, $previousVersion)
{
    $migrate = new \Xmf\Database\Migrate('mymodule');

    // Perform any pre-sync actions (renames, etc.)
    // ...

    // Synchronize schema
    return $migrate->synchronizeSchema();
}
```

### DDL 문 가져오기

대규모 데이터베이스 또는 명령줄 마이그레이션의 경우:

```php
$migrate = new Migrate('mymodule');
$statements = $migrate->getSynchronizeDDL();

// Execute statements in batches or from CLI
foreach ($statements as $sql) {
    // Process each statement
}
```

### 사전 동기화 작업

일부 변경 사항은 동기화 전에 명시적인 처리가 필요합니다. 복잡한 마이그레이션을 위해 `Migrate` 확장:

```php
class MyModuleMigrate extends \Xmf\Database\Migrate
{
    public function preSyncActions()
    {
        // Rename a table before sync
        $this->useTable('mymodule_old_name');
        $this->renameTable('mymodule_old_name', 'mymodule_new_name');
        $this->executeQueue();

        // Rename a column
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

// Usage
$migrate = new MyModuleMigrate('mymodule');
$migrate->preSyncActions();
$migrate->synchronizeSchema();
```

### 스키마 관리

#### 현재 스키마 가져오기

```php
$migrate = new Migrate('mymodule');
$currentSchema = $migrate->getCurrentSchema();
```

#### 대상 스키마 가져오기

```php
$targetSchema = $migrate->getTargetDefinitions();
```

#### 현재 스키마 저장

모듈 개발자가 데이터베이스 변경 후 스키마를 캡처하려면 다음을 수행하십시오.

```php
$migrate = new Migrate('mymodule');
$migrate->saveCurrentSchema();
// Saves schema to module's sql/migrate.yml
```

> **개발자 참고 사항:** 항상 데이터베이스를 먼저 변경한 다음 `saveCurrentSchema()`을 실행하세요. 생성된 스키마 파일을 수동으로 편집하지 마십시오.

## Xmf\Database\TableLoad

`TableLoad` 클래스는 초기 데이터를 테이블에 로드하는 것을 단순화합니다. 모듈 설치 중 기본 데이터로 테이블을 시드하는 데 유용합니다.

### 배열에서 데이터 로드

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

### YAML에서 데이터 로드

```php
// Load from YAML file
$count = TableLoad::loadTableFromYamlFile(
    'mymodule_categories',
    XOOPS_ROOT_PATH . '/modules/mymodule/sql/categories.yml'
);
```

YAML 형식:

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

### 데이터 추출

#### 행 개수 계산

```php
// Count all rows
$total = TableLoad::countRows('mymodule_items');

// Count with criteria
$criteria = new Criteria('status', 1);
$activeCount = TableLoad::countRows('mymodule_items', $criteria);
```

#### 행 추출

```php
// Extract all rows
$rows = TableLoad::extractRows('mymodule_items');

// Extract with criteria
$criteria = new Criteria('category_id', 5);
$rows = TableLoad::extractRows('mymodule_items', $criteria);

// Skip certain columns
$rows = TableLoad::extractRows('mymodule_items', null, ['password', 'token']);
```

### YAML에 데이터 저장

```php
// Save all data
TableLoad::saveTableToYamlFile(
    'mymodule_categories',
    '/path/to/categories.yml'
);

// Save filtered data
$criteria = new Criteria('is_default', 1);
TableLoad::saveTableToYamlFile(
    'mymodule_settings',
    '/path/to/default_settings.yml',
    $criteria
);

// Save without certain columns
TableLoad::saveTableToYamlFile(
    'mymodule_items',
    '/path/to/items.yml',
    null,
    ['created', 'modified']
);
```

### 테이블 자르기

```php
// Empty a table
$affectedRows = TableLoad::truncateTable('mymodule_cache');
```

## 전체 마이그레이션 예시

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
    // Create custom migrate class
    $migrate = new MyModuleMigrate('mymodule');

    // Handle version-specific migrations
    if ($previousVersion < 120) {
        // Version 1.2.0 renamed a table
        $migrate->renameOldTable();
    }

    if ($previousVersion < 130) {
        // Version 1.3.0 renamed a column
        $migrate->renameOldColumn();
    }

    // Synchronize schema
    return $migrate->synchronizeSchema();
}

function xoops_module_update_mymodule($module, $previousVersion)
{
    // Post-update data migrations
    if ($previousVersion < 130) {
        // Load new default settings
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

## API 참조

### Xmf\Database\Tables

| 방법 | 설명 |
|--------|-------------|
| `addTable($table)` | 테이블 스키마 로드 또는 생성 |
| `useTable($table)` | 기존 테이블만 로드 |
| `renameTable($table, $newName)` | 대기열 테이블 이름 바꾸기 |
| `setTableOptions($table, $options)` | 대기열 테이블 옵션 변경 |
| `dropTable($table)` | 대기열 테이블 삭제 |
| `copyTable($table, $newTable, $withData)` | 대기열 테이블 복사 |
| `addColumn($table, $column, $attributes)` | 대기열 열 추가 |
| `alterColumn($table, $column, $attributes, $newName)` | 대기열 열 변경 |
| `getColumnAttributes($table, $column)` | 열 정의 가져오기 |
| `dropColumn($table, $column)` | 대기열 열 삭제 |
| `getTableIndexes($table)` | 색인 정의 가져오기 |
| `addPrimaryKey($table, $column)` | 대기열 기본 키 |
| `addIndex($name, $table, $column, $unique)` | 대기열 색인 |
| `dropIndex($name, $table)` | 큐 인덱스 드롭 |
| `dropIndexes($table)` | 모든 인덱스 삭제를 대기열에 추가 |
| `dropPrimaryKey($table)` | 대기열 기본 키 삭제 |
| `insert($table, $columns, $quote)` | 대기열 삽입 |
| `update($table, $columns, $criteria, $quote)` | 대기열 업데이트 |
| `delete($table, $criteria)` | 대기열 삭제 |
| `truncate($table)` | 큐 잘림 |
| `executeQueue($force)` | 대기 중인 작업 실행 |
| `resetQueue()` | 대기열 지우기 |
| `addToQueue($sql)` | 원시 SQL 추가 |
| `getLastError()` | 마지막 오류 메시지 받기 |
| `getLastErrNo()` | 마지막 오류 코드 가져오기 |

### Xmf\Database\Migrate

| 방법 | 설명 |
|--------|-------------|
| `__construct($dirname)` | 모듈용으로 만들기 |
| `synchronizeSchema()` | 데이터베이스를 대상으로 동기화 |
| `getSynchronizeDDL()` | DDL 문 가져오기 |
| `preSyncActions()` | 사용자 정의 작업에 대한 재정의 |
| `getCurrentSchema()` | 현재 데이터베이스 스키마 가져오기 |
| `getTargetDefinitions()` | 대상 스키마 가져오기 |
| `saveCurrentSchema()` | 개발자를 위한 스키마 저장 |

### Xmf\Database\TableLoad

| 방법 | 설명 |
|--------|-------------|
| `loadTableFromArray($table, $data)` | 배열에서 로드 |
| `loadTableFromYamlFile($table, $file)` | YAML에서 로드 |
| `truncateTable($table)` | 빈 테이블 |
| `countRows($table, $criteria)` | 행 개수 |
| `extractRows($table, $criteria, $skip)` | 행 추출 |
| `saveTableToYamlFile($table, $file, $criteria, $skip)` | YAML에 저장 |

## 참고 항목

-../XMF-Framework - 프레임워크 개요
-../Basics/XMF-Module-Helper - 모듈 도우미 클래스
- Metagen - 메타데이터 유틸리티

---

#xmf #데이터베이스 #마이그레이션 #스키마 #테이블 #ddl
