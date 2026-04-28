---
title: "أنماط التصميم في XOOPS"
description: "دليل شامل لأنماط التصميم المستخدمة في تطوير XOOPS بما في ذلك MVC و Singleton و Factory و Observer وغيرها"
dir: rtl
lang: ar
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

أنماط التصميم هي حلول قابلة لإعادة الاستخدام للمشاكل الشائعة في تصميم البرمجيات. يستخدم XOOPS عدة أنماط معروفة جيداً تساعد على الحفاظ على جودة الكود وتحسين قابلية الاختبار وتعزيز مرونة النظام.

:::note[اختيار النمط بسرعة]
غير متأكد أي نمط ستستخدم؟ انظر إلى:
- [اختيار نمط الوصول إلى البيانات](../../03-Module-Development/Choosing-Data-Access-Pattern.md) — معالجات مقابل مستودع مقابل خدمة مقابل CQRS
- [اختيار نظام الأحداث](../Choosing-Event-System.md) — تحميل مسبق مقابل أحداث PSR-14
:::

## نظرة عامة

يعتبر فهم وتنفيذ أنماط التصميم بشكل صحيح حاسماً لإنشاء وحدات XOOPS قابلة للصيانة. يغطي هذا الدليل الأنماط الأكثر استخداماً في تطوير XOOPS.

| النمط | الغرض | حالات الاستخدام الشائعة |
|---------|---------|------------------|
| MVC | فصل الاهتمامات | هيكل الوحدة |
| Singleton | ضمان مثيل واحد | اتصالات قاعدة البيانات |
| Factory | تجريد إنشاء الكائن | معالجات، قاعدة البيانات |
| Observer | إخطار الحدث | تحميل مسبق، إشعارات |
| Decorator | توسيع السلوك الديناميكي | عناصر النموذج، مرشحات |
| Strategy | تبديل الخوارزمية | المصادقة، التحقق من الصحة |
| Adapter | توافق الواجهة | تكامل الكود الموروث |
| Repository | تجريد الوصول إلى البيانات | استمرار البيانات |

## نمط Model-View-Controller (MVC)

يفصل نمط MVC التطبيق إلى ثلاثة مكونات مترابطة، مما يجعل قاعدة الكود منظمة وقابلة للاختبار.

### المعمارية

```mermaid
flowchart TB
    subgraph MVC["نمط MVC في XOOPS"]
        Controller["🎮 المتحكم<br/>(index.php, admin/index.php)"]
        Model["📦 النموذج<br/>(Handlers)"]
        View["🎨 العرض<br/>(Templates)"]

        Controller --> Model
        Controller --> View
        Model <--> View
    end

    style Controller fill:#e3f2fd,stroke:#1976d2
    style Model fill:#fff3e0,stroke:#f57c00
    style View fill:#e8f5e9,stroke:#388e3c
```

### النموذج (طبقة البيانات)

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

### العرض (طبقة العرض)

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

### المتحكم (طبقة المنطق)

```php
<?php
// index.php
require_once dirname(__DIR__, 2) . '/mainfile.php';

use XoopsModules\MyModule\Helper;

$helper = Helper::getInstance();
$articleHandler = $helper->getHandler('Article');

// احصل على الحركة من الطلب
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

## نمط Singleton

يضمن نمط Singleton أن فئة لديها مثيل واحد فقط ويوفر وصول عام إليه.

### متى يتم الاستخدام

- اتصالات قاعدة البيانات
- مديرو التكوين
- مثيلات المسجلات
- مديرو الذاكرة المؤقتة

### التنفيذ

```php
<?php
namespace XoopsModules\MyModule;

class ConfigurationManager
{
    private static ?self $instance = null;
    private array $config = [];

    private function __construct()
    {
        // تحميل التكوين
        $this->loadConfiguration();
    }

    // منع النسخ
    private function __clone() {}

    // منع عدم التسلسل
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

// الاستخدام
$config = ConfigurationManager::getInstance();
$itemsPerPage = $config->get('items_per_page');
```

### أمثلة نواة XOOPS

```php
<?php
// XoopsDatabaseFactory يستخدم نمط Singleton
$db = XoopsDatabaseFactory::getDatabaseConnection();

// XMF Module Helper يستخدم Singleton
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// مثيل Xoops الرئيسي
$xoops = \Xoops::getInstance();
```

## نمط Factory

ينشئ نمط Factory كائنات بدون تحديد فئتهم الدقيقة، مما يسمح بإنشاء كائنات مرن.

### متى يتم الاستخدام

- إنشاء معالجات ديناميكياً
- اتصالات قاعدة البيانات لقواعد بيانات مختلفة
- موفرو المصادقة
- إنشاء عنصر النموذج

### التنفيذ

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

// الاستخدام
$article = ContentFactory::create('article', ['title' => 'Hello', 'body' => 'World']);
echo $article->render();
```

### مصنع قاعدة بيانات XOOPS

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

## نمط Observer

يسمح نمط Observer للكائنات بالحصول على إخطار بالتغييرات في حالة الموضوع، مما يتيح السلوك المدفوع بالأحداث.

### متى يتم الاستخدام

- معالجة الأحداث
- أنظمة الإخطار
- معماريات الإضافات البرمجية
- السجل والتدقيق

### التنفيذ

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
            // إرسال إخطار بريد إلكتروني
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

// الاستخدام
$dispatcher = new EventDispatcher();
$dispatcher->attach('article.published', new EmailNotifier());

// عند نشر المقالة
$dispatcher->notify('article.published', ['article' => $article]);
```

### تحميل XOOPS مسبق (تنفيذ Observer)

```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreIncludeCommonEnd($args)
    {
        // التفاعل مع انتهاء تضمين النواة الشائعة
        $GLOBALS['xoopsLogger']->addExtra('MyModule', 'Initialized');
    }

    public static function eventCoreHeaderEnd($args)
    {
        // إضافة رؤوس مخصصة
        $GLOBALS['xoTheme']->addStylesheet('modules/mymodule/assets/css/custom.css');
    }

    public static function eventCoreFooterStart($args)
    {
        // تنفيذ قبل عرض التذييل
    }
}
```

## نمط Decorator

يضيف نمط Decorator سلوك للكائنات بشكل ديناميكي دون التأثير على الكائنات الأخرى من نفس الفئة.

### متى يتم الاستخدام

- تخصيص عنصر النموذج
- تنسيق الإخراج
- التحقق من الأذونات
- طبقات التخزين المؤقت

### التنفيذ

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

// الاستخدام - يمكن دمج الزخارف
$input = new TextInput('username');
$input = new RequiredDecorator($input);
$input = new LabelDecorator($input, 'Username');
$input = new HelpTextDecorator($input, 'Enter your username');

echo $input->render();
// الإخراج: <label>Username</label><input type="text" name="username" value=""><span class="required">*</span><small class="help-text">Enter your username</small>
```

## نمط Strategy

يحدد نمط Strategy عائلة من الخوارزميات، ويغلف كل منها، ويجعلها قابلة للتبديل.

### متى يتم الاستخدام

- طرق مصادقة متعددة
- خوارزميات فرز مختلفة
- صيغ تصدير متنوعة
- قواعد تحقق من الصحة مرنة

### التنفيذ

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

// الاستخدام
$authService = new AuthService(new DatabaseAuthStrategy());

// يمكن تبديل الإستراتيجيات في وقت التشغيل
if ($useLdap) {
    $authService->setStrategy(new LdapAuthStrategy('ldap.example.com'));
}

$authenticated = $authService->login($username, $password);
```

## نمط Repository

يوفر نمط Repository طبقة تجريد بين منطق الوصول إلى البيانات ومنطق العمل.

### متى يتم الاستخدام

- متطلبات الوصول إلى البيانات المعقدة
- مصادر بيانات متعددة
- طبقات بيانات قابلة للاختبار
- تصميم موجه بالمجال

### التنفيذ

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

## حقن الاعتماديات

يسمح حقن الاعتماديات (DI) بإنشاء كائنات مع اعتمادياتها بدلاً من إنشاؤها داخلياً.

### الفوائد

- قابلية اختبار محسنة
- ربط فضفاض
- تكوين مرن
- تنظيم كود أفضل

### التنفيذ

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

        // جرب الذاكرة المؤقتة أولاً
        if ($this->cache->has($cacheKey)) {
            $this->logger->debug("Article {$id} loaded from cache");
            return $this->cache->get($cacheKey);
        }

        // التحميل من المستودع
        $article = $this->repository->find($id);

        if ($article) {
            $this->cache->set($cacheKey, $article, 3600);
            $this->logger->debug("Article {$id} loaded from database");
        }

        return $article;
    }
}

// إعداد حاوية الخدمة
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

// الاستخدام
$articleService = $container->resolve('articleService');
$article = $articleService->getArticle(1);
```

## أفضل الممارسات

### مبادئ اختيار النمط

1. **اختر الأنماط بناءً على الاحتياجات الفعلية**، وليس الأنماط المتوقعة
2. **ابقي على التنفيذات بسيطة** - لا تعقد الهندسة
3. **وثق استخدام النمط** لفهم الفريق
4. **دمج الأنماط** عند الحاجة (على سبيل المثال، Factory + Singleton)
5. **ضع في الاعتبار قابلية الاختبار** عند اختيار الأنماط

### الأنماط المضادة الشائعة لتجنبها

| النمط المضاد | المشكلة | الحل |
|--------------|---------|----------|
| God Object | الفئة تفعل الكثير | المسؤولية الفردية |
| Spaghetti Code | لا توجد بنية واضحة | استخدم نمط MVC |
| النسخ واللصق | تكرار الكود | استخرج الكود الشائع |
| الأرقام السحرية | ثوابت غير واضحة | استخدم ثوابت مسماة |
| الربط الشديد | يصعب الاختبار والصيانة | استخدم حقن الاعتماديات |

### أنماط الاختبار

```php
<?php
// اختبار الوحدة مع حقن الاعتماديات
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

## الوثائق ذات الصلة

- [معمارية XOOPS](XOOPS-Architecture.md) - المعمارية الشاملة للنظام
- [طبقة قاعدة البيانات](../Database/Database-Layer.md) - أنماط استمرار البيانات
- [أفضل ممارسات الأمان](../Security/Security-Best-Practices.md) - تنفيذ الأنماط الآمن

---

#xoops #أنماط-التصميم #معمارية #mvc #singleton #factory #observer
