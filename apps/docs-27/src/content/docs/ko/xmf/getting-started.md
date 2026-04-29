---
title: "XMF 시작하기"
description: "XOOPS 모듈 프레임워크의 설치, 기본 개념 및 첫 번째 단계"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

이 가이드에서는 XOOPS 모듈 프레임워크(XMF)의 기본 개념과 이를 모듈에서 사용을 시작하는 방법을 다룹니다.

## 전제 조건

- XOOPS 2.5.8 이상이 설치되어 있습니다.
- PHP 7.2 이상
- PHP 객체지향 프로그래밍에 대한 기본 이해

## 네임스페이스 이해

XMF는 PHP 네임스페이스를 사용하여 클래스를 구성하고 이름 충돌을 방지합니다. 모든 XMF 클래스는 `Xmf` 네임스페이스에 있습니다.

### 전역 공간 문제

네임스페이스가 없으면 모든 PHP 클래스는 전역 공간을 공유합니다. 이로 인해 충돌이 발생할 수 있습니다.

```php
<?php
// This would conflict with PHP's built-in ArrayObject
class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// Fatal error: Cannot redeclare class ArrayObject
```

### 네임스페이스 솔루션

네임스페이스는 격리된 명명 컨텍스트를 생성합니다.

```php
<?php
namespace MyNamespace;

class ArrayObject {
    public function doStuff() {
        // ...
    }
}
// No conflict - this is \MyNamespace\ArrayObject
```

### XMF 네임스페이스 사용

여러 가지 방법으로 XMF 클래스를 참조할 수 있습니다.

**전체 네임스페이스 경로:**
```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
```

**사용 설명 포함:**
```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');
```

**여러 가져오기:**
```php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;

$input = Request::getString('input', '');
$helper = Helper::getHelper('mymodule');
$perm = new Permission();
```

## 자동 로딩

XMF의 가장 큰 편리함 중 하나는 자동 클래스 로딩입니다. XMF 클래스 파일을 수동으로 포함할 필요가 없습니다.

### 기존 XOOPS 로딩

이전 방식에서는 명시적 로딩이 필요했습니다.

```php
XoopsLoad('xoopsrequest');
$cleanInput = XoopsRequest::getString('input', '');
```

### XMF 자동 로딩

XMF를 사용하면 클래스가 참조될 때 자동으로 로드됩니다.

```php
$input = Xmf\Request::getString('input', '');
```

또는 use 문을 사용하면 다음과 같습니다.

```php
use Xmf\Request;

$input = Request::getString('input', '');
$id = Request::getInt('id', 0);
$op = Request::getCmd('op', 'display');
```

오토로더는 [PSR-4](http://www.php-fig.org/psr/psr-4/) 표준을 따르며 XMF가 의존하는 종속성도 관리합니다.

## 기본 사용 예

### 읽기 요청 입력

```php
use Xmf\Request;

// Get integer value with default of 0
$id = Request::getInt('id', 0);

// Get string value with default empty string
$title = Request::getString('title', '');

// Get command (alphanumeric, lowercase)
$op = Request::getCmd('op', 'list');

// Get email with validation
$email = Request::getEmail('email', '');

// Get from specific hash (POST, GET, etc.)
$formData = Request::getString('data', '', 'POST');
```

### 모듈 도우미 사용

```php
use Xmf\Module\Helper;

// Get helper for your module
$helper = Helper::getHelper('mymodule');

// Read module configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableFeature = $helper->getConfig('enable_feature', false);

// Access the module object
$module = $helper->getModule();
$version = $module->getVar('version');

// Get a handler
$itemHandler = $helper->getHandler('items');

// Load language file
$helper->loadLanguage('admin');

// Check if current module
if ($helper->isCurrentModule()) {
    // We are in this module
}

// Check admin rights
if ($helper->isUserAdmin()) {
    // User has admin access
}
```

### 경로 및 URL 도우미

```php
use Xmf\Module\Helper;

$helper = Helper::getHelper('mymodule');

// Get module URL
$moduleUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

// Get module path
$modulePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

// Upload paths
$uploadUrl = $helper->uploadUrl('files/document.pdf');
$uploadPath = $helper->uploadPath('files/document.pdf');
```

## XMF로 디버깅

XMF는 유용한 디버깅 도구를 제공합니다.

```php
// Dump a variable with nice formatting
\Xmf\Debug::dump($myVariable);

// Dump multiple variables
\Xmf\Debug::dump($var1, $var2, $var3);

// Dump POST data
\Xmf\Debug::dump($_POST);

// Show a backtrace
\Xmf\Debug::backtrace();
```

디버그 출력은 축소 가능하며 읽기 쉬운 형식으로 개체와 배열을 표시합니다.

## 프로젝트 구조 권장 사항

XMF 기반 모듈을 구축할 때 코드를 구성하십시오.

```
mymodule/
  admin/
    index.php
    menu.php
  class/
    Helper.php          # Optional custom helper
    ItemHandler.php     # Your handlers
  include/
    common.php
  language/
    english/
      main.php
      admin.php
      modinfo.php
  templates/
    mymodule_index.tpl
  index.php
  xoops_version.php
```

## 공통 포함 패턴

일반적인 모듈 진입점:

```php
<?php
// mymodule/index.php

use Xmf\Request;
use Xmf\Module\Helper;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

$helper = Helper::getHelper(basename(__DIR__));

// Get operation from request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

// Include XOOPS header
require_once XOOPS_ROOT_PATH . '/header.php';

// Your module logic here
switch ($op) {
    case 'view':
        // Handle view
        break;
    case 'list':
    default:
        // Handle list
        break;
}

// Include XOOPS footer
require_once XOOPS_ROOT_PATH . '/footer.php';
```

## 다음 단계

이제 기본 사항을 이해했으므로 다음을 살펴보세요.

- XMF-요청 - 자세한 요청 처리 문서
- XMF-Module-Helper - 전체 모듈 도우미 참조
-../Recipes/Permission-Helper - 사용자 권한 관리
-../Recipes/Module-Admin-Pages - 관리 인터페이스 구축

## 참고 항목

-../XMF-Framework - 프레임워크 개요
-../Reference/JWT - JSON 웹 토큰 지원
-../참조/데이터베이스 - 데이터베이스 유틸리티

---

#xmf #시작하기 #네임스페이스 #자동 로딩 #기본
