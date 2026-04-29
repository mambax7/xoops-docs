---
title: "Criteria 및 CriteriaCompo 클래스"
description: "Criteria 클래스를 사용한 쿼리 작성 및 고급 필터링"
---

`Criteria` 및 `CriteriaCompo` 클래스는 복잡한 데이터베이스 쿼리를 작성하기 위한 원활한 객체 지향 인터페이스를 제공합니다. 이러한 클래스는 SQL WHERE 절을 추상화하여 개발자가 동적 쿼리를 안전하고 읽기 쉽게 구성할 수 있도록 합니다.

## 클래스 개요

### Criteria 클래스

`Criteria` 클래스는 WHERE 절의 단일 조건을 나타냅니다.

```php
namespace Xoops\Database;

class Criteria
{
    protected $column;
    protected $operator;
    protected $value;
    protected $function;

    public function __construct(
        string $column,
        mixed $value = null,
        string $operator = '=',
        string $function = ''
    ) {}

    public function render(string $prefix = ''): string {}
}
```

## 기본 사용법

### 단순 Criteria

```php
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

// Single condition
$criteria = new Criteria('status', 'active');
// Renders: `status` = 'active'
```

### 다양한 연산자

```php
// Equality (default)
$criteria = new Criteria('status', 'active', '=');

// Not equal
$criteria = new Criteria('status', 'active', '<>');

// Greater than
$criteria = new Criteria('age', 18, '>');

// Less than or equal
$criteria = new Criteria('age', 65, '<=');

// LIKE (for pattern matching)
$criteria = new Criteria('email', '%@example.com', 'LIKE');

// IN (for multiple values)
$criteria = new Criteria('status', ['active', 'pending', 'review'], 'IN');
```

## 복잡한 쿼리 작성

### AND 논리(기본값)

```php
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 'active'));
$criteria->add(new Criteria('age', 18, '>='));
$criteria->add(new Criteria('verified', 1));
// Renders: `status` = 'active' AND `age` >= 18 AND `verified` = 1
```

### 또는 논리

```php
$criteria = new CriteriaCompo('OR');
$criteria->add(new Criteria('role', 'admin'));
$criteria->add(new Criteria('role', 'moderator'));
$criteria->add(new Criteria('role', 'editor'));
```

## 리포지토리 패턴과 통합

### 저장소 예

```php
namespace MyModule\Repository;

use Xoops\Database\XoopsDatabase;
use Xoops\Database\Criteria;
use Xoops\Database\CriteriaCompo;

class UserRepository
{
    private $db;
    private $table = 'users';

    public function __construct(XoopsDatabase $db)
    {
        $this->db = $db;
    }

    public function findByCriteria(CriteriaCompo $criteria): array
    {
        $sql = "SELECT * FROM {$this->table}";

        if ($criteria->count() > 0) {
            $sql .= " WHERE " . $criteria->render();
        }

        $result = $this->db->query($sql);
        $users = [];

        while ($row = $this->db->fetchArray($result)) {
            $users[] = new User($row);
        }

        return $users;
    }
}
```

## 안전 및 보안

### 자동 탈출

`Criteria` 클래스는 SQL 삽입을 방지하기 위해 자동으로 값을 이스케이프합니다.

```php
// Safe - value is automatically escaped
$userInput = "'; DROP TABLE users; --";
$criteria = new Criteria('username', $userInput);
// Safely renders: `username` = '\''; DROP TABLE users; --'
```

## API 참조

### Criteria 방법

| 방법 | 설명 | 반품 |
|--------|-------------|--------|
| `__construct()` | 기준 조건 초기화 | 무효 |
| `render($prefix = '')` | SQL WHERE 절 세그먼트로 렌더링 | 문자열 |
| `getColumn()` | 열 이름 가져오기 | 문자열 |
| `getValue()` | 비교 값 가져오기 | 혼합 |
| `getOperator()` | 비교 연산자 가져오기 | 문자열 |

### CriteriaCompo 방법

| 방법 | 설명 | 반품 |
|--------|-------------|--------|
| `__construct($logic = 'AND')` | 복합 기준 초기화 | 무효 |
| `add($criteria, $logic = null)` | 기준 또는 중첩된 복합 추가 | 무효 |
| `render($prefix = '')` | WHERE 절을 완성하기 위해 렌더링 | 문자열 |
| `count()` | 기준 개수 가져오기 | 정수 |
| `clear()` | 모든 기준 제거 | 무효 |

## 관련 문서

- XoopsDatabase - 데이터베이스 클래스 참조
-../../03-모듈-개발/패턴/리포지토리-패턴 - XOOPS의 리포지토리 패턴
-../../03-Module-Development/Patterns/Service-Layer-Pattern - 서비스 레이어 패턴

## 버전 정보

- **소개:** XOOPS 2.5.0
- **최종 업데이트:** XOOPS 4.0
- **호환성:** PHP 7.4+
