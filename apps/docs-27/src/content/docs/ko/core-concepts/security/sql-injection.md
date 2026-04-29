---
title: "SQL 주입 방지"
description: "XOOPS에서 데이터베이스 보안 관행 및 SQL 주입 방지"
---

SQL 주입은 가장 위험하고 일반적인 웹 애플리케이션 취약점 중 하나입니다. 이 가이드에서는 SQL 주입 공격으로부터 XOOPS 모듈을 보호하는 방법을 다룹니다.

## 관련 문서

- 보안 모범 사례 - 종합 보안 가이드
- CSRF 보호 - 토큰 시스템 및 XoopsSecurity 클래스
- 입력 삭제 - MyTextSanitizer 및 유효성 검사

## SQL 인젝션 이해하기

SQL 주입은 적절한 정리 또는 매개 변수화 없이 사용자 입력이 SQL 쿼리에 직접 포함될 때 발생합니다.

### 취약한 코드 예

```php
// DANGEROUS - DO NOT USE
$id = $_GET['id'];
$sql = "SELECT * FROM " . $xoopsDB->prefix('items') . " WHERE id = " . $id;
$result = $xoopsDB->query($sql);
```

사용자가 `1 OR 1=1`을 ID로 전달하면 쿼리는 다음과 같습니다.
```sql
SELECT * FROM xoops_items WHERE id = 1 OR 1=1
```

이는 단 하나의 레코드가 아닌 모든 레코드를 반환합니다.

## 매개변수화된 쿼리 사용

SQL 주입에 대한 가장 효과적인 방어는 매개변수화된 쿼리(준비된 문)를 사용하는 것입니다.

### 기본 매개변수 쿼리

```php
// Get database connection
$xoopsDB = XoopsDatabaseFactory::getDatabaseConnection();

// SECURE - Using parameterized query
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$_GET['id']]);
```

### 다중 매개변수

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = ? AND status = ?";
$result = $xoopsDB->query($sql, [$username, $status]);
```

### 명명된 매개변수

일부 데이터베이스 추상화는 명명된 매개변수를 지원합니다.

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE username = :username AND status = :status";
$result = $xoopsDB->query($sql, [
    ':username' => $username,
    ':status' => $status
]);
```

## XoopsObject 및 XoopsObjectHandler 사용

XOOPS는 Criteria 시스템을 통한 SQL 주입을 방지하는 데 도움이 되는 객체 지향 데이터베이스 액세스를 제공합니다.

### 기본 Criteria 사용법

```php
// Get the handler
$itemHandler = xoops_getModuleHandler('item', 'mymodule');

// Create criteria
$criteria = new Criteria('category_id', (int)$categoryId);

// Get objects - automatically safe from SQL injection
$items = $itemHandler->getObjects($criteria);
```

여러 조건의 경우 ### CriteriaCompo

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('category_id', (int)$categoryId));
$criteria->add(new Criteria('status', 'published'));
$criteria->add(new Criteria('uid', (int)$userId));

// Optional: Add ordering and limits
$criteria->setSort('created');
$criteria->setOrder('DESC');
$criteria->setLimit(10);
$criteria->setStart(0);

$items = $itemHandler->getObjects($criteria);
```

### Criteria 운영자

```php
// Equal (default)
$criteria->add(new Criteria('status', 'active'));

// Not equal
$criteria->add(new Criteria('status', 'deleted', '!='));

// Greater than
$criteria->add(new Criteria('count', 100, '>'));

// Less than or equal
$criteria->add(new Criteria('price', 50, '<='));

// LIKE (for partial matching)
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));

// IN (multiple values)
$criteria->add(new Criteria('id', '(' . implode(',', $ids) . ')', 'IN'));
```

### 또는 조건

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'published'));

// OR condition
$orCriteria = new CriteriaCompo();
$orCriteria->add(new Criteria('uid', (int)$userId), 'OR');
$orCriteria->add(new Criteria('is_public', 1), 'OR');

$criteria->add($orCriteria);
```

## 테이블 접두사

항상 XOOPS 테이블 접두사 시스템을 사용하십시오.

```php
// Correct - using prefix
$table = $xoopsDB->prefix('mytable');
$sql = "SELECT * FROM {$table} WHERE id = ?";

// Also correct
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
```

## INSERT 쿼리

### 준비된 문 사용하기

```php
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') .
       " (title, content, uid, created) VALUES (?, ?, ?, ?)";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    (int)$userId,
    time()
]);

if ($result) {
    $newId = $xoopsDB->getInsertId();
}
```

### XoopsObject 사용

```php
// Create new object
$item = $itemHandler->create();

// Set values - handler escapes automatically
$item->setVar('title', $title);
$item->setVar('content', $content);
$item->setVar('uid', (int)$userId);
$item->setVar('created', time());

// Insert
if ($itemHandler->insert($item)) {
    $newId = $item->getVar('itemid');
}
```

## 업데이트 쿼리

### 준비된 문 사용하기

```php
$sql = "UPDATE " . $xoopsDB->prefix('mytable') .
       " SET title = ?, content = ?, updated = ? WHERE id = ?";

$result = $xoopsDB->query($sql, [
    $title,
    $content,
    time(),
    (int)$id
]);
```

### XoopsObject 사용

```php
// Get existing object
$item = $itemHandler->get((int)$id);

if ($item) {
    $item->setVar('title', $title);
    $item->setVar('content', $content);
    $item->setVar('updated', time());

    $itemHandler->insert($item);
}
```

## 쿼리 삭제

### 준비된 문 사용하기

```php
$sql = "DELETE FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### XoopsObject 사용

```php
$item = $itemHandler->get((int)$id);
if ($item) {
    $itemHandler->delete($item);
}
```

### Criteria을 사용한 대량 삭제

```php
$criteria = new Criteria('status', 'deleted');
$itemHandler->deleteAll($criteria);
```

## 필요할 때 탈출하기

준비된 문을 사용할 수 없는 경우 적절한 이스케이프를 사용하세요.

```php
// Using mysqli_real_escape_string
$safe_value = $xoopsDB->escape($value);
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " WHERE title = '" . $safe_value . "'";
```

그러나 이스케이프보다 **항상 준비된 문을 선호**합니다.

## 안전하게 동적 쿼리 구축하기

### 안전한 동적 열 이름

열 이름은 매개변수화할 수 없습니다. 화이트리스트에 대해 유효성을 검사합니다.

```php
$allowed_columns = ['title', 'created', 'updated', 'status'];
$sort = $_GET['sort'] ?? 'created';

if (!in_array($sort, $allowed_columns)) {
    $sort = 'created'; // Default safe value
}

$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
       " ORDER BY {$sort} DESC";
```

### 안전한 동적 테이블 이름

마찬가지로 테이블 이름을 확인합니다.

```php
$allowed_tables = ['items', 'categories', 'comments'];
$table = $_GET['table'] ?? 'items';

if (!in_array($table, $allowed_tables)) {
    $table = 'items';
}

$sql = "SELECT * FROM " . $xoopsDB->prefix($table) . " WHERE id = ?";
```

### WHERE 절을 동적으로 작성하기

```php
$criteria = new CriteriaCompo();

// Add conditions based on input
if (!empty($_GET['category'])) {
    $criteria->add(new Criteria('category_id', (int)$_GET['category']));
}

if (!empty($_GET['status'])) {
    $allowed_statuses = ['draft', 'published', 'archived'];
    if (in_array($_GET['status'], $allowed_statuses)) {
        $criteria->add(new Criteria('status', $_GET['status']));
    }
}

if (!empty($_GET['search'])) {
    $search = '%' . $_GET['search'] . '%';
    $criteria->add(new Criteria('title', $search, 'LIKE'));
}

$items = $itemHandler->getObjects($criteria);
```

## 좋아요 쿼리

와일드카드 삽입을 방지하려면 LIKE 쿼리에 주의하세요.

```php
// Escape special characters in search term
$searchTerm = str_replace(['%', '_'], ['\%', '\_'], $searchTerm);

// Then use in LIKE
$criteria->add(new Criteria('title', '%' . $searchTerm . '%', 'LIKE'));
```

## IN 절

IN 절을 사용할 때 모든 값이 올바르게 입력되었는지 확인하세요.

```php
// Array of IDs from user input
$inputIds = $_POST['ids'] ?? [];

// Sanitize: ensure all are integers
$safeIds = array_map('intval', $inputIds);
$safeIds = array_filter($safeIds, function($id) { return $id > 0; });

if (!empty($safeIds)) {
    $idList = implode(',', $safeIds);
    $sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') .
           " WHERE id IN ({$idList})";
    $result = $xoopsDB->query($sql);
}
```

또는 Criteria을 사용하면 다음과 같습니다.

```php
if (!empty($safeIds)) {
    $criteria = new Criteria('id', '(' . implode(',', $safeIds) . ')', 'IN');
    $items = $itemHandler->getObjects($criteria);
}
```

## 거래 안전

여러 관련 쿼리를 수행하는 경우:

```php
// Start transaction
$xoopsDB->query("START TRANSACTION");

try {
    // Query 1
    $sql1 = "INSERT INTO " . $xoopsDB->prefix('items') . " (title) VALUES (?)";
    $result1 = $xoopsDB->query($sql1, [$title]);

    if (!$result1) {
        throw new Exception('Insert failed');
    }

    $itemId = $xoopsDB->getInsertId();

    // Query 2
    $sql2 = "INSERT INTO " . $xoopsDB->prefix('item_meta') .
            " (item_id, meta_key, meta_value) VALUES (?, ?, ?)";
    $result2 = $xoopsDB->query($sql2, [$itemId, 'author', $author]);

    if (!$result2) {
        throw new Exception('Meta insert failed');
    }

    // Commit
    $xoopsDB->query("COMMIT");

} catch (Exception $e) {
    // Rollback on error
    $xoopsDB->query("ROLLBACK");
    throw $e;
}
```

## 오류 처리

사용자에게 SQL 오류를 노출하지 마십시오.

```php
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);

if (!$result) {
    // Log the actual error for debugging
    error_log('Database error: ' . $xoopsDB->error());

    // Show generic message to user
    redirect_header('index.php', 3, 'An error occurred. Please try again.');
    exit();
}
```

## 피해야 할 일반적인 실수

### 실수 1: 직접 변수 보간

```php
// WRONG
$sql = "SELECT * FROM {$table} WHERE id = {$id}";

// RIGHT
$sql = "SELECT * FROM " . $xoopsDB->prefix('mytable') . " WHERE id = ?";
$result = $xoopsDB->query($sql, [(int)$id]);
```

### 실수 2: addlashes() 사용

```php
// WRONG - addslashes is NOT sufficient
$safe = addslashes($_GET['input']);

// RIGHT - use parameterized queries or proper escaping
$sql = "SELECT * FROM table WHERE col = ?";
$result = $xoopsDB->query($sql, [$_GET['input']]);
```

### 실수 3: 숫자 ID를 신뢰함

```php
// WRONG - assuming input is numeric
$id = $_GET['id'];
$sql = "SELECT * FROM table WHERE id = " . $id;

// RIGHT - explicitly cast to integer
$id = (int)$_GET['id'];
$sql = "SELECT * FROM table WHERE id = ?";
$result = $xoopsDB->query($sql, [$id]);
```

### 실수 4: 2차 주입

```php
// Data from database is NOT automatically safe
$userData = $itemHandler->get($id);
$username = $userData->getVar('username');

// WRONG - trusting data from database
$sql = "SELECT * FROM log WHERE username = '" . $username . "'";

// RIGHT - always use parameters
$sql = "SELECT * FROM log WHERE username = ?";
$result = $xoopsDB->query($sql, [$username]);
```

## 보안 테스트

### 쿼리 테스트

SQL 삽입을 확인하려면 다음 입력으로 양식을 테스트하세요.

- `' OR '1'='1`
- `1; DROP TABLE users--`
- `1 UNION SELECT * FROM users--`
- `admin'--`
- `' OR 1=1#`

이들 중 하나라도 예상치 못한 동작이나 오류가 발생한다면 취약성이 있는 것입니다.

### 자동화된 테스트

개발 중에 자동화된 SQL 주입 테스트 도구를 사용하십시오.

- SQL맵
- 버프 스위트
- OWASP ZAP

## 모범 사례 요약

1. **항상 매개변수화된 쿼리를 사용하세요**(준비된 문)
2. **가능하면 XoopsObject/XoopsObjectHandler**을 사용하세요.
3. **쿼리 작성에 Criteria 클래스 사용**
4. 열 및 테이블 이름에 대한 **허용 값 목록**
5. `(int)` 또는 `(float)`을 사용하여 **숫자 값**을 명시적으로 캐스팅합니다.
6. **데이터베이스 오류를 사용자에게 절대 노출하지 마세요**
7. 여러 관련 쿼리에 **트랜잭션 사용**
8. 개발 중 **SQL 주입 테스트**
9. 검색어에서 **와일드카드처럼 탈출**
10. **IN 절 값**을 개별적으로 삭제합니다.

---

#security #sql-injection #database #xoops #prepared-statements #Criteria
