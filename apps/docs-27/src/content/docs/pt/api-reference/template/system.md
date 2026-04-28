---
title: "Sistema de Template do XOOPS"
description: "Integração Smarty, classe XoopsTpl, variáveis de template, gerenciamento de tema e renderização de template"
---

O Sistema de Template do XOOPS é construído no poderoso mecanismo de template Smarty, fornecendo uma forma flexível e extensível de separar lógica de apresentação da lógica de negócios. Gerencia temas, renderização de template, atribuição de variável e geração de conteúdo dinâmico.

## Arquitetura de Template

```mermaid
graph TD
    A[XoopsTpl] -->|estende| B[Smarty]
    A -->|gerencia| C[Temas]
    A -->|gerencia| D[Variáveis de Template]
    A -->|manipula| E[Renderização de Bloco]

    C -->|contém| F[Templates]
    C -->|contém| G[CSS/JS]
    C -->|contém| H[Imagens]

    I[Gerenciador de Tema] -->|carrega| C
    I -->|aplica| J[Tema Ativo]
    I -->|configura| K[Caminhos de Template]

    L[Sistema de Bloco] -->|usa| A
    M[Templates de Módulo] -->|usa| A
    N[Templates de Administrador] -->|usa| A
```

## Classe XoopsTpl

A principal classe de mecanismo de template que estende Smarty.

### Visão Geral da Classe

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

### Extensão de Smarty

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

### Métodos Principais

#### getInstance

Obtém a instância de template singleton.

```php
public static function getInstance(): XoopsTpl
```

**Retorna:** `XoopsTpl` - Instância singleton

**Exemplo:**
```php
$xoopsTpl = XoopsTpl::getInstance();
```

#### assign

Atribui uma variável ao template.

```php
public function assign(
    string|array $tplVar,
    mixed $value = null
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$tplVar` | string\|array | Nome da variável ou array associativo |
| `$value` | mixed | Valor da variável |

**Exemplo:**
```php
$xoopsTpl->assign('page_title', 'Welcome');
$xoopsTpl->assign('user_name', 'John Doe');

// Múltiplas atribuições
$xoopsTpl->assign([
    'items' => $items,
    'total_count' => count($items),
    'show_pagination' => true
]);
```

#### appendAssign

Acrescenta valores às variáveis de array de template.

```php
public function appendAssign(
    string $tplVar,
    mixed $value
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$tplVar` | string | Nome da variável |
| `$value` | mixed | Valor a acrescentar |

**Exemplo:**
```php
$xoopsTpl->assign('breadcrumbs', ['Home']);
$xoopsTpl->appendAssign('breadcrumbs', 'Blog');
$xoopsTpl->appendAssign('breadcrumbs', 'Posts');
// breadcrumbs = ['Home', 'Blog', 'Posts']
```

#### getAssignedVars

Obtém todas as variáveis de template atribuídas.

```php
public function getAssignedVars(): array
```

**Retorna:** `array` - Variáveis atribuídas

**Exemplo:**
```php
$vars = $xoopsTpl->getAssignedVars();
foreach ($vars as $name => $value) {
    echo "$name = " . var_export($value, true) . "\n";
}
```

#### display

Renderiza um template e saída para navegador.

```php
public function display(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$resource` | string | Caminho do arquivo de template |
| `$cache_id` | string\|array | Identificador de cache |
| `$compile_id` | string | Identificador de compilação |
| `$parent` | object | Objeto de template pai |

**Exemplo:**
```php
$xoopsTpl->assign('page_title', 'Home');
$xoopsTpl->display('user:index.tpl');

// Com caminho absoluto
$xoopsTpl->display(XOOPS_ROOT_PATH . '/templates/user/index.tpl');
```

#### fetch

Renderiza um template e retorna como string.

```php
public function fetch(
    string $resource,
    string|array $cache_id = null,
    string $compile_id = null,
    object $parent = null
): string
```

**Retorna:** `string` - Conteúdo de template renderizado

**Exemplo:**
```php
$xoopsTpl->assign('message', 'Hello World');
$html = $xoopsTpl->fetch('user:message.tpl');
echo $html;

// Usar para templates de email
$emailContent = $xoopsTpl->fetch('mail:notification.tpl');
mail($to, $subject, $emailContent);
```

#### loadTheme

Carrega um tema específico.

```php
public function loadTheme(string $themeName): bool
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$themeName` | string | Nome do diretório do tema |

**Retorna:** `bool` - Verdadeiro em sucesso

**Exemplo:**
```php
if ($xoopsTpl->loadTheme('bluemoon')) {
    echo "Tema carregado com sucesso";
}
```

#### getCurrentTheme

Obtém o nome do tema ativo atual.

```php
public function getCurrentTheme(): string
```

**Retorna:** `string` - Nome do tema

**Exemplo:**
```php
$currentTheme = $xoopsTpl->getCurrentTheme();
echo "Tema ativo: $currentTheme";
```

#### setOutputFilter

Adiciona um filtro de saída para processar saída de template.

```php
public function setOutputFilter(string $function): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$function` | string | Nome da função de filtro |

**Exemplo:**
```php
// Remover espaçamento em branco da saída
$xoopsTpl->setOutputFilter('trim');

// Filtro personalizado
function my_output_filter($output) {
    // Minificar HTML
    $output = preg_replace('/\s+/', ' ', $output);
    return trim($output);
}
$xoopsTpl->setOutputFilter('my_output_filter');
```

#### registerPlugin

Registra um plugin Smarty personalizado.

```php
public function registerPlugin(
    string $type,
    string $name,
    callable $callback
): void
```

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-------------|
| `$type` | string | Tipo de plugin (modificador, bloco, função) |
| `$name` | string | Nome do plugin |
| `$callback` | callable | Função de callback |

**Exemplo:**
```php
// Registrar modificador personalizado
$xoopsTpl->registerPlugin('modifier', 'markdown', function($text) {
    return markdown_parse($text);
});

// Usar em template: {$content|markdown}

// Registrar tag de bloco personalizado
$xoopsTpl->registerPlugin('block', 'permission', function($params, $content, $smarty, &$repeat) {
    if ($repeat) return;

    // Verificar permissão
    if (has_permission($params['name'])) {
        return $content;
    }
    return '';
});

// Usar em template: {permission name="admin"}...{/permission}
```

## Sistema de Tema

### Estrutura de Tema

Estrutura de diretório de tema XOOPS padrão:

```
bluemoon/
├── style.css              # Folha de estilo principal
├── admin.css              # Folha de estilo de administrador
├── theme.html             # Template de página principal
├── admin.html             # Template de página de administrador
├── blocks/                # Templates de bloco
│   ├── block_left.tpl
│   └── block_right.tpl
├── modules/               # Templates de módulo
│   ├── publisher/
│   │   ├── index.tpl
│   │   └── item.tpl
│   └── news/
│       └── index.tpl
├── images/                # Imagens de tema
│   ├── logo.png
│   └── banner.png
├── js/                    # JavaScript de tema
│   └── script.js
└── readme.txt             # Documentação de tema
```

### Classe Gerenciador de Tema

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

## Variáveis de Template

### Variáveis Globais Padrão

XOOPS atribui automaticamente várias variáveis de template global:

| Variável | Tipo | Descrição |
|----------|------|-------------|
| `$xoops_url` | string | URL de instalação do XOOPS |
| `$xoops_user` | XoopsUser\|null | Objeto de usuário atual |
| `$xoops_uname` | string | Nome de usuário atual |
| `$xoops_isadmin` | bool | Usuário é administrador |
| `$xoops_banner` | string | HTML de banner |
| `$xoops_notification` | string | Marcação de notificação |
| `$xoops_version` | string | Versão do XOOPS |

### Variáveis Específicas de Bloco

Ao renderizar blocos:

| Variável | Tipo | Descrição |
|----------|------|-------------|
| `$block` | array | Informação de bloco |
| `$block.title` | string | Título do bloco |
| `$block.content` | string | Conteúdo do bloco |
| `$block.id` | int | ID do bloco |
| `$block.module` | string | Nome do módulo |

### Variáveis de Template de Módulo

Os módulos normalmente atribuem:

| Variável | Tipo | Descrição |
|----------|------|-------------|
| `$module_name` | string | Nome de exibição do módulo |
| `$module_dir` | string | Diretório do módulo |
| `$xoops_module_header` | string | CSS/JS do módulo |

## Configuração de Smarty

### Modificadores Smarty Comuns

| Modificador | Descrição | Exemplo |
|----------|-------------|---------|
| `capitalize` | Capitalizar primeira letra | `{$title\|capitalize}` |
| `count_characters` | Contagem de caracteres | `{$text\|count_characters}` |
| `date_format` | Formato de timestamp | `{$timestamp\|date_format:'%Y-%m-%d'}` |
| `escape` | Escape de caracteres especiais | `{$html\|escape:'html'}` |
| `nl2br` | Converter quebras de linha para `<br>` | `{$text\|nl2br}` |
| `strip_tags` | Remover tags HTML | `{$content\|strip_tags}` |
| `truncate` | Limitar comprimento de string | `{$text\|truncate:100}` |
| `upper` | Converter para maiúsculas | `{$name\|upper}` |
| `lower` | Converter para minúsculas | `{$name\|lower}` |

### Estruturas de Controle

```smarty
{* Instrução if *}
{if $user->isAdmin()}
    <p>Admin content</p>
{else}
    <p>User content</p>
{/if}

{* Loop for *}
{foreach $items as $item}
    <div class="item">{$item.title}</div>
{/foreach}

{* Loop for com contador *}
{foreach $items as $item name=item_loop}
    {$smarty.foreach.item_loop.iteration}: {$item.title}
{/foreach}

{* Loop while *}
{while $condition}
    <!-- conteúdo -->
{/while}

{* Instrução switch *}
{switch $status}
    {case 'draft'}<span class="draft">Draft</span>{break}
    {case 'published'}<span class="published">Published</span>{break}
    {default}<span class="unknown">Unknown</span>
{/switch}
```

## Exemplo Completo de Template

### Código PHP

```php
<?php
/**
 * Página de Lista de Artigos do Módulo
 */

include __DIR__ . '/include/common.inc.php';

$xoopsTpl = XoopsTpl::getInstance();

// Verificar se módulo está ativo
$module = xoops_getModuleByDirname('articles');
if (!$module) {
    redirect_header(XOOPS_URL, 3, 'Módulo não encontrado');
}

// Obter handler de item
$itemHandler = xoops_getModuleHandler('item', 'articles');

// Obter parâmetros de paginação
$page = !empty($_GET['page']) ? (int)$_GET['page'] : 1;
$perPage = $module->getConfig('items_per_page') ?: 10;
$offset = ($page - 1) * $perPage;

// Construir criteria
$criteria = new CriteriaCompo();
$criteria->add(new Criteria('status', 1));
$criteria->setSort('published', 'DESC');
$criteria->setLimit($perPage);
$criteria->setStart($offset);

// Buscar itens
$items = $itemHandler->getObjects($criteria);
$total = $itemHandler->getCount(new Criteria('status', 1));

// Calcular paginação
$pages = ceil($total / $perPage);

// Atribuir variáveis de template
$xoopsTpl->assign([
    'module_name' => $module->getName(),
    'items' => $items,
    'total_items' => $total,
    'current_page' => $page,
    'total_pages' => $pages,
    'items_per_page' => $perPage,
    'show_pagination' => $pages > 1
]);

// Adicionar breadcrumbs
$xoopsTpl->assign('xoops_breadcrumbs', [
    ['url' => XOOPS_URL, 'title' => 'Home'],
    ['url' => $module->getUrl(), 'title' => $module->getName()],
    ['title' => 'Articles']
]);

// Exibir template
$xoopsTpl->display($module->getPath() . '/templates/user/list.tpl');
```

### Arquivo de Template (list.tpl)

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

        {* Paginação *}
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

## Funções Smarty Personalizadas

### Criar uma Função de Bloco Personalizado

```php
<?php
/**
 * Função de bloco Smarty personalizado para verificação de permissão
 */

function smarty_block_permission($params, $content, $smarty, &$repeat)
{
    if ($repeat) return;

    if (!isset($params['name'])) {
        return 'Nome de permissão necessário';
    }

    $permName = $params['name'];
    $user = $GLOBALS['xoopsUser'];

    // Verificar se o usuário tem permissão
    if ($user && $user->isAdmin()) {
        return $content;
    }

    if ($user && check_user_permission($user->uid(), $permName)) {
        return $content;
    }

    return '';
}
```

Registrar e usar:

```php
$xoopsTpl->registerPlugin('block', 'permission', 'smarty_block_permission');
```

Template:

```smarty
{permission name="edit_articles"}
    <button>Edit Article</button>
{/permission}
```

## Melhores Práticas

1. **Escape de Conteúdo do Usuário** - Sempre use `|escape` para conteúdo gerado pelo usuário
2. **Use Caminhos de Template** - Referencie templates relativo ao tema
3. **Separe Lógica da Apresentação** - Mantenha lógica complexa em PHP
4. **Cache de Templates** - Ative cache de template em produção
5. **Use Modificadores Corretamente** - Aplique filtros apropriados para contexto
6. **Organize Blocos** - Coloque templates de bloco em diretório dedicado
7. **Documente Variáveis** - Documente todas as variáveis de template em PHP

## Documentação Relacionada

- ../Module/Module-System - Sistema de módulo e hooks
- ../Kernel/Kernel-Classes - Kernel e configuração
- ../Core/XoopsObject - Classe base de objetos

---

*Veja também: [Documentação Smarty](https://www.smarty.net/docs) | [API de Template do XOOPS](https://github.com/XOOPS/XoopsCore27/tree/master/htdocs/class)*
