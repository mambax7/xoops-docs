---
title: "XoopsObject 클래스"
description: "속성 관리, 유효성 검사 및 직렬화를 제공하는 XOOPS 시스템의 모든 데이터 객체에 대한 기본 클래스"
---

`XoopsObject` 클래스는 XOOPS 시스템의 모든 데이터 개체에 대한 기본 기본 클래스입니다. 개체 속성, 유효성 검사, 더티 추적 및 직렬화를 관리하기 위한 표준화된 인터페이스를 제공합니다.

## 클래스 개요

```php
namespace Xoops\Core;

class XoopsObject
{
    protected array $vars = [];
    protected array $cleanVars = [];
    protected bool $isNew = true;
    protected array $errors = [];
}
```

## 클래스 계층

```
XoopsObject
├── XoopsUser
├── XoopsGroup
├── XoopsModule
├── XoopsBlock
├── XoopsComment
├── XoopsNotification
├── XoopsConfig
└── [Custom Module Objects]
```

## 속성

| 부동산 | 유형 | 가시성 | 설명 |
|----------|------|------------|-------------|
| `$vars` | 배열 | 보호됨 | 변수 정의 및 값 저장 |
| `$cleanVars` | 배열 | 보호됨 | 데이터베이스 작업을 위해 삭제된 값을 저장합니다. |
| `$isNew` | 불리언 | 보호됨 | 객체가 새로운 객체인지 여부를 나타냅니다(아직 데이터베이스에 없음) |
| `$errors` | 배열 | 보호됨 | 유효성 검사 및 오류 메시지 저장 |

## 생성자

```php
public function __construct()
```

새 XoopsObject 인스턴스를 만듭니다. 객체는 기본적으로 새 것으로 표시됩니다.

**예:**
```php
$object = new XoopsObject();
// Object is new and has no defined variables
```

## 핵심 메소드

### initVar

개체에 대한 변수 정의를 초기화합니다.

```php
public function initVar(
    string $key,
    int $dataType,
    mixed $value = null,
    bool $required = false,
    int $maxlength = null,
    string $options = ''
): void
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$key` | 문자열 | 변수 이름 |
| `$dataType` | 정수 | 데이터 유형 상수(데이터 유형 참조) |
| `$value` | 혼합 | 기본값 |
| `$required` | 불리언 | 필드 필수 여부 |
| `$maxlength` | 정수 | 문자열 유형의 최대 길이 |
| `$options` | 문자열 | 추가 옵션 |

**데이터 유형:**

| 상수 | 가치 | 설명 |
|----------|-------|-------------|
| `XOBJ_DTYPE_TXTBOX` | 1 | 텍스트 상자 입력 |
| `XOBJ_DTYPE_TXTAREA` | 2 | 텍스트 영역 콘텐츠 |
| `XOBJ_DTYPE_INT` | 3 | 정수값 |
| `XOBJ_DTYPE_URL` | 4 | URL 문자열 |
| `XOBJ_DTYPE_EMAIL` | 5 | 이메일 주소 |
| `XOBJ_DTYPE_ARRAY` | 6 | 직렬화된 배열 |
| `XOBJ_DTYPE_OTHER` | 7 | 사용자 정의 유형 |
| `XOBJ_DTYPE_SOURCE` | 8 | 소스 코드 |
| `XOBJ_DTYPE_STIME` | 9 | 짧은 시간 형식 |
| `XOBJ_DTYPE_MTIME` | 10 | 중간 시간 형식 |
| `XOBJ_DTYPE_LTIME` | 11 | 장시간 형식 |
| `XOBJ_DTYPE_FLOAT` | 12 | 부동 소수점 |
| `XOBJ_DTYPE_DECIMAL` | 13 | 십진수 |
| `XOBJ_DTYPE_ENUM` | 14 | 열거 |

**예:**
```php
class MyObject extends XoopsObject
{
    public function __construct()
    {
        parent::__construct();
        $this->initVar('id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('email', XOBJ_DTYPE_EMAIL, '', true, 100);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, true);
    }
}
```

---

### setVar

변수의 값을 설정합니다.

```php
public function setVar(
    string $key,
    mixed $value,
    bool $notGpc = false
): bool
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$key` | 문자열 | 변수 이름 |
| `$value` | 혼합 | 설정할 값 |
| `$notGpc` | 불리언 | true인 경우 값은 GET/POST/COOKIE |

**반환:** `bool` - 성공하면 True, 그렇지 않으면 False

**예:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello World');
$object->setVar('content', '<p>Content here</p>', true); // Not from user input
$object->setVar('status', 1);
```

---

### getVar

선택적 형식을 사용하여 변수 값을 검색합니다.

```php
public function getVar(
    string $key,
    string $format = 's'
): mixed
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$key` | 문자열 | 변수 이름 |
| `$format` | 문자열 | 출력 형식 |

**형식 옵션:**

| 형식 | 설명 |
|--------|-------------|
| `'s'` | 표시 - 표시를 위해 이스케이프된 HTML 엔터티 |
| `'e'` | 편집 - 양식 입력 값의 경우 |
| `'p'` | 미리보기 - 쇼와 유사 |
| `'f'` | 양식 데이터 - 양식 처리를 위한 원시 |
| `'n'` | 없음 - 원시 값, 서식 없음 |

**반환:** `mixed` - 형식이 지정된 값

**예:**
```php
$object = new MyObject();
$object->setVar('title', 'Hello <World>');

echo $object->getVar('title', 's'); // "Hello &lt;World&gt;"
echo $object->getVar('title', 'e'); // "Hello &lt;World&gt;" (for input value)
echo $object->getVar('title', 'n'); // "Hello <World>" (raw)

// For array data types
$object->setVar('options', ['a', 'b', 'c']);
$options = $object->getVar('options', 'n'); // Returns array
```

---

### setVars

배열에서 여러 변수를 한 번에 설정합니다.

```php
public function setVars(
    array $values,
    bool $notGpc = false
): void
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$values` | 배열 | 키의 연관 배열 => 값 쌍 |
| `$notGpc` | 불리언 | true인 경우 값은 GET/POST/COOKIE |

**예:**
```php
$object = new MyObject();
$object->setVars([
    'title' => 'My Title',
    'content' => 'My content',
    'status' => 1
]);

// From database (not user input)
$object->setVars($row, true);
```

---

### getValues

모든 변수 값을 검색합니다.

```php
public function getValues(
    array $keys = null,
    string $format = 's',
    int $maxDepth = 1
): array
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$keys` | 배열 | 검색할 특정 키(모두 null) |
| `$format` | 문자열 | 출력 형식 |
| `$maxDepth` | 정수 | 중첩된 개체의 최대 깊이 |

**반환:** `array` - 값의 연관 배열

**예:**
```php
$object = new MyObject();

// Get all values
$allValues = $object->getValues();

// Get specific values
$subset = $object->getValues(['title', 'status']);

// Get raw values for database
$rawValues = $object->getValues(null, 'n');
```

---

### 할당Var

유효성 검사 없이 직접 값을 할당합니다(주의해서 사용).

```php
public function assignVar(
    string $key,
    mixed $value
): void
```

**매개변수:**

| 매개변수 | 유형 | 설명 |
|-----------|------|-------------|
| `$key` | 문자열 | 변수 이름 |
| `$value` | 혼합 | 할당할 값 |

**예:**
```php
// Direct assignment from trusted source (e.g., database)
$object->assignVar('id', $row['id']);
$object->assignVar('created', $row['created']);
```

---

### cleanVars

데이터베이스 작업에 대한 모든 변수를 삭제합니다.

```php
public function cleanVars(): bool
```

**반환:** `bool` - 모든 변수가 유효한 경우 True입니다.

**예:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$object->setVar('email', 'user@example.com');

if ($object->cleanVars()) {
    // Variables are sanitized and ready for database
    $cleanData = $object->cleanVars;
} else {
    // Validation errors occurred
    $errors = $object->getErrors();
}
```

---

### isNew

객체가 새로운 객체인지 확인하거나 설정합니다.

```php
public function isNew(): bool
public function setNew(): void
public function unsetNew(): void
```

**예:**
```php
$object = new MyObject();
echo $object->isNew(); // true

$object->unsetNew();
echo $object->isNew(); // false

$object->setNew();
echo $object->isNew(); // true
```

---

## 오류 처리 방법

### setErrors

오류 메시지를 추가합니다.

```php
public function setErrors(string|array $error): void
```

**예:**
```php
$object->setErrors('Title is required');
$object->setErrors(['Field 1 error', 'Field 2 error']);
```

---

### getErrors

모든 오류 메시지를 검색합니다.

```php
public function getErrors(): array
```

**예:**
```php
$errors = $object->getErrors();
foreach ($errors as $error) {
    echo $error . "\n";
}
```

---

### getHtmlErrors

HTML 형식의 오류를 반환합니다.

```php
public function getHtmlErrors(): string
```

**예:**
```php
if (!$object->cleanVars()) {
    echo '<div class="error">' . $object->getHtmlErrors() . '</div>';
}
```

---

## 유틸리티 메소드

### to배열

개체를 배열로 변환합니다.

```php
public function toArray(): array
```

**예:**
```php
$object = new MyObject();
$object->setVar('title', 'Test');
$data = $object->toArray();
// ['title' => 'Test', ...]
```

---

### getVars

변수 정의를 반환합니다.

```php
public function getVars(): array
```

**예:**
```php
$vars = $object->getVars();
foreach ($vars as $key => $definition) {
    echo "Field: $key, Type: {$definition['data_type']}\n";
}
```

---

## 전체 사용 예

```php
<?php
/**
 * Custom Article Object
 */
class Article extends XoopsObject
{
    /**
     * Constructor - Initialize all variables
     */
    public function __construct()
    {
        parent::__construct();

        // Primary key
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);

        // Required fields
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);

        // Optional fields
        $this->initVar('summary', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', false);
        $this->initVar('category_id', XOBJ_DTYPE_INT, 0, false);

        // Timestamps
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('updated', XOBJ_DTYPE_INT, time(), false);

        // Status flags
        $this->initVar('published', XOBJ_DTYPE_INT, 0, false);
        $this->initVar('views', XOBJ_DTYPE_INT, 0, false);

        // Metadata as array
        $this->initVar('meta', XOBJ_DTYPE_ARRAY, [], false);
    }

    /**
     * Get formatted creation date
     */
    public function getCreatedDate(string $format = 'Y-m-d H:i:s'): string
    {
        return date($format, $this->getVar('created', 'n'));
    }

    /**
     * Check if article is published
     */
    public function isPublished(): bool
    {
        return $this->getVar('published', 'n') == 1;
    }

    /**
     * Increment view counter
     */
    public function incrementViews(): void
    {
        $views = $this->getVar('views', 'n');
        $this->setVar('views', $views + 1);
    }

    /**
     * Custom validation
     */
    public function validate(): bool
    {
        $this->errors = [];

        // Title validation
        $title = trim($this->getVar('title', 'n'));
        if (empty($title)) {
            $this->setErrors('Title is required');
        } elseif (strlen($title) < 5) {
            $this->setErrors('Title must be at least 5 characters');
        }

        // Author validation
        if ($this->getVar('author_id', 'n') <= 0) {
            $this->setErrors('Author is required');
        }

        return empty($this->errors);
    }
}

// Usage
$article = new Article();
$article->setVar('title', 'My First Article');
$article->setVar('author_id', 1);
$article->setVar('content', '<p>Article content here...</p>', true);
$article->setVar('meta', [
    'keywords' => ['xoops', 'cms', 'php'],
    'description' => 'An example article'
]);

if ($article->validate() && $article->cleanVars()) {
    // Save to database via handler
    $handler = xoops_getModuleHandler('article', 'mymodule');
    $handler->insert($article);

    echo "Article saved with ID: " . $article->getVar('article_id');
} else {
    echo "Errors: " . $article->getHtmlErrors();
}
```

## 모범 사례

1. **항상 변수 초기화**: `initVar()`을 사용하여 생성자의 모든 변수를 정의합니다.

2. **적절한 데이터 유형 사용**: 검증을 위해 올바른 `XOBJ_DTYPE_*` 상수를 선택하세요.

3. **사용자 입력을 신중하게 처리**: 사용자 입력에는 `setVar()`과 `$notGpc = false`을 사용하세요.

4. **저장 전 유효성 검사**: 데이터베이스 작업 전에 항상 `cleanVars()`을 호출합니다.

5. **형식 매개변수 사용**: 컨텍스트에 맞게 `getVar()`에 적절한 형식을 사용합니다.

6. **사용자 지정 논리 확장**: 하위 클래스에 도메인별 메서드 추가

## 관련 문서

- XoopsObjectHandler - 객체 지속성을 위한 핸들러 패턴
-../Database/Criteria - Criteria으로 쿼리 작성
-../Database/XoopsDatabase - 데이터베이스 작업

---

*참조: [XOOPS 소스 코드](https://github.com/XOOPS/XoopsCore27/blob/master/htdocs/class/xoopsobject.php)*
