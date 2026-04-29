---
title: “Smarty 4 迁移”
description: “将XOOPS模板从Smarty 3升级到Smarty 4的指南”
---

本指南涵盖了从 XOOPS 中的 Smarty 3 升级到 Smarty 4 时所需的更改和迁移步骤。了解这些差异对于保持与现代 XOOPS 安装的兼容性至关重要。

## 相关文档

- Smarty-Basics - XOOPS中的Smarty的基础知识
- 主题-Development - 创建XOOPS主题
- 模板-Variables - 模板中的可用变量

## 变更概述

Smarty 4 相对于 Smarty 3 引入了多项重大变更：

1.变量赋值行为改变
2. `{php}`标签完全删除
3. 缓存API更改
4. 修改器处理更新
5. 安全策略变更
6. 删除已弃用的功能

## 变量访问更改

### 问题

在Smarty 2/3中，分配的值可以直接访问：

```php
// PHP
$GLOBALS['xoopsTpl']->assign('mod_url', $helper->url());
```

```smarty
{* Smarty 2/3 - worked fine *}
<img src="<{$mod_url}>/assets/images/icon.png">
```

在 Smarty 4 中，变量包装在 `Smarty_Variable` 对象中：

```
Smarty_Variable Object
(
    [value] => http://example.com/modules/mymodule/
    [nocache] =>
)
```

### 解决方案 1：访问 Value 属性

```smarty
{* Smarty 4 - access the value property *}
<img src="<{$mod_url->value}>/assets/images/icon.png">
```

### 解决方案2：兼容模式

在PHP中启用兼容模式：

```php
$smarty = new Smarty();
$smarty->setCompatibilityMode(true);
```

这允许直接变量访问，如Smarty 3。

### 解决方案 3：条件版本检查

编写适用于两个版本的模板：

```smarty
<{if $smarty.version|regex_replace:'[^0-9]':'' >= 4}>
    <{$mod_url->value}>
<{else}>
    <{$mod_url}>
<{/if}>
```

### 解决方案 4：包装函数

创建一个用于分配的辅助函数：

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

## 删除 {php} 标签

### 问题

出于安全原因，Smarty 3+ 不支持 `{php}` 标签：

```smarty
{* This NO LONGER works in Smarty 3+ *}
<{assign var="cid" value=$downloads.cid}>
<{php}>
    $catid = $this->get_template_vars('cid');
<{/php}>
```

### 解决方案：使用Smarty变量

```smarty
{* Use Smarty's built-in variable access *}
<{assign var="cid" value=$downloads.cid}>
<{assign var="catid" value=$smarty.template_vars.cid}>
```

### 解决方案：将逻辑移至PHP

复杂的逻辑应该在 PHP 中，而不是模板中：

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

### 解决方案：自定义插件

对于可重用的功能，创建 Smarty 插件：

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

## 缓存更改

### Smarty 3 缓存

```php
// Smarty 3 style
$smarty->caching = true;
$smarty->cache_lifetime = 3600;
$smarty->cache_dir = '/path/to/cache';

// Per-variable nocache
$xoopsTpl->tpl_vars["mod_url"]->nocache = false;
```

### Smarty 4 缓存

```php
// Smarty 4 style
$smarty->setCaching(Smarty::CACHING_LIFETIME_CURRENT);
$smarty->setCacheLifetime(3600);
$smarty->setCacheDir('/path/to/cache');

// Or using properties (still works)
$smarty->caching = Smarty::CACHING_LIFETIME_CURRENT;
$smarty->cache_lifetime = 3600;
```

### 缓存常量

```php
// Caching modes
Smarty::CACHING_OFF                  // No caching
Smarty::CACHING_LIFETIME_CURRENT     // Use cache_lifetime
Smarty::CACHING_LIFETIME_SAVED       // Use cached lifetime
```

### 模板中没有缓存

```smarty
{* Mark content as never cached *}
<{nocache}>
    <p>Current time: <{$smarty.now|date_format:"%H:%M:%S"}></p>
<{/nocache}>
```

## 修饰符更改

### 字符串修饰符

一些修饰符被重命名或弃用：

```smarty
{* Smarty 3 *}
<{$text|escape:'htmlall'}>

{* Smarty 4 - use 'html' instead *}
<{$text|escape:'html'}>
```

### 数组修饰符

数组修饰符需要 `@` 前缀：

```smarty
{* Count array elements *}
<{$items|@count}> items

{* Join array *}
<{$tags|@implode:', '}>

{* JSON encode *}
<{$data|@json_encode}>
```

### 自定义修饰符

必须注册自定义修饰符：

```php
// Register a custom modifier
$smarty->registerPlugin('modifier', 'my_modifier', 'my_modifier_function');

function my_modifier_function($string, $param1 = 'default')
{
    // Process and return
    return processed_string($string, $param1);
}
```

## 安全策略变更

### Smarty 4 安全

Smarty 4 具有更严格的默认安全性：

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

### 允许的功能

默认情况下，Smarty 4 限制可以使用哪些 PHP 函数：

```smarty
{* These may be restricted *}
<{if isset($variable)}>
<{if empty($array)}>
<{$array|@count}>
```

如果需要，配置允许的功能：

```php
$smarty->security_policy->php_functions = [
    'isset', 'empty', 'count', 'sizeof',
    'in_array', 'is_array', 'date', 'time'
];
```

## 模板继承更新

### 区块语法

区块语法保持相似，但有一些变化：

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

### 追加和前置

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

## 已弃用的功能

### 在 Smarty 4 中删除

|特色|另类|
|---------|-------------|
| `{php}`标签|将逻辑移至 PHP 或使用插件 |
| `{include_php}` |使用注册的插件 |
| `$smarty.capture` |仍然有效但已弃用 |
| `{strip}` 带空格|使用缩小工具 |

### 使用替代方案

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

## 迁移清单

### 迁移之前

1. [ ] 备份所有模板
2. [ ] 列出所有`{php}`标签的用法
3. [ ] 记录自定义插件
4. [ ] 测试当前功能

### 迁移期间

1. [ ] 删除所有`{php}`标签
2. [ ] 更新变量访问语法
3. [ ] 检查修饰符使用情况
4. [ ]更新缓存配置
5. [ ] 检查安全设置

### 迁移后

1. [ ] 测试所有模板
2. [ ]检查所有表格工作
3. [ ] 验证缓存是否有效
4. [ ]使用不同用户角色进行测试

## 兼容性测试

### 版本检测

```php
// Check Smarty version in PHP
$version = Smarty::SMARTY_VERSION;

if (version_compare($version, '4.0.0', '>=')) {
    // Smarty 4+ specific code
} else {
    // Smarty 3 code
}
```

### 模板版本检查

```smarty
{* Check version in template *}
<{assign var="smarty_major" value=$smarty.version|regex_replace:'/\\..*$/':''}>

<{if $smarty_major >= 4}>
    {* Smarty 4+ template code *}
<{else}>
    {* Smarty 3 template code *}
<{/if}>
```

## 书写十字-Compatible 模板

### 最佳实践

1. **完全避免使用 `{php}` 标签** - 它们在 Smarty 3+ 中不起作用

2. **保持模板简单** - 复杂逻辑属于PHP3. **使用标准修饰符** - 避免弃用的修饰符

4. **在两个版本中进行测试** - 如果您需要同时支持两个版本

5. **使用插件进行复杂操作** - 更易于维护

### 示例：Cross-Compatible 模板

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

## 常见迁移问题

### 问题：变量返回空

**问题**：`<{$mod_url}>` 在 Smarty 4 中没有返回任何内容

**解决方案**：使用`<{$mod_url->value}>`或启用兼容模式

### 问题：PHP 标签错误

**问题**：模板在 `{php}` 标签上引发错误

**解决方案**：删除所有 PHP 标签并将逻辑移至 PHP 文件

### 问题：未找到修饰符

**问题**：自定义修饰符抛出“未知修饰符”错误

**解决方案**：使用 `registerPlugin()` 注册修饰符

### 问题：安全限制

**问题**：模板中不允许使用函数

**解决方案**：将功能添加到安全策略的允许列表中

---

#smarty#迁移#升级#XOOPS#smarty4#compatibility