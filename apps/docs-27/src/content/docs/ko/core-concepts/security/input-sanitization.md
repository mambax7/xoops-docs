---
title: "입력 삭제"
description: "XOOPS에서 MyTextSanitizer 및 유효성 검사 기술 사용"
---

사용자 입력을 절대 신뢰하지 마십시오. 모든 입력 데이터를 사용하기 전에 항상 유효성을 검사하고 정리하세요. XOOPS는 텍스트 입력을 삭제하기 위한 `MyTextSanitizer` 클래스와 유효성 검사를 위한 다양한 도우미 기능을 제공합니다.

## 관련 문서

- 보안 모범 사례 - 종합 보안 가이드
- CSRF 보호 - 토큰 시스템 및 XoopsSecurity 클래스
- SQL 주입 방지 - 데이터베이스 보안 관행

## 황금률

**사용자 입력을 절대 신뢰하지 마세요.** 외부 소스의 모든 데이터는 다음과 같아야 합니다.

1. **검증됨**: 예상 형식 및 유형과 일치하는지 확인하세요.
2. **삭제됨**: 잠재적으로 위험한 캐릭터를 제거하거나 탈출하세요
3. **Escaped**: 출력 시 특정 컨텍스트(HTML, JavaScript, SQL)에 대해 이스케이프합니다.

## MyTextSanitizer 클래스

XOOPS는 텍스트 삭제를 위해 `MyTextSanitizer` 클래스(일반적으로 `$myts`으로 별칭)를 제공합니다.

### 인스턴스 가져오기

```php
// Get the singleton instance
$myts = MyTextSanitizer::getInstance();
```

### 기본 텍스트 삭제

```php
$myts = MyTextSanitizer::getInstance();

// For plain text fields (no HTML allowed)
$title = $myts->htmlSpecialChars($_POST['title']);

// This converts:
// < to &lt;
// > to &gt;
// & to &amp;
// " to &quot;
// ' to &#039;
```

### 텍스트 영역 콘텐츠 처리

`displayTarea()` 메소드는 포괄적인 텍스트 영역 처리를 제공합니다.

```php
$myts = MyTextSanitizer::getInstance();

$content = $myts->displayTarea(
    $_POST['content'],
    $allowhtml = 0,      // 0 = No HTML allowed, 1 = HTML allowed
    $allowsmiley = 1,    // 1 = Smilies enabled
    $allowxcode = 1,     // 1 = XOOPS codes enabled (BBCode)
    $allowimages = 1,    // 1 = Images allowed
    $allowlinebreak = 1  // 1 = Line breaks converted to <br>
);
```

### 일반적인 소독 방법

```php
$myts = MyTextSanitizer::getInstance();

// HTML special characters escaping
$safe_text = $myts->htmlSpecialChars($text);

// Strip slashes if magic quotes are on
$text = $myts->stripSlashesGPC($text);

// Convert XOOPS codes (BBCode) to HTML
$html = $myts->xoopsCodeDecode($text);

// Convert smileys to images
$html = $myts->smiley($text);

// Make clickable links
$html = $myts->makeClickable($text);

// Complete text processing for preview
$preview = $myts->previewTarea($text, $allowhtml, $allowsmiley, $allowxcode);
```

## 입력 유효성 검사

### 정수 값 검증

```php
// Validate integer ID
$id = isset($_REQUEST['id']) ? (int)$_REQUEST['id'] : 0;

if ($id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}

// Alternative with filter_var
$id = filter_var($_REQUEST['id'] ?? 0, FILTER_VALIDATE_INT);
if ($id === false || $id <= 0) {
    redirect_header('index.php', 3, 'Invalid ID');
    exit();
}
```

### 이메일 주소 확인 중

```php
$email = filter_var($_POST['email'], FILTER_VALIDATE_EMAIL);

if (!$email) {
    redirect_header('form.php', 3, 'Invalid email address');
    exit();
}
```

### URL 확인 중

```php
$url = filter_var($_POST['url'], FILTER_VALIDATE_URL);

if (!$url) {
    redirect_header('form.php', 3, 'Invalid URL');
    exit();
}

// Additional check for allowed protocols
$parsed = parse_url($url);
$allowed_schemes = ['http', 'https'];
if (!in_array($parsed['scheme'], $allowed_schemes)) {
    redirect_header('form.php', 3, 'Only HTTP and HTTPS URLs are allowed');
    exit();
}
```

### 날짜 확인

```php
$date = $_POST['date'] ?? '';

// Validate date format (YYYY-MM-DD)
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    redirect_header('form.php', 3, 'Invalid date format');
    exit();
}

// Validate actual date validity
$parts = explode('-', $date);
if (!checkdate($parts[1], $parts[2], $parts[0])) {
    redirect_header('form.php', 3, 'Invalid date');
    exit();
}
```

### 파일 이름 확인 중

```php
// Remove all characters except alphanumeric, underscore, and hyphen
$filename = preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['filename']);

// Or use a whitelist approach
$allowed_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-';
$filename = '';
foreach (str_split($_POST['filename']) as $char) {
    if (strpos($allowed_chars, $char) !== false) {
        $filename .= $char;
    }
}
```

## 다양한 입력 유형 처리

### 문자열 입력

```php
$myts = MyTextSanitizer::getInstance();

// Short text (titles, names)
$title = $myts->htmlSpecialChars(trim($_POST['title']));

// Limit length
if (strlen($title) > 255) {
    $title = substr($title, 0, 255);
}

// Check for empty required fields
if (empty($title)) {
    redirect_header('form.php', 3, 'Title is required');
    exit();
}
```

### 숫자 입력

```php
// Integer
$count = (int)$_POST['count'];
$count = max(0, min($count, 1000)); // Ensure range 0-1000

// Float
$price = (float)$_POST['price'];
$price = round($price, 2); // Round to 2 decimal places

// Validate range
if ($price < 0 || $price > 99999.99) {
    redirect_header('form.php', 3, 'Invalid price');
    exit();
}
```

### 불리언 입력

```php
// Checkbox values
$is_active = isset($_POST['is_active']) ? 1 : 0;

// Or with explicit value check
$is_active = ($_POST['is_active'] ?? '') === '1' ? 1 : 0;
```

### 배열 입력

```php
// Validate array input (e.g., multiple checkboxes)
$selected_ids = [];
if (isset($_POST['ids']) && is_array($_POST['ids'])) {
    foreach ($_POST['ids'] as $id) {
        $clean_id = (int)$id;
        if ($clean_id > 0) {
            $selected_ids[] = $clean_id;
        }
    }
}
```

### 선택/옵션 입력

```php
// Validate against allowed values
$allowed_statuses = ['draft', 'published', 'archived'];
$status = $_POST['status'] ?? '';

if (!in_array($status, $allowed_statuses)) {
    redirect_header('form.php', 3, 'Invalid status');
    exit();
}
```

## 요청 개체(XMF)

XMF를 사용할 때 Request 클래스는 더 깔끔한 입력 처리를 제공합니다.

```php
use Xmf\Request;

// Get integer
$id = Request::getInt('id', 0);

// Get string
$title = Request::getString('title', '');

// Get array
$ids = Request::getArray('ids', []);

// Get with method specification
$id = Request::getInt('id', 0, 'POST');
$search = Request::getString('q', '', 'GET');

// Check request method
if (Request::getMethod() !== 'POST') {
    redirect_header('form.php', 3, 'Invalid request method');
    exit();
}
```

## 유효성 검사 클래스 만들기

복잡한 양식의 경우 전용 유효성 검사 클래스를 만듭니다.

```php
<?php
namespace XoopsModules\MyModule;

class Validator
{
    private $errors = [];

    public function validateItem(array $data): bool
    {
        $this->errors = [];

        // Title validation
        if (empty($data['title'])) {
            $this->errors['title'] = 'Title is required';
        } elseif (strlen($data['title']) > 255) {
            $this->errors['title'] = 'Title must be 255 characters or less';
        }

        // Email validation
        if (!empty($data['email'])) {
            if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
                $this->errors['email'] = 'Invalid email format';
            }
        }

        // Status validation
        $allowed = ['draft', 'published'];
        if (!in_array($data['status'], $allowed)) {
            $this->errors['status'] = 'Invalid status';
        }

        return empty($this->errors);
    }

    public function getErrors(): array
    {
        return $this->errors;
    }

    public function getError(string $field): ?string
    {
        return $this->errors[$field] ?? null;
    }
}
```

사용법:

```php
$validator = new Validator();
$data = [
    'title' => $_POST['title'],
    'email' => $_POST['email'],
    'status' => $_POST['status'],
];

if (!$validator->validateItem($data)) {
    $errors = $validator->getErrors();
    // Display errors to user
}
```

## 데이터베이스 저장소 정리

데이터베이스에 데이터를 저장할 때:

```php
$myts = MyTextSanitizer::getInstance();

// For storage (will be processed again on display)
$title = $myts->addSlashes($_POST['title']);

// Better: Use prepared statements (see SQL Injection Prevention)
$sql = "INSERT INTO " . $xoopsDB->prefix('mytable') . " (title) VALUES (?)";
$result = $xoopsDB->query($sql, [$_POST['title']]);
```

## 디스플레이 위생처리

상황에 따라 다른 이스케이프가 필요합니다.

```php
$myts = MyTextSanitizer::getInstance();

// HTML context
echo $myts->htmlSpecialChars($title);

// Within HTML attributes
echo htmlspecialchars($title, ENT_QUOTES, 'UTF-8');

// JavaScript context
echo json_encode($title);

// URL parameter
echo urlencode($title);

// Full URL
echo htmlspecialchars($url, ENT_QUOTES, 'UTF-8');
```

## 일반적인 함정

### 이중 인코딩

**문제**: 데이터가 여러 번 인코딩됩니다.

```php
// Wrong - double encoding
$title = $myts->htmlSpecialChars($myts->htmlSpecialChars($_POST['title']));

// Right - encode once, at the appropriate time
$title = $_POST['title']; // Store raw
echo $myts->htmlSpecialChars($title); // Encode on output
```

### 일관성 없는 인코딩

**문제**: 일부 출력은 인코딩되고 일부는 인코딩되지 않습니다.

**해결책**: 항상 일관된 접근 방식을 사용하고, 가급적이면 출력 시 인코딩을 사용하세요.

```php
// Template assignment
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));
```

### 유효성 검사 누락

**문제**: 유효성 검사 없이 삭제만 수행

**해결책**: 항상 먼저 검증한 다음 삭제하세요.

```php
// First validate
if (!preg_match('/^[a-z0-9_]+$/', $_POST['username'])) {
    redirect_header('form.php', 3, 'Username contains invalid characters');
    exit();
}

// Then sanitize for storage/display
$username = $myts->htmlSpecialChars($_POST['username']);
```

## 모범 사례 요약

1. 텍스트 콘텐츠 처리를 위해 **MyTextSanitizer 사용**
2. 특정 형식 유효성 검사를 위해 **filter_var() 사용**
3. 숫자 값에는 **유형 캐스팅 사용**
4. 선택 입력에 대한 **허용 값 화이트리스트**
5. **살균하기 전에 유효성을 검사하세요**
6. **입력이 아닌 출력 시 탈출**
7. 데이터베이스 쿼리에 **준비된 문 사용**
8. 복잡한 양식에 대한 **검증 클래스 만들기**
9. **클라이언트 측 유효성 검사를 절대 신뢰하지 마세요** - 항상 서버 측 유효성을 검사하세요.

---

#security #sanitization #validation #xoops #MyTextSanitizer #입력 처리
