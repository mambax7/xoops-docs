---
title: "Паттерны проектирования в XOOPS"
description: "Всестороннее руководство по паттернам проектирования, используемым в разработке XOOPS, включая MVC, Singleton, Factory, Observer и другие"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Паттерны проектирования - это переиспользуемые решения типичных задач проектирования программного обеспечения. XOOPS использует несколько хорошо зарекомендовавших себя паттернов, которые помогают поддерживать качество кода, улучшают тестируемость и повышают гибкость системы.

:::note[Быстрый выбор паттерна]
Не уверены, какой паттерн использовать? Смотрите:
- [Выбор паттерна доступа к данным](../../03-Module-Development/Choosing-Data-Access-Pattern.md) — обработчики vs репозиторий vs сервис vs CQRS
- [Выбор системы событий](../Choosing-Event-System.md) — preloads vs PSR-14 события
:::

## Обзор

Понимание и правильное внедрение паттернов проектирования критически важно для создания поддерживаемых модулей XOOPS. Это руководство охватывает наиболее часто используемые паттерны в разработке XOOPS.

| Паттерн | Назначение | Случаи использования |
|---------|-----------|-------------------|
| MVC | Разделение ответственности | Структура модуля |
| Singleton | Гарантия одного экземпляра | Подключения к БД |
| Factory | Абстракция создания объектов | Обработчики, БД |
| Observer | Уведомление о событиях | Preloads, уведомления |
| Decorator | Динамическое расширение поведения | Элементы формы, фильтры |
| Strategy | Взаимозаменяемость алгоритмов | Аутентификация, валидация |
| Adapter | Совместимость интерфейсов | Интеграция старого кода |
| Repository | Абстракция доступа к данным | Персистентность данных |

## Model-View-Controller (MVC)

Паттерн MVC разделяет приложение на три взаимосвязанные компоненты, делая базу кода более организованной и тестируемой.

### Архитектура

```mermaid
flowchart TB
    subgraph MVC["MVC паттерн в XOOPS"]
        Controller["🎮 Контроллер<br/>(index.php, admin/index.php)"]
        Model["📦 Модель<br/>(Обработчики)"]
        View["🎨 Представление<br/>(Шаблоны)"]

        Controller --> Model
        Controller --> View
        Model <--> View
    end

    style Controller fill:#e3f2fd,stroke:#1976d2
    style Model fill:#fff3e0,stroke:#f57c00
    style View fill:#e8f5e9,stroke:#388e3c
```

### Модель (Слой данных)

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

### Представление (Слой представления)

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

### Контроллер (Слой логики)

```php
<?php
// index.php
require_once dirname(__DIR__, 2) . '/mainfile.php';

use XoopsModules\MyModule\Helper;

$helper = Helper::getInstance();
$articleHandler = $helper->getHandler('Article');

// Получить действие из запроса
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

## Паттерн Singleton

Паттерн Singleton гарантирует, что класс имеет только один экземпляр, и предоставляет глобальный доступ к нему.

### Когда использовать

- Подключения к БД
- Менеджеры конфигурации
- Экземпляры логгера
- Менеджеры кэша

### Реализация

```php
<?php
namespace XoopsModules\MyModule;

class ConfigurationManager
{
    private static ?self $instance = null;
    private array $config = [];

    private function __construct()
    {
        // Загрузить конфигурацию
        $this->loadConfiguration();
    }

    // Запретить клонирование
    private function __clone() {}

    // Запретить десериализацию
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

// Использование
$config = ConfigurationManager::getInstance();
$itemsPerPage = $config->get('items_per_page');
```

### Примеры в ядре XOOPS

```php
<?php
// XoopsDatabaseFactory использует паттерн Singleton
$db = XoopsDatabaseFactory::getDatabaseConnection();

// XMF Module Helper использует Singleton
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// Основной экземпляр Xoops
$xoops = \Xoops::getInstance();
```

## Паттерн Factory

Паттерн Factory создаёт объекты, не указывая их точный класс, позволяя гибко создавать объекты.

### Когда использовать

- Динамическое создание обработчиков
- Подключения к БД для разных БД
- Поставщики аутентификации
- Создание элементов формы

### Реализация

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

// Использование
$article = ContentFactory::create('article', ['title' => 'Hello', 'body' => 'World']);
echo $article->render();
```

### XOOPS Database Factory

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

## Паттерн Observer

Паттерн Observer позволяет объектам быть уведомлёнными об изменениях состояния объекта-субъекта, включая событийное поведение.

### Когда использовать

- Обработка событий
- Системы уведомлений
- Архитектура плагинов
- Логирование и аудит

### Реализация

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
            // Отправить уведомление по электронной почте
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

// Использование
$dispatcher = new EventDispatcher();
$dispatcher->attach('article.published', new EmailNotifier());

// Когда статья опубликована
$dispatcher->notify('article.published', ['article' => $article]);
```

### XOOPS Preloads (реализация Observer)

```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreIncludeCommonEnd($args)
    {
        // Реагировать на завершение ядра common include
        $GLOBALS['xoopsLogger']->addExtra('MyModule', 'Initialized');
    }

    public static function eventCoreHeaderEnd($args)
    {
        // Добавить пользовательские заголовки
        $GLOBALS['xoTheme']->addStylesheet('modules/mymodule/assets/css/custom.css');
    }

    public static function eventCoreFooterStart($args)
    {
        // Выполнить перед рендерингом подвала
    }
}
```

## Паттерн Decorator

Паттерн Decorator динамически добавляет поведение к объектам без влияния на другие объекты того же класса.

### Когда использовать

- Кастомизация элементов формы
- Форматирование вывода
- Проверка разрешений
- Слои кэширования

### Реализация

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

// Использование - декораторы могут быть скомбинированы
$input = new TextInput('username');
$input = new RequiredDecorator($input);
$input = new LabelDecorator($input, 'Username');
$input = new HelpTextDecorator($input, 'Enter your username');

echo $input->render();
// Вывод: <label>Username</label><input type="text" name="username" value=""><span class="required">*</span><small class="help-text">Enter your username</small>
```

## Паттерн Strategy

Паттерн Strategy определяет семейство алгоритмов, инкапсулирует каждый из них и делает их взаимозаменяемыми.

### Когда использовать

- Множество методов аутентификации
- Различные алгоритмы сортировки
- Различные форматы экспорта
- Гибкие правила валидации

### Реализация

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

// Использование
$authService = new AuthService(new DatabaseAuthStrategy());

// Можно переключать стратегии во время выполнения
if ($useLdap) {
    $authService->setStrategy(new LdapAuthStrategy('ldap.example.com'));
}

$authenticated = $authService->login($username, $password);
```

## Паттерн Repository

Паттерн Repository предоставляет слой абстракции между логикой доступа к данным и бизнес-логикой.

### Когда использовать

- Сложные требования доступа к данным
- Множество источников данных
- Тестируемые слои данных
- Domain-Driven Design

### Реализация

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

## Впрыскивание зависимостей

Впрыскивание зависимостей (DI) позволяет конструировать объекты с их зависимостями, вместо создания их внутри.

### Преимущества

- Улучшенная тестируемость
- Слабая связанность
- Гибкая конфигурация
- Лучшая организация кода

### Реализация

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

        // Попробовать кэш в первую очередь
        if ($this->cache->has($cacheKey)) {
            $this->logger->debug("Article {$id} loaded from cache");
            return $this->cache->get($cacheKey);
        }

        // Загрузить из репозитория
        $article = $this->repository->find($id);

        if ($article) {
            $this->cache->set($cacheKey, $article, 3600);
            $this->logger->debug("Article {$id} loaded from database");
        }

        return $article;
    }
}

// Настройка контейнера сервисов
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

// Использование
$articleService = $container->resolve('articleService');
$article = $articleService->getArticle(1);
```

## Лучшие практики

### Рекомендации по выбору паттерна

1. **Выбирайте паттерны на основе реальных потребностей**, а не предполагаемых
2. **Держите реализацию простой** - не переусложняйте
3. **Документируйте использование паттернов** для понимания команды
4. **Комбинируйте паттерны** когда это уместно (например, Factory + Singleton)
5. **Учитывайте тестируемость** при выборе паттернов

### Распространённые антипаттерны, которых следует избежать

| Антипаттерн | Проблема | Решение |
|------------|---------|---------|
| God Object | Класс делает слишком много | Single Responsibility |
| Spaghetti Code | Нет ясной структуры | Используйте паттерн MVC |
| Copy-Paste | Дублирование кода | Извлеките общий код |
| Magic Numbers | Неясные константы | Используйте именованные константы |
| Tight Coupling | Сложно тестировать/поддерживать | Используйте Dependency Injection |

### Тестирование паттернов

```php
<?php
// Модульное тестирование с впрыскиванием зависимостей
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

## Связанная документация

- [Архитектура XOOPS](XOOPS-Architecture.md) - Описание общей архитектуры системы
- [Слой базы данных](../Database/Database-Layer.md) - Паттерны персистентности данных
- [Лучшие практики безопасности](../Security/Security-Best-Practices.md) - Безопасная реализация паттернов

---

#xoops #design-patterns #architecture #mvc #singleton #factory #observer
