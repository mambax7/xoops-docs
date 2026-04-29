---
title: "보안 모범 사례"
description: "XOOPS 모듈 개발을 위한 종합 보안 가이드"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

:::tip[보안 API는 여러 버전에 걸쳐 안정적입니다.]
여기에 설명된 보안 사례와 API는 XOOPS 2.5.x와 XOOPS 4.0.x 모두에서 작동합니다. 핵심 보안 클래스(`XoopsSecurity`, `MyTextSanitizer`)는 안정적으로 유지됩니다.
:::

이 문서는 XOOPS 모듈 개발자를 위한 포괄적인 보안 모범 사례를 제공합니다. 이 지침을 따르면 모듈이 안전하고 XOOPS 설치에 취약점이 발생하지 않도록 하는 데 도움이 됩니다.

## 보안 원칙

모든 XOOPS 개발자는 다음과 같은 기본 보안 원칙을 따라야 합니다.

1. **심층 방어**: 여러 계층의 보안 제어 구현
2. **최소 권한**: 필요한 최소한의 접근권한만 제공
3. **입력 유효성 검사**: 사용자 입력을 절대 신뢰하지 마세요.
4. **기본적으로 보안**: 보안이 기본 구성이어야 합니다.
5. **단순함을 유지하세요**: 복잡한 시스템은 보안이 더 어렵습니다.

## 관련 문서

- CSRF 보호 - 토큰 시스템 및 XoopsSecurity 클래스
- 입력 삭제 - MyTextSanitizer 및 유효성 검사
- SQL 주입 방지 - 데이터베이스 보안 관행

## 빠른 참조 체크리스트

모듈을 출시하기 전에 다음을 확인하세요.

- [ ] 모든 양식에는 XOOPS 토큰이 포함됩니다.
- [ ] 모든 사용자 입력이 검증되고 삭제됩니다.
- [ ] 모든 출력이 올바르게 이스케이프되었습니다.
- [ ] 모든 데이터베이스 쿼리는 매개변수화된 문을 사용합니다.
- [ ] 파일 업로드가 제대로 검증되었습니다.
- [ ] 인증 및 승인 확인이 이루어지고 있습니다.
- [ ] 오류 처리로 민감한 정보가 노출되지 않음
- [ ] 중요한 구성이 보호됩니다.
- [ ] 타사 라이브러리가 최신 상태입니다.
- [ ] 보안 테스트가 수행되었습니다.

## 인증 및 승인

### 사용자 인증 확인 중

```php
// Check if user is logged in
if (!is_object($GLOBALS['xoopsUser'])) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### 사용자 권한 확인

```php
// Check if user has permission to access this module
if (!$GLOBALS['xoopsUser']->isAdmin($xoopsModule->mid())) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}

// Check specific permission
$moduleHandler = xoops_getHandler('module');
$module = $moduleHandler->getByDirname('mymodule');
$moduleperm_handler = xoops_getHandler('groupperm');
$groups = $GLOBALS['xoopsUser']->getGroups();

if (!$moduleperm_handler->checkRight('mymodule_view', $item_id, $groups, $module->getVar('mid'))) {
    redirect_header(XOOPS_URL, 3, _NOPERM);
    exit();
}
```

### 모듈 권한 설정

```php
// Create permission in install/update function
$gpermHandler = xoops_getHandler('groupperm');
$gpermHandler->deleteByModule($module->getVar('mid'), 'mymodule_view');

// Add permission for all groups
$groups = [XOOPS_GROUP_ADMIN, XOOPS_GROUP_USERS, XOOPS_GROUP_ANONYMOUS];
foreach ($groups as $group_id) {
    $gpermHandler->addRight('mymodule_view', 1, $group_id, $module->getVar('mid'));
}
```

## 세션 보안

### 세션 처리 모범 사례

1. 세션에 민감한 정보를 저장하지 마세요
2. 로그인/권한 변경 후 세션 ID 재생성
3. 세션 데이터를 사용하기 전에 유효성을 검사하세요.

```php
// Regenerate session ID after login
session_regenerate_id(true);

// Validate session data
if (isset($_SESSION['mymodule_user_id'])) {
    $user_id = (int)$_SESSION['mymodule_user_id'];
    // Verify user exists in database
}
```

### 세션 고정 방지

```php
// After successful login
session_regenerate_id(true);
$_SESSION['mymodule_user_ip'] = $_SERVER['REMOTE_ADDR'];

// On subsequent requests
if ($_SESSION['mymodule_user_ip'] !== $_SERVER['REMOTE_ADDR']) {
    // Possible session hijacking attempt
    session_destroy();
    redirect_header('index.php', 3, 'Session error');
    exit();
}
```

## 파일 업로드 보안

### 파일 업로드 확인 중

```php
// Check if file was uploaded properly
if (!isset($_FILES['userfile']) || $_FILES['userfile']['error'] != UPLOAD_ERR_OK) {
    redirect_header('index.php', 3, 'File upload error');
    exit();
}

// Check file size
if ($_FILES['userfile']['size'] > 1000000) { // 1MB limit
    redirect_header('index.php', 3, 'File too large');
    exit();
}

// Check file type
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
if (!in_array($_FILES['userfile']['type'], $allowed_types)) {
    redirect_header('index.php', 3, 'Invalid file type');
    exit();
}

// Validate file extension
$filename = $_FILES['userfile']['name'];
$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
$allowed_extensions = ['jpg', 'jpeg', 'png', 'gif'];
if (!in_array($ext, $allowed_extensions)) {
    redirect_header('index.php', 3, 'Invalid file extension');
    exit();
}
```

### XOOPS 업로더 사용

```php
include_once XOOPS_ROOT_PATH . '/class/uploader.php';

$allowed_mimetypes = ['image/gif', 'image/jpeg', 'image/png'];
$maxsize = 1000000; // 1MB
$maxwidth = 1024;
$maxheight = 768;
$upload_dir = XOOPS_ROOT_PATH . '/uploads/mymodule';

$uploader = new XoopsMediaUploader(
    $upload_dir,
    $allowed_mimetypes,
    $maxsize,
    $maxwidth,
    $maxheight
);

if ($uploader->fetchMedia('userfile')) {
    $uploader->setPrefix('mymodule_');

    if ($uploader->upload()) {
        $filename = $uploader->getSavedFileName();
        // Save filename to database
    } else {
        echo $uploader->getErrors();
    }
} else {
    echo $uploader->getErrors();
}
```

### 업로드된 파일을 안전하게 저장하기

```php
// Define upload directory outside web root
$upload_dir = XOOPS_VAR_PATH . '/uploads/mymodule';

// Create directory if it doesn't exist
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Move uploaded file
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload_dir . '/' . $safe_filename);
```

## 오류 처리 및 로깅

### 안전한 오류 처리

```php
try {
    $result = someFunction();
    if (!$result) {
        throw new Exception('Operation failed');
    }
} catch (Exception $e) {
    // Log the error
    xoops_error($e->getMessage());

    // Display a generic error message to the user
    redirect_header('index.php', 3, 'An error occurred. Please try again later.');
    exit();
}
```

### 보안 이벤트 로깅

```php
// Log security events
xoops_loadLanguage('logger', 'mymodule');
$GLOBALS['xoopsLogger']->addExtra('Security', 'Failed login attempt for user: ' . $username);
```

## 구성 보안

### 민감한 구성 저장

```php
// Define configuration path outside web root
$config_path = XOOPS_VAR_PATH . '/configs/mymodule/config.php';

// Load configuration
if (file_exists($config_path)) {
    include $config_path;
} else {
    // Handle missing configuration
}
```

### 구성 파일 보호

구성 파일을 보호하려면 `.htaccess`을 사용하세요.

```apache
# In .htaccess
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>
```

## 타사 라이브러리

### 라이브러리 선택

1. 적극적으로 유지관리되는 라이브러리를 선택하세요
2. 보안 취약점 점검
3. 라이브러리의 라이센스가 XOOPS와 호환되는지 확인하십시오.

### 라이브러리 업데이트 중

```php
// Check library version
if (version_compare(LIBRARY_VERSION, '1.2.3', '<')) {
    xoops_error('Please update the library to version 1.2.3 or higher');
}
```

### 라이브러리 분리

```php
// Load library in a controlled way
function loadLibrary($file)
{
    $allowed = ['parser.php', 'formatter.php'];

    if (!in_array($file, $allowed)) {
        return false;
    }

    include_once XOOPS_ROOT_PATH . '/modules/mymodule/libraries/' . $file;
    return true;
}
```

## 보안 테스트

### 수동 테스트 체크리스트

1. 잘못된 입력으로 모든 양식을 테스트합니다.
2. 인증 및 승인 우회 시도
3. 악성 파일로 파일 업로드 기능 테스트
4. 모든 출력에서 XSS 취약점을 확인하세요.
5. 모든 데이터베이스 쿼리에서 SQL 주입 테스트

### 자동화된 테스트

자동화된 도구를 사용하여 취약점을 검색합니다.

1. 정적 코드 분석 도구
2. 웹 애플리케이션 스캐너
3. 타사 라이브러리에 대한 종속성 검사기

## 출력 이스케이프

### HTML 컨텍스트

```php
// For regular HTML content
echo htmlspecialchars($variable, ENT_QUOTES, 'UTF-8');

// Using MyTextSanitizer
$myts = MyTextSanitizer::getInstance();
echo $myts->htmlSpecialChars($variable);
```

### JavaScript 컨텍스트

```php
// For data used in JavaScript
echo json_encode($variable);

// For inline JavaScript
echo 'var data = ' . json_encode($variable) . ';';
```

### URL 컨텍스트

```php
// For data used in URLs
echo htmlspecialchars(urlencode($variable), ENT_QUOTES, 'UTF-8');
```

### 템플릿 변수

```php
// Assign variables to Smarty template
$GLOBALS['xoopsTpl']->assign('title', htmlspecialchars($title, ENT_QUOTES, 'UTF-8'));

// For HTML content that should be displayed as-is
$GLOBALS['xoopsTpl']->assign('content', $myts->displayTarea($content, 1, 1, 1, 1, 1));
```

## 리소스

- [OWASP 톱 10](https://owasp.org/www-project-top-ten/)
- [PHP 보안 요약본](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)
- [XOOPS 문서](https://xoops.org/)

---

#보안 #모범 사례 #xoops #모듈 개발 #인증 #승인
