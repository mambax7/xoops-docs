---
title: "모듈 FAQ"
description: "XOOPS 모듈에 대해 자주 묻는 질문"
---

# 모듈 자주 묻는 질문

> XOOPS 모듈, 설치, 관리에 대한 일반적인 질문과 답변입니다.

---

## 설치 및 활성화

### Q: XOOPS에 모듈을 어떻게 설치하나요?

**답:**
1. 모듈 zip 파일을 다운로드합니다.
2. XOOPS 관리자 > 모듈 > 모듈 관리로 이동합니다.
3. "찾아보기"를 클릭하고 zip 파일을 선택하세요.
4. '업로드'를 클릭하세요.
5. 모듈이 목록에 나타납니다(일반적으로 비활성화됨).
6. 활성화 아이콘을 클릭하여 활성화하세요.

또는 `/xoops_root/modules/`에 직접 zip 압축을 풀고 관리자 패널로 이동하세요.

---

### Q: "권한이 거부되었습니다"로 인해 모듈 업로드가 실패합니다.

**답:** 파일 권한 문제입니다.

```bash
# Fix module directory permissions
chmod 755 /path/to/xoops/modules

# Fix upload directory (if uploading)
chmod 777 /path/to/xoops/uploads

# Fix ownership if needed
chown -R www-data:www-data /path/to/xoops
```

자세한 내용은 모듈 설치 실패를 참조하십시오.

---

### Q: 설치 후 관리자 패널에서 모듈을 볼 수 없는 이유는 무엇입니까?

**답:** 다음을 확인하세요.

1. **모듈이 활성화되지 않음** - 모듈 목록에서 눈 아이콘을 클릭합니다.
2. **관리자 페이지 누락** - 모듈에는 xoopsversion.php에 `hasAdmin = 1`이 있어야 합니다.
3. **언어 파일 누락** - `language/english/admin.php` 필요
4. **캐시가 지워지지 않음** - 캐시를 지우고 브라우저를 새로 고칩니다.

```bash
# Clear XOOPS cache
rm -rf /path/to/xoops/xoops_data/caches/*
```

---

### 질문: 모듈을 어떻게 제거하나요?

**답:**
1. XOOPS 관리자 > 모듈 > 모듈 관리로 이동합니다.
2. 모듈 비활성화(눈 아이콘 클릭)
3. 휴지통/삭제 아이콘을 클릭하세요.
4. 완전히 제거하려면 모듈 폴더를 수동으로 삭제하십시오.

```bash
rm -rf /path/to/xoops/modules/modulename
```

---

## 모듈 관리

### 질문: 비활성화와 제거의 차이점은 무엇입니까?

**답:**
- **비활성화**: 모듈을 비활성화합니다(눈 아이콘 클릭). 데이터베이스 테이블은 남아 있습니다.
- **제거**: 모듈을 제거합니다. 데이터베이스 테이블을 삭제하고 목록에서 제거합니다.

실제로 제거하려면 폴더도 삭제하십시오.
```bash
rm -rf modules/modulename
```

---

### Q: 모듈이 제대로 설치되었는지 어떻게 확인하나요?

**답:** 디버그 스크립트를 사용하세요.

```php
<?php
// Create admin/debug_modules.php
require_once XOOPS_ROOT_PATH . '/mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

echo "<h1>Module Debug</h1>";

// List all modules
$module_handler = xoops_getHandler('module');
$modules = $module_handler->getObjects();

foreach ($modules as $module) {
    echo "<h2>" . $module->getVar('name') . "</h2>";
    echo "Status: " . ($module->getVar('isactive') ? "Active" : "Inactive") . "<br>";
    echo "Directory: " . $module->getVar('dirname') . "<br>";
    echo "Mid: " . $module->getVar('mid') . "<br>";
    echo "Version: " . $module->getVar('version') . "<br>";
}
?>
```

---

### 질문: 동일한 모듈의 여러 버전을 실행할 수 있나요?

**A:** 아니요, XOOPS는 이를 기본적으로 지원하지 않습니다. 그러나 다음을 수행할 수 있습니다.

1. `mymodule` 및 `mymodule2`과 같은 다른 디렉터리 이름으로 복사본을 만듭니다.
2. 두 모듈의 xoopsversion.php에서 dirname을 업데이트합니다.
3. 고유한 데이터베이스 테이블 이름을 확인하세요.

동일한 코드를 공유하므로 권장되지 않습니다.

---

## 모듈 구성

### Q: 모듈 설정은 어디서 구성하나요?

**답:**
1. XOOPS 관리자 > 모듈로 이동합니다.
2. 모듈 옆에 있는 설정/기어 아이콘을 클릭합니다.
3. 기본 설정 구성

설정은 `xoops_config` 테이블에 저장됩니다.

**코드로 액세스:**
```php
<?php
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('modulename');
$config_handler = xoops_getHandler('config');
$settings = $config_handler->getConfigsByCat(0, $module->mid());

foreach ($settings as $setting) {
    echo $setting->getVar('conf_name') . ": " . $setting->getVar('conf_value');
}
?>
```

---

### Q: 모듈 구성 옵션을 어떻게 정의합니까?

**답:** xoopsversion.php에서:

```php
<?php
$modversion['config'] = [
    [
        'name' => 'items_per_page',
        'title' => '_AM_MYMODULE_ITEMS_PER_PAGE',
        'description' => '_AM_MYMODULE_ITEMS_PER_PAGE_DESC',
        'formtype' => 'text',
        'valuetype' => 'int',
        'default' => 10
    ],
    [
        'name' => 'enable_feature',
        'title' => '_AM_MYMODULE_ENABLE_FEATURE',
        'description' => '_AM_MYMODULE_ENABLE_FEATURE_DESC',
        'formtype' => 'yesno',
        'valuetype' => 'bool',
        'default' => 1
    ]
];
?>
```

---

## 모듈 기능

### Q: 내 모듈에 관리 페이지를 어떻게 추가하나요?

**답:** 구조를 만듭니다.

```
modules/mymodule/
├── admin/
│   ├── index.php
│   ├── menu.php
│   └── menu_en.php
```

xoopsversion.php에서:
```php
<?php
$modversion['hasAdmin'] = 1;
$modversion['adminindex'] = 'admin/index.php';
?>
```

`admin/index.php` 생성:
```php
<?php
require_once XOOPS_ROOT_PATH . '/kernel/admin.php';

xoops_cp_header();
echo "<h1>Module Administration</h1>";
xoops_cp_footer();
?>
```

---

### Q: 내 모듈에 검색 기능을 어떻게 추가하나요?

**답:**
1. xoopsversion.php에서 설정합니다:
```php
<?php
$modversion['hasSearch'] = 1;
$modversion['search'] = 'search.php';
?>
```

2. `search.php` 생성:
```php
<?php
function mymodule_search($queryArray, $andor, $limit, $offset) {
    // Search implementation
    $results = [];
    return $results;
}
?>
```

---

### Q: 내 모듈에 알림을 어떻게 추가하나요?

**답:**
1. xoopsversion.php에서 설정합니다:
```php
<?php
$modversion['hasNotification'] = 1;
$modversion['notification_categories'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
$modversion['notifications'] = [
    ['name' => 'item_published', 'title' => '_NOT_ITEM_PUBLISHED']
];
?>
```

2. 코드에서 알림을 트리거합니다.
```php
<?php
$notification_handler = xoops_getHandler('notification');
$notification_handler->triggerEvent(
    'item_published',
    $item_id,
    'Item published',
    'description'
);
?>
```

---

## 모듈 권한

### Q: 모듈 권한은 어떻게 설정하나요?

**답:**
1. XOOPS 관리자 > 모듈 > 모듈 권한으로 이동합니다.
2. 모듈을 선택하세요
3. 사용자/그룹 및 권한 수준을 선택하세요.
4. 저장

**코드:**
```php
<?php
// Check if user can access module
if (!xoops_isUser()) {
    exit('Login required');
}

// Check specific permission
$mperm_handler = xoops_getHandler('member_permission');
$module_handler = xoops_getHandler('module');
$module = $module_handler->getByDirname('mymodule');

if (!$mperm_handler->userCanAccess($module->mid())) {
    exit('Access denied');
}
?>
```

---

## 모듈 데이터베이스

### Q: 모듈 데이터베이스 테이블은 어디에 저장되어 있나요?

**A:** 기본 XOOPS 데이터베이스에 있는 모든 내용은 테이블 접두사가 붙습니다(일반적으로 `xoops_`).

```bash
# List all module tables
mysql> SHOW TABLES LIKE 'xoops_mymodule_%';

# Or in PHP
<?php
$result = $GLOBALS['xoopsDB']->query(
    "SHOW TABLES LIKE '" . XOOPS_DB_PREFIX . "mymodule_%'"
);
while ($row = $result->fetch_assoc()) {
    print_r($row);
}
?>
```

---

### Q: 모듈 데이터베이스 테이블을 어떻게 업데이트합니까?

**답:** 모듈에서 업데이트 스크립트를 만듭니다.

```php
<?php
// modules/mymodule/update.php
require_once '../../mainfile.php';

if (!is_object($xoopsUser) || !$xoopsUser->isAdmin()) {
    exit('Admin only');
}

// Add new column
$sql = "ALTER TABLE `" . XOOPS_DB_PREFIX . "mymodule_items`
        ADD COLUMN `new_field` VARCHAR(255)";

if ($GLOBALS['xoopsDB']->query($sql)) {
    echo "✓ Updated successfully";
} else {
    echo "✗ Error: " . $GLOBALS['xoopsDB']->error;
}
?>
```

---

## 모듈 종속성

### Q: 필수 모듈이 설치되어 있는지 어떻게 확인하나요?

**답:**
```php
<?php
$module_handler = xoops_getHandler('module');

// Check if a module exists
$module = $module_handler->getByDirname('required_module');

if (!$module || !$module->getVar('isactive')) {
    die('Error: required_module is not installed or active');
}
?>
```

---

### 질문: 모듈이 다른 모듈에 종속될 수 있나요?

**A:** 예, xoopsversion.php에서 선언하세요.

```php
<?php
$modversion['dependencies'] = [
    [
        'dirname' => 'required_module',
        'version_min' => '1.0',
        'version_max' => 0,  // 0 = unlimited
        'order' => 1
    ]
];
?>
```

---

## 문제 해결

### 질문: 모듈이 목록에 표시되지만 활성화되지 않습니다.

**답:** 확인:
1. xoopsversion.php 구문 - PHP 린터 사용:
```bash
php -l modules/mymodule/xoopsversion.php
```

2. 데이터베이스 SQL 파일:
```bash
# Check SQL syntax
grep -n "CREATE TABLE" modules/mymodule/sql/mysql.sql
```

3. 언어 파일:
```bash
ls -la modules/mymodule/language/english/
```

자세한 진단은 모듈 설치 실패를 참조하십시오.

---

### Q: 모듈이 활성화되었지만 기본 사이트에 표시되지 않습니다.

**답:**
1. xoopsversion.php에서 `hasMain = 1`을 설정합니다:
```php
<?php
$modversion['hasMain'] = 1;
$modversion['main_file'] = 'index.php';
?>
```

2. `modules/mymodule/index.php` 생성:
```php
<?php
require_once '../../mainfile.php';
include_once XOOPS_ROOT_PATH . '/header.php';

echo "Welcome to my module";

include_once XOOPS_ROOT_PATH . '/footer.php';
?>
```

---

### Q: 모듈이 "백색 화면"을 유발합니다.

**답:** 오류를 찾으려면 디버깅을 활성화하세요.

```php
<?php
// In mainfile.php
error_reporting(E_ALL);
ini_set('display_errors', '1');
define('XOOPS_DEBUG_LEVEL', 2);
?>
```

오류 로그를 확인하십시오.
```bash
tail -100 /var/log/php/error.log
tail -100 /var/log/apache2/error.log
```

해결 방법은 White Screen of Death를 참조하세요.

---

## 성능

### Q: 모듈이 느린데 어떻게 최적화하나요?

**답:**
1. **데이터베이스 쿼리 확인** - 쿼리 로깅 사용
2. **캐시 데이터** - XOOPS 캐시 사용:
```php
<?php
$cache = xoops_cache_handler::getInstance();
$data = $cache->read('mykey');
if ($data === false) {
    $data = expensive_operation();
    $cache->write('mykey', $data, 3600);  // 1 hour
}
?>
```

3. **템플릿 최적화** - 템플릿의 루프 방지
4. **PHP opcode 캐시 활성화** - APCu, XDebug 등

자세한 내용은 성능 FAQ를 참조하세요.

---

## 모듈 개발

### Q: 모듈 개발 문서는 어디에서 찾을 수 있나요?

**답:** 참조:
- 모듈 개발 가이드
- 모듈 구조
- 첫 번째 모듈 만들기

---

## 관련 문서

- 모듈 설치 실패
- 모듈 구조
- 성능 FAQ
- 디버그 모드 활성화

---

#xoops #모듈 #faq #문제 해결
