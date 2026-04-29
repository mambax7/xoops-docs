---
title: "XOOPS ระบบเทมเพลต"
description: "การบูรณาการอย่างชาญฉลาด คลาส XoopsTpl ตัวแปรเทมเพลต การจัดการธีม และการเรนเดอร์เทมเพลต"
---
XOOPS Template System สร้างขึ้นจากกลไกเทมเพลต Smarty อันทรงพลัง ซึ่งมอบวิธีที่ยืดหยุ่นและขยายได้เพื่อแยกตรรกะการนำเสนอออกจากตรรกะทางธุรกิจ จัดการธีม การเรนเดอร์เทมเพลต การกำหนดตัวแปร และการสร้างเนื้อหาแบบไดนามิก

## สถาปัตยกรรมเทมเพลต
```
mermaid
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
## คลาส XoopsTpl

คลาสเอ็นจิ้นเทมเพลตหลักที่ขยาย Smarty

### ภาพรวมชั้นเรียน
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
### ขยายความอย่างชาญฉลาด
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
### วิธีการหลัก

#### รับอินสแตนซ์

รับอินสแตนซ์เทมเพลตซิงเกิล
```php
public static function getInstance(): XoopsTpl
```
**ผลตอบแทน:** `XoopsTpl` - อินสแตนซ์ซิงเกิลตัน

**ตัวอย่าง:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```
#### มอบหมาย

กำหนดตัวแปรให้กับเทมเพลต
```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$tplVar` | สตริง\|อาร์เรย์ | ชื่อตัวแปรหรืออาเรย์แบบเชื่อมโยง |
| `$value` | ผสม | ค่าตัวแปร |

**ตัวอย่าง:**
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
#### ผนวกมอบหมาย

ผนวกค่าเข้ากับตัวแปรอาร์เรย์เทมเพลต
```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$tplVar` | สตริง | ชื่อตัวแปร |
| `$value` | ผสม | ค่าที่จะต่อท้าย |

**ตัวอย่าง:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```
#### getAssignedVars

รับตัวแปรเทมเพลตที่กำหนดทั้งหมด
```php
public function getAssignedVars(): array
```
**ผลตอบแทน:** `array` - ตัวแปรที่กำหนด

**ตัวอย่าง:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```
#### จอแสดงผล

เรนเดอร์เทมเพลตและส่งออกไปยังเบราว์เซอร์
```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$resource` | สตริง | เส้นทางไฟล์เทมเพลต |
| `$cache_id` | สตริง\|อาร์เรย์ | ตัวระบุแคช |
| `$compile_id` | สตริง | ตัวระบุการคอมไพล์ |
| `$parent` | วัตถุ | ออบเจ็กต์เทมเพลตหลัก |

**ตัวอย่าง:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```
#### เอามา.

แสดงผลเทมเพลตและส่งกลับเป็นสตริง
```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```
**ผลตอบแทน:** `string` - เนื้อหาเทมเพลตที่แสดงผล

**ตัวอย่าง:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```
#### โหลดธีม

โหลดธีมเฉพาะ
```php
public function loadTheme(string $themeName): bool
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$themeName` | สตริง | ชื่อไดเร็กทอรีธีม |

**ผลตอบแทน:** `bool` - จริงเมื่อประสบความสำเร็จ

**ตัวอย่าง:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```
#### รับธีมปัจจุบัน

รับชื่อของธีมที่ใช้งานอยู่ในปัจจุบัน
```php
public function getCurrentTheme(): string
```
**ผลตอบแทน:** `string` - ชื่อธีม

**ตัวอย่าง:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```
#### setOutputFilter

เพิ่มตัวกรองเอาต์พุตเพื่อประมวลผลเอาต์พุตเทมเพลต
```php
public function setOutputFilter(string $function): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$function` | สตริง | ชื่อฟังก์ชันตัวกรอง |

**ตัวอย่าง:**
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
#### ลงทะเบียนปลั๊กอิน

ลงทะเบียนปลั๊กอิน Smarty แบบกำหนดเอง
```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```
**พารามิเตอร์:**

| พารามิเตอร์ | พิมพ์ | คำอธิบาย |
|-----------|-|-------------|
| `$type` | สตริง | ประเภทปลั๊กอิน (ตัวแก้ไข บล็อก ฟังก์ชัน) |
| `$name` | สตริง | ชื่อปลั๊กอิน |
| `$callback` | โทรได้ | ฟังก์ชั่นโทรกลับ |

**ตัวอย่าง:**
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
## ระบบธีม

### โครงสร้างธีม

โครงสร้างไดเร็กทอรีธีม XOOPS มาตรฐาน:
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
### คลาสผู้จัดการธีม
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
## ตัวแปรเทมเพลต

### ตัวแปรโกลบอลมาตรฐาน

XOOPS กำหนดตัวแปรเทมเพลตส่วนกลางหลายรายการโดยอัตโนมัติ:

| ตัวแปร | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `$xoops_url` | สตริง | XOOPS การติดตั้ง URL |
| `$xoops_user` | XoopsUser\|null | วัตถุผู้ใช้ปัจจุบัน |
| `$xoops_uname` | สตริง | ชื่อผู้ใช้ปัจจุบัน |
| `$xoops_isadmin` | บูล | ผู้ใช้คือผู้ดูแลระบบ |
| `$xoops_banner` | สตริง | แบนเนอร์ HTML |
| `$xoops_notification` | สตริง | มาร์กอัปการแจ้งเตือน |
| `$xoops_version` | สตริง | XOOPS เวอร์ชัน |

### ตัวแปรเฉพาะบล็อก

เมื่อทำการเรนเดอร์บล็อก:

| ตัวแปร | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `$block` | อาร์เรย์ | บล็อกข้อมูล |
| `$block.title` | สตริง | ชื่อบล็อก |
| `$block.content` | สตริง | บล็อกเนื้อหา |
| `$block.id` | อินท์ | บล็อก ID |
| `$block.module` | สตริง | ชื่อโมดูล |

### ตัวแปรเทมเพลตโมดูล

โดยทั่วไปแล้วโมดูลจะกำหนด:

| ตัวแปร | พิมพ์ | คำอธิบาย |
|----------|-|-------------|
| `$module_name` | สตริง | ชื่อที่แสดงโมดูล |
| `$module_dir` | สตริง | ไดเร็กทอรีโมดูล |
| `$xoops_module_header` | สตริง | โมดูล CSS/JS |

## การกำหนดค่าอันชาญฉลาด

### ตัวดัดแปลง Smarty ทั่วไป

| ตัวแก้ไข | คำอธิบาย | ตัวอย่าง |
|----------|-------------|---------|
| `capitalize` | ใช้อักษรตัวแรกเป็นตัวพิมพ์ใหญ่ | `{$title\|capitalize}` |
| `count_characters` | จำนวนตัวอักษร | `{$text\|count_characters}` |
| `date_format` | จัดรูปแบบการประทับเวลา | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | หนีตัวอักษรพิเศษ | `{$html\|escape:'html'}` |
| `nl2br` | แปลงบรรทัดใหม่เป็น `<br>` | `{$text\|nl2br}` |
| `strip_tags` | ลบแท็ก HTML | `{$content\|strip_tags}` |
| `truncate` | จำกัดความยาวสตริง | `{$text\|truncate:100}` |
| `upper` | แปลงเป็นตัวพิมพ์ใหญ่ | `{$name\|upper}` |
| `lower` | แปลงเป็นตัวพิมพ์เล็ก | `{$name\|lower}` |

### โครงสร้างการควบคุม
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
## ตัวอย่างเทมเพลตที่สมบูรณ์

### PHP รหัส
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
### ไฟล์เทมเพลต (list.tpl)
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
## ฟังก์ชั่น Smarty แบบกำหนดเอง

### การสร้างฟังก์ชันบล็อกแบบกำหนดเอง
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
ลงทะเบียนและใช้งาน:
```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```
แม่แบบ:
```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```
## แนวทางปฏิบัติที่ดีที่สุด

1. **Escape User Content** - ใช้ `|escape` สำหรับเนื้อหาที่ผู้ใช้สร้างขึ้นเสมอ
2. **ใช้เส้นทางเทมเพลต** - เทมเพลตอ้างอิงที่เกี่ยวข้องกับธีม
3. **แยกตรรกะออกจากการนำเสนอ** - เก็บตรรกะที่ซับซ้อนไว้ใน PHP
4. **เทมเพลตแคช** - เปิดใช้งานการแคชเทมเพลตในการผลิต
5. **ใช้ตัวแก้ไขอย่างถูกต้อง** - ใช้ตัวกรองที่เหมาะสมสำหรับบริบท
6. **จัดระเบียบบล็อก** - วางเทมเพลตบล็อกในไดเร็กทอรีเฉพาะ
7. **ตัวแปรเอกสาร** - บันทึกตัวแปรเทมเพลตทั้งหมดใน PHP

## เอกสารที่เกี่ยวข้อง

- ../Module/Module-System - ระบบโมดูลและตะขอ
- ../Kernel/Kernel-Classes - เคอร์เนลและการกำหนดค่า
- ../Core/XoopsObject - คลาสอ็อบเจ็กต์ฐาน

---

*ดูเพิ่มเติมที่: [เอกสารอันชาญฉลาด](https://www.smarty.net/docs) | [XOOPS เทมเพลต API](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*