---
title: "XoopsDatabase 클래스"
description: "연결 관리, 쿼리 실행 및 결과 처리를 제공하는 데이터베이스 추상화 계층"
---

`XoopsDatabase` 클래스는 연결 관리, 쿼리 실행, 결과 처리 및 오류 처리를 처리하는 XOOPS용 데이터베이스 추상화 계층을 제공합니다. 드라이버 아키텍처를 통해 여러 데이터베이스 드라이버를 지원합니다.

## 클래스 개요

```php
namespace Xoops\Database;

abstract class XoopsDatabase
{
    protected $conn;
    protected $prefix;
    protected $logger;

    abstract public function connect(bool $selectdb = true): bool;
    abstract public function query(string $sql, int $limit = 0, int $start = 0);
    abstract public function fetchArray($result): ?array;
    abstract public function fetchObject($result): ?object;
    abstract public function getRowsNum($result): int;
    abstract public function getAffectedRows(): int;
    abstract public function getInsertId(): int;
    abstract public function escape(string $string): string;
}
```

## 클래스 계층

```
XoopsDatabase (Abstract Base)
├── XoopsMySQLDatabase (MySQL Extension)
│   └── XoopsMySQLDatabaseProxy (Security Proxy)
└── XoopsMySQLiDatabase (MySQLi Extension)
    └── XoopsMySQLiDatabaseProxy (Security Proxy)

XoopsDatabaseFactory
└── Creates appropriate driver instances
```

## 데이터베이스 인스턴스 얻기

### 팩토리 사용

```php
// Recommended: Use the factory
$db = XoopsDatabaseFactory::getDatabaseConnection();
```

### getInstance 사용

```php
// Alternative: Direct singleton access
$db = XoopsDatabase::getInstance();
```

### 전역 변수

```php
// Legacy: Use global variable
global $xoopsDB;
```

## 핵심 메소드

### 연결

데이터베이스 연결을 설정합니다.

```php
abstract public function connect(bool $selectdb = true): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$selectdb` | 불리언 | 데이터베이스 선택 여부 |

**반환:** `bool` - 연결 성공 시 True

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
if ($db->connect()) {
    echo "Connected successfully";
}
```

---

### 쿼리

SQL 쿼리를 실행합니다.

```php
abstract public function query(
    string $sql,
    int $limit = 0,
    int $start = 0
): mixed
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$sql` | 문자열 | SQL 쿼리 문자열 |
| `$limit` | 정수 | 반환할 최대 행(0 = 제한 없음) |
| `$start` | 정수 | 시작 오프셋 |

**반환:** `resource|bool` - 결과 리소스 또는 실패 시 false

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Simple query
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid > 0";
$result = $db->query($sql);

// Query with limit
$sql = "SELECT * FROM " . $db->prefix('users');
$result = $db->query($sql, 10, 0); // First 10 rows

// Query with offset
$result = $db->query($sql, 10, 20); // 10 rows starting at row 20
```

---

### 쿼리F

작업을 강제하는 쿼리를 실행합니다(보안 검사 우회).

```php
public function queryF(string $sql, int $limit = 0, int $start = 0): mixed
```

**사용 사례:**
- INSERT, UPDATE, DELETE 작업
- 읽기 전용 제한을 우회해야 하는 경우

**예:**
```php
$sql = sprintf(
    "UPDATE %s SET views = views + 1 WHERE article_id = %d",
    $db->prefix('articles'),
    $articleId
);
$db->queryF($sql);
```

---

### 접두사

데이터베이스 테이블 접두사를 앞에 추가합니다.

```php
public function prefix(string $table = ''): string
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$table` | 문자열 | 접두사가 없는 테이블 이름 |

**반환:** `string` - 접두사가 포함된 테이블 이름

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

echo $db->prefix('users');       // "xoops_users" (if prefix is "xoops_")
echo $db->prefix('modules');     // "xoops_modules"
echo $db->prefix();              // "xoops_" (just the prefix)
```

---

### fetchArray

결과 행을 연관 배열로 가져옵니다.

```php
abstract public function fetchArray($result): ?array
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$result` | 자원 | 쿼리 결과 리소스 |

**반환:** `array|null` - 연관 배열 또는 더 이상 행이 없는 경우 null

**예:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);

while ($row = $db->fetchArray($result)) {
    echo "User: " . $row['uname'] . "\n";
    echo "Email: " . $row['email'] . "\n";
}
```

---

### fetchObject

결과 행을 객체로 가져옵니다.

```php
abstract public function fetchObject($result): ?object
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$result` | 자원 | 쿼리 결과 리소스 |

**반환:** `object|null` - 각 열의 속성이 포함된 개체

**예:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = 1";
$result = $db->query($sql);

if ($user = $db->fetchObject($result)) {
    echo "Username: " . $user->uname;
    echo "Email: " . $user->email;
}
```

---

### fetchRow

결과 행을 숫자 배열로 가져옵니다.

```php
abstract public function fetchRow($result): ?array
```

**예:**
```php
$sql = "SELECT uname, email FROM " . $db->prefix('users');
$result = $db->query($sql);

while ($row = $db->fetchRow($result)) {
    echo "Username: " . $row[0] . ", Email: " . $row[1];
}
```

---

### 둘 다 가져오기

결과 행을 연관 및 숫자 배열로 가져옵니다.

```php
abstract public function fetchBoth($result): ?array
```

**예:**
```php
$result = $db->query($sql);
$row = $db->fetchBoth($result);
echo $row['uname'];  // By name
echo $row[0];        // By index
```

---

### getRowsNum

결과 세트의 행 수를 가져옵니다.

```php
abstract public function getRowsNum($result): int
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$result` | 자원 | 쿼리 결과 리소스 |

**반환:** `int` - 행 수

**예:**
```php
$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE level > 0";
$result = $db->query($sql);
$count = $db->getRowsNum($result);
echo "Found $count active users";
```

---

### getAffectedRows

마지막 쿼리에서 영향을 받은 행 수를 가져옵니다.

```php
abstract public function getAffectedRows(): int
```

**반환:** `int` - 영향을 받은 행 수

**예:**
```php
$sql = "UPDATE " . $db->prefix('users') . " SET last_login = " . time() . " WHERE uid = 1";
$db->queryF($sql);
$affected = $db->getAffectedRows();
echo "Updated $affected rows";
```

---

### getInsertId

마지막 INSERT에서 자동 생성된 ID를 가져옵니다.

```php
abstract public function getInsertId(): int
```

**반환:** `int` - 마지막 삽입 ID

**예:**
```php
$sql = sprintf(
    "INSERT INTO %s (title, content) VALUES (%s, %s)",
    $db->prefix('articles'),
    $db->quoteString($title),
    $db->quoteString($content)
);
$db->queryF($sql);
$newId = $db->getInsertId();
echo "Created article with ID: $newId";
```

---

### 탈출

SQL 쿼리에서 안전하게 사용하기 위해 문자열을 이스케이프합니다.

```php
abstract public function escape(string $string): string
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$string` | 문자열 | 이스케이프할 문자열 |

**반환:** `string` - 이스케이프된 문자열(따옴표 제외)

**예:**
```php
$unsafeInput = "O'Reilly";
$safe = $db->escape($unsafeInput);  // "O\'Reilly"

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uname = '" . $safe . "'";
```

---

### quoteString

SQL에 대한 문자열을 이스케이프하고 인용합니다.

```php
public function quoteString(string $string): string
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$string` | 문자열 | 인용할 문자열 |

**반환:** `string` - 이스케이프 처리되고 인용된 문자열

**예:**
```php
$name = "John O'Connor";
$quoted = $db->quoteString($name);  // "'John O\'Connor'"

$sql = "INSERT INTO users (name) VALUES (" . $quoted . ")";
```

---

### freeRecordSet

결과와 관련된 메모리를 해제합니다.

```php
abstract public function freeRecordSet($result): void
```

**예:**
```php
$result = $db->query($sql);
// Process results...
$db->freeRecordSet($result);  // Free memory
```

---

## 오류 처리

### 오류

마지막 오류 메시지를 가져옵니다.

```php
abstract public function error(): string
```

**예:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Database error: " . $db->error();
}
```

---

### 오류

마지막 오류 번호를 가져옵니다.

```php
abstract public function errno(): int
```

**예:**
```php
$result = $db->query($sql);
if (!$result) {
    echo "Error #" . $db->errno() . ": " . $db->error();
}
```

---

## 준비된 명령문(MySQLi)

MySQLi 드라이버는 보안 강화를 위해 준비된 명령문을 지원합니다.

### 준비

준비된 문을 만듭니다.

```php
public function prepare(string $sql): mysqli_stmt|false
```

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

$sql = "SELECT * FROM " . $db->prefix('users') . " WHERE uid = ?";
$stmt = $db->prepare($sql);

$stmt->bind_param('i', $userId);
$userId = 5;
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    echo $row['uname'];
}
$stmt->close();
```

### 여러 매개변수가 있는 준비된 문

```php
$sql = "INSERT INTO " . $db->prefix('articles') . " (title, content, author_id) VALUES (?, ?, ?)";
$stmt = $db->prepare($sql);

$stmt->bind_param('ssi', $title, $content, $authorId);

$title = "My Article";
$content = "Article content here";
$authorId = 1;

if ($stmt->execute()) {
    echo "Article created with ID: " . $stmt->insert_id;
}

$stmt->close();
```

---

## 거래 지원

### 시작트랜잭션

거래를 시작합니다.

```php
public function beginTransaction(): bool
```

### 커밋

현재 트랜잭션을 커밋합니다.

```php
public function commit(): bool
```

### 롤백

현재 트랜잭션을 롤백합니다.

```php
public function rollback(): bool
```

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

try {
    $db->beginTransaction();

    // Multiple operations
    $sql1 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance - 100 WHERE id = 1";
    $db->queryF($sql1);

    $sql2 = "UPDATE " . $db->prefix('accounts') . " SET balance = balance + 100 WHERE id = 2";
    $db->queryF($sql2);

    // Check for errors
    if ($db->errno()) {
        throw new Exception($db->error());
    }

    $db->commit();
    echo "Transaction completed";

} catch (Exception $e) {
    $db->rollback();
    echo "Transaction failed: " . $e->getMessage();
}
```

---

## 전체 사용 예

### 기본 CRUD 작업

```php
$db = XoopsDatabaseFactory::getDatabaseConnection();

// CREATE
$sql = sprintf(
    "INSERT INTO %s (title, content, created) VALUES (%s, %s, %d)",
    $db->prefix('articles'),
    $db->quoteString('New Article'),
    $db->quoteString('Article content'),
    time()
);
$db->queryF($sql);
$articleId = $db->getInsertId();

// READ
$sql = "SELECT * FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$result = $db->query($sql);
$article = $db->fetchArray($result);

// UPDATE
$sql = sprintf(
    "UPDATE %s SET title = %s, updated = %d WHERE id = %d",
    $db->prefix('articles'),
    $db->quoteString('Updated Title'),
    time(),
    $articleId
);
$db->queryF($sql);

// DELETE
$sql = "DELETE FROM " . $db->prefix('articles') . " WHERE id = " . (int)$articleId;
$db->queryF($sql);
```

### 페이지 매김 쿼리

```php
function getArticles(int $page = 1, int $perPage = 10): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();
    $start = ($page - 1) * $perPage;

    // Get total count
    $sql = "SELECT COUNT(*) as total FROM " . $db->prefix('articles') . " WHERE published = 1";
    $result = $db->query($sql);
    $row = $db->fetchArray($result);
    $total = $row['total'];

    // Get page of results
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE published = 1 ORDER BY created DESC";
    $result = $db->query($sql, $perPage, $start);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return [
        'articles' => $articles,
        'total' => $total,
        'pages' => ceil($total / $perPage),
        'current' => $page
    ];
}
```

### LIKE를 사용한 검색어

```php
function searchArticles(string $keyword): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $keyword = $db->escape($keyword);
    $sql = "SELECT * FROM " . $db->prefix('articles') .
           " WHERE title LIKE '%" . $keyword . "%'" .
           " OR content LIKE '%" . $keyword . "%'" .
           " ORDER BY created DESC";

    $result = $db->query($sql, 50);  // Limit to 50 results

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

### 조인 쿼리

```php
function getArticlesWithAuthors(): array
{
    $db = XoopsDatabaseFactory::getDatabaseConnection();

    $sql = "SELECT a.*, u.uname as author_name, u.email as author_email
            FROM " . $db->prefix('articles') . " a
            LEFT JOIN " . $db->prefix('users') . " u ON a.author_id = u.uid
            WHERE a.published = 1
            ORDER BY a.created DESC";

    $result = $db->query($sql, 20);

    $articles = [];
    while ($row = $db->fetchArray($result)) {
        $articles[] = $row;
    }

    return $articles;
}
```

---

## SqlUtility 클래스

SQL 파일 작업을 위한 도우미 클래스입니다.

### 분할MySqlFile

SQL 파일을 개별 쿼리로 분할합니다.

```php
public static function splitMySqlFile(string $content): array
```

**예:**
```php
$sqlContent = file_get_contents('install.sql');
$queries = SqlUtility::splitMySqlFile($sqlContent);

foreach ($queries as $query) {
    $db->queryF($query);
    if ($db->errno()) {
        echo "Error executing: " . $query . "\n";
        echo "Error: " . $db->error() . "\n";
    }
}
```

### 접두사 쿼리

테이블 자리 표시자를 접두사가 붙은 테이블 이름으로 바꿉니다.

```php
public static function prefixQuery(string $sql, string $prefix): string
```

**예:**
```php
$sql = "CREATE TABLE {PREFIX}_articles (id INT PRIMARY KEY)";
$prefixedSql = SqlUtility::prefixQuery($sql, $db->prefix());
// "CREATE TABLE xoops_articles (id INT PRIMARY KEY)"
```

---

## 모범 사례

### 보안

1. **항상 사용자 입력을 피하세요**:
```php
$safe = $db->escape($_POST['input']);
```

2. **가능한 경우 준비된 설명을 사용하세요**:
```php
$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param('i', $id);
```

3. **값에 quoteString 사용**:
```php
$sql = "INSERT INTO table (name) VALUES (" . $db->quoteString($name) . ")";
```

### 성능

1. **대형 테이블에는 항상 LIMIT를 사용하세요**:
```php
$result = $db->query($sql, 100);  // Limit results
```

2. **완료 시 무료 결과 세트**:
```php
$db->freeRecordSet($result);
```

3. 테이블 정의에 **적절한 인덱스 사용**

4. 가능하다면 **원시 SQL보다 핸들러를 선호**

### 오류 처리

1. **항상 오류를 확인하세요**:
```php
$result = $db->query($sql);
if (!$result) {
    trigger_error($db->error(), E_USER_WARNING);
}
```

2. **여러 관련 작업에 트랜잭션 사용**:
```php
$db->beginTransaction();
// ... operations ...
$db->commit();  // or $db->rollback();
```

## 관련 문서

- Criteria - 쿼리 기준 시스템
- QueryBuilder - 유창한 쿼리 작성
-../Core/XoopsObjectHandler - 객체 지속성

---

*참조: [XOOPS 소스 코드](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class/database)*
