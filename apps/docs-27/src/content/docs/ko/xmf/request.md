---
title: "XMF 요청"
description: 'Xmf\Request 클래스를 사용하여 안전한 HTTP 요청 처리 및 입력 유효성 검사'
---

`Xmf\Request` 클래스는 내장된 삭제 및 유형 변환을 통해 HTTP 요청 변수에 대한 제어된 액세스를 제공합니다. 입력을 지정된 유형에 맞추면서 기본적으로 잠재적으로 유해한 주입으로부터 보호합니다.

## 개요

요청 처리는 웹 개발에서 보안이 가장 중요한 측면 중 하나입니다. XMF 요청 클래스:

- XSS 공격을 방지하기 위해 입력을 자동으로 삭제합니다.
- 일반적인 데이터 유형에 대해 유형이 안전한 접근자를 제공합니다.
- 다양한 요청 소스 지원(GET, POST, COOKIE 등)
- 일관된 기본값 처리 제공

## 기본 사용법

```php
use Xmf\Request;

// Get string input
$name = Request::getString('name', '');

// Get integer input
$id = Request::getInt('id', 0);

// Get from specific source
$postData = Request::getString('data', '', 'POST');
```

## 요청 방법

### get메소드()

현재 요청에 대한 HTTP 요청 메서드를 반환합니다.

```php
$method = Request::getMethod();
// Returns: 'GET', 'HEAD', 'POST', or 'PUT'
```

### getVar($name, $default, $hash, $type, $mask)

대부분의 다른 `get*()` 메서드가 호출하는 핵심 메서드입니다. 요청 데이터에서 명명된 변수를 가져오고 반환합니다.

**매개변수:**
- `$name` - 가져올 변수 이름
- `$default` - 변수가 존재하지 않는 경우 기본값
- `$hash` - 소스 해시: GET, POST, FILES, COOKIE, ENV, SERVER, METHOD 또는 REQUEST(기본값)
- `$type` - 정리를 위한 데이터 유형(아래 FilterInput 유형 참조)
- `$mask` - 청소 옵션을 위한 비트마스크

**마스크 값:**

| 마스크 상수 | 효과 |
|---------------|--------|
| `MASK_NO_TRIM` | 선행/후행 공백을 자르지 마십시오 |
| `MASK_ALLOW_RAW` | 정리 건너뛰기, 원시 입력 허용 |
| `MASK_ALLOW_HTML` | 제한된 "안전한" HTML 마크업 세트 허용 |

```php
// Get raw input without cleaning
$rawHtml = Request::getVar('content', '', 'POST', 'STRING', Request::MASK_ALLOW_RAW);

// Allow safe HTML
$content = Request::getVar('body', '', 'POST', 'STRING', Request::MASK_ALLOW_HTML);
```

## 유형별 메서드

### getInt($name, $default, $hash)

정수 값을 반환합니다. 숫자만 허용됩니다.

```php
$id = Request::getInt('id', 0);
$page = Request::getInt('page', 1, 'GET');
```

### getFloat($name, $default, $hash)

부동 소수점 값을 반환합니다. 숫자와 마침표만 허용됩니다.

```php
$price = Request::getFloat('price', 0.0);
$rate = Request::getFloat('rate', 1.0, 'POST');
```

### getBool($name, $default, $hash)

불리언 값을 반환합니다.

```php
$enabled = Request::getBool('enabled', false);
$subscribe = Request::getBool('subscribe', false, 'POST');
```

### getWord($name, $default, $hash)

문자와 밑줄 `[A-Za-z_]`만 포함된 문자열을 반환합니다.

```php
$action = Request::getWord('action', 'view');
```

### getCmd($name, $default, $hash)

`[A-Za-z0-9.-_]`만 포함된 명령 문자열을 소문자로 반환합니다.

```php
$op = Request::getCmd('op', 'list');
// Input "View_Item" becomes "view_item"
```

### getString($name, $default, $hash, $mask)

(마스크에 의해 재정의되지 않는 한) 잘못된 HTML 코드가 제거된 깨끗한 문자열을 반환합니다.

```php
$title = Request::getString('title', '');
$description = Request::getString('description', '', 'POST');

// Allow some HTML
$content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
```

### getArray($name, $default, $hash)

XSS 및 잘못된 코드를 제거하기 위해 재귀적으로 처리된 배열을 반환합니다.

```php
$items = Request::getArray('items', [], 'POST');
$selectedIds = Request::getArray('selected', []);
```

### getText($name, $default, $hash)

정리하지 않고 원시 텍스트를 반환합니다. 주의해서 사용하세요.

```php
$rawContent = Request::getText('raw_content', '');
```

### getUrl($name, $default, $hash)

검증된 웹 URL을 반환합니다(상대, http 또는 https 체계만 해당).

```php
$website = Request::getUrl('website', '');
$returnUrl = Request::getUrl('return', 'index.php');
```

### getPath($name, $default, $hash)

검증된 파일 시스템 또는 웹 경로를 반환합니다.

```php
$filePath = Request::getPath('file', '');
```

### 이메일 받기($name, $default, $hash)

검증된 이메일 주소 또는 기본값을 반환합니다.

```php
$email = Request::getEmail('email', '');
$contactEmail = Request::getEmail('contact', 'default@example.com');
```

### getIP($name, $default, $hash)

검증된 IPv4 또는 IPv6 주소를 반환합니다.

```php
$userIp = Request::getIP('client_ip', '');
```

### getHeader($headerName, $default)

HTTP 요청 헤더 값을 반환합니다.

```php
$contentType = Request::getHeader('Content-Type', '');
$userAgent = Request::getHeader('User-Agent', '');
$authHeader = Request::getHeader('Authorization', '');
```

## 유틸리티 메소드

### hasVar($name, $hash)

지정한 해시에 변수가 있는지 확인하세요.

```php
if (Request::hasVar('submit', 'POST')) {
    // Form was submitted
}

if (Request::hasVar('id', 'GET')) {
    // ID parameter exists
}
```

### setVar($name, $value, $hash, $overwrite)

지정된 해시에 변수를 설정합니다. 이전 값 또는 null을 반환합니다.

```php
// Set a value
$oldValue = Request::setVar('processed', true, 'POST');

// Only set if not already exists
Request::setVar('default_op', 'list', 'GET', false);
```

### get($hash, $mask)

전체 해시 배열의 정리된 복사본을 반환합니다.

```php
// Get all POST data cleaned
$postData = Request::get('POST');

// Get all GET data
$getData = Request::get('GET');

// Get REQUEST data with no trimming
$requestData = Request::get('REQUEST', Request::MASK_NO_TRIM);
```

### 세트($array, $hash, $overwrite)

배열에서 여러 변수를 설정합니다.

```php
$defaults = [
    'page' => 1,
    'limit' => 10,
    'sort' => 'date'
];
Request::set($defaults, 'GET', false); // Don't overwrite existing
```

## 필터 입력 통합

Request 클래스는 정리를 위해 `Xmf\FilterInput`을 사용합니다. 사용 가능한 필터 유형:

| 유형 | 설명 |
|------|-------------|
| 알파벳 / ALNUM | 영숫자만 |
| 배열 | 각 요소를 재귀적으로 정리 |
| 베이스64 | Base64로 인코딩된 문자열 |
| 불리언 / 불리언 | 참 또는 거짓 |
| 명령 | 명령 - A-Z, 0-9, 밑줄, 대시, 마침표(소문자) |
| 이메일 | 유효한 이메일 주소 |
| 플로트/더블 | 부동 소수점 수 |
| 정수 / 정수 | 정수값 |
| IP | 유효한 IP 주소 |
| 경로 | 파일 시스템 또는 웹 경로 |
| 문자열 | 일반 문자열(기본값) |
| 사용자 이름 | 사용자 이름 형식 |
| 웹URL | 웹 URL |
| 단어 | 문자 A-Z 및 밑줄만 |

## 실제 예

### 양식 처리

```php
use Xmf\Request;

if ('POST' === Request::getMethod()) {
    // Validate form submission
    $title = Request::getString('title', '');
    $content = Request::getString('content', '', 'POST', Request::MASK_ALLOW_HTML);
    $categoryId = Request::getInt('category_id', 0);
    $tags = Request::getArray('tags', []);
    $published = Request::getBool('published', false);

    if (empty($title)) {
        $errors[] = 'Title is required';
    }

    if ($categoryId <= 0) {
        $errors[] = 'Please select a category';
    }
}
```

### AJAX 핸들러

```php
use Xmf\Request;

// Verify AJAX request
$isAjax = (Request::getHeader('X-Requested-With', '') === 'XMLHttpRequest');

if ($isAjax) {
    $action = Request::getCmd('action', '');
    $itemId = Request::getInt('item_id', 0);

    switch ($action) {
        case 'delete':
            // Handle delete
            break;
        case 'update':
            $data = Request::getArray('data', []);
            // Handle update
            break;
    }
}
```

### 페이지 매김

```php
use Xmf\Request;

$page = Request::getInt('page', 1);
$limit = Request::getInt('limit', 20);
$sort = Request::getCmd('sort', 'date');
$order = Request::getWord('order', 'DESC');

// Validate ranges
$page = max(1, $page);
$limit = min(100, max(10, $limit));
$order = in_array($order, ['ASC', 'DESC']) ? $order : 'DESC';

$offset = ($page - 1) * $limit;
```

### 검색 양식

```php
use Xmf\Request;

$query = Request::getString('q', '');
$category = Request::getInt('cat', 0);
$dateFrom = Request::getString('from', '');
$dateTo = Request::getString('to', '');

// Build search criteria
$criteria = new CriteriaCompo();

if (!empty($query)) {
    $criteria->add(new Criteria('title', '%' . $query . '%', 'LIKE'));
}

if ($category > 0) {
    $criteria->add(new Criteria('category_id', $category));
}
```

## 보안 모범 사례

1. **항상 유형별 방법을 사용하세요** - ID는 `getInt()`, 이메일은 `getEmail()` 등을 사용하세요.

2. **합리적인 기본값 제공** - 입력이 존재한다고 가정하지 마세요.

3. **정리 후 유효성 검사** - 정리를 통해 잘못된 데이터가 제거되고, 유효성 검사를 통해 올바른 데이터가 보장됩니다.

4. **적절한 해시 사용** - 양식 데이터에는 POST를 지정하고 쿼리 매개변수에는 GET을 지정합니다.

5. **원시 입력 방지** - 꼭 필요한 경우에만 `getText()` 또는 `MASK_ALLOW_RAW`을 사용하세요.

```php
// Good - type-specific with default
$id = Request::getInt('id', 0);

// Bad - using getString for numeric data
$id = (int) Request::getString('id', '0');
```

## 참고 항목

- XMF 시작하기 - 기본 XMF 개념
- XMF-Module-Helper - 모듈 도우미 클래스
-../XMF-Framework - 프레임워크 개요

---

#xmf #요청 #보안 #입력 유효성 검사 #위생처리
