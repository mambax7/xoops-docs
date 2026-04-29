---
title: "Hello World 모듈"
description: "첫 번째 XOOPS 모듈 생성을 위한 단계별 튜토리얼"
---

# Hello World 모듈 튜토리얼

이 튜토리얼은 첫 번째 XOOPS 모듈을 생성하는 과정을 안내합니다. 마지막에는 프런트엔드와 관리 영역 모두에 "Hello World"를 표시하는 작업 모듈이 만들어집니다.

## 전제 조건

- XOOPS 2.5.x가 설치되어 실행 중입니다.
- PHP 8.0 이상
- 기본 PHP 지식
- 텍스트 편집기 또는 IDE(PhpStorm 권장)

## 1단계: 디렉터리 구조 만들기

`/modules/helloworld/`에 다음 디렉터리 구조를 만듭니다.

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## 2단계: 모듈 정의 생성

`xoops_version.php` 생성:

```php
<?php
/**
 * Hello World Module - Module Definition
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$modversion = [];

// Basic Module Information
$modversion['name']        = _MI_HELLOWORLD_NAME;
$modversion['version']     = 1.00;
$modversion['description'] = _MI_HELLOWORLD_DESC;
$modversion['author']      = 'Your Name';
$modversion['credits']     = 'XOOPS Community';
$modversion['help']        = 'page=help';
$modversion['license']     = 'GPL 2.0 or later';
$modversion['license_url'] = 'https://www.gnu.org/licenses/gpl-2.0.html';
$modversion['image']       = 'assets/images/logo.png';
$modversion['dirname']     = 'helloworld';

// Module Status
$modversion['release_date']        = '2025/01/28';
$modversion['module_website_url']  = 'https://xoops.org/';
$modversion['module_website_name'] = 'XOOPS';
$modversion['min_php']             = '8.0';
$modversion['min_xoops']           = '2.5.11';

// Admin Configuration
$modversion['hasAdmin']    = 1;
$modversion['adminindex']  = 'admin/index.php';
$modversion['adminmenu']   = 'admin/menu.php';
$modversion['system_menu'] = 1;

// Main Menu
$modversion['hasMain'] = 1;

// Templates
$modversion['templates'][] = [
    'file'        => 'helloworld_index.tpl',
    'description' => _MI_HELLOWORLD_INDEX_TPL,
];

// Admin Templates
$modversion['templates'][] = [
    'file'        => 'admin/helloworld_admin_index.tpl',
    'description' => _MI_HELLOWORLD_ADMIN_INDEX_TPL,
];

// No database tables needed for this simple module
$modversion['tables'] = [];
```

## 3단계: 언어 파일 생성

### modinfo.php (모듈 정보)

`language/english/modinfo.php` 생성:

```php
<?php
/**
 * Module Information Language Constants
 */

// Module Info
define('_MI_HELLOWORLD_NAME', 'Hello World');
define('_MI_HELLOWORLD_DESC', 'A simple Hello World module for learning XOOPS development.');

// Template Descriptions
define('_MI_HELLOWORLD_INDEX_TPL', 'Main index page template');
define('_MI_HELLOWORLD_ADMIN_INDEX_TPL', 'Admin index page template');
```

### main.php (프런트엔드 언어)

`language/english/main.php` 생성:

```php
<?php
/**
 * Frontend Language Constants
 */

define('_MD_HELLOWORLD_TITLE', 'Hello World');
define('_MD_HELLOWORLD_WELCOME', 'Welcome to the Hello World Module!');
define('_MD_HELLOWORLD_MESSAGE', 'This is your first XOOPS module. Congratulations!');
define('_MD_HELLOWORLD_CURRENT_TIME', 'Current server time:');
define('_MD_HELLOWORLD_VISITOR_COUNT', 'You are visitor number:');
```

### admin.php (관리 언어)

`language/english/admin.php` 생성:

```php
<?php
/**
 * Admin Language Constants
 */

define('_AM_HELLOWORLD_INDEX', 'Dashboard');
define('_AM_HELLOWORLD_ADMIN_TITLE', 'Hello World Administration');
define('_AM_HELLOWORLD_ADMIN_WELCOME', 'Welcome to the Hello World Module Administration');
define('_AM_HELLOWORLD_MODULE_INFO', 'Module Information');
define('_AM_HELLOWORLD_VERSION', 'Version:');
define('_AM_HELLOWORLD_AUTHOR', 'Author:');
```

## 4단계: 프런트엔드 색인 생성

모듈 루트에 `index.php`을 만듭니다.

```php
<?php
/**
 * Hello World Module - Frontend Index
 *
 * @package    HelloWorld
 * @author     Your Name
 * @copyright  2025 Your Name
 * @license    GPL 2.0 or later
 */

declare(strict_types=1);

use Xmf\Request;

require_once dirname(__DIR__, 2) . '/mainfile.php';

// Load language file
xoops_loadLanguage('main', 'helloworld');

// Get the module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');

// Set page template
$GLOBALS['xoopsOption']['template_main'] = 'helloworld_index.tpl';

// Include XOOPS header
require XOOPS_ROOT_PATH . '/header.php';

// Get module configuration
/** @var \XoopsModule $xoopsModule */
$xoopsModule = $GLOBALS['xoopsModule'];

// Generate page content
$pageTitle = _MD_HELLOWORLD_TITLE;
$welcomeMessage = _MD_HELLOWORLD_WELCOME;
$contentMessage = _MD_HELLOWORLD_MESSAGE;
$currentTime = date('Y-m-d H:i:s');

// Simple visitor counter (using session)
if (!isset($_SESSION['helloworld_visits'])) {
    $_SESSION['helloworld_visits'] = 0;
}
$_SESSION['helloworld_visits']++;
$visitorCount = $_SESSION['helloworld_visits'];

// Assign variables to template
$xoopsTpl->assign([
    'page_title'      => $pageTitle,
    'welcome_message' => $welcomeMessage,
    'content_message' => $contentMessage,
    'current_time'    => $currentTime,
    'visitor_count'   => $visitorCount,
    'time_label'      => _MD_HELLOWORLD_CURRENT_TIME,
    'visitor_label'   => _MD_HELLOWORLD_VISITOR_COUNT,
]);

// Include XOOPS footer
require XOOPS_ROOT_PATH . '/footer.php';
```

## 5단계: 프런트엔드 템플릿 만들기

`templates/helloworld_index.tpl` 생성:

```smarty
<{* Hello World Module - Index Template *}>

<div class="helloworld-container">
    <h1><{$page_title}></h1>

    <div class="helloworld-welcome">
        <p class="lead"><{$welcome_message}></p>
    </div>

    <div class="helloworld-content">
        <p><{$content_message}></p>
    </div>

    <div class="helloworld-info">
        <ul>
            <li><strong><{$time_label}></strong> <{$current_time}></li>
            <li><strong><{$visitor_label}></strong> <{$visitor_count}></li>
        </ul>
    </div>
</div>

<style>
.helloworld-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.helloworld-welcome {
    background-color: #f8f9fa;
    border-left: 4px solid #007bff;
    padding: 15px;
    margin: 20px 0;
}

.helloworld-content {
    margin: 20px 0;
}

.helloworld-info {
    background-color: #e9ecef;
    padding: 15px;
    border-radius: 5px;
}

.helloworld-info ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.helloworld-info li {
    padding: 5px 0;
}
</style>
```

## 6단계: 관리 파일 생성

### 관리자 헤더

`admin/admin_header.php` 생성:

```php
<?php
/**
 * Admin Header
 */

declare(strict_types=1);

require_once dirname(__DIR__, 3) . '/include/cp_header.php';

// Load admin language file
xoops_loadLanguage('admin', 'helloworld');
xoops_loadLanguage('modinfo', 'helloworld');

// Get module helper
$helper = \Xmf\Module\Helper::getHelper('helloworld');
$adminObject = \Xmf\Module\Admin::getInstance();

// Module directory
$moduleDirname = $helper->getDirname();
$modulePath = XOOPS_ROOT_PATH . '/modules/' . $moduleDirname;
$moduleUrl = XOOPS_URL . '/modules/' . $moduleDirname;
```

### 관리 바닥글

`admin/admin_footer.php` 생성:

```php
<?php
/**
 * Admin Footer
 */

// Display admin footer
$adminObject->displayFooter();

require_once dirname(__DIR__, 3) . '/include/cp_footer.php';
```

### 관리 메뉴

`admin/menu.php` 생성:

```php
<?php
/**
 * Admin Menu Configuration
 */

if (!defined('XOOPS_ROOT_PATH')) {
    die('XOOPS root path not defined');
}

$adminmenu = [];

// Dashboard
$adminmenu[] = [
    'title' => _AM_HELLOWORLD_INDEX,
    'link'  => 'admin/index.php',
    'icon'  => 'home.png',
];
```

### 관리자 색인 페이지

`admin/index.php` 생성:

```php
<?php
/**
 * Admin Index Page
 */

declare(strict_types=1);

require_once __DIR__ . '/admin_header.php';

// Display admin navigation
$adminObject->displayNavigation('index.php');

// Create admin info box
$adminObject->addInfoBox(_AM_HELLOWORLD_MODULE_INFO);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_VERSION, $helper->getModule()->getVar('version'))
);
$adminObject->addInfoBoxLine(
    sprintf('<strong>%s</strong> %s', _AM_HELLOWORLD_AUTHOR, $helper->getModule()->getVar('author'))
);

// Display info box
$adminObject->displayInfoBox(_AM_HELLOWORLD_MODULE_INFO);

// Display admin footer
require_once __DIR__ . '/admin_footer.php';
```

## 7단계: 관리 템플릿 만들기

`templates/admin/helloworld_admin_index.tpl` 생성:

```smarty
<{* Hello World Module - Admin Index Template *}>

<div class="helloworld-admin">
    <h2><{$admin_title}></h2>
    <p><{$admin_welcome}></p>
</div>
```

## 8단계: 모듈 로고 만들기

PNG 이미지(권장 크기: 92x92픽셀)를 만들거나 복사하여 다음을 수행합니다.
`assets/images/logo.png`

이미지 편집기를 사용하여 간단한 로고를 만들거나 placeholder.com과 같은 사이트의 자리 표시자를 사용할 수 있습니다.

## 9단계: 모듈 설치

1. XOOPS 사이트에 관리자로 로그인합니다.
2. **시스템 관리** > **모듈**로 이동합니다.
3. 사용 가능한 모듈 목록에서 "Hello World"를 찾습니다.
4. **설치** 버튼을 클릭하세요.
5. 설치 확인

## 10단계: 모듈 테스트

### 프론트엔드 테스트

1. XOOPS 사이트로 이동합니다.
2. 메인 메뉴에서 "Hello World"를 클릭하세요.
3. 환영 메시지와 현재 시간이 표시됩니다.

### 관리자 테스트

1. 관리 영역으로 이동
2. 관리자 메뉴에서 "Hello World"를 클릭하세요.
3. 관리자 대시보드가 표시됩니다.

## 문제 해결

### 설치 목록에 모듈이 표시되지 않음

- 파일 권한 확인(디렉터리의 경우 755, 파일의 경우 644)
- `xoops_version.php`에 구문 오류가 없는지 확인하세요.
- XOOPS 캐시 지우기

### 템플릿이 로드되지 않음

- 템플릿 파일이 올바른 디렉터리에 있는지 확인하세요.
- 템플릿 파일 이름이 `xoops_version.php`과 일치하는지 확인하세요.
- Smarty 구문이 올바른지 확인하세요.

### 언어 문자열이 표시되지 않음

- 언어 파일 경로 확인
- 언어 상수가 정의되어 있는지 확인하세요.
- 올바른 언어 폴더가 있는지 확인하세요.

## 다음 단계

이제 작동하는 모듈이 있으므로 다음을 계속 학습하세요.

- CRUD 모듈 구축 - 데이터베이스 기능 추가
-../Patterns/MVC-Pattern - 코드를 올바르게 구성하세요.
-../Best-Practices/Testing - PHPUnit 테스트 추가

## 전체 파일 참조

완성된 모듈에는 다음 파일이 있어야 합니다.

```
/modules/helloworld/
    /admin/
        admin_header.php
        admin_footer.php
        index.php
        menu.php
    /assets/
        /images/
            logo.png
    /language/
        /english/
            admin.php
            main.php
            modinfo.php
    /templates/
        /admin/
            helloworld_admin_index.tpl
        helloworld_index.tpl
    index.php
    xoops_version.php
```

## 요약

축하합니다! 첫 번째 XOOPS 모듈을 만들었습니다. 다루는 주요 개념:

1. **모듈 구조** - 표준 XOOPS 모듈 디렉토리 레이아웃
2. **xoops_version.php** - 모듈 정의 및 구성
3. **언어 파일** - 국제화 지원
4. **템플릿** - Smarty 템플릿 통합
5. **관리자 인터페이스** - 기본 관리자 패널

참조:../모듈 개발 | CRUD 모듈 구축 |../패턴/MVC-패턴
