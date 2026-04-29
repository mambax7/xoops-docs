---
title: "Smarty 4 마이그레이션"
description: "XOOPS 템플릿을 Smarty 3에서 Smarty 4로 업그레이드하는 방법 안내"
---

이 가이드에서는 XOOPS에서 Smarty 3에서 Smarty 4로 업그레이드할 때 필요한 변경 사항 및 마이그레이션 단계를 다룹니다. 최신 XOOPS 설치와의 호환성을 유지하려면 이러한 차이점을 이해하는 것이 필수적입니다.

## 관련 문서

- Smarty-기본 - XOOPS의 Smarty 기본 사항
- 테마 개발 - XOOPS 테마 제작
- 템플릿 변수 - 템플릿에서 사용 가능한 변수

## 변경 사항 개요

Smarty 4는 Smarty 3에서 몇 가지 주요 변경 사항을 도입했습니다.

1. 변수 할당 동작이 변경되었습니다.
2. `{php}` 태그가 완전히 제거되었습니다.
3. 캐싱 API 변경
4. 수정자 처리 업데이트
5. 보안정책 변경
6. 더 이상 사용되지 않는 기능이 제거되었습니다.

## 변수 액세스 변경

### 문제

Smarty 2/3에서는 할당된 값에 직접 액세스할 수 있었습니다.

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

Smarty 4에서는 변수가 `Smarty_Variable` 객체로 래핑됩니다.

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### 해결 방법 1: 값 속성에 액세스

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### 해결 방법 2: 호환 모드

PHP에서 호환성 모드를 활성화합니다.

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

이는 Smarty 3과 같은 직접 변수 액세스를 허용합니다.

### 해결 방법 3: 조건부 버전 확인

두 버전 모두에서 작동하는 템플릿 작성:

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### 해결 방법 4: 래퍼 함수

할당을 위한 도우미 함수를 만듭니다.

```php
function smartyAssign($smarty, $name, $value)
{
    if (version_compare($smarty->version, '4.0.0', '>=')) {
        // Smarty 4+ - assign normally, access via ->value in templates
        $smarty->assign($name, $value);
    } else {
        // Smarty 3 - standard assignment
        $smarty->assign($name, $value);
    }
}
```

## {php} 태그 제거

### 문제

Smarty 3+는 보안상의 이유로 `{php}` 태그를 지원하지 않습니다.

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### 해결 방법: Smarty 변수 사용

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### 해결 방법: 로직을 PHP로 이동

복잡한 로직은 템플릿이 아닌 PHP에 있어야 합니다.

```php
// In PHP - do the processing
$catid = $downloads['cid'];
$categoryInfo = getCategoryInfo($catid);

// Assign processed data to template
$GLOBALS['xoopsTpl']->assign('category', $categoryInfo);
```

```smarty
{* In template - just display *}
<h2><{$category.name}></h2>
```

### 솔루션: 맞춤형 플러그인

재사용 가능한 기능을 위해 Smarty 플러그인을 생성하세요.

```php
// /class/smarty/plugins/function.getcategory.php
function smarty_function_getcategory($params, $smarty)
{
    $catId = $params['id'] ?? 0;
    $categoryHandler = xoops_getModuleHandler('category', 'mymodule');
    $category = $categoryHandler->get($catId);

    if ($category) {
        $smarty->assign($params['assign'], $category->toArray());
    }
}
```

```smarty
{* In template *}
<{getcategory id=$cid assign="category"}>
<h2><{$category.name}></h2>
```

## 캐싱 변경 사항

### Smarty 3 캐싱

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 캐싱

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### 캐싱 상수

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### 템플릿에 캐시 없음

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## 수정자 변경 사항

### 문자열 수정자

일부 수정자의 이름이 바뀌거나 더 이상 사용되지 않습니다.

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### 배열 수정자

배열 수정자에는 `@` 접두사가 필요합니다.

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### 맞춤 수정자

사용자 정의 수정자를 등록해야 합니다.

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## 보안 정책 변경 사항

### Smarty 4 보안

Smarty 4는 기본 보안이 더 엄격합니다.

```php
// Configure security policy
$smarty->enableSecurity('Smarty_Security');

// Or create custom policy
class MySecurityPolicy extends Smarty_Security
{
    public $php_functions = ['isset', 'empty', 'count'];
    public $php_modifiers = ['escape', 'count'];
    public $allow_super_globals = false;
}

$smarty->enableSecurity(new MySecurityPolicy($smarty));
```

### 허용되는 기능

기본적으로 Smarty 4는 사용할 수 있는 PHP 함수를 제한합니다.

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

필요한 경우 허용되는 기능을 구성합니다.

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## 템플릿 상속 업데이트

### 블록 구문

블록 구문은 유사하게 유지되지만 몇 가지 변경 사항이 있습니다.

```smarty
{* Parent template *}
<html>
<head>
    {block name=head}
    <title>Default Title</title>
    {/block}
</head>
<body>
    {block name=content}{/block}
</body>
</html>
```

```smarty
{* Child template *}
{extends file="parent.tpl"}

{block name=head}
    {$smarty.block.parent}  {* Include parent block content *}
    <meta name="custom" content="value">
{/block}

{block name=content}
    <h1>My Content</h1>
{/block}
```

### 추가 및 앞에 추가

```smarty
{block name=head append}
    {* This is added after parent content *}
    <link rel="stylesheet" href="extra.css">
{/block}

{block name=scripts prepend}
    {* This is added before parent content *}
    <script src="early.js"></script>
{/block}
```

## 더 이상 사용되지 않는 기능

### Smarty에서 제거됨 4

| 기능 | 대안 |
|---------|-------------|
| `{php}` 태그 | 로직을 PHP로 이동하거나 플러그인을 사용하세요 |
| `{include_php}` | 등록된 플러그인 사용 |
| `$smarty.capture` | 여전히 작동하지만 더 이상 사용되지 않습니다 |
| `{strip}` 공백 포함 | 축소 도구 사용 |

### 대안 사용

```smarty
{* Instead of {php} *}
{* Move to PHP and assign result *}

{* Instead of include_php *}
<{include file="db:mytemplate.tpl"}>

{* Instead of capture (still works but consider) *}
<{capture name="sidebar"}>
    <h3>Sidebar</h3>
<{/capture}>
<div><{$smarty.capture.sidebar}></div>
```

## 마이그레이션 체크리스트

### 마이그레이션 전

1. [ ] 모든 템플릿 백업
2. [ ] `{php}` 태그 사용을 모두 나열합니다.
3. [ ] 사용자 정의 플러그인 문서화
4. [ ] 현재 기능 테스트

### 마이그레이션 중

1. [ ] 모든 `{php}` 태그 제거
2. [ ] 변수 액세스 구문 업데이트
3. [ ] 수정자 사용 확인
4. [ ] 캐싱 구성 업데이트
5. [ ] 보안 설정 검토

### 마이그레이션 후

1. [ ] 모든 템플릿 테스트
2. [ ] 모든 양식이 제대로 작동하는지 확인하세요.
3. [ ] 캐싱이 작동하는지 확인
4. [ ] 다양한 사용자 역할로 테스트

## 호환성 테스트

### 버전 감지

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### 템플릿 버전 확인

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## 상호 호환 가능한 템플릿 작성

### 모범 사례

1. **`{php}` 태그를 완전히 피하세요** - Smarty에서는 작동하지 않습니다. 3+

2. **템플릿을 단순하게 유지** - 복잡한 논리는 PHP에 속합니다

3. **표준 수정자를 사용하세요** - 더 이상 사용되지 않는 수정자를 피하세요.

4. **두 버전 모두에서 테스트** - 두 버전을 모두 지원해야 하는 경우

5. **복잡한 작업에는 플러그인을 사용하세요** - 유지 관리 용이성 향상

### 예: 교차 호환 템플릿

```smarty
{* Works in both Smarty 3 and 4 *}
<!DOCTYPE html>
<html>
<head>
    <title><{$page_title|default:'Default Title'|escape}></title>
</head>
<body>
    <{if isset($items) && $items|@count > 0}>
        <ul>
        <{foreach $items as $item}>
            <li><{$item.name|escape}></li>
        <{/foreach}>
        </ul>
    <{else}>
        <p>No items found.</p>
    <{/if}>
</body>
</html>
```

## 일반적인 마이그레이션 문제

### 문제: 변수가 비어 있음을 반환함

**문제**: `<{$mod_url}>`은 Smarty 4에서 아무것도 반환하지 않습니다.

**해결책**: `<{$mod_url->value}>`을 사용하거나 호환 모드를 활성화하세요.

### 문제: PHP 태그 오류

**문제**: `{php}` 태그에서 템플릿 오류가 발생합니다.

**해결책**: 모든 PHP 태그를 제거하고 로직을 PHP 파일로 이동합니다.

### 문제: 수정자를 찾을 수 없음

**문제**: 맞춤 수정자에서 '알 수 없는 수정자' 오류 발생

**해결책**: `registerPlugin()`으로 수정자를 등록합니다.

### 문제: 보안 제한

**문제**: 템플릿에서 허용되지 않는 기능

**해결책**: 보안 정책의 허용 목록에 기능 추가

---

#smarty #마이그레이션 #업그레이드 #xoops #smarty4 #호환성
