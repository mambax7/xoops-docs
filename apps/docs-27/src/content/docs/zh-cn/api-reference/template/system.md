---
title: “XOOPS模板系统”
description: “Smarty集成、XOOPSTpl类、模板变量、主题管理和模板渲染”
---

XOOPS模板系统建立在强大的Smarty模板引擎之上，提供了一种灵活且可扩展的方式来将表示逻辑与业务逻辑分开。它管理主题、模板渲染、变量分配和动态内容生成。

## 模板架构

```mermaid
graph TD
    A[XoopsTpl] -->|extends| B[Smarty]
    A -->|manages| C[Themes]
    A -->|manages| D[Template Variables]
    A -->|handles| E[Block Rendering]

    C -->|contains| F[Templates]
    C -->|contains| G[CSS/JS]
    C -->|contains| H[Images]

    I[Theme Manager] -->|loads| C
    I -->|applies| J[Active Theme]
    I -->|configures| K[Template Paths]

    L[Block System] -->|uses| A
    M[Module Templates] -->|uses| A
    N[Admin Templates] -->|uses| A
```

## XOOPSTpl 类

扩展Smarty的主模板引擎类。

### 班级概览

```php
namespace Xoops\Core;

class XoopsTpl extends Smarty
{
    protected array $vars = [];
    protected string $currentTheme = '';
    protected array $blocks = [];
    protected bool $isAdmin = false;
}
```

### 扩展Smarty

```php
use Xoops\Core\XoopsTpl;

class XoopsTpl extends Smarty
{
    private static ?XoopsTpl $instance = null;

    private function __construct()
    {
        parent::__construct();
        $this->configureDirectories();
        $this->registerPlugins();
    }

    public static function getInstance(): XoopsTpl
    {
        if (!isset(self::$instance)) {
            self::$instance = new self();
        }
        return self::$instance;
    }
}
```

### 核心方法

#### 获取实例

获取单例模板实例。

```php
public static function getInstance(): XoopsTpl
```

**返回：** `XOOPSTpl` - 单例实例

**示例：**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### 分配

将变量分配给模板。

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$tplVar` |字符串\|数组|变量名或关联数组 |
| `$value` |混合 |变量值|

**示例：**
```php
$xoopsTpl->assign('page_title', 'Welcome');
$xoopsTpl->assign('user_name', 'John Doe');

// Multiple assignments
$xoopsTpl->assign([
    'items' => $items,
    'total_count' => count($items),
    'show_pagination' => true
]);
```

#### 追加分配

将值附加到模板数组变量。

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$tplVar` |字符串|变量名 |
| `$value` |混合 |要附加的值 |

**示例：**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### 获取分配变量

获取所有指定的模板变量。

```php
public function getAssignedVars(): array
```

**返回：** `array` - 分配的变量

**示例：**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

####显示

渲染模板并输出到浏览器。

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$resource` |字符串|模板文件路径 |
| `$cache_id`|字符串\|数组|缓存标识符|
| `$compile_id` |字符串|编译标识符 |
| `$parent` |对象|父模板对象|

**示例：**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### 获取

渲染模板并以字符串形式返回。

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**返回：** `string` - 渲染的模板内容

**示例：**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### 加载主题

加载特定主题。

```php
public function loadTheme(string $themeName): bool
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$themeName` |字符串|主题目录名称|

**返回：** `bool` - 成功则为真

**示例：**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### 获取当前主题

获取当前活动主题的名称。

```php
public function getCurrentTheme(): string
```

**返回：** `string` - 主题名称

**示例：**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### 设置输出过滤器

添加输出过滤器来处理模板输出。

```php
public function setOutputFilter(string $function): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$function` |字符串|过滤函数名称|

**示例：**
```php
// Remove whitespace from output
$xoopsTpl->setOutputFilter('trim');

// Custom filter
function my_output_filter($output) {
    // Minify HTML
    $output = preg_replace('/\s+/', ' ', $output);
    return trim($output);
}
$xoopsTpl->setOutputFilter('my_output_filter');
```

#### 注册插件

注册自定义Smarty插件。

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**参数：**

|参数|类型 |描述 |
|------------|------|-------------|
| `$type` |字符串|插件类型（修饰符、区块、函数）|
| `$name` |字符串|插件名称 |
| `$callback` |可调用|回调函数|

**示例：**
```php
// Register custom modifier
$xoopsTpl->registerPlugin('modifier', 'markdown', function($text) {
    return markdown_parse($text);
});

// Use in template: {$content|markdown}

// Register custom block tag
$xoopsTpl->registerPlugin('block', 'permission', function($params, $content, $smarty, &$repeat) {
    if ($repeat) return;

    // Check permission
    if (has_permission($params['name'])) {
        return $content;
    }
    return '';
});

// Use in template: {permission name="admin"}...{/permission}
```

## 主题系统

### 主题结构

标准XOOPS主题目录结构：

```
bluemoon/
├── style.css              # Main stylesheet
├── admin.css              # Admin stylesheet
├── theme.html             # Main page template
├── admin.html             # Admin page template
├── blocks/                # Block templates
│   ├── block_left.tpl
│   └── block_right.tpl
├── modules/               # Module templates
│   ├── publisher/
│   │   ├── index.tpl
│   │   └── item.tpl
│   └── news/
│       └── index.tpl
├── images/                # Theme images
│   ├── logo.png
│   └── banner.png
├── js/                    # Theme JavaScript
│   └── script.js
└── readme.txt             # Theme documentation
```

### 主题管理器类

```php
namespace Xoops\Core\Theme;

class ThemeManager
{
    protected array $themes = [];
    protected string $activeTheme = '';
    protected string $themeDirectory = '';

    public function getActiveTheme(): string {}
    public function setActiveTheme(string $theme): bool {}
    public function getThemeList(): array {}
    public function themeExists(string $name): bool {}
}
```

## 模板变量

### 标准全局变量

XOOPS自动分配几个全局模板变量：

|变量|类型 |描述 |
|----------|------|-------------|
| `$XOOPS_url` |字符串| XOOPS安装URL|
| `$XOOPS_user` | XOOPSUser\|null |当前用户对象 |
| `$XOOPS_uname` |字符串|当前用户名|
| `$XOOPS_isadmin` |布尔 |用户是管理员 |
| `$XOOPS_banner` |字符串|横幅HTML |
| `$XOOPS_notification` |字符串|通知标记|
| `$XOOPS_version`|字符串| XOOPS版本|

### 区块-Specific变量

渲染区块时：|变量|类型 |描述 |
|----------|------|-------------|
| `$block` |数组|区区块信息|
| `$block.title` |字符串|区区块标题 |
| `$block.content` |字符串|阻止内容 |
| `$block.id`|整数 |区块 ID |
| `$block.module` |字符串|模区块名称|

### 模区块模板变量

模区块通常分配：

|变量|类型 |描述 |
|----------|------|-------------|
| `$module_name` |字符串|模区块显示名称 |
| `$module_dir` |字符串|模区块目录|
| `$XOOPS_module_header`|字符串|模区块CSS/JS |

## Smarty 配置

### 常见Smarty修饰符

|修改器|描述 |示例|
|----------|-------------|---------|
| `capitalize` |首字母大写 | `{$title\|capitalize}` |
| `count_characters` |字符数 | `{$text\|count_characters}` |
| `date_format` |格式时间戳 | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` |转义特殊字符 | `{$html\|escape:'html'}`|
| `nl2br` |将换行符转换为 `<br>` | `{$text\|nl2br}`|
| `strip_tags` |删除 HTML 标签 | `{$content\|strip_tags}` |
| `truncate` |限制字符串长度 | `{$text\|truncate:100}` |
| `upper`|转换为大写 | `{$name\|upper}`|
| `lower`|转换为小写 | `{$name\|lower}` |

### 控制结构

```smarty
{* If statement *}
{if $user->isAdmin()}
    <p>Admin content</p>
{else}
    <p>User content</p>
{/if}

{* For loop *}
{foreach $items as $item}
    <div class="item">{$item.title}</div>
{/foreach}

{* For loop with counter *}
{foreach $items as $item name=item_loop}
    {$smarty.foreach.item_loop.iteration}: {$item.title}
{/foreach}

{* While loop *}
{while $condition}
    <!-- content -->
{/while}

{* Switch statement *}
{switch $status}
    {case 'draft'}<span class="draft">Draft</span>{break}
    {case 'published'}<span class="published">Published</span>{break}
    {default}<span class="unknown">Unknown</span>
{/switch}
```

## 完整的模板示例

### PHP 代码

```php
<?php
/**
 * Module Article List Page
 */

include __DIR__ . '/include/common.inc.php';

$xoopsTpl = XoopsTpl::getInstance();

// Check if module is active
$module = xoops_getModuleByDirname('articles');
if (!$module) {
    redirect_header(XOOPS_URL, 3, 'Module not found');
}

// Get item handler
$itemHandler = xoops_getModuleHandler('item', 'articles');

// Get pagination parameters
$page = !empty($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = $module->getConfig('items_per_page') ?: 10;
$offset = ($page - 1) * $perPage;

// Build criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->setSort('published', 'DESC');
$criteria->setLimit($perPage);
$criteria->setStart($offset);

// Fetch items
$items = $itemHandler->getObjects($criteria);
$total = $itemHandler->getCount(new Criteria('status', 1));

// Calculate pagination
$pages = ceil($total / $perPage);

// Assign template variables
$xoopsTpl->assign([
    'module_name' => $module->getName(),
    'items' => $items,
    'total_items' => $total,
    'current_page' => $page,
    'total_pages' => $pages,
    'items_per_page' => $perPage,
    'show_pagination' => $pages > 1
]);

// Add breadcrumbs
$xoopsTpl->assign('xoops_breadcrumbs', [
    ['url' => XOOPS_URL, 'title' => 'Home'],
    ['url' => $module->getUrl(), 'title' => $module->getName()],
    ['title' => 'Articles']
]);

// Display template
$xoopsTpl->display($module->getPath() . '/templates/user/list.tpl');
```

### 模板文件 (list.tpl)

```smarty
<div id="articles-list">
    <h1>{$module_name|escape}</h1>

    {if $items}
        <div class="articles-container">
            {foreach $items as $item}
                <article class="article-item">
                    <header>
                        <h2>
                            <a href="{$item.url|escape}">
                                {$item.title|escape}
                            </a>
                        </h2>
                        <div class="meta">
                            <span class="author">By {$item.author|escape}</span>
                            <span class="date">
                                {$item.published|date_format:'%B %d, %Y'}
                            </span>
                        </div>
                    </header>

                    <div class="content">
                        <p>{$item.summary|truncate:150}</p>
                    </div>

                    <footer>
                        <a href="{$item.url|escape}" class="read-more">
                            Read More »
                        </a>
                    </footer>
                </article>
            {/foreach}
        </div>

        {* Pagination *}
        {if $show_pagination}
            <nav class="pagination">
                {if $current_page > 1}
                    <a href="?page=1" class="first">« First</a>
                    <a href="?page={$current_page - 1}" class="prev">‹ Previous</a>
                {/if}

                {for $i=1 to $total_pages}
                    {if $i == $current_page}
                        <span class="current">{$i}</span>
                    {else}
                        <a href="?page={$i}">{$i}</a>
                    {/if}
                {/for}

                {if $current_page < $total_pages}
                    <a href="?page={$current_page + 1}" class="next">Next ›</a>
                    <a href="?page={$total_pages}" class="last">Last »</a>
                {/if}
            </nav>
        {/if}
    {else}
        <p class="no-items">No articles found.</p>
    {/if}
</div>
```

## 自定义Smarty函数

### 创建自定义区块函数

```php
<?php
/**
 * Custom Smarty block function for permission checking
 */

function smarty_block_permission($params, $content, $smarty, &$repeat)
{
    if ($repeat) return;

    if (!isset($params['name'])) {
        return 'Permission name required';
    }

    $permName = $params['name'];
    $user = $GLOBALS['xoopsUser'];

    // Check if user has permission
    if ($user && $user->isAdmin()) {
        return $content;
    }

    if ($user && check_user_permission($user->uid(), $permName)) {
        return $content;
    }

    return '';
}
```

注册并使用：

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

模板：

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## 最佳实践

1. **转义用户内容** - 始终对用户-generated内容使用`|escape`
2. **使用模板路径** - 与主题相关的参考模板
3. **将逻辑与表示分离** - 将复杂逻辑保留在PHP中
4. **缓存模板** - 在生产中启用模板缓存
5. **正确使用修饰符** - 针对上下文应用适当的过滤器
6. **组织区块** - 将区块模板放置在专用目录中
7. **文档变量** - 在PHP中记录所有模板变量

## 相关文档

- ../Module/Module-System - 模区块系统和挂钩
- ../Kernel/Kernel-Classes - 内核和配置
- ../Core/XOOPSObject - 基础对象类

---

*另请参阅：[Smarty Documentation](https://www.smarty.net/docs) | [XOOPS Template API](https://github.com/XOOPS/XOOPSCore27/tree/master/htdocs/class)*