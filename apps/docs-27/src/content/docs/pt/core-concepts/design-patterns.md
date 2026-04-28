---
title: "Padrões de Design no XOOPS"
description: "Guia abrangente de padrões de design usados no desenvolvimento XOOPS incluindo MVC, Singleton, Factory, Observer e muito mais"
---

<span class="version-badge version-25x">2.5.x ✅</span> <span class="version-badge version-40x">4.0.x ✅</span>

Padrões de design são soluções reutilizáveis para problemas comuns de design de software. XOOPS emprega vários padrões bem estabelecidos que ajudam a manter a qualidade do código, melhorar a testabilidade e aumentar a flexibilidade do sistema.

:::note[Seleção Rápida de Padrão]
Não tem certeza de qual padrão usar? Veja:
- [Escolhendo um Padrão de Acesso a Dados](../../03-Module-Development/Choosing-Data-Access-Pattern.md) — handlers vs repository vs service vs CQRS
- [Escolhendo um Sistema de Eventos](../Choosing-Event-System.md) — preloads vs eventos PSR-14
:::

## Visão Geral

Entender e implementar corretamente os padrões de design é crucial para criar módulos XOOPS mantíveis. Este guia cobre os padrões mais comumente usados no desenvolvimento XOOPS.

| Padrão | Propósito | Casos de Uso Comuns |
|--------|---------|------------------|
| MVC | Separação de responsabilidades | Estrutura do módulo |
| Singleton | Garantia de instância única | Conexões de banco de dados |
| Factory | Abstração de criação de objetos | Manipuladores, banco de dados |
| Observer | Notificação de eventos | Preloads, notificações |
| Decorator | Extensão dinâmica de comportamento | Elementos de formulário, filtros |
| Strategy | Intercâmbio de algoritmos | Autenticação, validação |
| Adapter | Compatibilidade de interface | Integração de código legado |
| Repository | Abstração de acesso a dados | Persistência de dados |

## Model-View-Controller (MVC)

O padrão MVC separa uma aplicação em três componentes interconectados, tornando a base de código mais organizada e testável.

### Arquitetura

```mermaid
flowchart TB
    subgraph MVC["Padrão MVC no XOOPS"]
        Controller["🎮 Controlador<br/>(index.php, admin/index.php)"]
        Model["📦 Modelo<br/>(Manipuladores)"]
        View["🎨 Visualização<br/>(Templates)"]

        Controller --> Model
        Controller --> View
        Model <--> View
    end

    style Controller fill:#e3f2fd,stroke:#1976d2
    style Model fill:#fff3e0,stroke:#f57c00
    style View fill:#e8f5e9,stroke:#388e3c
```

### Modelo (Camada de Dados)

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

### Visualização (Camada de Apresentação)

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

### Controlador (Camada de Lógica)

```php
<?php
// index.php
require_once dirname(__DIR__, 2) . '/mainfile.php';

use XoopsModules\MyModule\Helper;

$helper = Helper::getInstance();
$articleHandler = $helper->getHandler('Article');

// Obter ação da requisição
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

## Padrão Singleton

O padrão Singleton garante que uma classe tenha apenas uma instância e fornece acesso global a ela.

### Quando Usar

- Conexões de banco de dados
- Gerenciadores de configuração
- Instâncias de logger
- Gerenciadores de cache

### Implementação

```php
<?php
namespace XoopsModules\MyModule;

class ConfigurationManager
{
    private static ?self $instance = null;
    private array $config = [];

    private function __construct()
    {
        // Carregar configuração
        $this->loadConfiguration();
    }

    // Prevenir clonagem
    private function __clone() {}

    // Prevenir desserialização
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

// Uso
$config = ConfigurationManager::getInstance();
$itemsPerPage = $config->get('items_per_page');
```

### Exemplos do Core XOOPS

```php
<?php
// XoopsDatabaseFactory usa padrão Singleton
$db = XoopsDatabaseFactory::getDatabaseConnection();

// Helper de Módulo XMF usa Singleton
$helper = \Xmf\Module\Helper::getHelper('mymodule');

// Instância principal do Xoops
$xoops = \Xoops::getInstance();
```

## Padrão Factory

O padrão Factory cria objetos sem especificar sua classe exata, permitindo criação de objetos flexível.

### Quando Usar

- Criando manipuladores dinamicamente
- Conexões de banco de dados para diferentes bancos de dados
- Provedores de autenticação
- Criação de elementos de formulário

### Implementação

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

// Uso
$article = ContentFactory::create('article', ['title' => 'Olá', 'body' => 'Mundo']);
echo $article->render();
```

### Factory de Banco de Dados XOOPS

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

## Padrão Observer

O padrão Observer permite que objetos sejam notificados sobre mudanças no estado de um objeto, permitindo comportamento orientado a eventos.

### Quando Usar

- Tratamento de eventos
- Sistemas de notificação
- Arquiteturas de plugin
- Logging e auditoria

### Implementação

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
            // Enviar notificação por email
            $this->sendEmail($data['article']);
        }
    }

    private function sendEmail($article): void
    {
        $xoopsMailer = xoops_getMailer();
        $xoopsMailer->setSubject('Novo Artigo Publicado: ' . $article->getVar('title'));
        $xoopsMailer->setBody('Um novo artigo foi publicado.');
        $xoopsMailer->send();
    }
}

// Uso
$dispatcher = new EventDispatcher();
$dispatcher->attach('article.published', new EmailNotifier());

// Quando o artigo for publicado
$dispatcher->notify('article.published', ['article' => $article]);
```

### Preloads XOOPS (Implementação Observer)

```php
<?php
// modules/mymodule/preloads/core.php
class MymoduleCorePreload extends XoopsPreloadItem
{
    public static function eventCoreIncludeCommonEnd($args)
    {
        // Reagir ao término da inclusão comum do core
        $GLOBALS['xoopsLogger']->addExtra('MyModule', 'Inicializado');
    }

    public static function eventCoreHeaderEnd($args)
    {
        // Adicionar cabeçalhos personalizados
        $GLOBALS['xoTheme']->addStylesheet('modules/mymodule/assets/css/custom.css');
    }

    public static function eventCoreFooterStart($args)
    {
        // Executar antes do rodapé renderizar
    }
}
```

## Padrão Decorator

O padrão Decorator adiciona comportamento aos objetos dinamicamente sem afetar outros objetos da mesma classe.

### Quando Usar

- Personalização de elementos de formulário
- Formatação de saída
- Verificação de permissão
- Camadas de cache

### Implementação

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

// Uso - decoradores podem ser empilhados
$input = new TextInput('username');
$input = new RequiredDecorator($input);
$input = new LabelDecorator($input, 'Nome de Usuário');
$input = new HelpTextDecorator($input, 'Digite seu nome de usuário');

echo $input->render();
// Saída: <label>Nome de Usuário</label><input type="text" name="username" value=""><span class="required">*</span><small class="help-text">Digite seu nome de usuário</small>
```

## Padrão Strategy

O padrão Strategy define uma família de algoritmos, encapsula cada um e os torna intercambiáveis.

### Quando Usar

- Múltiplos métodos de autenticação
- Diferentes algoritmos de ordenação
- Vários formatos de exportação
- Regras de validação flexíveis

### Implementação

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

// Uso
$authService = new AuthService(new DatabaseAuthStrategy());

// Pode trocar estratégias em tempo de execução
if ($useLdap) {
    $authService->setStrategy(new LdapAuthStrategy('ldap.example.com'));
}

$authenticated = $authService->login($username, $password);
```

## Padrão Repository

O padrão Repository fornece uma camada de abstração entre a lógica de acesso a dados e a lógica de negócio.

### Quando Usar

- Requisitos complexos de acesso a dados
- Múltiplas fontes de dados
- Camadas de dados testáveis
- Design Orientado ao Domínio

### Implementação

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

## Injeção de Dependência

Injeção de Dependência (DI) permite que objetos sejam construídos com suas dependências em vez de criá-las internamente.

### Benefícios

- Melhor testabilidade
- Acoplamento fraco
- Configuração flexível
- Melhor organização de código

### Implementação

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

        // Tentar cache primeiro
        if ($this->cache->has($cacheKey)) {
            $this->logger->debug("Artigo {$id} carregado do cache");
            return $this->cache->get($cacheKey);
        }

        // Carregar do repositório
        $article = $this->repository->find($id);

        if ($article) {
            $this->cache->set($cacheKey, $article, 3600);
            $this->logger->debug("Artigo {$id} carregado do banco de dados");
        }

        return $article;
    }
}

// Configuração do container de serviço
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

// Uso
$articleService = $container->resolve('articleService');
$article = $articleService->getArticle(1);
```

## Boas Práticas

### Diretrizes de Seleção de Padrão

1. **Escolha padrões baseado em necessidades reais**, não em antecipadas
2. **Mantenha implementações simples** - não sobre-engenharia
3. **Documente uso de padrão** para compreensão da equipe
4. **Combine padrões** quando apropriado (por ex., Factory + Singleton)
5. **Considere testabilidade** ao selecionar padrões

### Anti-Padrões Comuns a Evitar

| Anti-Padrão | Problema | Solução |
|--------------|---------|----------|
| God Object | Classe faz muito | Responsabilidade Única |
| Código Espaguete | Sem estrutura clara | Use padrão MVC |
| Copy-Paste | Duplicação de código | Extrair código comum |
| Números Mágicos | Constantes pouco claras | Use constantes nomeadas |
| Acoplamento Forte | Difícil de testar/manter | Use Injeção de Dependência |

### Padrões de Testagem

```php
<?php
// Teste unitário com injeção de dependência
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

## Documentação Relacionada

- [XOOPS-Architecture](XOOPS-Architecture.md) - Arquitetura geral do sistema
- [Database Layer](../Database/Database-Layer.md) - Padrões de persistência de dados
- [Security Best Practices](../Security/Security-Best-Practices.md) - Implementação segura de padrões

---

#xoops #padrões-de-design #arquitetura #mvc #singleton #factory #observer
