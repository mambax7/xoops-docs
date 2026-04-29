---
title: "Sistem Templat XOOPS"
description: "Penyepaduan pintar, kelas XoopsTpl, pembolehubah templat, pengurusan tema dan pemaparan templat"
---
Sistem Templat XOOPS dibina pada enjin templat Smarty yang berkuasa, menyediakan cara yang fleksibel dan boleh diperluas untuk memisahkan logik pembentangan daripada logik perniagaan. Ia mengurus tema, pemaparan templat, tugasan berubah-ubah dan penjanaan kandungan dinamik.## Seni Bina Templat
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
## Kelas XoopsTplKelas enjin templat utama yang memanjangkan Smarty.### Gambaran Keseluruhan Kelas
```
php
namespace XOOPS\Core;

class XoopsTpl extends Smarty
{
    protected array $vars = [];
    protected string $currentTheme = '';
    protected array $blocks = [];
    protected bool $isAdmin = false;
}
```
### Memperluaskan Smarty
```
php
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
### Kaedah Teras#### getInstanceMendapat contoh templat tunggal.
```
php
public static function getInstance(): XoopsTpl
```
**Pemulangan:** `XoopsTpl` - Contoh Singleton**Contoh:**
```
php
$xoopsTpl = XoopsTpl::getInstance();
```
#### serahkanMenetapkan pembolehubah kepada templat.
```
php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$tplVar` | string\|array | Nama pembolehubah atau tatasusunan bersekutu |
| `$value` | bercampur | Nilai boleh ubah |**Contoh:**
```
php
$xoopsTpl->assign('page_title', 'Welcome');
$xoopsTpl->assign('user_name', 'John Doe');

// Multiple assignments
$xoopsTpl->assign([
    'items' => $items,
    'total_count' => count($items),
    'show_pagination' => true
]);
```
#### appendAssignMenambahkan nilai pada pembolehubah tatasusunan templat.
```
php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$tplVar` | rentetan | Nama pembolehubah |
| `$value` | bercampur | Nilai untuk ditambahkan |**Contoh:**
```
php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```
#### getAssignedVarsMendapat semua pembolehubah templat yang ditetapkan.
```
php
public function getAssignedVars(): array
```
**Pemulangan:** `array` - Pembolehubah yang ditetapkan**Contoh:**
```
php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```
#### paparanMemaparkan templat dan output kepada penyemak imbas.
```
php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$resource` | rentetan | Laluan fail templat |
| `$cache_id` | string\|array | Pengecam cache |
| `$compile_id` | rentetan | Susun pengecam |
| `$parent` | objek | Objek templat induk |**Contoh:**
```
php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// With absolute path
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```
#### ambilMemaparkan templat dan kembali sebagai rentetan.
```
php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```
**Pemulangan:** `string` - Kandungan templat yang diberikan**Contoh:**
```
php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Use for email templates
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```
#### memuatkanTemaMemuatkan tema tertentu.
```
php
public function loadTheme(string $themeName): bool
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$themeName` | rentetan | Nama direktori tema |**Pulangan:** `bool` - Benar pada kejayaan**Contoh:**
```
php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Theme loaded successfully";
}
```
#### getCurrentThemeMendapat nama tema yang sedang aktif.
```
php
public function getCurrentTheme(): string
```
**Pemulangan:** `string` - Nama tema**Contoh:**
```
php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Active theme: $currentTheme";
```
#### setOutputFilterMenambah penapis output untuk memproses output templat.
```
php
public function setOutputFilter(string $function): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$function` | rentetan | Nama fungsi penapis |**Contoh:**
```
php
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
#### daftarPluginMendaftar pemalam Smarty tersuai.
```
php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```
**Parameter:**| Parameter | Taip | Penerangan |
|-----------|------|-------------|
| `$type` | rentetan | Jenis pemalam (pengubah suai, blok, fungsi) |
| `$name` | rentetan | Nama pemalam |
| `$callback` | boleh dipanggil | Fungsi panggil balik |**Contoh:**
```
php
// Register custom modifier
$xoopsTpl->registerPlugin('modifier', 'markdown', function($text) {
    return markdown_parse($text);
});

// Use in template: {$content|markdown}

// Register custom block tag
$xoopsTpl->registerPlugin('block', 'permission', function($params, $content, $Smarty, &$repeat) {
    if ($repeat) return;

    // Check permission
    if (has_permission($params['name'])) {
        return $content;
    }
    return '';
});

// Use in template: {permission name="admin"}...{/permission}
```
## Sistem Tema### Struktur TemaStruktur direktori tema XOOPS standard:
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
### Kelas Pengurus Tema
```
php
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
## Pembolehubah Templat### Pembolehubah Global PiawaiXOOPS secara automatik memperuntukkan beberapa pembolehubah templat global:| Pembolehubah | Taip | Penerangan |
|----------|------|-------------|
| `$xoops_url` | rentetan | URL pemasangan XOOPS |
| `$xoops_user` | XoopsUser\|null | Objek pengguna semasa |
| `$xoops_uname` | rentetan | Nama pengguna semasa |
| `$xoops_isadmin` | bool | Pengguna ialah pentadbir |
| `$xoops_banner` | rentetan | Sepanduk HTML |
| `$xoops_notification` | rentetan | Penanda pemberitahuan |
| `$xoops_version` | rentetan | Versi XOOPS |### Pembolehubah Khusus BlokApabila membuat blok:| Pembolehubah | Taip | Penerangan |
|----------|------|-------------|
| `$block` | tatasusunan | Sekat maklumat |
| `$block.title` | rentetan | Sekat tajuk |
| `$block.content` | rentetan | Sekat kandungan |
| `$block.id` | int | ID Sekat |
| `$block.module` | rentetan | Nama modul |### Pembolehubah Templat ModulModul biasanya menetapkan:| Pembolehubah | Taip | Penerangan |
|----------|------|-------------|
| `$module_name` | rentetan | Nama paparan modul |
| `$module_dir` | rentetan | Direktori modul |
| `$xoops_module_header` | rentetan | Modul CSS/JS |## Konfigurasi Pintar### Pengubahsuai Smarty Biasa| Pengubah suai | Penerangan | Contoh |
|----------|-------------|---------|
| `capitalize` | Gunakan huruf besar pertama | `{$title\|capitalize}` |
| `count_characters` | Kiraan aksara | `{$text\|count_characters}` |
| `date_format` | Format cap masa | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Melarikan diri aksara istimewa | `{$html\|escape:'html'}` |
| `nl2br` | Tukar baris baharu kepada `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Alih keluar teg HTML | `{$content\|strip_tags}` |
| `truncate` | Hadkan panjang rentetan | `{$text\|truncate:100}` |
| `upper` | Tukar kepada huruf besar | `{$name\|upper}` |
| `lower` | Tukar kepada huruf kecil | `{$name\|lower}` |### Struktur Kawalan
```
Smarty
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
    {$Smarty.foreach.item_loop.iteration}: {$item.title}
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
## Contoh Templat Lengkap### Kod PHP
```
php
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
### Fail Templat (list.tpl)
```
Smarty
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
## Fungsi Smarty Tersuai### Mencipta Fungsi Blok Tersuai
```
php
<?php
/**
 * Custom Smarty block function for permission checking
 */

function smarty_block_permission($params, $content, $Smarty, &$repeat)
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
Daftar dan gunakan:
```
php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```
Templat:
```
Smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```
## Amalan Terbaik1. **Escape User Content** - Sentiasa gunakan `|escape` untuk kandungan yang dijana pengguna
2. **Gunakan Laluan Templat** - Templat rujukan relatif kepada tema
3. **Asingkan Logik daripada Persembahan** - Simpan logik kompleks dalam PHP
4. **Templat Cache** - Dayakan cache templat dalam pengeluaran
5. **Gunakan Pengubahsuai dengan Betul** - Gunakan penapis yang sesuai untuk konteks
6. **Atur Blok** - Letakkan templat blok dalam direktori khusus
7. **Pembolehubah Dokumen** - Dokumen semua pembolehubah templat dalam PHP## Dokumentasi Berkaitan- ../Module/Module-System - Sistem modul dan cangkuk
- ../Kernel/Kernel-Classes - Inti dan konfigurasi
- ../Core/XoopsObject - Kelas objek asas---

*Lihat juga: [Dokumentasi Pintar](https://www.Smarty.net/docs) | [API Templat XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*