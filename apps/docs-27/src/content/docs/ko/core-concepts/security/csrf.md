---
title: "CSRF 보호"
description: "XoopsSecurity 클래스를 사용하여 XOOPS에서 CSRF 보호 이해 및 구현"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

CSRF(교차 사이트 요청 위조) 공격은 사용자를 속여 인증된 사이트에서 원치 않는 작업을 수행하도록 합니다. XOOPS는 `XoopsSecurity` 클래스를 통해 내장 CSRF 보호 기능을 제공합니다.

## 관련 문서

- 보안 모범 사례 - 종합 보안 가이드
- 입력 삭제 - MyTextSanitizer 및 유효성 검사
- SQL 주입 방지 - 데이터베이스 보안 관행

## CSRF 공격 이해

CSRF 공격은 다음과 같은 경우에 발생합니다.

1. XOOPS 사이트에서 사용자가 인증되었습니다.
2. 이용자가 악성사이트를 방문하는 경우
3. 악성 사이트는 사용자의 세션을 사용하여 XOOPS 사이트에 요청을 제출합니다.
4. 귀하의 사이트는 합법적인 사용자가 보낸 것처럼 요청을 처리합니다.

## XoopsSecurity 클래스

XOOPS는 CSRF 공격으로부터 보호하기 위해 `XoopsSecurity` 클래스를 제공합니다. 이 클래스는 양식에 포함되어야 하고 요청을 처리할 때 확인되어야 하는 보안 토큰을 관리합니다.

### 토큰 생성

보안 클래스는 사용자 세션에 저장되고 양식에 포함되어야 하는 고유 토큰을 생성합니다.

```php
$security = new XoopsSecurity();

// Get token HTML input field
$tokenHTML = $security->getTokenHTML();

// Get just the token value
$tokenValue = $security->createToken();
```

### 토큰 검증

양식 제출을 처리할 때 토큰이 유효한지 확인하세요.

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}
```

## XOOPS 토큰 시스템 사용

### XoopsForm 클래스 포함

XOOPS 양식 클래스를 사용할 때 토큰 보호는 간단합니다.

```php
// Create a form
$form = new XoopsThemeForm('Add Item', 'form_name', 'submit.php');

// Add form elements
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));

// Add hidden token field - ALWAYS include this
$form->addElement(new XoopsFormHiddenToken());

// Add submit button
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));
```

### 사용자 정의 양식 사용

XoopsForm을 사용하지 않는 사용자 정의 HTML 양식의 경우:

```php
// In your form template or PHP file
$security = new XoopsSecurity();
?>
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    <!-- Include the token -->
    <?php echo $security->getTokenHTML(); ?>

    <button type="submit">Submit</button>
</form>
```

### Smarty 템플릿

Smarty 템플릿에서 양식을 생성하는 경우:

```php
// In your PHP file
$security = new XoopsSecurity();
$GLOBALS['xoopsTpl']->assign('token', $security->getTokenHTML());
```

```smarty
{* In your template *}
<form method="post" action="submit.php">
    <input type="text" name="title" />
    <textarea name="content"></textarea>

    {* Include the token *}
    <{$token}>

    <button type="submit">Submit</button>
</form>
```

## 양식 제출 처리 중

### 기본 토큰 검증

```php
// In your form processing script
$security = new XoopsSecurity();

// Verify the token
if (!$security->check()) {
    redirect_header('index.php', 3, _MD_TOKENEXPIRED);
    exit();
}

// Token is valid, process the form
$title = $_POST['title'];
// ... continue processing
```

### 사용자 정의 오류 처리 포함

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Get detailed error information
    $errors = $security->getErrors();

    // Log the error
    error_log('CSRF token validation failed: ' . implode(', ', $errors));

    // Redirect with error message
    redirect_header('form.php', 3, 'Security token expired. Please try again.');
    exit();
}
```

### AJAX 요청의 경우

AJAX 요청 작업을 할 때 요청에 토큰을 포함하세요.

```javascript
// JavaScript - get token from hidden field
var token = document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value;

// Include in AJAX request
fetch('ajax_handler.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'action=save&XOOPS_TOKEN_REQUEST=' + encodeURIComponent(token)
});
```

```php
// PHP AJAX handler
$security = new XoopsSecurity();

if (!$security->check()) {
    echo json_encode(['error' => 'Invalid security token']);
    exit();
}

// Process AJAX request
```

## HTTP 리퍼러 확인 중

특히 AJAX 요청의 경우 추가 보호를 위해 HTTP 리퍼러를 확인할 수도 있습니다.

```php
$security = new XoopsSecurity();

// Check referer header
if (!$security->checkReferer()) {
    echo json_encode(['error' => 'Invalid request']);
    exit();
}

// Also verify the token
if (!$security->check()) {
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

### 통합보안검사

```php
$security = new XoopsSecurity();

// Perform both checks
if (!$security->checkReferer() || !$security->check()) {
    redirect_header('index.php', 3, 'Security validation failed');
    exit();
}
```

## 토큰 구성

### 토큰 수명

토큰은 재생 공격을 방지하기 위해 수명이 제한되어 있습니다. XOOPS 설정에서 이를 구성하거나 만료된 토큰을 적절하게 처리할 수 있습니다.

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Token may have expired
    // Regenerate form with new token
    redirect_header('form.php', 3, 'Your session has expired. Please submit the form again.');
    exit();
}
```

### 같은 페이지에 여러 양식이 있음

동일한 페이지에 여러 양식이 있는 경우 각 양식에는 고유한 토큰이 있어야 합니다.

```php
// Form 1
$form1 = new XoopsThemeForm('Form 1', 'form1', 'submit1.php');
$form1->addElement(new XoopsFormHiddenToken('token1'));

// Form 2
$form2 = new XoopsThemeForm('Form 2', 'form2', 'submit2.php');
$form2->addElement(new XoopsFormHiddenToken('token2'));
```

## 모범 사례

### 상태 변경 작업에는 항상 토큰을 사용하세요

다음과 같은 형태로 토큰을 포함합니다.

- 데이터를 생성합니다
- 데이터 업데이트
- 데이터를 삭제합니다
- 사용자 설정을 변경합니다.
- 행정적 조치를 수행합니다.

### 추천인 확인에만 의존하지 마세요

HTTP 리퍼러 헤더는 다음과 같습니다.

- 개인 정보 보호 도구로 제거됨
- 일부 브라우저에서 누락됨
- 경우에 따라 스푸핑됨

항상 토큰 확인을 기본 방어 수단으로 사용하십시오.

### 적절한 토큰 재생성

토큰 재생성을 고려하세요.

- 성공적으로 양식을 제출한 후
- 로그인/로그아웃 후
- 긴 세션의 경우 일정한 간격으로

### 토큰 만료를 적절하게 처리

```php
$security = new XoopsSecurity();

if (!$security->check()) {
    // Store form data temporarily
    $_SESSION['form_backup'] = $_POST;

    // Redirect back to form with message
    redirect_header('form.php?restore=1', 3, 'Please resubmit the form.');
    exit();
}
```

## 일반적인 문제 및 해결 방법

### 토큰을 찾을 수 없음 오류

**문제**: "토큰을 찾을 수 없음"으로 인해 보안 검사가 실패합니다.

**해결책**: 양식에 토큰 필드가 포함되어 있는지 확인하세요.

```php
$form->addElement(new XoopsFormHiddenToken());
```

### 토큰 만료 오류

**문제**: 긴 양식 완료 후 사용자에게 "토큰 만료됨" 메시지가 표시됩니다.

**해결책**: 정기적으로 토큰을 새로 고치려면 JavaScript를 사용하는 것이 좋습니다.

```javascript
// Refresh token every 10 minutes
setInterval(function() {
    fetch('refresh_token.php')
        .then(response => response.json())
        .then(data => {
            document.querySelector('input[name="XOOPS_TOKEN_REQUEST"]').value = data.token;
        });
}, 600000);
```

### AJAX 토큰 문제

**문제**: AJAX 요청이 토큰 검증에 실패합니다.

**해결책**: 모든 AJAX 요청과 함께 토큰이 전달되는지 확인하고 서버 측에서 확인하세요.

```php
// AJAX handler
header('Content-Type: application/json');

$security = new XoopsSecurity();
if (!$security->check(true, false)) { // Don't clear token for AJAX
    http_response_code(403);
    echo json_encode(['error' => 'Invalid token']);
    exit();
}
```

## 예: 완전한 양식 구현

```php
<?php
// form.php
require_once dirname(__DIR__) . '/mainfile.php';

$security = new XoopsSecurity();

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!$security->check()) {
        redirect_header('form.php', 3, 'Security token expired. Please try again.');
        exit();
    }

    // Process valid submission
    $title = $myts->htmlSpecialChars($_POST['title']);
    // ... save to database

    redirect_header('success.php', 3, 'Item saved successfully!');
    exit();
}

// Display form
$GLOBALS['xoopsOption']['template_main'] = 'mymodule_form.tpl';
include XOOPS_ROOT_PATH . '/header.php';

$form = new XoopsThemeForm('Add Item', 'add_item', 'form.php');
$form->addElement(new XoopsFormText('Title', 'title', 50, 255, ''));
$form->addElement(new XoopsFormTextArea('Content', 'content', ''));
$form->addElement(new XoopsFormHiddenToken());
$form->addElement(new XoopsFormButton('', 'submit', _SUBMIT, 'submit'));

$GLOBALS['xoopsTpl']->assign('form', $form->render());

include XOOPS_ROOT_PATH . '/footer.php';
```

---

#security #csrf #xoops #forms #tokens #XoopsSecurity
