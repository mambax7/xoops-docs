---
title: "Návrhové vzory v XOOPS"
description: "Komplexní průvodce návrhovými vzory používanými při vývoji XOOPS včetně MVC, Singleton, Factory, Observer a dalších"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Návrhové vzory jsou opakovaně použitelná řešení běžných problémů s návrhem softwaru. XOOPS využívá několik dobře zavedených vzorů, které pomáhají udržovat kvalitu kódu, zlepšují testovatelnost a zvyšují flexibilitu systému.

:::poznámka[Rychlý výběr vzoru]
Nejste si jisti, který vzor použít? Viz:
- [Volba vzoru přístupu k datům](../../03-Module-Development/Choosing-Data-Access-Pattern.md) – obslužné nástroje vs úložiště vs služba vs CQRS
- [Volba systému událostí](../Choosing-Event-System.md) – předběžné načtení vs. události PSR-14
:::

## Přehled

Pochopení a správná implementace návrhových vzorů je zásadní pro vytváření udržovatelných modulů XOOPS. Tato příručka pokrývá nejčastěji používané vzory při vývoji XOOPS.

| Vzor | Účel | Běžné případy použití |
|---------|---------|------------------|
| MVC | Oddělení obav | Struktura modulu |
| Singleton | Jednoinstanční záruka | Databázová připojení |
| Továrna | Abstrakce vytváření objektů | Manipulátory, databáze |
| Pozorovatel | Upozornění na událost | Preloads, notifikace |
| Dekoratér | Rozšíření dynamického chování | Tvarové prvky, filtry |
| Strategie | Výměna algoritmů | Autentizace, validace |
| Adaptér | Kompatibilita rozhraní | Integrace staršího kódu |
| Úložiště | Abstrakce přístupu k datům | Perzistence dat |

## Model-View-Controller (MVC)

Vzor MVC rozděluje aplikaci do tří vzájemně propojených komponent, díky čemuž je kódová základna organizovanější a testovatelnější.

### Architektura

```mermaid
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

### Model (datová vrstva)

```php
<?php
namespace XOOPSModules\MyModule;

class Article extends \XOOPSObject
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

class ArticleHandler extends \XOOPSPersistableObjectHandler
{
    public function __construct(\XOOPSDatabase $db)
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

### Zobrazit (prezentační vrstva)

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

### Řadič (logická vrstva)

```php
<?php
// index.php
require_once dirname(__DIR__, 2) . '/mainfile.php';

use XOOPSModules\MyModule\Helper;

$helper = Helper::getInstance();
$articleHandler = $helper->getHandler('Article');

// Get action from request
$op = \XMF\Request::getString('op', 'list');

switch ($op) {
    case 'view':
        $articleId = \XMF\Request::getInt('id', 0);
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

## Jednobarevný vzor

Vzor Singleton zajišťuje, že třída má pouze jednu instanci a poskytuje k ní globální přístup.

### Kdy použít

- Databázová připojení
- Konfigurační manažeři
- Instance loggeru
- Správci mezipaměti

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

### Příklady jádra XOOPS

```php
<?php
// XOOPSDatabaseFactory uses Singleton pattern
$db = XOOPSDatabaseFactory::getDatabaseConnection();

// XMF Module Helper uses Singleton
$helper = \XMF\Module\Helper::getHelper('mymodule');

// XOOPS main instance
$xoops = \XOOPS::getInstance();
```

## Tovární vzor

Vzor Factory vytváří objekty bez určení jejich přesné třídy, což umožňuje flexibilní vytváření objektů.

### Kdy použít

- Dynamické vytváření handlerů
- Databázová připojení pro různé databáze
- Poskytovatelé autentizace
- Tvorba formulářových prvků

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

### Databázová továrna XOOPS

```php
<?php
class XOOPSDatabaseFactory
{
    public static function getDatabaseConnection()
    {
        static $instance;

        if (!isset($instance)) {
            $dbType = XOOPS_DB_TYPE ?? 'mysql';
            $className = 'XOOPSDatabase' . ucfirst($dbType);

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

## Vzor pozorovatele

Vzor Pozorovatel umožňuje, aby byly objekty upozorňovány na změny stavu subjektu, což umožňuje chování řízené událostmi.

### Kdy použít

- Práce s událostmi
- Notifikační systémy
- Architektury pluginů
- Logování a auditování

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

### Předběžné načtení XOOPS (implementace pozorovatele)

```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XOOPSPreloadItem
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

## Vzor dekorace

Vzor Decorator dynamicky přidává chování objektům, aniž by ovlivnil ostatní objekty stejné třídy.

### Kdy použít

- Přizpůsobení formulářových prvků
- Výstupní formátování
- Kontrola povolení
- Ukládání vrstev do mezipaměti

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

## Vzor strategie

Vzor strategie definuje rodinu algoritmů, každý z nich zapouzdřuje a činí je vzájemně zaměnitelnými.

### Kdy použít

- Více metod ověřování
- Různé třídicí algoritmy
- Různé exportní formáty
- Flexibilní pravidla ověřování

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

## Vzor úložiště

Vzor úložiště poskytuje abstrakční vrstvu mezi logikou přístupu k datům a obchodní logikou.

### Kdy použít

- Komplexní požadavky na přístup k datům
- Více zdrojů dat
- Testovatelné datové vrstvy
- Domain-Driven Design

### Implementace

```php
<?php
namespace XOOPSModules\MyModule\Repository;

use XOOPSModules\MyModule\Entity\Article;

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
    private \XOOPSPersistableObjectHandler $handler;

    public function __construct(\XOOPSPersistableObjectHandler $handler)
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

## Dependency Injection

Dependency Injection (DI) umožňuje vytvářet objekty s jejich závislostmi namísto jejich interního vytváření.

### Výhody

- Vylepšená testovatelnost
- Uvolněná spojka
- Flexibilní konfigurace
- Lepší organizace kódu

### Implementace

```php
<?php
namespace XOOPSModules\MyModule;

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

$container->register('db', fn() => XOOPSDatabaseFactory::getDatabaseConnection());

$container->register('articleHandler', fn($c) =>
    new ArticleHandler($c->resolve('db'))
);

$container->register('articleRepository', fn($c) =>
    new Repository\ArticleRepository($c->resolve('articleHandler'))
);

$container->register('cache', fn() => new FileCache(XOOPS_VAR_PATH . '/caches'));

$container->register('logger', fn() => new XOOPSLogger());

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

## Nejlepší postupy

### Pokyny pro výběr vzoru

1. **Vzory vybírejte na základě skutečných potřeb**, nikoli očekávaných
2. **Zachovejte jednoduchost implementací** – nepřetěžujte
3. **Použití vzoru dokumentu** pro pochopení týmu
4. **V případě potřeby kombinujte vzory** (např. Factory + Singleton)
5. **Při výběru vzorů zvažte testovatelnost**

### Běžné anti-vzorce, kterým je třeba se vyhnout| Anti-vzor | Problém | Řešení |
|--------------|---------|----------|
| Bůh objekt | Třída dělá příliš mnoho | Jediná odpovědnost |
| Kód špaget | Žádná jasná struktura | Použijte vzor MVC |
| Kopírovat-Vložit | Duplikace kódu | Extrahujte společný kód |
| Magická čísla | Nejasné konstanty | Použijte pojmenované konstanty |
| Těsná spojka | Těžko na test/maintain | Použijte Dependency Injection |

### Testovací vzory

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

## Související dokumentace

- [XOOPS-Architecture](XOOPS-Architecture.md) - Celková architektura systému
- [Databázová vrstva](../Database/Database-Layer.md) - Vzorce perzistence dat
- [Bezpečnostní doporučené postupy](../Security/Security-Best-Practices.md) - Bezpečná implementace vzoru

---

#xoops #design-patterns #architecture #mvc #singleton #factory #observer