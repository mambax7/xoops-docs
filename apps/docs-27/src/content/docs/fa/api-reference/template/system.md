---
title: "سیستم قالب XOOPS"
description: "ادغام هوشمند، کلاس XoopsTpl، متغیرهای قالب، مدیریت تم و رندر قالب"
---
سیستم قالب XOOPS بر روی موتور قدرتمند قالب Smarty ساخته شده است، و یک راه انعطاف پذیر و قابل توسعه برای جدا کردن منطق ارائه از منطق تجاری ارائه می دهد. تم ها، رندر قالب، تخصیص متغیرها و تولید محتوای پویا را مدیریت می کند.

## معماری الگو

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

## کلاس XoopsTpl

کلاس موتور قالب اصلی که Smarty را گسترش می دهد.

### مرور کلی کلاس

```php
namespace XOOPS\Core;

class XoopsTpl extends Smarty
{
    protected array $vars = [];
    protected string $currentTheme = '';
    protected array $blocks = [];
    protected bool $isAdmin = false;
}
```

### گسترش Smarty

```php
use XOOPS\Core\XoopsTpl;

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

### روشهای اصلی

#### getInstance

نمونه قالب singleton را دریافت می کند.

```php
public static function getInstance(): XoopsTpl
```

**بازگشت:** `XoopsTpl` - نمونه Singleton

**مثال:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### اختصاص دهید

متغیری را به قالب اختصاص می دهد.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$tplVar` | رشته\|آرایه | نام متغیر یا آرایه انجمنی |
| `$value` | مخلوط | مقدار متغیر |

**مثال:**
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

#### appendAssign

مقادیری را به متغیرهای آرایه الگو اضافه می کند.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$tplVar` | رشته | نام متغیر |
| `$value` | مخلوط | ارزش افزوده |

**مثال:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

همه متغیرهای قالب اختصاص داده شده را دریافت می کند.

```php
public function getAssignedVars(): array
```

**برگرداندن:** `array` - متغیرهای اختصاص داده شده

**مثال:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

نمایش ####

یک الگو را ارائه می دهد و به مرورگر خروجی می دهد.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$resource` | رشته | مسیر فایل الگو |
| `$cache_id` | رشته\|آرایه | شناسه کش |
| `$compile_id` | رشته | کامپایل شناسه |
| `$parent` | شی | شی الگوی والد |

**مثال:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### واکشی

یک الگو را رندر می کند و به صورت رشته برمی گرداند.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**بازگشت:** `string` - محتوای قالب ارائه شده

**مثال:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### loadTheme

یک موضوع خاص را بارگیری می کند.

```php
public function loadTheme(string $themeName): bool
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$themeName` | رشته | نام دایرکتوری تم |

**بازگشت:** `bool` - موفقیت واقعی

**مثال:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```

#### موضوع فعلی را دریافت کنید

نام تم فعال فعلی را دریافت می کند.

```php
public function getCurrentTheme(): string
```

**بازگشت:** `string` - نام تم

**مثال:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```

#### setOutputFilter

یک فیلتر خروجی برای پردازش خروجی الگو اضافه می کند.

```php
public function setOutputFilter(string $function): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$function` | رشته | نام تابع فیلتر |

**مثال:**
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

#### ثبت پلاگین

یک افزونه Smarty سفارشی را ثبت می کند.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**پارامترها:**

| پارامتر | نوع | توضیحات |
|-----------|------|-------------|
| `$type` | رشته | نوع افزونه (مدیفایر، بلوک، تابع) |
| `$name` | رشته | نام افزونه |
| `$callback` | قابل تماس | تابع برگشت به تماس |

**مثال:**
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

## سیستم تم

### ساختار تم

ساختار دایرکتوری تم استاندارد XOOPS:

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

### کلاس مدیریت تم

```php
namespace XOOPS\Core\Theme;

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

## متغیرهای قالب

### متغیرهای استاندارد جهانی

XOOPS به طور خودکار چندین متغیر الگوی سراسری را اختصاص می دهد:

| متغیر | نوع | توضیحات |
|----------|------|-------------|
| `$xoops_url` | رشته | آدرس نصب XOOPS |
| `$xoops_user` | XoopsUser\|null | شی کاربر فعلی |
| `$xoops_uname` | رشته | نام کاربری فعلی |
| `$xoops_isadmin` | bool | کاربر مدیر |
| `$xoops_banner` | رشته | بنر HTML |
| `$xoops_notification` | رشته | نشانه گذاری اعلان |
| `$xoops_version` | رشته | نسخه XOOPS |

### متغیرهای خاص بلوک

هنگام رندر کردن بلوک ها:| متغیر | نوع | توضیحات |
|----------|------|-------------|
| `$block` | آرایه | مسدود کردن اطلاعات |
| `$block.title` | رشته | عنوان بلوک |
| `$block.content` | رشته | مسدود کردن محتوا |
| `$block.id` | int | شناسه بلاک |
| `$block.module` | رشته | نام ماژول |

### متغیرهای قالب ماژول

ماژول ها معمولاً اختصاص می دهند:

| متغیر | نوع | توضیحات |
|----------|------|-------------|
| `$module_name` | رشته | نام نمایشی ماژول |
| `$module_dir` | رشته | دایرکتوری ماژول |
| `$xoops_module_header` | رشته | ماژول CSS/JS |

## پیکربندی هوشمند

### اصلاح کننده های رایج Smarty

| اصلاح کننده | توضیحات | مثال |
|----------|-------------|---------|
| `capitalize` | بزرگ کردن حرف اول | `{$title\|capitalize}` |
| `count_characters` | تعداد کاراکتر | `{$text\|count_characters}` |
| `date_format` | قالب بندی مهر زمانی | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | فرار از کاراکترهای خاص | `{$html\|escape:'html'}` |
| `nl2br` | تبدیل خطوط جدید به `<br>` | `{$text\|nl2br}` |
| `strip_tags` | حذف تگ های HTML | `{$content\|strip_tags}` |
| `truncate` | محدود کردن طول رشته | `{$text\|truncate:100}` |
| `upper` | تبدیل به حروف بزرگ | `{$name\|upper}` |
| `lower` | تبدیل به حروف کوچک | `{$name\|lower}` |

### ساختارهای کنترلی

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

## نمونه کامل الگو

### کد PHP

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

### فایل الگو (list.tpl)

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

## توابع هوشمند سفارشی

### ایجاد یک عملکرد بلوک سفارشی

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

ثبت نام و استفاده:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

الگو:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## بهترین شیوه ها

1. **Escape Content User** - همیشه از `|escape` برای محتوای تولید شده توسط کاربر استفاده کنید
2. ** از مسیرهای الگو استفاده کنید ** - الگوهای مرجع نسبت به موضوع
3. **منطق را از ارائه جدا کنید** - منطق پیچیده را در PHP حفظ کنید
4. **الگوهای کش** - ذخیره قالب را در تولید فعال کنید
5. ** از Modifiers به درستی استفاده کنید ** - از فیلترهای مناسب برای زمینه استفاده کنید
6. **بلاک ها را سازماندهی کنید** - قالب های بلوک را در فهرست اختصاصی قرار دهید
7. **متغیرهای سند** - همه متغیرهای قالب را در PHP مستند کنید

## مستندات مرتبط

- ../Module/Module-System - سیستم ماژول و قلاب
- ../Kernel/Kernel-Classes - هسته و پیکربندی
- ../Core/XoopsObject - کلاس شی پایه

---

*همچنین ببینید: [اسناد هوشمند](https://www.smarty.net/docs) | [API الگوی XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*