---
title: "XMF 모듈 도우미"
description: 'Xmf\Module\Helper 클래스 및 관련 도우미를 사용하여 단순화된 모듈 작업'
---

`Xmf\Module\Helper` 클래스는 모듈 관련 정보, 구성, 처리기 등에 액세스하는 쉬운 방법을 제공합니다. 모듈 도우미를 사용하면 코드가 단순화되고 상용구가 줄어듭니다.

## 개요

모듈 도우미는 다음을 제공합니다.

- 단순화된 구성 액세스
- 모듈 객체 검색
- 핸들러 인스턴스화
- 경로 및 URL 확인
- 권한 및 세션 도우미
- 캐시 관리

## 모듈 도우미 얻기

### 기본 사용법

```php
use Xmf\Module\Helper;

// Get helper for a specific module
$helper = Helper::getHelper('mymodule');

// The helper is automatically associated with the module directory
```

### 현재 모듈에서

모듈 이름을 지정하지 않으면 현재 활성 모듈을 사용합니다.

```php
$helper = Helper::getHelper('');
// or
$helper = Helper::getHelper(basename(__DIR__));
```

## 구성 액세스

### 전통적인 XOOPS 방식

모듈 구성을 이전 방식으로 얻는 것은 장황합니다.

```php
$module_handler = xoops_gethandler('module');
$module = $module_handler->getByDirname('mymodule');
$config_handler = xoops_gethandler('config');
$moduleConfig = $config_handler->getConfigsByCat(0, $module->getVar('mid'));
$value = isset($moduleConfig['foo']) ? $moduleConfig['foo'] : 'default';
echo "The value of 'foo' is: " . $value;
```

### XMF 방식

모듈 도우미를 사용하면 동일한 작업이 간단해집니다.

```php
$helper = \Xmf\Module\Helper::getHelper('mymodule');
echo "The value of 'foo' is: " . $helper->getConfig('foo', 'default');
```

## 도우미 메서드

### get모듈()

도우미 모듈에 대한 XoopsModule 개체를 반환합니다.

```php
$module = $helper->getModule();
$version = $module->getVar('version');
$name = $module->getVar('name');
$mid = $module->getVar('mid');
```

### getConfig($name, $default)

모듈 구성 값 또는 모든 구성을 반환합니다.

```php
// Get single config with default
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableCache = $helper->getConfig('enable_cache', true);

// Get all configs as array
$allConfigs = $helper->getConfig('');
```

### getHandler($name)

모듈에 대한 객체 핸들러를 반환합니다.

```php
$itemHandler = $helper->getHandler('items');
$categoryHandler = $helper->getHandler('categories');

// Use the handler
$item = $itemHandler->get($id);
$items = $itemHandler->getObjects($criteria);
```

### 로드언어($name)

모듈에 대한 언어 파일을 로드합니다.

```php
$helper->loadLanguage('main');
$helper->loadLanguage('admin');
$helper->loadLanguage('modinfo');
```

### isCurrentModule()

이 모듈이 현재 활성화된 모듈인지 확인합니다.

```php
if ($helper->isCurrentModule()) {
    // We're in the module's own pages
} else {
    // Called from another module or location
}
```

### isUserAdmin()

현재 사용자에게 이 모듈에 대한 관리자 권한이 있는지 확인합니다.

```php
if ($helper->isUserAdmin()) {
    // Show admin options
    echo '<a href="' . $helper->url('admin/index.php') . '">Admin</a>';
}
```

## 경로 및 URL 방법

### URL($url)

모듈 상대 경로에 대한 절대 URL을 반환합니다.

```php
$logoUrl = $helper->url('images/logo.png');
// Returns: https://example.com/modules/mymodule/images/logo.png

$adminUrl = $helper->url('admin/index.php');
// Returns: https://example.com/modules/mymodule/admin/index.php
```

### 경로($path)

모듈 상대 경로에 대한 절대 파일 시스템 경로를 반환합니다.

```php
$templatePath = $helper->path('templates/view.tpl');
// Returns: /var/www/html/modules/mymodule/templates/view.tpl

$includePath = $helper->path('include/functions.php');
require_once $includePath;
```

### 업로드 URL($url)

모듈 업로드 파일의 절대 URL을 반환합니다.

```php
$fileUrl = $helper->uploadUrl('documents/manual.pdf');
```

### 업로드 경로($path)

모듈 업로드 파일의 절대 파일 시스템 경로를 반환합니다.

```php
$uploadDir = $helper->uploadPath('');
$filePath = $helper->uploadPath('images/photo.jpg');
```

### 리디렉션($url, $time, $message)

모듈 내에서 모듈 상대 URL로 리디렉션합니다.

```php
$helper->redirect('index.php', 3, 'Item saved successfully');
$helper->redirect('view.php?id=' . $newId, 2, 'Created!');
```

## 디버깅 지원

### setDebug($bool)

도우미에 대한 디버그 모드를 활성화하거나 비활성화합니다.

```php
$helper->setDebug(true);  // Enable
$helper->setDebug(false); // Disable
$helper->setDebug();      // Enable (default is true)
```

### addLog($log)

모듈 로그에 메시지를 추가합니다.

```php
$helper->addLog('Processing item ID: ' . $id);
$helper->addLog('Cache miss, loading from database');
```

## 관련 도우미 클래스

XMF는 `Xmf\Module\Helper\AbstractHelper`을 확장하는 전문 도우미를 제공합니다.

### 권한 도우미

자세한 문서는../Recipes/Permission-Helper를 참조하세요.

```php
$permHelper = new \Xmf\Module\Helper\Permission('mymodule');

// Check permission
if ($permHelper->checkPermission('view', $itemId)) {
    // User has permission
}

// Check and redirect if no permission
$permHelper->checkPermissionRedirect('edit', $itemId, 'index.php', 3, 'Access denied');
```

### 세션 도우미

자동 키 접두사가 있는 모듈 인식 세션 저장소입니다.

```php
$session = new \Xmf\Module\Helper\Session('mymodule');

// Store value
$session->set('last_viewed', $itemId);

// Retrieve value
$lastViewed = $session->get('last_viewed', 0);

// Delete value
$session->del('last_viewed');

// Clear all module session data
$session->destroy();
```

### 캐시 도우미

자동 키 접두어 지정을 통한 모듈 인식 캐싱.

```php
$cache = new \Xmf\Module\Helper\Cache('mymodule');

// Write to cache (TTL in seconds)
$cache->write('item_' . $id, $itemData, 3600);

// Read from cache
$data = $cache->read('item_' . $id, null);

// Delete from cache
$cache->delete('item_' . $id);

// Read with automatic regeneration
$data = $cache->cacheRead(
    'expensive_data',
    function() {
        // This runs only if cache miss
        return computeExpensiveData();
    },
    3600
);
```

## 완전한 예

다음은 모듈 도우미를 사용하는 포괄적인 예입니다.

```php
<?php
use Xmf\Request;
use Xmf\Module\Helper;
use Xmf\Module\Helper\Permission;
use Xmf\Module\Helper\Session;

require_once dirname(dirname(__DIR__)) . '/mainfile.php';

// Initialize helpers
$helper = Helper::getHelper('mymodule');
$permHelper = new Permission('mymodule');
$session = new Session('mymodule');

// Load language
$helper->loadLanguage('main');

// Get configuration
$itemsPerPage = $helper->getConfig('items_per_page', 10);
$enableComments = $helper->getConfig('enable_comments', true);

// Handle request
$op = Request::getCmd('op', 'list');
$id = Request::getInt('id', 0);

require_once XOOPS_ROOT_PATH . '/header.php';

switch ($op) {
    case 'view':
        // Check permission
        if (!$permHelper->checkPermission('view', $id)) {
            redirect_header($helper->url('index.php'), 3, _NOPERM);
        }

        // Track in session
        $session->set('last_viewed', $id);

        // Get handler and item
        $itemHandler = $helper->getHandler('items');
        $item = $itemHandler->get($id);

        if (!$item) {
            redirect_header($helper->url('index.php'), 3, 'Item not found');
        }

        // Display item
        $xoopsTpl->assign('item', $item->toArray());
        break;

    case 'list':
    default:
        $itemHandler = $helper->getHandler('items');

        $criteria = new CriteriaCompo();
        $criteria->setLimit($itemsPerPage);
        $criteria->setSort('created');
        $criteria->setOrder('DESC');

        $items = $itemHandler->getObjects($criteria);
        $xoopsTpl->assign('items', $items);

        // Show last viewed if exists
        $lastViewed = $session->get('last_viewed', 0);
        if ($lastViewed > 0) {
            $xoopsTpl->assign('last_viewed', $lastViewed);
        }
        break;
}

// Admin link if authorized
if ($helper->isUserAdmin()) {
    $xoopsTpl->assign('admin_url', $helper->url('admin/index.php'));
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```

## AbstractHelper 기본 클래스

모든 XMF 도우미 클래스는 다음을 제공하는 `Xmf\Module\Helper\AbstractHelper`을 확장합니다.

### 생성자

```php
public function __construct($dirname)
```

모듈 디렉터리 이름으로 인스턴스화합니다. 비어 있으면 현재 모듈을 사용합니다.

### 디렉토리 이름()

헬퍼와 연관된 모듈 디렉토리 이름을 반환합니다.

```php
$dirname = $helper->dirname();
```

### 초기화()

모듈이 로드된 후 생성자에 의해 호출됩니다. 초기화 논리에 대한 사용자 지정 도우미를 재정의합니다.

## 사용자 정의 도우미 만들기

모듈별 기능을 위해 도우미를 확장할 수 있습니다.

```php
<?php
// mymodule/class/Helper.php
namespace XoopsModules\Mymodule;

class Helper extends \Xmf\Module\Helper\GenericHelper
{
    public function init()
    {
        // Custom initialization
    }

    public function getItemUrl($id)
    {
        return $this->url('item.php?id=' . $id);
    }

    public function getUploadDirectory()
    {
        $path = $this->uploadPath('');
        if (!is_dir($path)) {
            mkdir($path, 0755, true);
        }
        return $path;
    }
}
```

## 참고 항목

- XMF 시작하기 - 기본 XMF 사용법
- XMF-요청 - 요청 처리
-../Recipes/Permission-Helper - 권한 관리
-../Recipes/Module-Admin-Pages - 관리 인터페이스 생성

---

#xmf #모듈 도우미 #configuration #handlers #session #cache
