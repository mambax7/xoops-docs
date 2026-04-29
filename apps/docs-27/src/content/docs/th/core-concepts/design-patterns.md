---
title: "ออกแบบรูปแบบใน XOOPS"
description: "คู่มือที่ครอบคลุมเกี่ยวกับรูปแบบการออกแบบที่ใช้ใน XOOPS การพัฒนา รวมถึง MVC, Singleton, Factory, Observer และอื่นๆ"
---
<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

รูปแบบการออกแบบเป็นวิธีแก้ปัญหาที่ใช้ซ้ำได้สำหรับปัญหาการออกแบบซอฟต์แวร์ทั่วไป XOOPS ใช้รูปแบบที่เป็นที่ยอมรับหลายรูปแบบ ซึ่งจะช่วยรักษาคุณภาพของโค้ด ปรับปรุงความสามารถในการทดสอบ และเพิ่มความยืดหยุ่นของระบบ

:::note[การเลือกรูปแบบด่วน]
ไม่แน่ใจว่าจะใช้รูปแบบไหน? ดู:
- [การเลือกรูปแบบการเข้าถึงข้อมูล](../../03-Module-Development/Choosing-Data-Access-Pattern.md) — ตัวจัดการ vs พื้นที่เก็บข้อมูล vs บริการ vs CQRS
- [การเลือกระบบเหตุการณ์](../Choosing-Event-System.md) — โหลดล่วงหน้าเทียบกับ PSR-14 เหตุการณ์
::::::

## ภาพรวม

การทำความเข้าใจและการนำรูปแบบการออกแบบไปใช้อย่างถูกต้องเป็นสิ่งสำคัญสำหรับการสร้างโมดูล XOOPS ที่บำรุงรักษาได้ คู่มือนี้ครอบคลุมรูปแบบที่ใช้บ่อยที่สุดในการพัฒนา XOOPS

| รูปแบบ | วัตถุประสงค์ | กรณีการใช้งานทั่วไป |
|---------|---------|------------------|
| MVC | แยกความกังวล | โครงสร้างโมดูล |
| ซิงเกิลตัน | รับประกันอินสแตนซ์เดียว | การเชื่อมต่อฐานข้อมูล |
| โรงงาน | นามธรรมการสร้างวัตถุ | ตัวจัดการฐานข้อมูล |
| ผู้สังเกตการณ์ | การแจ้งเตือนเหตุการณ์ | โหลดล่วงหน้า การแจ้งเตือน |
| มัณฑนากร | ส่วนขยายลักษณะการทำงานแบบไดนามิก | องค์ประกอบแบบฟอร์ม ตัวกรอง |
| กลยุทธ์ | การแลกเปลี่ยนอัลกอริทึม | การตรวจสอบความถูกต้อง |
| อะแดปเตอร์ | ความเข้ากันได้ของอินเทอร์เฟซ | การรวมรหัสเดิม |
| พื้นที่เก็บข้อมูล | นามธรรมการเข้าถึงข้อมูล | ความคงอยู่ของข้อมูล |

## Model-View-Controller (MVC)

รูปแบบ MVC แยกแอปพลิเคชันออกเป็นสามองค์ประกอบที่เชื่อมต่อถึงกัน ทำให้โค้ดเบสมีระเบียบและทดสอบได้มากขึ้น

### สถาปัตยกรรม
```
mermaid
flowchart TB
    subgraph MVC["MVC Pattern in XOOPS"]
        Controller["🎮 Controller<br/>(index.php, admin/index.php)"]
        Model["📦 Model<br/>(Handlers)"]
        View["🎨 View<br/>(Templates)"]

        Controller --> Model
        Controller --> View
        Model <--> View
    end

    style Controller fill:#e3f2fd,stroke:#1976d2
    style Model fill:#fff3e0,stroke:#f57c00
    style View fill:#e8f5e9,stroke:#388e3c
```
### โมเดล (ชั้นข้อมูล)
```php
<?php
namespace XoopsModules\MyModule;

class Article extends \XoopsObject
{
    public function __construct()
    {
        $this->initVar('article_id', XOBJ_DTYPE_INT, null, false);
        $this->initVar('title', XOBJ_DTYPE_TXTBOX, '', true, 255);
        $this->initVar('content', XOBJ_DTYPE_TXTAREA, '', true);
        $this->initVar('author_id', XOBJ_DTYPE_INT, 0, true);
        $this->initVar('status', XOBJ_DTYPE_INT, 1, false);
        $this->initVar('created', XOBJ_DTYPE_INT, time(), false);
        $this->initVar('modified', XOBJ_DTYPE_INT, time(), false);
    }

    public function isPublished(): bool
    {
        return $this->getVar('status') === 1;
    }

    public function getFormattedDate(): string
    {
        return formatTimestamp($this->getVar('created'));
    }
}

class ArticleHandler extends \XoopsPersistableObjectHandler
{
    public function __construct(\XoopsDatabase $db)
    {
        parent::__construct($db, 'mymodule_articles', Article::class, 'article_id', 'title');
    }

    public function getPublishedArticles(int $limit = 10): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 1));
        $criteria->setSort('created');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);

        return $this->getObjects($criteria);
    }
}
```
### มุมมอง (เลเยอร์การนำเสนอ)
```smarty
{* templates/article_list.tpl *}
<div class="article-list">
    <h2>{$smarty.const._MD_MYMODULE_ARTICLES}</h2>

    {foreach from=$articles item=article}
        <article class="article-item">
            <h3>
                <a href="{$xoops_url}/modules/mymodule/article.php?id={$article.article_id}">
                    {$article.title|escape}
                </a>
            </h3>
            <p class="meta">
                {$smarty.const._MD_MYMODULE_POSTED}: {$article.formatted_date}
            </p>
            <div class="content">
                {$article.content|truncate:200}
            </div>
        </article>
    {/foreach}
</div>
```
### คอนโทรลเลอร์ (ลอจิกเลเยอร์)
```php
<?php
// index.php
require_once dirname(__DIR__, 2) . '/mainfile.php';

use XoopsModules\MyModule\Helper;

$helper = Helper::getInstance();
$articleHandler = $helper->getHandler('Article');

// Get action from request
$op = \Xmf\Request::getString('op', 'list');

switch ($op) {
    case 'view':
        $articleId = \Xmf\Request::getInt('id', 0);
        $article = $articleHandler->get($articleId);

        if (!$article) {
            redirect_header(XOOPS_URL, 3, _MD_MYMODULE_NOT_FOUND);
        }

        $GLOBALS['xoopsOption']['template_main'] = 'mymodule_article_view.tpl';
        require_once XOOPS_ROOT_PATH . '/header.php';

        $xoopsTpl->assign('article', $article->toArray());
        break;

    case 'list':
    default:
        $articles = $articleHandler->getPublishedArticles(10);

        $GLOBALS['xoopsOption']['template_main'] = 'mymodule_article_list.tpl';
        require_once XOOPS_ROOT_PATH . '/header.php';

        $xoopsTpl->assign('articles', array_map(fn($a) => $a->toArray(), $articles));
        break;
}

require_once XOOPS_ROOT_PATH . '/footer.php';
```
## ลายซิงเกิลตัน

รูปแบบ Singleton ช่วยให้มั่นใจว่าคลาสมีเพียงอินสแตนซ์เดียวและให้การเข้าถึงทั่วโลก

### เมื่อใดควรใช้

- การเชื่อมต่อฐานข้อมูล
- ผู้จัดการการกำหนดค่า
- อินสแตนซ์ Logger
- ผู้จัดการแคช

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

class ConfigurationManager
{
    private static ?self $instance = null;
    private array $config = [];

    private function __construct()
    {
        // Load configuration
        $this->loadConfiguration();
    }

    // Prevent cloning
    private function __clone() {}

    // Prevent unserialization
    public function __wakeup()
    {
        throw new \Exception("Cannot unserialize singleton");
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function loadConfiguration(): void
    {
        $helper = Helper::getInstance();
        $this->config = [
            'items_per_page' => $helper->getConfig('items_per_page', 10),
            'allow_comments' => $helper->getConfig('allow_comments', true),
            'date_format' => $helper->getConfig('date_format', 'Y-m-d'),
        ];
    }

    public function get(string $key, mixed $default = null): mixed
    {
        return $this->config[$key] ?? $default;
    }
}

// Usage
$config = ConfigurationManager::getInstance();
$itemsPerPage = $config->get('items_per_page');
```
### XOOPS ตัวอย่างหลัก
```php
<?php
// XoopsDatabaseFactory uses Singleton pattern
$db = XoopsDatabaseFactory::getDatabaseConnection();

// XMF Module Helper uses Singleton
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// Xoops main instance
$xoops = \Xoops::getInstance();
```
## ลายโรงงาน

รูปแบบ Factory จะสร้างออบเจ็กต์โดยไม่ต้องระบุคลาสที่แน่นอน ทำให้สามารถสร้างออบเจ็กต์ได้อย่างยืดหยุ่น

### เมื่อใดควรใช้

- การสร้างตัวจัดการแบบไดนามิก
- การเชื่อมต่อฐานข้อมูลสำหรับฐานข้อมูลต่างๆ
- ผู้ให้บริการรับรองความถูกต้อง
- การสร้างองค์ประกอบแบบฟอร์ม

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

interface ContentInterface
{
    public function render(): string;
}

class ArticleContent implements ContentInterface
{
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function render(): string
    {
        return "<article><h2>{$this->data['title']}</h2><p>{$this->data['body']}</p></article>";
    }
}

class NewsContent implements ContentInterface
{
    private array $data;

    public function __construct(array $data)
    {
        $this->data = $data;
    }

    public function render(): string
    {
        return "<div class='news'><h3>{$this->data['headline']}</h3><p>{$this->data['summary']}</p></div>";
    }
}

class ContentFactory
{
    public static function create(string $type, array $data): ContentInterface
    {
        return match ($type) {
            'article' => new ArticleContent($data),
            'news' => new NewsContent($data),
            default => throw new \InvalidArgumentException("Unknown content type: $type"),
        };
    }
}

// Usage
$article = ContentFactory::create('article', ['title' => 'Hello', 'body' => 'World']);
echo $article->render();
```
### XOOPS โรงงานฐานข้อมูล
```php
<?php
class XoopsDatabaseFactory
{
    public static function getDatabaseConnection()
    {
        static $instance;

        if (!isset($instance)) {
            $dbType = XOOPS_DB_TYPE ?? 'mysql';
            $className = 'XoopsDatabase' . ucfirst($dbType);

            if (!class_exists($className)) {
                $file = XOOPS_ROOT_PATH . '/class/database/' . strtolower($dbType) . '.php';
                if (file_exists($file)) {
                    require_once $file;
                }
            }

            $instance = new $className();

            if (!$instance->connect()) {
                trigger_error('Unable to connect to database', E_USER_ERROR);
            }
        }

        return $instance;
    }
}
```
## รูปแบบผู้สังเกตการณ์

รูปแบบผู้สังเกตการณ์ช่วยให้ออบเจ็กต์ได้รับการแจ้งเตือนถึงการเปลี่ยนแปลงสถานะของวัตถุ ทำให้เกิดพฤติกรรมที่ขับเคลื่อนด้วยเหตุการณ์

### เมื่อใดควรใช้

- การจัดการเหตุการณ์
- ระบบแจ้งเตือน
- สถาปัตยกรรมปลั๊กอิน
- การบันทึกและการตรวจสอบ

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

interface ObserverInterface
{
    public function update(string $event, array $data): void;
}

class EventDispatcher
{
    private array $observers = [];

    public function attach(string $event, ObserverInterface $observer): void
    {
        if (!isset($this->observers[$event])) {
            $this->observers[$event] = [];
        }

        $this->observers[$event][] = $observer;
    }

    public function detach(string $event, ObserverInterface $observer): void
    {
        if (isset($this->observers[$event])) {
            $key = array_search($observer, $this->observers[$event], true);
            if ($key !== false) {
                unset($this->observers[$event][$key]);
            }
        }
    }

    public function notify(string $event, array $data = []): void
    {
        if (isset($this->observers[$event])) {
            foreach ($this->observers[$event] as $observer) {
                $observer->update($event, $data);
            }
        }
    }
}

class EmailNotifier implements ObserverInterface
{
    public function update(string $event, array $data): void
    {
        if ($event === 'article.published') {
            // Send email notification
            $this->sendEmail($data['article']);
        }
    }

    private function sendEmail($article): void
    {
        $xoopsMailer = xoops_getMailer();
        $xoopsMailer->setSubject('New Article Published: ' . $article->getVar('title'));
        $xoopsMailer->setBody('A new article has been published.');
        $xoopsMailer->send();
    }
}

// Usage
$dispatcher = new EventDispatcher();
$dispatcher->attach('article.published', new EmailNotifier());

// When article is published
$dispatcher->notify('article.published', ['article' => $article]);
```
### XOOPS โหลดล่วงหน้า (การใช้งานของผู้สังเกตการณ์)
```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreIncludeCommonEnd($args)
    {
        // React to core common include completing
        $GLOBALS['xoopsLogger']->addExtra('MyModule', 'Initialized');
    }

    public static function eventCoreHeaderEnd($args)
    {
        // Add custom headers
        $GLOBALS['xoTheme']->addStylesheet('modules/mymodule/assets/css/custom.css');
    }

    public static function eventCoreFooterStart($args)
    {
        // Execute before footer renders
    }
}
```
## ลายมัณฑนากร

รูปแบบมัณฑนากรจะเพิ่มพฤติกรรมให้กับวัตถุแบบไดนามิกโดยไม่ส่งผลกระทบต่อวัตถุอื่นในคลาสเดียวกัน

### เมื่อใดควรใช้

- การปรับแต่งองค์ประกอบแบบฟอร์ม
- การจัดรูปแบบเอาต์พุต
- การตรวจสอบสิทธิ์
- แคชเลเยอร์

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

interface FormElementInterface
{
    public function render(): string;
}

class TextInput implements FormElementInterface
{
    private string $name;
    private string $value;

    public function __construct(string $name, string $value = '')
    {
        $this->name = $name;
        $this->value = $value;
    }

    public function render(): string
    {
        return sprintf(
            '<input type="text" name="%s" value="%s">',
            htmlspecialchars($this->name),
            htmlspecialchars($this->value)
        );
    }
}

abstract class FormElementDecorator implements FormElementInterface
{
    protected FormElementInterface $element;

    public function __construct(FormElementInterface $element)
    {
        $this->element = $element;
    }

    public function render(): string
    {
        return $this->element->render();
    }
}

class RequiredDecorator extends FormElementDecorator
{
    public function render(): string
    {
        return $this->element->render() . '<span class="required">*</span>';
    }
}

class LabelDecorator extends FormElementDecorator
{
    private string $label;

    public function __construct(FormElementInterface $element, string $label)
    {
        parent::__construct($element);
        $this->label = $label;
    }

    public function render(): string
    {
        return sprintf(
            '<label>%s</label>%s',
            htmlspecialchars($this->label),
            $this->element->render()
        );
    }
}

class HelpTextDecorator extends FormElementDecorator
{
    private string $helpText;

    public function __construct(FormElementInterface $element, string $helpText)
    {
        parent::__construct($element);
        $this->helpText = $helpText;
    }

    public function render(): string
    {
        return $this->element->render() . sprintf(
            '<small class="help-text">%s</small>',
            htmlspecialchars($this->helpText)
        );
    }
}

// Usage - decorators can be stacked
$input = new TextInput('username');
$input = new RequiredDecorator($input);
$input = new LabelDecorator($input, 'Username');
$input = new HelpTextDecorator($input, 'Enter your username');

echo $input->render();
// Output: <label>Username</label><input type="text" name="username" value=""><span class="required">*</span><small class="help-text">Enter your username</small>
```
## รูปแบบกลยุทธ์

รูปแบบกลยุทธ์จะกำหนดกลุ่มอัลกอริธึม ห่อหุ้มแต่ละอัลกอริธึม และทำให้สามารถใช้แทนกันได้

### เมื่อใดควรใช้

- วิธีการรับรองความถูกต้องหลายวิธี
- อัลกอริธึมการเรียงลำดับที่แตกต่างกัน
- รูปแบบการส่งออกต่างๆ
- กฎการตรวจสอบที่ยืดหยุ่น

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

interface AuthStrategyInterface
{
    public function authenticate(string $username, string $password): bool;
}

class DatabaseAuthStrategy implements AuthStrategyInterface
{
    public function authenticate(string $username, string $password): bool
    {
        $memberHandler = xoops_getHandler('member');
        $user = $memberHandler->loginUser($username, $password);

        return $user !== false;
    }
}

class LdapAuthStrategy implements AuthStrategyInterface
{
    private string $ldapHost;
    private int $ldapPort;

    public function __construct(string $host, int $port = 389)
    {
        $this->ldapHost = $host;
        $this->ldapPort = $port;
    }

    public function authenticate(string $username, string $password): bool
    {
        $ldap = ldap_connect($this->ldapHost, $this->ldapPort);

        if (!$ldap) {
            return false;
        }

        $bind = @ldap_bind($ldap, "uid=$username,ou=users,dc=example,dc=com", $password);

        ldap_close($ldap);

        return $bind;
    }
}

class AuthService
{
    private AuthStrategyInterface $strategy;

    public function __construct(AuthStrategyInterface $strategy)
    {
        $this->strategy = $strategy;
    }

    public function setStrategy(AuthStrategyInterface $strategy): void
    {
        $this->strategy = $strategy;
    }

    public function login(string $username, string $password): bool
    {
        return $this->strategy->authenticate($username, $password);
    }
}

// Usage
$authService = new AuthService(new DatabaseAuthStrategy());

// Can switch strategies at runtime
if ($useLdap) {
    $authService->setStrategy(new LdapAuthStrategy('ldap.example.com'));
}

$authenticated = $authService->login($username, $password);
```
## รูปแบบพื้นที่เก็บข้อมูล

รูปแบบพื้นที่เก็บข้อมูลจัดเตรียมชั้นนามธรรมระหว่างตรรกะการเข้าถึงข้อมูลและตรรกะทางธุรกิจ

### เมื่อใดควรใช้

- ข้อกำหนดการเข้าถึงข้อมูลที่ซับซ้อน
- แหล่งข้อมูลหลายแหล่ง
- ชั้นข้อมูลที่ทดสอบได้
- การออกแบบที่ขับเคลื่อนด้วยโดเมน

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule\Repository;

use XoopsModules\MyModule\Entity\Article;

interface ArticleRepositoryInterface
{
    public function find(int $id): ?Article;
    public function findBySlug(string $slug): ?Article;
    public function findPublished(int $limit = 10, int $offset = 0): array;
    public function save(Article $article): bool;
    public function delete(Article $article): bool;
}

class ArticleRepository implements ArticleRepositoryInterface
{
    private \XoopsPersistableObjectHandler $handler;

    public function __construct(\XoopsPersistableObjectHandler $handler)
    {
        $this->handler = $handler;
    }

    public function find(int $id): ?Article
    {
        $obj = $this->handler->get($id);
        return $obj ?: null;
    }

    public function findBySlug(string $slug): ?Article
    {
        $criteria = new \Criteria('slug', $slug);
        $objects = $this->handler->getObjects($criteria);

        return !empty($objects) ? $objects[0] : null;
    }

    public function findPublished(int $limit = 10, int $offset = 0): array
    {
        $criteria = new \CriteriaCompo();
        $criteria->add(new \Criteria('status', 'published'));
        $criteria->setSort('published_at');
        $criteria->setOrder('DESC');
        $criteria->setLimit($limit);
        $criteria->setStart($offset);

        return $this->handler->getObjects($criteria);
    }

    public function save(Article $article): bool
    {
        return $this->handler->insert($article);
    }

    public function delete(Article $article): bool
    {
        return $this->handler->delete($article);
    }
}
```
## การฉีดพึ่งพา

การพึ่งพาการฉีด (DI) อนุญาตให้สร้างออบเจ็กต์ด้วยการขึ้นต่อกันแทนที่จะสร้างภายใน

### ผลประโยชน์

- ปรับปรุงความสามารถในการทดสอบ
- ข้อต่อหลวม
- การกำหนดค่าที่ยืดหยุ่น
- การจัดระเบียบรหัสที่ดีขึ้น

### การนำไปปฏิบัติ
```php
<?php
namespace XoopsModules\MyModule;

class ArticleService
{
    private Repository\ArticleRepositoryInterface $repository;
    private CacheInterface $cache;
    private LoggerInterface $logger;

    public function __construct(
        Repository\ArticleRepositoryInterface $repository,
        CacheInterface $cache,
        LoggerInterface $logger
    ) {
        $this->repository = $repository;
        $this->cache = $cache;
        $this->logger = $logger;
    }

    public function getArticle(int $id): ?Entity\Article
    {
        $cacheKey = "article_{$id}";

        // Try cache first
        if ($this->cache->has($cacheKey)) {
            $this->logger->debug("Article {$id} loaded from cache");
            return $this->cache->get($cacheKey);
        }

        // Load from repository
        $article = $this->repository->find($id);

        if ($article) {
            $this->cache->set($cacheKey, $article, 3600);
            $this->logger->debug("Article {$id} loaded from database");
        }

        return $article;
    }
}

// Service container setup
$container = new DependencyContainer();

$container->register('db', fn() => XoopsDatabaseFactory::getDatabaseConnection());

$container->register('articleHandler', fn($c) =>
    new ArticleHandler($c->resolve('db'))
);

$container->register('articleRepository', fn($c) =>
    new Repository\ArticleRepository($c->resolve('articleHandler'))
);

$container->register('cache', fn() => new FileCache(XOOPS_VAR_PATH . '/caches'));

$container->register('logger', fn() => new XoopsLogger());

$container->register('articleService', fn($c) =>
    new ArticleService(
        $c->resolve('articleRepository'),
        $c->resolve('cache'),
        $c->resolve('logger')
    )
);

// Usage
$articleService = $container->resolve('articleService');
$article = $articleService->getArticle(1);
```
## แนวทางปฏิบัติที่ดีที่สุด

### แนวทางการเลือกรูปแบบ

1. **เลือกรูปแบบตามความต้องการที่แท้จริง** ไม่ใช่แบบที่คาดหวัง
2. **ทำให้การใช้งานง่ายขึ้น** - อย่าออกแบบมากเกินไป
3. **การใช้รูปแบบเอกสาร** เพื่อความเข้าใจของทีม
4. **รวมรูปแบบ** ตามความเหมาะสม (เช่น โรงงาน + ซิงเกิลตัน)
5. **พิจารณาความสามารถในการทดสอบ** เมื่อเลือกรูปแบบ

### รูปแบบการต่อต้านทั่วไปที่ควรหลีกเลี่ยง

| ต่อต้านรูปแบบ | ปัญหา | โซลูชั่น |
|--------------|---------|----------|
| วัตถุพระเจ้า | คลาสทำมากเกินไป | ความรับผิดชอบเดี่ยว |
| สปาเก็ตตี้โค้ด | ไม่มีโครงสร้างที่ชัดเจน | ใช้รูปแบบ MVC |
| คัดลอก-วาง | การทำสำเนาโค้ด | แยกรหัสทั่วไป |
| ตัวเลขมหัศจรรย์ | ค่าคงที่ไม่ชัดเจน | ใช้ค่าคงที่ที่มีชื่อ |
| ข้อต่อแน่น | ทดสอบ/บำรุงรักษายาก | ใช้การฉีดพึ่งพา |

### รูปแบบการทดสอบ
```php
<?php
// Unit testing with dependency injection
class ArticleServiceTest extends \PHPUnit\Framework\TestCase
{
    private $repository;
    private $cache;
    private $logger;
    private $service;

    protected function setUp(): void
    {
        $this->repository = $this->createMock(ArticleRepositoryInterface::class);
        $this->cache = $this->createMock(CacheInterface::class);
        $this->logger = $this->createMock(LoggerInterface::class);

        $this->service = new ArticleService(
            $this->repository,
            $this->cache,
            $this->logger
        );
    }

    public function testGetArticleFromCache(): void
    {
        $article = new Article();
        $article->setVar('article_id', 1);

        $this->cache->expects($this->once())
            ->method('has')
            ->with('article_1')
            ->willReturn(true);

        $this->cache->expects($this->once())
            ->method('get')
            ->with('article_1')
            ->willReturn($article);

        $result = $this->service->getArticle(1);

        $this->assertSame($article, $result);
    }
}
```
## เอกสารที่เกี่ยวข้อง

- [XOOPS-สถาปัตยกรรม](XOOPS-Architecture.md) - สถาปัตยกรรมระบบโดยรวม
- [ชั้นฐานข้อมูล](../Database/Database-Layer.md) - รูปแบบการคงอยู่ของข้อมูล
- [แนวทางปฏิบัติที่ดีที่สุดด้านความปลอดภัย](../Security/Security-Best-Practices.md) - การใช้รูปแบบที่ปลอดภัย

---

#xoops #รูปแบบการออกแบบ #สถาปัตยกรรม #mvc #singleton #factory #observer