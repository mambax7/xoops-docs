---
title: "XoopsObjectHandler 클래스"
description: "데이터베이스 지속성을 갖춘 XoopsObject 인스턴스의 CRUD 작업을 위한 기본 핸들러 클래스"
---

`XoopsObjectHandler` 클래스와 해당 확장 `XoopsPersistableObjectHandler`은 `XoopsObject` 인스턴스에서 CRUD(생성, 읽기, 업데이트, 삭제) 작업을 수행하기 위한 표준화된 인터페이스를 제공합니다. 이는 도메인 논리를 데이터베이스 액세스와 분리하는 데이터 매퍼 패턴을 구현합니다.

## 클래스 개요

```php
namespace Xoops\Core;

abstract class XoopsObjectHandler
{
    protected XoopsDatabase $db;

    public function __construct(XoopsDatabase $db);
    abstract public function create(bool $isNew = true);
    abstract public function get(int $id);
    abstract public function insert(XoopsObject $obj, bool $force = false): bool;
    abstract public function delete(XoopsObject $obj, bool $force = false): bool;
}
```

## 클래스 계층

```
XoopsObjectHandler (Abstract Base)
└── XoopsPersistableObjectHandler (Extended Implementation)
    ├── XoopsUserHandler
    ├── XoopsGroupHandler
    ├── XoopsModuleHandler
    ├── XoopsBlockHandler
    ├── XoopsConfigHandler
    └── [Custom Module Handlers]
```

## XoopsObjectHandler

### 생성자

```php
public function __construct(XoopsDatabase $db)
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | 데이터베이스 연결 인스턴스 |

**예:**
```php
$db = XoopsDatabaseFactory::getDatabaseConnection();
$handler = new MyObjectHandler($db);
```

---

### 생성

새 개체 인스턴스를 만듭니다.

```php
abstract public function create(bool $isNew = true): ?XoopsObject
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$isNew` | 불리언 | 객체가 새로운 객체인지 여부(기본값: true) |

**반환:** `XoopsObject|null` - 새 개체 인스턴스

**예:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'newuser');
```

---

### 얻다

기본 키로 객체를 검색합니다.

```php
abstract public function get(int $id): ?XoopsObject
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$id` | 정수 | 기본 키 값 |

**반환:** `XoopsObject|null` - 개체 인스턴스 또는 찾을 수 없는 경우 null

**예:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(1);
if ($user) {
    echo $user->getVar('uname');
}
```

---

### 삽입

데이터베이스에 개체를 저장합니다(삽입 또는 업데이트).

```php
abstract public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 저장할 개체 |
| `$force` | 불리언 | 객체가 변경되지 않은 경우에도 강제 작동 |

**반환:** `bool` - 성공 시 True

**예:**
```php
$handler = xoops_getHandler('user');
$user = $handler->create();
$user->setVar('uname', 'testuser');
$user->setVar('email', 'test@example.com');

if ($handler->insert($user)) {
    echo "User saved with ID: " . $user->getVar('uid');
} else {
    echo "Save failed: " . implode(', ', $user->getErrors());
}
```

---

### 삭제

데이터베이스에서 개체를 삭제합니다.

```php
abstract public function delete(
    XoopsObject $obj,
    bool $force = false
): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$obj` | XoopsObject | 삭제할 개체 |
| `$force` | 불리언 | 강제삭제 |

**반환:** `bool` - 성공 시 True

**예:**
```php
$handler = xoops_getHandler('user');
$user = $handler->get(5);

if ($user && $handler->delete($user)) {
    echo "User deleted";
}
```

---

## XoopsPersistableObjectHandler

`XoopsPersistableObjectHandler`은 쿼리 및 대량 작업을 위한 추가 방법으로 `XoopsObjectHandler`을 확장합니다.

### 생성자

```php
public function __construct(
    XoopsDatabase $db,
    string $table,
    string $className,
    string $keyName,
    string $identifierName = ''
)
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$db` | XoopsDatabase | 데이터베이스 연결 |
| `$table` | 문자열 | 테이블 이름(접두사 없음) |
| `$className` | 문자열 | 객체의 전체 클래스 이름 |
| `$keyName` | 문자열 | 기본 키 필드 이름 |
| `$identifierName` | 문자열 | 사람이 읽을 수 있는 식별자 필드 |

**예:**
```php
class ArticleHandler extends XoopsPersistableObjectHandler
{
    public function __construct(XoopsDatabase $db)
    {
        parent::__construct(
            $db,
            'mymodule_articles',    // Table name
            'Article',               // Class name
            'article_id',            // Primary key
            'title'                  // Identifier field
        );
    }
}
```

---

### getObjects

기준과 일치하는 여러 개체를 검색합니다.

```php
public function getObjects(
    CriteriaElement $criteria = null,
    bool $idAsKey = false,
    bool $asObject = true
): array
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 쿼리 기준(선택 사항) |
| `$idAsKey` | 불리언 | 기본 키를 배열 키로 사용 |
| `$asObject` | 불리언 | 객체(true) 또는 배열(false) 반환 |

**반환:** `array` - 객체 배열 또는 연관 배열

**예:**
```php
$handler = xoops_getHandler('user');

// Get all active users
$criteria = new Criteria('level', 0, '>');
$users = $handler->getObjects($criteria);

// Get users with ID as key
$users = $handler->getObjects($criteria, true);
echo $users[1]->getVar('uname'); // Access by ID

// Get as arrays instead of objects
$usersArray = $handler->getObjects($criteria, false, false);
foreach ($usersArray as $userData) {
    echo $userData['uname'];
}
```

---

### getCount

기준과 일치하는 개체 수를 계산합니다.

```php
public function getCount(CriteriaElement $criteria = null): int
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 쿼리 기준(선택 사항) |

**반환:** `int` - 일치하는 개체 수

**예:**
```php
$handler = xoops_getHandler('user');

// Count all users
$totalUsers = $handler->getCount();

// Count active users
$criteria = new Criteria('level', 0, '>');
$activeUsers = $handler->getCount($criteria);

echo "Total: $totalUsers, Active: $activeUsers";
```

---

### 모두 가져오기

모든 객체를 검색합니다(기준이 없는 getObject의 별칭).

```php
public function getAll(
    CriteriaElement $criteria = null,
    array $fields = null,
    bool $asObject = true,
    bool $idAsKey = true
): array
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 쿼리 기준 |
| `$fields` | 배열 | 검색할 특정 필드 |
| `$asObject` | 불리언 | 객체로 반환 |
| `$idAsKey` | 불리언 | ID를 배열 키로 사용 |

**예:**
```php
$handler = xoops_getHandler('module');

// Get all modules
$modules = $handler->getAll();

// Get only specific fields
$modules = $handler->getAll(null, ['mid', 'name', 'dirname'], false);
```

---

### getId

일치하는 객체의 기본 키만 검색합니다.

```php
public function getIds(CriteriaElement $criteria = null): array
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 쿼리 기준 |

**반환:** `array` - 기본 키 값의 배열

**예:**
```php
$handler = xoops_getHandler('user');
$criteria = new Criteria('level', 1);
$adminIds = $handler->getIds($criteria);
// [1, 5, 12, ...] - Array of admin user IDs
```

---

### getList

드롭다운의 키-값 목록을 검색합니다.

```php
public function getList(CriteriaElement $criteria = null): array
```

**반환:** `array` - 연관 배열 [id => 식별자]

**예:**
```php
$handler = xoops_getHandler('group');
$groups = $handler->getList();
// [1 => 'Administrators', 2 => 'Registered Users', ...]

// For a select dropdown
$form->addElement(new XoopsFormSelect('Group', 'group_id', $default, 1, false));
$form->getElement('group_id')->addOptionArray($groups);
```

---

### 모두 삭제

기준과 일치하는 모든 개체를 삭제합니다.

```php
public function deleteAll(
    CriteriaElement $criteria = null,
    bool $force = true,
    bool $asObject = false
): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$criteria` | CriteriaElement | 삭제할 개체에 대한 Criteria |
| `$force` | 불리언 | 강제삭제 |
| `$asObject` | 불리언 | 삭제하기 전에 개체 로드(이벤트 트리거) |

**반환:** `bool` - 성공 시 True

**예:**
```php
$handler = xoops_getModuleHandler('comment', 'mymodule');

// Delete all comments for a specific article
$criteria = new Criteria('article_id', $articleId);
$handler->deleteAll($criteria);

// Delete with object loading (triggers delete events)
$handler->deleteAll($criteria, true, true);
```

---

### 업데이트모두

일치하는 모든 개체의 필드 값을 업데이트합니다.

```php
public function updateAll(
    string $fieldname,
    mixed $fieldvalue,
    CriteriaElement $criteria = null,
    bool $force = false
): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$fieldname` | 문자열 | 업데이트할 필드 |
| `$fieldvalue` | 혼합 | 새로운 가치 |
| `$criteria` | CriteriaElement | 업데이트할 개체에 대한 Criteria |
| `$force` | 불리언 | 강제 업데이트 |

**반환:** `bool` - 성공 시 True

**예:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Mark all articles by an author as draft
$criteria = new Criteria('author_id', $authorId);
$handler->updateAll('published', 0, $criteria);

// Update view count
$criteria = new Criteria('article_id', $id);
$handler->updateAll('views', $views + 1, $criteria);
```

---

### 삽입(확장)

추가 기능을 갖춘 확장된 삽입 방법입니다.

```php
public function insert(
    XoopsObject $obj,
    bool $force = false
): bool
```

**행동:**
- 객체가 새로운 객체인 경우(`isNew() === true`): INSERT
- 객체가 존재하는 경우(`isNew() === false`): UPDATE
- `cleanVars()`에 자동으로 전화가 걸립니다.
- 새 객체에 자동 증가 ID를 설정합니다.

**예:**
```php
$handler = xoops_getModuleHandler('article', 'mymodule');

// Create new article
$article = $handler->create();
$article->setVar('title', 'New Article');
$article->setVar('content', 'Content here');
$handler->insert($article);
echo "Created with ID: " . $article->getVar('article_id');

// Update existing article
$article = $handler->get(5);
$article->setVar('title', 'Updated Title');
$handler->insert($article);
```

---

## 도우미 함수

### xoops_getHandler

코어 핸들러를 검색하는 전역 함수입니다.

```php
function xoops_getHandler(string $name, bool $optional = false): ?XoopsObjectHandler
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$name` | 문자열 | 핸들러 이름(사용자, 모듈, 그룹 등) |
| `$optional` | 불리언 | 오류를 발생시키는 대신 null을 반환 |

**예:**
```php
$userHandler = xoops_getHandler('user');
$moduleHandler = xoops_getHandler('module');
$groupHandler = xoops_getHandler('group');
$blockHandler = xoops_getHandler('block');
$configHandler = xoops_getHandler('config');
```

---

### xoops_getModuleHandler

모듈별 핸들러를 검색합니다.

```php
function xoops_getModuleHandler(
    string $name,
    string $dirname = null,
    bool $optional = false
): ?XoopsObjectHandler
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$name` | 문자열 | 핸들러 이름 |
| `$dirname` | 문자열 | 모듈 디렉토리 이름 |
| `$optional` | 불리언 | 실패 시 null 반환 |

**예:**
```php
// Get handler from current module
$articleHandler = xoops_getModuleHandler('article');

// Get handler from specific module
$articleHandler = xoops_getModuleHandler('article', 'news');
$storyHandler = xoops_getModuleHandler('story', 'news');
```

---

## 사용자 정의 핸들러 만들기

### 기본 핸들러 구현

```php
<?php
namespace XoopsModules\MyModule;

use XoopsPersistableObjectHandler;
use XoopsDatabase;
use CriteriaElement;
use Criteria;
use CriteriaCompo;

/**
 * Handler for Article objects
 */
class ArticleHandler extends XoopsPersistableObjectHandler
{
    /**
     * Constructor
     */
    public function __construct(XoopsDatabase $db = null)
    {
        parent::__construct(
            $db,
            'mymodule_articles',
            Article::class,
            'article_id',
            'title'
        );
    }

    /**
     * Get published articles
     */
    public function getPublished(int $limit = 10, int $start = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->add(new Criteria('publish_date', time(), '<='));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($start);

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by author
     */
    public function getByAuthor(int $authorId, bool $publishedOnly = true): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('author_id', $authorId));

        if ($publishedOnly) {
            $criteria->add(new Criteria('published', 1));
        }

        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get articles by category
     */
    public function getByCategory(int $categoryId, int $limit = 0): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('category_id', $categoryId));
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        if ($limit > 0) {
            $criteria->setLimit($limit);
        }

        return $this->getObjects($criteria);
    }

    /**
     * Search articles
     */
    public function search(string $query, array $fields = ['title', 'content']): array
    {
        $criteria = new CriteriaCompo();
        $searchCriteria = new CriteriaCompo();

        foreach ($fields as $field) {
            $searchCriteria->add(
                new Criteria($field, '%' . $query . '%', 'LIKE'),
                'OR'
            );
        }

        $criteria->add($searchCriteria);
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('publish_date');
        $criteria->setOrder('DESC');

        return $this->getObjects($criteria);
    }

    /**
     * Get popular articles by view count
     */
    public function getPopular(int $limit = 5): array
    {
        $criteria = new CriteriaCompo();
        $criteria->add(new Criteria('published', 1));
        $criteria->setSort('views');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }

    /**
     * Increment view count
     */
    public function incrementViews(int $articleId): bool
    {
        $sql = sprintf(
            "UPDATE %s SET views = views + 1 WHERE article_id = %d",
            $this->db->prefix($this->table),
            $articleId
        );

        return $this->db->queryF($sql) !== false;
    }

    /**
     * Override insert for custom behavior
     */
    public function insert(\XoopsObject $obj, bool $force = false): bool
    {
        // Set updated timestamp
        $obj->setVar('updated', time());

        // If new, set created timestamp
        if ($obj->isNew()) {
            $obj->setVar('created', time());
        }

        return parent::insert($obj, $force);
    }

    /**
     * Override delete for cascade operations
     */
    public function delete(\XoopsObject $obj, bool $force = false): bool
    {
        // Delete associated comments
        $commentHandler = xoops_getModuleHandler('comment', 'mymodule');
        $criteria = new Criteria('article_id', $obj->getVar('article_id'));
        $commentHandler->deleteAll($criteria);

        return parent::delete($obj, $force);
    }
}
```

### 사용자 정의 핸들러 사용

```php
// Get the handler
$articleHandler = xoops_getModuleHandler('article', 'mymodule');

// Create a new article
$article = $articleHandler->create();
$article->setVars([
    'title' => 'My New Article',
    'content' => 'Article content here...',
    'author_id' => $xoopsUser->getVar('uid'),
    'category_id' => 1,
    'published' => 1,
    'publish_date' => time()
]);

if ($articleHandler->insert($article)) {
    redirect_header('article.php?id=' . $article->getVar('article_id'), 2, 'Article created');
}

// Get published articles
$articles = $articleHandler->getPublished(10);

// Search articles
$results = $articleHandler->search('xoops');

// Get popular articles
$popular = $articleHandler->getPopular(5);

// Update view count
$articleHandler->incrementViews($articleId);
```

## 모범 사례

1. **쿼리에는 Criteria 사용**: 유형이 안전한 쿼리에는 항상 Criteria 개체를 사용하세요.

2. **사용자 지정 메서드 확장**: 핸들러에 도메인별 쿼리 메서드 추가

3. **삽입/삭제 재정의**: 재정의에 계단식 작업 및 타임스탬프를 추가합니다.

4. **필요한 경우 트랜잭션 사용**: 복잡한 작업을 트랜잭션으로 래핑

5. **getList 활용**: 선택 드롭다운에 `getList()`을 사용하여 쿼리를 줄입니다.

6. **색인 키**: 기준에 사용된 데이터베이스 필드가 색인화되어 있는지 확인하세요.

7. **결과 제한**: 잠재적으로 큰 결과 집합에는 항상 `setLimit()`을 사용하세요.

## 관련 문서

- XoopsObject - 기본 개체 클래스
-../Database/Criteria - 쿼리 기준 작성
-../Database/XoopsDatabase - 데이터베이스 작업

---

*참조: [XOOPS 소스 코드](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
